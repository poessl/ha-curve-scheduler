"""Config and options flow for Curve Scheduler."""

from __future__ import annotations

import copy
import math
from typing import Any

from homeassistant.config_entries import (
    ConfigEntry,
    ConfigEntryState,
    ConfigFlow,
    ConfigFlowResult,
    OptionsFlow,
)
from homeassistant.const import ATTR_UNIT_OF_MEASUREMENT, CONF_NAME
from homeassistant.core import HomeAssistant, callback
from homeassistant.data_entry_flow import section
from homeassistant.helpers import selector
import probatio as vol

from .axis import axis_config
from .cadence import tick_settings
from .const import (
    AXIS_SOURCES,
    CONF_AXIS,
    CONF_HOLIDAY_SOURCE,
    CONF_INITIAL_SCHEDULE,
    CONF_INPUT,
    CONF_INTERPOLATION,
    CONF_INTERVAL,
    CONF_MAX,
    CONF_MIN,
    CONF_STEP,
    CONF_TARGET,
    CONF_TARGET_ATTRIBUTE,
    CONF_THRESHOLD,
    CONF_TICK,
    CONF_TICK_UNIT,
    CONF_TICK_VALUE,
    CONF_UNIT,
    CONF_X_MAX,
    CONF_X_MIN,
    CONF_X_STEP,
    CONF_X_WRAP,
    DEFAULT_INTERPOLATION,
    DEFAULT_INTERVAL,
    DEFAULT_MAX,
    DEFAULT_MIN,
    DEFAULT_STEP,
    DEFAULT_THRESHOLD,
    DOMAIN,
    INTERPOLATION_MODES,
    TARGET_DOMAINS,
    TICK_MAX_VALUES,
    TICK_UNITS,
)
from .model import validate_schedule
from .targets import LIGHT_TARGETS, light_bounds, light_target_options, target_key


def target_defaults(
    hass: HomeAssistant, entity_id: str, attribute: str = "brightness_pct"
) -> dict[str, Any]:
    """Derive min, max and unit from the target entity."""
    defaults: dict[str, Any] = {
        CONF_MIN: DEFAULT_MIN,
        CONF_MAX: DEFAULT_MAX,
        CONF_UNIT: "",
    }
    state = hass.states.get(entity_id) if entity_id else None
    if entity_id.startswith("light."):
        spec = LIGHT_TARGETS[attribute]
        minimum, maximum = light_bounds(state, attribute)
        return {CONF_MIN: minimum, CONF_MAX: maximum, CONF_STEP: spec.step, CONF_UNIT: spec.unit}
    if state is None:
        return defaults
    domain = entity_id.split(".", 1)[0]
    if domain in ("climate", "water_heater"):
        keys = ("min_temp", "max_temp")
        defaults[CONF_UNIT] = hass.config.units.temperature_unit
    else:
        keys = ("min", "max")
        defaults[CONF_UNIT] = state.attributes.get(ATTR_UNIT_OF_MEASUREMENT) or ""
    try:
        minimum = float(state.attributes[keys[0]])
        maximum = float(state.attributes[keys[1]])
    except KeyError, TypeError, ValueError:
        return defaults
    if minimum < maximum:
        defaults[CONF_MIN] = minimum
        defaults[CONF_MAX] = maximum
    return defaults


def _target_selector() -> selector.EntitySelector:
    return selector.EntitySelector(selector.EntitySelectorConfig(domain=TARGET_DOMAINS))


def _light_schema(hass: HomeAssistant, entity_id: str, attribute: str) -> vol.Schema:
    options = light_target_options(hass.states.get(entity_id))
    return vol.Schema(
        {
            vol.Required(
                CONF_TARGET_ATTRIBUTE, default=attribute if attribute in options else options[0]
            ): selector.SelectSelector(
                selector.SelectSelectorConfig(
                    options=options,
                    translation_key="target_attribute",
                    mode=selector.SelectSelectorMode.DROPDOWN,
                )
            ),
        }
    )


def _entry_target_key(entry: ConfigEntry) -> str:
    options = {**entry.data, **entry.options}
    return target_key(
        options.get(CONF_TARGET, ""), options.get(CONF_TARGET_ATTRIBUTE, "brightness_pct")
    )


def _number(minimum: float, maximum: float) -> selector.NumberSelector:
    return selector.NumberSelector(
        selector.NumberSelectorConfig(
            min=minimum, max=maximum, step="any", mode=selector.NumberSelectorMode.BOX
        )
    )


