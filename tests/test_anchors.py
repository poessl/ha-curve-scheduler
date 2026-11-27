"""Anchor movement and cyclic ordering regressions."""

from custom_components.curve_scheduler.anchors import resolve_positions


def test_partner_movement_and_collision():
    points = [
        {"id": "wake", "anchor": {"entity_id": "input_datetime.alarm"}, "v": 50},
        {"partner_of": "wake", "v": 40},
        {"v": 20},
    ]
    result, errors = resolve_positions(points, [450, 510, 900], {"input_datetime.alarm": 540}, 1440)
    assert not errors
    assert result == [(540, 50), (600, 40), (900, 20)]
    result, errors = resolve_positions(points, [450, 510, 900], {"input_datetime.alarm": 900}, 1440)
    assert not result
    assert errors


def test_missing_source_and_safe_wrap():
    points = [{"id": "a", "anchor": {"entity_id": "datetime.alarm"}, "v": 1}]
    assert resolve_positions(points, [1380], {}, 1440) == ([(1380, 1)], [])
    assert resolve_positions(points, [1380], {"datetime.alarm": 60}, 1440) == ([(60, 1)], [])


def test_independent_groups_and_modes():
    points = [
        {"id": "a", "anchor": {"entity_id": "datetime.a"}, "v": 1},
        {"partner_of": "a", "v": 2},
        {"id": "b", "anchor": {"entity_id": "datetime.b"}, "v": 3},
    ]
    result, errors = resolve_positions(
        points, [60, 120, 600], {"datetime.a": 90, "datetime.b": 660}, 1440
    )
    assert result == [(90, 1), (150, 2), (660, 3)]
    assert not errors
    wrap = [{"v": 0}, {"id": "a", "anchor": {"entity_id": "datetime.a"}, "v": 1}]
    assert not resolve_positions(wrap, [120, 1380], {"datetime.a": 60}, 1440)[1]
    wrap[1]["anchor"]["shift_mode"] = "direct"
    assert resolve_positions(wrap, [120, 1380], {"datetime.a": 60}, 1440)[1]


def test_parse_sources(hass, berlin):
    import pytest

    from custom_components.curve_scheduler.anchors import source_coordinate

    hass.states.async_set("input_datetime.alarm", "07:31:23", {"has_date": False, "has_time": True})
    assert source_coordinate(
        hass.states.get("input_datetime.alarm"), "time_of_day", 0
    ) == pytest.approx(451 + 23 / 60)
    hass.states.async_set(
        "input_datetime.alarm", "2026-11-24", {"has_date": True, "has_time": False}
    )
    assert source_coordinate(hass.states.get("input_datetime.alarm"), "day_of_week", 1.5) == 2.5
    hass.states.async_set("datetime.alarm", "2026-11-24T06:30:00+00:00")
    assert source_coordinate(hass.states.get("datetime.alarm"), "time_of_day", 0) == 450
    hass.states.async_set("datetime.alarm", "bad")
    with pytest.raises(ValueError):
        source_coordinate(hass.states.get("datetime.alarm"), "time_of_day", 0)


async def test_live_collision_fallback_and_repair(hass, berlin, caplog):
    from homeassistant.helpers import issue_registry as ir

    from .conftest import make_entry, setup_entry

    entry = await setup_entry(hass, make_entry(""))
    runtime = entry.runtime_data
    schedule = runtime.schedule_dict()
    for profile in schedule["profiles"].values():
        profile["points"] = [
            {"t": "07:30", "v": 50, "id": "wake", "anchor": {"entity_id": "input_datetime.alarm"}},
            {"t": "08:30", "v": 40},
        ]
    await runtime.async_save_schedule(schedule, runtime.revision)
    revision = runtime.revision
    hass.states.async_set("input_datetime.alarm", "09:00:00", {"has_date": False, "has_time": True})
    await hass.async_block_till_done()
    assert runtime.current.value is None
    assert runtime.state_dict()["curve_errors"]
    issue_id = f"anchors_{entry.entry_id}"
    assert ir.async_get(hass).async_get_issue("curve_scheduler", issue_id)
    hass.states.async_set("input_datetime.alarm", "broken", {"has_date": False, "has_time": True})
    await hass.async_block_till_done()
    assert runtime.current.value is not None
    assert "using saved positions" in caplog.text
    warnings = [r for r in caplog.records if "using saved positions" in r.message]
    assert len(warnings) == 1
    await runtime.async_update()
    assert len([r for r in caplog.records if "using saved positions" in r.message]) == 1
    assert not ir.async_get(hass).async_get_issue("curve_scheduler", issue_id)
    assert runtime.revision == revision
    assert runtime.schedule_dict() == schedule
    await hass.config_entries.async_unload(entry.entry_id)


