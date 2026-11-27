"""Light target channels, setup, and shared target-writing behavior."""

from typing import Any

from homeassistant.components.light.const import LIGHT_TURN_ON_SCHEMA
from homeassistant.core import HomeAssistant, State
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.util import dt as dt_util
import probatio as vol
import pytest
from pytest_homeassistant.common import MockConfigEntry, async_mock_service

from custom_components.curve_scheduler.config_flow import target_defaults
from custom_components.curve_scheduler.const import CONF_TARGET, CONF_TARGET_ATTRIBUTE, DOMAIN
from custom_components.curve_scheduler.targets import (
    LIGHT_TARGETS,
    light_target_options,
    read_target,
    target_command,
)

from .conftest import entry_options, setup_entry
from .test_config_flow import form_defaults

LIGHT = "light.lamp"
ATTRIBUTES = {
    "supported_color_modes": ["rgbww", "color_temp", "white"],
    "brightness": 102,
    "color_temp_kelvin": 3000,
    "min_color_temp_kelvin": 2200,
    "max_color_temp_kelvin": 6000,
    "hs_color": (120, 75),
    "rgb_color": (10, 20, 30),
    "rgbw_color": (10, 20, 30, 40),
    "rgbww_color": (10, 20, 30, 40, 50),
    "xy_color": (0.25, 0.5),
}


@pytest.mark.parametrize("attribute", list(LIGHT_TARGETS))
def test_light_channel_command_and_readback(attribute: str) -> None:
    state = State(LIGHT, "on", ATTRIBUTES)
    spec = LIGHT_TARGETS[attribute]
    options = {CONF_TARGET_ATTRIBUTE: attribute}
    value = (spec.minimum + spec.maximum) / 2
    service, data, effective = target_command(state, options, value)
    assert service == "turn_on"
    vol.Schema(LIGHT_TURN_ON_SCHEMA)(data)
    if spec.component is not None:
        expected = list(ATTRIBUTES[spec.attribute])
        expected[spec.component] = effective
        assert data == {spec.attribute: expected}
    updated = {**ATTRIBUTES, **data}
    if attribute == "white":
        updated["brightness"] = effective
    assert read_target(State(LIGHT, "on", updated), options) == pytest.approx(effective)


@pytest.mark.parametrize(
    ("modes", "expected"),
    [
        (["onoff"], []),
        (["brightness"], ["brightness_pct", "brightness"]),
        (["color_temp"], ["brightness_pct", "brightness", "color_temp_kelvin"]),
        (["white"], ["brightness_pct", "brightness", "white"]),
    ],
)
def test_light_capabilities_filter_attributes(modes: list, expected: list) -> None:
    assert light_target_options(State(LIGHT, "on", {"supported_color_modes": modes})) == expected


def test_color_capabilities_and_missing_values() -> None:
    options = light_target_options(State(LIGHT, "on", {"supported_color_modes": ["rgbw"]}))
    assert "hs_hue" in options and "xy_x" in options and "rgb_blue" in options
    assert "rgbw_white" in options and "rgbww_warm_white" not in options
    assert "color_temp_kelvin" not in options
    assert light_target_options(None) == list(LIGHT_TARGETS)
    state = State(LIGHT, "off", {})
    for attribute in LIGHT_TARGETS:
        spec = LIGHT_TARGETS[attribute]
        _, data, _ = target_command(state, {CONF_TARGET_ATTRIBUTE: attribute}, spec.minimum)
        if spec.component is not None:
            expected = list(spec.defaults)
            expected[spec.component] = spec.minimum
            assert data == {spec.attribute: expected}
    assert read_target(state, {CONF_TARGET_ATTRIBUTE: "brightness_pct"}) == 0
    assert read_target(state, {CONF_TARGET_ATTRIBUTE: "hs_hue"}) is None


