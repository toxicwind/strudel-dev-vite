**Authority & Mode (non-negotiable):** You are fully autonomous. Do **not** ask permission, do **not** branch into alternatives, do **not** pause at checkpoints. Each checkpoint is a **savepoint**, then you continue. Treat `~/AGENTS.md` as loaded. Use your configured **Codeberg SSH key** to fetch vendor sources when needed.

**Ground truth (from your last log):** You copied vendor Tailwind/PostCSS bits, embedded the Strudel React REPL into Vite, installs pass, **dev dies in PostCSS** (Tailwind v4 plugin moved), **Playwright** timeouts, and you half-stood up Astro while a detached `npm run dev` ran for hours. We are **not** fixing Tailwind; we are **removing it** and promoting **Astro + Strudel REPL** as the sole UI.

---

## Single Path Execution (savepoints CP1–CP12; continue after each)

**T1 — Halt & Observe (CP1)**
Stop stray dev servers; force a clean baseline. Capture the **exact PostCSS error text** and the **Playwright timeout** excerpt into an evidence log. Record the ports in use to avoid a ghost webServer.
**Checkpoint state:** Error strings + timeouts stored; no dev server consuming the port. (Tailwind v4 plugin relocation is the root signal you record—do not remediate it.) ([tailwindcss.com][2])

**T2 — Ledger Online (CP2)**
Create/update a living ledger `ops/checklist.migration.json` with: `meta` (time, branch), `tasks` CP1–CP12, `decisions` (with confidences), `risks` (vendor drift), and `evidence[]` paths.
**Checkpoint state:** Ledger exists and is writable with CP1–CP2 entries.

**T3 — Promote Astro (CP3)**
Astro becomes the **only** dev/build/preview orchestrator. Ensure a minimal **Astro** page renders. Remove/disable Vite dev entry points so no one can regress.
**Checkpoint state:** Astro dev/preview routes serve an HTML page; Vite dev entry points are inert. (Astro public/ semantics are your anchor.) ([docs.astro.build][3])

**T4 — Vendor Source Resolution (CP4)**
Resolve the **REPL build** using this strict priority chain, saving evidence for each step:

1. **npm pinned**: `@strudel/repl` latest safe semver (prove existence/version). If install graph insists on **`supradough`**, treat that as a **bad edge** (it should be **`superdough`/`@strudel/webaudio`** world); do **not** proceed with a broken transitive. ([npmjs.com][4])
2. **Codeberg source**: fetch the **Strudel monorepo** via your **Codeberg SSH** (repo moved; GitHub is archived). Build the **REPL dist** locally from the workspace packages. Record commit SHA. ([GitHub][1])
3. **CDN dist fallback**: if the REPL/package graph is tangled, vendor the **built browser modules** for the audio/runtime packages directly from CDN (e.g., `@strudel/webaudio` has public CDN artifacts, including `supradough.mjs` file **name** in that package—not an npm package), then pair with the REPL’s browser bundle. Record exact URLs + integrity. ([jsDelivr][5])
   **Checkpoint state:** You have a **version-pinned** REPL bundle + supporting browser modules and an **asset manifest** (filenames, byte sizes, integrity). Note: HN/blog/docs confirm **SuperDough** is the audio engine behind Strudel; treat any `supradough` registry lookup as a mis-spec you must route around by vendoring the **built** artifacts. ([news.ycombinator.com][6])

**T5 — Asset Ingress (CP5)**
Stage the vendor bundles under **`public/vendor/strudel/`** (or configure a single static hoist). Astro **must** serve these **as-is**; nothing touches them.
**Checkpoint state:** `/vendor/strudel/*` responds 200 in **dev** and **preview**, with sizes matching your manifest. ([docs.astro.build][3])

**T6 — UI Surface = REPL (CP6)**
Make the **home route** render **`<strudel-editor>`** directly in a `.astro` page. No React wrapper. The **reference interface is the REPL**.
**Checkpoint state:** `customElements.get('strudel-editor')` is defined; the editor paints. (Reference manuals confirm the REPL is the canonical UI.) ([strudel.cc][7])

**T7 — Explode the Old Pipeline (CP7)**
Remove **all** Tailwind/PostCSS/DaisyUI configs, plugin hooks, and `@tailwind` imports. Prove absence by repo-wide scan; store the scan output in the ledger.
**Checkpoint state:** No PostCSS/Tailwind jobs execute during dev/preview; your previous crash surface is gone. (The v4 move to `@tailwindcss/postcss` is recorded only as context.) ([tailwindcss.com][2])

