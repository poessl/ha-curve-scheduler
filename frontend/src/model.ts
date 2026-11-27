/**
 * Schedule data model, validation and day resolution.
 * Mirror of custom_components/curve_scheduler/model.py (same error codes).
 */

import { buildTimeline, parseTime, formatTime, type Mode, type Point } from "./interpolation";

export const MIN_POINTS = 1;
export const MAX_POINTS = 48;
export const TIME_GRID_MINUTES = 5;
export const MAX_PROFILES = 20;
export const MAX_EXCEPTIONS = 200;
export const MAX_NAME_LENGTH = 40;
export const MAX_NOTE_LENGTH = 100;
export const WEEKDAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
export type Weekday = (typeof WEEKDAYS)[number];

export const PROFILE_COLORS = [
  "#e67e22",
  "#27ae60",
  "#2980b9",
  "#8e44ad",
  "#c0392b",
  "#16a085",
  "#f1c40f",
  "#7f8c8d",
];

export interface AnchorMetadata {
  id?: string;
  anchor?: { entity_id: string; shift_mode?: "shortest" | "direct" };
  partner_of?: string;
}

export interface SchedulePoint extends AnchorMetadata {
  t: string;
  v: number;
}

export interface Activation { type: "weekday" | "holiday" | "condition"; condition?: Record<string, unknown>; profile: string; days?: Weekday[]; day?: Weekday; source?: string; }

export interface Profile {
  apply_offset?: boolean;
  apply_target?: boolean;
  curve?: NumericPoint[];
  name: string;
  color: string;
  points: SchedulePoint[];
}

export interface ScheduleException {
  id?: string;
  from: string;
  to: string;
  profile: string;
  note?: string;
}

export interface NumericPoint extends AnchorMetadata { x: number; v: number; }
export interface AxisConfig { source: "time_of_day" | "day_of_week" | "month_of_year" | "sensor"; input_entity: string | null; min: number; max: number; step: number; wrap: boolean; }

export interface Schedule {
  activations?: Activation[];
  curve?: NumericPoint[];
  profiles: Record<string, Profile>;
  week: Record<Weekday, string>;
  holiday_profile: string;
  fallback_profile?: string;
  exceptions: ScheduleException[];
  auto_cleanup: boolean;
}

export interface InstanceConfig {
  input_decimals?: number;
  watch_target?: boolean;
  x_label_step?: number;
  y_label_step?: number;
  axis?: AxisConfig;
  output_tick_seconds?: number;
  target: string;
  interval: number;
  interpolation: Mode;
  min: number;
  max: number;
  step: number;
  unit: string | null;
  holiday_source: string | null;
  threshold: number;
}

export type Reason = "fallback" | "condition" | "weekday" | "holiday" | "exception" | "override";

export interface LiveState {
  curve_available?: boolean;
  curve_errors?: ValidationIssue[];
  resolved_profiles?: Record<string, { points: [number, number][] | null; point_positions?: [number, number][]; errors: ValidationIssue[] }>;
  offset?: number;
  curve_value?: number | null;
  input_value?: number | null;
  input_available?: boolean;
  now: string;
  enabled: boolean;
  override: { profile: string; until: string | null } | null;
  value: number | null;
  raw_value: number | null;
  profile_id: string;
  reason: Reason;
  next_point: { time: string; hhmm: string; value: number } | null;
  value_in_1h: number | null;
  target_available: boolean;
  target_value: number | null;
  timeline: { date: string; profile_id: string; reason: Reason }[];
}

export interface InstanceData {
  entry_id: string;
  title: string;
  config: InstanceConfig;
  schedule: Schedule;
  revision: number;
  state: LiveState;
}

export interface ValidationIssue {
  code: string;
  path: string;
  params: Record<string, unknown>;
}

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const COLOR_RE = /^#[0-9a-fA-F]{6}$/;
const PROFILE_ID_RE = /^[a-z0-9_]{1,40}$/;

export function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function profilePoints(profile: Profile): Point[] {
  return profile.points.map((p) => [parseTime(p.t), p.v] as const);
}

