/** Dedicated editor page, using the same card/editor and WebSocket save path. */
import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { keyed } from "lit/directives/keyed.js";
import { createRef, ref } from "lit/directives/ref.js";
import { cloneInstance, listInstances, type HomeAssistant, type InstanceSummary } from "./api";
import { languageOf, translator } from "./i18n";
import { sharedStyles } from "./styles";
import type { CurveSchedulerCard } from "./card";
import "./card";

export class CurveSchedulerPanel extends LitElement {
  static properties = {
    hass: { attribute: false },
    narrow: { type: Boolean },
    instances: { state: true },
    selected: { state: true },
    loading: { state: true },
    error: { state: true },
    cloneName: { state: true },
    cloning: { state: true },
    cloneError: { state: true },
  };

  declare hass: HomeAssistant;
  declare narrow: boolean;
  declare instances: InstanceSummary[] | null;
  declare selected: string;
  declare loading: boolean;
  declare error: string;
  private card = createRef<CurveSchedulerCard>();
  private request = 0;
  private cloneName: string | null = null;
  private cloning = false;
  private cloneError = "";

  constructor() {
    super();
    this.narrow = false;
    this.instances = null;
    this.selected = "";
    this.loading = false;
    this.error = "";
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (this.hass) void this.load();
  }

  disconnectedCallback(): void {
    this.request += 1;
    this.loading = false;
    super.disconnectedCallback();
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    if (changed.has("hass") && this.hass && !this.instances && !this.loading && !this.error) {
      void this.load();
    }
  }

  protected updated(): void {
    this.card.value?.setConfig({
      type: "custom:curve-scheduler-card",
      entry_id: this.selected,
      view: "full",
      editor_mode: "always",
    });
  }

  private async load(): Promise<void> {
    const request = ++this.request;
    this.loading = true;
    this.error = "";
    try {
      const instances = await listInstances(this.hass);
      if (!this.isConnected || request !== this.request) return;
      this.instances = instances;
      const requested = new URL(window.location.href).searchParams.get("entry_id");
      this.selected = requested ?? instances[0]?.entry_id ?? "";
    } catch (error) {
      if (this.isConnected && request === this.request) this.error = String(error);
    } finally {
      if (request === this.request) this.loading = false;
    }
  }

  private select(event: Event): void {
    const select = event.target as HTMLSelectElement;
    if (select.value === this.selected) return;
    if (this.card.value && !this.card.value.confirmLeave()) {
      select.value = this.selected;
      return;
    }
    this.cloneName = null;
    this.cloneError = "";
    this.selected = select.value;
    const url = new URL(window.location.href);
    url.searchParams.set("entry_id", this.selected);
    window.history.replaceState(window.history.state, "", url);
  }

  private async clone(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    const name = this.cloneName?.trim();
    if (!name || this.cloning || !this.hass.user?.is_admin) return;
    if (this.card.value && !this.card.value.confirmLeave()) return;
    this.cloning = true;
    this.cloneError = "";
    try {
      const instance = await cloneInstance(this.hass, this.selected, name);
      if (!this.isConnected) return;
      this.instances = [...(this.instances ?? []), instance];
      this.selected = instance.entry_id;
      this.cloneName = null;
      const url = new URL(window.location.href);
      url.searchParams.set("entry_id", this.selected);
      window.history.replaceState(window.history.state, "", url);
    } catch (error) {
      this.cloneError = (error as { message?: string })?.message ?? String(error);
    } finally { this.cloning = false; }
  }

  private confirmNavigation(event: Event): void {
    if (this.card.value && !this.card.value.confirmLeave()) event.preventDefault();
  }

