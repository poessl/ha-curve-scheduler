"""Tests for the config and options flow."""

from __future__ import annotations

from homeassistant.config_entries import SOURCE_USER
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
import probatio as vol

from custom_components.curve_scheduler.const import (
    CONF_HOLIDAY_SOURCE,
    CONF_INTERPOLATION,
    CONF_MAX,
    CONF_MIN,
    CONF_STEP,
    CONF_TARGET,
    CONF_THRESHOLD,
    CONF_TICK,
    CONF_UNIT,
    DOMAIN,
)

from .conftest import make_entry, setup_entry

SETTINGS = {
    CONF_TICK: 300,
    CONF_INTERPOLATION: "curve",
    CONF_MIN: 20,
    CONF_MAX: 70,
    CONF_STEP: 0.5,
    CONF_UNIT: "°C",
    CONF_THRESHOLD: 0,
}


async def test_full_flow(hass: HomeAssistant, target: str) -> None:
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": SOURCE_USER})
    assert result["type"] is FlowResultType.FORM
    assert result["step_id"] == "user"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], group_settings({"name": "Zirkulation", CONF_TARGET: target})
    )
    assert result["type"] is FlowResultType.FORM
    assert result["step_id"] == "settings"
    # Defaults come from the target entity.
    schema = {
        str(key): key.default()
        for key in schema_fields(result["data_schema"])
        if key.default is not vol.UNDEFINED
    }
    assert schema[CONF_MIN] == 20.0
    assert schema[CONF_MAX] == 70.0

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], group_settings(SETTINGS)
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["title"] == "Zirkulation"
    assert result["data"] == {"name": "Zirkulation", CONF_TARGET: target}
    assert result["options"][CONF_HOLIDAY_SOURCE] is None
    assert result["options"][CONF_TICK] == 300
    await hass.async_block_till_done()

    # Example profiles were created and the entities exist.
    assert hass.states.get("sensor.zirkulation_setpoint") is not None
    assert hass.states.get("select.zirkulation_mode").attributes["options"] == [
        "auto",
        "Workday",
        "Day off",
    ]


async def test_validation_errors(hass: HomeAssistant, target: str) -> None:
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": SOURCE_USER})
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], group_settings({"name": "  ", CONF_TARGET: target})
    )
    assert result["errors"] == {"name": "name_required"}
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], group_settings({"name": "Puffer", CONF_TARGET: target})
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], group_settings({**SETTINGS, CONF_MIN: 70, CONF_MAX: 20})
    )
    assert result["errors"] == {CONF_MAX: "max_not_greater"}


async def test_duplicate_target_aborts(hass: HomeAssistant, target: str) -> None:
    await setup_entry(hass, make_entry())
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": SOURCE_USER})
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], group_settings({"name": "Noch eins", CONF_TARGET: target})
    )
    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "already_configured"


async def test_options_flow(hass: HomeAssistant, target: str) -> None:
    entry = await setup_entry(hass, make_entry())
    result = await hass.config_entries.options.async_init(entry.entry_id)
    assert result["type"] is FlowResultType.FORM
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], group_settings({"axis_source": "time_of_day"})
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        group_settings(
            {**SETTINGS, CONF_TARGET: target, CONF_TICK: 10, CONF_INTERPOLATION: "linear"}
        ),
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await hass.async_block_till_done()
    assert entry.options[CONF_TICK] == 10
    assert entry.runtime_data.mode == "linear"


async def test_options_flow_rejects_used_target(hass: HomeAssistant, target: str) -> None:
    entry = await setup_entry(hass, make_entry())
    other = await setup_entry(hass, make_entry("input_number.other"))
    result = await hass.config_entries.options.async_init(other.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], group_settings({"axis_source": "time_of_day"})
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], group_settings({**SETTINGS, CONF_TARGET: entry.data[CONF_TARGET]})
    )
    assert result["errors"] == {CONF_TARGET: "target_in_use"}


def group_settings(values):
    if "min_value" not in values:
        return values
    groups = {
        "input": ["input_entity", "x_min", "x_max", "x_step", "x_wrap"],
        "target": ["target_entity", "watch_target", "output_tick_seconds", "write_threshold"],
        "output": ["interpolation", "min_value", "max_value", "step", "unit"],
        "graph": ["x_label_step", "y_label_step"],
    }
    return {
        group: {key: values[key] for key in keys if key in values}
        for group, keys in groups.items()
        if any(key in values for key in keys)
    }


def schema_fields(schema):
    from homeassistant.data_entry_flow import section

    return {
        key: value
        for outer_key, outer_value in schema.schema.items()
        for key, value in (
            outer_value.schema.schema.items()
            if isinstance(outer_value, section)
            else [(outer_key, outer_value)]
        )
    }


def test_settings_sections_keep_related_fields_together():
    from custom_components.curve_scheduler.config_flow import settings_schema

    schema = settings_schema(
        {**SETTINGS, "axis_source": "sensor", "input_entity": "sensor.source"}, True
    )
    groups = {str(key): value for key, value in schema.schema.items()}
    assert list(groups) == ["input", "target", "output", "graph"]
    assert next(map(str, groups["input"].schema.schema)) == "input_entity"
    assert list(map(str, groups["target"].schema.schema))[:2] == ["target_entity", "watch_target"]
