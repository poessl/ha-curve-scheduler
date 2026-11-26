import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "../src/editor";
import type { CurveSchedulerEditor } from "../src/editor";
import type { NumericEditor } from "../src/numeric-editor";
import type { CurveSchedulerCurve } from "../src/curve";
import { instance } from "./fixtures/instance";
import type { HomeAssistant } from "../src/api";

let editor: CurveSchedulerEditor;
let callWS: ReturnType<typeof vi.fn>;

async function settle(): Promise<void> {
  await editor.updateComplete;
  const curve = curveElement();
  await curve?.updateComplete;
}

function curveElement(): CurveSchedulerCurve | null {
  return editor.shadowRoot!.querySelector("curve-scheduler-curve");
}

function points() {
  return editor._draft.profiles.workday.points;
}

function rows() {
  return editor.shadowRoot!.querySelectorAll("table.points tbody tr");
}

function pointer(type: string, target: Element, x: number, y: number): void {
  target.dispatchEvent(
    new PointerEvent(type, {
      bubbles: true,
      composed: true,
      cancelable: true,
      clientX: x,
      clientY: y,
      pointerId: 1,
      button: 0,
    }),
  );
}

beforeEach(async () => {
  callWS = vi.fn();
  editor = document.createElement("curve-scheduler-editor");
  editor.hass = { callWS, callService: vi.fn() } as unknown as HomeAssistant;
  editor.language = "de";
  editor.data = instance();
  document.body.appendChild(editor);
  await settle();
});

afterEach(() => {
  editor.remove();
});

describe("curve-scheduler-editor: points", () => {
  it("renders a table row and a handle per point", () => {
    expect(rows()).toHaveLength(3);
    expect(curveElement()!.shadowRoot!.querySelectorAll(".handle")).toHaveLength(3);
  });

  it("adds a point with the + button (field input)", async () => {
    const add = editor.shadowRoot!.querySelector<HTMLButtonElement>("button.add-point")!;
    add.click();
    await settle();
    expect(points()).toHaveLength(4);
    expect(rows()).toHaveLength(4);
    // Largest gap is 18:00 -> 06:00 (over midnight), so the point goes to 00:00.
    expect(points()[0].t).toBe("00:00");
    expect(editor.dirty).toBe(true);

    // Edit the new point through the fields.
    const row = rows()[0];
    const time = row.querySelector<HTMLInputElement>('input[type="time"]')!;
    time.value = "03:10";
    time.dispatchEvent(new Event("change"));
    await settle();
    expect(points()[0].t).toBe("03:10");
    const value = rows()[0].querySelector<HTMLInputElement>("input.value")!;
    value.value = "52,5";
    value.dispatchEvent(new Event("change"));
    await settle();
    expect(points()[0].v).toBe(52.5);
    // Values are kept inside min/max.
    const value2 = rows()[0].querySelector<HTMLInputElement>("input.value")!;
    value2.value = "99";
    value2.dispatchEvent(new Event("change"));
    await settle();
    expect(points()[0].v).toBe(70);
  });

  it("keeps points sorted when a time is typed", async () => {
    const time = rows()[0].querySelector<HTMLInputElement>('input[type="time"]')!;
    time.value = "20:00";
    time.dispatchEvent(new Event("change"));
    await settle();
    expect(points().map((p) => p.t)).toEqual(["12:00", "18:00", "20:00"]);
    expect(editor._selected).toBe(2);
  });

  it("rejects a time that is already used", async () => {
    const time = rows()[0].querySelector<HTMLInputElement>('input[type="time"]')!;
    time.value = "12:00";
    time.dispatchEvent(new Event("change"));
    await settle();
    expect(points().map((p) => p.t)).toEqual(["06:00", "12:00", "18:00"]);
    expect(editor.shadowRoot!.querySelector(".notice.warning")?.textContent).toContain("12:00");
  });

  it("moves a point by dragging and snaps to the grid", async () => {
    const curve = curveElement()!;
    const handle = curve.shadowRoot!.querySelectorAll<HTMLElement>(".handle")[1];
    const start = { x: curve.xFor(12 * 60), y: curve.yFor(60) };
    pointer("pointerdown", handle, start.x, start.y);
    pointer("pointermove", handle, curve.xFor(13 * 60 + 7), curve.yFor(55.2));
    await curve.updateComplete;
    // Live tooltip while dragging
    expect(curve.shadowRoot!.querySelector(".tooltip")?.textContent).toContain("13:00");
    pointer("pointerup", handle, curve.xFor(13 * 60 + 7), curve.yFor(55.2));
    await settle();
    expect(points()[1]).toEqual({ t: "13:00", v: 55 });
    expect(editor._selected).toBe(1);
  });

  it("does not drag a point past its neighbours", async () => {
    const curve = curveElement()!;
    const handle = curve.shadowRoot!.querySelectorAll<HTMLElement>(".handle")[1];
    pointer("pointerdown", handle, curve.xFor(720), curve.yFor(60));
    pointer("pointermove", handle, curve.xFor(22 * 60), curve.yFor(60));
    pointer("pointerup", handle, curve.xFor(22 * 60), curve.yFor(60));
    await settle();
    expect(points()[1].t).toBe("17:55");
    expect(points().map((p) => p.t)).toEqual(["06:00", "17:55", "18:00"]);
  });

  it("adds a point when tapping the chart", async () => {
    const curve = curveElement()!;
    const chart = curve.shadowRoot!.querySelector(".chart")!;
    const x = curve.xFor(9 * 60);
    pointer("pointerdown", chart, x, 100);
    pointer("pointerup", chart, x, 100);
    await settle();
    expect(points().map((p) => p.t)).toEqual(["06:00", "09:00", "12:00", "18:00"]);
    // The point is placed on the existing line (linear: halfway 45 -> 60).
    expect(points()[1].v).toBe(52.5);
    expect(editor._selected).toBe(1);
  });

  it("deletes a point from the table and the selection panel", async () => {
    rows()[2].querySelector<HTMLButtonElement>("button.delete")!.click();
    await settle();
    expect(points().map((p) => p.t)).toEqual(["06:00", "12:00"]);

    // select a point via its handle, then delete it from the panel below the chart
    const handle = curveElement()!.shadowRoot!.querySelectorAll<HTMLElement>(".handle")[0];
    handle.click();
    await settle();
    const panel = editor.shadowRoot!.querySelector(".selected-point")!;
    panel.querySelector<HTMLButtonElement>("button.danger")!.click();
    await settle();
    expect(points().map((p) => p.t)).toEqual(["12:00"]);
    // The last point cannot be deleted.
    editor.deletePoint(0);
    await settle();
    expect(points()).toHaveLength(1);
  });

  it("supports undo and redo", async () => {
    editor.deletePoint(0);
    await settle();
    expect(points()).toHaveLength(2);
    editor.undo();
    await settle();
    expect(points()).toHaveLength(3);
    expect(editor.dirty).toBe(false);
    editor.redo();
    await settle();
    expect(points()).toHaveLength(2);
  });
});

