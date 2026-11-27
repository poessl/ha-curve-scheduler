/**
 * <curve-scheduler-editor>: edit daily plans, weekly plan and exceptions.
 *
 * All changes go to a local draft with undo/redo. Nothing is sent to Home
 * Assistant before "Save".
 */

import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { anchorControls, detachDeletedAnchors } from "./anchor-editor";
import { repeat } from "lit/directives/repeat.js";
import { fetchHolidays, saveSchedule, type HomeAssistant } from "./api";
import { formatNumber, formatValue, parseNumber } from "./format";
import { isTranslationKey, translator, type Translate, type TranslationKey } from "./i18n";
import { clamp, formatTime, parseTime, roundToStep } from "./interpolation";
import {
  MAX_NOTE_LENGTH,
  MAX_NAME_LENGTH,
  MAX_POINTS,
  MAX_PROFILES,
  PROFILE_COLORS,
  TIME_GRID_MINUTES,
  WEEKDAYS,
  addDays,
  clone,
  insertPoint,
  isoDate,
  newProfileId,
  nextColor,
  parseIsoDate,
  profileUsages,
  resolveDay,
  suggestFreeTime,
  validateSchedule,
  type InstanceData,
  type Profile,
  type Schedule,
  type SchedulePoint,
  type ValidationIssue,
  type Activation,
} from "./model";
import { sharedStyles } from "./styles";
import "./curve";
import "./numeric-editor";
import type { CurveNoticeDetail, PointsChangedDetail } from "./curve";

type Tab = "profiles" | "week" | "exceptions";
type Message = { kind: "success" | "error" | "warning" | "info"; text: string };

const TEMPERATURE_UNITS = ["°C", "°F", "K", "C", "F"];
const SNAP_OPTIONS = [5, 15, 30, 60];
const HISTORY_LIMIT = 100;

