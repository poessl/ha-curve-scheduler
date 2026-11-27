"""Resolve point groups without modifying their saved coordinates."""

from __future__ import annotations

from collections.abc import Mapping, Sequence
import math
from typing import Any

from homeassistant.util import dt as dt_util

from .model import ValidationIssue


def resolve_positions(
    points: Sequence[Mapping[str, Any]],
    coordinates: Sequence[float],
    targets: Mapping[str, float],
    period: float,
    minimum: float = 0.0,
    *,
    sort_result: bool = True,
) -> tuple[list[tuple[float, float]], list[ValidationIssue]]:
    """Apply independent anchor shifts, preserving cyclic point order.

    Targets contain successfully parsed source coordinates only. Missing targets
    leave their groups at their original positions. Validate before wrapping:
    sorting first would hide points crossing their neighbours.
    """
    shifts: dict[str, float] = {}
    for point, coordinate in zip(points, coordinates, strict=True):
        anchor = point.get("anchor")
        if not anchor or anchor["entity_id"] not in targets:
            continue
        delta = targets[anchor["entity_id"]] - coordinate
        if anchor.get("shift_mode", "shortest") == "shortest":
            delta = (delta + period / 2) % period - period / 2
            if math.isclose(delta, -period / 2, rel_tol=0, abs_tol=1e-9):
                delta = period / 2
        shifts[point["id"]] = delta
    resolved = [
        coordinate + shifts.get(point.get("partner_of") or point.get("id", ""), 0.0)
        for point, coordinate in zip(points, coordinates, strict=True)
    ]
    issues = []
    if len(resolved) > 1:
        for index, coordinate in enumerate(resolved):
            following = (index + 1) % len(resolved)
            gap = resolved[following] + (period if following == 0 else 0) - coordinate
            if gap <= 1e-9:
                issues.append(
                    ValidationIssue(
                        "anchor_collision",
                        str(index),
                        {
                            "point": index,
                            "following": following,
                            "x": coordinate,
                            "following_x": resolved[following],
                        },
                    )
                )
    if issues:
        return [], issues
    result = [
        (minimum + (coordinate - minimum) % period, float(point["v"]))
        for point, coordinate in zip(points, resolved, strict=True)
    ]
    return sorted(result) if sort_result else result, []


def source_coordinate(state: Any, source: str, original: float) -> float | None:
    """Read HA datetime state in local wall-clock coordinates.

    Missing states are normal fallbacks. Available but unusable values raise
    ValueError so the live runtime can log them without invalidating a group.
    """
    if state is None or state.state in ("unknown", "unavailable"):
        return None
    raw = state.state
    has_date = state.attributes.get("has_date", True)
    has_time = state.attributes.get("has_time", True)
    if state.entity_id.startswith("sensor."):
        # Sensors expose their date/time in the state rather than helper capabilities.
        if len(raw) == 10 and dt_util.parse_date(raw) is not None:
            has_date, has_time = True, False
        elif dt_util.parse_datetime(raw) is not None:
            has_date = has_time = True
        elif dt_util.parse_time(raw) is not None:
            has_date, has_time = False, True
        elif dt_util.parse_date(raw) is not None:
            has_date, has_time = True, False
    if has_date and has_time:
        parsed = dt_util.parse_datetime(raw)
        if parsed is None:
            raise ValueError(f"Invalid datetime: {raw}")
        if parsed.tzinfo is not None:
            parsed = dt_util.as_local(parsed)
        seconds = parsed.hour * 3600 + parsed.minute * 60 + parsed.second + parsed.microsecond / 1e6
        return seconds / 60 if source == "time_of_day" else parsed.weekday() + 1 + seconds / 86400
    if source == "time_of_day" and has_time:
        clock = dt_util.parse_time(raw)
        if clock is not None:
            return clock.hour * 60 + clock.minute + clock.second / 60 + clock.microsecond / 6e7
    elif source == "day_of_week" and has_date:
        day = dt_util.parse_date(raw)
        if day is not None:
            return day.weekday() + 1 + original % 1
    raise ValueError(f"Value lacks a valid required date/time component: {raw}")
