function a(n = "basic-lead") {
  const e = {
    "basic-lead": { osc: "sawtooth", lpf: 1500, attack: 0.01, release: 0.3 },
    "bass-pluck": { osc: "triangle", lpf: 800, attack: 1e-3, release: 0.1 },
    pad: { osc: "sine", lpf: 5e3, attack: 0.1, release: 1 }
  }, r = e[n] || e["basic-lead"];
  return (i) => i.s(r.osc).lpf(r.lpf).attack(r.attack).release(r.release).gain(0.7).onTrigger((c) => {
    const t = { type: "noteOn", voice: n, note: c.value, params: r };
    console.log("[Bridge]", t);
    const o = window.voiceBridge;
    o && o.readyState === WebSocket.OPEN && o.send(JSON.stringify(t));
  });
}
function l(n) {
  return (e) => e.lpf((1 - n) * 5e3 + 500);
}
function s(n) {
  return (e) => e.lpf(n);
}
function d(n) {
  return (e) => e.reso(n * 10);
}
function u(n) {
  return (e) => e.mult(n > 1 ? n : 1);
}
function f(n) {
  return (e) => e.add(n / 1200);
}
function g(n = "ws://localhost:9000") {
  if (typeof window > "u" || typeof WebSocket > "u")
    return console.warn("[VoiceBridge] WebSocket API unavailable; skipping bridge init"), null;
  let e = null;
  try {
    e = new WebSocket(n);
  } catch (r) {
    return console.warn("[VoiceBridge] Bridge start failed:", r), null;
  }
  return e.onopen = () => console.log("[VoiceBridge] Bridge ready"), e.onerror = (r) => console.error("[VoiceBridge] Bridge error:", r), window.voiceBridge = e, e;
}
export {
  f as detune,
  s as filterCutoff,
  d as filterRes,
  g as initVoiceBridge,
  u as unison,
  a as voice,
  l as wavetable
};