def settings_schema(values: dict[str, Any], include_target: bool) -> vol.Schema:
    """Build the schema of the settings step."""
    fields: dict[Any, Any] = {}
    tick_value, tick_unit = tick_settings(values)
    if include_target:
        fields[
            vol.Optional(CONF_TARGET, description={"suggested_value": values.get(CONF_TARGET)})
        ] = _target_selector()
    fields.update(
        {
            vol.Optional(
                CONF_TICK_VALUE,
                default=tick_value,
            ): _number(1, TICK_MAX_VALUES["seconds"]),
            vol.Optional(CONF_TICK_UNIT, default=tick_unit): selector.SelectSelector(
                selector.SelectSelectorConfig(options=TICK_UNITS, translation_key="tick_unit")
            ),
            vol.Optional(
                CONF_INTERPOLATION,
                default=values.get(CONF_INTERPOLATION, DEFAULT_INTERPOLATION),
            ): selector.SelectSelector(
                selector.SelectSelectorConfig(
                    options=INTERPOLATION_MODES,
                    translation_key="interpolation",
                    mode=selector.SelectSelectorMode.LIST,
                )
            ),
            vol.Optional("x_label_step", default=values.get("x_label_step", 0)): _number(0, 1e12),
            vol.Optional("y_label_step", default=values.get("y_label_step", 0)): _number(0, 1e12),
            vol.Optional(CONF_MIN, default=values.get(CONF_MIN, DEFAULT_MIN)): _number(
                -10000, 10000
            ),
            vol.Optional(CONF_MAX, default=values.get(CONF_MAX, DEFAULT_MAX)): _number(
                -10000, 10000
            ),
            vol.Optional(CONF_STEP, default=values.get(CONF_STEP, DEFAULT_STEP)): _number(
                0.001, 1000
            ),
            vol.Optional(
                CONF_UNIT, description={"suggested_value": values.get(CONF_UNIT, "")}
            ): selector.UnitOfMeasurementSelector(),
            vol.Optional("watch_target", default=values.get("watch_target", False)): bool,
            vol.Optional(
                CONF_THRESHOLD, default=values.get(CONF_THRESHOLD, DEFAULT_THRESHOLD)
            ): _number(0, 1000),
        }
    )
    axis = axis_config(values)
    fields[vol.Optional("input_decimals", default=values.get("input_decimals", 2))] = (
        selector.NumberSelector(
            selector.NumberSelectorConfig(
                min=0, max=6, step=1, mode=selector.NumberSelectorMode.BOX
            )
        )
    )
    if axis["source"] == "sensor":
        fields.update(
            {
                vol.Optional(CONF_X_MIN, default=axis["min"]): _number(-1e12, 1e12),
                vol.Optional(CONF_X_MAX, default=axis["max"]): _number(-1e12, 1e12),
                vol.Optional(CONF_X_STEP, default=axis["step"]): _number(1e-6, 1e12),
                vol.Optional(CONF_X_WRAP, default=axis["wrap"]): selector.BooleanSelector(),
            }
        )
        fields[
            vol.Required(CONF_INPUT, description={"suggested_value": values.get(CONF_INPUT)})
        ] = selector.EntitySelector(
            selector.EntitySelectorConfig(domain=["sensor", "input_number", "number"])
        )
    groups = {
        "input": [CONF_INPUT, CONF_X_MIN, CONF_X_MAX, CONF_X_STEP, CONF_X_WRAP, "input_decimals"],
        "output": [
            CONF_TICK_VALUE,
            CONF_TICK_UNIT,
            CONF_INTERPOLATION,
            CONF_MIN,
            CONF_MAX,
            CONF_STEP,
            CONF_UNIT,
        ],
        "target": [CONF_TARGET, "watch_target", CONF_THRESHOLD],
        "graph": ["x_label_step", "y_label_step"],
    }
    if not include_target and not values.get(CONF_TARGET):
        groups.pop("target")
    sections: dict[Any, Any] = {}
    for group, names in groups.items():
        group_fields = {key: fields[key] for name in names for key in fields if key == name}
        if not group_fields:
            continue
        # HA initializes section data from the outer default, not its nested fields.
        defaults = {
            str(key): key.default() for key in group_fields if key.default is not vol.UNDEFINED
        }
        defaults.update(
            {
                str(key): values[str(key)]
                for key in group_fields
                if str(key) in values and values[str(key)] not in (None, "")
            }
        )
        sections[vol.Optional(group, default=defaults)] = section(
            vol.Schema(group_fields),
            {"collapsed": group == "target" and not values.get(CONF_TARGET)},
        )
    return vol.Schema(sections)


