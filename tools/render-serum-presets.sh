#!/usr/bin/env bash
# Serum → strudel bridge: render Serum 2 .SerumPreset patches through the
# native ZYG-ZXG engine (zznorthstar/linux-serum-synth, GPL-3.0) into a strudel
# sample bank, so real Serum patches become playable via strudel code:
#     s("serum:bass:*")  /  s("serum:key:*")
#
# Usage:
#   render-serum-presets.sh [--renderer /path/to/zygzxg_render] [--root /fathom/samples/strudel-root] [--out-bank serum]
#   Defaults: renderer from $ZYG_RENDER or build output; root = ../../samples/strudel-root
#
# Emits: <root>/Serum/<bank>/<PresetName>.wav  (banks mapped from ZYG-prefix conventions)
set -euo pipefail

# --- resolve renderer -------------------------------------------------------
RENDER="${ZYG_RENDER:-}"
if [[ -z "$RENDER" ]]; then
  # look in familiar build locations
  for cand in \
    "../../../linux-serum-synth/build/zygzxg_render" \
    "../../linux-serum-synth/build/zygzxg_render" \
    "./build/zygzxg_render"; do
    if [[ -x "$cand" ]]; then RENDER="$(realpath "$cand")"; break; fi
  done
fi
if [[ -z "$RENDER" || ! -x "$RENDER" ]]; then
  echo "error: zygzxg_render not found. Build ZYG-ZXG (cmake -B build -DZYG_BUILD_TOOLS=ON) or set ZYG_RENDER." >&2
  exit 2
fi

# --- locate project root & sample root --------------------------------------
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="${SERUM_SAMPLE_ROOT:-$(realpath "$HERE/../../samples/strudel-root")}"
OUT_BANK="Serum"
DEST="$ROOT/$OUT_BANK"

# content_root for ZYG asset resolution (extra wavetables/samples). Empty is fine
# for self-contained presets; point at legally-owned Serum content if you have it.
CONTENT_ROOT="${ZYG_CONTENT_ROOT:-}"

# --- map ZYG preset-name prefixes to strudel banks ---------------------------
bank_of() {
  local name="$1"
  case "$name" in
    BV_BS_*|*bass*|*[Bb]ass*|*[Rr]eese*|*[Ww]obble*|*[Gg]rowl*|*[Ss]ub*) echo "bass";;
    BV_KEY_*|*[Pp]iano*|*[Kk]ey*) echo "key";;
    BV_LD_*|*[Ll]ead*|*[Ss]quare*|*[Ss]aw*) echo "lead";;
    BV_PD_*|*[Pp]ad*|*[Dd]rone*|*[Aa]mbient*) echo "pad";;
    BV_PL_*|*[Pp]luck*|*[Bb]ell*|*[Aa]rp*) echo "pluck";;
    BV_SY_*|*[Ss]ynth*|*[Mm]ovement*|*[Rr]azor*) echo "synth";;
    *) echo "other";;
  esac
}

mkdir -p "$DEST"

# --- find all SerumPreset files across the sample library --------------------
mapfile -d '' PRESETS < <(find "$ROOT" -iname '*.SerumPreset' -print0 2>/dev/null || true)
if (( ${#PRESETS[@]} == 0 )); then
  echo "no .SerumPreset files found under $ROOT — point SERUM_SAMPLE_ROOT at a pack dir (e.g. samples/BVKER-THREAT)." >&2
  exit 1
fi

echo "renderer:    $RENDER"
echo "source root: $ROOT"
echo "→ ${#PRESETS[@]} preset(s) → $DEST"
echo

ok=0; skip=0
for preset in "${PRESETS[@]}"; do
  base="$(basename "$preset" .SerumPreset)"
  bank="$(bank_of "$base")"
  out="$DEST/$bank/$base.wav"
  mkdir -p "$DEST/$bank"
  if [[ -f "$out" ]]; then mv -- "$out" "$out.old" 2>/dev/null || true; fi
  args=("$preset")
  if [[ -n "$CONTENT_ROOT" ]]; then args+=("$CONTENT_ROOT"); fi
  # render ~3s, hold note ~2s, midi 48 (C3), output = 32-bit float WAV
  args+=(--note 48 --vel 1.0 --seconds 3 --hold 2.0 --out "$out" --quiet)
  if "$RENDER" "${args[@]}"; then
    echo "  ok   $bank/$base.wav"
    ok=$((ok+1))
  else
    echo "  FAIL $bank/$base.wav (see diagnostics above)"
    rm -f "$out" 2>/dev/null || true
    skip=$((skip+1))
  fi
done

echo
echo "done: $ok rendered, $skip failed."
echo "sample count in $DEST:"
find "$DEST" -iname '*.wav' 2>/dev/null | wc -l