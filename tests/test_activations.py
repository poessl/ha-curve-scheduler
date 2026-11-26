"""Ordered plan activation, persistence, migration and validation regressions."""

from copy import deepcopy
from datetime import date
from unittest.mock import patch

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
import pytest

from custom_components.curve_scheduler.model import (
    default_schedule,
    normalize_schedule,
    profile_usages,
    resolve_day,
    validate_schedule,
)

from .conftest import make_entry, setup_entry
from .test_axis import numeric_entry


def test_first_match_exceptions_and_fallback() -> None:
    data = default_schedule(20, 70, 0.5, "en")
    day = date(2026, 11, 26)
    data["activations"] = [
        {"type": "weekday", "days": ["thu"], "profile": "workday"},
        {"type": "holiday", "source": "calendar.holidays", "profile": "day_off"},
    ]

    def holiday(day, source):
        return source == "calendar.holidays"

    assert resolve_day(data, day, holiday).profile_id == "workday"
    data["activations"].reverse()
    assert resolve_day(data, day, holiday).profile_id == "day_off"
    assert normalize_schedule(data)["activations"] == data["activations"]
    assert "activations.0.profile" in profile_usages(data, "day_off")
    data["exceptions"] = [{"from": day.isoformat(), "to": day.isoformat(), "profile": "workday"}]
    assert resolve_day(data, day, holiday).reason == "exception"
    data["exceptions"] = []
    data["activations"] = []
    assert resolve_day(data, day, holiday).profile_id == "workday"


@pytest.mark.parametrize(
    "entries",
    [
        None,
        {},
        [None],
        [{"type": "unknown"}],
        [{"type": "weekday", "day": "bad", "profile": "workday"}],
        [{"type": "holiday", "source": "sensor.bad", "profile": "workday"}],
        [{"type": "weekday", "day": "mon", "profile": "missing"}],
    ],
)
def test_invalid_activations(entries) -> None:
    data = default_schedule(20, 70, 0.5, "en")
    data["activations"] = entries
    assert validate_schedule(data, 20, 70)


async def test_numeric_plans_activate_override_and_survive_reload(hass: HomeAssistant) -> None:
    entry = await numeric_entry(hass)
    runtime = entry.runtime_data
    data = runtime.schedule_dict()
    data["profiles"]["workday"]["curve"] = [{"x": 0, "v": 30}]
    data["profiles"]["day_off"]["curve"] = [{"x": 0, "v": 60}]
    day = dt_util.now().date()
    data["activations"] = [
        {"type": "holiday", "source": "binary_sensor.workday", "profile": "day_off"},
        {
            "type": "weekday",
            "days": [("mon", "tue", "wed", "thu", "fri", "sat", "sun")[day.weekday()]],
            "profile": "workday",
        },
    ]
    hass.states.async_set("binary_sensor.workday", "off")
    await runtime.async_save_schedule(data, runtime.revision)
    assert runtime.current.value == 60
    assert runtime.current.reason == "holiday"
    assert hass.states.get("sensor.zirkulation_profile").state == "Day off"
    hass.states.async_set("binary_sensor.workday", "on")
    await hass.async_block_till_done()
    assert runtime.current.value == 30
    await runtime.async_set_override("day_off", None)
    assert runtime.current.value == 60
    await runtime.async_clear_override()
    await runtime.async_add_exception(day, day, "day_off")
    assert runtime.current.reason == "exception"
    assert runtime.preview(day, None, 5)[0] == [-20, 60]
    await hass.config_entries.async_reload(entry.entry_id)
    assert entry.runtime_data.current.value == 60
    assert entry.runtime_data.data["activations"] == data["activations"]
    reloaded = entry.runtime_data
    await hass.config_entries.async_unload(entry.entry_id)
    assert reloaded._activation_unsub is None


async def test_legacy_schedule_migrates_without_changing_holiday_priority(
    hass: HomeAssistant,
) -> None:
    from custom_components.curve_scheduler.store import ScheduleStore

    legacy = default_schedule(20, 70, 0.5, "en")
    legacy["curve"] = [{"x": 0, "v": 42}]
    with patch.object(ScheduleStore, "async_load", return_value=deepcopy(legacy)):
        entry = await setup_entry(
            hass,
            make_entry(
                "",
                axis_source="sensor",
                input_entity="sensor.input",
                holiday_source="calendar.holidays",
            ),
        )
    data = entry.runtime_data.data
    assert data["activations"][0] == {
        "type": "holiday",
        "source": "calendar.holidays",
        "profile": "day_off",
    }
    assert data["profiles"]["workday"]["curve"] == legacy["curve"]
    assert data["profiles"]["day_off"]["curve"] == legacy["curve"]
    data["profiles"]["day_off"]["curve"][0]["v"] = 50
    assert data["profiles"]["workday"]["curve"][0]["v"] == 42


def test_multiple_weekdays_validation_matching_and_migration() -> None:
    from custom_components.curve_scheduler.store import migrate_data

    data = default_schedule(20, 70, 0.5, "en")
    data["activations"] = [{"type": "weekday", "days": ["mon", "wed", "fri"], "profile": "day_off"}]
    assert validate_schedule(data, 20, 70) == []
    for day, expected in [
        (23, "day_off"),
        (24, "workday"),
        (25, "day_off"),
        (27, "day_off"),
        (28, "workday"),
    ]:
        assert resolve_day(data, date(2026, 11, day), lambda *_: False).profile_id == expected
    for invalid in [[], ["bad"], ["mon", "mon"], "mon", None, [{}]]:
        data["activations"][0]["days"] = invalid
        assert validate_schedule(data, 20, 70)
    data["activations"] = [{"type": "weekday", "day": "thu", "profile": "day_off"}]
    migrate_data(data)
    assert data["activations"][0] == {"type": "weekday", "days": ["thu"], "profile": "day_off"}
    assert migrate_data(data) == data
