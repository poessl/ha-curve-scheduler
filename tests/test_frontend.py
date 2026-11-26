"""Test that the card is served and registered automatically."""

from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock

from homeassistant.components.frontend import DATA_EXTRA_MODULE_URL
from homeassistant.core import HomeAssistant

from custom_components.curve_scheduler.frontend import async_register_frontend


async def test_register_frontend(hass: HomeAssistant) -> None:
    hass.http = MagicMock()
    hass.http.async_register_static_paths = AsyncMock()
    hass.data[DATA_EXTRA_MODULE_URL] = set()

    await async_register_frontend(hass)
    await async_register_frontend(hass)  # second call is a no-op

    hass.http.async_register_static_paths.assert_awaited_once()
    config = hass.http.async_register_static_paths.call_args[0][0][0]
    assert config.url_path == "/curve_scheduler_static/curve-scheduler-card.js"
    assert config.path.endswith("frontend/curve-scheduler-card.js")
    (url,) = hass.data[DATA_EXTRA_MODULE_URL]
    assert url.startswith("/curve_scheduler_static/curve-scheduler-card.js?v=")


async def test_shared_panel_lifecycle(hass: HomeAssistant) -> None:
    """Multiple entries share one panel, removed only after the last unload."""
    from unittest.mock import patch

    from custom_components.curve_scheduler.frontend import (
        DATA_REGISTERED,
        async_register_editor_panel,
        async_unregister_editor_panel,
    )

    module_url = "/curve_scheduler_static/curve-scheduler-card.js?v=test"
    hass.data[DATA_REGISTERED] = module_url
    with (
        patch(
            "custom_components.curve_scheduler.frontend.panel_custom.async_register_panel"
        ) as register,
        patch("custom_components.curve_scheduler.frontend.frontend.async_remove_panel") as remove,
    ):
        await async_register_editor_panel(hass, "first")
        await async_register_editor_panel(hass, "first")
        await async_register_editor_panel(hass, "second")
        register.assert_awaited_once()
        assert register.call_args.kwargs["module_url"] == module_url
        assert register.call_args.kwargs["webcomponent_name"] == "curve-scheduler-panel"
        assert "config_panel_domain" not in register.call_args.kwargs
        async_unregister_editor_panel(hass, "first")
        remove.assert_not_called()
        async_unregister_editor_panel(hass, "second")
        remove.assert_called_once_with(hass, "curve-scheduler")
        await async_register_editor_panel(hass, "third")
        assert register.await_count == 2


async def test_device_links_to_editor(hass: HomeAssistant, target: str) -> None:
    from homeassistant.helpers import device_registry as dr

    from .conftest import make_entry, setup_entry

    entry = await setup_entry(hass, make_entry())
    device = dr.async_get(hass).async_get_device(identifiers={("curve_scheduler", entry.entry_id)})
    assert device.configuration_url == f"homeassistant://curve-scheduler?entry_id={entry.entry_id}"
