# Curve Scheduler task checklist

Planning baseline: the working tree on 2026-11-26, including all current
uncommitted changes. Condition and offset work preceded the consolidated README
phase. The checkpoint below records the original implementation session; the
2026-11-27 checkpoint records the final commit preparation.


Verification checkpoint (2026-11-26): full backend suite **130 passed**;
frontend suite **98 passed** before the latest clear-offset test, and the
updated editor suite **25 passed**. Ruff, formatting, mypy and TypeScript
checks have passed for the implemented changes. Evidence lives in
`tests/test_conditions.py`, `tests/test_offset.py`, the existing activation/runtime
suites and `frontend/test/editor.test.ts`. Later changes still require final checks.
Live HA check: signed into the isolated instance on port 8124 and verified the
sidebar editor renders the value/offset controls, per-plan Apply offset toggle
and entity-condition activation option. Live API save/read/reload on the disabled Acceptance conditions clone preserved
an entity condition and plan offset flag and selected the matching plan. Existing
curves were left unchanged. See docs/ACCEPTANCE.md.
Unchecked items may be partially implemented; they remain open when their full
validation or delivery scope is unfinished. At that checkpoint, no commits or pushes had been made.

## 1. Add entity-state and attribute activation conditions

### Investigate native Home Assistant reuse

- [x] Inspect the native backend condition schema, validation and evaluation APIs
  for the Home Assistant version supported by this repository.
- [x] Investigate embedding the native automation/script condition editor,
  selectors and condition models in both the sidebar and dashboard editor.
  Check component loading, required context, nested conditions, translations,
  accessibility and compatibility risks from frontend internals.
- [x] Separate the feasibility of backend reuse from frontend reuse: record what
  can be reused directly, what needs a small adapter and what is unsupported.
- [x] Prototype one condition end to end: choose an entity, optionally choose a
  state attribute, enter an expected value, save, reload and select a plan when
  it matches. Verify it inside real Home Assistant; the demo alone is insufficient.
- [x] Record a concrete reuse decision with its limitations. Prefer native
  behavior where feasible; otherwise implement the smallest compatible editor
  and evaluator without copying the automation/script subsystem.

### Implement and validate

- [x] Add configurable comparisons of entity states or state attributes against
  expected values. Define supported value types and comparison behavior,
  including string states, numeric attributes and missing attributes.
- [x] Validate conditions on the backend and return actionable, translated
  errors. Handle removed entities and unknown/unavailable values explicitly.
- [x] Persist conditions and round-trip them through save/load, WebSocket data,
  cloning and the frontend model without losing configuration.
- [x] Reevaluate on relevant entity state/attribute changes; update subscriptions
  when configuration changes and clean them up on unload.
- [x] Preserve activation ordering and plan precedence:
  manual mode > date exception > first matching activation > first plan.
- [x] Define how live conditions interact with time curves spanning midnight,
  future-day previews and the month overview. Do not present unknown future
  entity states as certain predictions.
- [x] Test state and attribute matches/nonmatches, typed values, unavailable or
  missing inputs, save/reload, live reevaluation, precedence and cleanup.

## 2. Investigate moving existing activations into native condition composition

Depends on the reuse decision in section 1.

- [x] Map the two existing activation types—multi-weekday and holiday calendar /
  Workday sensor—to native conditions or minimal adapters.
- [x] Verify semantic parity: multiple selected weekdays, calendar events marking
  a day off, Workday matching `off`, local dates and activation order.
- [x] Determine whether both can appear inside nested AND/OR expressions in the
  reused framework. Define NOT support if it comes with that framework.
- [x] If feasible, implement composition and editing without changing the
  first-matching activation rule or the plan attached to each activation.
- [x] If a condition cannot be represented faithfully, document the limitation
  and retain its existing behavior rather than silently changing its meaning.
- [x] Migrate existing activations without user re-entry; preserve ordering,
  referenced plans and holiday sources through restart and cloning.
