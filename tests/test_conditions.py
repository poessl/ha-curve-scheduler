"""Native condition compatibility checks."""

from copy import deepcopy

from homeassistant.core import HomeAssistant

from custom_components.curve_scheduler.conditions import async_compile_condition


async def test_native_group_state_and_attribute(hass: HomeAssistant) -> None:
    config = {
        "condition": "and",
        "conditions": [
            {"condition": "state", "entity_id": "sensor.mode", "state": "home"},
            {
                "condition": "state",
                "entity_id": "climate.room",
                "attribute": "temperature",
                "state": 21,
            },
        ],
    }
    original = deepcopy(config)
    hass.states.async_set("sensor.mode", "home")
    hass.states.async_set("climate.room", "heat", {"temperature": 21})
    checker, entities = await async_compile_condition(hass, config)
    assert entities == {"sensor.mode", "climate.room"}
    assert checker(hass)
    hass.states.async_set("climate.room", "heat", {"temperature": 22})
    assert not checker(hass)
    assert config == original


def test_condition_activation_roundtrip_and_priority() -> None:
    from datetime import date

    from custom_components.curve_scheduler.model import (
        default_schedule,
        normalize_schedule,
        resolve_day,
        validate_schedule,
    )

    data = default_schedule(20, 70, 0.5, "en")
    config = {"condition": "state", "entity_id": "sensor.mode", "state": "home"}
    data["activations"] = [
        {"type": "condition", "condition": config, "profile": "day_off"},
        {"type": "weekday", "days": ["thu"], "profile": "workday"},
    ]
    assert not validate_schedule(data, 20, 70)
    normalized = normalize_schedule(data)
    assert normalized["activations"] == data["activations"]
    normalized["activations"][0]["condition"]["state"] = "away"
    assert config["state"] == "home"
    day = date(2026, 11, 26)
    assert resolve_day(data, day, lambda *_: False, lambda _: True).profile_id == "day_off"
    assert resolve_day(data, day, lambda *_: False, lambda _: False).profile_id == "workday"


async def test_runtime_condition_live_reload_and_invalid_save(hass: HomeAssistant) -> None:
    import pytest

    from custom_components.curve_scheduler.model import ScheduleValidationError

    from .test_axis import numeric_entry

    hass.states.async_set("climate.room", "heat", {"temperature": 21})
    entry = await numeric_entry(hass)
    runtime = entry.runtime_data
    data = runtime.schedule_dict()
    data["profiles"]["workday"]["curve"] = [{"x": 0, "v": 30}]
    data["profiles"]["day_off"]["curve"] = [{"x": 0, "v": 60}]
    data["activations"] = [
        {
            "type": "condition",
            "profile": "day_off",
            "condition": {
                "condition": "state",
                "entity_id": "climate.room",
                "attribute": "temperature",
                "state": 21,
            },
        }
    ]
    await runtime.async_save_schedule(data, runtime.revision)
    assert runtime.current.value == 60
    hass.states.async_set("climate.room", "heat", {"temperature": 22})
    await hass.async_block_till_done()
    assert runtime.current.value == 30
    invalid = deepcopy(data)
    invalid["activations"][0]["condition"] = {"condition": "nonexistent"}
    with pytest.raises(ScheduleValidationError):
        await runtime.async_save_schedule(invalid, runtime.revision)
    assert runtime.data["activations"] == data["activations"]
    await hass.config_entries.async_reload(entry.entry_id)
    runtime = entry.runtime_data
    hass.states.async_set("climate.room", "heat", {"temperature": 21})
    await hass.async_block_till_done()
    assert runtime.current.value == 60
    await hass.config_entries.async_unload(entry.entry_id)
    assert not runtime._conditions


async def test_offset_is_shared_persisted_and_clearable(hass: HomeAssistant) -> None:
    from .test_axis import numeric_entry

    entry = await numeric_entry(hass)
    runtime = entry.runtime_data
    runtime.data["offset"] = 3.0
    await runtime._async_persist()
    assert runtime.adjusted_value(45) == 48
    assert runtime.adjusted_value(50) == 53
    assert runtime.adjusted_value(69) == 70
    assert runtime.adjusted_value(None) is None
    await hass.config_entries.async_reload(entry.entry_id)
    runtime = entry.runtime_data
    assert runtime.offset == 3
    await runtime.async_clear_offset()
    assert runtime.offset == 0
    await hass.config_entries.async_reload(entry.entry_id)
    assert entry.runtime_data.offset == 0


async def test_native_composition_with_calendar_adapters(hass: HomeAssistant) -> None:
    from datetime import date

    from custom_components.curve_scheduler.conditions import async_compile_schedule_condition

    hass.states.async_set("sensor.mode", "home")
    checker, entities = await async_compile_schedule_condition(
        hass,
        {
            "condition": "and",
            "conditions": [
                {"condition": "state", "entity_id": "sensor.mode", "state": "home"},
                {
                    "condition": "or",
                    "conditions": [
                        {"condition": "curve_scheduler_weekday", "days": ["thu"]},
                        {"condition": "curve_scheduler_holiday", "source": "calendar.holidays"},
                    ],
                },
            ],
        },
    )
    assert checker.matches(date(2026, 11, 26), lambda *_: False)
    assert not checker.matches(date(2026, 11, 27), lambda *_: False)
    assert checker.matches(date(2026, 11, 27), lambda *_: True)
    assert entities == {"sensor.mode", "calendar.holidays"}
    checker.async_unload()


