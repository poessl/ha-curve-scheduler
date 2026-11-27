"""Cadence compatibility, calendar arithmetic, and one-shot scheduling."""

from datetime import datetime, timedelta
from unittest.mock import patch
from zoneinfo import ZoneInfo

from freezegun.api import FrozenDateTimeFactory
from homeassistant.core import HomeAssistant
from homeassistant.helpers.event import async_track_point_in_utc_time
from homeassistant.util import dt as dt_util
import pytest
from pytest_homeassistant.common import async_fire_time_changed

from custom_components.curve_scheduler.cadence import next_tick, tick_settings

from .conftest import make_entry, setup_entry

BERLIN = ZoneInfo("Europe/Berlin")


@pytest.mark.parametrize(
    ("options", "expected"),
    [
        ({}, (5, "minutes")),
        ({"interval": 7}, (7, "minutes")),
        ({"interval": 7, "output_tick_seconds": 1.5}, (1.5, "seconds")),
        (
            {"output_tick_seconds": 300, "output_tick": 2, "output_tick_unit": "months"},
            (2, "months"),
        ),
    ],
)
def test_tick_settings_preserve_legacy_intervals(options: dict, expected: tuple) -> None:
    assert tick_settings(options) == expected


@pytest.mark.parametrize(
    ("start", "now", "value", "unit", "expected"),
    [
        ("2026-01-31T12:00", "2026-01-31T12:00", 1.5, "seconds", "2026-01-31T12:00:01.500000"),
        ("2026-01-31T12:00", "2026-01-31T12:07", 2, "minutes", "2026-01-31T12:08"),
        ("2026-01-31T12:00", "2026-01-31T17:00", 2, "hours", "2026-01-31T18:00"),
        ("2026-03-28T12:00", "2026-03-28T12:00", 1, "days", "2026-03-29T12:00"),
        ("2026-10-24T12:00", "2026-10-24T12:00", 1, "days", "2026-10-25T12:00"),
        ("2026-03-22T12:00", "2026-03-22T12:00", 1, "weeks", "2026-03-29T12:00"),
        ("2026-03-28T02:30", "2026-03-28T02:30", 1, "days", "2026-03-29T03:30"),
        ("2026-03-28T02:30", "2026-03-29T03:30", 1, "days", "2026-03-30T02:30"),
        ("2026-01-31T12:00", "2026-01-31T12:00", 1, "months", "2026-02-28T12:00"),
        ("2026-01-31T12:00", "2026-02-28T12:00", 1, "months", "2026-03-31T12:00"),
        ("2028-01-31T12:00", "2028-01-31T12:00", 1, "months", "2028-02-29T12:00"),
        ("2026-11-30T12:00", "2026-11-30T12:00", 3, "months", "2027-02-28T12:00"),
        ("2026-01-31T12:00", "2028-06-15T12:00", 2, "months", "2028-07-31T12:00"),
    ],
)
def test_next_tick(start: str, now: str, value: float, unit: str, expected: str) -> None:
    def local(value: str) -> datetime:
        return datetime.fromisoformat(value).replace(tzinfo=BERLIN)

    assert next_tick(local(start), local(now), value, unit) == dt_util.as_utc(local(expected))


@pytest.mark.parametrize("unit", ["seconds", "minutes", "hours", "days", "weeks", "months"])
async def test_only_next_tick_is_scheduled_and_unload_cancels_it(
    hass: HomeAssistant, berlin: None, freezer: FrozenDateTimeFactory, unit: str
) -> None:
    freezer.move_to("2026-01-31T12:00:00+01:00")
    with patch(
        "custom_components.curve_scheduler.runtime.async_track_point_in_utc_time",
        wraps=async_track_point_in_utc_time,
    ) as timer:
        entry = await setup_entry(hass, make_entry("", output_tick=2, output_tick_unit=unit))
        runtime = entry.runtime_data
        assert timer.call_count == 1
        first_due = timer.call_args.args[2]
        subscriptions = len(runtime._unsubs)
        # User actions update immediately without moving the scheduled tick.
        await runtime.async_update(force=True)
        assert timer.call_count == 1
        notifications = []
        runtime.async_add_listener(lambda: notifications.append(runtime.current.value))
        freezer.move_to(first_due - timedelta(seconds=1))
        async_fire_time_changed(hass)
        await hass.async_block_till_done()
        assert notifications == []
        freezer.move_to(first_due)
        async_fire_time_changed(hass)
        await hass.async_block_till_done()
        assert len(notifications) == 1
        assert timer.call_count == 2
        assert len(runtime._unsubs) == subscriptions
        # A late callback performs one update, then schedules a future tick.
        freezer.move_to(first_due + timedelta(days=400))
        async_fire_time_changed(hass)
        await hass.async_block_till_done()
        assert len(notifications) == 2
        assert timer.call_count == 3
        assert timer.call_args.args[2] > dt_util.utcnow()
        assert len(runtime._unsubs) == subscriptions
        next_due = timer.call_args.args[2]
        await hass.config_entries.async_unload(entry.entry_id)
        assert runtime._tick_unsub is None
        freezer.move_to(next_due)
        async_fire_time_changed(hass)
        await hass.async_block_till_done()
        assert len(notifications) == 2
        assert timer.call_count == 3
