import { afterEach, describe, expect, it, vi } from "vitest";
import "../src/numeric-editor";
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
  return { editor, callWS };
}
function button(editor: NumericEditor, label: string) {
  return [...editor.shadowRoot!.querySelectorAll("button")].find(b => b.textContent === label)!;
}
afterEach(() => { document.body.innerHTML = ""; });
describe("numeric curve editor", () => {
  it("renders an interpolated graph and saves numeric coordinates through the backend API", async () => {
    const { editor, callWS } = await mount();
    expect(editor.shadowRoot!.querySelector("path")!.getAttribute("d")).toContain("L");
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
    const path = editor.shadowRoot!.querySelector("path")!.getAttribute("d")!;
    expect(path).toMatch(/^M0,0 /);
    expect(path).toMatch(/L100,0$/);
    button(editor, "Add point").click();
    await editor.updateComplete;
    expect(editor.points).toHaveLength(3);
  });
});

it("uses configured label intervals and shows point-to-axis guides during a drag", async () => {
  const { editor } = await mount();
  editor.data = { ...editor.data, config: { ...editor.data.config, x_label_step: 20, y_label_step: 10 } };
  await editor.updateComplete;
  expect([...editor.shadowRoot!.querySelectorAll(".tick-x")].map(el => el.textContent)).toEqual(["-20", "0", "20", "40"]);
  expect(editor.shadowRoot!.querySelectorAll(".tick-y")).toHaveLength(6);
  const plot = editor.shadowRoot!.querySelector("svg")!;
  Object.defineProperty(plot, "setPointerCapture", { value: vi.fn() });
  vi.spyOn(plot, "getBoundingClientRect").mockReturnValue({ left: 0, top: 0, width: 100, height: 100 } as DOMRect);
  editor.shadowRoot!.querySelector("ellipse")!.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, pointerId: 1 }));
  await editor.updateComplete;
  expect(editor.shadowRoot!.querySelectorAll(".guide")).toHaveLength(2);
  plot.dispatchEvent(new PointerEvent("pointermove", { clientX: 50, clientY: 50, pointerId: 1 }));
  await editor.updateComplete;
  expect(editor.points[0]).toEqual({ x: 10, v: 45 });
  expect(editor.shadowRoot!.querySelectorAll(".axis-hit")).toHaveLength(2);
  plot.dispatchEvent(new PointerEvent("pointerup", { pointerId: 1 }));
  await editor.updateComplete;
  expect(editor.shadowRoot!.querySelectorAll(".guide")).toHaveLength(0);
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
