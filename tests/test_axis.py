"""Numeric axes, independent output sampling, and optional target regressions."""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any

from freezegun.api import FrozenDateTimeFactory
from homeassistant.config_entries import SOURCE_USER
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.util import dt as dt_util
import pytest
from pytest_homeassistant_custom_component.common import async_fire_time_changed

from custom_components.curve_scheduler.axis import axis_config, evaluate_curve, input_value
from custom_components.curve_scheduler.const import DOMAIN
from custom_components.curve_scheduler.model import ScheduleValidationError

from .conftest import make_entry, setup_entry
from .test_config_flow import SETTINGS

SENSOR_OPTIONS = {
    "axis_source": "sensor",
    "input_entity": "sensor.outdoor_temperature",
    "x_min": -20,
    "x_max": 40,
    "x_step": 0.1,
    "x_wrap": False,
    "output_tick_seconds": 10,
    "interpolation": "linear",
}


async def numeric_entry(hass: HomeAssistant, **options: Any) -> Any:
    hass.states.async_set("sensor.outdoor_temperature", "10")
    entry = await setup_entry(hass, make_entry("", **{**SENSOR_OPTIONS, **options}))
    runtime = entry.runtime_data
    schedule = runtime.schedule_dict()
    for profile in schedule["profiles"].values():
        profile["curve"] = [{"x": -20, "v": 70}, {"x": 40, "v": 20}]
    await runtime.async_save_schedule(schedule, runtime.revision)
    return entry


async def test_optional_target_flow(hass: HomeAssistant) -> None:
    for name in ("First", "Second"):
        flow = await hass.config_entries.flow.async_init(DOMAIN, context={"source": SOURCE_USER})
        flow = await hass.config_entries.flow.async_configure(flow["flow_id"], {"name": name})
        result = await hass.config_entries.flow.async_configure(flow["flow_id"], SETTINGS)
        assert result["type"] is FlowResultType.CREATE_ENTRY
        await hass.async_block_till_done()
        assert hass.states.get(f"sensor.{name.lower()}_setpoint") is not None
    assert len(hass.config_entries.async_entries(DOMAIN)) == 2


async def test_sensor_ticks_and_unavailable_input(
    hass: HomeAssistant, freezer: FrozenDateTimeFactory
) -> None:
    entry = await numeric_entry(hass)
    runtime = entry.runtime_data
    assert runtime.current.value == 45
    assert runtime.target == ""
    assert runtime.target_value() is None
    hass.states.async_set("sensor.outdoor_temperature", "40")
    await hass.async_block_till_done()
    assert runtime.current.value == 20  # input updates recalculate immediately
    assert runtime.state_dict()["input_value"] == 40
    notifications = []
    runtime.async_add_listener(lambda: notifications.append(runtime.current.value))
    freezer.tick(timedelta(seconds=9))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()
    assert notifications == []
    freezer.tick(timedelta(seconds=1))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()
    assert runtime.current.value == 20
    assert notifications == [20]
    for invalid in ("unknown", "unavailable", "nan", "inf", "text"):
        hass.states.async_set("sensor.outdoor_temperature", invalid)
        await hass.async_block_till_done()
        assert hass.states.get("sensor.zirkulation_setpoint").state == "unavailable"
        assert runtime.state_dict()["input_available"] is False
    hass.states.async_set("sensor.outdoor_temperature", "-100")
    await hass.async_block_till_done()
    assert runtime.current.value == 70  # clamp below x_min
    await hass.config_entries.async_unload(entry.entry_id)
    freezer.tick(timedelta(seconds=30))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()
    assert runtime._stopped


async def test_save_validation_preview_and_restart(hass: HomeAssistant) -> None:
    entry = await numeric_entry(hass)
    runtime = entry.runtime_data
    schedule = runtime.schedule_dict()
    for points in (
        [],
        [{"x": float("nan"), "v": 30}],
        [{"x": 100, "v": 30}],
        [{"x": 1, "v": 30}, {"x": 1, "v": 40}],
        [{"x": 1, "v": float("inf")}],
    ):
        with pytest.raises(ScheduleValidationError):
            await runtime.async_save_schedule(
                {
                    **schedule,
                    "profiles": {
                        **schedule["profiles"],
                        "workday": {**schedule["profiles"]["workday"], "curve": points},
                    },
                },
                runtime.revision,
            )
    assert runtime.preview(dt_util.now().date(), None, 5)[0] == [-20, 70]
    revision = runtime.revision
    await hass.config_entries.async_reload(entry.entry_id)
    assert entry.runtime_data.schedule_dict()["profiles"] == schedule["profiles"]
    assert entry.runtime_data.revision == revision


