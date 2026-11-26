import { afterEach, describe, expect, it, vi } from "vitest";
import "../src/panel";
import type { CurveSchedulerPanel } from "../src/panel";
import type { CurveSchedulerCard } from "../src/card";
import type { NumericEditor } from "../src/numeric-editor";
import type { HomeAssistant } from "../src/api";
import { instance } from "./fixtures/instance";

async function settle(panel: CurveSchedulerPanel) {
  for (let i = 0; i < 5; i++) {
    await new Promise(resolve => setTimeout(resolve, 0));
    await panel.updateComplete;
  }
}
async function mount(options: { empty?: boolean; numeric?: boolean; failure?: boolean } = {}) {
  const unsubscribe = vi.fn().mockResolvedValue(undefined);
  const data = instance();
  if (options.numeric) {
    data.config.axis = { source: "sensor", input_entity: "input_number.example", min: 0, max: 100, step: 1, wrap: false };
    for (const profile of Object.values(data.schedule.profiles)) profile.curve = [{ x: 0, v: 20 }, { x: 100, v: 70 }];
  }
  const hass = {
    callWS: options.failure ? vi.fn().mockRejectedValue(new Error("Offline")) : vi.fn().mockResolvedValue(options.empty ? [] : [{ entry_id: "a", title: "First" }, { entry_id: "b", title: "Second" }]),
    callService: vi.fn(),
    user: { is_admin: true },
    language: "en",
    connection: { subscribeMessage: vi.fn(async (callback, message) => { callback({ ...data, entry_id: message.entry_id }); return unsubscribe; }) },
  } as unknown as HomeAssistant;
  const panel = document.createElement("curve-scheduler-panel") as CurveSchedulerPanel;
  panel.hass = hass;
  document.body.appendChild(panel);
  await settle(panel);
  return { panel, hass, unsubscribe };
}
function card(panel: CurveSchedulerPanel) { return panel.shadowRoot!.querySelector<CurveSchedulerCard>("curve-scheduler-card")!; }

afterEach(() => {
  document.body.innerHTML = "";
  window.history.replaceState({}, "", "/");
  vi.restoreAllMocks();
});

describe("standalone editor panel", () => {
  it("opens an expanded editor with no dashboard configuration", async () => {
    const { panel } = await mount();
    expect(card(panel)._config.view).toBe("full");
    expect(card(panel)._config.entry_id).toBe("a");
    expect(card(panel).shadowRoot!.querySelector("curve-scheduler-editor")).not.toBeNull();
    expect(panel.shadowRoot!.querySelector('a[data-action="add"]')!.getAttribute("href")).toBe("/config/integrations/dashboard/add?domain=curve_scheduler");
    expect(panel.shadowRoot!.querySelector('a[data-action="settings"]')!.getAttribute("href")).toBe("/config/integrations/integration/curve_scheduler");
  });
  it("opens device deep links and starts numeric editing expanded", async () => {
    window.history.replaceState({}, "", "/curve-scheduler?entry_id=b");
    const { panel } = await mount({ numeric: true });
    expect(card(panel)._config.entry_id).toBe("b");
    const editor = card(panel).shadowRoot!.querySelector("curve-scheduler-editor")!.shadowRoot!.querySelector<NumericEditor>("curve-scheduler-numeric-editor")!;
    expect(editor.editing).toBe(true);
    expect(editor.shadowRoot!.querySelectorAll("input")).toHaveLength(4);
  });
  it("guards unsaved changes when switching and releases the old subscription", async () => {
    const { panel, unsubscribe } = await mount();
    const first = card(panel);
    const guard = vi.spyOn(first, "confirmLeave").mockReturnValue(false);
    const select = panel.shadowRoot!.querySelector("select")!;
    select.value = "b";
    select.dispatchEvent(new Event("change"));
    await settle(panel);
    expect(panel.selected).toBe("a");
    expect(select.value).toBe("a");
    guard.mockReturnValue(true);
    select.value = "b";
    select.dispatchEvent(new Event("change"));
    await settle(panel);
    expect(card(panel)).not.toBe(first);
    expect(card(panel)._config.entry_id).toBe("b");
    expect(unsubscribe).toHaveBeenCalledTimes(1);
    panel.remove();
    await Promise.resolve();
    await Promise.resolve();
    expect(unsubscribe).toHaveBeenCalledTimes(2);
  });
  it("explains missing instances and connection failures", async () => {
    const { panel } = await mount({ empty: true });
    expect(panel.shadowRoot!.textContent).toContain("No curves are loaded");
    expect(card(panel)).toBeNull();
    panel.remove();
    const { panel: failed } = await mount({ failure: true });
    expect(failed.shadowRoot!.querySelector('[role="alert"]')!.textContent).toContain("Offline");
  });
});

