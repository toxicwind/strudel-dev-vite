# Changelog

All notable changes to the strudel-dev-vite monorepo / @toxicwind/strudel-voices /
serum→strudel bridge.

## [0.1.0] — 2026-11-01

- **Monorepo**: restructured to npm workspaces; `packages/plugins` →
  `packages/voices` published as **`@toxicwind/strudel-voices`** (renamed off the
  Xfer "Serum" trademark; identical behavior, generic voice naming).
- **Dev workbench** (`apps/dev`): Vite REPL host wired to `@strudel/repl`,
  `@toxicwind/strudel-voices` alias, and HTTPS sampler submodule.
- **CI**: `.github/workflows/ci.yml` publishes `@toxicwind/strudel-voices` to npm
  on `voices@*` tags (token `secrets.NPM_TOKEN`).
- **Serum → strudel bridge** (`tools/render-serum-presets.sh` + `tools/README.md`):
  render Serum 2 `.SerumPreset` patches through [ZYG-ZXG] (`zygzxg_render`) into a
  strudel bank, so real Serum patches play via `s("serum:*")`. Credits ZYG-ZXG
  (GPL-3.0) and the Xfer-content boundary.
- **TDD**: `packages/voices/src/bank.ts` + `bank.test.ts` — bank mapping ported
  from bash to typed TS; **16 tests, 100% line/function coverage** (`bun test
  --coverage`). `npm run test:unit` added.
- **Sampler**: upstream `@strudel/sampler` verified serving 40+ banks, 1300+
  samples on `:55432` (default `:5432` ghosted); rendered Serum bank added.
- **Ports SSOT** (`pens/estate/config/ports.env`): `ABYSS_PORT=25261` +
  `STRUDEL_SAMPLER_PORT=55432`.

### Prior history (pre-monorepo)

- `c5c219d` initial repo; `packages/plugins` Serum bridge work, sampler submodule,
  e2e smoke test, Docker/CI, README.
- Renamed / restructured from `@custom/plugins` → `@toxicwind/strudel-serum` →
  `@toxicwind/strudel-voices` (DMCA-safe).

[ZYG-ZXG]: https://github.com/zznorthstar/linux-serum-synth