function isValidDate(value: unknown): value is string {
  if (typeof value !== "string" || !DATE_RE.test(value)) {
    return false;
  }
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(value);
}

export function validatePoints(
  points: SchedulePoint[],
  path: string,
  min: number,
  max: number,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const add = (code: string, p: string, params: Record<string, unknown> = {}) =>
    issues.push({ code, path: p, params });
  if (points.length < MIN_POINTS) {
    add("too_few_points", path, { min: MIN_POINTS });
  }
  if (points.length > MAX_POINTS) {
    add("too_many_points", path, { max: MAX_POINTS });
  }
  let previous: number | undefined;
  const seen = new Set<number>();
  points.forEach((point, index) => {
    const pointPath = `${path}.${index}`;
    if (typeof point.t !== "string" || !TIME_RE.test(point.t)) {
      add("invalid_time", pointPath, { time: String(point.t) });
      return;
    }
    const minutes = parseTime(point.t);
    if (minutes % TIME_GRID_MINUTES) {
      add("time_not_on_grid", pointPath, { time: point.t, grid: TIME_GRID_MINUTES });
    }
    if (seen.has(minutes)) {
      add("duplicate_time", pointPath, { time: point.t });
    } else if (previous !== undefined && minutes < previous) {
      add("times_not_sorted", pointPath, { time: point.t });
    }
    seen.add(minutes);
    previous = minutes;
    if (typeof point.v !== "number" || Number.isNaN(point.v)) {
      add("invalid_value", pointPath, { time: point.t });
    } else if (point.v < min || point.v > max) {
      add("value_out_of_range", pointPath, { time: point.t, value: point.v, min, max });
    }
  });
  return issues;
}

export function validateAnchors(points: AnchorMetadata[], path: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const ids = new Set<string>();
  const anchors = new Set(points.filter(p => p.anchor && p.id).map(p => p.id));
  points.forEach((point, index) => {
    const invalidId = point.id !== undefined && (typeof point.id !== "string" || !point.id || point.id.length > 64 || ids.has(point.id));
    if (point.id) ids.add(point.id);
    if (invalidId || (point.anchor && (!point.id || point.partner_of !== undefined ||
      !/^(input_datetime|datetime|sensor)\.[a-z0-9_]+$/.test(point.anchor.entity_id) ||
      !["shortest", "direct"].includes(point.anchor.shift_mode ?? "shortest"))) ||
      (point.partner_of !== undefined && !anchors.has(point.partner_of))) {
      issues.push({ code: "invalid_anchor", path: `${path}.${index}`, params: {} });
    }
  });
  return issues;
}