- [x] Test nested combinations, migration parity, invalid expressions,
  live updates and both editor surfaces.

## 3. Watch target changes and retain a persistent curve offset

### Define the value contract

- [x] Add an optional setting to watch the curve's target for external changes.
- [x] Define the sensor names and calculation stages consistently:
  **Raw curve value** for the curve output before the manual offset,
  **Offset** for the persisted additive adjustment, and **Curve value** for
  the output after applying it.
- [x] Resolve how these names relate to today's rounded setpoint and existing
  unrounded `raw_value` attribute. Specify interpolation, offset application,
  clamping and rounding order so sensors, previews and target writes agree.
- [x] On a genuine external numeric target change, replace the offset with
  `new target value - raw curve value at the change`, not the difference from
  the already adjusted output and not an accumulated delta.
- [x] Keep one additive offset per curve across input modes. Do not scale it or
  modify saved plan points.
- [x] Add an **Apply offset** configuration toggle to each plan, defaulting to on
  for existing and new plans. When off, bypass the offset for that plan without
  clearing the persisted value; apply it again when an opted-in plan becomes
  active. Persist the flag through save/reload, duplication and cloning, expose
  it in both editors, and cover transitions, sensors and writes in tests.
- [x] Keep it across curve updates, plan switches, saves, reloads and Home
  Assistant restarts until explicitly cleared through the UI or an action.
- [x] Decide and document behavior when watching is disabled, the curve is
  disabled, the target changes, no target exists, or a whole curve is cloned.
  Specify whether startup reconciles a target change made while HA was offline.

### Implement backend behavior and persistence

- [x] Extend the existing target-state listener and target-value reader in
  `runtime.py`; watch numeric states for number entities and the writable
  setpoint attribute for climate/water-heater targets, rather than their
  operating state or measured temperature.
- [x] Compare against the runtime calculation underlying the raw output sensor
  at the event time; avoid stale sensor state and periodic-update races.
- [x] Distinguish the integration's own writes and delayed device acknowledgments
  from external adjustments. Prevent feedback loops and offset drift, including
  target rounding and precision differences.
- [x] Ignore unrelated attribute updates and invalid, nonnumeric, unknown or
  unavailable readings. Handle target recovery without manufacturing an offset.
- [x] Apply the persisted offset to subsequent output calculations and writes,
  including Save, Apply now, mode changes and periodic ticks. Preserve enable,
  availability and write-threshold behavior.
- [x] Persist the offset using the existing HA storage helper and migration
  path. Existing installations start with a zero offset.
- [x] Add the offset and adjusted-value sensors. Rename the existing setpoint
  display name to Raw curve value while preserving stable identity where
  possible; explicitly handle any necessary entity migration.
- [x] Expose values and the watching setting through config/options and the
  existing live WebSocket payload, including both frontend models and demo data.
- [x] Add a translated action to clear the offset for a selected curve. Persist
  zero, publish updated values and apply the resulting target value according to
  the defined write rules without recapturing the reset as an external change.

### Implement controls and verify behavior

- [x] Show Raw curve value, Offset and Curve value clearly in the card and
  sidebar, and provide an accessible control to clear the offset.
- [x] Distinguish manual plan selection from manual value adjustment in labels
  and status messages; keep translations consistent in English and German.
- [x] Test this acceptance sequence: raw value 45, external target change to 48
  gives offset +3; raw value later becomes 50 and target becomes 53; changing
  to another opted-in plan retains +3; an opted-out plan uses its raw value; restart retains +3; clearing through either UI or action
  restores zero and the current unadjusted curve output.
- [x] Test a second external adjustment replaces the offset correctly, negative
  offsets, clipping/rounding, repeated acknowledgments, concurrent ticks,
  unavailable inputs/targets, disabled curves, target changes and cloning.
