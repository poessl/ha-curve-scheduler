/** Local, deterministic fixtures for README screenshots; never connects to HA. */
import "../src/curve-scheduler-card";
import type { CurveSchedulerPanel } from "../src/panel";
import "../src/panel";
import { Interpolator, buildTimeline, formatTime, roundToStep, type Point } from "../src/interpolation";
import { addDays, clone, profilePoints, resolveDay, validateSchedule, type InstanceConfig, type InstanceData, type Schedule } from "../src/model";
import type { HomeAssistant } from "../src/api";

customElements.define("ha-card", class extends HTMLElement { connectedCallback() { this.style.cssText = "display:block;background:var(--card-background-color);border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,.2);color:var(--primary-text-color)"; } });
customElements.define("ha-menu-button", class extends HTMLElement { connectedCallback() { this.textContent = "☰"; this.style.padding = "12px"; } });
// HA supplies this element in production; the demo only displays a fixture source.
customElements.define("ha-entity-picker", class extends HTMLElement {
  private input = document.createElement("input");
  set value(value: string) { this.input.value = value; }
  connectedCallback() { this.input.readOnly = true; this.input.style.cssText = "box-sizing:border-box;width:100%;padding:12px;border:1px solid var(--divider-color);border-radius:10px;background:var(--card-background-color);color:var(--primary-text-color);font:inherit"; this.append(this.input); }
});