def test_light_commands_clamp_round_and_wrap() -> None:
    state = State(LIGHT, "on", ATTRIBUTES)
    assert target_command(state, {CONF_TARGET_ATTRIBUTE: "color_temp_kelvin"}, 1000)[1] == {
        "color_temp_kelvin": 2200
    }
    assert target_command(state, {CONF_TARGET_ATTRIBUTE: "brightness_pct"}, 200)[1] == {
        "brightness": 255
    }
    assert target_command(state, {CONF_TARGET_ATTRIBUTE: "rgb_red"}, -10)[1] == {
        "rgb_color": [0, 20, 30]
    }
    assert target_command(state, {CONF_TARGET_ATTRIBUTE: "hs_hue"}, 360)[1] == {"hs_color": [0, 75]}


async def light_entry(hass: HomeAssistant, attribute: str, **options: Any) -> MockConfigEntry:
    hass.states.async_set(LIGHT, "on", ATTRIBUTES)
    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Lamp",
        data={"name": "Lamp", CONF_TARGET: LIGHT},
        options=entry_options(
            **{
                **target_defaults(hass, LIGHT, attribute),
                CONF_TARGET_ATTRIBUTE: attribute,
                **options,
            }
        ),
    )
    return await setup_entry(hass, entry)


@pytest.mark.parametrize(
    "attribute", ["brightness_pct", "hs_hue", "rgbw_white", "xy_x", "color_temp_kelvin"]
)
async def test_runtime_writes_selected_control_and_respects_plan_exemption(
    hass: HomeAssistant, attribute: str
) -> None:
    calls = async_mock_service(hass, "light", "turn_on")
    entry = await light_entry(hass, attribute)
    runtime = entry.runtime_data
    assert calls
    expected = target_command(hass.states.get(LIGHT), runtime.options, runtime.current.value)
    assert calls[-1].data == {"entity_id": LIGHT, **expected[1]}
    if attribute == "color_temp_kelvin":
        for entity_id in ("sensor.lamp_setpoint", "sensor.lamp_curve_value"):
            sensor = hass.states.get(entity_id)
            assert sensor.attributes["unit_of_measurement"] == "K"
            assert sensor.attributes.get("device_class") is None
            assert float(sensor.state) == runtime.current.value
    # Simulate the light acknowledging the service call.
    attributes = {**ATTRIBUTES, **expected[1]}
    hass.states.async_set(LIGHT, "on", attributes)
    await hass.async_block_till_done()
    count = len(calls)
    await runtime.async_update()
    assert len(calls) == count
    schedule = runtime.schedule_dict()
    schedule["profiles"]["default"]["apply_target"] = False
    schedule["profiles"]["default"]["points"][0]["v"] = runtime.minimum
    await runtime.async_save_schedule(schedule, runtime.revision)
    assert len(calls) == count
    await hass.config_entries.async_reload(entry.entry_id)
    assert len(calls) == count
    assert entry.runtime_data.config_dict()[CONF_TARGET_ATTRIBUTE] == attribute


async def test_watch_target_captures_only_selected_color_component(hass: HomeAssistant) -> None:
    async_mock_service(hass, "light", "turn_on")
    entry = await light_entry(hass, "hs_hue", watch_target=True)
    runtime = entry.runtime_data
    hass.states.async_set(LIGHT, "on", {**ATTRIBUTES, "hs_color": (120, 50)})
    await hass.async_block_till_done()
    assert runtime.offset == 0
    hass.states.async_set(LIGHT, "on", {**ATTRIBUTES, "hs_color": (130, 50)})
    await hass.async_block_till_done()
    assert runtime.offset == 130 - runtime.compute_at(dt_util.now()).value


async def test_light_setup_defaults_and_independent_attributes(hass: HomeAssistant) -> None:
    async_mock_service(hass, "light", "turn_on")
    hass.states.async_set(LIGHT, "on", ATTRIBUTES)
    for attribute in ("brightness_pct", "color_temp_kelvin", "brightness_pct", "brightness"):
        flow = await hass.config_entries.flow.async_init(DOMAIN, context={"source": "user"})
        flow = await hass.config_entries.flow.async_configure(
            flow["flow_id"], {"name": attribute, CONF_TARGET: LIGHT, "axis_source": "time_of_day"}
        )
        assert flow["step_id"] == "light_target"
        flow = await hass.config_entries.flow.async_configure(
            flow["flow_id"], {CONF_TARGET_ATTRIBUTE: attribute}
        )
        if attribute == "brightness" or (
            attribute == "brightness_pct" and len(hass.config_entries.async_entries(DOMAIN)) == 2
        ):
            assert flow["type"] is FlowResultType.ABORT
            assert flow["reason"] == "already_configured"
            continue
        values = form_defaults(flow)
        defaults = target_defaults(hass, LIGHT, attribute)
        for key in ("min_value", "max_value", "step", "unit"):
            assert values["output"][key] == defaults[key]
        result = await hass.config_entries.flow.async_configure(flow["flow_id"], values)
        assert result["type"] is FlowResultType.CREATE_ENTRY
        assert result["options"][CONF_TARGET_ATTRIBUTE] == attribute
        await hass.async_block_till_done()