async def test_weekly_date_only_groups_preview_and_restart(hass, berlin):
    from datetime import date

    import pytest

    from .conftest import make_entry, setup_entry

    entry = await setup_entry(hass, make_entry("", axis_source="day_of_week"))
    runtime = entry.runtime_data
    schedule = runtime.schedule_dict()
    for profile in schedule["profiles"].values():
        profile["curve"] = [
            {"x": 1.25, "v": 50, "id": "wake", "anchor": {"entity_id": "input_datetime.alarm"}},
            {"x": 1.5, "v": 40, "partner_of": "wake"},
            {"x": 6, "v": 30},
        ]
    await runtime.async_save_schedule(schedule, runtime.revision)
    hass.states.async_set(
        "input_datetime.alarm", "2026-11-24", {"has_date": True, "has_time": False}
    )
    await hass.async_block_till_done()
    assert runtime.resolved_profile("workday") == [(2.25, 50), (2.5, 40), (6, 30)]
    preview = await runtime.async_preview(date(2026, 11, 24), None, 5)
    assert preview
    hass.states.async_set(
        "input_datetime.alarm", "2026-11-25", {"has_date": True, "has_time": False}
    )
    await hass.async_block_till_done()
    assert runtime.resolved_profile("workday")[0][0] == pytest.approx(3.25)
    await hass.config_entries.async_reload(entry.entry_id)
    assert entry.runtime_data.schedule_dict() == schedule
    assert entry.runtime_data.resolved_profile("workday")[0][0] == pytest.approx(3.25)


def test_metadata_validation_and_dst(hass, berlin):
    import pytest

    from custom_components.curve_scheduler.anchors import source_coordinate
    from custom_components.curve_scheduler.model import validate_anchors

    for points in (
        [{"partner_of": "missing"}],
        [{"id": "a", "anchor": {"entity_id": "switch.bad"}}],
        [{"id": "a"}, {"id": "a"}],
        [{"id": "a", "anchor": {"entity_id": "datetime.a"}, "partner_of": "a"}],
    ):
        assert validate_anchors(points, "points")
    # Both instances of the autumn repeated hour have the same wall-clock X.
    for timestamp in ("2026-10-25T00:30:00+00:00", "2026-10-25T01:30:00+00:00"):
        hass.states.async_set("datetime.alarm", timestamp)
        assert source_coordinate(hass.states.get("datetime.alarm"), "time_of_day", 0) == 150
    hass.states.async_set("datetime.alarm", "2026-03-29T01:30:00+00:00")
    assert source_coordinate(hass.states.get("datetime.alarm"), "time_of_day", 0) == 210
    points = [{"id": "a", "anchor": {"entity_id": "datetime.a"}, "v": 1}]
    assert resolve_positions(points, [1.25], {"datetime.a": 7.25}, 7, 1)[0] == [(7.25, 1)]
    assert resolve_positions(points, [0], {"datetime.a": 720}, 1440)[0] == [(720, 1)]
    assert source_coordinate(None, "time_of_day", 0) is None
    hass.states.async_set("datetime.alarm", "unknown")
    assert source_coordinate(hass.states.get("datetime.alarm"), "time_of_day", 0) is None
    hass.states.async_set("datetime.alarm", "bad")
    with pytest.raises(ValueError):
        source_coordinate(hass.states.get("datetime.alarm"), "day_of_week", 0)