describe("curve-scheduler-editor: saving", () => {
  it("sends the draft with the revision", async () => {
    callWS.mockResolvedValue({ ok: true, revision: 4 });
    editor.deletePoint(0);
    await settle();
    await editor.save();
    await settle();
    expect(callWS).toHaveBeenCalledWith(
      expect.objectContaining({ type: "curve_scheduler/save", entry_id: "abc", revision: 3 }),
    );
    expect(editor.dirty).toBe(false);
  });

  it("shows the conflict hint", async () => {
    callWS.mockResolvedValue({ ok: false, conflict: true, revision: 5 });
    editor.deletePoint(0);
    await settle();
    await editor.save();
    await settle();
    expect(editor.shadowRoot!.textContent).toContain("Wurde inzwischen geändert – neu laden?");
  });

  it("does not send invalid data", async () => {
    editor._draft = { ...editor._draft, activations: [{ type: "weekday", day: "mon", profile: "missing" }] };
    await editor.save();
    await settle();
    expect(callWS).not.toHaveBeenCalled();
    expect(editor.shadowRoot!.textContent).toContain("Der gewählte Plan existiert nicht.");
  });

  it("prevents deleting a profile that is still used", async () => {
    const confirm = vi.fn(() => true);
    window.confirm = confirm;
    editor.shadowRoot!.querySelector<HTMLButtonElement>(".profile-settings button.danger")!.click();
    await settle();
    expect(Object.keys(editor._draft.profiles)).toContain("workday");
    expect(editor.shadowRoot!.textContent).toContain("noch verwendet");
    expect(confirm).not.toHaveBeenCalled();
  });

  it("changes the target plan of a Saturday activation", async () => {
    editor._month = "2026-10-01";
    const tabs = editor.shadowRoot!.querySelectorAll<HTMLButtonElement>(".tab");
    tabs[1].click();
    await settle();
    const select = editor.shadowRoot!.querySelectorAll(".activation")[5].querySelectorAll<HTMLSelectElement>("select")[1];
    select.value = "workday";
    select.dispatchEvent(new Event("change"));
    await settle();
    expect(editor._draft.activations![5].profile).toBe("workday");
    expect(editor.shadowRoot!.querySelectorAll(".calendar .cell:not(.head):not(.empty)").length).toBe(
      31,
    );
  });

  it("adds a holiday exception", async () => {
    const tabs = editor.shadowRoot!.querySelectorAll<HTMLButtonElement>(".tab");
    tabs[2].click();
    await settle();
    const add = [...editor.shadowRoot!.querySelectorAll<HTMLButtonElement>("button")].find((b) =>
      b.textContent?.includes("+ Ausnahme"),
    )!;
    add.click();
    await settle();
    expect(editor._draft.exceptions).toEqual([
      { from: "2026-10-29", to: "2026-11-04", profile: "day_off", note: "Ausnahme" },
    ]);
  });
});

