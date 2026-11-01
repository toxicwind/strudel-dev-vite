# @toxicwind/strudel-voices — voices for Strudel

An npm-workspace monorepo that publishes **`@toxicwind/strudel-voices`** — a small set of
voice/filter pattern functions (voice presets, wavetable, filter, unison, detune) plus an
optional WebSocket bridge — for use inside any [Strudel](https://strudel.cc) livecoding
project. Ships a hot-reloading Vite REPL workbench (`apps/dev`) and a sample-server
submodule (`apps/sampler`).

This is an independent npm-package consumer of Strudel (via `@strudel/*`), not a fork of
`uzu/strudel` — integration is npm-based, not a `git merge upstream`.

## Packages

| Path | npm package | Role |
|------|------------|------|
| `packages/voices` | **`@toxicwind/strudel-voices`** | publishable plugin: voice/filter pattern functions + bridge |
| `apps/dev` | — | Vite + React REPL workbench on `:8088` running `@strudel/repl` with the voices plugin loaded |
| `apps/sampler` | `strudel-sampler-microservice` (submodule) | this repo's config of the sample server (the `samples()` contract) |

## Install

```bash
# use the plugin in any Strudel project
npm install @toxicwind/strudel-voices
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
import { voice, wavetable, filterCutoff, filterRes, unison, detune } from '@toxicwind/strudel-voices'

// compose a voice pattern
voice('basic-lead')
  .note('<c3 eb3 g3 bb3>*4')
  .wavetable(0.3)
  .filterCutoff(1200)
```

Exports (from `packages/voices/src/voice.ts`):
- `voice(voiceName)` — voice presets (`basic-lead`, `bass-pluck`, `pad`)
- `wavetable`, `filterCutoff`, `filterRes`, `unison`, `detune` — pattern transformers
- `initVoiceBridge(url)` — optional WebSocket bridge (`ws://localhost:9000` default)

## Dev workbench (`apps/dev`)

The Vite REPL UI loads the voices plugin (via `@toxicwind/strudel-voices` alias) and exposes
it on `window.__voicePlugins` / `window.__voicePluginKeys`, then calls `initVoiceBridge()`.
Run it with the sampler to livecode against your sample library:

```bash
npm run dev        # :8088 — REPL workbench
```

See the sampler repo (`toxicwind/strudel-sampler-server-vite`) for serving audio via
`samples('http://localhost:<port>')`.

## Scripts

| Script | Does |
|--------|------|
| `npm run dev` | Vite hot-reload REPL on `:8088` |
| `npm run build` | build `@toxicwind/strudel-voices` + bundle the workbench |
| `npm run build:voices` | build only the voices package (`packages/voices/dist`) |
| `npm run publish:voices` | `npm publish` `@toxicwind/strudel-voices` |
| `npm run test` / `test:e2e` | Playwright suite (`tests/e2e/strudel.spec.ts`) |
| `npm run sampler` / `sampler:dev` / `sampler:build` | run/build the sample-server submodule |

## CI

`.github/workflows/ci.yml` builds the workspace, runs Playwright, builds the sampler, and
Docker-builds. A `publish` job publishes `@toxicwind/strudel-voices` to npm when a `voices@*`
tag is pushed (token: `secrets.NPM_TOKEN`).

## Samples

`/samples` is a working sample-library root (referenced-not-owned). The sample packs are
downloadable assets, gitignored and not redistributed by this repo.