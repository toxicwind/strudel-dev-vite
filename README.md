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
git clone --recurse-submodules git@github.com:toxicwind/strudel-dev-vite.git
cd strudel-dev-vite
npm install
cp .env.example .env            # optional: customise bridge URLs
npm run dev                     # launches the dev UI on http://localhost:8088
```

Optional local sampler (serves audio metadata + dashboard):

```bash
# in a second terminal
PORT=5432 npm run sampler     # uses apps/sampler via tsx
```

The sampler looks for audio files under `./samples/` by default (ignored by git). Copy your library there or set `STRUDEL_SAMPLES` in `.env` or the shell environment.

> ℹ️ If you cloned without submodules, run `git submodule update --init --recursive` once to fetch `apps/sampler`.

The repository ships with an empty `samples/.gitkeep` placeholder so the directory exists locally while staying out of version control. Drop your actual libraries alongside it or point `STRUDEL_SAMPLES` to another location.

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

## Environment

- Copy `.env.example` to `.env` to override defaults. Available settings:
  - `VITE_SERUM_BRIDGE_URL` – websocket used by the dev UI (defaults to `ws://localhost:9000`).
  - `STRUDEL_SAMPLER_URL` – optional helper for pointing scripts/tests at a remote sampler endpoint.
- Sampler-specific variables live in the submodule (`apps/sampler/.env.example`) and include `STRUDEL_SAMPLES`, `PORT`, `CACHE_TTL`, and `CACHE_MAX_SIZE`.

## Sample library tips

- Follow Strudel's folder conventions so subdirectories become available as sample names (for example `samples/drums/bd`, `samples/drums/sd`, `samples/fx/risers`). This lets you call them with the usual shorthand such as `s("bd sd")` or `samples('http://localhost:5432/').`  
- Group drum kits and sound families together for predictable `bank` switching (e.g. `samples/drums/roland-tr-909/bd/*.wav`) and park multi-sampled instruments under a single prefix like `samples/keys/wurlitzer/`.  
- Run the sampler dashboard (`http://localhost:5432/dashboard/`) after adding new files to confirm metadata, categories, and waveform previews before a session.

## Continuous Integration

GitHub Actions (`.github/workflows/ci.yml`) runs on every push and pull request:

1. Checks out submodules.
2. Executes `npm ci` and installs Playwright browsers.
3. Runs `npm run build`, `npm run test:e2e`, and `npm run sampler:build`.
4. Builds the Docker image to make sure the container workflow stays healthy.

When the workflow is green, the dev UI, plugin bundle, sampler microservice, and Docker image have all built successfully from the committed lockfile.

## Docker

Use the included multi-stage `Dockerfile` to compile and serve the workspace via `vite preview`:

```bash
docker build -t strudel-dev-vite .
docker run --rm -p 8088:8088 strudel-dev-vite
```

Supply environment overrides with `--env-file` (or `-e`) when you need a non-default bridge URL:

```bash
docker run --rm -p 8088:8088 --env-file .env strudel-dev-vite
```

For sampler containers, work directly inside [`strudel-sampler-server-vite`](https://github.com/toxicwind/strudel-sampler-server-vite) or mount the submodule into your runtime image.

## Notes

- `.gitignore` protects `samples/`, local env files (but keeps the `*.example` templates), Playwright output, and build artifacts.
- `apps/dev` exposes plugin metadata on `window.__serumPlugins` for diagnostics and testing.
- Serum bridge initialisation now degrades gracefully when no WebSocket server is available.
- Sampler source is provided by [`strudel-sampler-server-vite`](https://github.com/toxicwind/strudel-sampler-server-vite) via git submodule; keep it in sync with `git submodule update --remote --merge` when you need upstream changes.