it("guards drafts before opening settings and hides admin links from non-admins", async () => {
  const { panel, hass } = await mount();
  vi.spyOn(card(panel), "confirmLeave").mockReturnValue(false);
  const settings = panel.shadowRoot!.querySelector('a[data-action="settings"]')!;
  const event = new MouseEvent("click", { bubbles: true, cancelable: true });
  settings.dispatchEvent(event);
  expect(event.defaultPrevented).toBe(true);
  panel.hass = { ...hass, user: { is_admin: false } };
  await settle(panel);
  expect(panel.shadowRoot!.querySelector('a[data-action="settings"]')).toBeNull();
  expect(panel.shadowRoot!.querySelector('a[data-action="add"]')).toBeNull();
  expect(panel.shadowRoot!.querySelector('[data-action="clone"]')).toBeNull();
});

it("clones the saved curve, opens the independent copy, and updates the deep link", async () => {
  const { panel, hass } = await mount();
  const callWS = vi.mocked(hass.callWS);
  const guard = vi.spyOn(card(panel), "confirmLeave").mockReturnValue(true);
  panel.shadowRoot!.querySelector<HTMLButtonElement>('[data-action="clone"]')!.click();
  await settle(panel);
  const name = panel.shadowRoot!.querySelector<HTMLInputElement>('input[name="clone-name"]')!;
  expect(name.value).toBe("First copy");
  expect(panel.shadowRoot!.textContent).toContain("clone starts disabled");
  name.value = "Independent curve";
  name.dispatchEvent(new Event("input"));
  callWS.mockResolvedValueOnce({ entry_id: "copy", title: "Independent curve", config: instance().config });
  panel.shadowRoot!.querySelector("form")!.dispatchEvent(new Event("submit", { cancelable: true }));
  await settle(panel);
  expect(guard).toHaveBeenCalled();
  expect(callWS).toHaveBeenLastCalledWith({ type: "curve_scheduler/clone", entry_id: "a", name: "Independent curve" });
  expect(panel.selected).toBe("copy");
  expect(card(panel)._config.entry_id).toBe("copy");
  expect(window.location.search).toContain("entry_id=copy");
  expect(panel.shadowRoot!.querySelector("form")).toBeNull();
});

it("preserves the source and shows clone failures while guarding unsaved drafts", async () => {
  const { panel, hass } = await mount();
  const callWS = vi.mocked(hass.callWS);
  const guard = vi.spyOn(card(panel), "confirmLeave").mockReturnValue(false);
  panel.shadowRoot!.querySelector<HTMLButtonElement>('[data-action="clone"]')!.click();
  await settle(panel);
  callWS.mockClear();
  panel.shadowRoot!.querySelector("form")!.dispatchEvent(new Event("submit", { cancelable: true }));
  await settle(panel);
  expect(callWS).not.toHaveBeenCalled();
  expect(panel.selected).toBe("a");
  guard.mockReturnValue(true);
  callWS.mockRejectedValueOnce(new Error("Offline"));
  panel.shadowRoot!.querySelector("form")!.dispatchEvent(new Event("submit", { cancelable: true }));
  await settle(panel);
  expect(panel.shadowRoot!.querySelector('[role="alert"]')!.textContent).toContain("Offline");
  expect(panel.selected).toBe("a");
  expect(panel.shadowRoot!.querySelector("form")).not.toBeNull();
});