export function validateSchedule(data: Schedule, min: number, max: number, axis?: AxisConfig): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const add = (code: string, path: string, params: Record<string, unknown> = {}) =>
    issues.push({ code, path, params });
  const profiles = data.profiles ?? {};
  const ids = Object.keys(profiles);
  if (ids.length === 0) {
    add("no_profiles", "profiles");
  }
  if (ids.length > MAX_PROFILES) {
    add("too_many_profiles", "profiles", { max: MAX_PROFILES });
  }
  const names = new Set<string>();
  for (const id of ids) {
    const profile = profiles[id];
    const path = `profiles.${id}`;
    issues.push(...validateAnchors(profile.points ?? [], `${path}.points`), ...validateAnchors(profile.curve ?? [], `${path}.curve`));
    if (!PROFILE_ID_RE.test(id)) {
      add("invalid_profile_id", path);
    }
    for (const option of ["apply_offset", "apply_target"] as const) {
      if (profile[option] !== undefined && typeof profile[option] !== "boolean") add("invalid_format", `${path}.${option}`);
    }
    const name = typeof profile.name === "string" ? profile.name : "";
    if (!name.trim()) {
      add("empty_name", `${path}.name`);
    } else if (name.length > MAX_NAME_LENGTH) {
      add("name_too_long", `${path}.name`, { max: MAX_NAME_LENGTH });
    } else {
      const key = name.trim().toLowerCase();
      if (key === "auto") {
        add("reserved_name", `${path}.name`, { name });
      } else if (names.has(key)) {
        add("duplicate_name", `${path}.name`, { name });
      }
      names.add(key);
    }
    if (typeof profile.color !== "string" || !COLOR_RE.test(profile.color)) {
      add("invalid_color", `${path}.color`);
    }
    if (axis && axis.source !== "time_of_day") {
      const points = profile.curve;
      if (!points || points.length < 1 || points.length > MAX_POINTS || points.some((p, i) => !Number.isFinite(p.x) || !Number.isFinite(p.v) || p.x < axis.min || p.x > axis.max || (axis.wrap && p.x === axis.max) || (i > 0 && p.x <= points[i - 1].x) || p.v < min || p.v > max)) add("invalid_curve", `${path}.curve`);
    } else issues.push(...validatePoints(profile.points ?? [], `${path}.points`, min, max));
  }
  const checkReference = (value: unknown, path: string) => {
    if (typeof value !== "string" || !(value in profiles)) {
      add("unknown_profile", path, { profile: String(value) });
    }
  };
  if (data.fallback_profile !== undefined) checkReference(data.fallback_profile, "fallback_profile");
  if (data.activations) {
    if (data.activations.length > MAX_EXCEPTIONS) add("invalid_format", "activations");
    data.activations.forEach((a, i) => {
      checkReference(a.profile, `activations.${i}.profile`);
      const days = a.days ?? [a.day!];
      if (a.type === "condition") {
        if (!a.condition || typeof a.condition !== "object" || Array.isArray(a.condition)) add("invalid_format", `activations.${i}.condition`);
        return;
      }
      if (a.type === "weekday" ? !Array.isArray(days) || !days.length || days.some(day => !WEEKDAYS.includes(day)) || new Set(days).size !== days.length : a.type !== "holiday" || !/^(calendar|binary_sensor)\.[a-z0-9_]+$/.test(a.source ?? "")) add("invalid_format", `activations.${i}`);
    });
  } else {
    for (const day of WEEKDAYS) checkReference(data.week?.[day], `week.${day}`);
    checkReference(data.holiday_profile, "holiday_profile");
  }
  const exceptions = data.exceptions ?? [];
  if (exceptions.length > MAX_EXCEPTIONS) {
    add("too_many_exceptions", "exceptions", { max: MAX_EXCEPTIONS });
  }
  exceptions.forEach((exception, index) => {
    const path = `exceptions.${index}`;
    const fromOk = isValidDate(exception.from);
    const toOk = isValidDate(exception.to);
    if (!fromOk) {
      add("invalid_date", `${path}.from`);
    }
    if (!toOk) {
      add("invalid_date", `${path}.to`);
    }
    if (fromOk && toOk && exception.to < exception.from) {
      add("date_range_reversed", path);
    }
    checkReference(exception.profile, `${path}.profile`);
    if ((exception.note ?? "").length > MAX_NOTE_LENGTH) {
      add("note_too_long", `${path}.note`, { max: MAX_NOTE_LENGTH });
    }
  });
  return issues;
}

/** Where a profile is referenced (week day, holiday rule, exceptions). */
export function profileUsages(data: Schedule, profileId: string): string[] {
  const usages: string[] = data.activations ? data.activations.flatMap((a, i) => a.profile === profileId ? [`activations.${i}`] : []) : WEEKDAYS.filter((day) => data.week[day] === profileId).map(
    (day) => `week.${day}`,
  );
  if (data.fallback_profile === profileId) usages.push("fallback_profile");
  if (!data.activations && data.holiday_profile === profileId) {
    usages.push("holiday_profile");
  }
  data.exceptions.forEach((exception, index) => {
    if (exception.profile === profileId) {
      usages.push(`exceptions.${index}`);
    }
  });
  return usages;
}

export interface DayProfile {
  profileId: string;
  reason: Reason;
}

