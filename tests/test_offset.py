"""Manual target adjustment acceptance tests."""

from homeassistant.core import HomeAssistant

from .conftest import make_entry, setup_entry


async def test_external_adjustment_survives_updates_and_action_clears(
    hass: HomeAssistant, target: str
) -> None:
    entry = await setup_entry(hass, make_entry(watch_target=True))
    runtime = entry.runtime_data
    schedule = runtime.schedule_dict()
    for profile in schedule["profiles"].values():
        profile["points"] = [{"t": "00:00", "v": 45}]
    await runtime.async_save_schedule(schedule, runtime.revision)
    await hass.async_block_till_done()
    assert runtime.offset == 0
    await hass.services.async_call(
        "input_number", "set_value", {"entity_id": target, "value": 48}, blocking=True
    )
    await hass.async_block_till_done()
    assert runtime.offset == 3
    assert hass.states.get("sensor.zirkulation_offset").state == "3.0"
    for profile in schedule["profiles"].values():
        profile["points"] = [{"t": "00:00", "v": 50}]
    await runtime.async_save_schedule(schedule, runtime.revision)
    await hass.async_block_till_done()
    assert float(hass.states.get(target).state) == 53
    assert runtime.offset == 3
    schedule["profiles"]["day_off"]["apply_offset"] = False
    await runtime.async_save_schedule(schedule, runtime.revision)
    await runtime.async_set_override("day_off", None)
    await hass.async_block_till_done()
    assert float(hass.states.get(target).state) == 50
    assert float(hass.states.get("sensor.zirkulation_curve_value").state) == 50
    assert runtime.offset == 3
    await runtime.async_set_override("workday", None)
    await hass.async_block_till_done()
    assert float(hass.states.get(target).state) == 53
    assert float(hass.states.get("sensor.zirkulation_setpoint").state) == 50
    await hass.services.async_call(
        "input_number", "set_value", {"entity_id": target, "value": 49}, blocking=True
    )
    await hass.async_block_till_done()
    assert runtime.offset == -1
    await hass.services.async_call(
        "curve_scheduler", "clear_offset", {"config_entry_id": entry.entry_id}, blocking=True
    )
    await hass.async_block_till_done()
    assert runtime.offset == 0
    assert float(hass.states.get(target).state) == 50


async def test_plan_can_bypass_offset_without_clearing_it(hass: HomeAssistant) -> None:
    from .test_axis import numeric_entry

    entry = await numeric_entry(hass)
    runtime = entry.runtime_data
    runtime.data["offset"] = 3
    schedule = runtime.schedule_dict()
    schedule["profiles"]["workday"]["apply_offset"] = False
    await runtime.async_save_schedule(schedule, runtime.revision)
    await runtime.async_set_override("workday", None)
    assert runtime.adjusted_value(45) == 45
    assert runtime.offset == 3
    await runtime.async_set_override("day_off", None)
    assert runtime.adjusted_value(45) == 48
    assert runtime.offset == 3
    await hass.config_entries.async_reload(entry.entry_id)
    assert entry.runtime_data.data["profiles"]["workday"]["apply_offset"] is False
    assert entry.runtime_data.offset == 3


async def test_watch_ignores_unrelated_attributes_and_recovery(
    hass: HomeAssistant, target: str
) -> None:
    entry = await setup_entry(hass, make_entry(watch_target=True))
    runtime = entry.runtime_data
    state = hass.states.get(target)
    hass.states.async_set(target, state.state, {**state.attributes, "unrelated": 1})
    await hass.async_block_till_done()
    assert runtime.offset == 0
    hass.states.async_set(target, "unavailable")
    await hass.async_block_till_done()
    hass.states.async_set(target, state.state, state.attributes)
    await hass.async_block_till_done()
    assert runtime.offset == 0
    await runtime.async_set_enabled(False)
    hass.states.async_set(target, "49", state.attributes)
    await hass.async_block_till_done()
    assert runtime.offset == 0


async def test_own_delayed_rounded_acknowledgment_keeps_offset(
    hass: HomeAssistant, target: str
) -> None:
    from homeassistant.core import Context

    entry = await setup_entry(hass, make_entry(watch_target=True))
    runtime = entry.runtime_data
    context = Context()
    runtime._write_contexts.append(context.id)
    state = hass.states.get(target)
    hass.states.async_set(target, "47.2", state.attributes, context=Context(parent_id=context.id))
    await hass.async_block_till_done()
    assert runtime.offset == 0
    hass.states.async_set(target, "48", state.attributes)
    await hass.async_block_till_done()
    assert runtime.offset == 48 - runtime.current.value


async def test_climate_watch_uses_setpoint_not_measured_temperature(hass: HomeAssistant) -> None:
    from pytest_homeassistant.common import async_mock_service

    entity = "climate.acceptance"
    async_mock_service(hass, "climate", "set_temperature")
    hass.states.async_set(entity, "heat", {"temperature": 45, "current_temperature": 20})
    entry = await setup_entry(hass, make_entry(entity, watch_target=True))
    runtime = entry.runtime_data
    schedule = runtime.schedule_dict()
    for profile in schedule["profiles"].values():
        profile["points"] = [{"t": "00:00", "v": 45}]
    await runtime.async_save_schedule(schedule, runtime.revision)
    hass.states.async_set(entity, "heat", {"temperature": 45, "current_temperature": 22})
    await hass.async_block_till_done()
    assert runtime.offset == 0
    hass.states.async_set(entity, "heat", {"temperature": 48, "current_temperature": 22})
    await hass.async_block_till_done()
    assert runtime.offset == 3
    hass.states.async_set(entity, "cool", {"temperature": 48, "current_temperature": 22})
    await hass.async_block_till_done()
    assert runtime.offset == 3


async def test_invalid_target_readings_do_not_change_offset(
    hass: HomeAssistant, target: str
) -> None:
    entry = await setup_entry(hass, make_entry(watch_target=True))
    runtime = entry.runtime_data
    for value in ("unknown", "unavailable", "not-a-number", "nan", "inf", "-inf"):
        hass.states.async_set(target, value)
        await hass.async_block_till_done()
        assert runtime.offset == 0


async def test_concurrent_ticks_do_not_recapture_offset(hass: HomeAssistant, target: str) -> None:
    import asyncio

    entry = await setup_entry(hass, make_entry(watch_target=True))
    runtime = entry.runtime_data
    schedule = runtime.schedule_dict()
    for profile in schedule["profiles"].values():
        profile["points"] = [{"t": "00:00", "v": 45}]
    await runtime.async_save_schedule(schedule, runtime.revision)
    await hass.async_block_till_done()
    await hass.services.async_call(
        "input_number", "set_value", {"entity_id": target, "value": 48}, blocking=True
    )
    await hass.async_block_till_done()
    await asyncio.gather(*(runtime.async_update() for _ in range(3)))
    await hass.async_block_till_done()
    assert runtime.offset == 3
    assert float(hass.states.get(target).state) == 48
