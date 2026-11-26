"""Serve and register the Lovelace card shipped with the integration."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

from homeassistant.components import frontend, panel_custom
from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant

from ..const import CARD_FILENAME, DOMAIN, FRONTEND_URL_BASE

FRONTEND_DIR = Path(__file__).parent
DATA_REGISTERED = f"{DOMAIN}_frontend_registered"
DATA_PANEL_ENTRIES = f"{DOMAIN}_panel_entries"
PANEL_PATH = "curve-scheduler"


async def async_register_frontend(hass: HomeAssistant) -> None:
    """Serve the card and load it on every dashboard (no manual resource)."""
    if hass.data.get(DATA_REGISTERED):
        return
    card = FRONTEND_DIR / CARD_FILENAME

    def asset_url() -> str:
        manifest = json.loads((FRONTEND_DIR.parent / "manifest.json").read_text())
        digest = hashlib.sha256(card.read_bytes()).hexdigest()[:12]
        return f"{FRONTEND_URL_BASE}/{CARD_FILENAME}?v={manifest['version']}&h={digest}"

    module_url = await hass.async_add_executor_job(asset_url)
    url = f"{FRONTEND_URL_BASE}/{CARD_FILENAME}"
    await hass.http.async_register_static_paths(
        [StaticPathConfig(url, str(card), cache_headers=False)]
    )
    # The version query parameter makes browsers fetch the new file after updates.
    add_extra_js_url(hass, module_url)
    hass.data[DATA_REGISTERED] = module_url


async def async_register_editor_panel(hass: HomeAssistant, entry_id: str) -> None:
    """Register one shared editor panel while any instances are loaded."""
    entries: set[str] = hass.data.setdefault(DATA_PANEL_ENTRIES, set())
    if not entries:
        await panel_custom.async_register_panel(
            hass,
            frontend_url_path=PANEL_PATH,
            webcomponent_name="curve-scheduler-panel",
            sidebar_title="Curve Scheduler",
            sidebar_icon="mdi:chart-line",
            module_url=hass.data[DATA_REGISTERED],
            require_admin=False,
        )
    entries.add(entry_id)


def async_unregister_editor_panel(hass: HomeAssistant, entry_id: str) -> None:
    """Remove the panel when its last instance unloads; keep card assets available."""
    if (entries := hass.data.get(DATA_PANEL_ENTRIES)) is None:
        return
    entries.discard(entry_id)
    if not entries:
        frontend.async_remove_panel(hass, PANEL_PATH)
        hass.data.pop(DATA_PANEL_ENTRIES)
