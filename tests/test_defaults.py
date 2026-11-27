"""New curves start with one constant fallback and no activation rules."""

from datetime import timedelta

from homeassistant.config_entries import SOURCE_USER
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.util import dt as dt_util
import pytest

from custom_components.curve_scheduler.const import DOMAIN

from .test_config_flow import form_defaults


@pytest.mark.parametrize("source", ["time_of_day", "day_of_week", "month_of_year", "sensor"])
@pytest.mark.parametrize(("language", "name"), [("en", "Default"), ("de", "Standard")])
async def test_new_curve_has_one_constant_fallback_and_no_activations(
    hass: HomeAssistant, source: str, language: str, name: str
) -> None:
    hass.config.language = language
    hass.states.async_set("sensor.input", "7.123456789")
    flow = await hass.config_entries.flow.async_init(DOMAIN, context={"source": SOURCE_USER})
    flow = await hass.config_entries.flow.async_configure(
        flow["flow_id"], {"name": "Simple curve", "axis_source": source}
    )
    settings = form_defaults(flow)
    if source == "sensor":
        settings["input"]["input_entity"] = "sensor.input"
    result = await hass.config_entries.flow.async_configure(flow["flow_id"], settings)
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await hass.async_block_till_done()
    entry = result["result"]
    runtime = entry.runtime_data
    schedule = runtime.schedule_dict()
    assert list(schedule["profiles"]) == ["default"]
    assert schedule["profiles"]["default"]["name"] == name
    assert schedule["profiles"]["default"]["points"] == [{"t": "00:00", "v": 45}]
    assert schedule["fallback_profile"] == "default"
    assert schedule["activations"] == []
    assert schedule["exceptions"] == []
    if source != "time_of_day":
        assert schedule["profiles"]["default"]["curve"] == [{"x": runtime.axis["min"], "v": 45}]
        assert all(
            value == pytest.approx(45)
            for _, value in runtime.preview(dt_util.now().date(), None, 5)
        )
    for day in range(8):
        computed = runtime.compute_at(dt_util.now() + timedelta(days=day))
        assert computed.profile_id == "default"
        assert computed.reason == "fallback"
        assert computed.value == 45
    await hass.config_entries.async_reload(entry.entry_id)
    assert entry.runtime_data.schedule_dict() == schedule
    assert entry.runtime_data.current.reason == "fallback"
    assert entry.runtime_data.current.value == 45