@pytest.mark.parametrize("mode", ["step", "linear", "smooth", "curve"])
def test_wrap_and_single_point(mode: str) -> None:
    axis = axis_config({"axis_source": "month_of_year"})
    points = [{"x": 1, "v": 30}, {"x": 7, "v": 60}]
    assert evaluate_curve(points, 1, axis, mode) == 30
    assert evaluate_curve(points, 7, axis, mode) == 60
    if mode != "step":
        assert evaluate_curve(points, 12.999999, axis, mode) == pytest.approx(30, abs=0.001)
    assert evaluate_curve([{"x": 4, "v": 42}], 12, axis, mode) == 42


async def test_month_and_wrapping_sensor(hass: HomeAssistant, berlin: None) -> None:
    at = datetime(2026, 1, 1, tzinfo=dt_util.get_default_time_zone())
    assert input_value(hass, at, axis_config({"axis_source": "month_of_year"})) == 1
    at = at.replace(month=12, day=31, hour=23, minute=59)
    assert 12.99 < input_value(hass, at, axis_config({"axis_source": "month_of_year"})) < 13
    axis = axis_config(
        {
            "axis_source": "sensor",
            "input_entity": "sensor.angle",
            "x_min": 0,
            "x_max": 360,
            "x_wrap": True,
        }
    )
    for raw, expected in [(360, 0), (-10, 350), (730, 10)]:
        hass.states.async_set("sensor.angle", str(raw))
        assert input_value(hass, at, axis) == expected


