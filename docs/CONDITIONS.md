# Condition integration investigation

## Backend findings

The installed Home Assistant 2026.11 development environment exposes native
condition schema validation through `homeassistant.helpers.config_validation`
and compilation/evaluation through `homeassistant.helpers.condition`.
`async_from_config` is asynchronous and returns a condition checker;
`async_validate_condition_config` resolves entity references and recursively
validates AND, OR and NOT groups. `async_extract_entities` provides dependencies
for state listeners. These functions should be used rather than implementing
state comparison and boolean evaluation again.

The current scheduler validates and normalizes activation data synchronously in
`model.py`, and resolves plans for arbitrary dates without a Home Assistant
instance. Native compilation therefore belongs in the runtime, with asynchronous
validation before persistence. Stored condition data must remain plain JSON;
compiled checkers and native schema objects must never enter schedule storage.

Weekday, month and holiday conditions have date-oriented semantics, including
future calendar previews. A native state condition only knows the current state.
Replacing those with live conditions without a date-aware adapter would change
behavior. Preserve date-aware resolution when composing these existing rules.
Future previews must explicitly distinguish live condition assumptions from
known weekday/calendar results.

## Verification

Date-aware adapters, typed attribute comparison, invalid-condition errors,
dependency updates and checker cleanup are covered by the condition/runtime
regressions. The isolated HA instance also passed save/read/reload and UI editing
checks. Direct native frontend embedding was investigated and was not selected;
the rationale and compatibility limits are recorded below.

## Implementation decision

Reuse HA's backend schema, validation, entity dependency extraction and native
AND/OR/NOT evaluator. Date-aware weekday, month and holiday leaves are adapted to native
template conditions with private evaluation variables, so HA still evaluates the
logical expressions. Their values come from the requested date and the existing
holiday provider. Existing top-level activations remain compatible without
rewriting users' stored schedules.

Use the shared integration editor for the supported state, numeric-state, weekday, month, time, holiday and
logical group controls. HA's automation editor is not a standalone public widget:
its current source consumes condition-description context, automation clipboard
and sortable-list behavior, dialog registration and backend translations. Its
custom weekday/holiday leaves would also need dedicated editors. Blindly inserting
that element would therefore not deliver a complete working editor. No native
frontend code is copied or bundled. Direct native editor embedding remains an
unverified alternative, not a shipped feature.

Attribute expected values have explicit text, number and boolean types. State
strings remain strings. Native HA comparison semantics and validation apply.
Compiled checkers are unloaded on replacement and integration unload; stored
configuration remains JSON. The regression suites exercise live attribute changes,
invalid saves, date-aware groups, persistence and unload.

Source inspected: the native `ha-automation-condition` component in the
[HA frontend repository](https://github.com/home-assistant/frontend/blob/dev/src/panels/config/automation/condition/ha-automation-condition.ts).

## Month and time conditions

`curve_scheduler_month` requires a nonempty list of integer months 1–12. Like
weekday and holiday adapters, it evaluates the requested date in calendar and
curve previews, including draft schedules. It does not change the input axis.

The editor's `time` condition uses HA's native local-clock evaluator: `after` is
inclusive, `before` exclusive, and ranges can cross midnight. One bound can be
omitted. The runtime reevaluates on output updates; there is no dedicated timer
at the condition boundary. Native time checks receive no simulated preview clock,
so a preview for another date or point still uses the current HA time. Current
entity states are likewise assumptions, not future-state predictions. A preview
does not simulate intraday plan switches.

The month/time composition regression checks November/December selection with
22:00–06:00, including both time boundaries. The frontend regression exercises
month checkboxes and native time fields.
