// Run npm run demo in another terminal, then npm run screenshots.
const { chromium } = require("playwright");
const path = require("node:path");
const fs = require("node:fs/promises");
const { execFileSync } = require("node:child_process");
const out = path.resolve(__dirname, "../../docs/images");
const base = process.env.DEMO_URL ?? "http://127.0.0.1:8765/demo/index.html";

(async () => {
  const browser = await chromium.launch();
  try {
    await fs.mkdir(out, { recursive: true });
    for (const language of ["en", "de"]) {
      for (const [name, width, query, tab] of [
        ["today", 560, "", undefined],
        ["today-dark-mobile", 360, "theme=dark", undefined],
        ["editor-profiles", 760, "view=full", 0],
        ["editor-profiles-mobile", 360, "view=full", 0],
        ["editor-activations", 760, "view=full", 1],
        ["sidebar-editor", 960, "surface=panel", 0],
        ["sensor-offset", 760, "entry_id=sensor", undefined],
        ["seasonal-offset", 760, "entry_id=month", undefined],
        ["editor-exceptions", 760, "view=full", 2],
      ]) {
        const page = await browser.newPage({ viewport: { width, height: 2200 }, deviceScaleFactor: 2, timezoneId: "Europe/Berlin", locale: language === "en" ? "en-GB" : "de-DE" });
        await page.goto(`${base}?lang=${language}&${query}`);
        const surface = page.locator(query.includes("surface=panel") ? "curve-scheduler-panel" : "curve-scheduler-card");
        await surface.locator("ha-card").waitFor();
        if (tab !== undefined) await surface.locator(".tab").nth(tab).click();
        await page.evaluate(() => document.fonts.ready);
        if (tab === undefined || tab === 0) await surface.locator(".offset-curve").first().waitFor();
        const capture = query.includes("surface=panel") ? surface : surface.locator("ha-card");
        const png = path.join(out, `${name}-${language}.png`);
        await capture.screenshot({ path: png });
        execFileSync(process.env.PYTHON ?? "python3", ["-c", "from PIL import Image; import sys; Image.open(sys.argv[1]).save(sys.argv[2], 'WEBP', quality=90)", png, path.join(out, `${name}-${language}.webp`)]);
        await fs.unlink(png);
        await page.close();
      }
    }
  } finally { await browser.close(); }
})();
