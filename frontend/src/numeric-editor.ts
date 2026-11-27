/** Generic numeric curve: the same backend save API, independent of time profiles. */
import { LitElement, html, css, nothing, type PropertyValues } from "lit";
import { saveSchedule, type HomeAssistant } from "./api";
import { roundToStep } from "./interpolation";
import { formatNumber } from "./format";
import { clone, type InstanceData, type NumericPoint } from "./model";
import "./curve";
import { anchorControls, detachDeletedAnchors } from "./anchor-editor";
import { sharedStyles } from "./styles";

const labels = {
  en: { x: "Input", y: "Output", add: "Add point", remove: "Delete", save: "Save", discard: "Discard", edit: "Edit curve", conflict: "Changed elsewhere. Discard to reload before saving.", invalid: "Check points: finite numbers, ascending unique inputs within axis limits and outputs within limits.", failed: "Could not save", unavailable: "Input unavailable", wrap: "Wrapping", clamp: "Clamped", dirty: "Unsaved changes", saved: "Saved" },
  de: { x: "Eingang", y: "Ausgang", add: "Punkt hinzufügen", remove: "Löschen", save: "Speichern", discard: "Verwerfen", edit: "Kurve bearbeiten", conflict: "Andernorts geändert. Vor dem Speichern verwerfen und neu laden.", invalid: "Punkte prüfen: endliche Zahlen, aufsteigende eindeutige Eingänge und Ausgänge innerhalb der Grenzen.", failed: "Speichern fehlgeschlagen", unavailable: "Eingang nicht verfügbar", wrap: "Umlaufend", clamp: "Begrenzt", dirty: "Ungespeicherte Änderungen", saved: "Gespeichert" },
};

