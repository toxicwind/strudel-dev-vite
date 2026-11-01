/**
 * Server → strudel bank mapping (pure, testable).
 *
 * Mirrors the shell `bank_of()` in tools/render-serum-presets.sh so the
 * categorization rule is verified in TypeScript rather than an untested bash
 * `case`. A `.SerumPreset` base name maps to a strudel sample-bank by prefix
 * (BV_BS_*, BV_KEY_*, ...) with keyword fallbacks — the ZYG-ZXG server preset
 * naming convention from the BVKER pack.
 */

export type SerumBank = 'bass' | 'key' | 'lead' | 'pad' | 'pluck' | 'synth' | 'other'

/** Prefix→bank (checked first). */
const PREFIX_CASES: ReadonlyArray<[SerumBank, string]> = [
  ['bass', 'BV_BS_'],
  ['key', 'BV_KEY_'],
  ['lead', 'BV_LD_'],
  ['pad', 'BV_PD_'],
  ['pluck', 'BV_PL_'],
  ['synth', 'BV_SY_'],
]

/** Keyword→bank (checked after prefix; keyword wins on the first bank listed). */
const KEYWORD_BANKS: ReadonlyArray<[SerumBank, string]> = [
  ['bass', 'bass'],
  ['bass', 'reese'],
  ['bass', 'wobble'],
  ['bass', 'growl'],
  ['bass', 'sub'],
  ['key', 'piano'],
  ['key', 'key'],
  ['lead', 'lead'],
  ['lead', 'square'],
  ['lead', 'saw'],
  ['pad', 'pad'],
  ['pad', 'drone'],
  ['pad', 'ambient'],
  ['pluck', 'pluck'],
  ['pluck', 'bell'],
  ['pluck', 'arp'],
  ['synth', 'synth'],
  ['synth', 'movement'],
  ['synth', 'razor'],
]

/** Map a `.SerumPreset` base name to a strudel bank (prefix first, then keywords). */
export function bankOf(name: string): SerumBank {
  for (const [bank, prefix] of PREFIX_CASES) {
    if (name.startsWith(prefix)) return bank
  }
  const lower = name.toLowerCase()
  for (const [bank, word] of KEYWORD_BANKS) {
    if (lower.includes(word)) return bank
  }
  return 'other'
}

/** Strip `.SerumPreset`, map to bank, return the strudel-relative output path. */
export function renderTarget(presetPath: string, baseDir: string): { bank: SerumBank; base: string; out: string } {
  const base = presetPath.replace(/\.SerumPreset$/i, '').split('/').pop() ?? presetPath
  const bank = bankOf(base)
  return { bank, base, out: `${baseDir}/${bank}/${base}.wav` }
}