it("uses configurable time/value labels and guides the point being moved", async () => {
  const curve = curveElement()!;
  curve.xLabelStep = 180;
  curve.yLabelStep = 10;
  await curve.updateComplete;
  expect([...curve.shadowRoot!.querySelectorAll("text.x")].map(el => el.textContent)).toContain("03:00");
  expect(curve.shadowRoot!.querySelectorAll("text.y")).toHaveLength(6);
  const point = points()[0];
  const handle = curve.shadowRoot!.querySelector(".handle")!;
  const minute = Number(point.t.slice(0, 2)) * 60 + Number(point.t.slice(3));
  pointer("pointerdown", handle, curve.xFor(minute), curve.yFor(point.v));
  pointer("pointermove", handle, curve.xFor(minute + 15), curve.yFor(point.v + 1));
  await curve.updateComplete;
  expect(curve.shadowRoot!.querySelectorAll(".guide")).toHaveLength(2);
  pointer("pointerup", handle, curve.xFor(minute + 15), curve.yFor(point.v + 1));
  await settle();
  expect(curve.shadowRoot!.querySelectorAll(".guide")).toHaveLength(0);
});

describe("activation ordering and numeric plans", () => {
  it("adds conditions, reorders with buttons and drag/drop, and restores order with undo", async () => {
    editor.language = "en";
    editor.shadowRoot!.querySelectorAll<HTMLButtonElement>(".tab")[1].click();
    await settle();
    const button = (text: string) => [...editor.shadowRoot!.querySelectorAll("button")].find(b => b.textContent?.trim() === text)!;
    button("Add activation").click();
    await settle();
    expect(editor._draft.activations).toHaveLength(8);
    const last = editor.shadowRoot!.querySelectorAll(".activation")[7];
    const type = last.querySelector("select")!;
    type.value = "holiday";
    type.dispatchEvent(new Event("change"));
    await settle();
    const picker = editor.shadowRoot!.querySelector("ha-entity-picker")!;
    picker.dispatchEvent(new CustomEvent("value-changed", { detail: { value: "calendar.holidays" } }));
    await settle();
    editor.shadowRoot!.querySelectorAll<HTMLButtonElement>('[aria-label="Move activation up"]')[7].click();
    await settle();
    expect(editor._draft.activations![6].source).toBe("calendar.holidays");
    const entries = editor.shadowRoot!.querySelectorAll(".activation");
    entries[6].dispatchEvent(new Event("dragstart"));
    await new Promise(resolve => setTimeout(resolve, 0));
    await settle();
    const zone = editor.shadowRoot!.querySelector(".activation-drop-zone")!;
    zone.dispatchEvent(new Event("dragover", { cancelable: true, bubbles: true }));
    await settle();
    expect(editor._draft.activations![6].source).toBe("calendar.holidays");
    expect((entries[6] as HTMLElement).style.order).toBe("1");
    expect(entries[6].isConnected).toBe(true);
    zone.dispatchEvent(new Event("drop", { cancelable: true, bubbles: true }));
    await settle();
    expect(editor._draft.activations![0].source).toBe("calendar.holidays");
    editor.undo();
    await settle();
    expect(editor._draft.activations![6].source).toBe("calendar.holidays");
    expect(editor.shadowRoot!.textContent).toContain("First matching activation wins");
  });

  it("edits a numeric plan in the shared draft with undo and a single schedule save", async () => {
    const data = instance();
    data.config.axis = { source: "sensor", input_entity: "sensor.outside", min: -20, max: 40, step: 1, wrap: false };
    for (const profile of Object.values(data.schedule.profiles)) profile.curve = [{ x: -20, v: 40 }, { x: 40, v: 60 }];
    editor.data = data;
    await settle();
    const numeric = editor.shadowRoot!.querySelector<NumericEditor>("curve-scheduler-numeric-editor")!;
    await numeric.updateComplete;
    const input = numeric.shadowRoot!.querySelectorAll("input")[1];
    input.value = "50";
    input.dispatchEvent(new Event("change"));
    await numeric.updateComplete;
    await settle();
    expect(editor._draft.profiles.workday.curve![0].v).toBe(50);
    expect(editor._draft.profiles.day_off.curve![0].v).toBe(40);
    expect(editor.dirty).toBe(true);
    expect(callWS).not.toHaveBeenCalled();
    editor.undo();
    await settle();
    expect(editor._draft.profiles.workday.curve![0].v).toBe(40);
    editor.redo();
    callWS.mockResolvedValue({ ok: true, revision: 4 });
    await editor.save();
    expect(callWS.mock.calls[0][0].schedule.profiles.workday.curve[0].v).toBe(50);
    expect(editor.dirty).toBe(false);
  });
});