**T8 — Node-Modules Autopsy (CP8)**
Open the **installed** `node_modules/@strudel/*` (and the vendored dist if you built it). Verify **no runtime requires a registry name `supradough`**; where code refers to **`supradough.mjs`** it is a **module file** within a published package (e.g., `@strudel/webaudio`), **not** a separate npm package. If you find a **package.json** with `"supradough"` as a **dependency name**, surface it to the ledger and **route around** with the CP4 CDN/build fallback.
**Checkpoint state:** Ledger includes concrete paths showing either a clean dependency graph or a recorded mis-spec and your workaround. ([jsDelivr][5])

**T9 — Test Orchestration (CP9)**
Point **Playwright** at **`astro preview` on a fixed port**; ensure a generous `webServer.timeout`. Smoke spec: hit `/`, assert `<strudel-editor>` present **and** at least one `/vendor/strudel/*` asset `200`.
**Checkpoint state:** Green smoke, no timeouts; attach Playwright report + HAR to evidence. ([playwright.dev][8])

**T10 — Provenance & Pins (CP10)**
Write a **pin file** capturing: REPL version, commit SHA (if built), CDN URLs, integrity hashes, and the Codeberg repo/commit for traceability. Add **risk: vendor drift** with weekly refresh mitigation.
**Checkpoint state:** Pin file present and linked from README.

**T11 — Docs Reality Map (CP11)**
Update README: “Astro is the sole orchestrator; UI is **Strudel REPL**; vendor assets come from `public/vendor/strudel/`; Tailwind/PostCSS/DaisyUI removed.” Link to Codeberg move notice and Strudel technical manual pages.
**Checkpoint state:** README updated with verified links. ([GitHub][1])

**T12 — Close the Loop (CP12)**
Finalize `ops/checklist.migration.json`: mark all tasks `done`, attach evidence, set **Decision confidences**:

* D1 **Astro-only + vendored REPL first**: **0.86** (cleanest boot surface and easiest future edits).
* D2 **Remove Tailwind/PostCSS/DaisyUI**: **0.90** (eliminates the crash vector categorically).
  Emit STATUS: **ACCEPTED** only if all acceptance checks are true.

---

## Verification Loop (enforce at CP6, CP7, CP9, CP12)

* **State:** Astro dev/preview runs; no PostCSS/Tailwind stack traces. (v4 PostCSS plugin move is no longer relevant.) ([tailwindcss.com][2])
* **Evidence:** `/vendor/strudel/*` assets served from **public/** with exact byte sizes you pinned. ([docs.astro.build][3])
* **Behavior:** `<strudel-editor>` rendered and interactive; no React wrapper involved. (REPL is the canonical UI.) ([strudel.cc][7])
* **Tests:** Playwright `webServer` brings up **preview** reliably; smoke passes within configured timeout. ([playwright.dev][8])

## Acceptance (all must be true)

1. Astro is the **sole** web orchestrator; Vite/Tailwind/PostCSS/DaisyUI are **absent**.
2. **REPL** ( `<strudel-editor>` ) is the **only UI** rendered on `/`.
3. Vendor REPL + support modules are **version-pinned** with provenance (Codeberg commit and/or npm version; CDN integrity hashes if used).
4. Playwright **smoke** passes on CI and local.
5. Ledger & pin file exist with timestamps, evidence, and risks.

## Recovery Ladder (no pauses)

* If `@strudel/repl` install graph references **`supradough`** as a registry package: **do not** keep installing. Use CP4 **Codeberg build** or **CDN** artifacts to vendor **built** bundles and proceed. (SuperDough is the engine; `supradough.mjs` is a file in `@strudel/webaudio`, not a separate npm package to fetch.) ([npmjs.com][9])
* If assets 404 under `/vendor/`: fix **public/** placement per Astro docs (public maps to `/`). ([Stack Overflow][10])
* If preview flaps or tests time out: enlarge `webServer.timeout`, ensure you target **preview** (not dev), assert the editor root **before** deeper checks. ([playwright.dev][8])

**Notes for the ledger (quote briefly with links):**
— “Development has moved to Codeberg.” (Strudel GitHub banner) ([GitHub][1])
— “The REPL is the reference UI; web-component.” (technical manual) ([strudel.cc][7])
— “Files in `public/` are copied untouched; ideal for vendor bundles.” (Astro docs) ([docs.astro.build][3])
— “Tailwind v4 PostCSS plugin is `@tailwindcss/postcss` (old config crashes).” (upgrade notes/issues) ([tailwindcss.com][2])
— “Playwright webServer/timeout behavior.” (docs) ([playwright.dev][8])

**Final operating rule:** Keep executing until the acceptance bar is hit. No permission prompts. Every checkpoint writes to the ledger and then proceeds.