/** Generic numeric curve: the same backend save API, independent of time profiles. */
import { LitElement, html, svg, css, nothing, type PropertyValues } from "lit";
import { saveSchedule, type HomeAssistant } from "./api";
import { Interpolator, clamp, roundToStep, type Point } from "./interpolation";
import { clone, type InstanceData, type NumericPoint } from "./model";
import { axisTicks, formatNumber } from "./format";
import { sharedStyles } from "./styles";

const labels = {
  en: { x: "Input", y: "Output", add: "Add point", remove: "Delete", save: "Save", discard: "Discard", edit: "Edit curve", conflict: "Changed elsewhere. Discard to reload before saving.", invalid: "Check points: finite numbers, ascending unique inputs within axis limits and outputs within limits.", failed: "Could not save", unavailable: "Input unavailable", wrap: "Wrapping", clamp: "Clamped", dirty: "Unsaved changes", saved: "Saved" },
  de: { x: "Eingang", y: "Ausgang", add: "Punkt hinzufügen", remove: "Löschen", save: "Speichern", discard: "Verwerfen", edit: "Kurve bearbeiten", conflict: "Andernorts geändert. Vor dem Speichern verwerfen und neu laden.", invalid: "Punkte prüfen: endliche Zahlen, aufsteigende eindeutige Eingänge und Ausgänge innerhalb der Grenzen.", failed: "Speichern fehlgeschlagen", unavailable: "Eingang nicht verfügbar", wrap: "Umlaufend", clamp: "Begrenzt", dirty: "Ungespeicherte Änderungen", saved: "Gespeichert" },
};

