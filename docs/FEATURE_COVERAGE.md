# User documentation coverage

Audit against the working-tree implementation. English and German READMEs use
separate user/developer guide sections. The entries below refer to the English
user guide; corresponding German sections cover the same workflows.

| Delivered feature | README coverage |
| --- | --- |
| HACS/manual install, fork requirements, resource registration | Installation and introduction |
| Administrator setup, target types and optional target | Setup settings table |
| Time/sensor/week/month inputs, defaults, snapping, labels, limits, wrapping | Setup; Use a weekly, sensor or seasonal curve |
| Continuous weekly coordinates, fractional days, Sunday/Monday wrap and weekday labels | Weekly example; input comparison table |
| Axis input versus condition-based plan selection | Activations example; weekly example |
| Four interpolations, midnight continuity, local DST | How the value is calculated |
| Plans, point editing, touch, keyboard, colors, duplication and validation limits | Editing → Plans |
| Ordered weekday, calendar and Workday activations | Editing → Activations |
| Entity states/attributes, typed expected values and exclusive numeric bounds | Editing → Activations |
| Month checkbox conditions and native local-time ranges, including overnight and boundary timing | Editing → Activations |
| Nested AND/OR/NOT and date-aware weekday/month/holiday leaves | Editing → Activations |
| Preview limitations: current entity states and live clock, no simulated intraday switches | Editing → Activations; Developer architecture |
| Manual mode, expiry, precedence, inclusive exceptions and overlap priority | Active plan; Activations; Exceptions; Calculation; Actions |
| Save/discard/undo/redo, unsaved changes and conflicts | Saving; Sidebar editor; Features |
| Sidebar/card access, authenticated editing and admin-only setup/clone | Setup; optional card; WebSocket API |
| Compact/full/graph views, independent editor and display controls, YAML example | Add the card (optional) |
| Whole-curve clone and disabled start | Clone a whole curve |
| Target watching, additive offset, per-plan opt-out and dashed output graphs | Keep manual target adjustments; Active plan; sensor/seasonal examples |
| Persistence, target changes, watching off, offline changes | Keep manual target adjustments |
| Raw/adjusted/offset sensors and stable old sensor identity | Entities; Keep manual target adjustments |
| Clear offset by UI or automation action | Keep manual target adjustments; Actions |
| Enable switch, mode select, apply button | Entities |
| Write tick, immediate updates, threshold, unavailable target | When is the value written? |
| Sensor input unavailable and sensor-only automation use | Use a weekly, sensor or seasonal curve |
| One-hour values: calendar progression versus current sensor/live-condition assumptions | Entities |
| User automation actions and example | Actions |
| Runtime architecture, native reuse limits and storage | Developer guide; CONDITIONS.md; OFFSET.md |
| WebSocket API and authorization | Developer guide → WebSocket API |
| Toolchain, builds, isolated HA and releases | Developer guide → Setup and validation |

## Screenshot coverage

`frontend/demo/screenshots.cjs` captures matching English and German images from
fixed local fixtures: active plan, dark mobile, desktop/mobile plans, activations,
exceptions, sidebar, and time-of-day, weekly, sensor and seasonal curves. Light
time graphs carry +5 °C, dark mobile −3 °C, sensor −6 °C, weekly −2 °C and seasonal
+4 °C. Captures wait for the offset path and use a fixed
Europe/Berlin timezone. The editing graph shows unadjusted points. These captures illustrate a subset
of the condition types; they do not show the month/time
condition controls.

## Scope of this audit

Checked against config/options flows, card settings and rendering, shared editor,
condition/model validation, runtime, sensors, services and WebSocket registration.
The second pass additionally checked month/time controls and condition compilation,
weekly input defaults and progression, weekday graph labels, and their regression
tests (`test_conditions.py`, `test_axis.py` and frontend editor tests).
Both READMEs include original-project thanks, the Codex/GPT-6.1 sol advisory,
and complete user/developer sections. Technical contracts remain in English.
Outstanding verification is tracked in TASKS.md, not implied by coverage here.
