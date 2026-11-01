import { describe, it, expect } from 'bun:test'
import { bankOf, renderTarget } from './bank'
import type { SerumBank } from './bank'

describe('bankOf', () => {
  it.each([
    ['BV_BS_AcidDist', 'bass'],
    ['BV_BS_BigReese', 'bass'],
    ['BV_BS_Neuro_Style', 'bass'],
    ['BV_KEY_Crushed_Piano', 'key'],
    ['BV_KEY_ePiano', 'key'],
    ['BV_LD_Sad', 'lead'],
    ['BV_PD_Galaxy', 'pad'],
    ['BV_PL_BellChord', 'pluck'],
    ['BV_SY_Movement', 'synth'],
  ] as ReadonlyArray<[string, SerumBank]>)('maps prefix %s to %s', (name, bank) => {
    expect(bankOf(name)).toBe(bank)
  })

  it('falls back to keyword when no prefix matches', () => {
    expect(bankOf('growly_yah')).toBe('bass')
    expect(bankOf('clubPad_lead')).toBe('lead')
    expect(bankOf('cowbell')).toBe('pluck')
    expect(bankOf('wobble_gun')).toBe('bass')
  })

  it('prefix wins over keyword', () => {
    // BV_LD_ prefix beats the pluck keyword
    expect(bankOf('BV_LD_bell')).toBe('lead')
  })

  it('returns other for unmatched names', () => {
    expect(bankOf('completely_unrelated')).toBe('other')
    expect(bankOf('spinner')).toBe('other')
  })

  it('is case-insensitive for keywords', () => {
    expect(bankOf('REESE_BASS')).toBe('bass')
    expect(bankOf('UK-Growl')).toBe('bass')
  })
})

describe('renderTarget', () => {
  it('strips .SerumPreset, maps bank, builds baseDir/bank/base.wav', () => {
    const t = renderTarget('/packs/BVKER/BV_BS_AcidDist.SerumPreset', '/root')
    expect(t).toEqual({ bank: 'bass', base: 'BV_BS_AcidDist', out: '/root/bass/BV_BS_AcidDist.wav' })
  })

  it('handles nested path + odd case extension', () => {
    const t = renderTarget('./deep/BV_PL_Kalimba.serumpreset', 'bank')
    expect(t.base).toBe('BV_PL_Kalimba')
    expect(t.out).toBe('bank/pluck/BV_PL_Kalimba.wav')
  })

  it('falls back to the raw path when there is no basename segment', () => {
    const t = renderTarget('BV_SY_Razor.SerumPreset', 'root')
    expect(t.base).toBe('BV_SY_Razor')
    expect(t.bank).toBe('synth')
  })
})