# @toxicwind/strudel-serum — Serum-style voices for Strudel

An npm-workspace monorepo that publishes **`@toxicwind/strudel-serum`** — a small set of
pattern functions (Serum-style voice presets, wavetable, filter, unison, detune) plus an
optional WebSocket bridge — for use inside any [Strudel](https://strudel.cc) livecoding
project. Ships a hot-reloading Vite REPL workbench (`apps/dev`) and a sample-server
submodule (`apps/sampler`).

## Packages

| Path | npm package | Role |
|------|------------|------|
| `packages/serum` | **`@toxicwind/strudel-serum`** | publishable plugin: voice/filter pattern functions + bridge |
| `apps/dev` | — | Vite + React REPL workbench on `:8088` running `@strudel/repl` with the serum plugin loaded |
| `apps/sampler` | `strudel-sampler-microservice` (submodule) | this repo's config of the sample server (the `samples()` contract) |

## Install

```bash
# use the plugin in any Strudel project
npm install @toxicwind/strudel-serum
```

## Repo setup

```bash
git clone --recurse-submodules https://github.com/toxicwind/strudel-dev-vite.git
cd strudel-dev-vite
git submodule update --init --recursive   # HTTPS URLs (.gitmodules) — no SSH key needed
npm install
```

## Usage

```js
import { serum, wavetable, filterCutoff, filterRes, unison, detune } from '@toxicwind/strudel-serum'

// compose a Serum-style voice pattern
serum('basic-lead')
  .note('<c3 eb3 g3 bb3>*4')
  .wavetable(0.3)
  .filterCutoff(1200)
```

Exports (from `packages/serum/src/serum.ts`):
- `serum(voiceName)` — voice presets (`basic-lead`, `bass-pluck`, `pad`)
- `wavetable`, `filterCutoff`, `filterRes`, `unison`, `detune` — pattern transformers
- `initSerumBridge(url)` — optional WebSocket bridge (`ws://localhost:9000` default)

## Dev workbench (`apps/dev`)

The Vite REPL UI loads the serum plugin (via `@toxicwind/strudel-serum` alias) and exposes
it on `window.__serumPlugins` / `window.__serumPluginKeys`, then calls `initSerumBridge()`.
Run it with the sampler to livecode against your sample library:

```bash
npm run dev   # :8088 — REPL workbench
```

See the sampler repo (`toxicwind/strudel-sampler-server-vite`) for serving audio via
`samples('http://localhost:<port>')`.

## Scripts

| Script | Does |
|--------|------|
| `npm run dev` | Vite hot-reload REPL on `:8088` |
| `npm run build` | build `@toxicwind/strudel-serum` + bundle the workbench |
| `npm run build:serum` | build only the serum package (`packages/serum/dist`) |
| `npm run publish:serum` | `npm publish` `@toxicwind/strudel-serum` |
| `npm run test` / `test:e2e` | Playwright suite (`tests/e2e/strudel.spec.ts`) |
| `npm run sampler` / `sampler:dev` / `sampler:build` | run/build the sample-server submodule |

## CI

`.github/workflows/ci.yml` builds the workspace, runs Playwright, builds the sampler, and
Docker-builds. A `publish` job publishes `@toxicwind/strudel-serum` to npm when a `serum@*`
tag is pushed (token: `secrets.NPM_TOKEN`).

## Samples

`/samples` is a working sample-library root (referenced-not-owned). The sample packs are
downloadable assets, gitignored and not redistributed by this repo.

## Relationship to upstream

This is an independent npm-package consumer of Strudel (via `@strudel/*`), not a fork of
`uzu/strudel` — integration is npm-based, not a `git merge upstream`.