  protected render() {
    const t = translator(languageOf(this.hass));
    const found = this.instances?.some(instance => instance.entry_id === this.selected);
    return html`
      <header>
        <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
        <h1>Curve Scheduler</h1>
      </header>
      <main>
        <div class="toolbar">
          <label class="field grow">
            ${t("panel.instance")}
            <select .value=${this.selected} @change=${this.select} ?disabled=${this.loading || this.cloning || !this.instances?.length}>
              ${this.instances?.map(instance => html`<option value=${instance.entry_id} ?selected=${instance.entry_id === this.selected}>${instance.title}</option>`)}
            </select>
          </label>
          <button ?disabled=${this.loading || this.cloning} @click=${() => {
            if (!this.card.value || this.card.value.confirmLeave()) void this.load();
          }}>${t("panel.refresh")}</button>
          ${this.hass?.user?.is_admin ? html`
            ${found ? html`<button data-action="clone" ?disabled=${this.cloning} @click=${() => {
              this.cloneName = `${this.instances?.find(instance => instance.entry_id === this.selected)?.title} ${t("panel.copy_suffix")}`.slice(0, 100);
              this.cloneError = "";
            }}>${t("panel.clone")}</button>` : nothing}
            ${found ? html`<a data-action="settings" href="/config/integrations/integration/curve_scheduler" @click=${this.confirmNavigation}>${t("panel.settings")}</a>` : nothing}
            <a data-action="add" href="/config/integrations/dashboard/add?domain=curve_scheduler" @click=${this.confirmNavigation}>${t("panel.add")}</a>
          ` : nothing}
        </div>
        ${this.cloneName !== null ? html`<form class="clone-form" @submit=${this.clone}>
          <label class="field grow">${t("panel.clone_name")}
            <input name="clone-name" required maxlength="100" .value=${this.cloneName} ?disabled=${this.cloning}
              @input=${(event: Event) => { this.cloneName = (event.target as HTMLInputElement).value; }}>
          </label>
          <p class="muted">${t("panel.clone_hint")}</p>
          ${this.cloneError ? html`<p role="alert">${t("panel.clone_failed", { message: this.cloneError })}</p>` : nothing}
          <div class="row"><button type="button" ?disabled=${this.cloning} @click=${() => { this.cloneName = null; }}>${t("panel.clone_cancel")}</button>
          <button type="submit" class="primary" ?disabled=${this.cloning || !this.cloneName.trim()}>${t(this.cloning ? "panel.cloning" : "panel.clone")}</button></div>
        </form>` : nothing}
        ${this.error ? html`<p role="alert">${t("card.connection_error", { message: this.error })}</p>` : nothing}
        ${this.loading && !this.instances ? html`<p role="status">${t("card.loading")}</p>` : nothing}
        ${this.instances?.length === 0 ? html`<p role="status">${t("panel.empty")}</p>` : nothing}
        ${this.instances?.length && !found ? html`<p role="alert">${t("panel.not_found")}</p>` : nothing}
        ${found ? keyed(this.selected, html`<curve-scheduler-card ${ref(this.card)} .hass=${this.hass} ?inert=${this.cloning}></curve-scheduler-card>`) : nothing}
      </main>
    `;
  }

  static styles = [sharedStyles, css`
    :host { display: block; height: 100%; overflow: auto; color: var(--primary-text-color); background: var(--primary-background-color); }
    header { display: flex; align-items: center; min-height: 56px; padding: 0 16px; background: var(--app-header-background-color, var(--primary-color)); color: var(--app-header-text-color, white); }
    h1 { font-size: 20px; font-weight: 400; margin: 12px 8px; }
    main { max-width: 960px; margin: 0 auto; padding: 16px; }
    .toolbar { display: flex; gap: 12px; align-items: end; flex-wrap: wrap; margin-bottom: 16px; }
    .grow { flex: 1; min-width: 180px; }
    .clone-form { padding: 16px; border: 1px solid var(--divider-color); border-radius: var(--zp-radius); margin-bottom: 16px; }
    a { color: var(--primary-color); padding: 12px 0; }
  `];
}
customElements.define("curve-scheduler-panel", CurveSchedulerPanel);