const params = new URLSearchParams(location.search);
const english = params.get("lang") === "en";
document.documentElement.lang = english ? "en" : "de";
const text = (en: string, de: string) => english ? en : de;
const NOW = "2026-11-26T14:24:00+01:00";
const holidays = new Set(["2026-12-25", "2026-12-26"]);
const schedule: Schedule = {
  profiles: {
    workday: { name: text("Workday", "Werktag"), color: "#e67e22", points: [{ t: "00:00", v: 36 }, { t: "06:00", v: 58 }, { t: "11:00", v: 43 }, { t: "17:00", v: 62 }, { t: "22:00", v: 46 }] },
    day_off: { name: text("Day off", "Frei"), color: "#27ae60", points: [{ t: "01:00", v: 34 }, { t: "09:00", v: 60 }, { t: "15:00", v: 49 }, { t: "21:00", v: 57 }] },
    vacation: { name: text("Away", "Abwesend"), color: "#2980b9", points: [{ t: "12:00", v: 35 }] },
  },
  week: { mon: "workday", tue: "workday", wed: "workday", thu: "workday", fri: "workday", sat: "day_off", sun: "day_off" },
  holiday_profile: "day_off",
  activations: [
    { type: "holiday", source: "calendar.public_holidays", profile: "day_off" },
    { type: "weekday", days: ["mon", "tue", "wed", "thu", "fri"], profile: "workday" },
    { type: "weekday", days: ["sat", "sun"], profile: "day_off" },
  ],
  exceptions: [
    { id: "past", from: "2026-10-12", to: "2026-10-16", profile: "vacation", note: text("Autumn break", "Herbstferien") },
    { id: "trip", from: "2026-12-04", to: "2026-12-06", profile: "vacation", note: text("Weekend trip", "Wochenendreise") },
    { id: "christmas", from: "2026-12-24", to: "2027-01-06", profile: "day_off", note: text("Christmas", "Weihnachten") },
  ],
  auto_cleanup: false,
};
const config: InstanceConfig = { watch_target: true, target: "number.circulation_setpoint", interval: 5, output_tick_seconds: 60, interpolation: "curve", min: 20, max: 70, step: 0.5, unit: "°C", holiday_source: null, threshold: 0 };
interface DemoInstance { title: string; config: InstanceConfig; schedule: Schedule; revision: number; offset?: number; enabled: boolean; override: { profile: string; until: string | null } | null; }
const instances: Record<string, DemoInstance> = {
  demo: { title: text("Circulation", "Zirkulation"), config, schedule, revision: 7, offset: params.get("theme") === "dark" ? -3 : 5, enabled: true, override: null },
  sensor: { title: text("Heating curve", "Heizkurve"), config: { ...config, target: "", x_label_step: 10, axis: { source: "sensor", input_entity: "sensor.outdoor_temperature", min: -20, max: 40, step: 0.5, wrap: false } }, schedule: clone(schedule), revision: 1, offset: -6, enabled: true, override: null },
  week: { title: text("Weekly heating", "Wochenheizung"), config: { ...config, target: "", axis: { source: "day_of_week", input_entity: null, min: 1, max: 8, step: 0.01, wrap: true } }, schedule: clone(schedule), revision: 1, offset: -2, enabled: true, override: null },
  month: { title: text("Seasonal curve", "Jahreskurve"), config: { ...config, target: "", x_label_step: 2, axis: { source: "month_of_year", input_entity: null, min: 1, max: 13, step: 0.01, wrap: true } }, schedule: clone(schedule), revision: 1, offset: 4, enabled: true, override: null },
};
for (const [id, item] of Object.entries(instances)) {
  if (id === "demo") continue;
  for (const [plan, profile] of Object.entries(item.schedule.profiles)) {
    const offset = plan === "vacation" ? -5 : plan === "day_off" ? 2 : 0;
    profile.curve = id === "sensor" ? [{ x: -20, v: 65 + offset }, { x: 0, v: 50 + offset }, { x: 15, v: 35 + offset }, { x: 40, v: 25 + offset }] : id === "week" ? [{ x: 1, v: 42 + offset }, { x: 2.5, v: 57 + offset }, { x: 4.5, v: 45 + offset }, { x: 6, v: 62 + offset }, { x: 7.5, v: 48 + offset }] : [{ x: 1, v: 60 + offset }, { x: 4, v: 45 + offset }, { x: 7, v: 30 + offset }, { x: 10, v: 45 + offset }];
  }
}
const listeners = new Map<(data: InstanceData) => void, string>();
function snapshot(id: string): InstanceData {
  const item = instances[id];
  const today = NOW.slice(0, 10);
  const days = [-2, -1, 0, 1, 2].map(offset => addDays(today, offset));
  const resolved = days.map(day => item.override ? { profileId: item.override.profile, reason: "override" as const } : resolveDay(item.schedule, day, d => holidays.has(d)));
  const axis = item.config.axis;
  const numeric = axis && axis.source !== "time_of_day";
  const x = numeric ? axis.source === "sensor" ? 10 : axis.source === "day_of_week" ? 4.6 : 11.83 : 864;
  let timeline: Point[];
  if (numeric) {
    timeline = item.schedule.profiles[resolved[2].profileId].curve!.map(p => [p.x, p.v]);
    if (axis.wrap) { const center = timeline; timeline = [-2, -1, 0, 1, 2].flatMap(n => center.map(([x, v]) => [x + n * (axis.max - axis.min), v] as Point)); }
  } else timeline = buildTimeline(resolved.map(r => profilePoints(item.schedule.profiles[r.profileId])));
  const interpolator = new Interpolator(timeline, item.config.interpolation);
  const raw = interpolator.at(x);
  const next = numeric ? undefined : timeline.find(([t]) => t > x);
  return { entry_id: id, title: item.title, config: clone(item.config), schedule: clone(item.schedule), revision: item.revision, state: {
    offset: item.offset ?? 0, curve_value: roundToStep(Math.min(item.config.max, Math.max(item.config.min, raw + (item.schedule.profiles[resolved[2].profileId].apply_offset === false ? 0 : item.offset ?? 0))), item.config.step),
    now: NOW, enabled: item.enabled, override: item.override, value: roundToStep(raw, item.config.step), raw_value: raw, input_value: x, input_available: true, profile_id: resolved[2].profileId, reason: resolved[2].reason,
    next_point: next ? { time: "2026-11-26T17:00:00+01:00", hhmm: formatTime(((next[0] % 1440) + 1440) % 1440), value: next[1] } : null,
    value_in_1h: roundToStep(interpolator.at(numeric ? x : x + 60), item.config.step), target_available: true, target_value: null,
    timeline: days.map((date, i) => ({ date, profile_id: resolved[i].profileId, reason: resolved[i].reason })),
  } };
}
function publish() { listeners.forEach((id, listener) => listener(snapshot(id))); }
const hass: HomeAssistant = {
  user: { is_admin: true, name: "Demo" }, locale: { language: english ? "en" : "de" },
  async callWS<T>(message: Record<string, unknown>): Promise<T> {
    const id = String(message.entry_id ?? "demo");
    const item = instances[id];
    let result: unknown;
    switch (message.type) {
      case "curve_scheduler/list": result = Object.entries(instances).map(([entry_id, entry]) => ({ entry_id, title: entry.title, config: entry.config })); break;
      case "curve_scheduler/holidays": result = { configured: true, holidays: [...holidays] }; break;
      case "curve_scheduler/clone": {
        const newId = `copy_${Object.keys(instances).length}`;
        instances[newId] = { ...clone(item), title: String(message.name), enabled: false, override: null, revision: 1 };
        result = { entry_id: newId, title: instances[newId].title, config: instances[newId].config }; break;
      }
      case "curve_scheduler/save": {
        if (message.revision !== item.revision) result = { ok: false, conflict: true, revision: item.revision };
        else {
          const errors = validateSchedule(message.schedule as Schedule, item.config.min, item.config.max, item.config.axis);
          if (errors.length) result = { ok: false, conflict: false, errors };
          else { item.schedule = clone(message.schedule as Schedule); item.revision++; result = { ok: true, revision: item.revision }; setTimeout(publish, 0); }
        }
        break;
      }
      default: throw new Error(`Unknown demo command: ${String(message.type)}`);
    }
    return result as T;
  },
  async callService(_domain, service, data = {}) {
    const item = instances[String(data.config_entry_id ?? "demo")];
    if (service === "clear_offset") item.offset = 0;
    else if (service === "set_override") item.override = { profile: String(data.profile), until: null };
    else if (service === "clear_override") item.override = null;
    else if (service === "add_exception") { item.schedule.exceptions.push({ from: String(data.from), to: String(data.to), profile: String(data.profile), note: String(data.note ?? "") }); item.revision++; }
    publish();
  },
  connection: { async subscribeMessage<T>(callback: (data: T) => void, message: Record<string, unknown>) {
    const listener = callback as (data: InstanceData) => void;
    const id = String(message.entry_id);
    listeners.set(listener, id); listener(snapshot(id));
    return async () => { listeners.delete(listener); };
  } },
};
if (params.get("surface") === "panel") {
  document.documentElement.classList.add("panel-demo");
  const panel = document.createElement("curve-scheduler-panel") as CurveSchedulerPanel; panel.hass = hass;
  document.getElementById("root")!.append(panel);
} else {
  const card = document.createElement("curve-scheduler-card");
  card.setConfig({ type: "custom:curve-scheduler-card", entry_id: params.get("entry_id") ?? "demo", view: (params.get("view") as "compact" | "full") ?? "compact" });
  card.hass = hass;
  document.getElementById("root")!.append(card);
}
