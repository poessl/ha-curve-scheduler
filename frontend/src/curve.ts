/**
 * <curve-scheduler-curve>: shared time/numeric chart with draggable points.
 *
 * Points are rendered as 44 px HTML handles on top of the SVG so they can be
 * dragged with touch in every direction (touch-action: none) while the rest of
 * the chart still lets the page scroll.
 */

import { LitElement, css, html, nothing, svg, type PropertyValues } from "lit";
import {
  Interpolator,
  MINUTES_PER_DAY,
  buildTimeline,
  clamp,
  formatTime,
  parseTime,
  roundToStep,
  type Mode,
  type Point,
} from "./interpolation";
import { MAX_POINTS, TIME_GRID_MINUTES, type SchedulePoint, type NumericPoint, type AxisConfig } from "./model";
import { axisTicks, formatNumber, formatValue, niceTicks } from "./format";

const PAD_LEFT = 44;
const PAD_RIGHT = 10;
const PAD_TOP = 14;
const PAD_BOTTOM = 26;
const CONTINUATION = 120; // minutes of the next day shown dashed
const TAP_TOLERANCE = 8; // px of movement that still counts as a tap
const HANDLE_SIZE = 44;

export interface PointsChangedDetail {
  points: SchedulePoint[];
  selected: number | null;
}

export interface CurveNoticeDetail {
  key: "point.full" | "point.taken";
  params: Record<string, unknown>;
}

type ChartPoint = SchedulePoint | NumericPoint;

interface DragState {
  index: number;
  pointerId: number;
  startX: number;
  startY: number;
  moved: boolean;
  points: ChartPoint[];
}

export class CurveSchedulerCurve extends LitElement {
  static properties = {
    offset: { attribute: false },
    points: { attribute: false },
    numericPoints: { attribute: false },
    axis: { attribute: false },
    context: { attribute: false },
    mode: {},
    min: { type: Number },
    max: { type: Number },
    step: { type: Number },
    unit: {},
    language: {},
    color: {},
    snapMinutes: { type: Number, attribute: "snap-minutes" },
    xLabelStep: { type: Number },
    yLabelStep: { type: Number },
    editable: { type: Boolean, reflect: true },
    nowMinute: { attribute: false },
    nowValue: { attribute: false },
    selected: { attribute: false },
    height: { type: Number },
    showContinuation: { type: Boolean, attribute: "show-continuation" },
    _width: { state: true },
    _drag: { state: true },
  };

  /** Time plans retain their serialized HH:MM points; numeric plans use numericPoints + axis. */
  declare points: SchedulePoint[];
  declare numericPoints: NumericPoint[];
  declare axis: AxisConfig | null;
  /** Points of [day-2, day-1, day+1, day+2]; null repeats the edited day. */
  declare context: Point[][] | null;
  declare mode: Mode;
  declare min: number;
  declare max: number;
  declare step: number;
  declare unit: string | null;
  declare language: string;
  declare color: string;
  declare snapMinutes: number;
  declare xLabelStep: number;
  declare yLabelStep: number;
  declare editable: boolean;
  declare nowMinute: number | null;
  declare offset: number;
  declare nowValue: number | null;
  declare selected: number | null;
  declare height: number;
  declare showContinuation: boolean;
  declare _width: number;
  declare _drag: DragState | null;

  private resizeObserver?: ResizeObserver;

  constructor() {
    super();
    this.points = [];
    this.numericPoints = [];
    this.axis = null;
    this.context = null;
    this.mode = "curve";
    this.min = 20;
    this.max = 70;
    this.step = 0.5;
    this.unit = null;
    this.language = "en";
    this.color = "var(--primary-color, #03a9f4)";
    this.snapMinutes = 15;
    this.xLabelStep = 0;
    this.yLabelStep = 0;
    this.editable = false;
    this.nowMinute = null;
    this.offset = 0;
    this.nowValue = null;
    this.selected = null;
    this.height = 220;
    this.showContinuation = true;
    this._width = 320;
    this._drag = null;
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver((entries) => {
        const width = Math.round(entries[0]?.contentRect.width ?? 0);
        if (width > 0 && width !== this._width) {
          this._width = width;
        }
      });
      this.resizeObserver.observe(this);
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.resizeObserver?.disconnect();
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    if ((changed.has("points") || changed.has("numericPoints") || changed.has("axis")) && this._drag && !this.editable) {
      this._drag = null;
    }
  }

  // ------------------------------------------------------------------
  // Geometry