export class NumericEditor extends LitElement {
  static properties = { drag: { state: true }, hass: { attribute: false }, data: { attribute: false }, editable: { type: Boolean }, language: {}, points: { state: true }, editing: { state: true }, message: { state: true }, saving: { state: true } };
  declare hass: HomeAssistant;
  declare data: InstanceData;
  declare editable: boolean;
  declare language: string;
  declare points: NumericPoint[];
  declare editing: boolean;
  declare message: string;
  declare saving: boolean;
  private revision = 0;
  private base = "";
  private drag: number | null = null;
  constructor() {
    super(); this.editable = false; this.language = "en"; this.points = []; this.editing = false; this.message = ""; this.saving = false;
  }
  private beforeUnload = (event: BeforeUnloadEvent) => {
    if (this.dirty) { event.preventDefault(); event.returnValue = ""; }
  };
  connectedCallback() { super.connectedCallback(); window.addEventListener("beforeunload", this.beforeUnload); }
  disconnectedCallback() { window.removeEventListener("beforeunload", this.beforeUnload); super.disconnectedCallback(); }
  private get text() { return labels[this.language.startsWith("de") ? "de" : "en"]; }
  get dirty() { return JSON.stringify(this.points) !== this.base; }
  protected willUpdate(changed: PropertyValues<this>) {
    if (changed.has("data") && this.data && (!this.base || !this.dirty) && !this.saving) this.reset();
  }
  private reset() {
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
  }
  private move(event: PointerEvent) {
    if (this.drag === null || this.saving) return;
    const rect = (event.currentTarget as SVGSVGElement).getBoundingClientRect();
    const axis = this.data.config.axis!;
    const x = axis.min + roundToStep(clamp((event.clientX - rect.left) / rect.width, 0, 1) * (axis.max - axis.min), axis.step);
    const low = this.drag ? this.points[this.drag - 1].x + axis.step : axis.min;
    const high = this.drag + 1 < this.points.length ? this.points[this.drag + 1].x - axis.step : axis.max - (axis.wrap ? axis.step : 0);
    if (low > high) return;
    const v = this.data.config.max - clamp((event.clientY - rect.top) / rect.height, 0, 1) * (this.data.config.max - this.data.config.min);
    this.points = this.points.map((p, i) => i === this.drag ? { x: clamp(x, low, high), v: clamp(roundToStep(v, this.data.config.step), this.data.config.min, this.data.config.max) } : p);
  }
  private endDrag(event: PointerEvent) { this.drag = null; (event.currentTarget as SVGSVGElement).releasePointerCapture?.(event.pointerId); }
  protected render() {
    if (!this.data?.config.axis) return nothing;
    const { config, state } = this.data;
    const axis = config.axis!;
    const xFor = (x: number) => 100 * (x - axis.min) / (axis.max - axis.min);
    const yFor = (y: number) => 100 * (config.max - y) / (config.max - config.min);
    const xTicks = axisTicks(axis.min, axis.max, config.x_label_step);
    const yTicks = axisTicks(config.min, config.max, config.y_label_step);
    const labelX = (x: number) => formatNumber(x, config.x_label_step || axis.step, this.language);
    const labelY = (y: number) => formatNumber(y, config.y_label_step || config.step, this.language);
    const dragged = this.drag === null ? null : this.points[this.drag];
    let path = "";
    if (this.valid) {
      let timeline: Point[] = this.points.map(p => [p.x, p.v] as const);
      if (axis.wrap) { const width = axis.max - axis.min; timeline = [-2, -1, 0, 1, 2].flatMap(n => timeline.map(([x, y]) => [x + n * width, y] as const)); }
      const curve = new Interpolator(timeline, config.interpolation);
      const samples = Array.from({ length: 289 }, (_, i) => axis.min + (axis.max - axis.min) * i / 288);
      const xs = [...new Set([...samples, ...this.points.flatMap(p => [Math.max(axis.min, p.x - (axis.max - axis.min) * 1e-9), p.x])])].sort((a, b) => a - b);
      path = xs.map((x, i) => `${i ? "L" : "M"}${xFor(x)},${yFor(curve.at(x))}`).join(" ");
    }
    return html`
      <p>${this.text.x}: ${state.input_value ?? "—"} → ${this.text.y}: ${state.value ?? "—"} ${config.unit ?? ""}</p>
      <p class="muted">${axis.source === "sensor" ? axis.input_entity : axis.source} · ${axis.min}…${axis.max} · ${axis.wrap ? this.text.wrap : this.text.clamp}</p>
      ${state.input_available === false ? html`<p role="status">${this.text.unavailable}</p>` : nothing}
      <div class="graph"><div class="plot">
      <div class="y-axis">${yTicks.map(y => html`<span class="tick-y" style="top:${yFor(y)}%">${labelY(y)}</span>`)}</div>
      <div class="x-axis">${xTicks.map(x => html`<span class="tick-x" style="left:${xFor(x)}%">${labelX(x)}</span>`)}</div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-label=${this.text.edit} role="img"
        @pointermove=${this.move} @pointerup=${this.endDrag} @pointercancel=${this.endDrag} @lostpointercapture=${() => { this.drag = null; }}>
        ${xTicks.map(x => svg`<line class="grid" x1=${xFor(x)} x2=${xFor(x)} y1="0" y2="100"></line>`)}
        ${yTicks.map(y => svg`<line class="grid" x1="0" x2="100" y1=${yFor(y)} y2=${yFor(y)}></line>`)}
        <path d=${path}></path>
        ${dragged ? svg`<line class="guide" x1="0" x2=${xFor(dragged.x)} y1=${yFor(dragged.v)} y2=${yFor(dragged.v)}></line><line class="guide" x1=${xFor(dragged.x)} x2=${xFor(dragged.x)} y1=${yFor(dragged.v)} y2="100"></line>` : nothing}
        ${state.input_value != null ? svg`<line x1=${xFor(state.input_value)} x2=${xFor(state.input_value)} y1="0" y2="100"></line>` : nothing}
        ${this.editing && this.editable ? this.points.map((p, i) => svg`<ellipse cx=${xFor(p.x)} cy=${yFor(p.v)} rx="1.5" ry="3" @pointerdown=${(e: PointerEvent) => { if (this.saving) return; this.drag = i; (e.currentTarget as Element).closest("svg")?.setPointerCapture(e.pointerId); }}></ellipse>`) : nothing}
      </svg>
      ${dragged ? html`<span class="axis-hit hit-x" style="left:${xFor(dragged.x)}%">${labelX(dragged.x)}</span><span class="axis-hit hit-y" style="top:${yFor(dragged.v)}%">${labelY(dragged.v)}</span>` : nothing}
      </div></div>
      ${this.editable ? html`<button @click=${() => { if (!this.editing || !this.dirty || window.confirm(this.text.discard)) { if (this.editing) this.reset(); this.editing = !this.editing; } }}>${this.text.edit}</button>` : nothing}
      ${this.editable && this.editing ? html`
        ${this.points.map((p, i) => html`<div class="row">
          <label>${this.text.x}<input type="number" step=${axis.step} min=${axis.min} max=${axis.max} .value=${String(p.x)} ?disabled=${this.saving} @change=${(e: Event) => this.changed(i, "x", Number((e.target as HTMLInputElement).value))}></label>
          <label>${this.text.y}<input type="number" step=${config.step} min=${config.min} max=${config.max} .value=${String(p.v)} ?disabled=${this.saving} @change=${(e: Event) => this.changed(i, "v", Number((e.target as HTMLInputElement).value))}></label>
          <button aria-label=${`${this.text.remove} ${i + 1}`} ?disabled=${this.saving || this.points.length <= 1} @click=${() => { this.points = this.points.filter((_, j) => i !== j); }}>${this.text.remove}</button>
        </div>`)}
        <button ?disabled=${this.saving || this.points.length >= 48} @click=${this.add}>${this.text.add}</button>
        <button ?disabled=${this.saving} @click=${this.reset}>${this.text.discard}</button>
        <button ?disabled=${this.saving || !this.dirty || !this.valid} @click=${this.save}>${this.text.save}</button>
        ${this.dirty ? html`<p>${this.text.dirty}</p>` : nothing}
      ` : nothing}
      <p role="status">${this.message}</p>`;
  }
  static styles = [sharedStyles, css`
    :host { display:block; } svg { width:100%; height:220px; overflow:visible; border:1px solid var(--divider-color); touch-action:pan-y; }
    :host:has(ellipse) svg { touch-action:none; }
    path { fill:none; stroke:var(--primary-color); stroke-width:2; vector-effect:non-scaling-stroke; }
    line { stroke:var(--error-color); stroke-width:1; vector-effect:non-scaling-stroke; }
    .graph { position:relative; padding:10px 28px 34px 70px; }
    .plot { position:relative; } svg { display:block; }
    .y-axis { position:absolute; top:0; right:calc(100% + 8px); height:100%; width:62px; }
    .x-axis { position:absolute; top:calc(100% + 8px); left:0; width:100%; }
    .tick-y { position:absolute; right:0; transform:translateY(-50%); }
    .tick-x { position:absolute; transform:translateX(-50%); white-space:nowrap; }
    .x-axis, .y-axis, .axis-hit { font-size:12px; color:var(--secondary-text-color); pointer-events:none; }
    .axis-hit { position:absolute; padding:2px; background:var(--card-background-color); color:var(--primary-color); font-weight:bold; white-space:nowrap; }
    .hit-x { top:calc(100% + 8px); transform:translateX(-50%); } .hit-y { right:calc(100% + 8px); transform:translateY(-50%); }
    line.grid { stroke:var(--divider-color); } line.guide { stroke:var(--primary-color); stroke-dasharray:4 3; pointer-events:none; }
    ellipse { fill:var(--primary-color); cursor:grab; stroke:transparent; stroke-width:44; vector-effect:non-scaling-stroke; pointer-events:all; } input { width:100%; box-sizing:border-box; }
    .row { display:flex; justify-content:space-between; gap:8px; align-items:end; margin:8px 0; } label { min-width:0; }
  `];
}
customElements.define("curve-scheduler-numeric-editor", NumericEditor);