- [x] Verify backend behavior, persistence, sensor identity, service validation,
  WebSocket updates and both frontend surfaces with appropriate regression tests.

## 4. Consolidate README structure, screenshots and feature coverage

Do this phase last, after behavior and UI are settled. Use the current edited
README as the starting point and describe only features actually delivered.

### Current English README outline and section summaries

The inspected working-tree README currently has this structure:

| Section | Current coverage |
| --- | --- |
| Introduction, fork notice and screenshots | Purpose, fork differences, HA requirement, links, plans and example uses. |
| Features | Editing, interpolation, activation rules, manual mode, saving, supported targets and UI support. |
| Installation → HACS / Manual | Install the fork, restart HA and automatically register the card resource. |
| Setup → Sidebar editor / Clone / Optional card | Administrator settings and defaults, editor entry points, copying curves and dashboard configuration. |
| Using the card → Today / Plans / Activations / Exceptions / Saving | Routine editing, keyboard controls, ordered weekday/holiday matching, date ranges and save conflicts. Much also applies to the sidebar. |
| How the value is calculated | Midnight continuity, plan precedence, interpolation, DST, limits and rounding; also backend/frontend implementation and test-vector details. |
| When is the value written? | Periodic and immediate updates, thresholds, enabled state and target availability. |
| Entities | Setpoint/profile sensors, active switch, mode select and Apply now button. |
| Use a sensor or seasonal curve → Heating example / Limits or repeat / Graph readability | Alternative inputs, sensor-only use, wrapping and graph settings. |
| Actions (services) | User automation actions and an away-mode YAML example. |
| Websocket API | Internal frontend commands and authorization statement. |
| Development | Toolchain, checks/build, deterministic demo, local HA instances, acceptance testing and releases. |
| License | MIT. |

- [x] Recheck this outline against the final working tree before rewriting.
- [x] Fix the audience boundaries: move interpolation code/test-vector details,
  storage/migration internals, component loading and WebSocket reference into
  dedicated developer sections. Keep practical calculations and upgrade effects
  in user sections.
- [x] Replace the card-only framing of shared workflows with instructions that
  cover both sidebar and dashboard editing. Keep installation/setup separate
  from everyday use and advanced automation reference.

### Proposed outline and coverage

Use two explicit audience sections, with shared project identification and
license outside them. Keep user-facing automation examples in the user guide.

| Proposed section | What it should cover |
| --- | --- |
| Introduction | What curves solve, concise fork notice, requirements, language/install links and representative screenshots. |
| User guide → Install and first curve | HACS/manual installation, administrator setup, optional target, sidebar entry and optional dashboard card; a short working example. |
| User guide → Inputs and curve editing | Time/sensor/month inputs, plans, transitions, wrapping/clamping, points, exact fields, touch/keyboard editing and axis settings. |
| User guide → Choose the active plan | Ordered activations, state/attribute conditions, supported logical composition, holidays/Workday, exceptions, manual mode and fallback priority. |
| User guide → Target control and manual adjustments | Watching, additive offset example, persistence, clear controls/action, disabled state, limits, rounding and availability. |
| User guide → Save and manage curves | Save/discard/undo/redo, conflicts, multiple editors, configuration, duplication versus whole-curve cloning and access rights. |
| User guide → Entities and automation actions | Raw/adjusted/offset sensors and attributes, switches/selects/buttons, action fields and practical YAML examples. |
| User guide → Calculation, updates and troubleshooting | Midnight/DST behavior, write timing/thresholds, unavailable values, surprising plan selection, offset troubleshooting and upgrade effects. |
| Developer guide → Setup and validation | Supported toolchain, dependencies, backend/frontend checks, build and isolated HA development. |
| Developer guide → Architecture and extension points | Runtime/model/storage responsibilities, condition integration, offset lifecycle and backend/preview consistency. |
| Developer guide → APIs and migrations | WebSocket schemas/permissions, storage and entity compatibility, condition migration and sensor naming decisions. |
| Developer guide → Demo, screenshots and releases | Deterministic fixtures, capture procedure, acceptance checks and release packaging. |
| License | MIT. |

