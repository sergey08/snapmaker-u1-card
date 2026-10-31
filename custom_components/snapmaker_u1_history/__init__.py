"""Persistent print-history backend for Snapmaker U1 Card (development preview).

Install as a custom integration and add 'snapmaker_u1_history:' to HA YAML.
The backend deliberately does not fetch arbitrary image URLs: image persistence
will use a trusted HA camera snapshot path in a later development stage.
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

import voluptuous as vol

from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.helpers.storage import Store
from homeassistant.helpers import config_validation as cv

DOMAIN = "snapmaker_u1_history"
CONFIG_SCHEMA = vol.Schema({DOMAIN: vol.Schema({})}, extra=vol.ALLOW_EXTRA)
STORAGE_VERSION = 1
STORAGE_KEY = "snapmaker_u1_history"
DEFAULT_LIMIT = 20

SAVE_SCHEMA = vol.Schema({
    vol.Required("printer_id"): cv.string,
    vol.Required("print_id"): cv.string,
    vol.Required("name"): cv.string,
    vol.Optional("status", default="completed"): vol.In(["completed", "cancelled", "failed"]),
    vol.Optional("image_url"): cv.string,
    vol.Optional("duration_seconds"): vol.All(vol.Coerce(float), vol.Range(min=0)),
    vol.Optional("electricity_cost"): vol.All(vol.Coerce(float), vol.Range(min=0)),
    vol.Optional("material_cost"): vol.All(vol.Coerce(float), vol.Range(min=0)),
    vol.Optional("max_entries", default=DEFAULT_LIMIT): vol.All(vol.Coerce(int), vol.Range(min=1, max=200)),
})


async def async_setup(hass: HomeAssistant, config: dict[str, Any]) -> bool:
    """Set up persistent history and a service for storing completed jobs."""
    store = Store(hass, STORAGE_VERSION, STORAGE_KEY)
    payload = await store.async_load() or {"prints": {}}
    entries: dict[str, list[dict[str, Any]]] = payload.get("prints", {})
    hass.data[DOMAIN] = {"store": store, "prints": entries}

    async def save_print(call: ServiceCall) -> None:
        data = dict(call.data)
        printer_id = data.pop("printer_id").strip()
        print_id = data.pop("print_id").strip()
        if not printer_id or not print_id:
            raise vol.Invalid("printer_id and print_id cannot be empty")
        limit = data.pop("max_entries", DEFAULT_LIMIT)
        history = entries.setdefault(printer_id, [])
        record = {
            "print_id": print_id,
            "printer_id": printer_id,
            "saved_at": datetime.now(timezone.utc).isoformat(),
            **data,
        }
        if "electricity_cost" in data and "material_cost" in data:
            record["total_cost"] = round(data["electricity_cost"] + data["material_cost"], 6)
        # Idempotent: retrying a service call never creates duplicate entries.
        history[:] = [item for item in history if item.get("print_id") != print_id]
        history.insert(0, record)
        del history[limit:]
        await store.async_save({"prints": entries})

    hass.services.async_register(DOMAIN, "save_print", save_print, schema=SAVE_SCHEMA)
    return True
