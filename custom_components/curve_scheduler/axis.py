"""Numeric input axes, independent of daily time profiles."""

from __future__ import annotations

import calendar
from datetime import datetime
import math
from typing import Any

from homeassistant.core import HomeAssistant

from .interpolation import clamp, interpolate


def axis_config(options: dict[str, Any]) -> dict[str, Any]:
    """Resolve defaults for each preset (upper wrap limit is exclusive)."""
    source = options.get("axis_source", "time_of_day")
    minimum, maximum, step, wrap = {
        "time_of_day": (0.0, 1440.0, 5.0, True),
        "month_of_year": (1.0, 13.0, 0.01, True),
        "sensor": (0.0, 100.0, 0.1, False),
    }[source]
    # Time uses the existing midnight-aware profile engine.
    return {
        "source": source,
        "input_entity": options.get("input_entity") or None,
        "min": float(options.get("x_min", minimum)),
        "max": float(options.get("x_max", maximum)),
        "step": float(options.get("x_step", step)),
        "wrap": bool(options.get("x_wrap", wrap)),
    }


def input_value(hass: HomeAssistant, at: datetime, axis: dict[str, Any]) -> float | None:
    """Read an input; invalid sensor states never produce an output."""
    if axis["source"] == "month_of_year":
        days = calendar.monthrange(at.year, at.month)[1]
        fraction = (at.day - 1 + (at.hour * 3600 + at.minute * 60 + at.second) / 86400) / days
        value = at.month + fraction
    elif axis["source"] == "time_of_day":
        value = at.hour * 60 + at.minute + at.second / 60
    else:
        state = hass.states.get(axis["input_entity"]) if axis["input_entity"] else None
        try:
            value = float(state.state) if state else math.nan
        except TypeError, ValueError:
            return None
    if not math.isfinite(value):
        return None
    minimum, maximum = axis["min"], axis["max"]
    if axis["wrap"]:
        return float(minimum + (value - minimum) % (maximum - minimum))
    return clamp(value, minimum, maximum)


def evaluate_curve(
    points: list[dict[str, float]], x: float, axis: dict[str, Any], mode: str
) -> float:
    """Evaluate with endpoint holding or periodic continuation."""
    timeline = [(p["x"], p["v"]) for p in points]
    if axis["wrap"]:
        width = axis["max"] - axis["min"]
        timeline = [
            (px + offset * width, py) for offset in (-2, -1, 0, 1, 2) for px, py in timeline
        ]
    return interpolate(timeline, x, mode)


def default_curve(axis: dict[str, Any], minimum: float, maximum: float) -> list[dict[str, float]]:
    """Create two editable points within the configured axis."""
    end = (axis["min"] + axis["max"]) / 2 if axis["wrap"] else axis["max"]
    return [{"x": axis["min"], "v": minimum}, {"x": end, "v": maximum}]