/** ISO date (YYYY-MM-DD) of a local calendar date. */
export function isoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Parse YYYY-MM-DD into a local Date at noon (safe against DST). */
export function parseIsoDate(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d, 12);
}

export function addDays(value: string, days: number): string {
  const date = parseIsoDate(value);
  date.setDate(date.getDate() + days);
  return isoDate(date);
}

export function weekdayOf(value: string): Weekday {
  const day = parseIsoDate(value).getDay(); // 0 = Sunday
  return WEEKDAYS[(day + 6) % 7];
}

/** Automatic profile of a day: exception > holiday > weekday. */
export function resolveDay(
  data: Schedule,
  day: string,
  isHoliday: (day: string, source?: string) => boolean,
): DayProfile {
  for (const exception of data.exceptions) {
    if (exception.from <= day && day <= exception.to) {
      return { profileId: exception.profile, reason: "exception" };
    }
  }
  if (data.activations) {
    for (const a of data.activations) {
      if (a.type === "weekday" && (a.days ?? [a.day]).includes(weekdayOf(day))) return { profileId: a.profile, reason: "weekday" };
      if (a.type === "holiday" && isHoliday(day, a.source)) return { profileId: a.profile, reason: "holiday" };
    }
    return { profileId: data.fallback_profile ?? Object.keys(data.profiles)[0], reason: "fallback" };
  }
  if (isHoliday(day)) {
    return { profileId: data.holiday_profile, reason: "holiday" };
  }
  return { profileId: data.week[weekdayOf(day)], reason: "weekday" };
}

/** Timeline of a profile repeated on all five days (profile editor preview). */
export function repeatedTimeline(profile: Profile): Point[] {
  const points = profilePoints(profile);
  return buildTimeline([points, points, points, points, points]);
}

/** Timeline for five concrete days given their profile ids. */
export function timelineFor(data: Schedule, profileIds: string[]): Point[] {
  return buildTimeline(profileIds.map((id) => profilePoints(data.profiles[id])));
}

export function newProfileId(data: Schedule, name: string): string {
  const base =
    name
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/ß/g, "ss")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 30) || "profile";
  let id = base;
  let counter = 2;
  while (id in data.profiles) {
    id = `${base}_${counter++}`;
  }
  return id;
}

export function nextColor(data: Schedule): string {
  const used = new Set(Object.values(data.profiles).map((p) => p.color.toLowerCase()));
  return PROFILE_COLORS.find((c) => !used.has(c)) ?? PROFILE_COLORS[0];
}

/** Insert a point keeping times sorted; returns the new index. */
export function insertPoint(points: SchedulePoint[], point: SchedulePoint): number {
  const minutes = parseTime(point.t);
  let index = points.findIndex((p) => parseTime(p.t) > minutes);
  if (index < 0) {
    index = points.length;
  }
  points.splice(index, 0, point);
  return index;
}

/** Suggest a free time for a new point: middle of the largest gap. */
export function suggestFreeTime(points: SchedulePoint[]): number | undefined {
  const times = points.map((p) => parseTime(p.t)).sort((a, b) => a - b);
  if (times.length === 0) {
    return 12 * 60;
  }
  let best: number | undefined;
  let bestGap = 0;
  for (let i = 0; i < times.length; i++) {
    const start = times[i];
    const end = i + 1 < times.length ? times[i + 1] : times[0] + 1440;
    const gap = end - start;
    if (gap > bestGap) {
      bestGap = gap;
      best = start + gap / 2;
    }
  }
  if (best === undefined || bestGap < 2 * TIME_GRID_MINUTES) {
    return undefined;
  }
  let candidate = Math.round(best / 15) * 15;
  if (candidate >= 1440) {
    candidate -= 1440;
  }
  const taken = new Set(times);
  for (let delta = 0; delta < 1440; delta += TIME_GRID_MINUTES) {
    for (const sign of [1, -1]) {
      const t = (((candidate + sign * delta) % 1440) + 1440) % 1440;
      if (!taken.has(t)) {
        return t;
      }
    }
  }
  return undefined;
}

export { formatTime, parseTime };
