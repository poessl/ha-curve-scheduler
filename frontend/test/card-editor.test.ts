import { afterEach, expect, it, vi } from "vitest";
import "../src/card-editor";
import type { CurveSchedulerCardEditor } from "../src/card-editor";
import type { CurveSchedulerCardConfig } from "../src/card";

const base = { type: "custom:curve-scheduler-card", entry_id: "abc" };

async function mount(config: Partial<CurveSchedulerCardConfig>) {
  const editor = document.createElement("curve-scheduler-card-editor") as CurveSchedulerCardEditor;
  editor.setConfig({ ...base, ...config });
  document.body.append(editor);
  await editor.updateComplete;
  const select = editor.shadowRoot!.querySelectorAll<HTMLSelectElement>("select")[2];
  return { editor, select };
}

afterEach(() => { document.body.innerHTML = ""; });

it.each([
  [{ editor_mode: "hidden" }, "hidden"],
  [{ editor_mode: "button" }, "button"],
  [{ editor_mode: "always" }, "always"],
  [{}, "button"],
  [{ view: "full" }, "always"],
  [{ view: "graph" }, "hidden"],
  [{ show_edit: false }, "hidden"],
  [{ view: "graph", show_edit: false, editor_mode: "button" }, "button"],
] satisfies [Partial<CurveSchedulerCardConfig>, string][])(
  "displays the effective editor mode on opening: %j → %s",
  async (config, expected) => {
    const { select } = await mount(config);
    expect(select.value).toBe(expected);
  },
);

it("updates after configuration changes and preserves the selected mode when reopened", async () => {
  const { editor, select } = await mount({ editor_mode: "always" });
  const changed = vi.fn();
  editor.addEventListener("config-changed", changed);
  editor.setConfig({ ...base, editor_mode: "button" });
  await editor.updateComplete;
  expect(select.value).toBe("button");
  expect(changed).not.toHaveBeenCalled();

  select.value = "always";
  select.dispatchEvent(new Event("change"));
  await editor.updateComplete;
  const config = (changed.mock.calls[0][0] as CustomEvent).detail.config;
  expect(config.editor_mode).toBe("always");
  editor.remove();
  expect((await mount(config)).select.value).toBe("always");
});
