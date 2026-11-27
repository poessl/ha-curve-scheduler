"""Tests for the config and options flow."""

from __future__ import annotations

from homeassistant.config_entries import SOURCE_USER
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
import probatio as vol
import pytest

from custom_components.curve_scheduler.config_flow import validate_settings
from custom_components.curve_scheduler.const import (
    CONF_HOLIDAY_SOURCE,
    CONF_INTERPOLATION,
    CONF_MAX,
    CONF_MIN,
    CONF_STEP,
    CONF_TARGET,
    CONF_THRESHOLD,
    CONF_TICK,
    CONF_TICK_UNIT,
    CONF_TICK_VALUE,
    CONF_UNIT,
    DOMAIN,
)

from .conftest import make_entry, setup_entry

SETTINGS = {
    CONF_TICK_VALUE: 300,
    CONF_TICK_UNIT: "seconds",
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
    assert result["data_schema"](form_defaults(result))["output"][CONF_UNIT] == "°C"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], group_settings(SETTINGS)
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["title"] == "Zirkulation"
    assert result["data"] == {"name": "Zirkulation", CONF_TARGET: target}
    assert result["options"][CONF_HOLIDAY_SOURCE] is None
    assert result["options"][CONF_TICK_VALUE] == 300
    assert result["options"][CONF_TICK_UNIT] == "seconds"
    await hass.async_block_till_done()

    # A single fallback plan was created and the entities exist.
    assert hass.states.get("sensor.zirkulation_setpoint") is not None
    assert hass.states.get("select.zirkulation_mode").attributes["options"] == [
        "auto",
        "Default",
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
            {
                **SETTINGS,
                CONF_TARGET: target,
                CONF_TICK_VALUE: 10,
                CONF_INTERPOLATION: "linear",
            }
        ),
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await hass.async_block_till_done()
    assert entry.options[CONF_TICK_VALUE] == 10
    assert entry.runtime_data.mode == "linear"


@pytest.mark.parametrize("unit", ["seconds", "minutes", "hours", "days", "weeks", "months"])
async def test_tick_value_and_unit_roundtrip(hass: HomeAssistant, unit: str) -> None:
    entry = await setup_entry(hass, make_entry("", output_tick=2, output_tick_unit=unit))
    flow = await hass.config_entries.options.async_init(entry.entry_id)
    flow = await hass.config_entries.options.async_configure(
        flow["flow_id"], {"axis_source": "time_of_day"}
    )
    values = form_defaults(flow)
    assert values["output"][CONF_TICK_VALUE] == 2
    assert values["output"][CONF_TICK_UNIT] == unit
    result = await hass.config_entries.options.async_configure(flow["flow_id"], values)
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await hass.async_block_till_done()
    assert entry.options[CONF_TICK_VALUE] == 2
    assert entry.options[CONF_TICK_UNIT] == unit
    assert entry.runtime_data.config_dict()[CONF_TICK_UNIT] == unit


@pytest.mark.parametrize(
    ("legacy", "value", "unit"),
    [({"interval": 7}, 7, "minutes"), ({"output_tick_seconds": 37}, 37, "seconds")],
)
async def test_legacy_tick_settings_migrate_on_save(
    hass: HomeAssistant, legacy: dict, value: float, unit: str
) -> None:
    entry = await setup_entry(hass, make_entry("", **legacy))
    flow = await hass.config_entries.options.async_init(entry.entry_id)
    flow = await hass.config_entries.options.async_configure(
        flow["flow_id"], {"axis_source": "time_of_day"}
    )
    values = form_defaults(flow)
    assert values["output"][CONF_TICK_VALUE] == value
    assert values["output"][CONF_TICK_UNIT] == unit
    result = await hass.config_entries.options.async_configure(flow["flow_id"], values)
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await hass.async_block_till_done()
    assert entry.options[CONF_TICK_VALUE] == value
    assert entry.options[CONF_TICK_UNIT] == unit
    assert CONF_TICK not in entry.options
    assert "interval" not in entry.options


@pytest.mark.parametrize("value", [0, -1, True, "2", None, float("nan"), float("inf"), 1201, 1.5])
def test_invalid_calendar_tick(value: object) -> None:
    assert validate_settings({**SETTINGS, CONF_TICK_VALUE: value, CONF_TICK_UNIT: "months"}) == {
        CONF_TICK_VALUE: "invalid_tick"
    }


def test_invalid_tick_unit() -> None:
    assert validate_settings({**SETTINGS, CONF_TICK_UNIT: "years"}) == {
        CONF_TICK_UNIT: "invalid_tick_unit"
    }


async def test_options_flow_rejects_used_target(hass: HomeAssistant, target: str) -> None:
    entry = await setup_entry(hass, make_entry())
    other = await setup_entry(hass, make_entry("input_number.other"))
    result = await hass.config_entries.options.async_init(other.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], group_settings({"axis_source": "time_of_day"})
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        group_settings({**SETTINGS, CONF_TARGET: entry.data[CONF_TARGET]}),
    )
    assert result["errors"] == {CONF_TARGET: "target_in_use"}


