import { afterEach, describe, expect, it, vi } from "vitest";
import "../src/numeric-editor";
import type { CurveSchedulerCurve } from "../src/curve";
import type { NumericEditor } from "../src/numeric-editor";
import type { HomeAssistant } from "../src/api";
import { instance } from "./fixtures/instance";

async function mount() {
  const data = instance();
  data.config.axis = { source: "sensor", input_entity: "sensor.outdoor", min: -20, max: 40, step: 1, wrap: false };
  data.schedule.curve = [{ x: -20, v: 70 }, { x: 40, v: 20 }];
  data.state.input_value = 10;
  const callWS = vi.fn().mockResolvedValue({ ok: true, revision: data.revision + 1 });
  const editor = document.createElement("curve-scheduler-numeric-editor") as NumericEditor;
  editor.hass = { callWS } as unknown as HomeAssistant;
  editor.data = data;
  editor.editable = true;
  editor.editing = true;
  document.body.appendChild(editor);
  await editor.updateComplete;
  await graph(editor).updateComplete;
  return { editor, callWS };
}
function graph(editor: NumericEditor): CurveSchedulerCurve {
  return editor.shadowRoot!.querySelector("curve-scheduler-curve")!;
}
function button(editor: NumericEditor, label: string) {
  return [...editor.shadowRoot!.querySelectorAll("button")].find(b => b.textContent === label)!;
}
afterEach(() => { document.body.innerHTML = ""; });
describe("numeric curve editor", () => {
  it("renders an interpolated graph and saves numeric coordinates through the backend API", async () => {
    const { editor, callWS } = await mount();
    expect(graph(editor).shadowRoot!.querySelector("path.curve")!.getAttribute("d")).toContain("L");
    const x = editor.shadowRoot!.querySelector("input")!;
    x.value = "-10";
    x.dispatchEvent(new Event("change"));
    await editor.updateComplete;
    button(editor, "Save").click();
    await vi.waitFor(() => expect(callWS).toHaveBeenCalled());
    expect(callWS.mock.calls[0][0]).toMatchObject({ type: "curve_scheduler/save", revision: editor.data.revision, schedule: { curve: [{ x: -10, v: 70 }, { x: 40, v: 20 }] } });
    await editor.updateComplete;
    expect(editor.dirty).toBe(false);
  });
  it("rejects duplicate points and retains drafts on conflicting remote changes", async () => {
    const { editor, callWS } = await mount();
    editor.points = [{ x: 1, v: 30 }, { x: 1, v: 40 }];
    await editor.updateComplete;
    expect(button(editor, "Save").disabled).toBe(true);
    editor.points = [{ x: 1, v: 30 }, { x: 2, v: 40 }];
    editor.data = { ...editor.data, revision: editor.data.revision + 1 };
    callWS.mockResolvedValue({ ok: false, conflict: true, revision: editor.data.revision });
    await editor.updateComplete;
    button(editor, "Save").click();
    await vi.waitFor(() => expect(editor.message).toContain("Changed elsewhere"));
    expect(editor.points[0].x).toBe(1);
    button(editor, "Discard").click();
    await editor.updateComplete;
    expect(editor.dirty).toBe(false);
    expect(editor.points[0].x).toBe(-20);
  });
  it("does not expose editing controls for a read-only card", async () => {
    const { editor } = await mount();
    editor.editable = false;
    await editor.updateComplete;
    expect(editor.shadowRoot!.querySelectorAll("input, button, ellipse")).toHaveLength(0);
  });
  it("adds points and wraps the visual curve at the seam", async () => {
    const { editor } = await mount();
    editor.data = { ...editor.data, config: { ...editor.data.config, axis: { ...editor.data.config.axis!, wrap: true } }, schedule: { ...editor.data.schedule, curve: [{ x: -20, v: 70 }, { x: 10, v: 20 }] } };
    await editor.updateComplete;
    await graph(editor).updateComplete;
    const path = graph(editor).shadowRoot!.querySelector("path.curve")!.getAttribute("d")!;
    expect(path).toMatch(/^M44\.0,14\.0/);
    expect(graph(editor).curveValue(40)).toBeCloseTo(graph(editor).curveValue(-20)!);
    button(editor, "Add point").click();
    await editor.updateComplete;
    expect(editor.points).toHaveLength(3);
  });
});