export class NumericEditor extends LitElement {
  static properties = { showLegend: { type: Boolean }, graphOnly: { attribute: false }, offset: { attribute: false }, embedded: { type: Boolean }, selected: { state: true }, hass: { attribute: false }, data: { attribute: false }, editable: { type: Boolean }, language: {}, points: { state: true }, editing: { state: true }, message: { state: true }, saving: { state: true } };
  declare graphOnly: boolean;
  declare showLegend: boolean;
  declare offset: number;
  declare embedded: boolean;
  declare hass: HomeAssistant;
  declare data: InstanceData;
  declare editable: boolean;
  declare language: string;
  declare points: NumericPoint[];
  declare editing: boolean;
  declare message: string;
  declare saving: boolean;
  private selected: number | null = null;
  private revision = 0;
  private base = "";
  constructor() {
    super(); this.graphOnly = false; this.offset = 0; this.embedded = false; this.editable = false; this.language = "en"; this.points = []; this.editing = false; this.message = ""; this.saving = false;
  }
  private beforeUnload = (event: BeforeUnloadEvent) => {
    if (this.dirty) { event.preventDefault(); event.returnValue = ""; }
  };
  connectedCallback() { super.connectedCallback(); this.tabIndex = 0; this.addEventListener("keydown", this.onPointKeyDown); window.addEventListener("beforeunload", this.beforeUnload); }
  disconnectedCallback() { this.removeEventListener("keydown", this.onPointKeyDown); window.removeEventListener("beforeunload", this.beforeUnload); super.disconnectedCallback(); }
  private onPointKeyDown = (event: KeyboardEvent): void => {
    if (!this.editable || !this.editing || this.saving || event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) return;
    const path = event.composedPath();
    const typing = path.some(el => el instanceof HTMLElement && (el.matches("input, textarea, select") || el.isContentEditable));
    if (event.key === "Escape") {
      this.selected = null;
    } else if (!typing && (event.key === "Delete" || event.key === "Backspace") && this.selected !== null) {
      if (this.points.length > 1) this.points = detachDeletedAnchors(this.points.filter((_, i) => i !== this.selected));
      this.selected = null;
      this.focus();
    } else if (!typing && event.code === "Space" && !event.repeat && !path.some(el => el instanceof Element && el.matches("button, a"))) {
      if (this.points.length < 48) this.add();
    } else return;
    event.preventDefault();
    event.stopPropagation();
  };
  private get text() { return labels[this.language.startsWith("de") ? "de" : "en"]; }
  get dirty() { return !this.embedded && JSON.stringify(this.points) !== this.base; }
  protected willUpdate(changed: PropertyValues<this>) {
    if (this.embedded && changed.has("points")) this.dispatchEvent(new CustomEvent("numeric-points-changed", { detail: clone(this.points) }));
    if (!this.embedded && changed.has("data") && this.data && (!this.base || !this.dirty) && !this.saving) this.reset();
  }
  private reset() {
    this.selected = null;
    this.points = clone(this.data.schedule.curve ?? []); this.revision = this.data.revision;
    this.base = JSON.stringify(this.points); this.message = "";
  }
  confirmLeave(message: string): boolean {
    if (!this.dirty) return true;
    if (!window.confirm(message)) return false;
    this.reset();
    return true;
  }
  private changed(index: number, field: "x" | "v", value: number) {
    this.points = this.points.map((p, i) => i === index ? { ...p, [field]: value } : p);
  }
  private get valid() {
    const axis = this.data.config.axis!;
    return this.points.length >= 1 && this.points.length <= 48 && this.points.every((p, i) =>
      Number.isFinite(p.x) && Number.isFinite(p.v) && p.x >= axis.min && p.x <= axis.max &&
      (!axis.wrap || p.x < axis.max) && (i === 0 || p.x > this.points[i - 1].x) &&
      p.v >= this.data.config.min && p.v <= this.data.config.max);
  }
  private async save() {
    if (!this.valid) { this.message = this.text.invalid; return; }
    this.saving = true;
    try {
      const result = await saveSchedule(this.hass, this.data.entry_id, this.revision, { ...this.data.schedule, curve: this.points });
      if (result.ok) { this.revision = result.revision; this.base = JSON.stringify(this.points); this.message = this.text.saved; }
      else this.message = result.conflict ? this.text.conflict : this.text.invalid;
    } catch { this.message = this.text.failed; }
    finally { this.saving = false; }
  }
  private add() {
    const axis = this.data.config.axis!;
    // Insert into the largest free interval, including either axis edge.
    const xs = [axis.min - axis.step, ...this.points.map(p => p.x), axis.max];
    let x: number | undefined;
    let gap = 0;
    for (let i = 1; i < xs.length; i++) {
      const candidate = axis.min + roundToStep((xs[i - 1] + xs[i]) / 2 - axis.min, axis.step);
      if (xs[i] - xs[i - 1] > gap && candidate >= axis.min && candidate <= axis.max && (!axis.wrap || candidate < axis.max) && !this.points.some(p => p.x === candidate)) { x = candidate; gap = xs[i] - xs[i - 1]; }
    }
    if (x === undefined) return;
    this.points = [...this.points, { x, v: this.data.config.min }].sort((a, b) => a.x - b.x);
    this.selected = this.points.findIndex(point => point.x === x);
  }
  protected render() {
    if (!this.data?.config.axis) return nothing;
    const { config, state } = this.data;
    const axis = config.axis!;
    const live = !this.editable && !this.embedded ? state.resolved_profiles?.[state.profile_id] : undefined;
    const anchored = this.points.some(p => p.anchor || p.partner_of);
    return html`
      ${this.graphOnly ? nothing : html`<p>${this.text.x}: ${state.input_value == null ? "—" : formatNumber(state.input_value, 10 ** -(config.input_decimals ?? 2), this.language)} → ${this.text.y}: ${state.value ?? "—"} ${config.unit ?? ""}</p>
      <p class="muted">${axis.source === "sensor" ? axis.input_entity : axis.source === "day_of_week" ? (this.language.startsWith("de") ? "Wochentag (1 = Mo, 7 = So; Bruchteile = Tageszeit)" : "Day of week (1 = Mon, 7 = Sun; fractions = time of day)") : axis.source} · ${axis.min}…${axis.max} · ${axis.wrap ? this.text.wrap : this.text.clamp}</p>`}
      ${state.input_available === false ? html`<p role="status">${this.text.unavailable}</p>` : nothing}
      <curve-scheduler-curve
        .showLegend=${this.showLegend && !this.editable && !this.embedded}
        .offset=${this.offset}
        .axis=${axis} .numericPoints=${this.valid ? this.points : []}
        .displayPoints=${live ? live.points ?? [] : undefined}
        .pointPositions=${live?.point_positions}
        .referencePoints=${live && (anchored || live.errors.length) ? this.points.map(p => [p.x, p.v]) : undefined}
        .mode=${config.interpolation} .min=${config.min} .max=${config.max} .step=${config.step}
        .xLabelStep=${config.x_label_step ?? 0} .yLabelStep=${config.y_label_step ?? 0}
        .unit=${config.unit} .language=${this.language}
        .color=${"var(--plan-color, var(--primary-color))"}
        .editable=${this.editable && this.editing && !this.saving} .selected=${this.selected}
        .nowMinute=${state.input_value ?? null} .nowValue=${state.value}
        .showContinuation=${axis.wrap}
        @point-selected=${(e: CustomEvent) => { this.selected = e.detail.index; }}
        @numeric-points-changed=${(e: CustomEvent) => { e.stopPropagation(); this.points = e.detail.points; this.selected = e.detail.selected; }}
      ></curve-scheduler-curve>
      ${this.editable && !this.embedded ? html`<button @click=${() => { if (!this.editing || !this.dirty || window.confirm(this.text.discard)) { if (this.editing) this.reset(); this.editing = !this.editing; } }}>${this.text.edit}</button>` : nothing}
      ${this.editable && this.editing ? html`
        ${axis.source === "day_of_week" ? anchorControls(this.points, this.selected, this.hass, this.language, points => { this.points = points; }) : nothing}
        ${this.points.map((p, i) => html`<div class="row" @focusin=${() => { this.selected = i; }}>
          <label>${this.text.x}<input type="number" step=${axis.step} min=${axis.min} max=${axis.max} .value=${String(p.x)} ?disabled=${this.saving} @change=${(e: Event) => this.changed(i, "x", Number((e.target as HTMLInputElement).value))}></label>
          <label>${this.text.y}<input type="number" step=${config.step} min=${config.min} max=${config.max} .value=${String(p.v)} ?disabled=${this.saving} @change=${(e: Event) => this.changed(i, "v", Number((e.target as HTMLInputElement).value))}></label>
          <button aria-label=${`${this.text.remove} ${i + 1}`} ?disabled=${this.saving || this.points.length <= 1} @click=${() => { this.points = detachDeletedAnchors(this.points.filter((_, j) => i !== j)); }}>${this.text.remove}</button>
        </div>`)}
        <button ?disabled=${this.saving || this.points.length >= 48} @click=${this.add}>${this.text.add}</button>
        ${!this.embedded ? html`<button ?disabled=${this.saving} @click=${this.reset}>${this.text.discard}</button>
        <button ?disabled=${this.saving || !this.dirty || !this.valid} @click=${this.save}>${this.text.save}</button>` : nothing}
        ${this.dirty ? html`<p>${this.text.dirty}</p>` : nothing}
      ` : nothing}
      <p role="status">${this.message}</p>`;
  }
  static styles = [sharedStyles, css` p { margin: 2px 0; }
    :host { display:block; }
    input { width:100%; box-sizing:border-box; }
    .row { display:flex; justify-content:space-between; gap:8px; align-items:end; margin:8px 0; } label { min-width:0; }
  `];
}
customElements.define("curve-scheduler-numeric-editor", NumericEditor);
