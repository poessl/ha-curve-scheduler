"""Read and write numeric target controls, including individual light channels."""

from dataclasses import dataclass
import math
from typing import Any

from homeassistant.core import State

from .const import CONF_TARGET_ATTRIBUTE


@dataclass(frozen=True)
class LightTarget:
    """One numeric light control or component of a color tuple."""

    attribute: str
    minimum: float
    maximum: float
    step: float = 1
    unit: str = ""
    component: int | None = None
    defaults: tuple[float, ...] = ()


LIGHT_TARGETS = {
    "brightness_pct": LightTarget("brightness_pct", 0, 100, unit="%"),
    "brightness": LightTarget("brightness", 0, 255),
    "color_temp_kelvin": LightTarget("color_temp_kelvin", 2000, 6500, unit="K"),
    "white": LightTarget("white", 0, 255),
    "hs_hue": LightTarget("hs_color", 0, 360, 0.1, "°", 0, (0, 100)),
    "hs_saturation": LightTarget("hs_color", 0, 100, 0.1, "%", 1, (0, 100)),
    "xy_x": LightTarget("xy_color", 0, 1, 0.001, component=0, defaults=(0.3127, 0.329)),
    "xy_y": LightTarget("xy_color", 0, 1, 0.001, component=1, defaults=(0.3127, 0.329)),
}
for _mode, _channels in (
    ("rgb", ("red", "green", "blue")),
    ("rgbw", ("red", "green", "blue", "white")),
    ("rgbww", ("red", "green", "blue", "cold_white", "warm_white")),
):
    for _index, _channel in enumerate(_channels):
        LIGHT_TARGETS[f"{_mode}_{_channel}"] = LightTarget(
            f"{_mode}_color",
            0,
            255,
            component=_index,
            defaults=(255, 255, 255) + (0,) * (len(_channels) - 3),
        )


def light_target_options(state: State | None) -> list[str]:
    """Offer controls supported by the light, including HA's color conversions."""
    modes = set(state.attributes.get("supported_color_modes") or []) if state else set()
    if not modes:
        return list(LIGHT_TARGETS)
    attributes: set[str] = set()
    if modes - {"onoff", "unknown"}:
        attributes.update(("brightness_pct", "brightness"))
    if "color_temp" in modes:
        attributes.add("color_temp_kelvin")
    if "white" in modes:
        attributes.add("white")
    if modes & {"hs", "xy", "rgb", "rgbw", "rgbww"}:
        attributes.update(key for key in LIGHT_TARGETS if key.startswith(("hs_", "xy_", "rgb_")))
    for mode in ("rgbw", "rgbww"):
        if mode in modes:
            attributes.update(key for key in LIGHT_TARGETS if key.startswith(f"{mode}_"))
    return [key for key in LIGHT_TARGETS if key in attributes]


def light_bounds(state: State | None, attribute: str) -> tuple[float, float]:
    """Use the device's Kelvin limits when available."""
    spec = LIGHT_TARGETS[attribute]
    if attribute == "color_temp_kelvin" and state:
        minimum = _number(state.attributes.get("min_color_temp_kelvin"))
        maximum = _number(state.attributes.get("max_color_temp_kelvin"))
        if minimum is not None and maximum is not None and 0 < minimum < maximum:
            return minimum, maximum
    return spec.minimum, spec.maximum


def target_key(entity_id: str, attribute: str = "brightness_pct") -> str:
    """Allow independent curves for different attributes of one light."""
    if attribute == "brightness":
        attribute = "brightness_pct"
    return f"{entity_id}:{attribute}" if entity_id.startswith("light.") else entity_id


def _number(raw: Any) -> float | None:
    try:
        value = float(raw)
        return value if math.isfinite(value) else None
    except TypeError, ValueError:
        return None


def read_target(state: State | None, options: dict[str, Any]) -> float | None:
    """Read the same numeric control that a target write updates."""
    if state is None or state.state in ("unknown", "unavailable"):
        return None
    if state.domain in ("climate", "water_heater"):
        return _number(state.attributes.get("temperature"))
    if state.domain != "light":
        return _number(state.state)
    spec = LIGHT_TARGETS[options.get(CONF_TARGET_ATTRIBUTE, "brightness_pct")]
    if spec.attribute in ("brightness", "brightness_pct", "white"):
        if state.state == "off":
            return 0.0
        value = _number(state.attributes.get("brightness"))
        return (
            value * 100 / 255 if value is not None and spec.attribute == "brightness_pct" else value
        )
    raw = state.attributes.get(spec.attribute)
    if spec.component is not None:
        raw = (
            raw[spec.component]
            if isinstance(raw, (tuple, list)) and len(raw) > spec.component
            else None
        )
    return _number(raw)


def target_command(
    state: State, options: dict[str, Any], value: float
) -> tuple[str, dict[str, Any], float]:
    """Build a service command and its effective scalar value for deduplication."""
    if state.domain in ("number", "input_number"):
        return "set_value", {"value": value}, value
    if state.domain != "light":
        return "set_temperature", {"temperature": value}, value
    attribute = options.get(CONF_TARGET_ATTRIBUTE, "brightness_pct")
    spec = LIGHT_TARGETS[attribute]
    minimum, maximum = light_bounds(state, attribute)
    value = max(minimum, min(maximum, value))
    if spec.attribute == "brightness_pct":
        brightness = round(value * 255 / 100)
        return "turn_on", {"brightness": brightness}, brightness * 100 / 255
    if spec.step == 1:
        value = round(value)
    if attribute == "hs_hue":
        value %= 360
    if spec.component is None:
        return "turn_on", {spec.attribute: value}, value
    raw = state.attributes.get(spec.attribute)
    channels = list(spec.defaults)
    if isinstance(raw, (tuple, list)) and len(raw) == len(channels):
        for index, component in enumerate(raw):
            numeric = _number(component)
            if numeric is not None:
                maximum = (
                    (360 if index == 0 else 100)
                    if spec.attribute == "hs_color"
                    else (1 if spec.attribute == "xy_color" else 255)
                )
                channels[index] = max(0, min(maximum, numeric))
                if spec.step == 1:
                    channels[index] = round(channels[index])
    channels[spec.component] = value
    return "turn_on", {spec.attribute: channels}, value