async def test_sensor_setup_and_remove_target(hass: HomeAssistant, target: str) -> None:
    flow = await hass.config_entries.flow.async_init(DOMAIN, context={"source": SOURCE_USER})
    flow = await hass.config_entries.flow.async_configure(
        flow["flow_id"], {"name": "Sensor curve", "axis_source": "sensor"}
    )
    result = await hass.config_entries.flow.async_configure(
        flow["flow_id"],
        {**SETTINGS, **{k: v for k, v in SENSOR_OPTIONS.items() if k != "axis_source"}},
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await hass.async_block_till_done()
    assert hass.states.get("sensor.sensor_curve_setpoint").state == "unavailable"
    assert hass.states.get("select.sensor_curve_mode") is not None
    entry = await setup_entry(hass, make_entry())
    flow = await hass.config_entries.options.async_init(entry.entry_id)
    flow = await hass.config_entries.options.async_configure(
        flow["flow_id"], {"axis_source": "time_of_day"}
    )
    result = await hass.config_entries.options.async_configure(flow["flow_id"], SETTINGS)
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await hass.async_block_till_done()
    assert entry.runtime_data.target == ""
    assert entry.unique_id is None


async def test_invalid_input_never_writes_target(hass: HomeAssistant, target: str) -> None:
    hass.states.async_set("sensor.outdoor_temperature", "10")
    entry = await setup_entry(hass, make_entry(target, **SENSOR_OPTIONS))
    runtime = entry.runtime_data
    previous = hass.states.get(target).state
    hass.states.async_set("sensor.outdoor_temperature", "unavailable")
    await runtime.async_update(force=True)
    assert hass.states.get(target).state == previous
    assert runtime.current.value is None
    hass.states.async_set("sensor.outdoor_temperature", "-20")
    await runtime.async_update(force=True)
    assert hass.states.get(target).state == "20.0"


async def test_numeric_limits_cannot_exclude_saved_points(hass: HomeAssistant) -> None:
    entry = await numeric_entry(hass)
    flow = await hass.config_entries.options.async_init(entry.entry_id)
    flow = await hass.config_entries.options.async_configure(
        flow["flow_id"], {"axis_source": "sensor"}
    )
    result = await hass.config_entries.options.async_configure(
        flow["flow_id"],
        {**SETTINGS, **{k: v for k, v in SENSOR_OPTIONS.items() if k != "axis_source"}, "x_min": 0},
    )
    assert result["errors"] == {"x_max": "curve_out_of_range"}
    assert entry.runtime_data.axis["min"] == -20


async def test_input_number_can_be_selected_and_evaluated(hass: HomeAssistant, target: str) -> None:
    flow = await hass.config_entries.flow.async_init(DOMAIN, context={"source": SOURCE_USER})
    flow = await hass.config_entries.flow.async_configure(
        flow["flow_id"], {"name": "Helper input", "axis_source": "sensor"}
    )
    selectors = {str(key): value for key, value in flow["data_schema"].schema.items()}
    assert selectors["input_entity"].config["domain"] == ["sensor", "input_number", "number"]
    result = await hass.config_entries.flow.async_configure(
        flow["flow_id"],
        {
            **SETTINGS,
            **{k: v for k, v in SENSOR_OPTIONS.items() if k != "axis_source"},
            "input_entity": target,
            "x_min": 20,
            "x_max": 70,
        },
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await hass.async_block_till_done()
    runtime = result["result"].runtime_data
    assert runtime.current.value == 40
    await hass.services.async_call(
        "input_number", "set_value", {"entity_id": target, "value": 55}, blocking=True
    )
    await hass.async_block_till_done()
    assert runtime.current.value == 55
    assert runtime.target == ""
    options = await hass.config_entries.options.async_init(result["result"].entry_id)
    options = await hass.config_entries.options.async_configure(
        options["flow_id"], {"axis_source": "sensor"}
    )
    selectors = {str(key): value for key, value in options["data_schema"].schema.items()}
    assert "input_number" in selectors["input_entity"].config["domain"]


@pytest.mark.parametrize("source", ["month_of_year", "time_of_day"])
async def test_switch_from_sensor_drops_required_input_field(
    hass: HomeAssistant, source: str
) -> None:
    entry = await numeric_entry(hass)
    runtime = entry.runtime_data
    schedule = runtime.schedule_dict()
    for profile in schedule["profiles"].values():
        profile["curve"] = [{"x": 1, "v": 30}, {"x": 7, "v": 60}]
    await runtime.async_save_schedule(schedule, runtime.revision)
    flow = await hass.config_entries.options.async_init(entry.entry_id)
    assert {str(key) for key in flow["data_schema"].schema} == {"axis_source"}
    flow = await hass.config_entries.options.async_configure(
        flow["flow_id"], {"axis_source": source}
    )
    fields = {str(key): key for key in flow["data_schema"].schema}
    assert "input_entity" not in fields
    assert "axis_source" not in fields
    if source == "month_of_year":
        assert fields["x_min"].default() == 1
        assert fields["x_max"].default() == 13
        assert fields["x_wrap"].default() is True
    result = await hass.config_entries.options.async_configure(flow["flow_id"], SETTINGS)
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await hass.async_block_till_done()
    assert entry.runtime_data.axis["source"] == source
    assert entry.options.get("input_entity") is None


async def test_label_intervals_are_saved_and_input_cannot_be_target(
    hass: HomeAssistant, target: str
) -> None:
    from custom_components.curve_scheduler.config_flow import validate_settings

    assert validate_settings({**SETTINGS, "x_label_step": 0.01}) == {
        "x_label_step": "invalid_label_step"
    }
    assert validate_settings({**SETTINGS, "y_label_step": -1}) == {
        "y_label_step": "invalid_label_step"
    }
    assert validate_settings(
        {
            **SETTINGS,
            **SENSOR_OPTIONS,
            "input_entity": target,
            "target_entity": target,
        }
    ) == {"input_entity": "input_is_target"}
    entry = await numeric_entry(hass, x_label_step=20, y_label_step=10)
    config = entry.runtime_data.config_dict()
    assert config["x_label_step"] == 20
    assert config["y_label_step"] == 10


async def test_numeric_parameters_can_be_changed_after_setup(hass: HomeAssistant) -> None:
    entry = await numeric_entry(hass)
    curve = entry.runtime_data.schedule_dict()["curve"]
    flow = await hass.config_entries.options.async_init(entry.entry_id)
    flow = await hass.config_entries.options.async_configure(
        flow["flow_id"], {"axis_source": "sensor"}
    )
    result = await hass.config_entries.options.async_configure(
        flow["flow_id"],
        {
            **SETTINGS,
            **{key: value for key, value in SENSOR_OPTIONS.items() if key != "axis_source"},
            "x_min": -30,
            "x_max": 50,
            "x_step": 0.5,
            "min_value": 10,
            "max_value": 80,
            "step": 0.25,
            "x_label_step": 20,
            "y_label_step": 10,
            "output_tick_seconds": 30,
        },
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await hass.async_block_till_done()
    runtime = entry.runtime_data
    assert runtime.axis["min"] == -30
    assert runtime.axis["max"] == 50
    assert runtime.axis["step"] == 0.5
    assert (runtime.minimum, runtime.maximum, runtime.step) == (10, 80, 0.25)
    assert runtime.tick_seconds == 30
    assert runtime.config_dict()["x_label_step"] == 20
    assert runtime.config_dict()["y_label_step"] == 10
    assert runtime.schedule_dict()["curve"] == curve