  private get domainStart(): number { return this.axis?.min ?? 0; }

  private get sourcePoints(): ChartPoint[] { return this.axis ? this.numericPoints : this.points; }

  private xOf(point: ChartPoint): number { return "x" in point ? point.x : parseTime(point.t); }

  private formatX(x: number): string {
    if (this.axis?.source === "day_of_week") {
      const day = Math.floor(x - 1);
      const label = new Intl.DateTimeFormat(this.language, { weekday: "short", timeZone: "UTC" }).format(new Date(Date.UTC(2024, 0, 1 + ((day % 7) + 7) % 7)));
      const minutes = Math.round((x - Math.floor(x)) * 1440);
      return `${label}${day >= 7 ? " +1" : ""}${minutes ? ` ${formatTime(minutes)}` : ""}`;
    }
    return this.axis ? formatNumber(x, this.xLabelStep || this.axis.step, this.language) : formatTime(x);
  }

  private pointAt(x: number, v: number): ChartPoint {
    return this.axis ? { x, v } : { t: formatTime(x), v };
  }

  private get domainEnd(): number {
    if (this.axis) return this.axis.max;
    return this.showContinuation ? MINUTES_PER_DAY + CONTINUATION : MINUTES_PER_DAY;
  }

  private get plotWidth(): number {
    return Math.max(10, this._width - PAD_LEFT - PAD_RIGHT);
  }

  private get plotHeight(): number {
    return Math.max(10, this.height - PAD_TOP - PAD_BOTTOM);
  }

  xFor(minute: number): number {
    return PAD_LEFT + ((minute - this.domainStart) / (this.domainEnd - this.domainStart)) * this.plotWidth;
  }

  yFor(value: number): number {
    const span = this.max - this.min || 1;
    return PAD_TOP + (1 - (value - this.min) / span) * this.plotHeight;
  }

  minuteAt(x: number): number {
    return this.domainStart + ((x - PAD_LEFT) / this.plotWidth) * (this.domainEnd - this.domainStart);
  }

  valueAt(y: number): number {
    const span = this.max - this.min || 1;
    return this.min + (1 - (y - PAD_TOP) / this.plotHeight) * span;
  }

  /** Points currently displayed (live while dragging). */
  get shownPoints(): ChartPoint[] {
    return this._drag?.points ?? this.sourcePoints;
  }

  private timeline(points: ChartPoint[]): Point[] | null {
    if (points.length === 0) {
      return null;
    }
    const center: Point[] = points.map((p) => [this.xOf(p), p.v]);
    if (this.axis) {
      if (!this.axis.wrap) return center;
      const width = this.axis.max - this.axis.min;
      return [-2, -1, 0, 1, 2].flatMap(n => center.map(([x, v]) => [x + n * width, v] as Point));
    }
    const ctx = this.context;
    const days = ctx ? [ctx[0], ctx[1], center, ctx[2], ctx[3]] : [center, center, center, center, center];
    return buildTimeline(days);
  }

  /** Interpolated value of the shown curve at a minute. */
  curveValue(minute: number): number | null {
    const timeline = this.timeline(this.shownPoints);
    return timeline ? new Interpolator(timeline, this.mode).at(minute) : null;
  }

  // ------------------------------------------------------------------
  // Snapping and limits

  private snapTime(minute: number): number {
    if (this.axis) return this.axis.min + roundToStep(minute - this.axis.min, this.axis.step);
    const grid = Math.max(TIME_GRID_MINUTES, this.snapMinutes || TIME_GRID_MINUTES);
    return Math.round(minute / grid) * grid;
  }

  private snapValue(value: number): number {
    return clamp(roundToStep(clamp(value, this.min, this.max), this.step), this.min, this.max);
  }

  /** Time limits for point ``index`` so it cannot pass its neighbours. */
  private timeLimits(points: ChartPoint[], index: number): [number, number] {
    const step = this.axis?.step ?? TIME_GRID_MINUTES;
    const low = index > 0 ? this.xOf(points[index - 1]) + step : this.domainStart;
    const high =
      index < points.length - 1
        ? this.xOf(points[index + 1]) - step
        : this.axis ? this.axis.max - (this.axis.wrap ? step : 0) : MINUTES_PER_DAY - TIME_GRID_MINUTES;
    return [low, high];
  }