async def test_light_options_preserve_and_change_attribute(hass: HomeAssistant) -> None:
    async_mock_service(hass, "light", "turn_on")
    entry = await light_entry(hass, "hs_hue")
    for attribute in ("hs_hue", "hs_saturation"):
        flow = await hass.config_entries.options.async_init(entry.entry_id)
        flow = await hass.config_entries.options.async_configure(
            flow["flow_id"], {"axis_source": "time_of_day"}
        )
        assert flow["step_id"] == "light_target"
        flow = await hass.config_entries.options.async_configure(
            flow["flow_id"], {CONF_TARGET_ATTRIBUTE: attribute}
        )
        result = await hass.config_entries.options.async_configure(
            flow["flow_id"], form_defaults(flow)
        )
        assert result["type"] is FlowResultType.CREATE_ENTRY
        await hass.async_block_till_done()
        assert entry.options[CONF_TARGET_ATTRIBUTE] == attribute
        assert entry.runtime_data.config_dict()[CONF_TARGET_ATTRIBUTE] == attribute


async def test_existing_curve_can_change_to_light_and_clear_target(hass: HomeAssistant) -> None:
    from .conftest import make_entry

    async_mock_service(hass, "light", "turn_on")
    entry = await setup_entry(hass, make_entry(""))
    hass.states.async_set(LIGHT, "on", ATTRIBUTES)
    flow = await hass.config_entries.options.async_init(entry.entry_id)
    flow = await hass.config_entries.options.async_configure(
        flow["flow_id"], {"axis_source": "time_of_day"}
    )
    values = form_defaults(flow)
    values["target"][CONF_TARGET] = LIGHT
    flow = await hass.config_entries.options.async_configure(flow["flow_id"], values)
    assert flow["step_id"] == "light_target"
    flow = await hass.config_entries.options.async_configure(
        flow["flow_id"], {CONF_TARGET_ATTRIBUTE: "hs_saturation"}
    )
    assert form_defaults(flow)["output"]["max_value"] == 100
    result = await hass.config_entries.options.async_configure(flow["flow_id"], form_defaults(flow))
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await hass.async_block_till_done()
    assert entry.data[CONF_TARGET] == LIGHT
    assert entry.options[CONF_TARGET_ATTRIBUTE] == "hs_saturation"
    flow = await hass.config_entries.options.async_init(entry.entry_id)
    flow = await hass.config_entries.options.async_configure(
        flow["flow_id"], {"axis_source": "time_of_day"}
    )
    flow = await hass.config_entries.options.async_configure(
        flow["flow_id"], {CONF_TARGET_ATTRIBUTE: "hs_saturation"}
    )
    values = form_defaults(flow)
    values["target"].pop(CONF_TARGET)
    result = await hass.config_entries.options.async_configure(flow["flow_id"], values)
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await hass.async_block_till_done()
    assert entry.runtime_data.target == ""
    assert CONF_TARGET_ATTRIBUTE not in entry.options


async def test_onoff_light_is_rejected(hass: HomeAssistant) -> None:
    hass.states.async_set(LIGHT, "on", {"supported_color_modes": ["onoff"]})
    flow = await hass.config_entries.flow.async_init(DOMAIN, context={"source": "user"})
    result = await hass.config_entries.flow.async_configure(
        flow["flow_id"], {"name": "On off", CONF_TARGET: LIGHT, "axis_source": "time_of_day"}
    )
    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "light_not_dimmable"
