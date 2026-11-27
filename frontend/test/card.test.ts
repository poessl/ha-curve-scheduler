import { afterEach, describe, expect, it, vi } from "vitest";
import "../src/curve-scheduler-card";
import type { CurveSchedulerCard } from "../src/card";
import type { HomeAssistant } from "../src/api";
import type { InstanceData } from "../src/model";
import { instance } from "./fixtures/instance";

function fakeHass(data: InstanceData, isAdmin = false) {
  const callService = vi.fn().mockResolvedValue(undefined);
  const hass = {
    callWS: vi.fn(),
    callService,
    user: { is_admin: isAdmin },
    locale: { language: "de" },
    connection: {
      subscribeMessage: vi.fn(async (callback: (d: InstanceData) => void) => {
        callback(data);
        return async () => undefined;
      }),
    },
  } as unknown as HomeAssistant;
  return { hass, callService };
}

async function mount(config: Record<string, unknown>, isAdmin = false) {
  const data = instance();
  data.state.timeline = ["workday", "workday", "workday", "workday", "day_off"].map((id, i) => ({
    date: `2026-10-${27 + i}`,
    profile_id: id,
    reason: "weekday" as const,
  }));
  const { hass, callService } = fakeHass(data, isAdmin);
  const card = document.createElement("curve-scheduler-card") as CurveSchedulerCard;
  card.setConfig({ type: "custom:curve-scheduler-card", entry_id: "abc", ...config });
  card.hass = hass;
  document.body.appendChild(card);
  for (let i = 0; i < 5; i++) {
    await new Promise((resolve) => setTimeout(resolve, 0));
    await card.updateComplete;
  }
  return { card, callService };
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("curve-scheduler-card", () => {
  it("is announced to the card picker", () => {
    expect(window.customCards?.some((c) => c.type === "curve-scheduler-card")).toBe(true);
  });

  it("shows the active plan summary", async () => {
    const { card } = await mount({});
    const text = card.shadowRoot!.querySelector(".headline")!.textContent;
    expect(text).toBe("Aktiver Plan: Werktag · jetzt 60\u00a0°C · ab 18:00 → 45\u00a0°C");
    expect(card.shadowRoot!.querySelector("curve-scheduler-curve")).not.toBeNull();
    expect(card.shadowRoot!.querySelector("curve-scheduler-editor")).toBeNull();
  });

  it("opens the editor", async () => {
    const { card } = await mount({});
    card.shadowRoot!.querySelector<HTMLButtonElement>("button.edit")!.click();
    await card.updateComplete;
    expect(card.shadowRoot!.querySelector("curve-scheduler-editor")).not.toBeNull();
  });

  it("hides the editor for non-admins when not allowed", async () => {
    const { card } = await mount({ allow_edit: false });
    expect(card.shadowRoot!.querySelector("button.edit")).toBeNull();
    const admin = await mount({ allow_edit: false }, true);
    expect(admin.card.shadowRoot!.querySelector("button.edit")).not.toBeNull();
  });

  it("full view shows the editor directly", async () => {
    const { card } = await mount({ view: "full" });
    expect(card.shadowRoot!.querySelector("curve-scheduler-editor")).not.toBeNull();
  });

  it("changes the mode", async () => {
    const { card, callService } = await mount({});
    const select = card.shadowRoot!.querySelector<HTMLSelectElement>("select.mode-select")!;
    select.value = "day_off";
    select.dispatchEvent(new Event("change"));
    expect(callService).toHaveBeenCalledWith("curve_scheduler", "set_override", {
      config_entry_id: "abc",
      profile: "day_off",
    });
    select.value = "auto";
    select.dispatchEvent(new Event("change"));
    expect(callService).toHaveBeenCalledWith("curve_scheduler", "clear_override", {
      config_entry_id: "abc",
    });
  });
});

it("shows a distinct adjusted line only in the main graph when a plan applies offset", async () => {
  const data = instance();
  data.state.offset = 3;
  const { hass } = fakeHass(data);
  const card = document.createElement("curve-scheduler-card") as CurveSchedulerCard;
  card.setConfig({ type: "custom:curve-scheduler-card", entry_id: "abc", view: "full" });
  card.hass = hass;
  document.body.append(card);
  await new Promise(resolve => setTimeout(resolve, 0));
  await card.updateComplete;
  const main = card.shadowRoot!.querySelector("curve-scheduler-curve")!;
  await main.updateComplete;
  const overlay = main.shadowRoot!.querySelector(".offset-curve")!;
  expect(overlay).not.toBeNull();
  expect(overlay.getAttribute("d")).not.toBe(main.shadowRoot!.querySelector(".curve")!.getAttribute("d"));
  const editor = card.shadowRoot!.querySelector("curve-scheduler-editor")!;
  await editor.updateComplete;
  const editing = editor.shadowRoot!.querySelector("curve-scheduler-curve")!;
  await editing.updateComplete;
  expect(editing.shadowRoot!.querySelector(".offset-curve")).toBeNull();
  main.offset = 0;
  await main.updateComplete;
  expect(main.shadowRoot!.querySelector(".offset-curve")).toBeNull();
});

it("supports graph-only cards without a title, editor, mode selector or buttons", async () => {
  const { card } = await mount({ view: "graph" }, true);
  expect(card.shadowRoot!.querySelector("curve-scheduler-curve")).not.toBeNull();
  expect(card.shadowRoot!.querySelector("button, select, h1, curve-scheduler-editor, .summary")).toBeNull();
});

it("can hide editing for administrators while retaining normal controls", async () => {
  const { card } = await mount({ view: "full", show_edit: false }, true);
  expect(card.shadowRoot!.querySelector("curve-scheduler-editor, .edit")).toBeNull();
  expect(card.shadowRoot!.querySelector(".mode-select")).not.toBeNull();
});

it("hides action controls independently of the always-open editor", async () => {
  const { card } = await mount({ view: "full", show_controls: false }, true);
  expect(card.shadowRoot!.querySelector(".actions")).toBeNull();
  expect(card.shadowRoot!.querySelector("curve-scheduler-editor")).not.toBeNull();
  expect(card.shadowRoot!.querySelector(".summary")).not.toBeNull();
});


it("keeps the Edit button when action controls are hidden", async () => {
  const { card } = await mount({ show_controls: false, editor_mode: "button" }, true);
  expect(card.shadowRoot!.querySelector(".actions")).toBeNull();
  expect(card.shadowRoot!.querySelector("curve-scheduler-editor")).toBeNull();
  card.shadowRoot!.querySelector<HTMLButtonElement>(".edit")!.click();
  await card.updateComplete;
  expect(card.shadowRoot!.querySelector("curve-scheduler-editor")).not.toBeNull();
});

it("independently hides title and summary", async () => {
  const { card } = await mount({ show_title: false, show_summary: false, show_reason: false });
  expect(card.shadowRoot!.querySelector("h1, .summary")).toBeNull();
  expect(card.shadowRoot!.querySelector(".edit")).not.toBeNull();
});

it("places optional offset information and its independent reset button above the graph", async () => {
  const data = instance();
  data.state.offset = 3;
  const { hass, callService } = fakeHass(data);
  const card = document.createElement("curve-scheduler-card") as CurveSchedulerCard;
  card.setConfig({ type: "custom:curve-scheduler-card", entry_id: "abc", show_controls: false, show_clear_offset: true });
  card.hass = hass;
  document.body.append(card);
  await new Promise(resolve => setTimeout(resolve, 0));
  await card.updateComplete;
  const info = card.shadowRoot!.querySelector(".top-offset")!;
  const graph = card.shadowRoot!.querySelector("curve-scheduler-curve")!;
  expect(info.textContent).toContain("3");
  expect(info.compareDocumentPosition(graph) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  info.querySelector<HTMLButtonElement>("button")!.click();
  expect(callService).toHaveBeenCalledWith("curve_scheduler", "clear_offset", { config_entry_id: "abc" });
  await graph.updateComplete;
  const withOffset = graph.shadowRoot!.querySelector(".now-dot")!.getAttribute("cy");
  graph.offset = 0;
  await graph.updateComplete;
  expect(graph.shadowRoot!.querySelector(".now-dot")!.getAttribute("cy")).not.toBe(withOffset);
});