export class CurveSchedulerEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    data: { attribute: false },
    language: {},
    _draft: { state: true },
    _base: { state: true },
    _baseRevision: { state: true },
    _undo: { state: true },
    _redo: { state: true },
    _tab: { state: true },
    _profileId: { state: true },
    _selected: { state: true },
    _snap: { state: true },
    _issues: { state: true },
    _message: { state: true },
    _saving: { state: true },
    _conflict: { state: true },
    _month: { state: true },
    _calendar: { state: true },
    _holidays: { state: true },
    dragActivation: { state: true },
    dragTarget: { state: true },
  };

  declare hass: HomeAssistant;
  declare data: InstanceData;
  declare language: string;
  declare _draft: Schedule;
  declare _base: Schedule;
  declare _baseRevision: number;
  declare _undo: Schedule[];
  declare _redo: Schedule[];
  declare _tab: Tab;
  declare _profileId: string;
  declare _selected: number | null;
  declare _snap: number;
  declare _issues: ValidationIssue[];
  declare _message: Message | null;
  declare _saving: boolean;
  declare _conflict: boolean;
  declare _month: string; // YYYY-MM-01
  declare _holidays: Record<string, Set<string>>;

  private _calendar: Record<string, { profile_id: string; reason: string }> | null = null;
  private calendarRequest = 0;
  private t: Translate = translator("en");
  private messageTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    super();
    this.language = "en";
    this._undo = [];
    this._redo = [];
    this._tab = "profiles";
    this._profileId = "";
    this._selected = null;
    this._snap = 15;
    this._issues = [];
    this._message = null;
    this._saving = false;
    this._conflict = false;
    this._month = "";
    this._holidays = {};
  }

  // ------------------------------------------------------------------
  // Lifecycle

  private readonly onBeforeUnload = (event: BeforeUnloadEvent) => {
    if (this.dirty) {
      event.preventDefault();
      event.returnValue = "";
    }
  };

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("beforeunload", this.onBeforeUnload);
    this.tabIndex = 0;
    this.addEventListener("keydown", this.onPointKeyDown);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("beforeunload", this.onBeforeUnload);
    this.removeEventListener("keydown", this.onPointKeyDown);
    clearTimeout(this.messageTimer);
    clearTimeout(this.dragStartTimer);
  }

  private onPointKeyDown = (event: KeyboardEvent): void => {
    if (this.config.axis && this.config.axis.source !== "time_of_day") return;
    if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || this._saving || this._tab !== "profiles") return;
    const path = event.composedPath();
    const typing = path.some(el => el instanceof HTMLElement && (el.matches("input, textarea, select") || el.isContentEditable));
    if (event.key === "Escape") {
      this._selected = null;
    } else if (!typing && (event.key === "Delete" || event.key === "Backspace") && this._selected !== null) {
      this.deletePoint(this._selected);
      this.focus();
    } else if (!typing && event.code === "Space" && !event.repeat && !path.some(el => el instanceof HTMLElement && el.matches("button, a"))) {
      this.addPoint();
    } else return;
    event.preventDefault();
    event.stopPropagation();
  };

  protected willUpdate(changed: PropertyValues<this>): void {
    if (changed.has("language")) {
      this.t = translator(this.language);
    }
    if (changed.has("data") && this.data && !this._saving) {
      if (!this._draft) {
        this.resetTo(this.data);
      } else if (this.data.revision !== this._baseRevision || JSON.stringify(changed.get("data")?.config) !== JSON.stringify(this.data.config)) {
        if (this.dirty) {
          this._conflict = true;
        } else {
          this.resetTo(this.data);
        }
      }
    }
    if (changed.has("_draft") || changed.has("_month") || changed.has("data")) this._calendar = null;
    if (!this._month) {
      this._month = `${isoDate(new Date()).slice(0, 8)}01`;
    }
  }

  protected updated(changed: PropertyValues<this>): void {
    if ((changed.has("_tab") || changed.has("_month") || changed.has("_draft") || changed.has("data")) && this._tab === "week") {
      void this.loadHolidays(this._month);
      void this.loadCalendar();
    }
    if (changed.has("_draft") || changed.has("_base")) {
      this.dispatchEvent(
        new CustomEvent("dirty-changed", {
          detail: { dirty: this.dirty },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  private resetTo(data: InstanceData): void {
    this._base = clone(data.schedule);
    this._draft = clone(data.schedule);
    this._baseRevision = data.revision;
    this._undo = [];
    this._redo = [];
    this._issues = [];
    this._conflict = false;
    if (!(this._profileId in this._draft.profiles)) {
      this._profileId = Object.keys(this._draft.profiles)[0] ?? "";
      this._selected = null;
    }
    const points = this._draft.profiles[this._profileId]?.points ?? [];
    if (this._selected !== null && this._selected >= points.length) {
      this._selected = null;
    }
  }

  // ------------------------------------------------------------------
  // Draft handling

  get dirty(): boolean {
    return (
      this._draft !== undefined && JSON.stringify(this._draft) !== JSON.stringify(this._base)
    );
  }

  /** Apply a change to a copy of the draft and record it for undo. */
  private change(mutate: (draft: Schedule) => void): void {
    const next = clone(this._draft);
    mutate(next);
    if (JSON.stringify(next) === JSON.stringify(this._draft)) {
      return;
    }
    this._undo = [...this._undo, this._draft].slice(-HISTORY_LIMIT);
    this._redo = [];
    this._draft = next;
    this._issues = [];
  }

  undo(): void {
    const previous = this._undo[this._undo.length - 1];
    if (!previous) {
      return;
    }
    this._redo = [...this._redo, this._draft];
    this._undo = this._undo.slice(0, -1);
    this._draft = previous;
    this.fixSelection();
  }

  redo(): void {
    const next = this._redo[this._redo.length - 1];
    if (!next) {
      return;
    }
    this._undo = [...this._undo, this._draft];
    this._redo = this._redo.slice(0, -1);
    this._draft = next;
    this.fixSelection();
  }

  discard(ask = true): void {
    if (ask && this.dirty && !window.confirm(this.t("editor.confirm_discard"))) {
      return;
    }
    this.resetTo(this.data);
    this._draft = clone(this._base);
  }

  private fixSelection(): void {
    if (!(this._profileId in this._draft.profiles)) {
      this._profileId = Object.keys(this._draft.profiles)[0] ?? "";
      this._selected = null;
    }
    const count = this._draft.profiles[this._profileId]?.points.length ?? 0;
    if (this._selected !== null && this._selected >= count) {
      this._selected = null;
    }
  }

  /** Ask before leaving with unsaved changes. Returns true if leaving is ok. */
  confirmLeave(): boolean {
    if (!this.dirty) {
      return true;
    }
    if (window.confirm(this.t("editor.confirm_leave"))) {
      this.discard(false);
      return true;
    }
    return false;
  }

  private showMessage(message: Message, timeout = 4000): void {
    this._message = message;
    clearTimeout(this.messageTimer);
    if (timeout > 0) {
      this.messageTimer = setTimeout(() => (this._message = null), timeout);
    }
  }

  async save(): Promise<void> {
    const issues = validateSchedule(this._draft, this.data.config.min, this.data.config.max, this.config.axis);
    if (issues.length) {
      this._issues = issues;
      this.showMessage({ kind: "error", text: this.t("editor.fix_errors") }, 0);
      return;
    }
    this._saving = true;
    try {
      const result = await saveSchedule(
        this.hass,
        this.data.entry_id,
        this._baseRevision,
        this._draft,
      );
      if (result.ok) {
        this._base = clone(this._draft);
        this._baseRevision = result.revision;
        this._undo = [];
        this._redo = [];
        this._issues = [];
        this._conflict = false;
        this.showMessage({ kind: "success", text: this.t("editor.saved") });
      } else if (result.conflict) {
        this._conflict = true;
      } else {
        this._issues = result.errors;
        this.showMessage({ kind: "error", text: this.t("editor.fix_errors") }, 0);
      }
    } catch (err) {
      this.showMessage(
        {
          kind: "error",
          text: this.t("card.connection_error", { message: (err as Error).message ?? err }),
        },
        0,
      );
    } finally {
      this._saving = false;
    }
  }

  private reloadAfterConflict(): void {
    this.resetTo(this.data);
    this._message = null;
  }

  // ------------------------------------------------------------------
  // Helpers

  private get config() {
    return this.data.config;
  }

  private get profile(): Profile | undefined {
    return this._draft.profiles[this._profileId];
  }

  private valueLabel(): string {
    return TEMPERATURE_UNITS.includes(this.config.unit ?? "")
      ? this.t("point.value")
      : this.t("point.value_generic");
  }

  private fmt(value: number): string {
    return formatValue(value, this.config.step, this.config.unit, this.language);
  }

  private normalizeValue(value: number): number {
    const { min, max, step } = this.config;
    return clamp(roundToStep(clamp(value, min, max), step), min, max);
  }

  private describeIssue(issue: ValidationIssue): string {
    const key = `error.${issue.code}`;
    const params: Record<string, unknown> = { ...issue.params };
    if (typeof params.value === "number") {
      params.value = this.fmt(params.value);
    }
    if (typeof params.min === "number" && issue.code === "value_out_of_range") {
      params.min = this.fmt(params.min);
      params.max = this.fmt(params.max as number);
    }
    if (Array.isArray(params.usages)) {
      params.usages = this.describeUsages(params.usages as string[]);
    }
    const text = isTranslationKey(key)
      ? this.t(key, params)
      : this.t("error.unknown", { code: issue.code });
    const match = /^profiles\.([^.]+)/.exec(issue.path);
    const profile = match ? this._draft.profiles[match[1]] : undefined;
    if (profile && issue.code !== "profile_in_use") {
      return `${profile.name}: ${text}`;
    }
    return text;
  }

  private describeUsages(usages: string[]): string {
    return usages
      .map((usage) => {
        if (usage.startsWith("week.")) {
          return this.t(`week.day.${usage.slice(5)}` as TranslationKey);
        }
        if (usage === "fallback_profile") return this.t("usage.fallback_profile");
        if (usage === "holiday_profile") {
          return this.t("usage.holiday_profile");
        }
        const index = Number(usage.split(".")[1]);
        if (usage.startsWith("activations.")) return this.t("usage.activation", { number: index + 1 });
        const exception = this._draft.exceptions[index];
        return exception?.note || this.t("usage.exception", { number: index + 1 });
      })
      .join(", ");
  }

  private issuesFor(prefix: string): ValidationIssue[] {
    return this._issues.filter((i) => i.path === prefix || i.path.startsWith(`${prefix}.`));
  }

  // ------------------------------------------------------------------
  // Profile actions

  private selectProfile(id: string): void {
    this._profileId = id;
    this._selected = null;
  }

  private addProfile(): void {
    if (Object.keys(this._draft.profiles).length >= MAX_PROFILES) {
      return;
    }
    let name = this.t("profiles.new_name");
    const names = new Set(Object.values(this._draft.profiles).map((p) => p.name.toLowerCase()));
    for (let i = 2; names.has(name.toLowerCase()); i++) {
      name = `${this.t("profiles.new_name")} ${i}`;
    }
    const id = newProfileId(this._draft, name);
    const middle = this.normalizeValue((this.config.min + this.config.max) / 2);
    this.change((draft) => {
      draft.profiles[id] = {
        name,
        color: nextColor(draft),
        points: [{ t: "06:00", v: middle }],
        ...(this.config.axis && this.config.axis.source !== "time_of_day" ? { curve: [{ x: this.config.axis.min, v: middle }] } : {}),
      };
    });
    this.selectProfile(id);
  }

  private duplicateProfile(): void {
    const source = this.profile;
    if (!source || Object.keys(this._draft.profiles).length >= MAX_PROFILES) {
      return;
    }
    let name = `${source.name} ${this.t("profiles.copy_suffix")}`.slice(0, MAX_NAME_LENGTH);
    const names = new Set(Object.values(this._draft.profiles).map((p) => p.name.toLowerCase()));
    for (let i = 2; names.has(name.toLowerCase()); i++) {
      name = `${source.name} ${i}`.slice(0, MAX_NAME_LENGTH);
    }
    const id = newProfileId(this._draft, name);
    this.change((draft) => {
      draft.profiles[id] = { ...clone(source), name, color: nextColor(draft) };
    });
    this.selectProfile(id);
  }

  private deleteProfile(): void {
    const profile = this.profile;
    if (!profile) {
      return;
    }
    if (Object.keys(this._draft.profiles).length <= 1) {
      this.showMessage({ kind: "warning", text: this.t("profiles.last") });
      return;
    }
    const usages = profileUsages(this._draft, this._profileId);
    if (usages.length) {
      this.showMessage(
        {
          kind: "warning",
          text: this.t("profiles.in_use", {
            name: profile.name,
            usages: this.describeUsages(usages),
          }),
        },
        8000,
      );
      return;
    }
    if (!window.confirm(this.t("profiles.confirm_delete", { name: profile.name }))) {
      return;
    }
    const id = this._profileId;
    this.change((draft) => {
      delete draft.profiles[id];
    });
    this.selectProfile(Object.keys(this._draft.profiles)[0]);
  }

  private renameProfile(name: string): void {
    const id = this._profileId;
    this.change((draft) => {
      draft.profiles[id].name = name.slice(0, MAX_NAME_LENGTH);
    });
  }

  private recolorProfile(color: string): void {
    const id = this._profileId;
    this.change((draft) => {
      draft.profiles[id].color = color;
    });
  }

  private copyCurveFrom(sourceId: string): void {
    const source = this._draft.profiles[sourceId];
    const target = this.profile;
    if (!source || !target || sourceId === this._profileId) {
      return;
    }
    if (
      !window.confirm(
        this.t("profiles.confirm_copy", { target: target.name, source: source.name }),
      )
    ) {
      return;
    }
    const id = this._profileId;
    this.change((draft) => {
      if (this.config.axis && this.config.axis.source !== "time_of_day") draft.profiles[id].curve = clone(source.curve ?? []);
      else draft.profiles[id].points = clone(source.points);
    });
    this._selected = null;
  }

  // ------------------------------------------------------------------
  // Point actions (shared by chart and table)

  private setPoints(points: SchedulePoint[], selected: number | null): void {
    const id = this._profileId;
    this.change((draft) => {
      draft.profiles[id].points = detachDeletedAnchors(points);
    });
    this._selected = selected;
  }

  addPoint(): void {
    const profile = this.profile;
    if (!profile) {
      return;
    }
    if (profile.points.length >= MAX_POINTS) {
      this.showMessage({ kind: "warning", text: this.t("point.full", { max: MAX_POINTS }) });
      return;
    }
    const minute = suggestFreeTime(profile.points);
    if (minute === undefined) {
      return;
    }
    const curve = this.renderRoot.querySelector("curve-scheduler-curve");
    const value = this.normalizeValue(
      curve?.curveValue(minute) ?? (this.config.min + this.config.max) / 2,
    );
    const points = clone(profile.points);
    const index = insertPoint(points, { t: formatTime(minute), v: value });
    this.setPoints(points, index);
  }

  deletePoint(index: number): void {
    const profile = this.profile;
    if (!profile) {
      return;
    }
    if (profile.points.length <= 1) {
      this.showMessage({ kind: "warning", text: this.t("point.min") });
      return;
    }
    const points = clone(profile.points);
    points.splice(index, 1);
    this.setPoints(points, null);
  }

  setPointTime(index: number, text: string): void {
    const profile = this.profile;
    if (!profile || !/^\d{1,2}:\d{2}/.test(text)) {
      this.requestUpdate();
      return;
    }
    let minute = parseTime(text.slice(0, 5));
    minute = Math.round(minute / TIME_GRID_MINUTES) * TIME_GRID_MINUTES;
    if (minute >= 1440) {
      minute = 1440 - TIME_GRID_MINUTES;
    }
    const time = formatTime(minute);
    if (profile.points.some((p, i) => i !== index && p.t === time)) {
      this.showMessage({ kind: "warning", text: this.t("point.taken", { time }) });
      this.requestUpdate();
      return;
    }
    const points = clone(profile.points);
    const [point] = points.splice(index, 1);
    const newIndex = insertPoint(points, { ...point, t: time });
    this.setPoints(points, newIndex);
  }

  setPointValue(index: number, value: number): void {
    const profile = this.profile;
    if (!profile || Number.isNaN(value)) {
      this.requestUpdate();
      return;
    }
    const points = clone(profile.points);
    points[index] = { ...points[index], v: this.normalizeValue(value) };
    this.setPoints(points, index);
  }

  private nudgePoint(index: number, direction: 1 | -1): void {
    const point = this.profile?.points[index];
    if (point) {
      this.setPointValue(index, point.v + direction * this.config.step);
    }
  }

  // ------------------------------------------------------------------
  // Week and exceptions

  private dragActivation: number | null = null;
  private dragTarget: number | null = null;
  private reorderAnimation = 0;
  private dragStartTimer?: ReturnType<typeof setTimeout>;

  private activationRects(): Map<number, DOMRect> {
    return new Map([...this.renderRoot.querySelectorAll<HTMLElement>(".activation")]
      .map(el => [Number(el.dataset.index), el.getBoundingClientRect()]));
  }

  private async animateActivations(before: Map<number, DOMRect>, newIndex = (index: number) => index): Promise<void> {
    const generation = ++this.reorderAnimation;
    await this.updateComplete;
    if (generation !== this.reorderAnimation || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    for (const [index, rect] of before) {
      const el = this.renderRoot.querySelector<HTMLElement>(`.activation[data-index="${newIndex(index)}"]`);
      if (!el) continue;
      el.getAnimations?.().forEach(animation => animation.cancel());
      const after = el.getBoundingClientRect();
      const dy = rect.top - after.top;
      if (dy) el.animate?.([{ transform: `translateY(${dy}px)` }, { transform: "translateY(0)" }],
        { duration: 220, easing: "cubic-bezier(.2,.8,.2,1)" });
    }
  }

  private moveActivation(from: number, to: number): void {
    if (from === to || to < 0 || to >= (this._draft.activations?.length ?? 0)) return;
    const before = this.activationRects();
    this.change(draft => {
      const entries = draft.activations!;
      entries.splice(to, 0, entries.splice(from, 1)[0]);
    });
    void this.animateActivations(before, index => index === from ? to
      : from < to && index > from && index <= to ? index - 1
      : from > to && index >= to && index < from ? index + 1 : index);
  }

  private previewActivation(event: DragEvent, to: number): void {
    if (this.dragActivation === null) return;
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
    to = Math.max(0, Math.min(to, this._draft.activations!.length - 1));
    if (to === this.dragTarget) return;
    const before = this.activationRects();
    this.dragTarget = to;
    void this.animateActivations(before);
  }

  private finishActivationDrag(drop: boolean): void {
    clearTimeout(this.dragStartTimer);
    const from = this.dragActivation;
    const to = this.dragTarget;
    if (from === null) return;
    const before = this.activationRects();
    this.dragActivation = null;
    this.dragTarget = null;
    if (drop && to !== null && from !== to) {
      // Preview already shows the final positions; commit one undo step on drop.
      this.change(draft => { draft.activations!.splice(to, 0, draft.activations!.splice(from, 1)[0]); });
      void this.animateActivations(before, index => index === from ? to
        : from < to && index > from && index <= to ? index - 1
        : from > to && index >= to && index < from ? index + 1 : index);
    } else void this.animateActivations(before);
  }

  private updateActivation(index: number, fields: Partial<Activation>): void {
    this.change(draft => { Object.assign(draft.activations![index], fields); });
  }

  private today(): string {
    return this.data.state.now.slice(0, 10);
  }

  private addException(): void {
    const today = this.today();
    const profile =
      Object.keys(this._draft.profiles).find((id) => /urlaub|holiday|vacation|day_off/i.test(id)) ??
      Object.keys(this._draft.profiles)[0];
    this.change((draft) => {
      draft.exceptions.push({
        from: today,
        to: addDays(today, 6),
        profile,
        note: this.t("holiday.note_default"),
      });
    });
  }

  private updateException(index: number, field: "from" | "to" | "profile" | "note", value: string) {
    this.change((draft) => {
      const exception = draft.exceptions[index];
      exception[field] = field === "note" ? value.slice(0, MAX_NOTE_LENGTH) : value;
      if (field === "from" && exception.to < value) {
        exception.to = value;
      }
    });
  }

  private deleteException(index: number): void {
    this.change((draft) => {
      draft.exceptions.splice(index, 1);
    });
  }

  private removePastExceptions(): void {
    const today = this.today();
    this.change((draft) => {
      draft.exceptions = draft.exceptions.filter((e) => e.to >= today);
    });
  }

  private async loadHolidays(month: string): Promise<void> {
    if (!this.hass) return;
    const date = parseIsoDate(month);
    const end = isoDate(new Date(date.getFullYear(), date.getMonth() + 1, 0, 12));
    const sources = new Set((this._draft.activations ?? []).filter(a => a.type === "holiday").map(a => a.source).filter((s): s is string => !!s));
    for (const source of sources) {
      const key = `${month}/${source}`;
      if (this._holidays[key]) continue;
      try {
        const result = await fetchHolidays(this.hass, this.data.entry_id, month, end, source);
        this._holidays = { ...this._holidays, [key]: new Set(result.holidays) };
      } catch { this._holidays = { ...this._holidays, [key]: new Set() }; }
    }
  }

  private shiftMonth(delta: number): void {
    const date = parseIsoDate(this._month);
    this._month = isoDate(new Date(date.getFullYear(), date.getMonth() + delta, 1, 12));
  }

  // ------------------------------------------------------------------
  // Rendering

  private profileOptions(selected: string): TemplateResult[] {
    return Object.entries(this._draft.profiles).map(
      ([id, profile]) =>
        html`<option value=${id} ?selected=${id === selected}>${profile.name}</option>`,
    );
  }

  private renderTabs() {
    const tabs: [Tab, TranslationKey][] = [
      ["profiles", "editor.tab.profiles"],
      ["week", "editor.tab.week"],
      ["exceptions", "editor.tab.exceptions"],
    ];
    return html`<div class="tabs" role="tablist">
      ${tabs.map(
        ([tab, key]) =>
          html`<button
            role="tab"
            class="tab ${this._tab === tab ? "active" : ""}"
            aria-selected=${this._tab === tab}
            @click=${() => (this._tab = tab)}
          >
            ${this.t(key)}
          </button>`,
      )}
    </div>`;
  }

  private renderProfileChips() {
    return html`<div class="chips" role="tablist">
      ${Object.entries(this._draft.profiles).map(
        ([id, profile]) =>
          html`<button
            class="chip ${id === this._profileId ? "active" : ""}"
            role="tab"
            aria-selected=${id === this._profileId}
            style="--chip-color: ${profile.color}"
            @click=${() => this.selectProfile(id)}
          >
            <span class="swatch" style="background: ${profile.color}"></span>${profile.name ||
            "…"}
          </button>`,
      )}
      <button
        class="chip add"
        ?disabled=${Object.keys(this._draft.profiles).length >= MAX_PROFILES}
        @click=${() => this.addProfile()}
      >
        + ${this.t("profiles.add")}
      </button>
    </div>`;
  }

  private renderProfileSettings(profile: Profile) {
    return html`<div class="profile-settings">
      <label class="field grow">
        ${this.t("profiles.name")}
        <input
          type="text"
          .value=${profile.name}
          maxlength=${MAX_NAME_LENGTH}
          @change=${(e: Event) => this.renameProfile((e.target as HTMLInputElement).value)}
        />
      </label>
      <div class="field">
        <span class="muted">${this.t("profiles.color")}</span>
        <div class="colors" role="radiogroup" aria-label=${this.t("profiles.color")}>
          ${PROFILE_COLORS.map(
            (color) =>
              html`<button
                class="color ${profile.color.toLowerCase() === color ? "active" : ""}"
                role="radio"
                aria-checked=${profile.color.toLowerCase() === color}
                aria-label=${color}
                style="background: ${color}"
                @click=${() => this.recolorProfile(color)}
              ></button>`,
          )}
        </div>
      </div>
      <div class="row">
        <label class="check"><input type="checkbox" class="apply-offset"
          .checked=${profile.apply_offset !== false}
          @change=${(e: Event) => {
            const enabled = (e.target as HTMLInputElement).checked;
            this.change(draft => { draft.profiles[this._profileId].apply_offset = enabled; });
          }}>${this.language.startsWith("de") ? "Versatz anwenden" : "Apply offset"}</label>
        <button @click=${() => this.duplicateProfile()}>${this.t("profiles.duplicate")}</button>
        <button class="danger" @click=${() => this.deleteProfile()}>
          ${this.t("profiles.delete")}
        </button>
      </div>
    </div>`;
  }

  private renderSelectedPoint(profile: Profile) {
    const index = this._selected;
    if (index === null || !profile.points[index]) {
      return nothing;
    }
    const point = profile.points[index];
    return html`<div class="selected-point" aria-live="polite">
      <div class="muted">${this.t("point.selected")}</div>
      <div class="row">
        <label class="field">
          ${this.t("point.time")}
          <input
            type="time"
            step="300"
            .value=${point.t}
            @change=${(e: Event) =>
              this.setPointTime(index, (e.target as HTMLInputElement).value)}
          />
        </label>
        ${this.renderValueInput(index, point)}
        <button class="danger" @click=${() => this.deletePoint(index)}>
          ${this.t("point.delete")}
        </button>
      </div>
    </div>`;
  }

  private renderPlainValueInput(index: number, point: SchedulePoint) {
    return html`<input
      class="value"
      type="text"
      inputmode="decimal"
      aria-label=${this.valueLabel()}
      .value=${formatNumber(point.v, this.config.step, this.language)}
      @change=${(e: Event) =>
        this.setPointValue(index, parseNumber((e.target as HTMLInputElement).value))}
    />`;
  }

  private renderValueInput(index: number, point: SchedulePoint, withLabel = true) {
    const input = html`<div class="stepper">
      <button
        class="icon"
        aria-label=${this.t("point.minus")}
        @click=${() => this.nudgePoint(index, -1)}
      >
        −
      </button>
      <input
        class="value"
        type="text"
        inputmode="decimal"
        aria-label=${this.valueLabel()}
        .value=${formatNumber(point.v, this.config.step, this.language)}
        @change=${(e: Event) =>
          this.setPointValue(index, parseNumber((e.target as HTMLInputElement).value))}
      />
      <button
        class="icon"
        aria-label=${this.t("point.plus")}
        @click=${() => this.nudgePoint(index, 1)}
      >
        +
      </button>
    </div>`;
    return withLabel
      ? html`<div class="field">
          <span class="muted">${this.valueLabel()}${this.config.unit ? ` (${this.config.unit})` : ""}</span>
          ${input}
        </div>`
      : input;
  }

  private renderPointTable(profile: Profile) {
    return html`<table class="points">
        <caption class="muted">
          ${this.t("point.table")}
        </caption>
        <thead>
          <tr>
            <th>${this.t("point.time")}</th>
            <th>${this.valueLabel()}${this.config.unit ? ` (${this.config.unit})` : ""}</th>
            <th><span class="sr-only">${this.t("point.delete")}</span></th>
          </tr>
        </thead>
        <tbody>
          ${profile.points.map(
            (point, index) =>
              html`<tr
                class=${index === this._selected ? "selected" : ""}
                data-index=${index}
                @focusin=${() => (this._selected = index)}
              >
                <td>
                  <input
                    type="time"
                    step="300"
                    aria-label=${this.t("point.time")}
                    .value=${point.t}
                    @change=${(e: Event) =>
                      this.setPointTime(index, (e.target as HTMLInputElement).value)}
                  />
                </td>
                <td>${this.renderPlainValueInput(index, point)}</td>
                <td>
                  <button
                    class="icon flat delete"
                    aria-label=${this.t("point.delete")}
                    title=${this.t("point.delete")}
                    ?disabled=${profile.points.length <= 1}
                    @click=${() => this.deletePoint(index)}
                  >
                    🗑
                  </button>
                </td>
              </tr>`,
          )}
        </tbody>
      </table>
      <button
        class="add-point"
        ?disabled=${profile.points.length >= MAX_POINTS}
        @click=${() => this.addPoint()}
      >
        ${this.t("point.add")}
      </button>`;
  }

  private renderProfilesTab() {
    const profile = this.profile;
    if (!profile) {
      return this.renderProfileChips();
    }
    if (this.config.axis && this.config.axis.source !== "time_of_day") {
      return html`${this.renderProfileChips()} ${this.renderProfileSettings(profile)}
        ${this.issuesFor(`profiles.${this._profileId}`).map(issue => html`<div class="notice error">${this.describeIssue(issue)}</div>`)}
        <curve-scheduler-numeric-editor .hass=${this.hass} .data=${this.data} .language=${this.language}
          style=${`--plan-color: ${profile.color}`} .saving=${this._saving} .embedded=${true} .editable=${true} .editing=${true} .points=${profile.curve ?? []}
          @numeric-points-changed=${(e: CustomEvent) => this.change(draft => { draft.profiles[this._profileId].curve = e.detail; })}
        ></curve-scheduler-numeric-editor>${this.renderCopyCurve()}`;
    }
    const issues = this.issuesFor(`profiles.${this._profileId}`);
    return html`
      ${this.renderProfileChips()} ${this.renderProfileSettings(profile)}
      ${issues.length
        ? html`<div class="notice error">
            ${issues.map((i) => html`<div>${this.describeIssue(i)}</div>`)}
          </div>`
        : nothing}
      <div class="chart-wrapper">
        <curve-scheduler-curve
          editable
          .points=${profile.points}
          .context=${null}
          .mode=${this.config.interpolation}
          .min=${this.config.min}
          .max=${this.config.max}
          .step=${this.config.step}
        .xLabelStep=${this.config.x_label_step ?? 0}
        .yLabelStep=${this.config.y_label_step ?? 0}
          .unit=${this.config.unit}
          .language=${this.language}
          .color=${profile.color}
          .snapMinutes=${this._snap}
          .selected=${this._selected}
          @points-changed=${(e: CustomEvent<PointsChangedDetail>) =>
            this.setPoints(e.detail.points, e.detail.selected)}
          @point-selected=${(e: CustomEvent<{ index: number | null }>) =>
            (this._selected = e.detail.index)}
          @curve-notice=${(e: CustomEvent<CurveNoticeDetail>) =>
            this.showMessage({ kind: "warning", text: this.t(e.detail.key, e.detail.params) })}
        ></curve-scheduler-curve>
      </div>
      <div class="row chart-footer">
        <span class="muted grow">${this.t("profiles.hint")}</span>
        <label class="field inline">
          ${this.t("profiles.snap")}
          <select
            @change=${(e: Event) => (this._snap = Number((e.target as HTMLSelectElement).value))}
          >
            ${SNAP_OPTIONS.map(
              (minutes) =>
                html`<option value=${minutes} ?selected=${minutes === this._snap}>
                  ${this.t("profiles.snap_minutes", { minutes })}
                </option>`,
            )}
          </select>
        </label>
      </div>
      ${this.renderSelectedPoint(profile)}
      ${anchorControls(profile.points, this._selected, this.hass, this.language, points => this.setPoints(points, this._selected))}
      ${this.renderPointTable(profile)}
      ${this.renderCopyCurve()}
    `;
  }

  private renderCopyCurve() {
    const others = Object.entries(this._draft.profiles).filter(([id]) => id !== this._profileId);
    return html`      ${others.length
        ? html`<div class="row copy">
            <label class="field grow">
              ${this.t("profiles.copy_from")}
              <select id="copy-source">
                ${others.map(([id, p]) => html`<option value=${id}>${p.name}</option>`)}
              </select>
            </label>
            <button
              class="copy-button"
              @click=${() =>
                this.copyCurveFrom(
                  (this.renderRoot.querySelector("#copy-source") as HTMLSelectElement).value,
                )}
            >
              ${this.t("profiles.copy")}
            </button>
          </div>`
        : nothing}`;
  }

  private renderWeekTab() {
    const entries = this._draft.activations ?? [];
    const order = entries.map((entry, index) => ({ entry, index }));
    if (this.dragActivation !== null && this.dragTarget !== null) {
      order.splice(this.dragTarget, 0, order.splice(this.dragActivation, 1)[0]);
    }
    const text = (en: string, de: string) => this.language.startsWith("de") ? de : en;
    return html`<h3>${this.t("editor.tab.week")}</h3>
      ${(this._draft.activations ?? []).some(a => a.type === "condition") ? html`<p class="muted">${text("Entity conditions use live states. Calendar predictions use current entity states; future entity states cannot be predicted.", "Entitätsbedingungen verwenden aktuelle Zustände. Die Kalendervorschau verwendet aktuelle Entitätszustände; zukünftige Zustände sind nicht vorhersagbar.")}</p>` : nothing}
      <p class="muted">${text("Entries are alternatives: the first matching entry wins. To require an entity value AND weekdays, combine them inside one AND group. If no entry matches, the selected fallback plan is used. Exceptions override activations.", "Einträge sind Alternativen: Der erste passende Eintrag gilt. Entitätswert UND Wochentage in einer UND-Gruppe kombinieren. Ohne Treffer gilt der ausgewählte Rückfallplan. Ausnahmen haben Vorrang.")}</p>
      <label class="field">${text("Fallback plan", "Rückfallplan")}
        <select class="fallback-plan" .value=${this._draft.fallback_profile ?? Object.keys(this._draft.profiles)[0]}
          @change=${(e: Event) => this.change(draft => { draft.fallback_profile = (e.target as HTMLSelectElement).value; })}>
          ${this.profileOptions(this._draft.fallback_profile ?? Object.keys(this._draft.profiles)[0])}
        </select>
      </label>
      <div class="activation-list ${this.dragActivation !== null ? "dragging" : ""}"
        @dragover=${(e: DragEvent) => { if (this.dragActivation !== null) e.preventDefault(); }}
        @drop=${(e: DragEvent) => { e.preventDefault(); this.finishActivationDrag(true); }}>
      ${repeat(entries.map((entry, index) => ({ entry, index })), item => item.index, ({ entry, index }) => {
        const position = order.findIndex(item => item.index === index);
        return html`
        ${this.renderActivationDropZone(position)}
        <div class="activation ${index === this.dragActivation ? "drag-preview" : ""}" data-index=${index} style=${`order: ${position * 2 + 1}`} draggable="true"
        @dragstart=${(e: DragEvent) => {
          // Let the browser capture its native drag image before changing layout.
          clearTimeout(this.dragStartTimer);
          this.dragStartTimer = setTimeout(() => {
            this.dragActivation = index; this.dragTarget = index;
          }, 0);
          if (e.dataTransfer) { e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", String(index)); }
        }}
        @dragover=${(e: DragEvent) => {
          if (index === this.dragActivation) { e.preventDefault(); return; }
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          const remainingPosition = position - (this.dragTarget !== null && this.dragTarget < position ? 1 : 0);
          this.previewActivation(e, remainingPosition + (e.clientY > rect.top + rect.height / 2 ? 1 : 0));
        }}
        @dragend=${() => this.finishActivationDrag(false)}>
        <div class="row">
          <label class="field grow">${text("Condition", "Bedingung")}
            <select .value=${entry.type} @change=${(e: Event) => this.updateActivation(index, { type: (e.target as HTMLSelectElement).value as Activation["type"], days: ["mon"], source: "", condition: { condition: "state", entity_id: "", state: "" } })}>
              <option value="weekday">${text("Day of the week", "Wochentag")}</option>
              <option value="holiday">${text("Holiday calendar", "Feiertagskalender")}</option>
              <option value="condition">${text("Custom condition", "Benutzerdefinierte Bedingung")}</option>
            </select>
          </label>
          <label class="field grow">${text("Target plan", "Zielplan")}
            <select @change=${(e: Event) => this.updateActivation(index, { profile: (e.target as HTMLSelectElement).value })}>${this.profileOptions(entry.profile)}</select>
          </label>
        </div>
        ${entry.type === "weekday" ? html`<div class="field weekday-field">
          <span id=${`weekday-label-${index}`}>${text("Days of the week", "Wochentage")}</span>
          <details class="weekday-select">
            <summary aria-labelledby=${`weekday-label-${index} weekday-summary-${index}`}>
              <span id=${`weekday-summary-${index}`}>${WEEKDAYS.filter(day => (entry.days ?? [entry.day]).includes(day)).map(day => this.t(`week.day.${day}` as TranslationKey)).join(", ") || text("Select weekdays", "Wochentage auswählen")}</span>
            </summary>
            <div class="weekday-options" role="group" aria-labelledby=${`weekday-label-${index}`}>
              ${WEEKDAYS.map(day => html`<label class="check">
                <input type="checkbox" .checked=${(entry.days ?? [entry.day]).includes(day)}
                  @change=${(e: Event) => {
                    const selected = new Set(entry.days ?? (entry.day ? [entry.day] : []));
                    if ((e.target as HTMLInputElement).checked) selected.add(day); else selected.delete(day);
                    this.updateActivation(index, { days: WEEKDAYS.filter(day => selected.has(day)) });
                  }}>${this.t(`week.day.${day}` as TranslationKey)}
              </label>`)}
            </div>
          </details>
        </div>` : entry.type === "condition" ? this.renderEntityCondition(index, entry) : html`<label class="field">${text("Calendar or Workday binary sensor (off = day off)", "Kalender oder Workday-Binärsensor (aus = freier Tag)")}
            <ha-entity-picker .hass=${this.hass} .value=${entry.source ?? ""} .includeDomains=${["calendar", "binary_sensor"]} allow-custom-entity
              @value-changed=${(e: CustomEvent) => this.updateActivation(index, { source: e.detail.value ?? "" })}></ha-entity-picker>
          </label>`}
        <div class="row">
          <button aria-label=${text("Move activation up", "Aktivierung nach oben")} ?disabled=${index === 0} @click=${() => this.moveActivation(index, index - 1)}>↑</button>
          <button aria-label=${text("Move activation down", "Aktivierung nach unten")} ?disabled=${index === entries.length - 1} @click=${() => this.moveActivation(index, index + 1)}>↓</button>
          <button @click=${() => this.change(draft => { draft.activations!.splice(index, 1); })}>${text("Delete", "Löschen")}</button>
        </div>
      </div>`; })}
      ${this.renderActivationDropZone(entries.length)}
      </div>
      <button ?disabled=${entries.length >= 200} @click=${() => this.change(draft => { (draft.activations ??= []).push({ type: "weekday", days: ["mon"], profile: Object.keys(draft.profiles)[0] }); })}>${text("Add activation", "Aktivierung hinzufügen")}</button>${this.renderMonth()}`;
  }

  private renderEntityCondition(index: number, entry: Activation): TemplateResult {
    return this.renderConditionNode(entry.condition ?? { condition: "state", entity_id: "", state: "" },
      condition => this.updateActivation(index, { condition }));
  }

  private renderConditionNode(condition: Record<string, unknown>, replace: (value: Record<string, unknown>) => void): TemplateResult {
    const text = (en: string, de: string) => this.language.startsWith("de") ? de : en;
    const update = (fields: Record<string, unknown>) => replace({ ...condition, ...fields });
    const kind = String(condition.condition ?? "state");
    const selector = html`<label class="field">${text("Condition type", "Bedingungstyp")}
      <select aria-label=${text("Condition type", "Bedingungstyp")} .value=${kind} @change=${(e: Event) => {
        const type = (e.target as HTMLSelectElement).value;
        replace(type === "state" ? { condition: type, entity_id: "", state: "" }
          : type === "numeric_state" ? { condition: type, entity_id: condition.entity_id ?? "", above: 0 }
          : type === "curve_scheduler_month" ? { condition: type, months: [1] }
          : type === "time" ? { condition: type, after: "08:00:00", before: "18:00:00" }
          : type === "curve_scheduler_weekday" ? { condition: type, days: ["mon"] }
          : type === "curve_scheduler_holiday" ? { condition: type, source: "" }
          : { condition: type, conditions: ["and", "or", "not"].includes(kind) ? condition.conditions : [condition] });
      }}>
        <option value="state">${text("Entity state (exact text)", "Entitätszustand (exakter Text)")}</option>
        <option value="numeric_state">${text("Numeric value", "Numerischer Wert")}</option>
        <option value="curve_scheduler_month">${text("Month of year", "Monat im Jahr")}</option>
        <option value="time">${text("Time of day", "Tageszeit")}</option>
        <option value="curve_scheduler_weekday">${text("Weekday", "Wochentag")}</option>
        <option value="curve_scheduler_holiday">${text("Holiday", "Feiertag")}</option>
        <option value="and">AND</option><option value="or">OR</option><option value="not">NOT</option>
      </select></label>`;
    if (["and", "or", "not"].includes(kind)) {
      const children = (condition.conditions ?? []) as Record<string, unknown>[];
      return html`<fieldset class="condition-group"><legend>${text(kind === "and" ? "All conditions must match" : kind === "or" ? "At least one condition must match" : "None of these conditions may match", kind === "and" ? "Alle Bedingungen müssen zutreffen" : kind === "or" ? "Mindestens eine Bedingung muss zutreffen" : "Keine dieser Bedingungen darf zutreffen")}</legend>${selector}${children.map((child, i) => html`<fieldset class="condition-child">
        ${this.renderConditionNode(child, value => update({ conditions: children.map((c, n) => n === i ? value : c) }))}
        <button @click=${() => update({ conditions: children.filter((_, n) => n !== i) })}>${text("Remove condition", "Bedingung entfernen")}</button>
      </fieldset>`)}<button @click=${() => update({ conditions: [...children, { condition: "state", entity_id: "", state: "" }] })}>${text("Add condition", "Bedingung hinzufügen")}</button></fieldset>`;
    }
    if (kind === "curve_scheduler_month") return html`<div class="condition-fields">${selector}<div class="row">${Array.from({length: 12}, (_, i) => i + 1).map(month => html`<label class="check"><input type="checkbox" .checked=${((condition.months ?? []) as number[]).includes(month)} @change=${(e: Event) => {
      const months = new Set((condition.months ?? []) as number[]);
      if ((e.target as HTMLInputElement).checked) months.add(month); else months.delete(month);
      update({ months: [...months].sort((a,b) => a-b) });
    }}>${new Intl.DateTimeFormat(this.language, { month: "short", timeZone: "UTC" }).format(new Date(Date.UTC(2024, month - 1, 1)))}</label>`)}</div></div>`;
    if (kind === "time") return html`<div class="condition-fields">${selector}<div class="row">${(["after", "before"] as const).map(bound => html`<label class="field grow">${text(bound === "after" ? "After (inclusive)" : "Before (exclusive)", bound === "after" ? "Ab (einschließlich)" : "Bis (ausschließlich)")}<input type="time" step="1" .value=${String(condition[bound] ?? "")} @change=${(e: Event) => {
      const next = { ...condition }; const value = (e.target as HTMLInputElement).value;
      if (value) next[bound] = value; else delete next[bound]; replace(next);
    }}></label>`)}</div><p class="muted">${text("Home Assistant local time. Overnight ranges are supported; evaluated at each output update.", "Lokale Home-Assistant-Zeit. Zeiträume über Mitternacht sind möglich; Auswertung bei jeder Ausgangsaktualisierung.")}</p></div>`;
    if (kind === "curve_scheduler_weekday") return html`${selector}<div class="row">${WEEKDAYS.map(day => html`<label class="check"><input type="checkbox" .checked=${((condition.days ?? []) as string[]).includes(day)} @change=${(e: Event) => {
      const days = new Set((condition.days ?? []) as string[]);
      if ((e.target as HTMLInputElement).checked) days.add(day); else days.delete(day);
      update({ days: WEEKDAYS.filter(d => days.has(d)) });
    }}>${this.t(`week.day.${day}` as TranslationKey)}</label>`)}</div>`;
    if (kind === "curve_scheduler_holiday") return html`${selector}<ha-entity-picker .hass=${this.hass} .value=${condition.source ?? ""} .includeDomains=${["calendar", "binary_sensor"]} @value-changed=${(e: CustomEvent) => update({ source: e.detail.value ?? "" })}></ha-entity-picker>`;
    if (kind === "numeric_state") return html`<div class="condition-fields">${selector}
      <label class="field">${text("Entity", "Entität")}<ha-entity-picker .hass=${this.hass} .value=${condition.entity_id ?? ""} @value-changed=${(e: CustomEvent) => update({ entity_id: e.detail.value ?? "" })}></ha-entity-picker></label>
      <label class="field">${text("Attribute (optional)", "Attribut (optional)")}<input .value=${String(condition.attribute ?? "")} @change=${(e: Event) => {
        const next = { ...condition }; const value = (e.target as HTMLInputElement).value.trim();
        if (value) next.attribute = value; else delete next.attribute; replace(next);
      }}></label>
      <div class="row">${(["above", "below"] as const).map(bound => html`<label class="field grow">${text(bound === "above" ? "Above (exclusive)" : "Below (exclusive)", bound === "above" ? "Größer als (exklusiv)" : "Kleiner als (exklusiv)")}
        <input type="number" step="any" .value=${String(condition[bound] ?? "")} @change=${(e: Event) => {
          const next = { ...condition }; const value = (e.target as HTMLInputElement).value;
          if (value.trim()) next[bound] = Number(value); else delete next[bound]; replace(next);
        }}></label>`)}</div>
      <p class="muted">${text("Set at least one bound. Equal values are excluded. Both bounds must match.", "Mindestens eine Grenze angeben. Gleiche Werte sind ausgeschlossen. Beide Grenzen müssen zutreffen.")}</p>
    </div>`;
    return html`<div class="condition-fields" @dragstart=${(e: Event) => e.stopPropagation()}>${selector}
      <label class="field">${text("Entity", "Entität")}
        <ha-entity-picker .hass=${this.hass} .value=${condition.entity_id ?? ""} allow-custom-entity
          @value-changed=${(e: CustomEvent) => update({ entity_id: e.detail.value ?? "" })}></ha-entity-picker>
      </label>
      <label class="field">${text("Attribute (optional)", "Attribut (optional)")}
        <input .value=${String(condition.attribute ?? "")} @change=${(e: Event) => {
          const next = { ...condition };
          const attribute = (e.target as HTMLInputElement).value.trim();
          if (attribute) next.attribute = attribute; else delete next.attribute;
          replace(next);
        }}>
      </label>
      ${condition.attribute ? html`<label class="field">${text("Value type", "Werttyp")}
        <select .value=${typeof condition.state} @change=${(e: Event) => {
          const type = (e.target as HTMLSelectElement).value;
          update({ state: type === "number" ? Number(condition.state) || 0 : type === "boolean" ? condition.state === true || condition.state === "true" : String(condition.state ?? "") });
        }}><option value="string">${text("Text", "Text")}</option><option value="number">${text("Number", "Zahl")}</option><option value="boolean">${text("Boolean", "Wahrheitswert")}</option></select>
      </label>` : nothing}
      <label class="field">${text("Expected value", "Erwarteter Wert")}
        <input .value=${String(condition.state ?? "")} @change=${(e: Event) => {
          const value = (e.target as HTMLInputElement).value;
          update({ state: typeof condition.state === "boolean" ? value === "true" : typeof condition.state === "number" ? Number(value) : value });
        }}>
      </label>
    </div>`;
  }

  private renderActivationDropZone(position: number) {
    const text = this.language.startsWith("de") ? "Hier ablegen" : "Drop here";
    return html`<div style=${`order: ${position * 2}`} class="activation-drop-zone ${this.dragTarget === position ? "active" : ""}"
      @dragenter=${(e: DragEvent) => this.previewActivation(e, position)}
      @dragover=${(e: DragEvent) => this.previewActivation(e, position)}>${text}</div>`;
  }

  private async loadCalendar(): Promise<void> {
    const request = ++this.calendarRequest;
    const schedule = clone(this._draft);
    const month = this._month;
    const first = parseIsoDate(month);
    const end = isoDate(new Date(first.getFullYear(), first.getMonth() + 1, 0, 12));
    try {
      const result = await this.hass.callWS<{ ok: boolean; days: { date: string; profile_id: string; reason: string }[] }>({
        type: "curve_scheduler/calendar", entry_id: this.data.entry_id, start: month, end, schedule,
      });
      if (request !== this.calendarRequest || month !== this._month || JSON.stringify(schedule) !== JSON.stringify(this._draft)) return;
      this._calendar = result?.ok ? Object.fromEntries(result.days.map(day => [day.date, day])) : null;
    } catch { if (request === this.calendarRequest) this._calendar = null; }
  }

  private renderMonth() {
    const first = parseIsoDate(this._month);
    const year = first.getFullYear();
    const month = first.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const leading = (first.getDay() + 6) % 7;
    const today = this.today();
    const monthName = new Intl.DateTimeFormat(this.language, {
      month: "long",
      year: "numeric",
    }).format(first);
    const weekdayNames = WEEKDAYS.map((_, i) =>
      new Intl.DateTimeFormat(this.language, { weekday: "short" }).format(
        new Date(2024, 0, 1 + i, 12),
      ),
    );
    const cells: TemplateResult[] = [];
    for (let i = 0; i < leading; i++) {
      cells.push(html`<div class="cell empty"></div>`);
    }
    for (let d = 1; d <= days; d++) {
      const iso = isoDate(new Date(year, month, d, 12));
      const serverDay = this._calendar?.[iso];
      const hasConditions = this._draft.activations?.some(a => a.type === "condition");
      const resolved = serverDay ? { profileId: serverDay.profile_id, reason: serverDay.reason }
        : hasConditions ? { profileId: "", reason: "pending" }
        : resolveDay(this._draft, iso, (day, source) => this._holidays[`${this._month}/${source}`]?.has(day) ?? false);
      const profile = this._draft.profiles[resolved.profileId];
      const mark = resolved.reason === "holiday" ? "★" : resolved.reason === "exception" ? "✈" : "";
      cells.push(
        html`<div
          class="cell ${iso === today ? "today" : ""}"
          style="--cell-color: ${profile?.color ?? "transparent"}"
          title="${iso}: ${profile?.name ?? (this.language.startsWith("de") ? "Vorschau noch nicht verfügbar" : "Preview not yet available")}"
        >
          <span class="num">${d}</span><span class="mark">${mark}</span>
        </div>`,
      );
    }
    return html`<div class="month">
      <div class="month-header">
        <button
          class="icon"
          aria-label=${this.t("week.prev_month")}
          @click=${() => this.shiftMonth(-1)}
        >
          ‹
        </button>
        <strong>${this.t("week.preview")}: ${monthName}</strong>
        <button
          class="icon"
          aria-label=${this.t("week.next_month")}
          @click=${() => this.shiftMonth(1)}
        >
          ›
        </button>
      </div>
      ${!this._calendar && this._draft.activations?.some(a => a.type === "condition") ? html`<p class="muted" role="status">${this.language.startsWith("de") ? "Kalendervorschau noch nicht verfügbar. Bedingungen müssen gültig sein." : "Calendar preview not yet available. Conditions must be valid."}</p>` : nothing}
      <div class="calendar">
        ${weekdayNames.map((name) => html`<div class="cell head">${name}</div>`)} ${cells}
      </div>
      <div class="legend">
        ${Object.values(this._draft.profiles).map(
          (p) =>
            html`<span class="row"
              ><span class="swatch" style="background: ${p.color}"></span>${p.name}</span
            >`,
        )}
        <span>★ ${this.t("week.legend_holiday")}</span>
        <span>✈ ${this.t("week.legend_exception")}</span>
      </div>
    </div>`;
  }

  private renderExceptionsTab() {
    const today = this.today();
    const exceptions = this._draft.exceptions;
    const hasPast = exceptions.some((e) => e.to < today);
    return html`
      <h3>${this.t("exceptions.title")}</h3>
      ${exceptions.length === 0
        ? html`<div class="muted">${this.t("exceptions.empty")}</div>`
        : nothing}
      <div class="exceptions">
        ${exceptions.map((exception, index) => {
          const past = exception.to < today;
          const active = exception.from <= today && today <= exception.to;
          const issues = this.issuesFor(`exceptions.${index}`);
          const color = this._draft.profiles[exception.profile]?.color ?? "transparent";
          return html`<div
            class="exception ${past ? "past" : ""}"
            style="--row-color: ${color}"
            data-index=${index}
          >
            <div class="row">
              <label class="field">
                ${this.t("exceptions.from")}
                <input
                  type="date"
                  .value=${exception.from}
                  @change=${(e: Event) =>
                    this.updateException(index, "from", (e.target as HTMLInputElement).value)}
                />
              </label>
              <label class="field">
                ${this.t("exceptions.to")}
                <input
                  type="date"
                  .value=${exception.to}
                  min=${exception.from}
                  @change=${(e: Event) =>
                    this.updateException(index, "to", (e.target as HTMLInputElement).value)}
                />
              </label>
              ${past ? html`<span class="badge">${this.t("exceptions.past")}</span>` : nothing}
              ${active ? html`<span class="badge active">${this.t("exceptions.active")}</span>` : nothing}
            </div>
            <div class="row">
              <label class="field grow">
                ${this.t("exceptions.profile")}
                <select
                  @change=${(e: Event) =>
                    this.updateException(index, "profile", (e.target as HTMLSelectElement).value)}
                >
                  ${this.profileOptions(exception.profile)}
                </select>
              </label>
              <label class="field grow">
                ${this.t("exceptions.note")}
                <input
                  type="text"
                  maxlength=${MAX_NOTE_LENGTH}
                  .value=${exception.note ?? ""}
                  @change=${(e: Event) =>
                    this.updateException(index, "note", (e.target as HTMLInputElement).value)}
                />
              </label>
              <button class="danger" @click=${() => this.deleteException(index)}>
                ${this.t("exceptions.delete")}
              </button>
            </div>
            ${issues.length
              ? html`<div class="notice error">
                  ${issues.map((i) => html`<div>${this.describeIssue(i)}</div>`)}
                </div>`
              : nothing}
          </div>`;
        })}
      </div>
      <div class="row">
        <button class="primary-outline" @click=${() => this.addException()}>
          ${this.t("exceptions.add")}
        </button>
        ${hasPast
          ? html`<button @click=${() => this.removePastExceptions()}>
              ${this.t("exceptions.remove_past")}
            </button>`
          : nothing}
      </div>
      <label class="check">
        <input
          type="checkbox"
          .checked=${this._draft.auto_cleanup}
          @change=${(e: Event) => {
            const checked = (e.target as HTMLInputElement).checked;
            this.change((draft) => {
              draft.auto_cleanup = checked;
            });
          }}
        />
        ${this.t("exceptions.auto_cleanup")}
      </label>
    `;
  }

  private renderFooter() {
    const otherIssues = this._issues.filter(
      (i) =>
        !(this._tab === "profiles" && i.path.startsWith(`profiles.${this._profileId}`)) &&
        !(this._tab === "exceptions" && i.path.startsWith("exceptions.")),
    );
    return html`
      ${this._conflict
        ? html`<div class="notice warning row">
            <span class="grow">${this.t("editor.conflict")}</span>
            <button @click=${() => this.reloadAfterConflict()}>${this.t("editor.reload")}</button>
          </div>`
        : nothing}
      ${otherIssues.length
        ? html`<div class="notice error">
            ${otherIssues.map((i) => html`<div>${this.describeIssue(i)}</div>`)}
          </div>`
        : nothing}
      ${this._message
        ? html`<div class="notice ${this._message.kind}" role="status">${this._message.text}</div>`
        : this.dirty
          ? html`<div class="muted unsaved">${this.t("editor.unsaved")}</div>`
          : nothing}
      <div class="footer">
        <button
          class="icon"
          title=${this.t("editor.undo")}
          aria-label=${this.t("editor.undo")}
          ?disabled=${this._undo.length === 0}
          @click=${() => this.undo()}
        >
          ↶
        </button>
        <button
          class="icon"
          title=${this.t("editor.redo")}
          aria-label=${this.t("editor.redo")}
          ?disabled=${this._redo.length === 0}
          @click=${() => this.redo()}
        >
          ↷
        </button>
        <span class="grow"></span>
        <button ?disabled=${!this.dirty || this._saving} @click=${() => this.discard()}>
          ${this.t("editor.discard")}
        </button>
        <button
          class="primary save"
          ?disabled=${!this.dirty || this._saving}
          @click=${() => this.save()}
        >
          ${this._saving ? this.t("editor.saving") : this.t("editor.save")}
        </button>
      </div>
    `;
  }

  protected render() {
    if (!this._draft) {
      return nothing;
    }
    let body: TemplateResult;
    switch (this._tab) {
      case "week":
        body = this.renderWeekTab();
        break;
      case "exceptions":
        body = this.renderExceptionsTab();
        break;
      default:
        body = this.renderProfilesTab();
    }
    const text = (en: string, de: string) => this.language.startsWith("de") ? de : en;
    return html`<div class="row" aria-live="polite">
      <span>${text("Raw curve value", "Unveränderter Kurvenwert")}: ${this.data.state.value ?? "–"} ${this.config.unit}</span>
      <span>${text("Offset", "Versatz")}: ${this.data.state.offset ?? 0} ${this.config.unit}</span>
      <span>${text("Curve value", "Kurvenwert")}: ${this.data.state.curve_value ?? this.data.state.value ?? "–"} ${this.config.unit}</span>
      ${(this.data.state.offset ?? 0) !== 0 ? html`<button @click=${async () => {
        try {
          await this.hass!.callService("curve_scheduler", "clear_offset", { config_entry_id: this.data.entry_id });
        } catch {
          this.showMessage({ kind: "warning", text: text("Could not clear offset. Try again.", "Versatz konnte nicht zurückgesetzt werden. Erneut versuchen.") });
        }
      }}>${text("Clear offset", "Versatz zurücksetzen")}</button>` : nothing}
    </div>${this.renderTabs()}
      <div class="body" role="tabpanel">${body}</div>
      ${this.renderFooter()}`;
  }

  static styles = [
    sharedStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        gap: var(--zp-gap);
      }
      .condition-fields { display: grid; gap: 10px; min-width: 0; }
      .condition-group, .condition-child { min-width: 0; margin: 8px 0; padding: 12px; border: 1px solid var(--divider-color); border-radius: 10px; display: grid; gap: 10px; }
      .condition-group { border-left: 3px solid var(--primary-color); }
      .condition-group legend { padding: 0 6px; font-weight: 500; font-size: 14px; }
      .condition-fields ha-entity-picker { display: block; min-width: 0; width: 100%; }
      h3 {
        margin: 4px 0;
        font-size: 16px;
        font-weight: 500;
      }
      .tabs {
        display: flex;
        border-bottom: 1px solid var(--divider-color, rgba(127, 127, 127, 0.3));
        overflow-x: auto;
        scrollbar-width: none;
      }
      .tab {
        flex: 1 1 0;
        min-width: 0;
        padding: 4px 6px;
        line-height: 1.2;
        border: none;
        border-radius: 0;
        background: none;
        border-bottom: 3px solid transparent;
        color: var(--secondary-text-color);
        font-weight: 500;
      }
      .tab.active {
        color: var(--primary-color);
        border-bottom-color: var(--primary-color);
      }
      .body {
        display: flex;
        flex-direction: column;
        gap: var(--zp-gap);
        min-width: 0;
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .chip {
        border-radius: 22px;
        border-width: 2px;
      }
      .chip.active {
        border-color: var(--chip-color);
        background: color-mix(in srgb, var(--chip-color) 18%, transparent);
        font-weight: 500;
      }
      .chip.add {
        border-style: dashed;
      }
      .profile-settings {
        display: flex;
        flex-wrap: wrap;
        gap: var(--zp-gap);
        align-items: flex-end;
      }
      .profile-settings .field.grow {
        min-width: 160px;
      }
      .colors {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
      }
      .color {
        width: var(--zp-touch);
        height: var(--zp-touch);
        min-width: 0;
        padding: 0;
        border-radius: 50%;
        border: 3px solid transparent;
      }
      .color.active {
        border-color: var(--primary-text-color);
        box-shadow: inset 0 0 0 3px var(--card-background-color, #fff);
      }
      .chart-wrapper {
        margin: 0 -4px;
      }
      .chart-footer select {
        min-width: 100px;
      }
      .field.inline {
        flex-direction: row;
        align-items: center;
        gap: 8px;
      }
      .selected-point {
        padding: 10px;
        border-radius: var(--zp-radius);
        background: rgba(127, 127, 127, 0.08);
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .selected-point .row {
        align-items: flex-end;
      }
      .stepper {
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .stepper input.value {
        width: 5.5em;
        text-align: center;
      }
      table.points {
        width: 100%;
        border-collapse: collapse;
      }
      table.points caption {
        text-align: left;
        padding-bottom: 4px;
      }
      table.points th {
        text-align: left;
        font-size: 13px;
        font-weight: 500;
        color: var(--secondary-text-color);
        padding: 4px;
      }
      table.points td {
        padding: 4px;
        border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2));
      }
      table.points tr.selected td {
        background: rgba(127, 127, 127, 0.1);
      }
      table.points input[type="time"] {
        width: 100%;
        min-width: 6.5em;
      }
      table.points input.value {
        width: 100%;
        min-width: 4em;
        text-align: center;
      }
      table.points th:last-child,
      table.points td:last-child {
        width: var(--zp-touch);
      }
      .add-point {
        align-self: flex-start;
      }
      .copy {
        align-items: flex-end;
      }
      .week {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .week-row {
        display: flex;
        align-items: center;
        gap: 8px;
        padding-left: 10px;
        border-left: 6px solid var(--row-color);
        border-radius: 4px;
      }
      .week-row .day {
        flex: 0 0 8.5em;
      }
      .week-row select {
        flex: 1 1 auto;
        min-width: 0;
      }
      /* Keep native drag sources attached; CSS order provides the live preview. */
      .weekday-field { display: flex; flex-direction: column; gap: 4px; font-size: 13px; color: var(--secondary-text-color); }
      .weekday-select { border: 1px solid var(--divider-color); border-radius: var(--zp-radius); color: var(--primary-text-color); font-size: 16px; }
      .weekday-select summary { cursor: pointer; padding: 12px; min-height: var(--zp-touch); box-sizing: border-box; }
      .weekday-options { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 4px 12px; padding: 0 12px 12px; }
      .activation-list { display: flex; flex-direction: column; }
      .activation-drop-zone { display: none; }
      .dragging .activation-drop-zone {
        display: flex; align-items: center; justify-content: center; min-height: 30px;
        margin: 4px 0; border: 2px dashed var(--divider-color); border-radius: 8px;
        color: var(--secondary-text-color); font-size: 13px;
      }
      .dragging .activation-drop-zone.active {
        border-color: var(--primary-color); color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 10%, transparent);
      }
      .activation.drag-preview { opacity: .5; outline: 2px dashed var(--primary-color); }
      .activation { display: flex; flex-direction: column; gap: 12px; border: 1px solid var(--divider-color); border-left: 4px solid var(--primary-color); border-radius: 8px; padding: 12px; margin-bottom: 12px; }
      .week-row.holiday {
        margin-top: 8px;
      }
      .month-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin: 8px 0;
      }
      .calendar {
        display: grid;
        grid-template-columns: repeat(7, minmax(0, 1fr));
        gap: 3px;
      }
      .cell {
        min-height: 40px;
        border-radius: 6px;
        background: color-mix(in srgb, var(--cell-color) 35%, transparent);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 13px;
      }
      .cell.head {
        min-height: 24px;
        background: none;
        color: var(--secondary-text-color);
        font-size: 12px;
      }
      .cell.empty {
        background: none;
      }
      .cell.today {
        outline: 2px solid var(--primary-text-color);
      }
      .cell .mark {
        font-size: 11px;
        line-height: 1;
        min-height: 11px;
      }
      .legend {
        display: flex;
        flex-wrap: wrap;
        gap: 4px 14px;
        margin-top: 8px;
        font-size: 13px;
        color: var(--secondary-text-color);
      }
      .legend .row {
        gap: 4px;
      }
      .exceptions {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .exception {
        padding: 10px;
        border-radius: var(--zp-radius);
        border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.3));
        border-left: 6px solid var(--row-color);
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .exception .row {
        align-items: flex-end;
      }
      .exception.past {
        opacity: 0.55;
      }
      .exception input[type="date"] {
        min-width: 9.5em;
      }
      .badge {
        padding: 2px 8px;
        border-radius: 10px;
        font-size: 12px;
        background: rgba(127, 127, 127, 0.2);
        margin-bottom: 12px;
      }
      .badge.active {
        background: var(--primary-color);
        color: var(--text-primary-color, #fff);
      }
      .footer {
        position: sticky;
        bottom: 0;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
        padding: 8px 0 4px;
        background: var(--card-background-color, var(--ha-card-background, #fff));
        border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.3));
        z-index: 1;
      }
      @media (max-width: 400px) {
        .week-row .day {
          flex-basis: 6.5em;
        }
        .footer {
          display: grid;
          grid-template-columns: var(--zp-touch) var(--zp-touch) 1fr 1fr;
          gap: 6px;
        }
        .footer .grow {
          display: none;
        }
        .footer button:not(.icon) {
          padding: 0 6px;
        }
      }
      @media (max-width: 340px) {
        .footer {
          grid-template-columns: var(--zp-touch) var(--zp-touch) 1fr;
        }
        .footer .save {
          grid-column: 1 / -1;
        }
      }
    `,
  ];
}

if (!customElements.get("curve-scheduler-editor")) {
  customElements.define("curve-scheduler-editor", CurveSchedulerEditor);
}

declare global {
  interface HTMLElementTagNameMap {
    "curve-scheduler-editor": CurveSchedulerEditor;
  }
}
