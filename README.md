# Curve Scheduler – daily setpoint curves for Home Assistant

[![Validate](https://github.com/timzifer/ha-curve-scheduler/actions/workflows/validate.yml/badge.svg)](https://github.com/timzifer/ha-curve-scheduler/actions/workflows/validate.yml)
[![CI](https://github.com/timzifer/ha-curve-scheduler/actions/workflows/ci.yml/badge.svg)](https://github.com/timzifer/ha-curve-scheduler/actions/workflows/ci.yml)
[![HACS Custom](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://hacs.xyz/docs/faq/custom_repositories)

🇩🇪 [Deutsche Anleitung](README.de.md)

**Curve Scheduler** calculates a value that changes over the day and writes it to a
device at regular intervals. The target is optional: without one, use the calculated
setpoint sensor in automations. The X-axis can also be a numeric sensor or month of year. The typical use is the hot water circulation
temperature, but it works for any number: buffer tank, room temperature,
pump speed, brightness …

The curve is defined by a few **points** (time → value). Values in between
are interpolated, smoothly and without a jump at midnight. Each day uses a
**daily plan** (e.g. *Workday*, *Day off*, *Holiday*), chosen by the weekly
plan, a holiday calendar or date-range exceptions.

**Everyone can edit the plans directly from a dashboard card**, on the phone
or the desktop, without YAML, automations, developer tools or admin rights.

<p align="center">
  <img src="docs/images/today.png" width="420" alt="Card: today's plan">
  <img src="docs/images/today-dark-mobile.png" width="260" alt="Card on a phone, dark theme">
</p>

## Features

- Visual curve editor: drag points with mouse or finger, or type the values into fields
- Four kinds of transition: step, linear, smooth and curve (monotone cubic, never overshoots)
- Weekly plan, holiday plan (Workday sensor or any calendar), date-range exceptions such as holidays
- Manual mode ("use the *Day off* plan until tomorrow") through the card, a select entity or an action
- Undo/redo, *Save*/*Discard* and a warning about unsaved changes
- Several cards can be open at the same time; changes appear everywhere, and conflicting saves are detected
- Writes to `number`, `input_number`, `climate` or `water_heater` entities
- German and English, light and dark theme, works from 320 px width

## Installation

### HACS (recommended)

1. Open **HACS** → menu (⋮) → **Custom repositories**.
2. Add `https://github.com/timzifer/ha-curve-scheduler` with the category **Integration**.
3. Search for **Curve Scheduler**, install it, then restart Home Assistant.

### Manual

Copy `custom_components/curve_scheduler` into the `custom_components` folder of
your Home Assistant configuration and restart.

The dashboard card is part of the integration and is registered
automatically. You do **not** have to add a dashboard resource.

## Setup (once, by an administrator)

**Settings → Devices & services → Add integration → Curve Scheduler**

| Setting | Meaning | Default |
|---|---|---|
| Name | e.g. "Circulation" | – |
| Target | Optional: `number`, `input_number`, `climate` (attribute `temperature`) or `water_heater` | – |
| Output tick | seconds between input sampling and output updates (1–86400) | 300 |
| X-axis source | time of day / month of year / sensor | time of day |
| Input entity | numeric state from `sensor`, `input_number` or `number`; required for a sensor axis | – |
| X minimum / maximum | numeric axis limits (upper limit exclusive when wrapping) | sensor: 0 / 100; month: 1 / 13 |
| X point resolution | snapping for point movement; input samples are not rounded | sensor: 0.1; month: 0.01 |
| Wrap input | periodic continuation; otherwise clamp out-of-range input | sensor: off; month: on |
| Transition between points | step / linear / smooth / curve | curve |
| Minimum / Maximum | allowed range; also the chart's axis | taken from the target, else 20 / 70 |
| X-axis label interval | 0 = automatic; otherwise minutes for time of day, X units for numeric inputs | 0 |
| Y-axis label interval | 0 = automatic; otherwise output units | 0 |
| Rounding step | value is rounded before writing | 0.5 |
| Unit | shown in the card | taken from the target |
| Holiday source | optional: Workday binary sensor **or** a calendar (each event = day off) | – |
| Write threshold | only write when the value changed by at least this much | 0 |

All settings can be changed later under **Configure**. You can add as many
instances as you like (e.g. circulation and buffer tank). Two example plans,
*Workday* and *Day off*, are created on setup.

> **Workday sensor:** the Workday integration also reports weekends as
> "not a workday". If Saturday and Sunday should use their own plans from the
> weekly plan, set up the Workday sensor with all seven days as workdays, so
> it only reports public holidays.

### Open the editor without a dashboard card

After adding an integration instance, open **Curve Scheduler** in the sidebar.
Choose a curve at the top; its full editor opens directly. **Add curve** starts
setup for another instance (administrators only). **Curve settings** opens the
integration page: use the **Configure** gear for the desired instance, confirm its
axis type, then change its limits, point/label intervals, output tick and other
parameters. Saving reloads that instance with its updated settings. This is also
available through **Settings → Devices & services → Curve Scheduler → Configure**.
The sidebar editor and device links remain available independently of Configure.
**Refresh list** picks up newly
added or reloaded instances. Each Curve Scheduler device also has a configuration
link opening its own curve directly. The panel is removed when the last instance
unloads and restored when an instance loads again.

The panel uses the same editor and server-side storage as the dashboard card.
Changes saved in either place appear in the other; revision checks prevent
conflicting saves. The instance picker asks before discarding unsaved changes.
Authenticated non-admin users can edit, matching the existing WebSocket policy.

This uses HA's supported custom-panel API, also used by
[Alarmo](https://github.com/nielsfaber/alarmo/blob/main/custom_components/alarmo/panel.py)
and [HAIR](https://github.com/DAB-LABS/HAIR/blob/main/custom_components/hair/__init__.py).
No extra frontend dependency or dashboard configuration is required.

### Add the card (optional)

Edit a dashboard → **Add card** → **Curve Scheduler**. In the card settings you can choose:

- which instance to show,
- **Compact** (today's plan, editor opens on demand) or **Full** (editor always open),
- whether users without admin rights may edit (default: yes).

## Using the card

### Today

<img src="docs/images/today.png" width="420" align="right" alt="Today view">

The chart shows today's curve. The red line marks the current time. The text
line summarizes the day, e.g.
*Today: Workday · now 58 °C · from 22:00 → 45 °C*.

- **Mode:** *Automatic* follows the weekly plan. Choosing a plan uses it until you switch back to *Automatic*.
- **Add holiday:** enter a date range and the plan to use during that time.
- **Edit** opens the editor.

<br clear="right">

### Daily plans

<p>
  <img src="docs/images/editor-profiles.png" width="420" alt="Daily plan editor">
  <img src="docs/images/editor-profiles-mobile.png" width="260" alt="Daily plan editor on a phone">
</p>

- Choose the plan at the top. **+ New plan**, rename, pick a color, **Duplicate** or **Delete plan**.
  A plan that is still used on a weekday, on holidays or by an exception cannot be deleted; the card says where it is used.
- **Drag a point** to change time and value. Points snap to 15 minutes (adjustable) and the rounding step, and cannot pass their neighbors. A label shows time and value while dragging.
- **Tap the line** to add a point there.
- **Tap a point** to select it. Below the chart you can type the time and value, use − / +, or delete it.
- The **table of all points** offers the same without dragging: change times and values, delete points, **+ Point**.
- The dashed end of the curve shows how it continues into the next day.
- **Copy curve from** copies all points from another plan.

### Weekly plan

<img src="docs/images/editor-week.png" width="420" alt="Weekly plan">

Choose a plan for each weekday and for holidays. The month overview shows
which plan applies on which day, holidays (★) and exceptions (✈) included.

### Holidays & exceptions

<img src="docs/images/editor-exceptions.png" width="420" alt="Exceptions">

Each exception has a date range, a plan and a note. Past entries are grayed
out; they can be removed with one tap or automatically.

### Saving

Changes take effect only after **Save**. **Undo** and **Redo** step through
your changes; **Discard** drops all of them. If somebody else saved in the
meantime, the card shows *"Changed in the meantime – reload?"*.

After saving, the new value is written immediately.

## How the value is calculated

- A plan describes a day from 00:00 to 24:00. **Across midnight** the curve
  runs towards the first point of the **next day's plan**, so switching from
  workday to weekend does not cause a jump (except in *step* mode).
- Priority for a day: **manual mode > exception > holiday > weekday**.
- *Curve* uses monotone cubic interpolation (PCHIP, Fritsch–Carlson). It goes
  through every point, never overshoots and has no kinks. *Smooth* uses
  smoothstep between two points.
- Calculation uses local wall-clock time. On daylight saving days the 02:00–03:00
  hour is skipped or repeated; nothing breaks.
- The value is clamped to min/max and rounded to the step before writing.

The interpolation exists twice, in Python (backend) and TypeScript (card
preview). Both are tested against the same vector file
(`tests/vectors/interpolation.json`, tolerance 1e‑6), so the preview and the
written value match.

## When is the value written?

- every *output tick* (seconds, measured from integration startup); legacy entries retain their minute interval until configured,
- immediately on: Home Assistant start (as soon as the target is available), *Save*,
  changing the mode, a change of the holiday source, switching the instance on, and the *Apply now* button,
- only if the value differs from the target's current value; periodic writes also respect the *write threshold*,
- never while the instance is switched off (the sensor still shows the computed value),
- not while the target is `unavailable`/`unknown`: one warning is logged, and the value is written as soon as the target is back.

## Entities

Each instance creates a device **Curve Scheduler &lt;name&gt;** with:

| Entity | Purpose |
|---|---|
| `sensor.<name>_setpoint` | current setpoint; attributes `profile`, `reason` (weekday/holiday/exception/override), `next_point_time`, `next_point_value`, `value_in_1h` |
| `sensor.<name>_profile` | name of the active plan |
| `switch.<name>_active` | instance on/off |
| `select.<name>_mode` | `auto` (Automatic) or a plan (manual mode) |
| `button.<name>_apply_now` | write now |

Mode, switch and all plans survive restarts.

## Numeric axes and a sensor-input example

Choose **Sensor value** or **Month of year** during setup. These modes use one
numeric X/Y curve instead of the daily/weekly profile selection. The card shows
numeric inputs and outputs, a draggable curve and number fields. Edit points and
press **Save**; changes persist on the HA server. The time-of-day editor and its
profiles are retained separately, so switching axis modes does not erase them.
Manual profile overrides, holidays and weekday selection apply only to time-of-day
mode. Numeric mode exposes the setpoint sensor, enable switch and Apply now button.

The output tick samples the latest input state and updates the output sensor,
even without a target. Numeric input state changes also recalculate the output immediately. Startup,
Save and Apply now also evaluate immediately. Target writes remain subject to
rounding, enable state and the existing threshold. No target means no device writes.
An unknown, unavailable, nonnumeric or nonfinite input makes the output unavailable
and prevents device writes until a valid input is sampled. This reads the numeric **state** of a `sensor`, `input_number` or `number` entity,
not its attributes. Numeric helpers can be selected directly without a template sensor.

Without wrapping, inputs clamp to the configured X limits and the curve holds its
first/last value outside the point range. With wrapping, the period is `x_max -
x_min`: the upper limit maps to the lower limit and negative inputs wrap too.
Interpolation continues from the last point to the first point of the next cycle.
Do not place a point at the exclusive upper wrap limit. Point coordinates must be
finite, unique and ascending. Fields allow exact numeric coordinates; X resolution
controls dragging/snapping. A maximum of 48 points applies.

Axis label intervals are configured under **Configure**, separately from point
snapping and output rounding. For example, X interval **180** gives three-hour
labels on a time-of-day curve; X interval **5** gives labels five input units apart
on a numeric curve. Y interval **10** labels every ten output units. Intervals
producing more than 100 divisions are rejected. While dragging a point, dashed
guides connect it to both axes; numeric curves also show its axis coordinates.

The **month of year** preset is continuous: January starts at 1, February at 2,
December at 12, and the next January at 13 wraps to 1. The fraction within a month
uses that month's actual length and HA's local wall-clock time. Time-of-day mode
retains its existing midnight-aware interpolation and five-minute point grid.
Numeric axis limits/resolution/wrapping are shown for the numeric presets. Configure first asks for the axis source, then shows only its applicable settings.
When changing between numeric presets, review the bounds and wrapping explicitly;
existing point coordinates are preserved, not rescaled. Bounds that exclude saved
points are rejected; edit the points first.

For a runnable input, merge [examples/sensor-input.yaml](examples/sensor-input.yaml)
into your isolated development configuration and restart HA. Then:

1. Add Curve Scheduler named **Heating curve**, select **Sensor value**, leave
   **Target** empty, and choose `sensor.curve_example_outdoor_temperature`.
2. Set X limits to **-20 / 40**, X resolution **0.5**, wrapping **off**,
   output limits **20 / 70**, rounding **0.5**, unit **°C**, interpolation **linear**,
   and output tick **10 seconds**.
3. In the card edit the two points to **(-20, 70)** and **(40, 20)** and save.
4. Change `input_number.curve_outdoor_temperature`. At input **10**, the output
   `sensor.heating_curve_setpoint` is **45 °C**. At input **-20**, it is **70 °C**;
   at input **40**, it is **20 °C**, immediately after the input changes.

You can use an existing outdoor-temperature, power, humidity or other numeric
sensor instead. Add a target later only if Curve Scheduler should write directly
to a supported device.

## Actions (services)

| Action | Fields |
|---|---|
| `curve_scheduler.set_override` | `config_entry_id`, `profile` (name or id), optional `until` |
| `curve_scheduler.clear_override` | `config_entry_id` |
| `curve_scheduler.add_exception` | `config_entry_id`, `from`, optional `to`, `profile`, optional `note` – returns `exception_id` |
| `curve_scheduler.remove_exception` | `config_entry_id`, `exception_id` **or** `date` |
| `curve_scheduler.apply_now` | `config_entry_id` |

Example: use the holiday plan while nobody is at home.

```yaml
automation:
  - alias: Hot water – away
    triggers:
      - trigger: state
        entity_id: group.family
        to: not_home
        for: "24:00:00"
    actions:
      - action: curve_scheduler.set_override
        data:
          config_entry_id: 01J...   # pick the instance in the UI editor
          profile: Urlaub
```

## Websocket API

The card uses these commands. None of them requires admin rights.

| Command | Purpose |
|---|---|
| `curve_scheduler/list` | all instances |
| `curve_scheduler/get` | configuration, plans, revision, live state |
| `curve_scheduler/save` | save plans (`revision` for conflict detection); returns translatable validation errors |
| `curve_scheduler/subscribe` | live updates |
| `curve_scheduler/preview` | backend-computed curve of a day (optionally for unsaved plans) |
| `curve_scheduler/holidays` | days off from the holiday source in a date range |

## Development

```bash
# backend
pip install -r requirements_dev.txt
ruff check . && ruff format --check . && mypy custom_components/curve_scheduler
pytest

# card
cd frontend
npm ci
npm run lint && npm run typecheck && npm test
npm run build         # writes custom_components/curve_scheduler/frontend/curve-scheduler-card.js
npm run demo          # demo page with a fake backend on http://localhost:8765/demo/

# shared interpolation vectors (after changing the algorithm)
python scripts/generate_vectors.py
```

For the local Compose instance (Home Assistant 2026.11.0):

```bash
mkdir -p dev/config
# First run only; preserve existing runtime configuration on later runs:
cp -n config/configuration.yaml dev/config/configuration.yaml
docker compose up -d
```

Open <http://localhost:8124>. This uses port 8124 to coexist with the separate
Schedule2D dev instance on 8123. Override with `CURVE_SCHEDULER_PORT` if needed.
The integration and built card are mounted from this checkout; restart the service
after backend changes. Private HA data stays in ignored `dev/config/`.

The repository contains a devcontainer. `scripts/develop` starts a local Home
Assistant with the integration on port 8123 (see `config/configuration.yaml`).
[docs/ACCEPTANCE.md](docs/ACCEPTANCE.md) documents the acceptance test.

Releases: publishing a GitHub release builds the card, sets the version in
`manifest.json` from the tag and attaches `curve_scheduler.zip`, which HACS installs.

## License

MIT
