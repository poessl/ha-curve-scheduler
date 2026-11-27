"""Output cadence settings and calculation of the next scheduled update."""

from calendar import monthrange
from datetime import datetime, timedelta
from typing import Any

from homeassistant.util import dt as dt_util

from .const import (
    CONF_INTERVAL,
    CONF_TICK,
    CONF_TICK_UNIT,
    CONF_TICK_VALUE,
    DEFAULT_INTERVAL,
)


def tick_settings(options: dict[str, Any]) -> tuple[float, str]:
    """Read the value and unit, preserving both legacy cadence formats."""
    if CONF_TICK_VALUE in options:
        return float(options[CONF_TICK_VALUE]), str(options.get(CONF_TICK_UNIT, "seconds"))
    if CONF_TICK in options:
        return float(options[CONF_TICK]), "seconds"
    return float(options.get(CONF_INTERVAL, DEFAULT_INTERVAL)), "minutes"


def _calendar_tick(anchor: datetime, value: float, unit: str, occurrence: int) -> datetime:
    if unit == "months":
        year, month = divmod(anchor.year * 12 + anchor.month - 1 + occurrence * int(value), 12)
        month += 1
        return anchor.replace(
            year=year, month=month, day=min(anchor.day, monthrange(year, month)[1])
        )
    return anchor + timedelta(days=occurrence * value * (7 if unit == "weeks" else 1))


def next_tick(anchor: datetime, now: datetime, value: float, unit: str) -> datetime:
    """Return the first tick after now, without replaying missed ticks.

    Days, weeks and months preserve local clock time. Month-end dates clamp to
    the last day of shorter months without changing the original anchor day.
    """
    now_utc = dt_util.as_utc(now)
    if unit in ("seconds", "minutes", "hours"):
        interval = timedelta(seconds=value * {"seconds": 1, "minutes": 60, "hours": 3600}[unit])
        anchor = dt_util.as_utc(anchor)
        occurrence = max(1, (now_utc - anchor) // interval + 1)
        return anchor + occurrence * interval

    now = now.astimezone(anchor.tzinfo)
    if unit == "months":
        elapsed = (now.year - anchor.year) * 12 + now.month - anchor.month
        occurrence = max(1, elapsed // int(value))
    else:
        interval = timedelta(days=value * (7 if unit == "weeks" else 1))
        occurrence = max(1, (now.replace(tzinfo=None) - anchor.replace(tzinfo=None)) // interval)
    due = dt_util.as_utc(_calendar_tick(anchor, value, unit, occurrence))
    if due <= now_utc:
        due = dt_util.as_utc(_calendar_tick(anchor, value, unit, occurrence + 1))
    return due
