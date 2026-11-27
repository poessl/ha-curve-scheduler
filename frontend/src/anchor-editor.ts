/** Anchor roles shared by the daily and weekly point editors. */
import { html, nothing } from "lit";
import type { AnchorMetadata } from "./model";
import type { HomeAssistant } from "./api";

export function anchorControls<T extends AnchorMetadata>(
  points: T[], selected: number | null, hass: HomeAssistant, language: string,
  update: (points: T[]) => void,
) {
  if (selected === null || !points[selected]) return nothing;
  const de = language.startsWith("de");
  const text = (en: string, german: string) => de ? german : en;
  const point = points[selected];
  const anchors = points.flatMap((p, i) => p.anchor && p.id && i !== selected ? [{ id: p.id, index: i }] : []);
  const change = (mutate: (p: T, next: T[]) => void) => {
    const next = points.map(p => ({ ...p, ...(p.anchor ? { anchor: { ...p.anchor } } : {}) }));
    mutate(next[selected], next);
    update(next);
  };
  const role = point.anchor ? "anchor" : point.partner_of ? "partner" : "fixed";
  return html`<fieldset class="anchor-controls"><legend>${text("Point", "Punkt")} ${selected + 1} · ${text("Anchor assignment", "Ankerzuordnung")}</legend>
    <label>${text("Role", "Rolle")} <select aria-label=${text("Point role", "Punktrolle")} .value=${role}
      @change=${(e: Event) => change((p, next) => {
        const value = (e.target as HTMLSelectElement).value;
        if (p.anchor) next.forEach(other => { if (other.partner_of === p.id) delete other.partner_of; });
        delete p.anchor; delete p.partner_of;
        if (value === "anchor") { p.id ??= crypto.randomUUID?.() ?? `point_${Date.now()}_${Math.random().toString(36).slice(2)}`; p.anchor = { entity_id: "", shift_mode: "shortest" }; }
        if (value === "partner" && anchors[0]) p.partner_of = anchors[0].id;
      })}>
      <option value="fixed">${text("Fixed", "Fest")}</option><option value="anchor">${text("Anchor", "Anker")}</option>
      <option value="partner" ?disabled=${!anchors.length}>${text("Partner", "Partner")}</option>
    </select></label>
    ${point.anchor ? html`<label>${text("Datetime source", "Datum-/Zeitquelle")}
      <ha-entity-picker .hass=${hass} .includeDomains=${["input_datetime", "datetime", "sensor"]} .value=${point.anchor.entity_id}
        allow-custom-entity @value-changed=${(e: CustomEvent) => change(p => { p.anchor!.entity_id = e.detail.value ?? ""; })}></ha-entity-picker></label>
      <label>${text("Movement", "Verschiebung")} <select aria-label=${text("Anchor movement", "Ankerverschiebung")} .value=${point.anchor.shift_mode ?? "shortest"}
        @change=${(e: Event) => change(p => { p.anchor!.shift_mode = (e.target as HTMLSelectElement).value as "shortest" | "direct"; })}>
        <option value="shortest">${text("Shortest around cycle", "Kürzester Weg im Zyklus")}</option>
        <option value="direct">${text("Direct difference", "Direkte Differenz")}</option></select></label>` : nothing}
    ${point.partner_of ? html`<label>${text("Follow anchor", "Anker folgen")} <select aria-label=${text("Partner anchor", "Partneranker")} .value=${point.partner_of}
      @change=${(e: Event) => change(p => { p.partner_of = (e.target as HTMLSelectElement).value; })}>
      ${anchors.map(a => html`<option value=${a.id}>${text("Point", "Punkt")} ${a.index + 1}</option>`)}</select></label>` : nothing}
    <p>${text("Edit saved coordinates here. Source changes move only the main graph. Removing an anchor detaches its partners.", "Hier werden gespeicherte Koordinaten bearbeitet. Quellenänderungen verschieben nur die Hauptgrafik. Beim Entfernen eines Ankers werden seine Partner gelöst.")}</p>
  </fieldset>`;
}

export function detachDeletedAnchors<T extends AnchorMetadata>(points: T[]): T[] {
  const anchors = new Set(points.filter(p => p.anchor).map(p => p.id));
  return points.map(p => {
    if (!p.partner_of || anchors.has(p.partner_of)) return p;
    const next = { ...p }; delete next.partner_of; return next;
  });
}