  /** Move point ``index`` to (minute, value) honouring snapping and neighbours. */
  movePoint<T extends ChartPoint>(
    points: T[],
    index: number,
    minute: number,
    value: number,
  ): T[] {
    const [low, high] = this.timeLimits(points, index);
    if (low > high) return points;
    const t = clamp(this.snapTime(minute), low, high);
    // Clamp may land between grid steps when neighbours are close: keep 5 min grid.
    const gridT = clamp(Math.round(t / TIME_GRID_MINUTES) * TIME_GRID_MINUTES, low, high);
    const next = points.map((p) => ({ ...p }));
    next[index] = this.pointAt(this.axis ? t : gridT, this.snapValue(value)) as T;
    return next;
  }

  // ------------------------------------------------------------------
  // Events

  private emitChange(points: ChartPoint[], selected: number | null): void {
    this.dispatchEvent(
      new CustomEvent(this.axis ? "numeric-points-changed" : "points-changed", {
        detail: { points, selected },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private emitSelect(index: number | null): void {
    this.dispatchEvent(
      new CustomEvent<{ index: number | null }>("point-selected", {
        detail: { index },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private emitNotice(detail: CurveNoticeDetail): void {
    this.dispatchEvent(
      new CustomEvent<CurveNoticeDetail>("curve-notice", { detail, bubbles: true, composed: true }),
    );
  }

  private localPosition(event: PointerEvent | MouseEvent): { x: number; y: number } {
    const rect = this.renderRoot.querySelector(".chart")?.getBoundingClientRect();
    return { x: event.clientX - (rect?.left ?? 0), y: event.clientY - (rect?.top ?? 0) };
  }

  /** Add a point at a chart position (used for taps on the chart). */
  addPointAt(x: number): void {
    if (!this.editable) {
      return;
    }
    const minute = this.snapTime(this.minuteAt(x));
    if (minute < this.domainStart || (this.axis && !this.axis.wrap ? minute > this.domainEnd : minute >= (this.axis?.max ?? MINUTES_PER_DAY))) {
      return;
    }
    const existing = this.sourcePoints.findIndex((p) => this.xOf(p) === minute);
    if (existing >= 0) {
      this.emitSelect(existing);
      this.emitNotice({ key: "point.taken", params: { time: this.formatX(minute) } });
      return;
    }
    if (this.sourcePoints.length >= MAX_POINTS) {
      this.emitNotice({ key: "point.full", params: { max: MAX_POINTS } });
      return;
    }
    const curve = this.curveValue(minute);
    const value = this.snapValue(curve ?? (this.min + this.max) / 2);
    const points = this.sourcePoints.map((p) => ({ ...p }));
    let index = points.findIndex((p) => this.xOf(p) > minute);
    if (index < 0) {
      index = points.length;
    }
    points.splice(index, 0, this.pointAt(minute, value));
    this.emitChange(points, index);
  }

  private onChartPointerDown(event: PointerEvent): void {
    if (!this.editable || event.button > 0) {
      return;
    }
    const { x, y } = this.localPosition(event);
    this.tapStart = { x, y, pointerId: event.pointerId };
  }

  private tapStart: { x: number; y: number; pointerId: number } | null = null;

  private onChartPointerUp(event: PointerEvent): void {
    const start = this.tapStart;
    this.tapStart = null;
    if (!start || start.pointerId !== event.pointerId || this._drag) {
      return;
    }
    const { x, y } = this.localPosition(event);
    if (Math.hypot(x - start.x, y - start.y) > TAP_TOLERANCE) {
      return;
    }
    this.addPointAt(x);
  }

  private onChartPointerCancel(): void {
    this.tapStart = null;
  }

  private onHandlePointerDown(event: PointerEvent, index: number): void {
    if (!this.editable) {
      return;
    }
    event.stopPropagation();
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    target.setPointerCapture?.(event.pointerId);
    target.focus?.({ preventScroll: true });
    const { x, y } = this.localPosition(event);
    this._drag = {
      index,
      pointerId: event.pointerId,
      startX: x,
      startY: y,
      moved: false,
      points: this.sourcePoints.map((p) => ({ ...p })),
    };
    this.emitSelect(index);
  }

  private onHandlePointerMove(event: PointerEvent): void {
    const drag = this._drag;
    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }
    event.preventDefault();
    const { x, y } = this.localPosition(event);
    if (!drag.moved && Math.hypot(x - drag.startX, y - drag.startY) < 3) {
      return;
    }
    const points = this.movePoint(this.sourcePoints, drag.index, this.minuteAt(x), this.valueAt(y));
    this._drag = { ...drag, moved: true, points };
  }

  private onHandlePointerUp(event: PointerEvent): void {
    const drag = this._drag;
    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }
    this._drag = null;
    const changed = drag.points.some(
      (p, i) => this.xOf(p) !== this.xOf(this.sourcePoints[i]) || p.v !== this.sourcePoints[i].v,
    );
    if (drag.moved && changed) {
      this.emitChange(drag.points, drag.index);
    }
  }

  private onHandlePointerCancel(): void {
    this._drag = null;
  }

  private onHandleKeyDown(event: KeyboardEvent, index: number): void {
    if (!this.editable) {
      return;
    }
    const point = this.sourcePoints[index];
    let minute = this.xOf(point);
    let value = point.v;
    const grid = this.axis?.step ?? Math.max(TIME_GRID_MINUTES, this.snapMinutes);
    switch (event.key) {
      case "ArrowLeft":
        minute -= grid;
        break;
      case "ArrowRight":
        minute += grid;
        break;
      case "ArrowUp":
        value += this.step;
        break;
      case "ArrowDown":
        value -= this.step;
        break;
      default:
        return;
    }
    event.preventDefault();
    this.emitChange(this.movePoint(this.sourcePoints, index, minute, value), index);
  }

  // ------------------------------------------------------------------
  // Rendering

  private curvePath(points: ChartPoint[], from: number, to: number, adjusted = false): string {
    const timeline = this.timeline(points);
    if (!timeline) {
      return "";
    }
    const interpolator = new Interpolator(timeline, this.mode);
    const samples = Math.max(24, Math.round(this.plotWidth / 2));
    const stepMinutes = (to - from) / samples;
    const parts: string[] = [];
    let previous: number | null = null;
    const inputs = Array.from({ length: samples + 1 }, (_, i) => from + i * stepMinutes);
    if (this.axis) inputs.push(...points.flatMap(p => [this.xOf(p) - (to - from) * 1e-9, this.xOf(p)]).filter(x => x >= from && x <= to));
    for (const [i, minute] of [...new Set(inputs)].sort((a, b) => a - b).entries()) {
      const raw = clamp(interpolator.at(minute), this.min, this.max);
      const value = adjusted ? clamp(roundToStep(clamp(roundToStep(raw, this.step) + this.offset, this.min, this.max), this.step), this.min, this.max) : raw;
      const x = this.xFor(minute).toFixed(1);
      const y = this.yFor(value).toFixed(1);
      if (this.mode === "step" && previous !== null && value !== previous) {
        parts.push(`L${x},${this.yFor(previous).toFixed(1)}`);
      }
      parts.push(`${i === 0 ? "M" : "L"}${x},${y}`);
      previous = value;
    }
    return parts.join("");
  }

  private renderGrid() {
    const ticks = this.yLabelStep > 0 ? axisTicks(this.min, this.max, this.yLabelStep) : niceTicks(this.min, this.max, this.height < 180 ? 3 : 5);
    const narrow = this._width < 420;
    const minutes = this.axis?.source === "day_of_week" && !this.xLabelStep && this.axis.max - this.axis.min <= 8 ? Array.from({ length: Math.floor(this.axis.max) - Math.ceil(this.axis.min) + 1 }, (_, i) => Math.ceil(this.axis!.min) + i) : this.axis ? axisTicks(this.axis.min, this.axis.max, this.xLabelStep) : this.xLabelStep > 0 ? axisTicks(0, MINUTES_PER_DAY, this.xLabelStep) : (narrow ? [0, 6, 12, 18, 24] : [0, 3, 6, 9, 12, 15, 18, 21, 24]).map(hour => hour * 60);
    const bottom = PAD_TOP + this.plotHeight;
    return svg`
      ${ticks.map(
        (tick) => svg`
          <line class="grid" x1=${PAD_LEFT} x2=${this.xFor(this.domainEnd)}
            y1=${this.yFor(tick)} y2=${this.yFor(tick)}></line>
          <text class="label y" x=${PAD_LEFT - 6} y=${this.yFor(tick) + 4}>${formatValue(
            tick,
            this.yLabelStep || 0.1,
            null,
            this.language,
          )}</text>`,
      )}
      ${minutes.map(
        (minute) => svg`
          <line class="grid" x1=${this.xFor(minute)} x2=${this.xFor(minute)}
            y1=${PAD_TOP} y2=${bottom}></line>
          <text class="label x" style=${minute === this.domainStart ? "text-anchor:start" : minute === this.domainEnd ? "text-anchor:end" : ""} x=${this.xFor(minute)} y=${bottom + 17}>${this.axis ? this.formatX(minute) : this.xLabelStep > 0 ? formatTime(minute) : minute / 60}</text>`,
      )}
      ${
        !this.axis && this.showContinuation
          ? svg`<rect class="next-day" x=${this.xFor(MINUTES_PER_DAY)} y=${PAD_TOP}
              width=${this.xFor(this.domainEnd) - this.xFor(MINUTES_PER_DAY)}
              height=${this.plotHeight}></rect>
              <text class="label x" x=${this.xFor(MINUTES_PER_DAY + CONTINUATION / 2)}
                y=${PAD_TOP + 12}>+1</text>`
          : nothing
      }
    `;
  }

  private renderNow() {
    if (this.nowMinute === null) {
      return nothing;
    }
    const x = this.xFor(this.nowMinute);
    return svg`
      <line class="now" x1=${x} x2=${x} y1=${PAD_TOP} y2=${PAD_TOP + this.plotHeight}></line>
      ${
        this.nowValue !== null
          ? svg`<circle class="now-dot" cx=${x} cy=${this.yFor(this.offset !== 0 ? clamp(roundToStep(clamp(roundToStep(clamp(this.nowValue, this.min, this.max), this.step) + this.offset, this.min, this.max), this.step), this.min, this.max) : clamp(this.nowValue, this.min, this.max))} r="6"></circle>`
          : nothing
      }
    `;
  }

  private renderHandles(points: ChartPoint[]) {
    const drag = this._drag;
    return points.map((point, index) => {
      const minute = this.xOf(point);
      const x = this.xFor(minute);
      const y = this.yFor(clamp(point.v, this.min, this.max));
      const selected = index === this.selected;
      const label = `${this.formatX(this.xOf(point))} · ${formatValue(point.v, this.step, this.unit, this.language)}`;
      return html`
        <div
          class="handle ${selected ? "selected" : ""} ${drag?.index === index ? "dragging" : ""}"
          style="transform: translate(${x - HANDLE_SIZE / 2}px, ${y - HANDLE_SIZE / 2}px)"
          role="slider"
          tabindex=${this.editable ? 0 : -1}
          aria-label=${label}
          aria-valuemin=${this.min}
          aria-valuemax=${this.max}
          aria-valuenow=${point.v}
          aria-valuetext=${label}
          data-index=${index}
          @pointerdown=${(e: PointerEvent) => this.onHandlePointerDown(e, index)}
          @pointermove=${(e: PointerEvent) => this.onHandlePointerMove(e)}
          @pointerup=${(e: PointerEvent) => this.onHandlePointerUp(e)}
          @pointercancel=${() => this.onHandlePointerCancel()}
          @lostpointercapture=${(e: PointerEvent) => this.onHandlePointerUp(e)}
          @keydown=${(e: KeyboardEvent) => this.onHandleKeyDown(e, index)}
          @click=${(e: Event) => {
            e.stopPropagation();
            this.emitSelect(index);
          }}
        >
          <span class="dot" style="border-color: ${this.color}"></span>
        </div>
      `;
    });
  }

  private renderTooltip() {
    const drag = this._drag;
    if (!drag?.moved) {
      return nothing;
    }
    const point = drag.points[drag.index];
    const x = clamp(this.xFor(this.xOf(point)), 50, this._width - 50);
    const y = this.yFor(point.v);
    const above = y > 48;
    return html`<div
      class="tooltip"
      style="left: ${x}px; top: ${above ? y - 40 : y + 26}px"
      role="status"
    >
      ${this.formatX(this.xOf(point))} · ${formatValue(point.v, this.step, this.unit, this.language)}
    </div>`;
  }

  protected render() {
    const points = this.shownPoints;
    const solid = this.curvePath(points, this.domainStart, this.axis?.max ?? MINUTES_PER_DAY);
    const dashed = !this.axis && this.showContinuation
      ? this.curvePath(points, MINUTES_PER_DAY, this.domainEnd)
      : "";
    return html`
      <div
        class="chart"
        style="height: ${this.height}px"
        @pointerdown=${this.onChartPointerDown}
        @pointerup=${this.onChartPointerUp}
        @pointercancel=${this.onChartPointerCancel}
      >
        <svg
          width=${this._width}
          height=${this.height}
          viewBox="0 0 ${this._width} ${this.height}"
          role="img"
          aria-hidden="true"
        >
          ${this.renderGrid()}
          <path class="curve" d=${solid} style="stroke: ${this.color}"></path>
          ${dashed
            ? svg`<path class="curve continuation" d=${dashed} style="stroke: ${this.color}"></path>`
            : nothing}
          ${this.offset !== 0 ? svg`<path class="curve offset-curve" d=${this.curvePath(points, this.domainStart, this.axis?.max ?? MINUTES_PER_DAY, true)} style="stroke: var(--secondary-text-color, #888); stroke-dasharray: 7 4"><title>${this.language.startsWith("de") ? "Kurvenwert mit Versatz" : "Curve value with offset"}</title></path>` : nothing}
          ${this.renderNow()}
          ${this._drag ? svg`
            <line class="guide" x1=${PAD_LEFT} x2=${this.xFor(this.xOf(points[this._drag.index]))} y1=${this.yFor(points[this._drag.index].v)} y2=${this.yFor(points[this._drag.index].v)}></line>
            <line class="guide" x1=${this.xFor(this.xOf(points[this._drag.index]))} x2=${this.xFor(this.xOf(points[this._drag.index]))} y1=${this.yFor(points[this._drag.index].v)} y2=${PAD_TOP + this.plotHeight}></line>
          ` : nothing}
          ${this.editable
            ? nothing
            : points.map(
                (p) =>
                  svg`<circle class="marker" cx=${this.xFor(this.xOf(p))}
                    cy=${this.yFor(clamp(p.v, this.min, this.max))} r="3"
                    style="fill: ${this.color}"></circle>`,
              )}
        </svg>
        ${this.editable ? this.renderHandles(points) : nothing} ${this.renderTooltip()}
      </div>
    `;
  }

  static styles = css`
    .guide { stroke: var(--primary-color); stroke-dasharray: 4 3; stroke-width: 1; pointer-events: none; }
    :host {
      display: block;
      position: relative;
      user-select: none;
      -webkit-user-select: none;
    }
    .chart {
      position: relative;
      width: 100%;
      overflow: hidden;
      touch-action: pan-y;
    }
    svg {
      position: absolute;
      inset: 0;
      display: block;
    }
    .grid {
      stroke: var(--divider-color, rgba(127, 127, 127, 0.25));
      stroke-width: 1;
    }
    .label {
      fill: var(--secondary-text-color, #727272);
      font-size: 11px;
      font-family: inherit;
    }
    .label.y {
      text-anchor: end;
    }
    .label.x {
      text-anchor: middle;
    }
    .next-day {
      fill: var(--secondary-text-color, #727272);
      opacity: 0.08;
    }
    .curve {
      fill: none;
      stroke-width: 3;
      stroke-linejoin: round;
      stroke-linecap: round;
    }
    .curve.continuation {
      stroke-dasharray: 6 6;
      opacity: 0.6;
    }
    .now {
      stroke: var(--error-color, #db4437);
      stroke-width: 2;
      stroke-dasharray: 3 3;
    }
    .now-dot {
      fill: var(--error-color, #db4437);
      stroke: var(--card-background-color, #fff);
      stroke-width: 2;
    }
    .handle {
      position: absolute;
      left: 0;
      top: 0;
      width: ${HANDLE_SIZE}px;
      height: ${HANDLE_SIZE}px;
      display: flex;
      align-items: center;
      justify-content: center;
      touch-action: none;
      cursor: grab;
      border-radius: 50%;
      outline: none;
      -webkit-tap-highlight-color: transparent;
    }
    .handle.dragging {
      cursor: grabbing;
      z-index: 2;
    }
    .dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: var(--card-background-color, #fff);
      border: 3px solid;
      box-sizing: border-box;
      transition: transform 0.1s;
    }
    .handle.selected .dot,
    .handle:focus-visible .dot {
      transform: scale(1.5);
      box-shadow: 0 0 0 4px rgba(127, 127, 127, 0.3);
    }
    @media (prefers-reduced-motion: reduce) { .dot { transition: none; } }
    .handle.dragging .dot {
      transform: scale(1.7);
    }
    .tooltip {
      position: absolute;
      transform: translateX(-50%);
      background: var(--primary-text-color, #212121);
      color: var(--card-background-color, #fff);
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
      pointer-events: none;
      z-index: 3;
    }
  `;
}

if (!customElements.get("curve-scheduler-curve")) {
  customElements.define("curve-scheduler-curve", CurveSchedulerCurve);
}

declare global {
  interface HTMLElementTagNameMap {
    "curve-scheduler-curve": CurveSchedulerCurve;
  }
}