def group_settings(values, *, include_target=True):
    if "min_value" not in values:
        return values
    groups = {
        "input": ["input_entity", "x_min", "x_max", "x_step", "x_wrap", "input_decimals"],
        "output": [
            "output_tick",
            "output_tick_unit",
            "interpolation",
            "min_value",
            "max_value",
            "step",
            "unit",
        ],
        "target": ["target_entity", "watch_target", "write_threshold"],
        "graph": ["x_label_step", "y_label_step"],
    }
    return {
        group: {key: values[key] for key in keys if key in values}
        for group, keys in groups.items()
        if any(key in values for key in keys) and (group != "target" or include_target)
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
    assert list(groups) == ["input", "output", "target", "graph"]
    assert next(map(str, groups["input"].schema.schema)) == "input_entity"
    assert list(map(str, groups["target"].schema.schema))[:2] == [
        "target_entity",
        "watch_target",
    ]


def form_defaults(result):
    """Use the same serialized outer defaults as HA's configuration dialog."""
    from homeassistant.helpers import config_validation as cv

    return {
        field["name"]: field["default"]
        for field in vol.to_field_list(
            result["data_schema"], custom_serializer=cv.custom_serializer
        )
        if "default" in field
    }


async def test_sensor_only_setup_needs_no_manual_settings(hass: HomeAssistant) -> None:
    from homeassistant.helpers import selector

    flow = await hass.config_entries.flow.async_init(DOMAIN, context={"source": SOURCE_USER})
    flow = await hass.config_entries.flow.async_configure(flow["flow_id"], {"name": "Example"})
    defaults = form_defaults(flow)
    assert set(defaults) == {"input", "output", "graph"}
    assert defaults["input"] == {"input_decimals": 2}
    assert defaults["output"][CONF_TICK_VALUE] == 5
    assert defaults["output"][CONF_TICK_UNIT] == "minutes"
    assert defaults["output"][CONF_STEP] == 0.5
    assert defaults["graph"] == {"x_label_step": 0, "y_label_step": 0}
    fields = schema_fields(flow["data_schema"])
    assert isinstance(fields[CONF_UNIT], selector.UnitOfMeasurementSelector)
    assert all(not isinstance(key, vol.Required) for key in fields)
    # Empty sections use their field defaults through HA's backend schema.
    submission = flow["data_schema"]({"output": {}, "graph": {}})
    result = await hass.config_entries.flow.async_configure(flow["flow_id"], submission)
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await hass.async_block_till_done()
    assert result["options"][CONF_THRESHOLD] == 0
    assert result["result"].runtime_data.target == ""
    assert hass.states.get("sensor.example_setpoint").state != "unavailable"


async def test_reopen_settings_preserves_every_value(hass: HomeAssistant, target: str) -> None:
    saved = {
        **SETTINGS,
        "axis_source": "sensor",
        "input_entity": "sensor.outdoor",
        "x_min": -20,
        "x_max": 40,
        "x_step": 0.25,
        "x_wrap": False,
        "output_tick": 37,
        "watch_target": True,
        "write_threshold": 1.25,
        "x_label_step": 10,
        "y_label_step": 5,
        "input_decimals": 2,
    }
    entry = await setup_entry(hass, make_entry(target, **saved))
    before = entry.runtime_data.schedule_dict()
    for _ in range(2):
        flow = await hass.config_entries.options.async_init(entry.entry_id)
        flow = await hass.config_entries.options.async_configure(
            flow["flow_id"], {"axis_source": "sensor"}
        )
        defaults = form_defaults(flow)
        assert defaults == group_settings({**saved, CONF_TARGET: target})
        result = await hass.config_entries.options.async_configure(flow["flow_id"], defaults)
        assert result["type"] is FlowResultType.CREATE_ENTRY
        await hass.async_block_till_done()
        assert entry.data[CONF_TARGET] == target
        assert entry.runtime_data.schedule_dict() == before


async def test_optional_target_and_unit_can_be_cleared(hass: HomeAssistant, target: str) -> None:
    entry = await setup_entry(hass, make_entry(target, watch_target=True))
    flow = await hass.config_entries.options.async_init(entry.entry_id)
    flow = await hass.config_entries.options.async_configure(
        flow["flow_id"], {"axis_source": "time_of_day"}
    )
    defaults = form_defaults(flow)
    defaults["target"].pop(CONF_TARGET)
    defaults["output"][CONF_UNIT] = None
    result = await hass.config_entries.options.async_configure(flow["flow_id"], defaults)
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await hass.async_block_till_done()
    assert entry.runtime_data.target == ""
    assert entry.runtime_data.unit is None


async def test_invalid_settings_keep_form_values(hass: HomeAssistant) -> None:
    flow = await hass.config_entries.flow.async_init(DOMAIN, context={"source": SOURCE_USER})
    flow = await hass.config_entries.flow.async_configure(flow["flow_id"], {"name": "Example"})
    values = form_defaults(flow)
    values["output"].update(min_value=80, max_value=30, unit="custom unit")
    result = await hass.config_entries.flow.async_configure(flow["flow_id"], values)
    assert result["errors"][CONF_MAX] == "max_not_greater"
    assert form_defaults(result) == values


async def test_sensor_only_options_defaults_can_be_submitted(hass: HomeAssistant) -> None:
    entry = await setup_entry(hass, make_entry("", unit=""))
    for _ in range(2):
        flow = await hass.config_entries.options.async_init(entry.entry_id)
        flow = await hass.config_entries.options.async_configure(
            flow["flow_id"], {"axis_source": "time_of_day"}
        )
        defaults = form_defaults(flow)
        assert CONF_TARGET not in defaults["target"]
        result = await hass.config_entries.options.async_configure(flow["flow_id"], defaults)
        assert result["type"] is FlowResultType.CREATE_ENTRY
        await hass.async_block_till_done()
        assert entry.runtime_data.target == ""
        assert entry.runtime_data.unit is None