def flatten_settings(user_input: dict[str, Any]) -> dict[str, Any]:
    """Flatten UI sections while accepting legacy flat settings submissions."""
    return {
        name: value
        for key, item in user_input.items()
        for name, value in (
            item.items()
            if key in ("input", "target", "output", "graph") and isinstance(item, dict)
            else [(key, item)]
        )
    }


def validate_settings(user_input: dict[str, Any]) -> dict[str, str]:
    """Validate the settings step; return form errors."""
    errors: dict[str, str] = {}
    if float(user_input[CONF_MIN]) >= float(user_input[CONF_MAX]):
        errors[CONF_MAX] = "max_not_greater"
    if float(user_input[CONF_STEP]) <= 0:
        errors[CONF_STEP] = "step_positive"
    if float(user_input.get(CONF_THRESHOLD, DEFAULT_THRESHOLD)) < 0:
        errors[CONF_THRESHOLD] = "threshold_negative"
    tick = user_input.get(
        CONF_TICK_VALUE,
        user_input.get(CONF_TICK, user_input.get(CONF_INTERVAL, DEFAULT_INTERVAL)),
    )
    unit = user_input.get(
        CONF_TICK_UNIT,
        "seconds" if CONF_TICK_VALUE in user_input or CONF_TICK in user_input else "minutes",
    )
    if unit not in TICK_UNITS:
        errors[CONF_TICK_UNIT] = "invalid_tick_unit"
    elif (
        isinstance(tick, bool)
        or not isinstance(tick, (int, float))
        or not math.isfinite(tick)
        or not 1 <= tick <= TICK_MAX_VALUES[unit]
        or (unit == "months" and tick != int(tick))
    ):
        errors[CONF_TICK_VALUE] = "invalid_tick"
    source = user_input.get(CONF_AXIS, "time_of_day")
    if source not in AXIS_SOURCES:
        errors[CONF_AXIS] = "invalid_axis"
        return errors
    decimals = user_input.get("input_decimals", 2)
    if (
        isinstance(decimals, bool)
        or not isinstance(decimals, (int, float))
        or not math.isfinite(decimals)
        or not 0 <= decimals <= 6
        or decimals != int(decimals)
    ):
        errors["input_decimals"] = "invalid_input_decimals"
    try:
        axis = axis_config(user_input)
        if (
            not all(math.isfinite(axis[k]) for k in ("min", "max", "step"))
            or axis["min"] >= axis["max"]
            or axis["step"] <= 0
            or axis["step"] > axis["max"] - axis["min"]
        ):
            errors[CONF_X_MAX] = "invalid_axis"
    except TypeError, ValueError:
        errors[CONF_X_MAX] = "invalid_axis"
    if source == "sensor" and not user_input.get(CONF_INPUT):
        errors[CONF_INPUT] = "input_required"
    label_axis = axis_config(user_input) if CONF_X_MAX not in errors else None
    if (
        source == "sensor"
        and user_input.get(CONF_INPUT) == user_input.get(CONF_TARGET)
        and user_input.get(CONF_INPUT)
    ):
        errors[CONF_INPUT] = "input_is_target"
    for key, span in (
        ("x_label_step", label_axis["max"] - label_axis["min"] if label_axis else 0),
        ("y_label_step", float(user_input[CONF_MAX]) - float(user_input[CONF_MIN])),
    ):
        value = float(user_input.get(key, 0))
        if not math.isfinite(value) or value < 0 or (value > 0 and span / value > 100):
            errors[key] = "invalid_label_step"
    for key in (CONF_MIN, CONF_MAX, CONF_STEP, CONF_THRESHOLD):
        if not math.isfinite(float(user_input.get(key, DEFAULT_THRESHOLD))):
            errors[key] = "invalid_number"
    return errors


def clean_settings(user_input: dict[str, Any]) -> dict[str, Any]:
    """Normalize numeric types and optional fields."""
    result = {CONF_THRESHOLD: DEFAULT_THRESHOLD, **user_input}
    result["input_decimals"] = int(result.get("input_decimals", 2))
    tick_value, tick_unit = tick_settings(result)
    result[CONF_TICK_VALUE] = tick_value
    result[CONF_TICK_UNIT] = tick_unit
    result.pop(CONF_TICK, None)
    result.pop(CONF_INTERVAL, None)
    for key in (CONF_MIN, CONF_MAX, CONF_STEP, CONF_THRESHOLD):
        result[key] = float(result[key])
    if result.get(CONF_AXIS, "time_of_day") != "sensor":
        for key in (CONF_INPUT, CONF_X_MIN, CONF_X_MAX, CONF_X_STEP, CONF_X_WRAP):
            result.pop(key, None)
    result[CONF_UNIT] = (result.get(CONF_UNIT) or "").strip()
    result[CONF_HOLIDAY_SOURCE] = result.get(CONF_HOLIDAY_SOURCE) or None
    return result


