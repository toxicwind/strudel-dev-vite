export function serum(voiceName = 'basic-lead') {
  const voices:any = {
    'basic-lead': { osc: 'sawtooth', lpf: 1500, attack: 0.01, release: 0.3 },
    'bass-pluck': { osc: 'triangle', lpf: 800, attack: 0.001, release: 0.1 },
    'pad': { osc: 'sine', lpf: 5000, attack: 0.1, release: 1.0 }
  }
  const voice = voices[voiceName] || voices['basic-lead']
  return (pat: any /* Core.Pattern */) => {
    return pat
      .s(voice.osc)
      .lpf(voice.lpf)
      .attack(voice.attack)
      .release(voice.release)
      .gain(0.7)
      .onTrigger((value:any) => {
        const msg = { type: 'noteOn', voice: voiceName, note: value.value, params: voice }
        console.log('[Bridge]', msg)
        const ws = (window as any).serumBridge as WebSocket
        if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(msg))
      })
  }
}
export function wavetable(pos: number) { return (pat:any)=> pat.lpf((1 - pos) * 5000 + 500) }
export function filterCutoff(freq: number) { return (pat:any)=> pat.lpf(freq) }
export function filterRes(q: number) { return (pat:any)=> pat.reso(q * 10) }
export function unison(voices: number) { return (pat:any)=> pat.mult(voices > 1 ? voices : 1) }
export function detune(cents: number) { return (pat:any)=> pat.add(cents / 1200) }
export function initSerumBridge(url = 'ws://localhost:9000') {
  if (typeof window === 'undefined' || typeof WebSocket === 'undefined') {
    console.warn('[Serum] WebSocket API unavailable; skipping bridge init')
    return null
  }
  let ws: WebSocket | null = null
  try {
    ws = new WebSocket(url)
  } catch (error) {
    console.warn('[Serum] Bridge start failed:', error)
    return null
  }
  ws.onopen = () => console.log('[Serum] Bridge ready')
  ws.onerror = (e) => console.error('[Serum] Bridge error:', e)
  ;(window as any).serumBridge = ws
  return ws
}
export default { serum, wavetable, filterCutoff, filterRes, unison, detune, initSerumBridge }