async def test_unsaved_preview_conditions_do_not_replace_live_checkers(hass: HomeAssistant) -> None:
    from homeassistant.util import dt as dt_util

    from .test_axis import numeric_entry

    entry = await numeric_entry(hass)
    runtime = entry.runtime_data
    data = runtime.schedule_dict()
    data["profiles"]["workday"]["curve"] = [{"x": 0, "v": 30}]
    data["profiles"]["day_off"]["curve"] = [{"x": 0, "v": 60}]
    data["activations"] = [
        {
            "type": "condition",
            "profile": "day_off",
            "condition": {
                "condition": "state",
                "entity_id": "sensor.mode",
                "state": "home",
            },
        }
    ]
    hass.states.async_set("sensor.mode", "away")
    await runtime.async_save_schedule(data, runtime.revision)
    live = runtime._conditions[0]
    draft = deepcopy(data)
    draft["activations"][0]["condition"]["state"] = "away"
    preview = await runtime.async_preview(dt_util.now().date(), draft, 5)
    assert preview[0][1] == 60
    assert runtime.current.value == 30
    assert runtime._conditions[0] is live
    assert not live.matches(dt_util.now().date(), lambda *_: False)


async def test_native_typed_attributes_and_missing_entity(hass: HomeAssistant) -> None:
    for expected in [True, False, 21, "21"]:
        hass.states.async_set("sensor.attribute", "ready", {"value": expected})
        checker, _ = await async_compile_condition(
            hass,
            {
                "condition": "state",
                "entity_id": "sensor.attribute",
                "attribute": "value",
                "state": expected,
            },
        )
        assert checker.async_check()
        hass.states.async_set("sensor.attribute", "ready", {})
        assert not checker.async_check()
        hass.states.async_remove("sensor.attribute")
        from homeassistant.exceptions import ConditionError
        import pytest

        with pytest.raises(ConditionError):
            checker.async_check()
        checker.async_unload()


async def test_state_and_weekday_require_both_and_expose_fallback(hass: HomeAssistant) -> None:
    from datetime import date

    from custom_components.curve_scheduler.conditions import async_compile_schedule_condition
    from custom_components.curve_scheduler.model import default_schedule, resolve_day

    config = {
        "condition": "and",
        "conditions": [
            {"condition": "state", "entity_id": "sensor.value", "state": "5"},
            {"condition": "curve_scheduler_weekday", "days": ["mon", "tue", "wed", "thu", "fri"]},
        ],
    }
    checker, _ = await async_compile_schedule_condition(hass, config)
    data = default_schedule(20, 70, 0.5, "en")
    data["activations"] = [{"type": "condition", "profile": "workday", "condition": config}]
    friday = date(2026, 11, 27)
    hass.states.async_set("sensor.value", "4")
    assert not checker.matches(friday, lambda *_: False)
    resolved = resolve_day(
        data, friday, lambda *_: False, lambda _: checker.matches(friday, lambda *_: False)
    )
    assert resolved.profile_id == "workday"  # Same plan, but selected by fallback.
    assert resolved.reason == "fallback"
    hass.states.async_set("sensor.value", "5")
    assert checker.matches(friday, lambda *_: False)
    assert not checker.matches(date(2026, 11, 28), lambda *_: False)
    hass.states.async_set("sensor.value", "5.0")
    assert not checker.matches(friday, lambda *_: False)  # State is exact text.
    checker.async_unload()


async def test_native_numeric_bounds_are_exclusive(hass: HomeAssistant) -> None:
    checker, entities = await async_compile_condition(
        hass,
        {
            "condition": "numeric_state",
            "entity_id": "sensor.value",
            "above": 4,
            "below": 6,
        },
    )
    assert entities == {"sensor.value"}
    for state, expected in [("4", False), ("5", True), ("5.0", True), ("6", False)]:
        hass.states.async_set("sensor.value", state)
        assert checker.async_check() is expected
    checker.async_unload()


async def test_month_checkboxes_compose_with_native_time(hass: HomeAssistant, freezer) -> None:
    from datetime import date

    from custom_components.curve_scheduler.conditions import async_compile_schedule_condition

    await hass.config.async_set_time_zone("Europe/Berlin")
    checker, _ = await async_compile_schedule_condition(
        hass,
        {
            "condition": "and",
            "conditions": [
                {"condition": "curve_scheduler_month", "months": [11, 12]},
                {"condition": "time", "after": "22:00:00", "before": "06:00:00"},
            ],
        },
    )
    freezer.move_to("2026-11-27T22:00:00+01:00")
    assert checker.matches(date(2026, 11, 27), lambda *_: False)
    assert not checker.matches(date(2026, 10, 27), lambda *_: False)
    freezer.move_to("2026-11-28T05:59:59+01:00")
    assert checker.matches(date(2026, 11, 28), lambda *_: False)
    freezer.move_to("2026-11-28T06:00:00+01:00")
    assert not checker.matches(date(2026, 11, 28), lambda *_: False)
    checker.async_unload()
