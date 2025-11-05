# Strudel Dev — Astro + Vendored REPL

This workspace serves the upstream [Strudel](https://strudel.cc) REPL as the only UI surface. Astro is the sole build/dev/preview orchestrator, and the Strudel web component (`<strudel-editor>`) is vendored from the Codeberg monorepo and delivered verbatim from `public/vendor/strudel/`.

## Quick start

```bash
npm install
npm run dev        # astro dev, serves http://127.0.0.1:4321/ by default
```

Astro copies everything in `public/` straight through to the build output, so the REPL bundle ships exactly as it was produced upstream.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Launch Astro dev server. |
| `npm run build` | Build static site (only `/`). |
| `npm run preview` | Serve the latest `dist/` build. |
| `npm run test:e2e` | Build then run Playwright smoke against `astro preview`. |
| `npm run check` | `astro check` type analysis. |

All web entry points flow through Astro; there is no Vite/Tailwind/PostCSS/DaisyUI tooling in this repo any longer.

## Vendored Strudel bundles

The Strudel source of truth lives in `vendor/strudel` (cloned from Codeberg, commit `8f24ce223fff1411b0dcb433124092bad9bc1ab4`). The REPL web component was built with:

```bash
cd vendor/strudel
pnpm install
pnpm --filter @strudel/repl build
```

Artifacts were copied into `public/vendor/strudel/repl/` together with `doc.json`. Integrity hashes, byte sizes, build command, and upstream provenance live in `ops/pins/strudel-repl.json`. When upstream ships a new REPL release, rebuild from the vendored repo, refresh the assets, re-run the Playwright smoke, and update the pin file.

### Tracking upstream vs fork

The vendored repo keeps two remotes so pull requests flow through the maintained fork:

```bash
cd vendor/strudel
git remote -v
# origin   git@codeberg.org:toxicwind/strudel-fork.git (fetch/push)
# upstream git@codeberg.org:uzu/strudel.git          (fetch/push)

git fetch upstream
git merge upstream/main
git push origin HEAD
```

The fork at <https://codeberg.org/toxicwind/strudel-fork> is the default push target, while `upstream` keeps the official `uzu/strudel` repository available for syncing.

## Testing

Playwright (`tests/e2e/strudel.spec.ts`) boots `astro preview`, hits `/`, and asserts:

- The vendor bundle is requested successfully (`/vendor/strudel/repl/index.js`),
- `<strudel-editor>` exposes its `editor` API,
- The local `doc.json` responds with HTTP 200,
- The rendered editor surface exceeds minimum width/height.

Run it with:

```bash
npm run test:e2e
```

Reports land in `playwright-report/` and per-test assets in `test-results/`.

## Project layout

```
public/vendor/strudel/    # Vendored REPL dist + doc.json (served as-is by Astro)
src/layouts/              # Base Astro layout (dark shell, script includes)
src/pages/                # / (single page) mounting <strudel-editor>
ops/checklist.migration.json
ops/pins/                 # Provenance + integrity metadata for vendored assets
vendor/strudel/           # Full upstream Strudel monorepo (Codeberg clone)
```

## License

This project ships under the [Do What The Fuck You Want To Public License](./LICENSE).
