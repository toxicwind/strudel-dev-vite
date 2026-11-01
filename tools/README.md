# Serum → strudel bridge

Renders Serum 2 `.SerumPreset` patches into a strudel sample bank so real
Serum patches are livecode-able via strudel:

```js
samples('http://localhost:55432')  // loads all banks incl the Serum bank
n("0 2").s("serum:bass:*")
```

## Credit

The render engine is **[ZYG-ZXG]**, a native GPL-3.0 Linux wavetable
synthesizer (VST3/CLAP) that decodes `.SerumPreset` files with its own DSP.
This bridge is a thin orchestration layer around ZYG's offline `render_tool`;
**all synthesis and preset-decoding credit belongs to ZYG-ZXG** and its
authors. It reproduces and opens presets for interop with legally-owned
content only — see `linux-serum-synth/LICENSE` (GPL-3.0) and its `AGENTS.md`
for the Xfer-content boundary (load your own presets; never redistribute
Xfer's code).

- Project: https://github.com/zznorthstar/linux-serum-synth
- Fork (private): `toxicwind/serum-fork-private` (upstream retained)
- Keep upstream in sync: `git remote add upstream https://github.com/zznorthstar/linux-serum-synth && git fetch upstream`

## Use

```bash
# 1. build ZYG's render tool (see linux-serum-synth/docs/BUILDING or its README)
# 2. point the bridge at it + the strudel sample root + the Serum content
ZYG_RENDER=/path/to/zygzxg_render \
SERUM_SAMPLE_ROOT=/fathom/samples/strudel-root \
ZYG_CONTENT_ROOT=/fathom/samples/abyss/unpacked \
  bash render-serum-presets.sh
```

## License

This bridge is GPL-3.0 (inherits ZYG's license as a derived orchestration
layer). The rendered WAVs and the sample packs they come from remain
copyrighted by their producers — reference, never redistribute.

[ZYG-ZXG]: https://github.com/zznorthstar/linux-serum-synth