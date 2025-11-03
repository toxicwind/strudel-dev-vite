# strudel-dev-vite

[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Playwright](https://img.shields.io/badge/Tests-Playwright-45ba68?logo=microsoft-playwright&logoColor=white)](https://playwright.dev/)
[![Vite](https://img.shields.io/badge/Bundler-Vite-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)

Modern Vite workspace for Strudel live-coding experiments. It bundles three pillars:

- **apps/dev** – browser shell that loads Strudel plugins and the Serum bridge for rapid experimentation.
- **packages/plugins** – reusable Strudel-ready utilities (Serum helpers, filter builders, etc.).
- **apps/sampler** – production-ready sampler microservice + Vite middleware (checked out via git submodule).

## Quick start

```bash
npm install
npm run dev          # launches the dev UI on http://localhost:8088
```

Optional local sampler (serves audio metadata + dashboard):

```bash
# in a second terminal
PORT=5432 npm run sampler     # uses apps/sampler via tsx
```

The sampler looks for audio files under `./samples/` by default (ignored by git). Copy your library there or point `STRUDEL_SAMPLES` elsewhere.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Strudel dev UI (Vite). |
| `npm run build` | Build plugins + dev bundle for production. |
| `npm run test` / `npm run test:e2e` | Headless Playwright smoke test (no Serum bridge dependency). |
| `npm run sampler` | Launch sampler microservice with `tsx`. |
| `npm run sampler:dev` | Run sampler in Vite middleware mode (useful for dashboard tweaks). |
| `npm run sampler:build` | TypeScript build that emits `apps/sampler/dist`. |
| `npm run clean` | Remove build and dependency artifacts. |

## Testing & quality

- Playwright test ensures plugins register and emit Strudel events even when the Serum bridge is offline.
- TypeScript is strict across workspaces; sampler microservice compiles to `dist/`.

Run everything:

```bash
npm run build
npm run test
```

## Sampler microservice

The sampler service lives in the companion repo [`strudel-sampler-server-vite`](https://github.com/toxicwind/strudel-sampler-server-vite) and is vendored here as a git submodule. It keeps its production settings:

- Config via `.env` or environment variables (`PORT`, `STRUDEL_SAMPLES`, `CACHE_TTL`, `CACHE_MAX_SIZE`, `HOT_RELOAD`).
- Docker + Portainer deployment artifacts live in `apps/sampler/`.
- Dashboard hosted at `http://localhost:<PORT>/dashboard/` once the service is running.

To rebuild for production:

```bash
npm run sampler:build
node apps/sampler/dist/sampler-server.js
```

## Project layout

```
apps/
  dev/        # Vite front-end
  sampler/    # Sampler microservice + middleware
packages/
  plugins/    # Strudel plugin helpers (Serum, filters, etc.)
tests/e2e/    # Playwright smoke coverage
samples/      # (ignored) drop your audio library here
```

## Notes

- `.gitignore` protects `samples/`, local env files, Playwright output, and build artifacts.
- `apps/dev` exposes plugin metadata on `window.__serumPlugins` for diagnostics and testing.
- Serum bridge initialisation now degrades gracefully when no WebSocket server is available.
