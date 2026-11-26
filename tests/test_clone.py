"""Whole-curve cloning through config flows and the WebSocket API."""

from copy import deepcopy
from datetime import timedelta

from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
import pytest

from custom_components.curve_scheduler.const import CONF_INITIAL_SCHEDULE, CONF_TARGET, DOMAIN
from custom_components.curve_scheduler.store import create_store

from .conftest import make_entry, setup_entry
from .test_config_flow import SETTINGS


@pytest.mark.parametrize("axis", ["time_of_day", "month_of_year", "sensor"])
async def test_clone_configuration_plans_and_independent_storage(
    hass: HomeAssistant, target: str, axis: str
) -> None:
    hass.states.async_set("sensor.clone_input", "30")
    source = await setup_entry(
        hass,
        make_entry(
            target,
            axis_source=axis,
            input_entity="sensor.clone_input",
            output_tick_seconds=60,
            x_label_step=0,
            y_label_step=5,
        ),
    )
    original = source.runtime_data
    schedule = original.schedule_dict()
    schedule["auto_cleanup"] = True
    schedule["profiles"]["workday"]["color"] = "#123456"
    schedule["activations"] = [
        {"type": "weekday", "days": ["mon", "wed", "fri"], "profile": "day_off"}
    ]
    today = dt_util.now().date()
    schedule["exceptions"] = [
        {
            "id": "trip",
            "from": today.isoformat(),
            "to": (today + timedelta(days=3)).isoformat(),
            "profile": "day_off",
            "note": "Trip",
        }
    ]
    await original.async_save_schedule(schedule, original.revision)
    await original.async_set_override("workday", None)
    snapshot = deepcopy(original.data)
    target_before = hass.states.get(target).state
    result = await hass.config_entries.flow.async_init(
        DOMAIN,
        context={"source": "clone"},
        data={"entry_id": source.entry_id, "name": "Cloned curve"},
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    clone = result["result"]
    await hass.async_block_till_done()
    runtime = clone.runtime_data
    assert clone.entry_id != source.entry_id
    assert clone.unique_id is None
    assert clone.title == "Cloned curve"
    assert clone.data == {**source.data, "name": "Cloned curve"}
    assert clone.options == source.options
    assert CONF_INITIAL_SCHEDULE not in clone.data
    assert runtime.schedule_dict() == original.schedule_dict()
    assert runtime.enabled is False
    assert runtime.data["override"] is None
    assert runtime.revision == 1
    assert original.data == snapshot
    await runtime.async_update(force=True)
    assert hass.states.get(target).state == target_before
    registry = er.async_get(hass)
    assert registry.async_get_entity_id(
        "sensor", DOMAIN, f"{clone.entry_id}_setpoint"
    ) != registry.async_get_entity_id("sensor", DOMAIN, f"{source.entry_id}_setpoint")
    changed = runtime.schedule_dict()
    changed["profiles"]["workday"]["name"] = "Independent plan"
    await runtime.async_save_schedule(changed, runtime.revision)
    assert original.data == snapshot
    await hass.config_entries.async_remove(source.entry_id)
    await hass.config_entries.async_reload(clone.entry_id)
    assert clone.runtime_data.data["profiles"]["workday"]["name"] == "Independent plan"
    assert clone.runtime_data.data["exceptions"][0]["id"] == "trip"
    assert clone.runtime_data.enabled is False
    assert await create_store(hass, clone.entry_id).async_load() is not None


async def test_clone_flow_rejects_missing_source_and_blank_name(hass: HomeAssistant) -> None:
    source = await setup_entry(hass, make_entry(""))
    for entry_id, name, reason in [
        ("missing", "Copy", "entry_not_found"),
        (source.entry_id, "  ", "name_required"),
    ]:
        result = await hass.config_entries.flow.async_init(
            DOMAIN, context={"source": "clone"}, data={"entry_id": entry_id, "name": name}
        )
        assert result["type"] is FlowResultType.ABORT
        assert result["reason"] == reason
    assert len(hass.config_entries.async_entries(DOMAIN)) == 1


async def test_clone_can_keep_target_in_options_but_new_assignments_cannot_reuse_it(
    hass: HomeAssistant, target: str
) -> None:
    source = await setup_entry(hass, make_entry(target))
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": "clone"}, data={"entry_id": source.entry_id, "name": "Copy"}
    )
    clone = result["result"]
    flow = await hass.config_entries.options.async_init(clone.entry_id)
    flow = await hass.config_entries.options.async_configure(
        flow["flow_id"], {"axis_source": "time_of_day"}
    )
    result = await hass.config_entries.options.async_configure(
        flow["flow_id"], {**SETTINGS, CONF_TARGET: target}
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await hass.async_block_till_done()
    assert clone.data[CONF_TARGET] == target
    await hass.config_entries.async_remove(source.entry_id)
    flow = await hass.config_entries.flow.async_init(DOMAIN, context={"source": "user"})
    result = await hass.config_entries.flow.async_configure(
        flow["flow_id"], {"name": "Duplicate target", CONF_TARGET: target}
    )
    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "already_configured"