it("uses configured label intervals and shows point-to-axis guides during a drag", async () => {
  const { editor } = await mount();
  editor.data = { ...editor.data, config: { ...editor.data.config, x_label_step: 20, y_label_step: 10 } };
  await editor.updateComplete;
  const chart = graph(editor);
  await chart.updateComplete;
  expect([...chart.shadowRoot!.querySelectorAll(".label.x")].map(el => el.textContent)).toEqual(["-20", "0", "20", "40"]);
  expect(chart.shadowRoot!.querySelectorAll(".label.y")).toHaveLength(6);
  const handle = chart.shadowRoot!.querySelector<HTMLElement>(".handle")!;
  handle.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, pointerId: 1, clientX: chart.xFor(-20), clientY: chart.yFor(70) }));
  await chart.updateComplete;
  handle.dispatchEvent(new PointerEvent("pointermove", { clientX: chart.xFor(10), clientY: chart.yFor(45), pointerId: 1 }));
  await chart.updateComplete;
  expect(chart.shadowRoot!.querySelectorAll(".guide")).toHaveLength(2);
  expect(chart.shadowRoot!.querySelector(".tooltip")!.textContent).toContain("10");
  handle.dispatchEvent(new PointerEvent("pointerup", { pointerId: 1 }));
  await chart.updateComplete;
  await editor.updateComplete;
  expect(editor.points[0]).toEqual({ x: 10, v: 45 });
  expect(chart.shadowRoot!.querySelectorAll(".guide")).toHaveLength(0);
});

it("discards a confirmed draft before navigating so beforeunload does not prompt again", async () => {
  const { editor } = await mount();
  editor.points = [{ x: 1, v: 30 }];
  const confirm = vi.fn().mockReturnValue(false);
  vi.stubGlobal("confirm", confirm);
  expect(editor.confirmLeave("Discard changes?")).toBe(false);
  expect(editor.dirty).toBe(true);
  confirm.mockReturnValue(true);
  expect(editor.confirmLeave("Discard changes?")).toBe(true);
  expect(editor.dirty).toBe(false);
  const unload = new Event("beforeunload", { cancelable: true });
  window.dispatchEvent(unload);
  expect(unload.defaultPrevented).toBe(false);
  vi.unstubAllGlobals();
});

it.each(["sensor", "month_of_year"] as const)("uses the shared graph with wrapping and clamping for %s inputs", async source => {
  const { editor } = await mount();
  const chart = graph(editor);
  const points = [{ x: -20, v: 70 }, { x: 10, v: 20 }];
  for (const mode of ["step", "linear", "smooth", "curve"] as const) {
    chart.axis = { source, input_entity: null, min: -20, max: 40, step: 1, wrap: false };
    chart.mode = mode;
    chart.numericPoints = points;
    await chart.updateComplete;
    expect(chart.curveValue(-30)).toBe(70);
    expect(chart.curveValue(40)).toBe(20);
    chart.axis = { ...chart.axis, wrap: true };
    await chart.updateComplete;
    expect(chart.curveValue(40)).toBeCloseTo(chart.curveValue(-20)!);
    const moved = chart.movePoint(points, 1, 40, 50);
    expect(moved[1].x).toBe(39); // wrapping maximum is exclusive
    expect(chart.shadowRoot!.querySelectorAll(".handle")).toHaveLength(2);
    expect(chart.shadowRoot!.querySelector("ellipse")).toBeNull();
  }
});

it("uses numeric axis resolution for shared keyboard and tap controls", async () => {
  const { editor } = await mount();
  const chart = graph(editor);
  const handle = chart.shadowRoot!.querySelector(".handle")!;
  handle.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true }));
  await editor.updateComplete;
  await chart.updateComplete;
  expect(editor.points[0].x).toBe(-19);
  chart.addPointAt(chart.xFor(10));
  await editor.updateComplete;
  expect(editor.points.map(p => p.x)).toEqual([-19, 10, 40]);
});

it("labels the built-in weekly axis with weekdays", async () => {
  const { editor } = await mount();
  editor.data = { ...editor.data, config: { ...editor.data.config, axis: { source: "day_of_week", input_entity: null, min: 1, max: 8, step: 0.01, wrap: true } } };
  editor.points = [{ x: 1, v: 30 }, { x: 4, v: 60 }];
  await editor.updateComplete;
  await graph(editor).updateComplete;
  const labels = graph(editor).shadowRoot!.querySelectorAll('.label.x');
  expect(labels[0].textContent).toBe("Mon");
  expect(labels[6].textContent).toBe("Sun");
  expect(labels[7].textContent).toBe("Mon +1");
  expect(labels[0].getAttribute("style")).toBe("text-anchor:start");
  expect(labels[7].getAttribute("style")).toBe("text-anchor:end");
});
