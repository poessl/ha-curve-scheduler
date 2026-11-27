"""Websocket commands used by the card.

Every Home Assistant user may read and edit schedules. Creating a whole-curve
clone requires admin rights, like creating an integration through setup.
"""

from __future__ import annotations

from datetime import date, timedelta
from typing import Any

from homeassistant.components import websocket_api
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant, callback
from homeassistant.util import dt as dt_util
import probatio as vol

from .const import DOMAIN
from .holidays import HolidayProvider
from .model import ScheduleValidationError, validate_schedule
from .runtime import CurveSchedulerRuntime, RevisionConflictError

ERR_NOT_FOUND = "not_found"
ERR_INVALID = "invalid_schedule"
ERR_CONFLICT = "revision_conflict"


def _runtime(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> CurveSchedulerRuntime | None:
    entry = hass.config_entries.async_get_entry(msg["entry_id"])
    if entry is None or entry.domain != DOMAIN or entry.state is not ConfigEntryState.LOADED:
        connection.send_error(
            msg["id"],
            ERR_NOT_FOUND,
            "Instance not found",
            translation_domain=DOMAIN,
            translation_key="entry_not_found",
            translation_placeholders={"entry_id": msg["entry_id"]},
        )
        return None
    runtime: CurveSchedulerRuntime = entry.runtime_data
    return runtime


@callback
def async_register_websocket_api(hass: HomeAssistant) -> None:
    """Register the commands."""
    websocket_api.async_register_command(hass, ws_list)
    websocket_api.async_register_command(hass, ws_get)
    websocket_api.async_register_command(hass, ws_save)
    websocket_api.async_register_command(hass, ws_subscribe)
    websocket_api.async_register_command(hass, ws_preview)
    websocket_api.async_register_command(hass, ws_holidays)
    websocket_api.async_register_command(hass, ws_clone)
    websocket_api.async_register_command(hass, ws_calendar)


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/list"})
@callback
def ws_list(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """List all loaded instances."""
    result = []
    for entry in hass.config_entries.async_entries(DOMAIN):
        if entry.state is not ConfigEntryState.LOADED:
            continue
        runtime: CurveSchedulerRuntime = entry.runtime_data
        result.append(
            {"entry_id": entry.entry_id, "title": entry.title, "config": runtime.config_dict()}
        )
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/get", vol.Required("entry_id"): str}
)
@callback
def ws_get(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Return configuration, schedule, revision and live state."""
    if runtime := _runtime(hass, connection, msg):
        connection.send_result(msg["id"], runtime.as_dict())


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/save",
        vol.Required("entry_id"): str,
        vol.Required("revision"): int,
        vol.Required("schedule"): dict,
    }
)
@websocket_api.async_response
async def ws_save(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Validate and store the schedule.

    Rejected with ``revision_conflict`` if somebody else saved in between.
    Validation problems are returned as a list of ``{code, path, params}``
    so the card can translate them.
    """
    runtime = _runtime(hass, connection, msg)
    if runtime is None:
        return
    try:
        revision = await runtime.async_save_schedule(msg["schedule"], msg["revision"])
    except RevisionConflictError as err:
        connection.send_result(msg["id"], {"ok": False, "conflict": True, "revision": err.revision})
        return
    except ScheduleValidationError as err:
        connection.send_result(
            msg["id"],
            {"ok": False, "conflict": False, "errors": [i.as_dict() for i in err.issues]},
        )
        return
    connection.send_result(msg["id"], {"ok": True, "revision": revision})


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/subscribe", vol.Required("entry_id"): str}
)
@callback
def ws_subscribe(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Send the full state now and after every change (live update)."""
    runtime = _runtime(hass, connection, msg)
    if runtime is None:
        return
    msg_id = msg["id"]

    @callback
    def forward() -> None:
        connection.send_message(websocket_api.event_message(msg_id, runtime.as_dict()))

    connection.subscriptions[msg_id] = runtime.async_add_listener(forward)
    connection.send_result(msg_id)
    forward()


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/preview",
        vol.Required("entry_id"): str,
        vol.Optional("date"): str,
        vol.Optional("schedule"): dict,
        vol.Optional("step_minutes", default=5): vol.All(int, vol.Range(min=1, max=60)),
    }
)
@websocket_api.async_response
async def ws_preview(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Return the backend-computed curve of one day (for cross-checking)."""
    runtime = _runtime(hass, connection, msg)
    if runtime is None:
        return
    try:
        day = date.fromisoformat(msg["date"]) if "date" in msg else dt_util.now().date()
    except ValueError:
        connection.send_error(msg["id"], "invalid_format", "Invalid date")
        return
    schedule = msg.get("schedule")
    if schedule is not None:
        issues = validate_schedule(schedule, runtime.minimum, runtime.maximum, runtime.axis)
        if issues:
            connection.send_result(
                msg["id"], {"ok": False, "errors": [i.as_dict() for i in issues]}
            )
            return
    for provider in [runtime.holidays, *runtime.activation_holidays.values()]:
        await provider.async_ensure(day - timedelta(days=2), day + timedelta(days=2))
    try:
        curve = await runtime.async_preview(day, schedule, msg["step_minutes"])
    except ScheduleValidationError as err:
        connection.send_result(
            msg["id"], {"ok": False, "errors": [i.as_dict() for i in err.issues]}
        )
        return
    connection.send_result(
        msg["id"], {"ok": True, "date": day.isoformat(), "mode": runtime.mode, "curve": curve}
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/holidays",
        vol.Required("entry_id"): str,
        vol.Required("start"): str,
        vol.Required("end"): str,
        vol.Optional("source"): vol.Match(r"^(calendar|binary_sensor)\.[a-z0-9_]+$"),
    }
)
@websocket_api.async_response
async def ws_holidays(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Return the days off reported by the holiday source in a date range."""
    runtime = _runtime(hass, connection, msg)
    if runtime is None:
        return
    try:
        start = date.fromisoformat(msg["start"])
        end = date.fromisoformat(msg["end"])
    except ValueError:
        connection.send_error(msg["id"], "invalid_format", "Invalid date")
        return
    provider = HolidayProvider(hass, msg["source"]) if "source" in msg else runtime.holidays
    days = await provider.async_holidays(start, end)
    connection.send_result(
        msg["id"],
        {"configured": provider.configured, "holidays": [d.isoformat() for d in days]},
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/clone",
        vol.Required("entry_id"): str,
        vol.Required("name"): vol.All(str, vol.Length(min=1, max=100)),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_clone(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Clone a curve through a config flow, including its saved schedule."""
    if _runtime(hass, connection, msg) is None:
        return
    if not msg["name"].strip():
        connection.send_error(
            msg["id"], "invalid_name", "Enter a name containing 1-100 characters."
        )
        return
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": "clone"}, data={"entry_id": msg["entry_id"], "name": msg["name"]}
    )
    entry = result.get("result")
    if entry is None or entry.state is not ConfigEntryState.LOADED:
        connection.send_error(
            msg["id"],
            "clone_failed",
            "Could not load the cloned curve. Check the integration settings.",
        )
        return
    connection.send_result(
        msg["id"],
        {
            "entry_id": entry.entry_id,
            "title": entry.title,
            "config": entry.runtime_data.config_dict(),
        },
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/calendar",
        vol.Required("entry_id"): str,
        vol.Required("start"): str,
        vol.Required("end"): str,
        vol.Optional("schedule"): dict,
    }
)
@websocket_api.async_response
async def ws_calendar(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Resolve a calendar from saved or draft schedule using native conditions."""
    runtime = _runtime(hass, connection, msg)
    if runtime is None:
        return
    try:
        start, end = date.fromisoformat(msg["start"]), date.fromisoformat(msg["end"])
        if not 0 <= (end - start).days <= 61:
            raise ValueError
    except ValueError:
        connection.send_error(msg["id"], "invalid_format", "Choose a date range of at most 62 days")
        return
    schedule = msg.get("schedule")
    issues = (
        validate_schedule(schedule, runtime.minimum, runtime.maximum, runtime.axis)
        if schedule is not None
        else []
    )
    if issues:
        connection.send_result(msg["id"], {"ok": False, "errors": [i.as_dict() for i in issues]})
        return
    try:
        days = await runtime.async_calendar(start, end, schedule)
    except ScheduleValidationError as err:
        connection.send_result(
            msg["id"], {"ok": False, "errors": [i.as_dict() for i in err.issues]}
        )
        return
    connection.send_result(msg["id"], {"ok": True, "days": days})