class CurveSchedulerConfigFlow(ConfigFlow, domain=DOMAIN):
    """Handle the initial setup."""

    VERSION = 1
    MINOR_VERSION = 1

    def __init__(self) -> None:
        """Initialize the flow."""
        self._name: str = ""
        self._target: str = ""
        self._target_attribute = "brightness_pct"
        self._axis = "time_of_day"

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Ask for name and target entity."""
        errors: dict[str, str] = {}
        if user_input is not None:
            self._name = user_input[CONF_NAME].strip()
            self._target = user_input.get(CONF_TARGET) or ""
            self._axis = user_input.get(CONF_AXIS, "time_of_day")
            if not self._name:
                errors[CONF_NAME] = "name_required"
            else:
                if self._target.startswith("light."):
                    return await self.async_step_light_target()
                if self._target:
                    if any(
                        entry.data.get(CONF_TARGET) == self._target
                        for entry in self._async_current_entries()
                    ):
                        return self.async_abort(reason="already_configured")
                    await self.async_set_unique_id(self._target)
                    self._abort_if_unique_id_configured()
                return await self.async_step_settings()
        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_NAME, default=self._name): selector.TextSelector(),
                    vol.Optional(CONF_TARGET): _target_selector(),
                    vol.Required(CONF_AXIS, default=self._axis): selector.SelectSelector(
                        selector.SelectSelectorConfig(
                            options=AXIS_SOURCES, translation_key="axis_source"
                        )
                    ),
                }
            ),
            errors=errors,
        )

    async def async_step_light_target(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Choose one supported numeric light control before setting output limits."""
        if not light_target_options(self.hass.states.get(self._target)):
            return self.async_abort(reason="light_not_dimmable")
        if user_input is not None:
            self._target_attribute = user_input[CONF_TARGET_ATTRIBUTE]
            key = target_key(self._target, self._target_attribute)
            if any(_entry_target_key(entry) == key for entry in self._async_current_entries()):
                return self.async_abort(reason="already_configured")
            await self.async_set_unique_id(key)
            self._abort_if_unique_id_configured()
            return await self.async_step_settings()
        return self.async_show_form(
            step_id="light_target",
            data_schema=_light_schema(self.hass, self._target, self._target_attribute),
        )

    async def async_step_clone(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Create an independent curve from a loaded instance's saved state."""
        user_input = user_input or {}
        source = self.hass.config_entries.async_get_entry(user_input.get("entry_id", ""))
        if source is None or source.domain != DOMAIN or source.state is not ConfigEntryState.LOADED:
            return self.async_abort(reason="entry_not_found")
        name = user_input.get(CONF_NAME, "")
        if not isinstance(name, str) or not name.strip() or len(name) > 100:
            return self.async_abort(reason="name_required")
        schedule = copy.deepcopy(source.runtime_data.data)
        schedule.update(enabled=False, override=None, revision=1)
        data = copy.deepcopy(dict(source.data))
        name = name.strip()
        data.update({CONF_NAME: name, CONF_INITIAL_SCHEDULE: schedule})
        return self.async_create_entry(
            title=name, data=data, options=copy.deepcopy(dict(source.options))
        )

    async def async_step_settings(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Ask for the remaining settings."""
        errors: dict[str, str] = {}
        if user_input is not None:
            user_input = {CONF_AXIS: self._axis, **flatten_settings(user_input)}
            if self._target.startswith("light."):
                user_input[CONF_TARGET_ATTRIBUTE] = self._target_attribute
            errors = validate_settings({**user_input, CONF_TARGET: self._target})
            if not errors:
                return self.async_create_entry(
                    title=self._name,
                    data={CONF_NAME: self._name, CONF_TARGET: self._target},
                    options=clean_settings(user_input),
                )
            values = {**user_input, CONF_TARGET: self._target}
        else:
            values = {
                **target_defaults(self.hass, self._target, self._target_attribute),
                CONF_AXIS: self._axis,
                CONF_TARGET: self._target,
            }
        return self.async_show_form(
            step_id="settings",
            data_schema=settings_schema(values, include_target=False),
            errors=errors,
            description_placeholders={"name": self._name},
        )

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> OptionsFlow:
        """Return the options flow."""
        return CurveSchedulerOptionsFlow()


class CurveSchedulerOptionsFlow(OptionsFlow):
    """Change settings after setup."""

    def __init__(self) -> None:
        """Keep the selected axis separate from its dependent settings."""
        self._axis = "time_of_day"
        self._target = ""
        self._target_attribute = "brightness_pct"
        self._pending_settings: dict[str, Any] | None = None

    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Select the axis before building fields which depend on it."""
        if user_input is not None:
            self._axis = user_input[CONF_AXIS]
            if self._target.startswith("light."):
                return await self.async_step_light_target()
            return await self.async_step_settings()
        self._axis = self.config_entry.options.get(CONF_AXIS, "time_of_day")
        self._target = self.config_entry.data.get(CONF_TARGET, "")
        self._target_attribute = self.config_entry.options.get(
            CONF_TARGET_ATTRIBUTE, "brightness_pct"
        )
        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_AXIS, default=self._axis): selector.SelectSelector(
                        selector.SelectSelectorConfig(
                            options=AXIS_SOURCES, translation_key="axis_source"
                        )
                    )
                }
            ),
        )

    async def async_step_light_target(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Select the light control before building its dependent settings."""
        if not light_target_options(self.hass.states.get(self._target)):
            return self.async_abort(reason="light_not_dimmable")
        if user_input is not None:
            self._target_attribute = user_input[CONF_TARGET_ATTRIBUTE]
            return await self.async_step_settings()
        return self.async_show_form(
            step_id="light_target",
            data_schema=_light_schema(self.hass, self._target, self._target_attribute),
        )

    async def async_step_settings(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Show only the settings applicable to the selected axis."""
        errors: dict[str, str] = {}
        if user_input is not None:
            user_input = {**flatten_settings(user_input), CONF_AXIS: self._axis}
            target = user_input.get(CONF_TARGET) or ""
            if target.startswith("light.") and target != self._target:
                self._target = target
                self._target_attribute = "brightness_pct"
                self._pending_settings = user_input
                return await self.async_step_light_target()
            if target.startswith("light."):
                user_input[CONF_TARGET_ATTRIBUTE] = self._target_attribute
            else:
                user_input.pop(CONF_TARGET_ATTRIBUTE, None)
            errors = validate_settings(user_input)
            key = target_key(target, self._target_attribute)
            if (
                target
                and key != _entry_target_key(self.config_entry)
                and any(
                    _entry_target_key(entry) == key and entry.entry_id != self.config_entry.entry_id
                    for entry in self.hass.config_entries.async_entries(DOMAIN)
                )
            ):
                errors[CONF_TARGET] = "target_in_use"
            candidate_axis = axis_config(user_input) if not errors else None
            runtime = self.config_entry.runtime_data
            if (
                candidate_axis
                and candidate_axis["source"] != "time_of_day"
                and "curve" in runtime.data
            ) and validate_schedule(
                runtime.data,
                float(user_input[CONF_MIN]),
                float(user_input[CONF_MAX]),
                candidate_axis,
            ):
                errors[CONF_X_MAX] = "curve_out_of_range"
            if not errors:
                options = clean_settings(user_input)
                target = options.pop(CONF_TARGET, "") or ""
                if key != _entry_target_key(self.config_entry):
                    self.hass.config_entries.async_update_entry(
                        self.config_entry,
                        data={**self.config_entry.data, CONF_TARGET: target},
                        unique_id=key or None,
                    )
                return self.async_create_entry(data=options)
            values = {**user_input}
        else:
            values = {
                **target_defaults(self.hass, self.config_entry.data.get(CONF_TARGET, "")),
                **self.config_entry.options,
                CONF_TARGET: self.config_entry.data.get(CONF_TARGET, ""),
            }
            if self._pending_settings is not None:
                values.update(self._pending_settings)
                self._pending_settings = None
            if self._target.startswith("light."):
                if target_key(self._target, self._target_attribute) != _entry_target_key(
                    self.config_entry
                ):
                    values.update(target_defaults(self.hass, self._target, self._target_attribute))
                values[CONF_TARGET] = self._target
                values[CONF_TARGET_ATTRIBUTE] = self._target_attribute
            if self._axis != values.get(CONF_AXIS, "time_of_day"):
                for key in (
                    CONF_INPUT,
                    CONF_X_MIN,
                    CONF_X_MAX,
                    CONF_X_STEP,
                    CONF_X_WRAP,
                    "x_label_step",
                ):
                    values.pop(key, None)
            values[CONF_AXIS] = self._axis
        return self.async_show_form(
            step_id="settings",
            data_schema=settings_schema(values, include_target=True),
            errors=errors,
        )