it("cancels an activation drag without changing the draft or undo history", async () => {
  editor.shadowRoot!.querySelectorAll<HTMLButtonElement>(".tab")[1].click();
  await settle();
  const original = JSON.stringify(editor._draft);
  const source = editor.shadowRoot!.querySelectorAll(".activation")[2];
  source.dispatchEvent(new Event("dragstart"));
  await new Promise(resolve => setTimeout(resolve, 0));
  await settle();
  editor.shadowRoot!.querySelector(".activation-drop-zone")!.dispatchEvent(new Event("dragover", { cancelable: true }));
  await settle();
  expect((source as HTMLElement).style.order).toBe("1");
  expect(editor.shadowRoot!.querySelectorAll(".activation")[2]).toBe(source);
  source.dispatchEvent(new Event("dragend"));
  await settle();
  expect(editor.shadowRoot!.querySelector(".activation")!.getAttribute("data-index")).toBe("0");
  expect(JSON.stringify(editor._draft)).toBe(original);
  expect(editor._undo).toHaveLength(0);
});

it("animates button reordering and respects reduced motion", async () => {
  editor.language = "en";
  editor.shadowRoot!.querySelectorAll<HTMLButtonElement>(".tab")[1].click();
  await settle();
  const animate = vi.fn();
  const elements = [...editor.shadowRoot!.querySelectorAll<HTMLElement>(".activation")];
  for (const el of elements) {
    el.animate = animate;
    el.getBoundingClientRect = () => ({ top: Number(el.dataset.index) * 200 } as DOMRect);
  }
  editor.shadowRoot!.querySelectorAll<HTMLButtonElement>('[aria-label="Move activation down"]')[0].click();
  await settle();
  expect(animate).toHaveBeenCalledTimes(2);
  expect(animate.mock.calls[0][1].duration).toBe(220);
  animate.mockClear();
  const matchMedia = vi.spyOn(window, "matchMedia").mockReturnValue({ matches: true } as MediaQueryList);
  editor.shadowRoot!.querySelectorAll<HTMLButtonElement>('[aria-label="Move activation down"]')[0].click();
  await settle();
  expect(animate).not.toHaveBeenCalled();
  matchMedia.mockRestore();
});

it("defers drag layout changes and cancels a pending start cleanly", async () => {
  editor.shadowRoot!.querySelectorAll<HTMLButtonElement>(".tab")[1].click();
  await settle();
  const source = editor.shadowRoot!.querySelectorAll(".activation")[1];
  source.dispatchEvent(new Event("dragstart"));
  await settle();
  expect(editor.shadowRoot!.querySelector(".activation-list.dragging")).toBeNull();
  source.dispatchEvent(new Event("dragend"));
  await new Promise(resolve => setTimeout(resolve, 0));
  await settle();
  expect(editor.shadowRoot!.querySelector(".activation-list.dragging")).toBeNull();
  expect(editor.shadowRoot!.querySelectorAll(".activation")[1]).toBe(source);
  expect(editor.dirty).toBe(false);
});

it("selects several weekdays in one activation and saves them together", async () => {
  editor.shadowRoot!.querySelectorAll<HTMLButtonElement>(".tab")[1].click();
  await settle();
  const weekdays = editor.shadowRoot!.querySelectorAll<HTMLInputElement>(".activation input[type=checkbox]");
  expect(weekdays[0].checked).toBe(true);
  expect(weekdays[1].checked).toBe(false);
  weekdays[1].checked = true;
  weekdays[1].dispatchEvent(new Event("change"));
  await settle();
  expect(editor._draft.activations![0].days).toEqual(["mon", "tue"]);
  expect(editor.shadowRoot!.querySelector(".weekday-select summary")!.textContent).toContain("Dienstag");
  callWS.mockResolvedValue({ ok: true, revision: 4 });
  await editor.save();
  expect(callWS.mock.calls[0][0].schedule.activations[0].days).toEqual(["mon", "tue"]);
});