- [x] Rewrite the English README around this user-first outline, keeping
  developer material exclusively in its dedicated section or linked developer docs.
- [x] Review the introduction/features against the actual implementation; remove
  stale claims and avoid turning the fork notice into a duplicate user guide.

### Make screenshots demonstrate why curves are useful

- [x] Update the existing deterministic demo fixtures to use **curved
  interpolation**, well-spaced points and visibly changing slopes. Avoid tightly
  clustered points and mostly flat/step-like graphs that resemble a native
  Schedule helper.
- [x] Choose representative time, sensor and seasonal examples whose curves
  visibly explain gradual output changes; keep values plausible and legible.
- [x] Refresh desktop/mobile and light/dark captures for Today, plans,
  activations and sidebar views as needed. Include the completed condition and
  offset UI where useful, using local demo data only.
- [x] Check screenshot crops, text size, curve shape, alt text and linked asset
  paths. Confirm the images reflect the delivered UI and new terminology.
- [x] Include useful existing assets and replace obsolete ones deliberately;
  add an exceptions screenshot only if it explains the workflow better than text.

### Audit feature coverage and finish documentation

- [x] Create a feature-to-documentation checklist against runtime/config options,
  entities, actions and both editor surfaces; give each delivered user feature an
  explanation or a deliberate cross-reference.
- [x] Explicitly cover time/sensor/month inputs, optional targets, transitions,
  axis controls, all activation types/composition, precedence, exceptions, manual
  plan selection, target watching, persistent offsets, all three value sensors,
  clearing offsets, clone behavior, saving/conflicts and access rights.
- [x] Check every documented default, entity name, action field and example
  against the final implementation. Distinguish planned or unsupported behavior
  from shipped features, especially native condition reuse.
- [x] Bring `README.de.md` into line with the final structure, terminology and
  feature descriptions, preserving its current improvements.
- [x] Verify internal/external links, image references and fork metadata; check
  that user instructions contain no incidental implementation discussion.
- [x] Run the repository's relevant backend/frontend checks and acceptance
  workflow for the completed feature changes; review rendered Markdown and
  screenshots before marking this checklist complete.

Final offset edge-case evidence: tests/test_offset.py covers invalid/nonfinite
readings, climate setpoint versus measured values, concurrent ticks, own delayed
acknowledgments, plan opt-out/reapplication through actual writes and sensors,
negative replacement offsets and clearing. Context-dropping devices with different
rounding have the documented precision limitation in docs/OFFSET.md.

Final checks: 140 backend tests passed; 100 frontend tests passed; Ruff check,
Ruff formatting, mypy, TypeScript, ESLint and production build passed. English
Markdown rendered with the three intended top-level audience/license sections
and four reference tables. Local links/assets exist; repository and workflow
URLs respond successfully. Shields and HA redirect endpoints reject automated
requests with HTTP 403, so their contents could not be independently verified.


## Commit preparation checkpoint (2026-11-27)

- Extended condition editing with month selection and native local-time ranges,
  and added the continuous day-of-week input axis with fractional-day coordinates.
- Completed the second English/German README coverage pass, including live-clock
  preview limitations and the distinction between X inputs and plan selection.
- Fixed the dashboard card editor-mode dropdown on first render and reopening;
  added nine regression cases and checked the production bundle in Chromium.
- Regenerated 18 localized screenshots with visible offset lines and reviewed them.
- Final validation: 149 backend tests and 122 frontend tests pass; Ruff lint and
  formatting, mypy, ESLint, TypeScript and production build pass. Shared
  interpolation vectors regenerate without changes. Source/documentation diff
  checks pass; generated bundle whitespace is emitted by esbuild.
