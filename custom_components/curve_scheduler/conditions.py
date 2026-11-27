"""Compile JSON condition configurations using Home Assistant's evaluator."""

from __future__ import annotations

from collections.abc import Callable
from copy import deepcopy
from datetime import date
import re
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import condition, config_validation as cv
from homeassistant.helpers.condition.models import ConditionChecker

from .const import WEEKDAYS


async def async_compile_condition(
    hass: HomeAssistant, config: dict[str, Any]
) -> tuple[ConditionChecker, set[str]]:
    """Validate and compile a condition without mutating persisted JSON data."""
    validated = cv.CONDITION_SCHEMA(deepcopy(config))
    validated = await condition.async_validate_condition_config(hass, validated)
    checker = await condition.async_from_config(hass, validated)
    return checker, condition.async_extract_entities(validated)


class ScheduleCondition:
    """Native checker with date-aware variables for scheduler conditions."""

    def __init__(self, checker: ConditionChecker, date_rules: dict[str, dict[str, Any]]) -> None:
        """Keep the compiled native checker and its calendar adapters."""
        self.checker = checker
        self.date_rules = date_rules

    def async_unload(self) -> None:
        """Release native checker resources."""
        self.checker.async_unload()

    def matches(self, day: date, is_holiday: Callable[..., bool]) -> bool:
        """Evaluate native logical groups using the requested calendar date."""
        variables = {
            key: (
                WEEKDAYS[day.weekday()] in rule["days"]
                if rule["condition"] == "curve_scheduler_weekday"
                else day.month in rule["months"]
                if rule["condition"] == "curve_scheduler_month"
                else is_holiday(day, rule["source"])
            )
            for key, rule in self.date_rules.items()
        }
        return self.checker.async_check(variables=variables) is True


async def async_compile_schedule_condition(
    hass: HomeAssistant, config: dict[str, Any]
) -> tuple[ScheduleCondition, set[str]]:
    """Adapt date rules, leaving composition and entity comparisons to HA."""
    rules: dict[str, dict[str, Any]] = {}
    sources: set[str] = set()

    def adapt(node: dict[str, Any]) -> dict[str, Any]:
        kind = node.get("condition")
        if kind in ("and", "or", "not"):
            return {**node, "conditions": [adapt(child) for child in node["conditions"]]}
        if kind == "curve_scheduler_weekday":
            days = node.get("days")
            if not isinstance(days, list) or not days or any(d not in WEEKDAYS for d in days):
                raise ValueError("Select valid weekdays")
        elif kind == "curve_scheduler_month":
            months = node.get("months")
            if (
                not isinstance(months, list)
                or not months
                or any(type(m) is not int or not 1 <= m <= 12 for m in months)
            ):
                raise ValueError("Select at least one valid month")
        elif kind == "curve_scheduler_holiday":
            source = node.get("source", "")
            if not isinstance(source, str) or not re.fullmatch(
                r"(?:calendar|binary_sensor)\.[a-z0-9_]+", source
            ):
                raise ValueError("Select a calendar or Workday sensor")
            sources.add(source)
        else:
            return node
        key = f"curve_scheduler_date_rule_{len(rules)}"
        rules[key] = deepcopy(node)
        return {"condition": "template", "value_template": "{{ " + key + " }}"}

    checker, entities = await async_compile_condition(hass, adapt(deepcopy(config)))
    return ScheduleCondition(checker, rules), entities | sources