async def test_collision_stops_target_and_preview_has_no_side_effects(hass, berlin, target, caplog):
    from datetime import date

    from homeassistant.helpers import issue_registry as ir
    import pytest
    from pytest_homeassistant.common import async_mock_service

    from custom_components.curve_scheduler.model import ScheduleValidationError

    from .conftest import TARGET, make_entry, setup_entry

    entry = await setup_entry(hass, make_entry())
    runtime = entry.runtime_data
    document = runtime.schedule_dict()
    for profile in document["profiles"].values():
        profile["points"] = [
            {"t": "07:30", "v": 50, "id": "wake", "anchor": {"entity_id": "input_datetime.alarm"}},
            {"t": "08:30", "v": 40},
        ]
    hass.states.async_set("input_datetime.alarm", "09:00:00", {"has_date": False, "has_time": True})
    await hass.async_block_till_done()
    caplog.clear()
    with pytest.raises(ScheduleValidationError):
        await runtime.async_preview(date(2026, 11, 27), document, 5)
    assert not ir.async_get(hass).async_get_issue("curve_scheduler", f"anchors_{entry.entry_id}")
    assert "unavailable" not in caplog.text
    calls = async_mock_service(hass, "input_number", "set_value")
    before = hass.states.get(TARGET).state
    await runtime.async_save_schedule(document, runtime.revision)
    await runtime.async_update(force=True)
    assert calls == []
    assert hass.states.get(TARGET).state == before
    assert hass.states.get("sensor.zirkulation_setpoint").state == "unavailable"
    assert len([r for r in caplog.records if "Curve Zirkulation unavailable" in r.message]) == 1
    assert runtime.current.next_point_time is None
    hass.states.async_set("input_datetime.alarm", "08:00:00", {"has_date": False, "has_time": True})
    await hass.async_block_till_done()
    assert runtime.current.value is not None
    assert calls


def test_precise_next_point_timestamp(berlin):
    from datetime import date

    from custom_components.curve_scheduler.runtime import local_datetime

    assert (
        local_datetime(date(2026, 11, 27), 450 + 23 / 60).isoformat() == "2026-11-27T07:30:23+01:00"
    )


async def test_sensor_anchor_updates_and_unusable_values(hass, berlin, caplog):
    from custom_components.curve_scheduler.anchors import source_coordinate

    from .conftest import make_entry, setup_entry

    entry = await setup_entry(hass, make_entry(""))
    runtime = entry.runtime_data
    schedule = runtime.schedule_dict()
    for profile in schedule["profiles"].values():
        profile["points"] = [
            {"t": "07:30", "v": 50, "id": "wake", "anchor": {"entity_id": "sensor.next_alarm"}},
            {"t": "08:30", "v": 40, "partner_of": "wake"},
        ]
    await runtime.async_save_schedule(schedule, runtime.revision)
    hass.states.async_set(
        "sensor.next_alarm", "2026-11-28T08:00:00+00:00", {"device_class": "timestamp"}
    )
    await hass.async_block_till_done()
    assert runtime.resolved_profile("workday") == [(540, 50), (600, 40)]
    hass.states.async_set("sensor.next_alarm", "10:00:00")
    await hass.async_block_till_done()
    assert runtime.resolved_profile("workday") == [(600, 50), (660, 40)]
    hass.states.async_set("sensor.next_alarm", "2026-11-24")
    await hass.async_block_till_done()
    assert source_coordinate(hass.states.get("sensor.next_alarm"), "day_of_week", 1.25) == 2.25
    assert runtime.resolved_profile("workday") == [(450, 50), (510, 40)]
    hass.states.async_set("sensor.next_alarm", "bad timestamp")
    await hass.async_block_till_done()
    assert runtime.resolved_profile("workday") == [(450, 50), (510, 40)]
    assert "using saved positions" in caplog.text
    hass.states.async_set("sensor.next_alarm", "unavailable")
    await hass.async_block_till_done()
    assert runtime.current.value is not None


def test_point_positions_preserve_identity_when_wrapping_equal_values():
    points = [
        {"partner_of": "wake", "v": 40},
        {"id": "wake", "anchor": {"entity_id": "datetime.alarm"}, "v": 40},
    ]
    positions, errors = resolve_positions(
        points, [30, 1410], {"datetime.alarm": 30}, 1440, sort_result=False
    )
    assert not errors
    assert positions == [(90, 40), (30, 40)]
    assert resolve_positions(points, [30, 1410], {"datetime.alarm": 30}, 1440)[0] == [
        (30, 40),
        (90, 40),
    ]
