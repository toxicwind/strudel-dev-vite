import { map as rn } from "nanostores";
if (typeof DelayNode < "u") {
  class e extends DelayNode {
    constructor(n, o, a, c) {
      return super(n), o = Math.abs(o), this.delayTime.value = a, this.feedbackGain = n.createGain(), this.feedbackGain.gain.value = Math.min(Math.abs(c), 0.995), this.feedback = this.feedbackGain.gain, this.delayGain = n.createGain(), this.delayGain.gain.value = o, this.connect(this.feedbackGain), this.connect(this.delayGain), this.feedbackGain.connect(this), this.connect = (s) => this.delayGain.connect(s), this;
    }
    start(n) {
      this.delayGain.gain.setValueAtTime(this.delayGain.gain.value, n + this.delayTime.value);
    }
  }
  BaseAudioContext.prototype.createFeedbackDelay = function(t, n, o) {
    return new e(this, t, n, o);
  };
}
let ze;
const pn = () => (ze = new AudioContext(), ze), Uo = (e) => (ze = e, ze), z = () => ze || pn();
function jo() {
  return z().currentTime;
}
let wt = (e) => console.log(e);
function ct(e, t = "superdough") {
  process.env.NODE_ENV === "development" && console.error(e), j(`[${t}] error: ${e.message}`);
}
const j = (...e) => wt(...e), Bo = (e) => {
  wt = e;
};
let $e = {};
function Ft(e, t) {
  const n = z();
  if ($e[e])
    return $e[e];
  const o = 2 * n.sampleRate, a = n.createBuffer(1, o, n.sampleRate), c = a.getChannelData(0);
  let s = 0, d, l, i, p, r, h, u;
  d = l = i = p = r = h = u = 0;
  for (let m = 0; m < o; m++)
    if (e === "white")
      c[m] = Math.random() * 2 - 1;
    else if (e === "brown") {
      let G = Math.random() * 2 - 1;
      c[m] = (s + 0.02 * G) / 1.02, s = c[m];
    } else if (e === "pink") {
      let G = Math.random() * 2 - 1;
      d = 0.99886 * d + G * 0.0555179, l = 0.99332 * l + G * 0.0750759, i = 0.969 * i + G * 0.153852, p = 0.8665 * p + G * 0.3104856, r = 0.55 * r + G * 0.5329522, h = -0.7616 * h - G * 0.016898, c[m] = d + l + i + p + r + h + u + G * 0.5362, c[m] *= 0.11, u = G * 0.115926;
    } else if (e === "crackle") {
      const G = t * 0.01;
      Math.random() < G ? c[m] = Math.random() * 2 - 1 : c[m] = 0;
    }
  return e !== "crackle" && ($e[e] = a), a;
}
function at(e = "white", t, n = 0.02) {
  const a = z().createBufferSource();
  return a.buffer = Ft(e, n), a.loop = !0, a.start(t), {
    node: a,
    stop: (c) => a.stop(c)
  };
}
function un(e, t, n) {
  const o = at("pink", n), a = zn(e, o.node, t);
  return ue(o.node, () => {
    Y(o.node);
  }), {
    node: a.node,
    stop: (c) => o?.stop(c),
    teardown: a.teardown
  };
}
const st = /* @__PURE__ */ new Map(), ut = Symbol("nodePoolKey"), hn = (e) => !!e[ut], Ct = (e) => e.context?.currentTime ?? 0, mn = (e) => {
  const t = /* @__PURE__ */ new Set();
  e.parameters?.forEach((a) => t.add(a));
  const n = /* @__PURE__ */ new Set();
  let o = e;
  for (; o !== Object.prototype; ) {
    for (const a of Object.getOwnPropertyNames(o)) {
      if (n.has(a)) continue;
      n.add(a);
      const c = e[a];
      c instanceof AudioParam && t.add(c);
    }
    o = Object.getPrototypeOf(o);
  }
  return t;
}, ht = (e) => {
  if (e.disconnect(), e instanceof AudioScheduledSourceNode)
    return;
  const t = e[ut];
  if (t == null) return;
  const n = Ct(e);
  mn(e).forEach((a) => a.cancelScheduledValues(n));
  const o = st.get(t) ?? [];
  o.push(new WeakRef(e)), st.set(t, o);
}, Gn = (e) => {
  if (!(e instanceof AudioWorkletNode)) return !0;
  const t = Ct(e), n = e?.parameters?.get("end").value ?? 0;
  return t < n + 0.45;
}, we = (e, t) => {
  const n = st.get(e) ?? [];
  let o, a = !1;
  for (; n.length; )
    if (o = n.pop()?.deref(), o != null && Gn(o)) {
      a = !0;
      break;
    }
  return a || (o = t()), o[ut] = e, o;
}, Xn = (e) => {
  if (typeof e != "string")
    return [];
  const [t, n = "", o] = e.match(/^([a-gA-G])([#bsf]*)(-?[0-9]*)$/)?.slice(1) || [];
  return t ? [t, n, o ? Number(o) : void 0] : [];
}, yn = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 }, bn = { "#": 1, b: -1, s: 1, f: -1 }, Zn = (e) => e?.split("").reduce((t, n) => t + bn[n], 0) || 0, Be = (e, t = 3) => {
  const [n, o, a = t] = Xn(e);
  if (!n)
    throw new Error('not a note: "' + e + '"');
  const c = yn[n.toLowerCase()], s = Zn(o);
  return (Number(a) + 1) * 12 + c + s;
}, kt = (e) => Math.pow(2, (e - 69) / 12) * 440, se = (e, t, n) => Math.min(Math.max(e, t), n), Wn = (e) => 12 * Math.log(e / 440) / Math.LN2 + 69, fn = (e, t) => {
  if (typeof e != "object")
    throw new Error("valueToMidi: expected object value");
  let { freq: n, note: o } = e;
  return typeof n == "number" ? Wn(n) : typeof o == "string" ? Be(o) : typeof o == "number" ? o : t;
};
function re(e, t = 0, n) {
  return isNaN(Number(e)) ? (!n && j(`"${e}" is not a number, falling back to ${t}`, "warning"), t) : e;
}
const Pt = (e, t) => (e % t + t) % t, Vt = (e, t) => Pt(Math.round(re(e, 0)), t);
function Lt(e, t) {
  return e / t;
}
function It(e, t) {
  const { s: n, n: o = 0 } = e;
  let a = fn(e, 36), c = a - 36, s, d = 0;
  if (Array.isArray(t))
    d = Vt(o, t.length), s = t[d];
  else {
    const i = (r) => Be(r) - a, p = Object.keys(t).filter((r) => !r.startsWith("_")).reduce(
      (r, h, u) => !r || Math.abs(i(h)) < Math.abs(i(r)) ? h : r,
      null
    );
    c = -i(p), d = Vt(o, t[p].length), s = t[p][d];
  }
  const l = `${n}:${d}`;
  return { transpose: c, url: s, index: d, midi: a, label: l };
}
const et = (e, t) => Object.fromEntries(Object.entries(t).map(([n, o]) => [n, e[o]])), Jt = (e) => {
  try {
    return new URL(".", new URL(e)).href.replace(/\/$/, "");
  } catch {
    return e.split("/").slice(0, -1).join("/");
  }
}, Ut = ["pink", "white", "brown", "crackle"];
function T(e) {
  const t = z().createGain();
  return t.gain.value = e, t;
}
function Ue(e, t, n) {
  const o = T(n);
  return e.connect(o), o.connect(t), o;
}
const xt = (e, t, n, o) => o - n === 0 ? 0 : (t - e) / (o - n);
function q(e, t, n, o) {
  const a = new AudioWorkletNode(e, t, o);
  return Object.entries(n).forEach(([c, s]) => {
    s !== void 0 && (a.parameters.get(c).value = s);
  }), a;
}
const _ = (e, t, n, o, a, c, s, d, l, i = "exponential") => {
  t = re(t), n = re(n), o = re(o), a = re(a);
  const p = i === "exponential" ? "exponentialRampToValueAtTime" : "linearRampToValueAtTime";
  i === "exponential" && (c = c === 0 ? 1e-3 : c, s = s === 0 ? 1e-3 : s);
  const r = s - c, h = c + o * r, u = l - d, m = (G) => {
    let b;
    return t > G ? b = G * xt(c, s, 0, t) + c : b = (G - t) * xt(s, h, 0, n) + s, i === "exponential" && (b = b || 1e-3), b;
  };
  e.setValueAtTime(c, d), t > u ? e[p](m(u), l) : t + n > u ? (e[p](m(t), d + t), e[p](m(u), l)) : (e[p](m(t), d + t), e[p](m(t + n), d + t + n), e.setValueAtTime(h, l)), e[p](c, l + a);
};
function Mn(e) {
  return typeof e == "number" ? e % 5 : { tri: 0, triangle: 0, sine: 1, ramp: 2, saw: 3, square: 4 }[e] ?? 0;
}
function Vn(e, t = {}) {
  return q(e, "envelope-processor", t);
}
function Fe(e, t = {}) {
  const {
    shape: n = 0,
    begin: o = 0,
    end: a = 0,
    time: c,
    depth: s = 1,
    dcoffset: d = -0.5,
    frequency: l = 1,
    skew: i = 0.5,
    phaseoffset: p = 0,
    curve: r = 1,
    min: h,
    max: u,
    ...m
  } = t, G = {
    begin: o,
    end: a,
    time: c ?? o,
    depth: s,
    dcoffset: d,
    frequency: l,
    skew: i,
    phaseoffset: p,
    curve: r,
    shape: Mn(n),
    min: h ?? d * s,
    max: u ?? d * s + s,
    ...m
  };
  return q(e, "lfo-processor", G);
}
function Ln(e, t, n, o, a, c) {
  const s = we("compressor", () => new DynamicsCompressorNode(e, {}));
  return Object.entries({
    threshold: t ?? -3,
    ratio: n ?? 10,
    knee: o ?? 10,
    attack: a ?? 5e-3,
    release: c ?? 0.05
  }).forEach(([l, i]) => {
    s[l].value = i;
  }), s;
}
const $ = (e, t = "linear", n) => {
  const [s, d, l, i] = e;
  if (s == null && d == null && l == null && i == null)
    return n ?? [1e-3, 1e-3, 1, 0.01];
  const p = l ?? (s != null && d == null || s == null && d == null ? 1 : 1e-3);
  return [Math.max(s ?? 0, 1e-3), Math.max(d ?? 0, 1e-3), Math.min(p, 1), Math.max(i ?? 0, 0.01)];
};
function jt(e, t, n, o, a) {
  let { defaultDepth: c = 1, depth: s, dcoffset: d, ...l } = a;
  s == null && (s = Object.values(l).some((r) => r != null) ? c : 0);
  let i;
  return s && (i = Fe(e, {
    begin: n,
    end: o,
    depth: s,
    dcoffset: d,
    ...l
  }), i.connect(t)), i;
}
function zt(e, t, n, o, a, c) {
  let { amount: s, offset: d, defaultAmount: l = 1, curve: i = "linear", values: p, holdEnd: r, defaultValues: h } = a;
  s == null && (s = p.some((y) => y != null) ? l : 0);
  const u = d ?? 0, m = s + u;
  if (Math.abs(m - u)) {
    const [f, y, M, Z] = $(p, i, h);
    _(t, f, y, M, Z, u, m, n, r, i);
  }
  return jt(e, t, n, o, c);
}
function xn(e, t, n, o, a, c) {
  let {
    frequency: s,
    anchor: d,
    env: l,
    type: i,
    model: p,
    q: r = 1,
    drive: h = 0.69,
    depth: u,
    depthfrequency: m,
    dcoffset: G = -0.5,
    skew: b,
    shape: f,
    rate: y,
    sync: M
  } = o, Z, W;
  p === "ladder" ? (W = q(e, "ladder-processor", { frequency: s, q: r, drive: h }), Z = W.parameters.get("frequency")) : (W = we("filter", () => e.createBiquadFilter()), W.type = i, Object.entries({ Q: r, frequency: s }).forEach(([O, w]) => {
    W[O].value = w;
  }), Z = W.frequency);
  const S = [o.attack, o.decay, o.sustain, o.release], [Q, F, N, g] = $(S, "exponential", [5e-3, 0.14, 0, 0.1]);
  if ([...S, l].some((k) => k !== void 0)) {
    l = re(l, 1, !0), d = re(d, 0, !0);
    const k = Math.abs(l), O = k * d;
    let w = se(2 ** -O * s, 0, 2e4), E = se(2 ** (k - O) * s, 0, 2e4);
    l < 0 && ([w, E] = [E, w]), _(Z, Q, F, N, g, w, E, t, n, "exponential");
  }
  M != null && (y = a * M);
  const K = [u, m, b, f, y].some((k) => k !== void 0);
  let I;
  if (K) {
    u = u ?? 1;
    const k = c / a, w = {
      depth: m ?? (u ?? 1) * s,
      dcoffset: G,
      skew: b,
      shape: f,
      frequency: y ?? a,
      min: -s + 30,
      max: 2e4 - s,
      time: k,
      curve: 1
    };
    I = jt(e, Z, t, n, w);
  }
  return { filter: W, lfo: I };
}
let Rt = (e) => e < 0.5 ? 1 : 1 - (e - 0.5) / 0.5;
function zn(e, t, n = 0) {
  const o = z();
  if (!n)
    return e;
  let a = o.createGain(), c = o.createGain();
  e.connect(a), t.connect(c), a.gain.value = Rt(n), c.gain.value = Rt(1 - n);
  let s = o.createGain();
  return a.connect(s), c.connect(s), {
    node: s,
    teardown: () => {
      Y(a), Y(c), e.disconnect(a), t.disconnect(c);
    }
  };
}
let Rn = ["linear", "exponential"];
function He(e, t, n, o) {
  if ((t.pattack ?? t.pdecay ?? t.psustain ?? t.prelease ?? t.penv) === void 0)
    return;
  const c = re(t.penv, 1, !0), s = Rn[t.pcurve ?? 0];
  let [d, l, i, p] = $(
    [t.pattack, t.pdecay, t.psustain, t.prelease],
    s,
    [0.2, 1e-3, 1, 1e-3]
  ), r = t.panchor ?? i;
  const h = c * 100, u = 0 - h * r, m = h - h * r;
  _(e, d, l, i, p, u, m, n, o, s);
}
function Te(e, t, n) {
  const { vibmod: o = 0.5, vib: a } = t;
  let c;
  if (a > 0) {
    c = z().createOscillator(), c.frequency.value = a;
    const s = z().createGain();
    return s.gain.value = o * 100, c.connect(s), s.connect(e), ue(c, () => {
      Y(s), Y(c);
    }), c.start(n), { stop: (d) => c.stop(d), nodes: { vib: [c], vib_gain: [s] } };
  }
}
function Qo(e, t, n = z()) {
  const o = n.currentTime;
  pe(n, e, o, t);
}
function pe(e, t, n, o) {
  const a = new ConstantSourceNode(e), c = T(0);
  return c.connect(e.destination), a.connect(c), ue(a, () => {
    Y(c), Y(a), t();
  }), a.start(n), a.stop(o), a;
}
const Yn = (e, t = "sine") => {
  const n = z();
  let o;
  return Ut.includes(t) ? (o = n.createBufferSource(), o.buffer = Ft(t, 2), o.loop = !0) : (o = n.createOscillator(), o.type = t, o.frequency.value = e), o.start(), o;
}, Sn = (e, t, n = "sine") => {
  const a = e.value * t;
  return { osc: Yn(a, n), freq: a };
};
function je(e, t, n) {
  const o = z(), a = [], c = {}, s = {};
  for (let d = 1; d <= 8; d++)
    for (let l = 0; l <= 8; l++) {
      let i;
      d === l + 1 ? i = `fmi${d === 1 ? "" : d}` : i = `fmi${d}${l}`;
      const p = t[i];
      if (!p) continue;
      let r = [];
      for (let [h, u] of [
        [!0, d],
        // source
        [!1, l]
        // target
      ]) {
        if (u === 0) {
          r.push(e);
          continue;
        }
        if (!c[u]) {
          const W = u === 1 ? "" : u, { osc: S, freq: Q } = Sn(e, t[`fmh${W}`] ?? 1, t[`fmwave${W}`] ?? "sine");
          a.push(S);
          const F = [S], N = ["attack", "decay", "sustain", "release"].map((C) => t[`fm${C}${W}`]);
          let g = S;
          if (N.some((C) => C !== void 0)) {
            const C = o.createGain(), [K, I, k, O] = $(N), w = n + t.duration, E = t[`fmenv${W}`] ?? "exp";
            _(
              C.gain,
              K,
              I,
              k,
              O,
              0,
              1,
              n,
              w,
              E === "exp" ? "exponential" : "linear"
            ), F.push(C), g = S.connect(C);
          }
          c[u] = { input: S.frequency, output: g, freq: Q, osc: S, toCleanup: F }, s[`fm_${u}`] = [S];
        }
        const { input: m, output: G, freq: b, osc: f, toCleanup: y } = c[u], M = T(p), Z = T(b);
        r.push(h ? G.connect(M).connect(Z) : m), kn(f, [...y, M, Z]), s[`fm_${u}_gain`] = [M];
      }
      if (!r[1]) {
        j(
          `[superdough] control ${i} failed to connect FM ${d} to target ${l} due to missing frequency parameter (likely because fm${l} is noise)`,
          "warning"
        );
        continue;
      }
      r[0].connect(r[1]);
    }
  return {
    nodes: s,
    stop: (d) => a.forEach((l) => l?.stop(d))
  };
}
const Bt = (e) => e / (1 + e), Kn = (e, t) => (e % t + t) % t, gn = (e, t) => (1 + t) * e / (1 + t * Math.abs(e)), Ve = (e, t) => Math.tanh(e * (1 + t)), Nn = (e, t) => se((1 + t) * e, -1, 1), Qt = (e, t) => {
  let n = (1 + 0.5 * t) * e;
  const o = Kn(n + 1, 4);
  return 1 - Math.abs(o - 2);
}, Hn = (e, t) => Math.sin(Math.PI / 2 * Qt(e, t)), Tn = (e, t) => {
  const n = Bt(Math.log1p(t)), o = (e - n / 3 * e * e * e) / (1 - n / 3);
  return Ve(o, t);
}, vt = (e, t, n = !1) => {
  const o = 1 + 2 * t, c = 0.07 * Bt(Math.log1p(t)), s = Ve(e + c, 2 * t), d = Ve(n ? c : -e + c, 2 * t), l = s - d, i = 1 / Math.cosh(o * c), p = i * i, r = Math.max(1e-8, (n ? 1 : 2) * o * p);
  return Ve(l / r, t);
}, wn = (e, t) => vt(e, t, !0), Fn = (e, t) => {
  const n = 10 * Math.log1p(t);
  let o = 1, a = e, c, s = 0;
  for (let d = 1; d < 64; d++) {
    if (d < 2) {
      s += d == 0 ? o : a;
      continue;
    }
    c = 2 * e * o - a, a = o, o = c, d % 2 === 0 && (s += Math.min(1.3 * n / d, 2) * c);
  }
  return Ve(s, n / 20);
}, Et = {
  scurve: gn,
  soft: Ve,
  hard: Nn,
  cubic: Tn,
  diode: vt,
  asym: wn,
  fold: Qt,
  sinefold: Hn,
  chebyshev: Fn
}, ge = Object.freeze(Object.keys(Et)), vo = (e) => {
  let t = e;
  typeof e == "string" && (t = ge.indexOf(e), t === -1 && (j(`[superdough] Could not find waveshaping algorithm ${e}.
        Available options are ${ge.join(", ")}.
        Defaulting to ${ge[0]}.`), t = 0));
  const n = ge[t % ge.length];
  return Et[n];
}, Cn = (e, t, n) => q(z(), "distort-processor", { distort: e, postgain: t }, { processorOptions: { algorithm: n } }), Xe = (e, t = 36) => {
  let { note: n, freq: o, octave: a = 0 } = e;
  return n = n || t, typeof n == "string" && (n = Be(n)), !o && typeof n == "number" && (o = kt(n)), o *= Math.pow(2, a), Number(o);
}, ue = (e, t) => {
  const n = t;
  e.onended = function() {
    n && n(), this.onended = null;
  };
}, Y = (e) => {
  if (e != null) {
    if (!(e instanceof AudioNode))
      throw new Error("releaseAudioNode can only release an AudioNode");
    if (e.disconnect(), e instanceof AudioScheduledSourceNode) {
      process.env.NODE_ENV === "development" && e.onended && e.onended.name !== "cleanup" && j(
        "[superdough] Deprecation warning: it seems your code path is setting 'node.onended = callback' instead of using the onceEnded helper"
      );
      try {
        e.stop();
      } catch {
        e.start(e.context.currentTime + 5), e.stop();
      }
    }
    e instanceof AudioWorkletNode && e.parameters.get("end")?.setValueAtTime(0, 0);
  }
}, kn = (e, t) => {
  ue(e, () => t.forEach((n) => Y(n)));
};
var mt = {};
mt.generateReverb = function(e, t) {
  for (var n = e.audioContext || new AudioContext(), o = n.sampleRate, a = e.numChannels || 2, c = e.decayTime * 1.5, s = Math.round(e.decayTime * o), d = Math.round(c * o), l = Math.round((e.fadeInTime || 0) * o), i = Math.pow(1 / 1e3, 1 / s), p = n.createBuffer(a, d, o), r = 0; r < a; r++) {
    for (var h = p.getChannelData(r), u = 0; u < d; u++)
      h[u] = Jn() * Math.pow(i, u);
    for (var u = 0; u < l; u++)
      h[u] *= u / l;
  }
  Pn(p, e.lpFreqStart || 0, e.lpFreqEnd || 0, e.decayTime, t);
};
mt.generateGraph = function(e, t, n, o, a) {
  var c = document.createElement("canvas");
  c.width = t, c.height = n;
  var s = c.getContext("2d");
  s.fillStyle = "#000", s.fillRect(0, 0, c.width, c.height), s.fillStyle = "#fff";
  for (var d = t / e.length, l = n / (a - o), i = 0; i < e.length; i++)
    s.fillRect(i * d, n - (e[i] - o) * l, 1, 1);
  return c;
};
var Pn = function(e, t, n, o, a) {
  if (t == 0) {
    a(e);
    return;
  }
  var c = In(e), s = new OfflineAudioContext(e.numberOfChannels, c[0].length, e.sampleRate), d = s.createBufferSource();
  d.buffer = e;
  var l = s.createBiquadFilter();
  t = Math.min(t, e.sampleRate / 2), n = Math.min(n, e.sampleRate / 2), l.type = "lowpass", l.Q.value = 1e-4, l.frequency.setValueAtTime(t, 0), l.frequency.linearRampToValueAtTime(n, o), d.connect(l), l.connect(s.destination), d.start(), s.oncomplete = function(i) {
    a(i.renderedBuffer), Y(l), Y(d);
  }, s.startRendering(), window.filterNode = l;
}, In = function(e) {
  for (var t = [], n = 0; n < e.numberOfChannels; n++)
    t[n] = e.getChannelData(n);
  return t;
}, Jn = function() {
  return Math.random() * 2 - 1;
};
typeof AudioContext < "u" && (BaseAudioContext.prototype.adjustLength = function(e, t, n = 1, o = 0) {
  const a = Math.floor(se(o, 0, 1) * t.length), c = t.sampleRate * e, s = this.createBuffer(t.numberOfChannels, t.length, t.sampleRate);
  for (let d = 0; d < t.numberOfChannels; d++) {
    let l = t.getChannelData(d), i = s.getChannelData(d);
    for (let p = 0; p < c; p++) {
      let r = (a + p * Math.abs(n)) % l.length;
      n < 1 && (r = r * -1), i[p] = l.at(r) || 0;
    }
  }
  return s;
}, BaseAudioContext.prototype.createReverb = function(e, t, n, o, a, c, s) {
  const d = this.createConvolver();
  return d.generate = (l = 2, i = 0.1, p = 15e3, r = 1e3, h, u, m) => {
    d.duration = l, d.fade = i, d.lp = p, d.dim = r, d.ir = h, d.irspeed = u, d.irbegin = m, h ? d.buffer = this.adjustLength(l, h, u, m) : mt.generateReverb(
      {
        audioContext: this,
        numChannels: 2,
        decayTime: l,
        fadeInTime: i,
        lpFreqStart: p,
        lpFreqEnd: r
      },
      (G) => {
        d.buffer = G;
      }
    );
  }, d.generate(e, t, n, o, a, c, s), d;
});
var Yt = {
  a: { freqs: [660, 1120, 2750, 3e3, 3350], gains: [1, 0.5012, 0.0708, 0.0631, 0.0126], qs: [80, 90, 120, 130, 140] },
  e: { freqs: [440, 1800, 2700, 3e3, 3300], gains: [1, 0.1995, 0.1259, 0.1, 0.1], qs: [70, 80, 100, 120, 120] },
  i: { freqs: [270, 1850, 2900, 3350, 3590], gains: [1, 0.0631, 0.0631, 0.0158, 0.0158], qs: [40, 90, 100, 120, 120] },
  o: { freqs: [430, 820, 2700, 3e3, 3300], gains: [1, 0.3162, 0.0501, 0.0794, 0.01995], qs: [40, 80, 100, 120, 120] },
  u: { freqs: [370, 630, 2750, 3e3, 3400], gains: [1, 0.1, 0.0708, 0.0316, 0.01995], qs: [40, 60, 100, 120, 120] },
  ae: { freqs: [650, 1515, 2400, 3e3, 3350], gains: [1, 0.5, 0.1008, 0.0631, 0.0126], qs: [80, 90, 120, 130, 140] },
  aa: { freqs: [560, 900, 2570, 3e3, 3300], gains: [1, 0.5, 0.0708, 0.0631, 0.0126], qs: [80, 90, 120, 130, 140] },
  oe: { freqs: [500, 1430, 2300, 3e3, 3300], gains: [1, 0.2, 0.0708, 0.0316, 0.01995], qs: [40, 60, 100, 120, 120] },
  ue: { freqs: [250, 1750, 2150, 3200, 3300], gains: [1, 0.1, 0.0708, 0.0316, 0.01995], qs: [40, 60, 100, 120, 120] },
  y: { freqs: [400, 1460, 2400, 3e3, 3300], gains: [1, 0.2, 0.0708, 0.0316, 0.02995], qs: [40, 60, 100, 120, 120] },
  uh: { freqs: [600, 1250, 2100, 3100, 3500], gains: [1, 0.3, 0.0608, 0.0316, 0.01995], qs: [40, 70, 100, 120, 130] },
  un: { freqs: [500, 1240, 2280, 3e3, 3500], gains: [1, 0.1, 0.1708, 0.0216, 0.02995], qs: [40, 60, 100, 120, 120] },
  en: { freqs: [600, 1480, 2450, 3200, 3300], gains: [1, 0.15, 0.0708, 0.0316, 0.02995], qs: [40, 60, 100, 120, 120] },
  an: { freqs: [700, 1050, 2500, 3e3, 3300], gains: [1, 0.1, 0.0708, 0.0316, 0.02995], qs: [40, 60, 100, 120, 120] },
  on: { freqs: [500, 1080, 2350, 3e3, 3300], gains: [1, 0.1, 0.0708, 0.0316, 0.02995], qs: [40, 60, 100, 120, 120] },
  get æ() {
    return this.ae;
  },
  get ø() {
    return this.oe;
  },
  get ɑ() {
    return this.aa;
  },
  get å() {
    return this.aa;
  },
  get ö() {
    return this.oe;
  },
  get ü() {
    return this.ue;
  },
  get ı() {
    return this.y;
  }
};
if (typeof GainNode < "u") {
  class e extends GainNode {
    constructor(n, o) {
      if (super(n), !Yt[o])
        throw new Error("vowel: unknown vowel " + o);
      const { gains: a, qs: c, freqs: s } = Yt[o];
      this.makeupGain = n.createGain(), this.filters = [], this.gains = [];
      for (let d = 0; d < 5; d++) {
        const l = n.createGain();
        l.gain.value = a[d];
        const i = n.createBiquadFilter();
        i.type = "bandpass", i.Q.value = c[d], i.frequency.value = s[d], super.connect(i), i.connect(l), this.filters.push(i), l.connect(this.makeupGain), this.gains.push(l);
      }
      return this.makeupGain.gain.value = 8, this;
    }
    connect(n) {
      this.makeupGain.connect(n);
    }
    disconnect() {
      Y(this.makeupGain), this.filters.forEach(Y), this.gains.forEach(Y), super.disconnect(), this.makeupGain = null, this.filters = null, this.gains = null;
    }
  }
  BaseAudioContext.prototype.createVowelFilter = function(t) {
    return new e(this, t);
  };
}
const Un = "data:text/javascript;base64,dmFyIF89ZnVuY3Rpb24oUil7InVzZSBzdHJpY3QiO3ZhciBXZT1PYmplY3QuZGVmaW5lUHJvcGVydHk7dmFyIFllPShSLFcsWCk9PlcgaW4gUj9XZShSLFcse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOlh9KTpSW1ddPVg7dmFyIER0PShSLFcsWCk9PlllKFIsdHlwZW9mIFchPSJzeW1ib2wiP1crIiI6VyxYKTtjbGFzcyBYIGV4dGVuZHMgQXVkaW9Xb3JrbGV0UHJvY2Vzc29ye2NvbnN0cnVjdG9yKHQpe3N1cGVyKHQpLHRoaXMuc3RhcnRlZD0hMSx0aGlzLm5iSW5wdXRzPXQubnVtYmVyT2ZJbnB1dHMsdGhpcy5uYk91dHB1dHM9dC5udW1iZXJPZk91dHB1dHMsdGhpcy5ibG9ja1NpemU9dC5wcm9jZXNzb3JPcHRpb25zLmJsb2NrU2l6ZSx0aGlzLmhvcFNpemU9MTI4LHRoaXMubmJPdmVybGFwcz10aGlzLmJsb2NrU2l6ZS90aGlzLmhvcFNpemUsdGhpcy5pbnB1dEJ1ZmZlcnM9bmV3IEFycmF5KHRoaXMubmJJbnB1dHMpLHRoaXMuaW5wdXRCdWZmZXJzSGVhZD1uZXcgQXJyYXkodGhpcy5uYklucHV0cyksdGhpcy5pbnB1dEJ1ZmZlcnNUb1NlbmQ9bmV3IEFycmF5KHRoaXMubmJJbnB1dHMpO2ZvcihsZXQgcz0wO3M8dGhpcy5uYklucHV0cztzKyspdGhpcy5hbGxvY2F0ZUlucHV0Q2hhbm5lbHMocywxKTt0aGlzLm91dHB1dEJ1ZmZlcnM9bmV3IEFycmF5KHRoaXMubmJPdXRwdXRzKSx0aGlzLm91dHB1dEJ1ZmZlcnNUb1JldHJpZXZlPW5ldyBBcnJheSh0aGlzLm5iT3V0cHV0cyk7Zm9yKGxldCBzPTA7czx0aGlzLm5iT3V0cHV0cztzKyspdGhpcy5hbGxvY2F0ZU91dHB1dENoYW5uZWxzKHMsMSl9cmVhbGxvY2F0ZUNoYW5uZWxzSWZOZWVkZWQodCxzKXtmb3IobGV0IGU9MDtlPHRoaXMubmJJbnB1dHM7ZSsrKXtsZXQgaT10W2VdLmxlbmd0aDtpIT10aGlzLmlucHV0QnVmZmVyc1tlXS5sZW5ndGgmJnRoaXMuYWxsb2NhdGVJbnB1dENoYW5uZWxzKGUsaSl9Zm9yKGxldCBlPTA7ZTx0aGlzLm5iT3V0cHV0cztlKyspe2xldCBpPXNbZV0ubGVuZ3RoO2khPXRoaXMub3V0cHV0QnVmZmVyc1tlXS5sZW5ndGgmJnRoaXMuYWxsb2NhdGVPdXRwdXRDaGFubmVscyhlLGkpfX1hbGxvY2F0ZUlucHV0Q2hhbm5lbHModCxzKXt0aGlzLmlucHV0QnVmZmVyc1t0XT1uZXcgQXJyYXkocyk7Zm9yKGxldCBlPTA7ZTxzO2UrKyl0aGlzLmlucHV0QnVmZmVyc1t0XVtlXT1uZXcgRmxvYXQzMkFycmF5KHRoaXMuYmxvY2tTaXplKzEyOCksdGhpcy5pbnB1dEJ1ZmZlcnNbdF1bZV0uZmlsbCgwKTt0aGlzLmlucHV0QnVmZmVyc0hlYWRbdF09bmV3IEFycmF5KHMpLHRoaXMuaW5wdXRCdWZmZXJzVG9TZW5kW3RdPW5ldyBBcnJheShzKTtmb3IobGV0IGU9MDtlPHM7ZSsrKXRoaXMuaW5wdXRCdWZmZXJzSGVhZFt0XVtlXT10aGlzLmlucHV0QnVmZmVyc1t0XVtlXS5zdWJhcnJheSgwLHRoaXMuYmxvY2tTaXplKSx0aGlzLmlucHV0QnVmZmVyc1RvU2VuZFt0XVtlXT1uZXcgRmxvYXQzMkFycmF5KHRoaXMuYmxvY2tTaXplKX1hbGxvY2F0ZU91dHB1dENoYW5uZWxzKHQscyl7dGhpcy5vdXRwdXRCdWZmZXJzW3RdPW5ldyBBcnJheShzKTtmb3IobGV0IGU9MDtlPHM7ZSsrKXRoaXMub3V0cHV0QnVmZmVyc1t0XVtlXT1uZXcgRmxvYXQzMkFycmF5KHRoaXMuYmxvY2tTaXplKSx0aGlzLm91dHB1dEJ1ZmZlcnNbdF1bZV0uZmlsbCgwKTt0aGlzLm91dHB1dEJ1ZmZlcnNUb1JldHJpZXZlW3RdPW5ldyBBcnJheShzKTtmb3IobGV0IGU9MDtlPHM7ZSsrKXRoaXMub3V0cHV0QnVmZmVyc1RvUmV0cmlldmVbdF1bZV09bmV3IEZsb2F0MzJBcnJheSh0aGlzLmJsb2NrU2l6ZSksdGhpcy5vdXRwdXRCdWZmZXJzVG9SZXRyaWV2ZVt0XVtlXS5maWxsKDApfXJlYWRJbnB1dHModCl7aWYodFswXS5sZW5ndGgmJnRbMF1bMF0ubGVuZ3RoPT0wKXtmb3IobGV0IHM9MDtzPHRoaXMubmJJbnB1dHM7cysrKWZvcihsZXQgZT0wO2U8dGhpcy5pbnB1dEJ1ZmZlcnNbc10ubGVuZ3RoO2UrKyl0aGlzLmlucHV0QnVmZmVyc1tzXVtlXS5maWxsKDAsdGhpcy5ibG9ja1NpemUpO3JldHVybn1mb3IobGV0IHM9MDtzPHRoaXMubmJJbnB1dHM7cysrKWZvcihsZXQgZT0wO2U8dGhpcy5pbnB1dEJ1ZmZlcnNbc10ubGVuZ3RoO2UrKyl7bGV0IGk9dFtzXVtlXTt0aGlzLmlucHV0QnVmZmVyc1tzXVtlXS5zZXQoaSx0aGlzLmJsb2NrU2l6ZSl9fXdyaXRlT3V0cHV0cyh0KXtmb3IobGV0IHM9MDtzPHRoaXMubmJJbnB1dHM7cysrKWZvcihsZXQgZT0wO2U8dGhpcy5pbnB1dEJ1ZmZlcnNbc10ubGVuZ3RoO2UrKyl7bGV0IGk9dGhpcy5vdXRwdXRCdWZmZXJzW3NdW2VdLnN1YmFycmF5KDAsMTI4KTt0W3NdW2VdLnNldChpKX19c2hpZnRJbnB1dEJ1ZmZlcnMoKXtmb3IobGV0IHQ9MDt0PHRoaXMubmJJbnB1dHM7dCsrKWZvcihsZXQgcz0wO3M8dGhpcy5pbnB1dEJ1ZmZlcnNbdF0ubGVuZ3RoO3MrKyl0aGlzLmlucHV0QnVmZmVyc1t0XVtzXS5jb3B5V2l0aGluKDAsMTI4KX1zaGlmdE91dHB1dEJ1ZmZlcnMoKXtmb3IobGV0IHQ9MDt0PHRoaXMubmJPdXRwdXRzO3QrKylmb3IobGV0IHM9MDtzPHRoaXMub3V0cHV0QnVmZmVyc1t0XS5sZW5ndGg7cysrKXRoaXMub3V0cHV0QnVmZmVyc1t0XVtzXS5jb3B5V2l0aGluKDAsMTI4KSx0aGlzLm91dHB1dEJ1ZmZlcnNbdF1bc10uc3ViYXJyYXkodGhpcy5ibG9ja1NpemUtMTI4KS5maWxsKDApfXByZXBhcmVJbnB1dEJ1ZmZlcnNUb1NlbmQoKXtmb3IobGV0IHQ9MDt0PHRoaXMubmJJbnB1dHM7dCsrKWZvcihsZXQgcz0wO3M8dGhpcy5pbnB1dEJ1ZmZlcnNbdF0ubGVuZ3RoO3MrKyl0aGlzLmlucHV0QnVmZmVyc1RvU2VuZFt0XVtzXS5zZXQodGhpcy5pbnB1dEJ1ZmZlcnNIZWFkW3RdW3NdKX1oYW5kbGVPdXRwdXRCdWZmZXJzVG9SZXRyaWV2ZSgpe2ZvcihsZXQgdD0wO3Q8dGhpcy5uYk91dHB1dHM7dCsrKWZvcihsZXQgcz0wO3M8dGhpcy5vdXRwdXRCdWZmZXJzW3RdLmxlbmd0aDtzKyspZm9yKGxldCBlPTA7ZTx0aGlzLmJsb2NrU2l6ZTtlKyspdGhpcy5vdXRwdXRCdWZmZXJzW3RdW3NdW2VdKz10aGlzLm91dHB1dEJ1ZmZlcnNUb1JldHJpZXZlW3RdW3NdW2VdL3RoaXMubmJPdmVybGFwc31wcm9jZXNzKHQscyxlKXtjb25zdCBuPXRbMF1bMF0hPT12b2lkIDA7cmV0dXJuIHRoaXMuc3RhcnRlZCYmIW4/ITE6KHRoaXMuc3RhcnRlZD1uLHRoaXMucmVhbGxvY2F0ZUNoYW5uZWxzSWZOZWVkZWQodCxzKSx0aGlzLnJlYWRJbnB1dHModCksdGhpcy5zaGlmdElucHV0QnVmZmVycygpLHRoaXMucHJlcGFyZUlucHV0QnVmZmVyc1RvU2VuZCgpLHRoaXMucHJvY2Vzc09MQSh0aGlzLmlucHV0QnVmZmVyc1RvU2VuZCx0aGlzLm91dHB1dEJ1ZmZlcnNUb1JldHJpZXZlLGUpLHRoaXMuaGFuZGxlT3V0cHV0QnVmZmVyc1RvUmV0cmlldmUoKSx0aGlzLndyaXRlT3V0cHV0cyhzKSx0aGlzLnNoaWZ0T3V0cHV0QnVmZmVycygpLCEwKX1wcm9jZXNzT0xBKHQscyxlKXtjb25zb2xlLmFzc2VydCghMSwiTm90IG92ZXJyaWRlbiIpfX1jbGFzcyBRdHtjb25zdHJ1Y3Rvcih0KXtpZih0aGlzLnNpemU9dHwwLHRoaXMuc2l6ZTw9MXx8dGhpcy5zaXplJnRoaXMuc2l6ZS0xKXRocm93IG5ldyBFcnJvcigiRkZUIHNpemUgbXVzdCBiZSBhIHBvd2VyIG9mIHR3byBhbmQgYmlnZ2VyIHRoYW4gMSIpO3RoaXMuX2NzaXplPXQ8PDE7Zm9yKHZhciBzPW5ldyBBcnJheSh0aGlzLnNpemUqMiksZT0wO2U8cy5sZW5ndGg7ZSs9Mil7Y29uc3QgaD1NYXRoLlBJKmUvdGhpcy5zaXplO3NbZV09TWF0aC5jb3MoaCksc1tlKzFdPS1NYXRoLnNpbihoKX10aGlzLnRhYmxlPXM7Zm9yKHZhciBpPTAsbj0xO3RoaXMuc2l6ZT5uO248PD0xKWkrKzt0aGlzLl93aWR0aD1pJTI9PT0wP2ktMTppLHRoaXMuX2JpdHJldj1uZXcgQXJyYXkoMTw8dGhpcy5fd2lkdGgpO2Zvcih2YXIgYT0wO2E8dGhpcy5fYml0cmV2Lmxlbmd0aDthKyspe3RoaXMuX2JpdHJldlthXT0wO2Zvcih2YXIgbz0wO288dGhpcy5fd2lkdGg7bys9Mil7dmFyIGM9dGhpcy5fd2lkdGgtby0yO3RoaXMuX2JpdHJldlthXXw9KGE+Pj5vJjMpPDxjfX10aGlzLl9vdXQ9bnVsbCx0aGlzLl9kYXRhPW51bGwsdGhpcy5faW52PTB9ZnJvbUNvbXBsZXhBcnJheSh0LHMpe2Zvcih2YXIgZT1zfHxuZXcgQXJyYXkodC5sZW5ndGg+Pj4xKSxpPTA7aTx0Lmxlbmd0aDtpKz0yKWVbaT4+PjFdPXRbaV07cmV0dXJuIGV9Y3JlYXRlQ29tcGxleEFycmF5KCl7Y29uc3QgdD1uZXcgQXJyYXkodGhpcy5fY3NpemUpO2Zvcih2YXIgcz0wO3M8dC5sZW5ndGg7cysrKXRbc109MDtyZXR1cm4gdH10b0NvbXBsZXhBcnJheSh0LHMpe2Zvcih2YXIgZT1zfHx0aGlzLmNyZWF0ZUNvbXBsZXhBcnJheSgpLGk9MDtpPGUubGVuZ3RoO2krPTIpZVtpXT10W2k+Pj4xXSxlW2krMV09MDtyZXR1cm4gZX1jb21wbGV0ZVNwZWN0cnVtKHQpe2Zvcih2YXIgcz10aGlzLl9jc2l6ZSxlPXM+Pj4xLGk9MjtpPGU7aSs9Mil0W3MtaV09dFtpXSx0W3MtaSsxXT0tdFtpKzFdfXRyYW5zZm9ybSh0LHMpe2lmKHQ9PT1zKXRocm93IG5ldyBFcnJvcigiSW5wdXQgYW5kIG91dHB1dCBidWZmZXJzIG11c3QgYmUgZGlmZmVyZW50Iik7dGhpcy5fb3V0PXQsdGhpcy5fZGF0YT1zLHRoaXMuX2ludj0wLHRoaXMuX3RyYW5zZm9ybTQoKSx0aGlzLl9vdXQ9bnVsbCx0aGlzLl9kYXRhPW51bGx9cmVhbFRyYW5zZm9ybSh0LHMpe2lmKHQ9PT1zKXRocm93IG5ldyBFcnJvcigiSW5wdXQgYW5kIG91dHB1dCBidWZmZXJzIG11c3QgYmUgZGlmZmVyZW50Iik7dGhpcy5fb3V0PXQsdGhpcy5fZGF0YT1zLHRoaXMuX2ludj0wLHRoaXMuX3JlYWxUcmFuc2Zvcm00KCksdGhpcy5fb3V0PW51bGwsdGhpcy5fZGF0YT1udWxsfWludmVyc2VUcmFuc2Zvcm0odCxzKXtpZih0PT09cyl0aHJvdyBuZXcgRXJyb3IoIklucHV0IGFuZCBvdXRwdXQgYnVmZmVycyBtdXN0IGJlIGRpZmZlcmVudCIpO3RoaXMuX291dD10LHRoaXMuX2RhdGE9cyx0aGlzLl9pbnY9MSx0aGlzLl90cmFuc2Zvcm00KCk7Zm9yKHZhciBlPTA7ZTx0Lmxlbmd0aDtlKyspdFtlXS89dGhpcy5zaXplO3RoaXMuX291dD1udWxsLHRoaXMuX2RhdGE9bnVsbH1fdHJhbnNmb3JtNCgpe3ZhciB0PXRoaXMuX291dCxzPXRoaXMuX2NzaXplLGU9dGhpcy5fd2lkdGgsaT0xPDxlLG49cy9pPDwxLGEsbyxjPXRoaXMuX2JpdHJldjtpZihuPT09NClmb3IoYT0wLG89MDthPHM7YSs9bixvKyspe2NvbnN0IG09Y1tvXTt0aGlzLl9zaW5nbGVUcmFuc2Zvcm0yKGEsbSxpKX1lbHNlIGZvcihhPTAsbz0wO2E8czthKz1uLG8rKyl7Y29uc3QgbT1jW29dO3RoaXMuX3NpbmdsZVRyYW5zZm9ybTQoYSxtLGkpfXZhciBoPXRoaXMuX2ludj8tMToxLGY9dGhpcy50YWJsZTtmb3IoaT4+PTI7aT49MjtpPj49Mil7bj1zL2k8PDE7dmFyIHU9bj4+PjI7Zm9yKGE9MDthPHM7YSs9bilmb3IodmFyIGQ9YSt1LGw9YSxwPTA7bDxkO2wrPTIscCs9aSl7Y29uc3QgbT1sLEk9bSt1LHc9SSt1LHY9dyt1LE09dFttXSxQPXRbbSsxXSxnPXRbSV0sVD10W0krMV0sQT10W3ddLFY9dFt3KzFdLE89dFt2XSxOPXRbdisxXSxDPU0sRj1QLHE9ZltwXSxCPWgqZltwKzFdLEw9ZypxLVQqQixFPWcqQitUKnEsSD1mWzIqcF0saXQ9aCpmWzIqcCsxXSwkPUEqSC1WKml0LFU9QSppdCtWKkgsSz1mWzMqcF0sWj1oKmZbMypwKzFdLGs9TypLLU4qWixmdD1PKlorTipLLGR0PUMrJCxydD1GK1UsbnQ9Qy0kLHB0PUYtVSxtdD1MK2ssYXQ9RStmdCxvdD1oKihMLWspLGd0PWgqKEUtZnQpLHZ0PWR0K210LEF0PXJ0K2F0LE90PWR0LW10LE50PXJ0LWF0LEN0PW50K2d0LEZ0PXB0LW90LEV0PW50LWd0LGt0PXB0K290O3RbbV09dnQsdFttKzFdPUF0LHRbSV09Q3QsdFtJKzFdPUZ0LHRbd109T3QsdFt3KzFdPU50LHRbdl09RXQsdFt2KzFdPWt0fX19X3NpbmdsZVRyYW5zZm9ybTIodCxzLGUpe2NvbnN0IGk9dGhpcy5fb3V0LG49dGhpcy5fZGF0YSxhPW5bc10sbz1uW3MrMV0sYz1uW3MrZV0saD1uW3MrZSsxXSxmPWErYyx1PW8raCxkPWEtYyxsPW8taDtpW3RdPWYsaVt0KzFdPXUsaVt0KzJdPWQsaVt0KzNdPWx9X3NpbmdsZVRyYW5zZm9ybTQodCxzLGUpe2NvbnN0IGk9dGhpcy5fb3V0LG49dGhpcy5fZGF0YSxhPXRoaXMuX2ludj8tMToxLG89ZSoyLGM9ZSozLGg9bltzXSxmPW5bcysxXSx1PW5bcytlXSxkPW5bcytlKzFdLGw9bltzK29dLHA9bltzK28rMV0sbT1uW3MrY10sST1uW3MrYysxXSx3PWgrbCx2PWYrcCxNPWgtbCxQPWYtcCxnPXUrbSxUPWQrSSxBPWEqKHUtbSksVj1hKihkLUkpLE89dytnLE49ditULEM9TStWLEY9UC1BLHE9dy1nLEI9di1ULEw9TS1WLEU9UCtBO2lbdF09TyxpW3QrMV09TixpW3QrMl09QyxpW3QrM109RixpW3QrNF09cSxpW3QrNV09QixpW3QrNl09TCxpW3QrN109RX1fcmVhbFRyYW5zZm9ybTQoKXt2YXIgdD10aGlzLl9vdXQscz10aGlzLl9jc2l6ZSxlPXRoaXMuX3dpZHRoLGk9MTw8ZSxuPXMvaTw8MSxhLG8sYz10aGlzLl9iaXRyZXY7aWYobj09PTQpZm9yKGE9MCxvPTA7YTxzO2ErPW4sbysrKXtjb25zdCBSdD1jW29dO3RoaXMuX3NpbmdsZVJlYWxUcmFuc2Zvcm0yKGEsUnQ+Pj4xLGk+Pj4xKX1lbHNlIGZvcihhPTAsbz0wO2E8czthKz1uLG8rKyl7Y29uc3QgUnQ9Y1tvXTt0aGlzLl9zaW5nbGVSZWFsVHJhbnNmb3JtNChhLFJ0Pj4+MSxpPj4+MSl9dmFyIGg9dGhpcy5faW52Py0xOjEsZj10aGlzLnRhYmxlO2ZvcihpPj49MjtpPj0yO2k+Pj0yKXtuPXMvaTw8MTt2YXIgdT1uPj4+MSxkPXU+Pj4xLGw9ZD4+PjE7Zm9yKGE9MDthPHM7YSs9bilmb3IodmFyIHA9MCxtPTA7cDw9bDtwKz0yLG0rPWkpe3ZhciBJPWErcCx3PUkrZCx2PXcrZCxNPXYrZCxQPXRbSV0sZz10W0krMV0sVD10W3ddLEE9dFt3KzFdLFY9dFt2XSxPPXRbdisxXSxOPXRbTV0sQz10W00rMV0sRj1QLHE9ZyxCPWZbbV0sTD1oKmZbbSsxXSxFPVQqQi1BKkwsSD1UKkwrQSpCLGl0PWZbMiptXSwkPWgqZlsyKm0rMV0sVT1WKml0LU8qJCxLPVYqJCtPKml0LFo9ZlszKm1dLGs9aCpmWzMqbSsxXSxmdD1OKlotQyprLGR0PU4qaytDKloscnQ9RitVLG50PXErSyxwdD1GLVUsbXQ9cS1LLGF0PUUrZnQsb3Q9SCtkdCxndD1oKihFLWZ0KSx2dD1oKihILWR0KSxBdD1ydCthdCxPdD1udCtvdCxOdD1wdCt2dCxDdD1tdC1ndDtpZih0W0ldPUF0LHRbSSsxXT1PdCx0W3ddPU50LHRbdysxXT1DdCxwPT09MCl7dmFyIEZ0PXJ0LWF0LEV0PW50LW90O3Rbdl09RnQsdFt2KzFdPUV0O2NvbnRpbnVlfWlmKHAhPT1sKXt2YXIga3Q9cHQsT2U9LW10LE5lPXJ0LENlPS1udCxGZT0taCp2dCxFZT0taCpndCxrZT0taCpvdCxSZT0taCphdCxEZT1rdCtGZSx6ZT1PZStFZSxxZT1OZStSZSxMZT1DZS1rZSxadD1hK2QtcCxYdD1hK3UtcDt0W1p0XT1EZSx0W1p0KzFdPXplLHRbWHRdPXFlLHRbWHQrMV09TGV9fX19X3NpbmdsZVJlYWxUcmFuc2Zvcm0yKHQscyxlKXtjb25zdCBpPXRoaXMuX291dCxuPXRoaXMuX2RhdGEsYT1uW3NdLG89bltzK2VdLGM9YStvLGg9YS1vO2lbdF09YyxpW3QrMV09MCxpW3QrMl09aCxpW3QrM109MH1fc2luZ2xlUmVhbFRyYW5zZm9ybTQodCxzLGUpe2NvbnN0IGk9dGhpcy5fb3V0LG49dGhpcy5fZGF0YSxhPXRoaXMuX2ludj8tMToxLG89ZSoyLGM9ZSozLGg9bltzXSxmPW5bcytlXSx1PW5bcytvXSxkPW5bcytjXSxsPWgrdSxwPWgtdSxtPWYrZCxJPWEqKGYtZCksdz1sK20sdj1wLE09LUksUD1sLW0sZz1wLFQ9STtpW3RdPXcsaVt0KzFdPTAsaVt0KzJdPXYsaVt0KzNdPU0saVt0KzRdPVAsaVt0KzVdPTAsaVt0KzZdPWcsaVt0KzddPVR9fWxldCB0cz1yPT5jb25zb2xlLmxvZyhyKTtjb25zdCBzcz0oLi4ucik9PnRzKC4uLnIpLGVzPShyLHQscyk9Pk1hdGgubWluKE1hdGgubWF4KHIsdCkscyksenQ9cj0+ci8oMStyKSxpcz0ocix0KT0+KHIldCt0KSV0LHJzPShyLHQpPT4oMSt0KSpyLygxK3QqTWF0aC5hYnMocikpLEo9KHIsdCk9Pk1hdGgudGFuaChyKigxK3QpKSxucz0ocix0KT0+ZXMoKDErdCkqciwtMSwxKSxxdD0ocix0KT0+e2xldCBzPSgxKy41KnQpKnI7Y29uc3QgZT1pcyhzKzEsNCk7cmV0dXJuIDEtTWF0aC5hYnMoZS0yKX0sYXM9KHIsdCk9Pk1hdGguc2luKE1hdGguUEkvMipxdChyLHQpKSxvcz0ocix0KT0+e2NvbnN0IHM9enQoTWF0aC5sb2cxcCh0KSksZT0oci1zLzMqcipyKnIpLygxLXMvMyk7cmV0dXJuIEooZSx0KX0sTHQ9KHIsdCxzPSExKT0+e2NvbnN0IGU9MSsyKnQsbj0uMDcqenQoTWF0aC5sb2cxcCh0KSksYT1KKHIrbiwyKnQpLG89SihzP246LXIrbiwyKnQpLGM9YS1vLGg9MS9NYXRoLmNvc2goZSpuKSxmPWgqaCx1PU1hdGgubWF4KDFlLTgsKHM/MToyKSplKmYpO3JldHVybiBKKGMvdSx0KX0sV3Q9e3NjdXJ2ZTpycyxzb2Z0OkosaGFyZDpucyxjdWJpYzpvcyxkaW9kZTpMdCxhc3ltOihyLHQpPT5MdChyLHQsITApLGZvbGQ6cXQsc2luZWZvbGQ6YXMsY2hlYnlzaGV2OihyLHQpPT57Y29uc3Qgcz0xMCpNYXRoLmxvZzFwKHQpO2xldCBlPTEsaT1yLG4sYT0wO2ZvcihsZXQgbz0xO288NjQ7bysrKXtpZihvPDIpe2ErPW89PTA/ZTppO2NvbnRpbnVlfW49MipyKmUtaSxpPWUsZT1uLG8lMj09PTAmJihhKz1NYXRoLm1pbigxLjMqcy9vLDIpKm4pfXJldHVybiBKKGEscy8yMCl9fSxodD1PYmplY3QuZnJlZXplKE9iamVjdC5rZXlzKFd0KSksaHM9cj0+e2xldCB0PXI7dHlwZW9mIHI9PSJzdHJpbmciJiYodD1odC5pbmRleE9mKHIpLHQ9PT0tMSYmKHNzKGBbc3VwZXJkb3VnaF0gQ291bGQgbm90IGZpbmQgd2F2ZXNoYXBpbmcgYWxnb3JpdGhtICR7cn0uCiAgICAgICAgQXZhaWxhYmxlIG9wdGlvbnMgYXJlICR7aHQuam9pbigiLCAiKX0uCiAgICAgICAgRGVmYXVsdGluZyB0byAke2h0WzBdfS5gKSx0PTApKTtjb25zdCBzPWh0W3QlaHQubGVuZ3RoXTtyZXR1cm4gV3Rbc119O2Z1bmN0aW9uIGN0KHIsdCl7aWYodHx8KHQ9ImFzc2VydGlvbiBmYWlsZWQiKSwhcil0aHJvdyBuZXcgRXJyb3IodCl9ZnVuY3Rpb24gY3Mocix0LHMpe3JldHVybiByPD0wP3Q6cj49MT9zOnQrcioocy10KX1mdW5jdGlvbiB1cyhyLHQscyl7cmV0dXJuIHI8PXQ/MDpyPj1zPzE6cz09PXQ/MDooci10KS8ocy10KX1mdW5jdGlvbiBscyhyLHQpe3JldHVybiByPHQ/KHIvPXQscityLXIqci0xKTpyPjEtdD8ocj0oci0xKS90LHIqcityK3IrMSk6MH1mdW5jdGlvbiBmcyhyKXtyZXR1cm4gTWF0aC5mbG9vcihyKT09PXJ9ZnVuY3Rpb24gZHMocil7cmV0dXJuIGZzKHIpJiZyPjB9ZnVuY3Rpb24gcHMocix0KXt0PU1hdGgubWluKE1hdGgubWF4KHQsMCksMSksdC09LjAxO3ZhciBzPTIqdC8oMS10KSxlPSgxK3MpKnIvKDErcypNYXRoLmFicyhyKSk7cmV0dXJuIGV9ZnVuY3Rpb24gSXQocix0LHMpe3JldHVybiByPj0xP3M6dCtyKihzLXQpfWZ1bmN0aW9uIFl0KCl7dGhpcy5zdGF0ZT0ib2ZmIix0aGlzLnN0YXJ0VGltZT0wLHRoaXMuc3RhcnRWYWw9MH1ZdC5wcm90b3R5cGUuZXZhbD1mdW5jdGlvbihyLHQscyxlLGksbil7c3dpdGNoKHRoaXMuc3RhdGUpe2Nhc2Uib2ZmIjpyZXR1cm4gdD4wJiYodGhpcy5zdGF0ZT0iYXR0YWNrIix0aGlzLnN0YXJ0VGltZT1yLHRoaXMuc3RhcnRWYWw9MCksMDtjYXNlImF0dGFjayI6e2xldCBhPXItdGhpcy5zdGFydFRpbWU7cmV0dXJuIGE+cz8odGhpcy5zdGF0ZT0iZGVjYXkiLHRoaXMuc3RhcnRUaW1lPXIsMSk6SXQoYS9zLHRoaXMuc3RhcnRWYWwsMSl9Y2FzZSJkZWNheSI6e2xldCBhPXItdGhpcy5zdGFydFRpbWUsbz1JdChhL2UsMSxpKTtyZXR1cm4gdDw9MD8odGhpcy5zdGF0ZT0icmVsZWFzZSIsdGhpcy5zdGFydFRpbWU9cix0aGlzLnN0YXJ0VmFsPW8sbyk6YT5lPyh0aGlzLnN0YXRlPSJzdXN0YWluIix0aGlzLnN0YXJ0VGltZT1yLGkpOm99Y2FzZSJzdXN0YWluIjpyZXR1cm4gdDw9MCYmKHRoaXMuc3RhdGU9InJlbGVhc2UiLHRoaXMuc3RhcnRUaW1lPXIsdGhpcy5zdGFydFZhbD1pKSxpO2Nhc2UicmVsZWFzZSI6e2xldCBhPXItdGhpcy5zdGFydFRpbWU7aWYoYT5uKXJldHVybiB0aGlzLnN0YXRlPSJvZmYiLDA7bGV0IG89SXQoYS9uLHRoaXMuc3RhcnRWYWwsMCk7cmV0dXJuIHQ+MCYmKHRoaXMuc3RhdGU9ImF0dGFjayIsdGhpcy5zdGFydFRpbWU9cix0aGlzLnN0YXJ0VmFsPW8pLG99fXRocm93ImludmFsaWQgZW52ZWxvcGUgc3RhdGUifTtmdW5jdGlvbiB3dCgpe3RoaXMuczA9MCx0aGlzLnMxPTB9d3QucHJvdG90eXBlLmFwcGx5PWZ1bmN0aW9uKHIsdCxzKXtjdCghaXNOYU4ociksIk5hTiB2YWx1ZSBmZWQgaW4gVHdvUG9sZUZpbHRlciIpLHQ9TWF0aC5taW4odCwxKSxzPU1hdGgubWF4KHMsMCk7dmFyIGU9TWF0aC5wb3coLjUsKDEtdCkvLjEyNSksaT1NYXRoLnBvdyguNSwocysuMTI1KS8uMTI1KSxuPTEtaSplLGE9dGhpcy5zMCxvPXRoaXMuczE7cmV0dXJuIGE9biphLWUqbytlKnIsbz1uKm8rZSphLHI9byx0aGlzLnMwPWEsdGhpcy5zMT1vLHJ9O2xldCBtcz1jbGFzcyBKdHtjb25zdHJ1Y3Rvcih0LHMpe3RoaXMuc2FtcGxlUmF0ZT10LHM/dGhpcy5idWZmZXI9cy5zbGljZSgwKToodGhpcy5idWZmZXI9bmV3IEZsb2F0MzJBcnJheSgxMCp0KSx0aGlzLmJ1ZmZlci5maWxsKDApKSx0aGlzLndyaXRlSWR4PTAsdGhpcy5yZWFkSWR4PTB9cmVzZXQoKXt0aGlzLmJ1ZmZlci5maWxsKDApLHRoaXMud3JpdGVJZHg9MCx0aGlzLnJlYWRJZHg9MH1jbG9uZSgpe2NvbnN0IHQ9bmV3IEp0KHRoaXMuc2FtcGxlUmF0ZSx0aGlzLmJ1ZmZlcik7cmV0dXJuIHQud3JpdGVJZHg9dGhpcy53cml0ZUlkeCx0LnJlYWRJZHg9dGhpcy5yZWFkSWR4LHR9d3JpdGUodCxzKXt0aGlzLndyaXRlSWR4PSh0aGlzLndyaXRlSWR4KzEpJXRoaXMuYnVmZmVyLmxlbmd0aCx0aGlzLmJ1ZmZlclt0aGlzLndyaXRlSWR4XT10O2xldCBlPU1hdGgubWluKE1hdGguZmxvb3IodGhpcy5zYW1wbGVSYXRlKnMpLHRoaXMuYnVmZmVyLmxlbmd0aC0xKTt0aGlzLnJlYWRJZHg9dGhpcy53cml0ZUlkeC1lLHRoaXMucmVhZElkeDwwJiYodGhpcy5yZWFkSWR4Kz10aGlzLmJ1ZmZlci5sZW5ndGgpfXJlYWQoKXtyZXR1cm4gdGhpcy5idWZmZXJbdGhpcy5yZWFkSWR4XX19O2NvbnN0IFN0PTEvNDhlMyxfdD0yNCxncz1fdC80O2NsYXNzIHl7Y29uc3RydWN0b3IodCxzLGUsaSl7dGhpcy5ub2RlSWQ9dCx0aGlzLnN0YXRlPXMsdGhpcy5zYW1wbGVSYXRlPWUsdGhpcy5zYW1wbGVUaW1lPTEvZSx0aGlzLnNlbmQ9aX19Y2xhc3MgYnMgZXh0ZW5kcyB5e2NvbnN0cnVjdG9yKHQscyxlLGkpe3N1cGVyKHQscyxlLGkpLHRoaXMuZW52PW5ldyBZdH11cGRhdGUodCxzLGUsaSxuLGEpe3JldHVybiB0aGlzLmVudi5ldmFsKHQscyxlLGksbixhKX19Y2xhc3MgdnMgZXh0ZW5kcyB5e2NvbnN0cnVjdG9yKHQscyxlLGkpe3N1cGVyKHQscyxlLGkpLHRoaXMucGhhc2U9MH11cGRhdGUodCl7bGV0IHM9X3QqdC82MCxlPS41O3JldHVybiB0aGlzLnBoYXNlKz10aGlzLnNhbXBsZVRpbWUqcyx0aGlzLnBoYXNlJTE8ZT8xOi0xfX1jbGFzcyBJcyBleHRlbmRzIHl7Y29uc3RydWN0b3IodCxzLGUsaSl7c3VwZXIodCxzLGUsaSksdGhpcy5pblNnbj0hMCx0aGlzLm91dFNnbj0hMCx0aGlzLmNsb2NrQ250PTB9dXBkYXRlKHQscyl7bGV0IGU9dD4wO3JldHVybiB0aGlzLmluU2duIT1lJiYodGhpcy5jbG9ja0NudCsrLHRoaXMuY2xvY2tDbnQ+PXMmJih0aGlzLmNsb2NrQ250PTAsdGhpcy5vdXRTZ249IXRoaXMub3V0U2duKSksdGhpcy5pblNnbj1lLHRoaXMub3V0U2duPzE6LTF9fWNsYXNzIHdzIGV4dGVuZHMgeXtjb25zdHJ1Y3Rvcih0LHMsZSxpKXtzdXBlcih0LHMsZSxpKSx0aGlzLmluU2duPSExfXVwZGF0ZSh0LHMpe2xldCBlPXM+MDtyZXR1cm4gZSYmdGhpcy5pblNnbiE9ZSYmdGhpcy5zZW5kKHt0eXBlOiJDTE9DS19QVUxTRSIsbm9kZUlkOnRoaXMubm9kZUlkLHRpbWU6dH0pLHRoaXMuaW5TZ249ZSwwfX1jb25zdCBNdD1uZXcgTWFwO2NsYXNzIFNzIGV4dGVuZHMgeXtjb25zdHJ1Y3Rvcih0LHMsZSxpKXtzdXBlcih0LHMsZSxpKTtjb25zdCBuPXMuaW5wdXRzWzJdO24mJk10LmhhcyhuKT90aGlzLmRlbGF5PU10LmdldChuKS5jbG9uZSgpOnRoaXMuZGVsYXk9bmV3IG1zKGUpLG4mJk10LnNldChuLHRoaXMuZGVsYXkpfXVwZGF0ZSh0LHMpe3JldHVybiB0aGlzLmRlbGF5LndyaXRlKHQscyksdGhpcy5kZWxheS5yZWFkKCl9fWNsYXNzIF9zIGV4dGVuZHMgeXtjb25zdHJ1Y3Rvcih0LHMsZSxpKXtzdXBlcih0LHMsZSxpKX11cGRhdGUodCxzKXtyZXR1cm4gcHModCxzKX19Y2xhc3MgTXMgZXh0ZW5kcyB5e2NvbnN0cnVjdG9yKHQscyxlLGkpe3N1cGVyKHQscyxlLGkpLHRoaXMudmFsdWU9MCx0aGlzLnRyaWdTZ249ITF9d3JpdGUodCxzKXshdGhpcy50cmlnU2duJiZzPjAmJih0aGlzLnZhbHVlPXQpLHRoaXMudHJpZ1Nnbj1zPjB9cmVhZCgpe3JldHVybiB0aGlzLnZhbHVlfXVwZGF0ZSh0LHMpe3JldHVybiB0aGlzLndyaXRlKHQscyksdGhpcy5yZWFkKCl9fWNsYXNzIHhze2NvbnN0cnVjdG9yKCl7dGhpcy52YWx1ZT0wfXVwZGF0ZSh0KXtyZXR1cm4gdGhpcy52YWx1ZT10LHRoaXMudmFsdWV9fWNvbnN0IHlzPTM0MDtsZXQgR3Q9MDtjbGFzcyBQc3tjb25zdHJ1Y3Rvcigpe3RoaXMuY2g9R3QsdGhpcy5zdGFydF9zZWVkPXlzKih0aGlzLmNoKzEpPj4+MCx0aGlzLnN0YXRlPXRoaXMuc3RhcnRfc2VlZCx0aGlzLnZhbHVlPTAsdGhpcy5hPTE2NjQ1MjUsdGhpcy5jPTEwMTM5MDQyMjMsdGhpcy5tYXNrPTE2Nzc3MjE1LHRoaXMuc2NhbGU9NTk2MDQ2NDQ3NzUzOTA2M2UtMjMsR3QrK311cGRhdGUodCxzKXtpZighdClyZXR1cm4gdGhpcy52YWx1ZTtzJiYodGhpcy5zdGF0ZT10aGlzLnN0YXJ0X3NlZWQpLHRoaXMuc3RhdGU9dGhpcy5zdGF0ZSp0aGlzLmErdGhpcy5jPj4+MDtjb25zdCBlPSh0aGlzLnN0YXRlJnRoaXMubWFzaykqdGhpcy5zY2FsZTtyZXR1cm4gdGhpcy52YWx1ZT1lKjItMSx0aGlzLnZhbHVlfX1jbGFzcyBUc3tjb25zdHJ1Y3Rvcigpe3RoaXMudmFsdWU9TWF0aC5yYW5kb20oKSoyLTF9dXBkYXRlKHQpe3JldHVybiB0Pyh0aGlzLnZhbHVlPU1hdGgucmFuZG9tKCkqMi0xLHRoaXMudmFsdWUpOnRoaXMudmFsdWV9fWNsYXNzIEJze3VwZGF0ZSh0KXtyZXR1cm4gTWF0aC5yYW5kb20oKTx0KlN0P01hdGgucmFuZG9tKCk6MH19Y2xhc3MgVnN7Y29uc3RydWN0b3IoKXt0aGlzLm91dD0wfXVwZGF0ZSgpe2xldCB0PU1hdGgucmFuZG9tKCkqMi0xO3JldHVybiB0aGlzLm91dD0odGhpcy5vdXQrLjAyKnQpLzEuMDIsdGhpcy5vdXR9fWNsYXNzIEFze2NvbnN0cnVjdG9yKCl7dGhpcy5iMD0wLHRoaXMuYjE9MCx0aGlzLmIyPTAsdGhpcy5iMz0wLHRoaXMuYjQ9MCx0aGlzLmI1PTAsdGhpcy5iNj0wfXVwZGF0ZSgpe2NvbnN0IHQ9TWF0aC5yYW5kb20oKSoyLTE7dGhpcy5iMD0uOTk4ODYqdGhpcy5iMCt0Ki4wNTU1MTc5LHRoaXMuYjE9Ljk5MzMyKnRoaXMuYjErdCouMDc1MDc1OSx0aGlzLmIyPS45NjkqdGhpcy5iMit0Ki4xNTM4NTIsdGhpcy5iMz0uODY2NSp0aGlzLmIzK3QqLjMxMDQ4NTYsdGhpcy5iND0uNTUqdGhpcy5iNCt0Ki41MzI5NTIyLHRoaXMuYjU9LS43NjE2KnRoaXMuYjUtdCouMDE2ODk4O2NvbnN0IHM9dGhpcy5iMCt0aGlzLmIxK3RoaXMuYjIrdGhpcy5iMyt0aGlzLmI0K3RoaXMuYjUrdGhpcy5iNit0Ki41MzYyO3JldHVybiB0aGlzLmI2PXQqLjExNTkyNixzKi4xMX19Y2xhc3MgT3MgZXh0ZW5kcyB5e2NvbnN0cnVjdG9yKHQscyxlLGkpe3N1cGVyKHQscyxlLGkpLHRoaXMucGhhc2U9MX11cGRhdGUodCl7dGhpcy5waGFzZSs9dGhpcy5zYW1wbGVUaW1lKnQ7bGV0IHM9dGhpcy5waGFzZT49MT8xOjA7cmV0dXJuIHRoaXMucGhhc2U9dGhpcy5waGFzZSUxLHN9fWNsYXNzIE5zIGV4dGVuZHMgeXtjb25zdHJ1Y3Rvcih0LHMsZSxpKXtzdXBlcih0LHMsZSxpKSx0aGlzLnBoYXNlPTB9dXBkYXRlKHQscyl7cmV0dXJuIHRoaXMucGhhc2UrPXRoaXMuc2FtcGxlVGltZSp0LHRoaXMucGhhc2UlMTxzPzE6LTF9fWNsYXNzIENzIGV4dGVuZHMgeXtjb25zdHJ1Y3Rvcih0LHMsZSxpKXtzdXBlcih0LHMsZSxpKSx0aGlzLnBoYXNlPTB9dXBkYXRlKHQpe3JldHVybiB0aGlzLnBoYXNlKz10aGlzLnNhbXBsZVRpbWUqdCx0aGlzLnBoYXNlJTEqMi0xfX1jbGFzcyBGc3tjb25zdHJ1Y3Rvcigpe3RoaXMucGhhc2U9TWF0aC5yYW5kb20oKX11cGRhdGUodCl7Y29uc3Qgcz10L3NhbXBsZVJhdGU7bGV0IGU9bHModGhpcy5waGFzZSxzKSxpPTIqdGhpcy5waGFzZS0xLWU7cmV0dXJuIHRoaXMucGhhc2UrPXMsdGhpcy5waGFzZT4xJiYodGhpcy5waGFzZS09MSksaX19Y2xhc3MgRXMgZXh0ZW5kcyB5e2NvbnN0cnVjdG9yKHQscyxlLGkpe3N1cGVyKHQscyxlLGkpLHRoaXMucGhhc2U9MCx0aGlzLnN5bmNTZ249ITF9dXBkYXRlKHQscyxlKXshdGhpcy5zeW5jU2duJiZzPjAmJih0aGlzLnBoYXNlPTApLHRoaXMuc3luY1Nnbj1zPjA7bGV0IGk9KHRoaXMucGhhc2UrZSklMTtyZXR1cm4gdGhpcy5waGFzZSs9dGhpcy5zYW1wbGVUaW1lKnQsTWF0aC5zaW4oaSoyKk1hdGguUEkpfX1jbGFzcyBrc3tkQlRvTGluZWFyKHQpe3JldHVybiBNYXRoLnBvdygxMCx0LzIwKX1saW5lYXJUb0RCKHQpe3JldHVybiAyMCpNYXRoLmxvZzEwKHQpfXVwZGF0ZSh0LHMsZSl7bGV0IGk9dGhpcy5saW5lYXJUb0RCKE1hdGguYWJzKHQpKSxuPTA7cmV0dXJuIGk+cyYmKG49KGktcykqKDEtMS9lKSksdGhpcy5kQlRvTGluZWFyKC1uKX19Y2xhc3MgUnMgZXh0ZW5kcyB5e2NvbnN0cnVjdG9yKHQscyxlLGkpe3N1cGVyKHQscyxlLGkpLHRoaXMucGhhc2U9MH11cGRhdGUodCl7dGhpcy5waGFzZSs9dGhpcy5zYW1wbGVUaW1lKnQ7bGV0IHM9dGhpcy5waGFzZSUxO3JldHVybihzPC41PzIqczoxLTIqKHMtLjUpKSoyLTF9fWNsYXNzIERzIGV4dGVuZHMgeXtjb25zdHJ1Y3Rvcih0LHMsZSxpKXtzdXBlcih0LHMsZSxpKTtjb25zdCBuPWUvMzA7Y3QoZHMobikpLHRoaXMuYnVmZmVyPW5ldyBGbG9hdDMyQXJyYXkobiksdGhpcy53cml0ZVBvcz0wfXVwZGF0ZSh0LHMsZSxpKXtyZXR1cm4gdGhpcy5idWZmZXJbdGhpcy53cml0ZVBvc109dCx0aGlzLndyaXRlUG9zKyssdGhpcy53cml0ZVBvcyV0aGlzLmJ1ZmZlci5sZW5ndGg9PTAmJih0aGlzLndyaXRlUG9zPTAsdGhpcy5zZW5kKHt0eXBlOiJTRU5EX1NBTVBMRVMiLGlkOnMsc2FtcGxlczp0aGlzLmJ1ZmZlcixjaGFubmVsczplLGNoYW5uZWw6aX0pKSx0fX1jbGFzcyB6c3tjb25zdHJ1Y3Rvcigpe3RoaXMubGFnVW5pdD00NDEwLHRoaXMucz0wfXVwZGF0ZSh0LHMpe3JldHVybiBzPXMqdGhpcy5sYWdVbml0LHM8MSYmKHM9MSksdGhpcy5zKz0xL3MqKHQtdGhpcy5zKSx0aGlzLnN9fWNsYXNzIHFze2NvbnN0cnVjdG9yKCl7dGhpcy5sYXN0PTB9dXBkYXRlKHQscyxlKXtjb25zdCBpPXMqU3Qsbj1lKlN0O2xldCBhPXQtdGhpcy5sYXN0O3JldHVybiBhPmk/YT1pOmE8LW4mJihhPS1uKSx0aGlzLmxhc3QrPWEsdGhpcy5sYXN0fX1jbGFzcyBMcyBleHRlbmRzIHl7Y29uc3RydWN0b3IodCxzLGUsaSl7c3VwZXIodCxzLGUsaSksdGhpcy5zPTB9dXBkYXRlKHQscyl7cmV0dXJuIHM9cyoxZTMsczwxJiYocz0xKSx0aGlzLnMrPTEvcyoodC10aGlzLnMpLHRoaXMuc319Y2xhc3MgV3MgZXh0ZW5kcyB5e2NvbnN0cnVjdG9yKHQscyxlLGkpe3N1cGVyKHQscyxlLGkpLHRoaXMuZmlsdGVyPW5ldyB3dH11cGRhdGUodCxzLGUpe3JldHVybiB0aGlzLmZpbHRlci5hcHBseSh0LHMsZSksdGhpcy5maWx0ZXIuczF9fWNsYXNzIFlzIGV4dGVuZHMgeXtjb25zdHJ1Y3Rvcih0LHMsZSxpKXtzdXBlcih0LHMsZSxpKSx0aGlzLmZpbHRlcj1uZXcgd3R9dXBkYXRlKHQscyxlKXtyZXR1cm4gdGhpcy5maWx0ZXIuYXBwbHkodCxzLGUpLHRoaXMuZmlsdGVyLnMwfX1jbGFzcyBHcyBleHRlbmRzIHl7Y29uc3RydWN0b3IodCxzLGUsaSl7c3VwZXIodCxzLGUsaSl9dXBkYXRlKHQscyl7cmV0dXJuIHM8MCYmKHM9MCkscz1zKzEsdD10KnMsNCooTWF0aC5hYnMoLjI1KnQrLjI1LU1hdGgucm91bmQoLjI1KnQrLjI1KSktLjI1KX19Y2xhc3MganMgZXh0ZW5kcyB5e3VwZGF0ZSh0KXtyZXR1cm4gdH19Y2xhc3MgYnQgZXh0ZW5kcyB5e2NvbnN0cnVjdG9yKHQscyxlLGkpe3N1cGVyKHQscyxlLGkpLHRoaXMubm90ZT0wLHRoaXMuZnJlcT0wLHRoaXMudmVsb2NpdHk9MCx0aGlzLmdhdGVTdGF0ZT0ib2ZmIix0aGlzLnR5cGU9Im1pZGlpbiIsdGhpcy5jaGFubmVsPS0xfWlzRnJlZSgpe3JldHVybiB0aGlzLmdhdGVTdGF0ZT09PSJvZmYifW5vdGVPbih0LHMpe3M+MD8odGhpcy5ub3RlPXQsdGhpcy52ZWxvY2l0eT1zLHRoaXMuZnJlcT0yKiooKHQtNjkpLzEyKSo0NDAsdGhpcy5nYXRlU3RhdGU9InByZXRyaWciKTp0aGlzLm5vdGVPZmYoKX1ub3RlT2ZmKCl7dGhpcy5ub3RlPTAsdGhpcy5nYXRlU3RhdGU9Im9mZiJ9Z2V0R2F0ZSgpe3N3aXRjaCh0aGlzLmdhdGVTdGF0ZSl7Y2FzZSJwcmV0cmlnIjpyZXR1cm4gdGhpcy5nYXRlU3RhdGU9Im9uIiwwO2Nhc2Uib24iOnJldHVybiAxO2Nhc2Uib2ZmIjpyZXR1cm4gMDtkZWZhdWx0OmN0KCExKX19Z2V0RnJlcSgpe3N3aXRjaCh0aGlzLmdhdGVTdGF0ZSl7Y2FzZSJwcmV0cmlnIjpyZXR1cm4gdGhpcy5nYXRlU3RhdGU9Im9uIiwwO2Nhc2Uib24iOnJldHVybiB0aGlzLmZyZXE7Y2FzZSJvZmYiOnJldHVybiB0aGlzLmZyZXE7ZGVmYXVsdDpjdCghMSl9fWdldFZlbG9jaXR5KCl7c3dpdGNoKHRoaXMuZ2F0ZVN0YXRlKXtjYXNlInByZXRyaWciOnJldHVybiB0aGlzLmdhdGVTdGF0ZT0ib24iLDA7Y2FzZSJvbiI6cmV0dXJuIHRoaXMudmVsb2NpdHk7Y2FzZSJvZmYiOnJldHVybiB0aGlzLnZlbG9jaXR5O2RlZmF1bHQ6Y3QoITEpfX19Y2xhc3MgSHMgZXh0ZW5kcyBidHtjb25zdHJ1Y3Rvcih0LHMsZSxpKXtzdXBlcih0LHMsZSxpKSx0aGlzLnR5cGU9Im1pZGlnYXRlIn11cGRhdGUodCl7cmV0dXJuIHRoaXMuY2hhbm5lbD10LHRoaXMuZ2V0R2F0ZSgpfX1jbGFzcyBVcyBleHRlbmRzIGJ0e2NvbnN0cnVjdG9yKHQscyxlLGkpe3N1cGVyKHQscyxlLGkpLHRoaXMudHlwZT0ibWlkaWZyZXEifXVwZGF0ZSh0KXtyZXR1cm4gdGhpcy5jaGFubmVsPXQsdGhpcy5nZXRGcmVxKCl9fWNsYXNzICRzIGV4dGVuZHMgYnR7Y29uc3RydWN0b3IodCxzLGUsaSl7c3VwZXIodCxzLGUsaSksdGhpcy50eXBlPSJtaWRpdmVsIn11cGRhdGUodCl7cmV0dXJuIHRoaXMuY2hhbm5lbD10LHRoaXMuZ2V0VmVsb2NpdHkoKX19Y2xhc3MgS3N7Y29uc3RydWN0b3IodCxzLGUsaSl7dGhpcy51cD0hMSx0aGlzLnNlbmQ9aSx0aGlzLnZhbHVlPTAsdGhpcy50eXBlPSJjYyJ9c2V0VmFsdWUodCl7dGhpcy52YWx1ZT10fXVwZGF0ZSh0LHMsZSl7cmV0dXJuIHRoaXMuaWQ9cywhdGhpcy51cCYmdD4wPyh0aGlzLnVwPSEwLHRoaXMuc2VuZCh7dHlwZToiU0lHTkFMX1RSSUdHRVIiLGlkOnMsdGltZTplfSksdGhpcy52YWx1ZSk6KHRoaXMudXA9dD4wLHRoaXMudmFsdWUpfX1jbGFzcyBacyBleHRlbmRzIHl7Y29uc3RydWN0b3IodCxzLGUsaSl7c3VwZXIodCxzLGUsaSksdGhpcy50eXBlPSJjYyIsdGhpcy52YWx1ZT1zLmlucHV0c1sxXT8/MH1zZXRWYWx1ZSh0KXt0aGlzLnZhbHVlPXR9dXBkYXRlKHQpe3JldHVybiB0aGlzLmlkPXQsdGhpcy52YWx1ZX19Y2xhc3MgWHMgZXh0ZW5kcyB5e2NvbnN0cnVjdG9yKHQscyxlLGkpe3N1cGVyKHQscyxlLGkpLHRoaXMudHlwZT0ibWlkaWNjIix0aGlzLnZhbHVlPXMuaW5wdXRzWzJdPz8tMSx0aGlzLmNoYW5uZWw9LTEsdGhpcy5jY251bWJlcj0tMX1zZXRWYWx1ZSh0KXt0aGlzLnZhbHVlPXR9dXBkYXRlKHQscyl7cmV0dXJuIHRoaXMuY2NudW1iZXI9dCx0aGlzLmNoYW5uZWw9cyx0aGlzLnZhbHVlfX1jbGFzcyBKcyBleHRlbmRzIHl7Y29uc3RydWN0b3IodCxzLGUsaSl7c3VwZXIodCxzLGUsaSksdGhpcy5jbG9ja1Nnbj0hMCx0aGlzLnN0ZXA9MCx0aGlzLmZpcnN0PSEwfXVwZGF0ZSh0LC4uLnMpe3JldHVybiF0aGlzLmNsb2NrU2duJiZ0PjA/KHRoaXMuc3RlcD0odGhpcy5zdGVwKzEpJXMubGVuZ3RoLHRoaXMuY2xvY2tTZ249dD4wLDApOih0aGlzLmNsb2NrU2duPXQ+MCxzW3RoaXMuc3RlcF0pfX1jbGFzcyBRcyBleHRlbmRzIHl7dXBkYXRlKHQsLi4ucyl7Y29uc3QgZT10JXMubGVuZ3RoK3MubGVuZ3RoO3JldHVybiBzW01hdGguZmxvb3IoZSklcy5sZW5ndGhdfX1jbGFzcyB0ZXt1cGRhdGUodCxzLGUsaSxuKXtsZXQgYT11cyh0LHMsZSk7cmV0dXJuIGNzKGEsaSxuKX19Y2xhc3Mgc2V7dXBkYXRlKHQscyxlKXtyZXR1cm4gTWF0aC5taW4oTWF0aC5tYXgodCxzKSxlKX19Y2xhc3MgZWV7Y29uc3RydWN0b3IoKXt0aGlzLmhpPSExfXVwZGF0ZSh0KXtyZXR1cm4hdGhpcy5oaSYmdD4wPyh0aGlzLmhpPSEwLDEpOih0aGlzLmhpJiZ0PD0wJiYodGhpcy5oaT0hMSksMCl9fWNsYXNzIGlle2NvbnN0cnVjdG9yKCl7dGhpcy54MT0wLHRoaXMueDI9MCx0aGlzLnkxPTAsdGhpcy55Mj0wLHRoaXMuYTA9MSx0aGlzLmExPTAsdGhpcy5hMj0wLHRoaXMuYjA9MSx0aGlzLmIxPTAsdGhpcy5iMj0wfXVwZGF0ZSh0PTAscz0wLGU9NTAwLGk9MSxuPTEpe2NvbnN0IGE9MipNYXRoLlBJKmUvc2FtcGxlUmF0ZSxvPU1hdGguc2luKGEpO2k9TWF0aC5wb3coMTAsaS8yMCk7Y29uc3QgYz1vLygyKmkpLGg9TWF0aC5jb3MoYSk7aWYocz09PTApdGhpcy5iMT0xLWgsdGhpcy5iMD10aGlzLmIxLzIsdGhpcy5iMj10aGlzLmIwLHRoaXMuYTA9MStjLHRoaXMuYTE9LTIqaCx0aGlzLmEyPTEtYztlbHNlIGlmKHM9PT0xKXRoaXMuYjA9KDEraCkvMix0aGlzLmIxPS0oMStoKSx0aGlzLmIyPXRoaXMuYjAsdGhpcy5hMD0xK2MsdGhpcy5hMT0tMipoLHRoaXMuYTI9MS1jO2Vsc2UgaWYocz09PTIpdGhpcy5iMD1vLzIsdGhpcy5iMT0wLHRoaXMuYjI9LXRoaXMuYjAsdGhpcy5hMD0xK2MsdGhpcy5hMT0tMipoLHRoaXMuYTI9MS1jO2Vsc2UgaWYocz09PTMpdGhpcy5iMD0xLHRoaXMuYjE9LTIqaCx0aGlzLmIyPTEsdGhpcy5hMD0xK2MsdGhpcy5hMT0tMipoLHRoaXMuYTI9MS1jO2Vsc2UgaWYocz09PTQpdGhpcy5iMD0xLWMsdGhpcy5iMT0tMipoLHRoaXMuYjI9MStjLHRoaXMuYTA9MStjLHRoaXMuYTE9LTIqaCx0aGlzLmEyPTEtYztlbHNlIGlmKHM9PT01KXtjb25zdCB1PU1hdGgucG93KDEwLG4vNDApO3RoaXMuYjA9MStjKnUsdGhpcy5iMT0tMipoLHRoaXMuYjI9MS1jKnUsdGhpcy5hMD0xK2MvdSx0aGlzLmExPS0yKmgsdGhpcy5hMj0xLWMvdX1lbHNlIGlmKHM9PT02KXtjb25zdCB1PU1hdGgucG93KDEwLG4vNDApLGQ9MipNYXRoLnNxcnQodSkqYyxsPSh1LTEpKmgscD0odSsxKSpoO3RoaXMuYjA9dSoodSsxLWwrZCksdGhpcy5iMT0yKnUqKHUtMS1wKSx0aGlzLmIyPXUqKHUrMS1sLWQpLHRoaXMuYTA9dSsxK2wrZCx0aGlzLmExPS0yKih1LTErcCksdGhpcy5hMj11KzErbC1kfWVsc2UgaWYocz09PTcpe2NvbnN0IHU9TWF0aC5wb3coMTAsbi80MCksZD0yKk1hdGguc3FydCh1KSpjLGw9KHUtMSkqaCxwPSh1KzEpKmg7dGhpcy5iMD11Kih1KzErbCtkKSx0aGlzLmIxPS0yKnUqKHUtMStwKSx0aGlzLmIyPXUqKHUrMStsLWQpLHRoaXMuYTA9dSsxLWwrZCx0aGlzLmExPTIqKHUtMS1wKSx0aGlzLmEyPXUrMS1sLWR9dGhpcy5iMC89dGhpcy5hMCx0aGlzLmIxLz10aGlzLmEwLHRoaXMuYjIvPXRoaXMuYTAsdGhpcy5hMS89dGhpcy5hMCx0aGlzLmEyLz10aGlzLmEwLHRoaXMuYTA9MTtjb25zdCBmPXRoaXMuYjAqdCt0aGlzLmIxKnRoaXMueDErdGhpcy5iMip0aGlzLngyLXRoaXMuYTEqdGhpcy55MS10aGlzLmEyKnRoaXMueTI7cmV0dXJuIHRoaXMueDI9dGhpcy54MSx0aGlzLngxPXQsdGhpcy55Mj10aGlzLnkxLHRoaXMueTE9ZixmfX1jb25zdCByZT1PYmplY3QuZnJlZXplKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh7X19wcm90b19fOm51bGwsQURTUk5vZGU6YnMsQXVkaW9JbjpqcyxBdWRpb05vZGU6eSxCUEY6WXMsQmlxdWFkRmlsdGVyOmllLEJyb3duTm9pc2VPc2M6VnMsQ0M6WnMsQ0xPQ0tfUFBROl90LENMT0NLX1BQUzpncyxDbGlwOnNlLENsb2NrOnZzLENsb2NrRGl2OklzLENsb2NrT3V0OndzLERlbGF5OlNzLERpc3RvcnQ6X3MsRHVzdE9zYzpCcyxGaWx0ZXI6V3MsRm9sZDpHcyxIb2xkOk1zLEltcHVsc2VPc2M6T3MsTGFnOnpzLExjZ05vaXNlOlBzLE1pZGlDQzpYcyxNaWRpRnJlcTpVcyxNaWRpR2F0ZTpIcyxNaWRpSW46YnQsTWlkaVZlbDokcyxOb2lzZU9zYzpUcyxPdXRwdXQ6eHMsUGljazpRcyxQaW5rTm9pc2U6QXMsUHVsc2VPc2M6TnMsUmVtYXA6dGUsU2F3T3NjOkZzLFNjb3BlOkRzLFNlcXVlbmNlOkpzLFNpZGVjaGFpbkNvbXByZXNzb3I6a3MsU2lnbmFsOktzLFNpbmVPc2M6RXMsU2xldzpxcyxTbGlkZTpMcyxUcmlPc2M6UnMsVHJpZzplZSxaYXdPc2M6Q3N9LFN5bWJvbC50b1N0cmluZ1RhZyx7dmFsdWU6Ik1vZHVsZSJ9KSksbmU9bmV3IE1hcChPYmplY3QuZW50cmllcyhyZSkpLFk9MTI4LEQ9TWF0aC5QSSx6PTIqRCxHPTEvc2FtcGxlUmF0ZSx4dD1yPT4xLU1hdGguZXhwKC1HL3IpLGp0PXI9Pk1hdGgucG93KDEwLHIvMjApLFM9KHIsdCxzKT0+TWF0aC5taW4oTWF0aC5tYXgocix0KSxzKSx1dD0ocix0LHMpPT5zKih0LXIpK3IsYj0ocix0KT0+clt0XT8/clswXSxRPXI9PnItTWF0aC5mbG9vcihyKSx0dD1yPT5yfDAsc3Q9cj0+dHQocisuNSksYWU9cj0+dHQocisxKSxIdD1yPT5yLXR0KHIpLGo9cj0+e2NvbnN0IHQ9cioqMjtyZXR1cm4gciooMjcrdCkvKDI3KzkqdCl9LFV0PShyLHQpPT57aWYocjwyKXJldHVybiBpPT4wO2NvbnN0IHM9dC8oci0xKSxlPXQqLjU7cmV0dXJuIGk9Pmkqcy1lfSxldD0ocix0KT0+cipNYXRoLnBvdygyLHQvMTIpO2Z1bmN0aW9uIG9lKHIsdCl7dD1NYXRoLm1pbih0LDEtdCk7Y29uc3Qgcz0xL3Q7cmV0dXJuIHI8dD8ocio9cywyKnItcioqMi0xKTpyPjEtdD8ocj0oci0xKSpzLHIqKjIrMipyKzEpOjB9Y29uc3QgeXQ9e3RyaShyLHQ9LjUpe2NvbnN0IHM9MS10O3JldHVybiByPj10PzEvcy1yL3M6ci90fSxzaW5lKHIpe3JldHVybiBNYXRoLnNpbih6KnIpKi41Ky41fSxyYW1wKHIpe3JldHVybiByfSxzYXcocil7cmV0dXJuIDEtcn0sc3F1YXJlKHIsdD0uNSl7cmV0dXJuIHI+PXQ/MDoxfSxjdXN0b20ocix0PVswLDFdKXtjb25zdCBzPXQubGVuZ3RoLTEsZT1NYXRoLmZsb29yKHIqcyksaT0xL3Msbj1TKHRbZV0sMCwxKSxvPVModFtlKzFdLDAsMSksYz1uLGg9MCxmPWk7cmV0dXJuKG8tYykvKGYtaCkqKHItaSplKStufSxzYXdibGVwKHIsdCl7cmV0dXJuIDIqci0xLW9lKHIsdCl9fSxoZT1PYmplY3Qua2V5cyh5dCk7Y2xhc3MgY2UgZXh0ZW5kcyBBdWRpb1dvcmtsZXRQcm9jZXNzb3J7c3RhdGljIGdldCBwYXJhbWV0ZXJEZXNjcmlwdG9ycygpe3JldHVyblt7bmFtZToiYmVnaW4iLGRlZmF1bHRWYWx1ZTowfSx7bmFtZToidGltZSIsZGVmYXVsdFZhbHVlOjB9LHtuYW1lOiJlbmQiLGRlZmF1bHRWYWx1ZTowfSx7bmFtZToiZnJlcXVlbmN5IixkZWZhdWx0VmFsdWU6LjV9LHtuYW1lOiJza2V3IixkZWZhdWx0VmFsdWU6LjV9LHtuYW1lOiJkZXB0aCIsZGVmYXVsdFZhbHVlOjF9LHtuYW1lOiJwaGFzZW9mZnNldCIsZGVmYXVsdFZhbHVlOjB9LHtuYW1lOiJzaGFwZSIsZGVmYXVsdFZhbHVlOjB9LHtuYW1lOiJjdXJ2ZSIsZGVmYXVsdFZhbHVlOjF9LHtuYW1lOiJkY29mZnNldCIsZGVmYXVsdFZhbHVlOjB9LHtuYW1lOiJtaW4iLGRlZmF1bHRWYWx1ZTotMWU5fSx7bmFtZToibWF4IixkZWZhdWx0VmFsdWU6MWU5fV19Y29uc3RydWN0b3IoKXtzdXBlcigpLHRoaXMucGhhc2V9aW5jcmVtZW50UGhhc2UodCl7dGhpcy5waGFzZSs9dCx0aGlzLnBoYXNlPjEmJih0aGlzLnBoYXNlPXRoaXMucGhhc2UtMSl9cHJvY2Vzcyh0LHMsZSl7Y29uc3QgaT1lLmJlZ2luWzBdLG49ZS5lbmRbMF07aWYoY3VycmVudFRpbWU+PW4pcmV0dXJuITE7aWYoY3VycmVudFRpbWU8PWkpcmV0dXJuITA7Y29uc3QgYT1zWzBdLG89ZS5mcmVxdWVuY3lbMF0sYz1lLnRpbWVbMF0saD1lLmRlcHRoWzBdLGY9ZS5za2V3WzBdLHU9ZS5waGFzZW9mZnNldFswXSxkPWUuY3VydmVbMF0sbD1lLmRjb2Zmc2V0WzBdLHA9ZS5taW5bMF0sbT1lLm1heFswXSxJPWhlW2Uuc2hhcGVbMF1dLHc9YVswXS5sZW5ndGg/PzA7dGhpcy5waGFzZT09bnVsbCYmKHRoaXMucGhhc2U9SHQoYypvK3UpKTtjb25zdCB2PW8qRztmb3IobGV0IE09MDtNPHc7TSsrKXtmb3IobGV0IFA9MDtQPGEubGVuZ3RoO1ArKyl7bGV0IGc9KHl0W0ldKHRoaXMucGhhc2UsZikrbCkqaDtnPU1hdGgucG93KGcsZCksYVtQXVtNXT1TKGcscCxtKX10aGlzLmluY3JlbWVudFBoYXNlKHYpfXJldHVybiEwfX1yZWdpc3RlclByb2Nlc3NvcigibGZvLXByb2Nlc3NvciIsY2UpO2NsYXNzIHVlIGV4dGVuZHMgQXVkaW9Xb3JrbGV0UHJvY2Vzc29ye3N0YXRpYyBnZXQgcGFyYW1ldGVyRGVzY3JpcHRvcnMoKXtyZXR1cm5be25hbWU6ImNvYXJzZSIsZGVmYXVsdFZhbHVlOjF9XX1jb25zdHJ1Y3Rvcigpe3N1cGVyKCksdGhpcy5zdGFydGVkPSExfXByb2Nlc3ModCxzLGUpe2NvbnN0IGk9dFswXSxuPXNbMF0sYT1pWzBdIT09dm9pZCAwO2lmKHRoaXMuc3RhcnRlZCYmIWEpcmV0dXJuITE7dGhpcy5zdGFydGVkPWE7bGV0IG89ZS5jb2Fyc2VbMF0/PzA7bz1NYXRoLm1heCgxLG8pO2ZvcihsZXQgYz0wO2M8WTtjKyspZm9yKGxldCBoPTA7aDxpLmxlbmd0aDtoKyspbltoXVtjXT1jJW89PT0wP2lbaF1bY106bltoXVtjLTFdO3JldHVybiEwfX1yZWdpc3RlclByb2Nlc3NvcigiY29hcnNlLXByb2Nlc3NvciIsdWUpO2NsYXNzIGxlIGV4dGVuZHMgQXVkaW9Xb3JrbGV0UHJvY2Vzc29ye3N0YXRpYyBnZXQgcGFyYW1ldGVyRGVzY3JpcHRvcnMoKXtyZXR1cm5be25hbWU6ImNydXNoIixkZWZhdWx0VmFsdWU6MH1dfWNvbnN0cnVjdG9yKCl7c3VwZXIoKSx0aGlzLnN0YXJ0ZWQ9ITF9cHJvY2Vzcyh0LHMsZSl7Y29uc3QgaT10WzBdLG49c1swXSxhPWlbMF0hPT12b2lkIDA7aWYodGhpcy5zdGFydGVkJiYhYSlyZXR1cm4hMTt0aGlzLnN0YXJ0ZWQ9YTtsZXQgbz1lLmNydXNoWzBdPz84O289TWF0aC5tYXgoMSxvKTtmb3IobGV0IGM9MDtjPFk7YysrKWZvcihsZXQgaD0wO2g8aS5sZW5ndGg7aCsrKXtjb25zdCBmPU1hdGgucG93KDIsby0xKTtuW2hdW2NdPU1hdGgucm91bmQoaVtoXVtjXSpmKS9mfXJldHVybiEwfX1yZWdpc3RlclByb2Nlc3NvcigiY3J1c2gtcHJvY2Vzc29yIixsZSk7Y2xhc3MgZmUgZXh0ZW5kcyBBdWRpb1dvcmtsZXRQcm9jZXNzb3J7c3RhdGljIGdldCBwYXJhbWV0ZXJEZXNjcmlwdG9ycygpe3JldHVyblt7bmFtZToic2hhcGUiLGRlZmF1bHRWYWx1ZTowfSx7bmFtZToicG9zdGdhaW4iLGRlZmF1bHRWYWx1ZToxfV19Y29uc3RydWN0b3IoKXtzdXBlcigpLHRoaXMuc3RhcnRlZD0hMX1wcm9jZXNzKHQscyxlKXtjb25zdCBpPXRbMF0sbj1zWzBdLGE9aVswXSE9PXZvaWQgMDtpZih0aGlzLnN0YXJ0ZWQmJiFhKXJldHVybiExO3RoaXMuc3RhcnRlZD1hO2xldCBvPWUuc2hhcGVbMF07bz1vPDE/bzouOTk5OTk5OTk5NixvPTIqby8oMS1vKTtjb25zdCBjPU1hdGgubWF4KC4wMDEsTWF0aC5taW4oMSxlLnBvc3RnYWluWzBdKSk7Zm9yKGxldCBoPTA7aDxZO2grKylmb3IobGV0IGY9MDtmPGkubGVuZ3RoO2YrKyluW2ZdW2hdPSgxK28pKmlbZl1baF0vKDErbypNYXRoLmFicyhpW2ZdW2hdKSkqYztyZXR1cm4hMH19cmVnaXN0ZXJQcm9jZXNzb3IoInNoYXBlLXByb2Nlc3NvciIsZmUpO2NsYXNzICR0e2NvbnN0cnVjdG9yKCl7RHQodGhpcywiczAiLDApO0R0KHRoaXMsInMxIiwwKX11cGRhdGUodCxzLGU9MCl7ZT1TKGUsMCwxKSxzPVMocywwLHNhbXBsZVJhdGUvMi0xKTtjb25zdCBpPVMoMipNYXRoLnNpbihzKkQqRyksMCwxLjE0KSxhPTEtTWF0aC5wb3coLjUsOCplKzEpKmk7cmV0dXJuIHRoaXMuczA9YSp0aGlzLnMwLWkqdGhpcy5zMStpKnQsdGhpcy5zMT1hKnRoaXMuczEraSp0aGlzLnMwLHRoaXMuczF9fWNsYXNzIGRlIGV4dGVuZHMgQXVkaW9Xb3JrbGV0UHJvY2Vzc29ye3N0YXRpYyBnZXQgcGFyYW1ldGVyRGVzY3JpcHRvcnMoKXtyZXR1cm5be25hbWU6InZhbHVlIixkZWZhdWx0VmFsdWU6LjV9XX1jb25zdHJ1Y3Rvcigpe3N1cGVyKCksdGhpcy5maWx0ZXJzPVtuZXcgJHQsbmV3ICR0XX1wcm9jZXNzKHQscyxlKXtjb25zdCBpPXRbMF0sbj1zWzBdLGE9aVswXSE9PXZvaWQgMDt0aGlzLnN0YXJ0ZWQ9YTtjb25zdCBvPVMoZS52YWx1ZVswXSwwLDEpO2xldCBjPSJub25lIixoLGY9MTtvPi41MT8oYz0iaGlwYXNzIixmPShvLS41KSoyKTpvPC40OSYmKGM9ImxvcGFzcyIsZj1vKjIpLGg9TWF0aC5wb3coZioxMSw0KTtmb3IobGV0IHU9MDt1PGkubGVuZ3RoO3UrKylmb3IobGV0IGQ9MDtkPFk7ZCsrKWM9PSJub25lIj9uW3VdW2RdPWlbdV1bZF06KHRoaXMuZmlsdGVyc1t1XS51cGRhdGUoaVt1XVtkXSxoLC4xKSxjPT09ImxvcGFzcyI/blt1XVtkXT10aGlzLmZpbHRlcnNbdV0uczE6Yz09PSJoaXBhc3MiP25bdV1bZF09aVt1XVtkXS10aGlzLmZpbHRlcnNbdV0uczE6blt1XVtkXT1pW3VdW2RdKTtyZXR1cm4hMH19cmVnaXN0ZXJQcm9jZXNzb3IoImRqZi1wcm9jZXNzb3IiLGRlKTtjbGFzcyBwZSBleHRlbmRzIEF1ZGlvV29ya2xldFByb2Nlc3NvcntzdGF0aWMgZ2V0IHBhcmFtZXRlckRlc2NyaXB0b3JzKCl7cmV0dXJuW3tuYW1lOiJmcmVxdWVuY3kiLGRlZmF1bHRWYWx1ZTo1MDB9LHtuYW1lOiJxIixkZWZhdWx0VmFsdWU6MX0se25hbWU6ImRyaXZlIixkZWZhdWx0VmFsdWU6LjY5fV19Y29uc3RydWN0b3IoKXtzdXBlcigpLHRoaXMuc3RhcnRlZD0hMSx0aGlzLnAwPVswLDBdLHRoaXMucDE9WzAsMF0sdGhpcy5wMj1bMCwwXSx0aGlzLnAzPVswLDBdLHRoaXMucDMyPVswLDBdLHRoaXMucDMzPVswLDBdLHRoaXMucDM0PVswLDBdfXByb2Nlc3ModCxzLGUpe2NvbnN0IGk9dFswXSxuPXNbMF0sYT1pWzBdIT09dm9pZCAwO2lmKHRoaXMuc3RhcnRlZCYmIWEpcmV0dXJuITE7dGhpcy5zdGFydGVkPWE7Y29uc3Qgbz1lLnFbMF0sYz1TKE1hdGguZXhwKGUuZHJpdmVbMF0pLC4xLDJlMyk7bGV0IGg9ZS5mcmVxdWVuY3lbMF07aD1oKnoqRyxoPWg+MT8xOmg7Y29uc3QgZj1NYXRoLm1pbig4LG8qLjEzKTtsZXQgdT0xL2MqTWF0aC5taW4oMS43NSwxK2YpO2ZvcihsZXQgZD0wO2Q8WTtkKyspZm9yKGxldCBsPTA7bDxpLmxlbmd0aDtsKyspe2NvbnN0IHA9dGhpcy5wM1tsXSouMzYwODkxK3RoaXMucDMyW2xdKi40MTcyOSt0aGlzLnAzM1tsXSouMTc3ODk2K3RoaXMucDM0W2xdKi4wNDM5NzI1O3RoaXMucDM0W2xdPXRoaXMucDMzW2xdLHRoaXMucDMzW2xdPXRoaXMucDMyW2xdLHRoaXMucDMyW2xdPXRoaXMucDNbbF0sdGhpcy5wMFtsXSs9KGooaVtsXVtkXSpjLWYqcCktaih0aGlzLnAwW2xdKSkqaCx0aGlzLnAxW2xdKz0oaih0aGlzLnAwW2xdKS1qKHRoaXMucDFbbF0pKSpoLHRoaXMucDJbbF0rPShqKHRoaXMucDFbbF0pLWoodGhpcy5wMltsXSkpKmgsdGhpcy5wM1tsXSs9KGoodGhpcy5wMltsXSktaih0aGlzLnAzW2xdKSkqaCxuW2xdW2RdPXAqdX1yZXR1cm4hMH19cmVnaXN0ZXJQcm9jZXNzb3IoImxhZGRlci1wcm9jZXNzb3IiLHBlKTtjbGFzcyBtZSBleHRlbmRzIEF1ZGlvV29ya2xldFByb2Nlc3NvcntzdGF0aWMgZ2V0IHBhcmFtZXRlckRlc2NyaXB0b3JzKCl7cmV0dXJuW3tuYW1lOiJkaXN0b3J0IixkZWZhdWx0VmFsdWU6MH0se25hbWU6InBvc3RnYWluIixkZWZhdWx0VmFsdWU6MX1dfWNvbnN0cnVjdG9yKHtwcm9jZXNzb3JPcHRpb25zOnR9KXtzdXBlcigpLHRoaXMuc3RhcnRlZD0hMSx0aGlzLmFsZ29yaXRobT1ocyh0LmFsZ29yaXRobSl9cHJvY2Vzcyh0LHMsZSl7Y29uc3QgaT10WzBdLG49c1swXSxhPWlbMF0hPT12b2lkIDA7aWYodGhpcy5zdGFydGVkJiYhYSlyZXR1cm4hMTt0aGlzLnN0YXJ0ZWQ9YTtmb3IobGV0IG89MDtvPFk7bysrKXtjb25zdCBjPVMoYihlLnBvc3RnYWluLG8pLC4wMDEsMSksaD1NYXRoLmV4cG0xKGIoZS5kaXN0b3J0LG8pKTtmb3IobGV0IGY9MDtmPGkubGVuZ3RoO2YrKyl7Y29uc3QgdT1pW2ZdW29dO25bZl1bb109Yyp0aGlzLmFsZ29yaXRobSh1LGgpfX1yZXR1cm4hMH19cmVnaXN0ZXJQcm9jZXNzb3IoImRpc3RvcnQtcHJvY2Vzc29yIixtZSk7Y2xhc3MgZ2UgZXh0ZW5kcyBBdWRpb1dvcmtsZXRQcm9jZXNzb3J7Y29uc3RydWN0b3IoKXtzdXBlcigpLHRoaXMucG9ydC5vbm1lc3NhZ2U9dD0+e2NvbnN0e3R5cGU6cyxwYXlsb2FkOmV9PXQuZGF0YXx8e307cz09PSJpbml0aWFsaXplIiYmdGhpcy5pbml0aWFsaXplKGUpfSx0aGlzLmluaXRpYWxpemUoKX1pbml0aWFsaXplKHQpe3RoaXMucGhhc2U9W119c3RhdGljIGdldCBwYXJhbWV0ZXJEZXNjcmlwdG9ycygpe3JldHVyblt7bmFtZToiYmVnaW4iLGRlZmF1bHRWYWx1ZTotMSxtYXg6TnVtYmVyLlBPU0lUSVZFX0lORklOSVRZLG1pbjotMX0se25hbWU6ImVuZCIsZGVmYXVsdFZhbHVlOi0xLG1heDpOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFksbWluOi0xfSx7bmFtZToiZnJlcXVlbmN5IixkZWZhdWx0VmFsdWU6NDQwLG1pbjpOdW1iZXIuRVBTSUxPTn0se25hbWU6InBhbnNwcmVhZCIsZGVmYXVsdFZhbHVlOi40LG1pbjowLG1heDoxfSx7bmFtZToiZnJlcXNwcmVhZCIsZGVmYXVsdFZhbHVlOi4yLG1pbjowfSx7bmFtZToiZGV0dW5lIixkZWZhdWx0VmFsdWU6MCxtaW46MH0se25hbWU6InZvaWNlcyIsZGVmYXVsdFZhbHVlOjUsbWluOjEsYXV0b21hdGlvblJhdGU6ImstcmF0ZSJ9XX1wcm9jZXNzKHQscyxlKXtjb25zdCBpPWUuYmVnaW5bMF0sbj1lLmVuZFswXSxhPWk+PTAsbz1uPj0wLGM9byYmY3VycmVudFRpbWU+PW4rLjUsaD1vJiZjdXJyZW50VGltZT49bixmPWN1cnJlbnRUaW1lPD1pO2lmKGMpcmV0dXJuITE7aWYoaHx8Znx8IWEpcmV0dXJuITA7Y29uc3QgdT1zWzBdLGQ9ZS52b2ljZXNbMF07Zm9yKGxldCBsPTA7bDx1WzBdLmxlbmd0aDtsKyspe2NvbnN0IHA9YihlLmRldHVuZSxsKSxtPWIoZS5mcmVxc3ByZWFkLGwpLEk9YihlLnBhbnNwcmVhZCxsKSouNSsuNTtsZXQgdz1NYXRoLnNxcnQoMS1JKSx2PU1hdGguc3FydChJKSxNPWIoZS5mcmVxdWVuY3ksbCk7TT1ldChNLHAvMTAwKTtjb25zdCBQPVV0KGQsbSk7Zm9yKGxldCBnPTA7ZzxkO2crKyl7Y29uc3QgVD1ldChNLFAoZykpLEE9UShUKkcpO3RoaXMucGhhc2VbZ109dGhpcy5waGFzZVtnXT8/TWF0aC5yYW5kb20oKTtjb25zdCBWPXl0LnNhd2JsZXAodGhpcy5waGFzZVtnXSxBKTt1WzBdW2xdKz1WKncsdVsxXVtsXSs9Vip2O2xldCBPPXRoaXMucGhhc2VbZ10rQTtPPj0xJiYoTy09MSksdGhpcy5waGFzZVtnXT1PO2NvbnN0IE49dzt3PXYsdj1OfX1yZXR1cm4hMH19cmVnaXN0ZXJQcm9jZXNzb3IoInN1cGVyc2F3LW9zY2lsbGF0b3IiLGdlKTtjb25zdCBiZT0yMDQ4LFB0PW5ldyBNYXA7ZnVuY3Rpb24gdmUocil7aWYoIVB0LmhhcyhyKSl7Y29uc3QgdD1uZXcgRmxvYXQzMkFycmF5KHIpO2ZvcihsZXQgcz0wO3M8cjtzKyspdFtzXT0uNSooMS1NYXRoLmNvcyh6KnMvcikpO1B0LnNldChyLHQpfXJldHVybiBQdC5nZXQocil9Y2xhc3MgSWUgZXh0ZW5kcyBYe3N0YXRpYyBnZXQgcGFyYW1ldGVyRGVzY3JpcHRvcnMoKXtyZXR1cm5be25hbWU6InBpdGNoRmFjdG9yIixkZWZhdWx0VmFsdWU6MX1dfWNvbnN0cnVjdG9yKHQpe3QucHJvY2Vzc29yT3B0aW9ucz17YmxvY2tTaXplOmJlfSxzdXBlcih0KSx0aGlzLnRpbWVDdXJzb3I9MCx0aGlzLmZmdFNpemU9dGhpcy5ibG9ja1NpemUsdGhpcy5pbnZmZnRTaXplPTEvdGhpcy5mZnRTaXplLHRoaXMuaGFubldpbmRvdz12ZSh0aGlzLmZmdFNpemUpLHRoaXMuZmZ0PW5ldyBRdCh0aGlzLmZmdFNpemUpLHRoaXMuZnJlcUNvbXBsZXhCdWZmZXI9dGhpcy5mZnQuY3JlYXRlQ29tcGxleEFycmF5KCksdGhpcy5mcmVxQ29tcGxleEJ1ZmZlclNoaWZ0ZWQ9dGhpcy5mZnQuY3JlYXRlQ29tcGxleEFycmF5KCksdGhpcy50aW1lQ29tcGxleEJ1ZmZlcj10aGlzLmZmdC5jcmVhdGVDb21wbGV4QXJyYXkoKSx0aGlzLm1hZ25pdHVkZXM9bmV3IEZsb2F0MzJBcnJheSh0aGlzLmZmdFNpemUvMisxKSx0aGlzLnBlYWtJbmRleGVzPW5ldyBJbnQzMkFycmF5KHRoaXMubWFnbml0dWRlcy5sZW5ndGgpLHRoaXMubmJQZWFrcz0wfXByb2Nlc3NPTEEodCxzLGUpe2xldCBpPWUucGl0Y2hGYWN0b3JbZS5waXRjaEZhY3Rvci5sZW5ndGgtMV07aTwwJiYoaT1pKi4yNSksaT1NYXRoLm1heCgwLGkrMSk7Zm9yKGxldCBuPTA7bjx0aGlzLm5iSW5wdXRzO24rKylmb3IobGV0IGE9MDthPHRbbl0ubGVuZ3RoO2ErKyl7Y29uc3Qgbz10W25dW2FdLGM9c1tuXVthXTt0aGlzLmFwcGx5SGFubldpbmRvdyhvKSx0aGlzLmZmdC5yZWFsVHJhbnNmb3JtKHRoaXMuZnJlcUNvbXBsZXhCdWZmZXIsbyksdGhpcy5jb21wdXRlTWFnbml0dWRlcygpLHRoaXMuZmluZFBlYWtzKCksdGhpcy5zaGlmdFBlYWtzKGkpLHRoaXMuZmZ0LmNvbXBsZXRlU3BlY3RydW0odGhpcy5mcmVxQ29tcGxleEJ1ZmZlclNoaWZ0ZWQpLHRoaXMuZmZ0LmludmVyc2VUcmFuc2Zvcm0odGhpcy50aW1lQ29tcGxleEJ1ZmZlcix0aGlzLmZyZXFDb21wbGV4QnVmZmVyU2hpZnRlZCksdGhpcy5mZnQuZnJvbUNvbXBsZXhBcnJheSh0aGlzLnRpbWVDb21wbGV4QnVmZmVyLGMpLHRoaXMuYXBwbHlIYW5uV2luZG93KGMpfXRoaXMudGltZUN1cnNvcis9dGhpcy5ob3BTaXplfWFwcGx5SGFubldpbmRvdyh0KXtmb3IobGV0IHM9MDtzPHRoaXMuYmxvY2tTaXplO3MrKyl0W3NdKj10aGlzLmhhbm5XaW5kb3dbc10qMS42Mn1jb21wdXRlTWFnbml0dWRlcygpe2xldCB0PTAscz0wO2Zvcig7dDx0aGlzLm1hZ25pdHVkZXMubGVuZ3RoOyl7Y29uc3QgZT10aGlzLmZyZXFDb21wbGV4QnVmZmVyW3NdLGk9dGhpcy5mcmVxQ29tcGxleEJ1ZmZlcltzKzFdO3RoaXMubWFnbml0dWRlc1t0XT1lKioyK2kqKjIsdCs9MSxzKz0yfX1maW5kUGVha3MoKXt0aGlzLm5iUGVha3M9MDtsZXQgdD0yO2NvbnN0IHM9dGhpcy5tYWduaXR1ZGVzLmxlbmd0aC0yO2Zvcig7dDxzOyl7Y29uc3QgZT10aGlzLm1hZ25pdHVkZXNbdF07aWYodGhpcy5tYWduaXR1ZGVzW3QtMV0+PWV8fHRoaXMubWFnbml0dWRlc1t0LTJdPj1lKXt0Kys7Y29udGludWV9aWYodGhpcy5tYWduaXR1ZGVzW3QrMV0+PWV8fHRoaXMubWFnbml0dWRlc1t0KzJdPj1lKXt0Kys7Y29udGludWV9dGhpcy5wZWFrSW5kZXhlc1t0aGlzLm5iUGVha3NdPXQsdGhpcy5uYlBlYWtzKyssdCs9Mn19c2hpZnRQZWFrcyh0KXt0aGlzLmZyZXFDb21wbGV4QnVmZmVyU2hpZnRlZC5maWxsKDApO2ZvcihsZXQgcz0wO3M8dGhpcy5uYlBlYWtzO3MrKyl7Y29uc3QgZT10aGlzLnBlYWtJbmRleGVzW3NdLGk9c3QoZSp0KTtpZihpPnRoaXMubWFnbml0dWRlcy5sZW5ndGgpYnJlYWs7bGV0IG49MCxhPXRoaXMuZmZ0U2l6ZTtzPjAmJihuPWUtc3QoKGUtdGhpcy5wZWFrSW5kZXhlc1tzLTFdKS8yKSksczx0aGlzLm5iUGVha3MtMSYmKGE9ZSthZSgodGhpcy5wZWFrSW5kZXhlc1tzKzFdLWUpLzIpKTtjb25zdCBvPW4tZSxjPWEtZSxoPXoqdGhpcy5pbnZmZnRTaXplKihpLWUpLGY9TWF0aC5jb3MoaCp0aGlzLnRpbWVDdXJzb3IpLHU9TWF0aC5zaW4oaCp0aGlzLnRpbWVDdXJzb3IpO2ZvcihsZXQgZD1vO2Q8YztkKyspe2NvbnN0IGw9ZStkLHA9aStkO2lmKHA+PXRoaXMubWFnbml0dWRlcy5sZW5ndGgpYnJlYWs7Y29uc3QgbT0yKmwsST1tKzEsdz10aGlzLmZyZXFDb21wbGV4QnVmZmVyW21dLHY9dGhpcy5mcmVxQ29tcGxleEJ1ZmZlcltJXSxNPXcqZi12KnUsUD13KnUrdipmLGc9MipwLFQ9ZysxO3RoaXMuZnJlcUNvbXBsZXhCdWZmZXJTaGlmdGVkW2ddKz1NLHRoaXMuZnJlcUNvbXBsZXhCdWZmZXJTaGlmdGVkW1RdKz1QfX19fXJlZ2lzdGVyUHJvY2Vzc29yKCJwaGFzZS12b2NvZGVyLXByb2Nlc3NvciIsSWUpO2NsYXNzIHdlIGV4dGVuZHMgQXVkaW9Xb3JrbGV0UHJvY2Vzc29ye2NvbnN0cnVjdG9yKCl7c3VwZXIoKSx0aGlzLnBoaT0tRCx0aGlzLlkwPTAsdGhpcy5ZMT0wLHRoaXMuUFc9RCx0aGlzLkI9Mi4zLHRoaXMuZHBoaWY9MCx0aGlzLmVudmY9MH1zdGF0aWMgZ2V0IHBhcmFtZXRlckRlc2NyaXB0b3JzKCl7cmV0dXJuW3tuYW1lOiJiZWdpbiIsZGVmYXVsdFZhbHVlOjAsbWF4Ok51bWJlci5QT1NJVElWRV9JTkZJTklUWSxtaW46MH0se25hbWU6ImVuZCIsZGVmYXVsdFZhbHVlOjAsbWF4Ok51bWJlci5QT1NJVElWRV9JTkZJTklUWSxtaW46MH0se25hbWU6ImZyZXF1ZW5jeSIsZGVmYXVsdFZhbHVlOjQ0MCxtaW46TnVtYmVyLkVQU0lMT059LHtuYW1lOiJkZXR1bmUiLGRlZmF1bHRWYWx1ZTowLG1pbjpOdW1iZXIuTkVHQVRJVkVfSU5GSU5JVFksbWF4Ok51bWJlci5QT1NJVElWRV9JTkZJTklUWX0se25hbWU6InB1bHNld2lkdGgiLGRlZmF1bHRWYWx1ZToxLG1pbjowLG1heDpOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFl9XX1wcm9jZXNzKHQscyxlKXtpZih0aGlzLmRpc2Nvbm5lY3RlZClyZXR1cm4hMTtpZihjdXJyZW50VGltZTw9ZS5iZWdpblswXSlyZXR1cm4hMDtpZihjdXJyZW50VGltZT49ZS5lbmRbMF0pcmV0dXJuITE7Y29uc3QgaT1zWzBdO2xldCBuPTEsYTtmb3IobGV0IG89MDtvPChpWzBdLmxlbmd0aD8/MCk7bysrKXtjb25zdCBjPSgxLVMoYihlLnB1bHNld2lkdGgsbyksLS45OSwuOTkpKSpELGg9YihlLmRldHVuZSxvKSxmPWV0KGIoZS5mcmVxdWVuY3ksbyksaC8xMDApO2E9Zip6KkcsdGhpcy5kcGhpZis9LjEqKGEtdGhpcy5kcGhpZiksbio9Ljk5OTgsdGhpcy5lbnZmKz0uMSoobi10aGlzLmVudmYpLHRoaXMuQj0yLjMqKDEtMWUtNCpmKSx0aGlzLkI8MCYmKHRoaXMuQj0wKSx0aGlzLnBoaSs9dGhpcy5kcGhpZix0aGlzLnBoaT49RCYmKHRoaXMucGhpLT16KTtsZXQgdT1NYXRoLmNvcyh0aGlzLnBoaSt0aGlzLkIqdGhpcy5ZMCk7dGhpcy5ZMD0uNSoodSt0aGlzLlkwKTtsZXQgZD1NYXRoLmNvcyh0aGlzLnBoaSt0aGlzLkIqdGhpcy5ZMStjKTt0aGlzLlkxPS41KihkK3RoaXMuWTEpO2ZvcihsZXQgbD0wO2w8aS5sZW5ndGg7bCsrKWlbbF1bb109LjE1Kih1LWQpKnRoaXMuZW52Zn1yZXR1cm4hMH19cmVnaXN0ZXJQcm9jZXNzb3IoInB1bHNlLW9zY2lsbGF0b3IiLHdlKTtjb25zdCBUdD17Yml0QzpmdW5jdGlvbihyLHQscyl7cmV0dXJuIHImdD9zOjB9LGJyOmZ1bmN0aW9uKHIsdD04KXtpZih0PjMyKXRocm93IG5ldyBFcnJvcigiYnIoKSBTaXplIGNhbm5vdCBiZSBncmVhdGVyIHRoYW4gMzIiKTtsZXQgcz0wO2ZvcihsZXQgZT0wO2U8dDtlKyspc3w9VHQuYml0QyhyLDE8PGUsMTw8dC0oZSsxKSk7cmV0dXJuIHN9LHNpbmY6ZnVuY3Rpb24ocil7cmV0dXJuIE1hdGguc2luKHIqRC8xMjgpfSxjb3NmOmZ1bmN0aW9uKHIpe3JldHVybiBNYXRoLmNvcyhyKkQvMTI4KX0sdGFuZjpmdW5jdGlvbihyKXtyZXR1cm4gTWF0aC50YW4ocipELzEyOCl9LHJlZ0c6ZnVuY3Rpb24ocix0KXtyZXR1cm4gdC50ZXN0KHIudG9TdHJpbmcoMikpfX07bGV0IGx0LEJ0O2Z1bmN0aW9uIFNlKHIpe2lmKGx0PT1udWxsKXtsdD1PYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhNYXRoKSxCdD1sdC5tYXAoZT0+TWF0aFtlXSk7Y29uc3QgdD1PYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhUdCkscz10Lm1hcChlPT5UdFtlXSk7bHQucHVzaCgiaW50Iiwid2luZG93IiwuLi50KSxCdC5wdXNoKE1hdGguZmxvb3IsZ2xvYmFsVGhpcywuLi5zKX1yZXR1cm4gbmV3IEZ1bmN0aW9uKC4uLmx0LCJ0IixgcmV0dXJuIDAsCiR7cnx8MH07YCkuYmluZChnbG9iYWxUaGlzLC4uLkJ0KX1jbGFzcyBfZSBleHRlbmRzIEF1ZGlvV29ya2xldFByb2Nlc3Nvcntjb25zdHJ1Y3Rvcigpe3N1cGVyKCksdGhpcy5wb3J0Lm9ubWVzc2FnZT10PT57bGV0e2NvZGVUZXh0OnN9PXQuZGF0YTtjb25zdHtieXRlQmVhdFN0YXJ0VGltZTplfT10LmRhdGE7ZSE9bnVsbCYmKHRoaXMudD0wLHRoaXMuaW5pdGlhbE9mZnNldD1NYXRoLmZsb29yKGUpKSxzPXMudHJpbSgpLnJlcGxhY2UoL15ldmFsXCh1bmVzY2FwZVwoZXNjYXBlKD86YHxcKCd8XCgifFwoYCkoLio/KSg/OmB8J1wpfCJcKXxgXCkpLnJlcGxhY2VcKFwvdVwoXC5cLlwpXC9nLFsiJ2BdXCQxJVsiJ2BdXClcKVwpJC8sKGksbik9PnVuZXNjYXBlKGVzY2FwZShuKS5yZXBsYWNlKC91KC4uKS9nLCIkMSUiKSkpLHRoaXMuZnVuYz1TZShzKX0sdGhpcy5pbml0aWFsT2Zmc2V0PTAsdGhpcy50PW51bGwsdGhpcy5mdW5jPW51bGx9c3RhdGljIGdldCBwYXJhbWV0ZXJEZXNjcmlwdG9ycygpe3JldHVyblt7bmFtZToiYmVnaW4iLGRlZmF1bHRWYWx1ZTowLG1heDpOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFksbWluOjB9LHtuYW1lOiJmcmVxdWVuY3kiLGRlZmF1bHRWYWx1ZTo0NDAsbWluOk51bWJlci5FUFNJTE9OfSx7bmFtZToiZGV0dW5lIixkZWZhdWx0VmFsdWU6MCxtaW46TnVtYmVyLk5FR0FUSVZFX0lORklOSVRZLG1heDpOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFl9LHtuYW1lOiJlbmQiLGRlZmF1bHRWYWx1ZTowLG1heDpOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFksbWluOjB9XX1wcm9jZXNzKHQscyxlKXtpZih0aGlzLmRpc2Nvbm5lY3RlZClyZXR1cm4hMTtpZihjdXJyZW50VGltZTw9ZS5iZWdpblswXSlyZXR1cm4hMDtpZihjdXJyZW50VGltZT49ZS5lbmRbMF0pcmV0dXJuITE7dGhpcy50PT1udWxsJiYodGhpcy50PWUuYmVnaW5bMF0qc2FtcGxlUmF0ZSk7Y29uc3QgaT1zWzBdLG49MjU2Kkc7Zm9yKGxldCBhPTA7YTxpWzBdLmxlbmd0aDthKyspe2NvbnN0IG89YihlLmRldHVuZSxhKSxjPWV0KGIoZS5mcmVxdWVuY3ksYSksby8xMDApLGg9bipjKnRoaXMudCt0aGlzLmluaXRpYWxPZmZzZXQsdT0odGhpcy5mdW5jKGgpJjI1NSkvMTI3LjUtMSxkPVModSouMiwtLjQsLjQpO2ZvcihsZXQgbD0wO2w8aS5sZW5ndGg7bCsrKWlbbF1bYV09ZDt0aGlzLnQrK31yZXR1cm4hMH19cmVnaXN0ZXJQcm9jZXNzb3IoImJ5dGUtYmVhdC1wcm9jZXNzb3IiLF9lKTtjbGFzcyBNZSBleHRlbmRzIEF1ZGlvV29ya2xldFByb2Nlc3NvcntzdGF0aWMgZ2V0IHBhcmFtZXRlckRlc2NyaXB0b3JzKCl7cmV0dXJuW3tuYW1lOiJiZWdpbiIsZGVmYXVsdFZhbHVlOjB9LHtuYW1lOiJlbmQiLGRlZmF1bHRWYWx1ZTowfSx7bmFtZToiYXR0YWNrIixkZWZhdWx0VmFsdWU6LjAwNSxtaW5WYWx1ZTowfSx7bmFtZToiZGVjYXkiLGRlZmF1bHRWYWx1ZTouMTQsbWluVmFsdWU6MH0se25hbWU6InN1c3RhaW4iLGRlZmF1bHRWYWx1ZTowLG1pblZhbHVlOjAsbWF4VmFsdWU6MX0se25hbWU6InJlbGVhc2UiLGRlZmF1bHRWYWx1ZTouMSxtaW5WYWx1ZTowfSx7bmFtZToiYXR0YWNrQ3VydmUiLGRlZmF1bHRWYWx1ZTowLG1pblZhbHVlOi0xLG1heFZhbHVlOjF9LHtuYW1lOiJkZWNheUN1cnZlIixkZWZhdWx0VmFsdWU6MCxtaW5WYWx1ZTotMSxtYXhWYWx1ZToxfSx7bmFtZToicmVsZWFzZUN1cnZlIixkZWZhdWx0VmFsdWU6MCxtaW5WYWx1ZTotMSxtYXhWYWx1ZToxfSx7bmFtZToiZGVwdGgiLGRlZmF1bHRWYWx1ZToxfSx7bmFtZToibWluIixkZWZhdWx0VmFsdWU6LTFlOX0se25hbWU6Im1heCIsZGVmYXVsdFZhbHVlOjFlOX0se25hbWU6InJldHJpZ2dlciIsZGVmYXVsdFZhbHVlOjEsbWluVmFsdWU6MCxtYXhWYWx1ZToxfV19Y29uc3RydWN0b3IoKXtzdXBlcigpLHRoaXMudmFsPTAsdGhpcy5zZWdJZHg9MCx0aGlzLnN0YXRlPTAsdGhpcy5iZWdpblRpbWU9MCx0aGlzLmVuZFRpbWU9MCx0aGlzLmF0dGFja1N0YXJ0PTB9X3dhcnAodCxzLGU9OCl7aWYodD09PTB8fHQ9PT0xKXJldHVybiB0O2lmKHM+MCl7Y29uc3QgaT0xK2UqcztyZXR1cm4gMS1NYXRoLnBvdygxLXQsaSl9ZWxzZXtjb25zdCBpPTEtZSpzO3JldHVybiBNYXRoLnBvdyh0LGkpfX1fYWR2YW5jZSh0LHMsZSxpKXtpZihlPT09MHx8dD09PXMpdGhpcy52YWw9cztlbHNle2NvbnN0IG49TWF0aC5taW4oMSwoY3VycmVudFRpbWUtdGhpcy5iZWdpblRpbWUpL2UpLGE9dGhpcy5fd2FycChuLGkpO3RoaXMudmFsPXQrKHMtdCkqYX19cHJvY2Vzcyh0LHMsZSl7Y29uc3QgaT1lLmJlZ2luWzBdLG49ZS5lbmRbMF07aWYoY3VycmVudFRpbWU+PW4pcmV0dXJuITE7aWYoY3VycmVudFRpbWU8PWkpcmV0dXJuITA7Y29uc3QgYT1zWzBdWzBdLG89YihlLnJldHJpZ2dlciwwKT49LjU7aSE9PXRoaXMuYmVnaW5UaW1lJiYodGhpcy5zdGF0ZT09PTB8fG8pJiYodGhpcy5iZWdpblRpbWU9aSx0aGlzLnN0YXRlPTEsdGhpcy5lbmRUaW1lPWIoZS5lbmQsMCksdGhpcy5hdHRhY2tTdGFydD10aGlzLnZhbCk7Y29uc3QgYz10aGlzLmVuZFRpbWUtdGhpcy5iZWdpblRpbWU7Zm9yKGxldCBoPTA7aDxhLmxlbmd0aDtoKyspe2NvbnN0IGY9YihlLmF0dGFjayxoKSx1PWIoZS5kZWNheSxoKSxkPWIoZS5zdXN0YWluLGgpLGw9YihlLnJlbGVhc2UsaCkscD1iKGUuYXR0YWNrQ3VydmUsaCksbT1iKGUuZGVjYXlDdXJ2ZSxoKSxJPWIoZS5yZWxlYXNlQ3VydmUsaCksdz1iKGUuZGVwdGgsaCksdj1iKGUubWluLGgpLE09YihlLm1heCxoKSxQPVt7dGltZTpOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFksc3RhcnQ6MCx0YXJnZXQ6MH0se3RpbWU6ZixzdGFydDp0aGlzLmF0dGFja1N0YXJ0LHRhcmdldDoxLGN1cnZlOnB9LHt0aW1lOmYrdSxzdGFydDoxLHRhcmdldDpkLGN1cnZlOm19LHt0aW1lOmMsc3RhcnQ6ZCx0YXJnZXQ6ZH0se3RpbWU6YytsLHN0YXJ0OmQsdGFyZ2V0OjAsY3VydmU6SX1dO2xldHt0aW1lOmcsc3RhcnQ6VCx0YXJnZXQ6QSxjdXJ2ZTpWfT1QW3RoaXMuc3RhdGVdO2Zvcih0aGlzLl9hZHZhbmNlKFQsQSxnLFYpO2N1cnJlbnRUaW1lLXRoaXMuYmVnaW5UaW1lPj1nOyl0aGlzLnN0YXRlPSh0aGlzLnN0YXRlKzEpJVAubGVuZ3RoLGc9UFt0aGlzLnN0YXRlXS50aW1lO2FbaF09Uyh0aGlzLnZhbCp3LHYsTSl9cmV0dXJuITB9fXJlZ2lzdGVyUHJvY2Vzc29yKCJlbnZlbG9wZS1wcm9jZXNzb3IiLE1lKTtjb25zdCB4PU9iamVjdC5mcmVlemUoe05PTkU6MCxBU1lNOjEsTUlSUk9SOjIsQkVORFA6MyxCRU5ETTo0LEJFTkRNUDo1LFNZTkM6NixRVUFOVDo3LEZPTEQ6OCxQV006OSxPUkJJVDoxMCxTUElOOjExLENIQU9TOjEyLFBSSU1FUzoxMyxCSU5BUlk6MTQsQlJPV05JQU46MTUsUkVDSVBST0NBTDoxNixXT1JNSE9MRToxNyxMT0dJU1RJQzoxOCxTSUdNT0lEOjE5LEZSQUNUQUw6MjAsRkxJUDoyMX0pO2Z1bmN0aW9uIHhlKHIpe3JldHVybiByPXIrMjEyNzkxMjIxNCsocjw8MTIpLHI9cl4zMzQ1MDcyNzAwXnI+Pj4xOSxyPXIrMzc0NzYxMzkzKyhyPDw1KSxyPXIrMzU1MDYzNTExNl5yPDw5LHI9cis0MjUxOTkzNzk3KyhyPDwzKSxyPXJeMzA0MjU5NDU2OV5yPj4+MTYscj4+PjB9Y29uc3QgS3Q9cj0+KHhlKHIpPj4+OCkvMTY3NzcyMTY7ZnVuY3Rpb24geWUocix0KXtsZXQgcz0wO2ZvcihsZXQgZT0wO2U8dDtlKyspcz1zPDwxfHImMSxyPj4+PTE7cmV0dXJuIHN9ZnVuY3Rpb24gUGUocil7Y29uc3QgdD1NYXRoLmZsb29yKHIpLHM9ci10LGU9S3QodCksaT1LdCh0KzEpO3JldHVybiBlKyhpLWUpKnN9ZnVuY3Rpb24gVGUocix0PTQpe2xldCBzPS41LGU9MCxpPTAsbj0xO2ZvcihsZXQgYT0wO2E8dDthKyspZSs9cypQZShyKm4pLGkrPXMscyo9LjUsbio9MjtyZXR1cm4gZS9pKjItMX1jb25zdCBWdD17fTtjbGFzcyBCZSBleHRlbmRzIEF1ZGlvV29ya2xldFByb2Nlc3NvcntzdGF0aWMgZ2V0IHBhcmFtZXRlckRlc2NyaXB0b3JzKCl7cmV0dXJuW3tuYW1lOiJiZWdpbiIsZGVmYXVsdFZhbHVlOi0xLG1pbjotMSxtYXg6TnVtYmVyLlBPU0lUSVZFX0lORklOSVRZfSx7bmFtZToiZW5kIixkZWZhdWx0VmFsdWU6LTEsbWluOi0xLG1heDpOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFl9LHtuYW1lOiJmcmVxdWVuY3kiLGRlZmF1bHRWYWx1ZTo0NDAsbWluOk51bWJlci5FUFNJTE9OfSx7bmFtZToiZGV0dW5lIixkZWZhdWx0VmFsdWU6MH0se25hbWU6ImZyZXFzcHJlYWQiLGRlZmF1bHRWYWx1ZTouMTgsbWluOjB9LHtuYW1lOiJwb3NpdGlvbiIsZGVmYXVsdFZhbHVlOjAsbWluOjAsbWF4OjF9LHtuYW1lOiJ3YXJwIixkZWZhdWx0VmFsdWU6MCxtaW46MCxtYXg6MX0se25hbWU6IndhcnBNb2RlIixkZWZhdWx0VmFsdWU6MH0se25hbWU6InZvaWNlcyIsZGVmYXVsdFZhbHVlOjEsbWluOjEsYXV0b21hdGlvblJhdGU6ImstcmF0ZSJ9LHtuYW1lOiJwYW5zcHJlYWQiLGRlZmF1bHRWYWx1ZTouNyxtaW46MCxtYXg6MX0se25hbWU6InBoYXNlcmFuZCIsZGVmYXVsdFZhbHVlOjAsbWluOjAsbWF4OjF9XX1jb25zdHJ1Y3Rvcih0KXtzdXBlcih0KSx0aGlzLnBvcnQub25tZXNzYWdlPXM9Pntjb25zdHt0eXBlOmUscGF5bG9hZDppfT1zLmRhdGF8fHt9O2U9PT0iaW5pdGlhbGl6ZSImJnRoaXMuaW5pdGlhbGl6ZShpKX0sdGhpcy5pbml0aWFsaXplKCl9aW5pdGlhbGl6ZSh0KXtpZih0aGlzLnRhYmxlPW51bGwsdGhpcy5mcmFtZUxlbj1udWxsLHRoaXMubnVtRnJhbWVzPW51bGwsdGhpcy5waGFzZT1bXSx0IT1udWxsJiZ0LmtleSl7Y29uc3Qgcz10LmtleTt0aGlzLmZyYW1lTGVuPXQuZnJhbWVMZW4sVnRbc118fChWdFtzXT10LmZyYW1lcyksdGhpcy50YWJsZT1WdFtzXSx0aGlzLm51bUZyYW1lcz10aGlzLnRhYmxlLmxlbmd0aH19X21pcnJvcih0KXtyZXR1cm4gMS1NYXRoLmFicygyKnQtMSl9X3RvQml0cyh0LHM9MixlPTEyKXtjb25zdCBpPWUrKHMtZSkqdDtyZXR1cm57YjppLG46c3QoTWF0aC5wb3coMixpKSl9fV93YXJwUGhhc2UodCxzLGUpe3N3aXRjaChlKXtjYXNlIHguTk9ORTpyZXR1cm4gdDtjYXNlIHguQVNZTTp7Y29uc3QgaT0uMDErLjk5KnM7cmV0dXJuIHQ8aT8uNSp0L2k6LjUrLjUqKHQtaSkvKDEtaSl9Y2FzZSB4Lk1JUlJPUjpyZXR1cm4gdGhpcy5fbWlycm9yKHRoaXMuX3dhcnBQaGFzZSh0LHMseC5BU1lNKSk7Y2FzZSB4LkJFTkRQOnJldHVybiBNYXRoLnBvdyh0LDErMypzKTtjYXNlIHguQkVORE06cmV0dXJuIE1hdGgucG93KHQsMS8oMSszKnMpKTtjYXNlIHguQkVORE1QOnJldHVybiBzPC41P3RoaXMuX3dhcnBQaGFzZSh0LDEtMipzLDMpOnRoaXMuX3dhcnBQaGFzZSh0LDIqcy0xLDIpO2Nhc2UgeC5TWU5DOntjb25zdCBpPU1hdGgucG93KDE2LHMqKjIpO3JldHVybiB0KmklMX1jYXNlIHguUVVBTlQ6e2NvbnN0e246aX09dGhpcy5fdG9CaXRzKHMpO3JldHVybiB0dCh0KmkpL2l9Y2FzZSB4LkZPTEQ6e2NvbnN0IG49MStNYXRoLm1heCgxLHN0KDcqcykpO3JldHVybiBNYXRoLmFicyhIdChuKnQpLS41KSoyfWNhc2UgeC5QV006e2NvbnN0IGk9UyguNSsuNDkqKDIqcy0xKSwwLDEpO3JldHVybiB0PGk/dC9pKi41Oi41Kyh0LWkpLygxLWkpKi41fWNhc2UgeC5PUkJJVDp7Y29uc3QgaT0uNSpzO3JldHVybiBRKHQraSpNYXRoLnNpbih6KjMqdCkpfWNhc2UgeC5TUElOOntjb25zdCBpPS41KnMse259PXRoaXMuX3RvQml0cyhzLDEsNik7cmV0dXJuIFEodCtpKk1hdGguc2luKHoqbip0KSl9Y2FzZSB4LkNIQU9TOntjb25zdCBuPSgzLjcrLjMqcykqdCooMS10KTtyZXR1cm4gUygoMS1zKSp0K3MqbiwwLDEpfWNhc2UgeC5QUklNRVM6e2NvbnN0IGk9YT0+e2lmKGE8MilyZXR1cm4hMTtpZihhJTI9PT0wKXJldHVybiBhPT09Mjtmb3IobGV0IG89MztvKioyPD1hO28rPTIpaWYoYSVvPT09MClyZXR1cm4hMTtyZXR1cm4hMH07bGV0e259PXRoaXMuX3RvQml0cyhzLDMpO2Zvcig7IWkobik7KW4rKztyZXR1cm4gdHQodCpuKS9ufWNhc2UgeC5CSU5BUlk6e2xldHtiOml9PXRoaXMuX3RvQml0cyhzLDMpO2k9c3QoaSk7Y29uc3Qgbj0xPDxpLGE9dHQodCpuKTtyZXR1cm4geWUoYSxpKS9ufWNhc2UgeC5CUk9XTklBTjp7Y29uc3QgaT0uMjUqcypUZSg2NCp0LDQpO3JldHVybiBRKHQraSl9Y2FzZSB4LlJFQ0lQUk9DQUw6e2NvbnN0IGk9Mis0KnMsbj10KmksYT10KygxLXQpKmksbz1hPjFlLTEyP24vYTowO3JldHVybiBTKG8sMCwxKX1jYXNlIHguV09STUhPTEU6e2NvbnN0IGk9UyguOCpzLDAsMSksbj0uNSooMS1pKSxhPS41KigxK2kpO3JldHVybiB0PG4/dC9uKi41OnQ+YT8uNSooMSsodC1hKS8oMS1hKSk6LjV9Y2FzZSB4LkxPR0lTVElDOntsZXQgaT10O2NvbnN0IG49My42Ky40KnMsYT0xK3N0KDIqcyk7Zm9yKGxldCBvPTA7bzxhO28rKylpPW4qaSooMS1pKTtyZXR1cm4gUyhpLDAsMSl9Y2FzZSB4LlNJR01PSUQ6e2NvbnN0IGk9MSsxMCpzLG49dC0uNSxhPTEvKDErTWF0aC5leHAoLWkqbikpLG89MS8oMStNYXRoLmV4cCguNSppKSksYz0xLygxK01hdGguZXhwKC0uNSppKSk7cmV0dXJuKGEtbykvKGMtbyl9Y2FzZSB4LkZSQUNUQUw6e2NvbnN0IGk9LjUqTWF0aC5zaW4oeip0KSpzO3JldHVybiBRKHQraSl9Y2FzZSB4LkZMSVA6cmV0dXJuIHQ7ZGVmYXVsdDpyZXR1cm4gdH19X3NhbXBsZUZyYW1lKHQscyl7Y29uc3QgZT10Lmxlbmd0aCxpPXMqZTtsZXQgbj1pfDA7bj49ZSYmKG49MCk7Y29uc3QgYT1pLW4sbz10W25dO2xldCBjPW4rMTtjPj1lJiYoYz0wKTtjb25zdCBoPXRbY107cmV0dXJuIG8rKGgtbykqYX1wcm9jZXNzKHQscyxlKXtjb25zdCBpPWUuYmVnaW5bMF0sbj1lLmVuZFswXSxhPWk+PTAsbz1uPj0wLGM9byYmY3VycmVudFRpbWU+PW4rLjUsaD1vJiZjdXJyZW50VGltZT49bixmPWN1cnJlbnRUaW1lPD1pO2lmKGMpcmV0dXJuITE7aWYoaHx8Znx8IWEpcmV0dXJuITA7Y29uc3QgdT1zWzBdWzBdLGQ9c1swXVsxXXx8c1swXVswXTtpZighdGhpcy50YWJsZSlyZXR1cm4gdS5maWxsKDApLGQhPT11JiZkLnNldCh1KSwhMDtjb25zdCBsPWUudm9pY2VzWzBdO2ZvcihsZXQgcD0wO3A8dS5sZW5ndGg7cCsrKXtjb25zdCBtPWIoZS5kZXR1bmUscCksST1iKGUuZnJlcXNwcmVhZCxwKSx2PVMoYihlLnBvc2l0aW9uLHApLDAsMSkqKHRoaXMubnVtRnJhbWVzLTEpLE09dnwwLFA9di1NLGc9UyhiKGUud2FycCxwKSwwLDEpLFQ9YihlLndhcnBNb2RlLHApLEE9UyhiKGUucGhhc2VyYW5kLHApLDAsMSksVj1sPjE/UyhiKGUucGFuc3ByZWFkLHApLDAsMSk6MCxPPU1hdGguc3FydCguNS0uNSpWKSxOPU1hdGguc3FydCguNSsuNSpWKTtsZXQgQz1iKGUuZnJlcXVlbmN5LHApO0M9ZXQoQyxtLzEwMCk7Y29uc3QgRj0xL01hdGguc3FydChsKSxxPVV0KGwsSSk7Zm9yKGxldCBCPTA7QjxsO0IrKyl7Y29uc3QgTD0oQiYxKT09MTtsZXQgRT1PLEg9TjtMJiYoRT1OLEg9Tyk7Y29uc3QgJD1ldChDLHEoQikpKkc7dGhpcy5waGFzZVtCXT10aGlzLnBoYXNlW0JdPz9NYXRoLnJhbmRvbSgpKkE7Y29uc3QgVT10aGlzLl93YXJwUGhhc2UodGhpcy5waGFzZVtCXSxnLFQpLEs9dGhpcy5fc2FtcGxlRnJhbWUodGhpcy50YWJsZVtNXSxVKSxaPXRoaXMuX3NhbXBsZUZyYW1lKHRoaXMudGFibGVbTWF0aC5taW4odGhpcy5udW1GcmFtZXMtMSxNKzEpXSxVKTtsZXQgaz11dChLLFosUCk7VD09PXguRkxJUCYmdGhpcy5waGFzZVtCXTxnJiYoaz0tayksdVtwXSs9aypFKkYsZFtwXSs9aypIKkYsdGhpcy5waGFzZVtCXT1RKHRoaXMucGhhc2VbQl0rJCl9fXJldHVybiEwfX1yZWdpc3RlclByb2Nlc3Nvcigid2F2ZXRhYmxlLW9zY2lsbGF0b3ItcHJvY2Vzc29yIixCZSk7Y2xhc3MgVmUgZXh0ZW5kcyBBdWRpb1dvcmtsZXRQcm9jZXNzb3J7c3RhdGljIGdldCBwYXJhbWV0ZXJEZXNjcmlwdG9ycygpe3JldHVybltdfWNvbnN0cnVjdG9yKHQpe3N1cGVyKCksdGhpcy5nYWluQ29lZmY9eHQoLjIpLHRoaXMuYXZnR2Fpbj0xO2xldHthdHRhY2tUaW1lOnM9LjAwMyxzdXN0YWluVGltZTplPS4wOCxhdHRhY2s6aT0wLHN1c3RhaW46bj0wLHNlbnNpdGl2aXR5OmE9LjEsbWl4Om89MSxiZWdpbjpjPTAsZW5kOmg9MH09dC5wcm9jZXNzb3JPcHRpb25zO3M9UyhzLDVlLTQsLjA1KSxlPVMoZSwuMDEsLjUpLHRoaXMuYXR0YWNrQ29lZmY9eHQocyksdGhpcy5zdXN0YWluQ29lZmY9eHQoZSksdGhpcy5hdHRhY2tBbXQ9UyhpLC0xLDEpLHRoaXMuc3VzdGFpbkFtdD1TKG4sLTEsMSksdGhpcy5zY2FsaW5nPS41KzUqUyhhLDAsMSksdGhpcy5taXg9UyhvLDAsMSksdGhpcy5iZWdpbj1jLHRoaXMuZW5kPWgsdGhpcy5hdHRhY2tFbnY9bmV3IEZsb2F0MzJBcnJheSgyKSx0aGlzLnN1c3RhaW5FbnY9bmV3IEZsb2F0MzJBcnJheSgyKX1wcm9jZXNzKHQscyxlKXtjb25zdCBpPXRbMF0sbj1zWzBdO2lmKGN1cnJlbnRUaW1lPj10aGlzLmVuZClyZXR1cm4hMTtpZihjdXJyZW50VGltZTw9dGhpcy5iZWdpbilyZXR1cm4hMDtjb25zdCBhPWkubGVuZ3RoO2E+dGhpcy5hdHRhY2tFbnYubGVuZ3RoJiYodGhpcy5hdHRhY2tFbnY9bmV3IEZsb2F0MzJBcnJheShhKSx0aGlzLnN1c3RhaW5FbnY9bmV3IEZsb2F0MzJBcnJheShhKSk7bGV0IG89dGhpcy5hdmdHYWluO2ZvcihsZXQgYz0wO2M8YTtjKyspe2xldCBoPXRoaXMuYXR0YWNrRW52W2NdLGY9dGhpcy5zdXN0YWluRW52W2NdO2ZvcihsZXQgdT0wO3U8WTt1Kyspe2NvbnN0IGQ9aVtjXVt1XSxsPU1hdGguYWJzKGQpO2g9dXQoaCxsLHRoaXMuYXR0YWNrQ29lZmYpLGY9dXQoZixsLHRoaXMuc3VzdGFpbkNvZWZmKTtjb25zdCBwPVModGhpcy5zY2FsaW5nKihoLWYpLyhmKzFlLTYpLC0xLjUsMS41KSxtPXA+MD9wOjAsST1wPDA/LXA6MCx3PWp0KHRoaXMuYXR0YWNrQW10Km0qMTgpLHY9anQodGhpcy5zdXN0YWluQW10KkkqMzYpLE09Uyh3KnYsMCw4KTtvPXV0KG8sTSx0aGlzLmdhaW5Db2VmZik7Y29uc3QgUD1vPi4wMDE/MS9vOjEsZz1kKk0qUDtsZXQgVD11dChkLGcsdGhpcy5taXgpO1QvPTErTWF0aC5hYnMoVCksbltjXVt1XT1UfXRoaXMuYXR0YWNrRW52W2NdPWgsdGhpcy5zdXN0YWluRW52W2NdPWZ9cmV0dXJuIHRoaXMuYXZnR2Fpbj1vLCEwfX1yZWdpc3RlclByb2Nlc3NvcigidHJhbnNpZW50LXByb2Nlc3NvciIsVmUpO2NsYXNzIEFlIGV4dGVuZHMgQXVkaW9Xb3JrbGV0UHJvY2Vzc29ye2NvbnN0cnVjdG9yKCl7c3VwZXIoKSx0aGlzLnBsYXlQb3M9MDtjb25zdCB0PTE2O3RoaXMub3V0cHV0cz1uZXcgQXJyYXkodCkuZmlsbCgwKSx0aGlzLnNvdXJjZXM9bmV3IEFycmF5KHQpLmZpbGwoMCksdGhpcy5nYXRlRW5kZWQ9ITEsdGhpcy5zdGFydGVkPSExLHRoaXMucG9ydC5vbm1lc3NhZ2U9cz0+e3ZhciBoLGY7bGV0e3NyYzplLHNjaGVtYTp7dWdlbnM6aSxyZWdpc3RlcnM6bn0sc3RhcnQ6YSxnYXRlRW5kOm8sZW5kOmN9PXMuZGF0YTt0aGlzLnN0YXJ0PWEsdGhpcy5nYXRlRW5kPW8sdGhpcy5lbmQ9Yyx0aGlzLnJlZ2lzdGVycz1uZXcgQXJyYXkobikuZmlsbCgwKSx0aGlzLnNyYz1gby5maWxsKDApOyAvLyByZXNldCBvdXRwdXRzCiR7ZX1gLHRoaXMubm9kZXM9W107Zm9yKGxldCB1PTA7dTxpLmxlbmd0aDt1Kyspe2NvbnN0IGQ9aVt1XSxsPW5lLmdldChkLnR5cGUpLHA9bmV3IGwodSxkLHNhbXBsZVJhdGUpO3AudHlwZT09PSJjYyImJigoZj0oaD1kLmlucHV0cyk9PW51bGw/dm9pZCAwOmhbMF0pIT1udWxsJiZmLmluY2x1ZGVzKCJzdHJ1ZGVsLWdhdGUiKSkmJihwLnNldFZhbHVlKDEpLHRoaXMuZ2F0ZU5vZGU9cCksdGhpcy5ub2Rlc1t1XT1wfXRoaXMuZ2VuU2FtcGxlPW5ldyBGdW5jdGlvbigidGltZSIsIm5vZGVzIiwiaW5wdXQiLCJyIiwibyIsInMiLHRoaXMuc3JjKX19cHJvY2Vzcyh0LHMpe3ZhciBvLGM7Y29uc3QgZT0obz10WzBdKT09bnVsbD92b2lkIDA6b1swXTtpZihjdXJyZW50VGltZT49dGhpcy5lbmQpcmV0dXJuITE7aWYodGhpcy5nZW5TYW1wbGU9PT12b2lkIDB8fGN1cnJlbnRUaW1lPHRoaXMuc3RhcnQpcmV0dXJuITA7dGhpcy5zdGFydGVkPSEwLCF0aGlzLmdhdGVFbmRlZCYmY3VycmVudFRpbWU+dGhpcy5nYXRlRW5kJiYoKGM9dGhpcy5nYXRlTm9kZSk9PW51bGx8fGMuc2V0VmFsdWUoMCksdGhpcy5nYXRlRW5kZWQ9ITApO2NvbnN0IGk9c1swXSxuPWlbMF0sYT1pWzFdO2ZvcihsZXQgaD0wO2g8WTtoKyspe3RoaXMuZ2VuU2FtcGxlKHRoaXMucGxheVBvcyx0aGlzLm5vZGVzLGU/ZVtoXTowLHRoaXMucmVnaXN0ZXJzLHRoaXMub3V0cHV0cyx0aGlzLnNvdXJjZXMpO2NvbnN0IGY9dGhpcy5vdXRwdXRzWzBdLHU9dGhpcy5vdXRwdXRzWzFdO2E/KG5baF09ZixhW2hdPXUpOm5baF09LjUqKGYrdSksdGhpcy5wbGF5UG9zKz0xL3NhbXBsZVJhdGV9cmV0dXJuITB9fXJldHVybiByZWdpc3RlclByb2Nlc3NvcigiZ2VuZXJpYy1wcm9jZXNzb3IiLEFlKSxSLldhcnBNb2RlPXgsT2JqZWN0LmRlZmluZVByb3BlcnR5KFIsU3ltYm9sLnRvU3RyaW5nVGFnLHt2YWx1ZToiTW9kdWxlIn0pLFJ9KHt9KTsK", jn = {
  stretch: { node: "stretch", param: "pitchFactor" },
  gain: { node: "gain", param: "gain" },
  postgain: { node: "post", param: "gain" },
  pan: { node: "pan", param: "pan" },
  tremolo: { node: "tremolo", param: "frequency" },
  tremolosync: { node: "tremolo", param: "frequency" },
  tremolodepth: { node: "tremolo_gain", param: "gain" },
  tremoloskew: { node: "tremolo", param: "skew" },
  tremolophase: { node: "tremolo", param: "phase" },
  tremoloshape: { node: "tremolo", param: "shape" },
  // MODULATORS
  lfo: { node: "lfo", param: "frequency" },
  lfo_rate: { node: "lfo", param: "frequency" },
  lfo_sync: { node: "lfo", param: "frequency" },
  lfo_depth: { node: "lfo", param: "depth" },
  lfo_depthabs: { node: "lfo", param: "depth" },
  lfo_skew: { node: "lfo", param: "skew" },
  lfo_curve: { node: "lfo", param: "curve" },
  lfo_dcoffset: { node: "lfo", param: "dcoffset" },
  env: { node: "env", param: "depth" },
  env_attack: { node: "env", param: "attack" },
  env_decay: { node: "env", param: "decay" },
  env_sustain: { node: "env", param: "sustain" },
  env_release: { node: "env", param: "release" },
  bmod: { node: "bmod", param: "depth" },
  bmod_depth: { node: "bmod", param: "depth" },
  bmod_depthabs: { node: "bmod", param: "depth" },
  // LPF
  cutoff: { node: "lpf", param: "frequency" },
  resonance: { node: "lpf", param: "Q" },
  lprate: { node: "lpf_lfo", param: "rate" },
  lpsync: { node: "lpf_lfo", param: "sync" },
  lpdepth: { node: "lpf_lfo", param: "depth" },
  lpdepthfrequency: { node: "lpf_lfo", param: "depth" },
  lpshape: { node: "lpf_lfo", param: "shape" },
  lpdc: { node: "lpf_lfo", param: "dcoffset" },
  lpskew: { node: "lpf_lfo", param: "skew" },
  // HPF
  hcutoff: { node: "hpf", param: "frequency" },
  hresonance: { node: "hpf", param: "Q" },
  hprate: { node: "hpf_lfo", param: "rate" },
  hpsync: { node: "hpf_lfo", param: "sync" },
  hpdepth: { node: "hpf_lfo", param: "depth" },
  hpdepthfrequency: { node: "hpf_lfo", param: "depth" },
  hpshape: { node: "hpf_lfo", param: "shape" },
  hpdc: { node: "hpf_lfo", param: "dcoffset" },
  hpskew: { node: "hpf_lfo", param: "skew" },
  // BPF
  bandf: { node: "bpf", param: "frequency" },
  bandq: { node: "bpf", param: "Q" },
  bprate: { node: "bpf_lfo", param: "rate" },
  bpsync: { node: "bpf_lfo", param: "sync" },
  bpdepth: { node: "bpf_lfo", param: "depth" },
  bpdepthfrequency: { node: "bpf_lfo", param: "depth" },
  bpshape: { node: "bpf_lfo", param: "shape" },
  bpdc: { node: "bpf_lfo", param: "dcoffset" },
  bpskew: { node: "bpf_lfo", param: "skew" },
  vowel: { node: "vowel", param: "frequency" },
  // DISTORTION
  coarse: { node: "coarse", param: "coarse" },
  crush: { node: "crush", param: "crush" },
  shape: { node: "shape", param: "shape" },
  shapevol: { node: "shape", param: "postgain" },
  distort: { node: "distort", param: "distort" },
  distortvol: { node: "distort", param: "postgain" },
  distorttype: { node: "distort", param: "distort" },
  // COMPRESSOR
  compressor: { node: "compressor", param: "threshold" },
  compressorRatio: { node: "compressor", param: "ratio" },
  compressorKnee: { node: "compressor", param: "knee" },
  compressorAttack: { node: "compressor", param: "attack" },
  compressorRelease: { node: "compressor", param: "release" },
  // PHASER
  phaserrate: { node: "phaser_lfo", param: "frequency" },
  phasersweep: { node: "phaser_lfo", param: "depth" },
  phasercenter: { node: "phaser", param: "frequency" },
  phaserdepth: { node: "phaser", param: "Q" },
  // ORBIT EFFECTS
  delay: { node: "delay_mix", param: "gain" },
  delaytime: { node: "delay", param: "delayTime" },
  delayfeedback: { node: "delay", param: "feedback" },
  delaysync: { node: "delay", param: "delayTime" },
  dry: { node: "dry", param: "gain" },
  room: { node: "room_mix", param: "gain" },
  djf: { node: "djf", param: "value" },
  busgain: { node: "bus", param: "gain" },
  // SYNTHS
  s: { node: "source", param: "frequency" },
  detune: { node: "source", param: "freqspread" },
  wt: { node: "source", param: "position" },
  warp: { node: "source", param: "warp" },
  freq: { node: "source", param: "frequency" },
  note: { node: "source", param: "frequency" },
  wtdc: { node: "wt_lfo", param: "dc" },
  wtskew: { node: "wt_lfo", param: "skew" },
  wtrate: { node: "wt_lfo", param: "frequency" },
  wtsync: { node: "wt_lfo", param: "frequency" },
  wtdepth: { node: "wt_lfo", param: "depth" },
  warpdc: { node: "warp_lfo", param: "dc" },
  warpskew: { node: "warp_lfo", param: "skew" },
  warprate: { node: "warp_lfo", param: "frequency" },
  warpsync: { node: "warp_lfo", param: "frequency" },
  warpdepth: { node: "warp_lfo", param: "depth" },
  fmi: { node: "fm_1_gain", param: "gain" },
  fmi2: { node: "fm_2_gain", param: "gain" },
  fmi3: { node: "fm_3_gain", param: "gain" },
  fmi4: { node: "fm_4_gain", param: "gain" },
  fmi5: { node: "fm_5_gain", param: "gain" },
  fmi6: { node: "fm_6_gain", param: "gain" },
  fmi7: { node: "fm_7_gain", param: "gain" },
  fmi8: { node: "fm_8_gain", param: "gain" },
  fmh: { node: "fm_1", param: "frequency" },
  fmh2: { node: "fm_2", param: "frequency" },
  fmh3: { node: "fm_3", param: "frequency" },
  fmh4: { node: "fm_4", param: "frequency" },
  fmh5: { node: "fm_5", param: "frequency" },
  fmh6: { node: "fm_6", param: "frequency" },
  fmh7: { node: "fm_7", param: "frequency" },
  fmh8: { node: "fm_8", param: "frequency" },
  pw: { node: "source", param: "pulsewidth" },
  pwrate: { node: "pw_lfo", param: "frequency" },
  pwsweep: { node: "pw_lfo", param: "depth" },
  vib: { node: "vib", param: "frequency" },
  vibmod: { node: "vib_gain", param: "gain" },
  byteBeatStartTime: { node: "source", param: "byteBeatStartTime" },
  spread: { node: "source", param: "panspread" },
  transient: { node: "transient", param: "attack" }
};
function Bn() {
  return jn;
}
const Qn = (e, t) => {
  if (e?.parameters) {
    const o = e.parameters.get(t);
    if (o instanceof AudioParam)
      return o;
  }
  let n = e?.[t];
  if (n === void 0 && t === "frequency" && (n = e?.detune ?? e?.playbackRate), n instanceof AudioParam)
    return n;
}, St = Bn(), vn = (e, t) => {
  const n = e.split("_")[0];
  return St[`${n}_${t}`] ?? St[n];
}, Gt = (e, t) => e === "frequency" && t >= 30 ? { min: 20 - t, max: 24e3 - t } : { min: void 0, max: void 0 }, En = (e, t, n) => {
  const o = z(), a = new Float32Array(256);
  for (let d = 0; d < a.length; d++) {
    const l = d / (a.length - 1) * 2 - 1;
    a[d] = se(l * n, t, n);
  }
  const c = new WaveShaperNode(o, { curve: a }), s = T(1 / n);
  return e.connect(s).connect(c), { modulator: e, toCleanup: [c, s] };
}, Xt = (e, t, n) => {
  const o = vn(e, n);
  if (!o)
    return ct(
      new Error(`Could not find control data for target '${e}'. It may not be modulatable.`),
      "superdough"
    ), { targetParams: [], paramName: e };
  const a = o.param, c = t[o.node] ? o.node : e, s = t[c];
  if (!s) {
    const l = Object.keys(t);
    return ct(
      new Error(`Could not connect to target '${c}' — it does not exist. Available targets: ${l.join(", ")}`),
      "superdough"
    ), { targetParams: [], paramName: a };
  }
  const d = [];
  return s.forEach((l) => {
    const i = Qn(l, a);
    d.push(i);
  }), { targetParams: d, paramName: a };
}, On = (e, t, n) => {
  const {
    rate: o = 1,
    sync: a,
    cps: c,
    cycle: s,
    control: d = "lfo",
    subControl: l,
    fxi: i = "main",
    depth: p = 1,
    depthabs: r,
    ...h
  } = t, { targetParams: u, paramName: m } = Xt(d, n[i], l);
  if (!u.length) return;
  let G = u[0].value;
  G = G === 0 ? 1 : G;
  const { min: b, max: f } = Gt(m, G), y = r ?? p * G, M = {
    ...h,
    frequency: a !== void 0 ? a * c : o,
    time: s / c,
    depth: y,
    min: b,
    max: f
  }, Z = Fe(z(), M);
  return n.main[`lfo_${e}`] = [Z], u.forEach((W) => Z.connect(W)), Z;
}, Dn = (e, t, n) => {
  const { control: o, subControl: a, acurve: c, dcurve: s, rcurve: d, depth: l = 1, depthabs: i, fxi: p = "main", ...r } = t, { targetParams: h, paramName: u } = Xt(o, n[p], a);
  if (!h.length) return;
  let m = h[0].value;
  m = m === 0 ? 1 : m;
  const { min: G, max: b } = Gt(u, m), f = i ?? l * m, y = Vn(z(), {
    ...r,
    depth: f,
    min: G,
    max: b,
    attackCurve: c,
    decayCurve: s,
    releaseCurve: d
  });
  return n.main[`env_${e}`] = [y], h.forEach((M) => y.connect(M)), y;
}, An = (e, t, n) => {
  const o = z(), { control: a, subControl: c, depth: s = 1, depthabs: d, fxi: l = "main" } = e, { targetParams: i, paramName: p } = Xt(a, t[l], c);
  if (!i.length) return { toCleanup: [] };
  const r = n.getBus(e.bus), h = new ConstantSourceNode(o, { offset: e.dc ?? 0 });
  h.start(e.begin);
  const u = h.connect(T(1));
  r.connect(u);
  let m = i[0].value;
  m = m === 0 ? 1 : m;
  const { min: G, max: b } = Gt(p, m), f = d ?? s * m, y = T(Math.sign(f) * Math.abs(f) / 0.3), M = u.connect(y), Z = [];
  let W = M;
  if (G !== void 0 && b !== void 0) {
    const S = En(M, G, b);
    W = S.modulator, Z.push(...S.toCleanup);
  }
  return pe(
    o,
    () => {
      i.forEach((S) => W.connect(S));
    },
    0,
    e.begin
  ), Z.push(h, u, y), { modulator: W, toCleanup: Z };
}, yt = {}, tt = {}, Eo = (e) => yt[e];
function qn(e, t) {
  var n = 1024;
  if (e < n) return e + " B";
  var o = ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"], a = -1;
  do
    e /= n, ++a;
  while (e >= n);
  return e.toFixed(1) + " " + o[a];
}
function _n(e, t) {
  const { speed: n = 1 } = e, { transpose: o, url: a, index: c, midi: s, label: d } = It(e, t);
  let l = Math.abs(n) * Math.pow(2, o / 12);
  return { transpose: o, url: a, index: c, midi: s, label: d, playbackRate: l };
}
const $n = async (e, t, n) => {
  let { url: o, label: a, playbackRate: c } = _n(e, t);
  n && (o = await n(o));
  const s = z(), d = await dt(o, s, a);
  return e.unit === "c" && (c = c * d.duration), { buffer: d, playbackRate: c };
}, eo = async (e, t, n) => {
  let { buffer: o, playbackRate: a } = await $n(e, t, n);
  e.speed < 0 && (o = to(o));
  const s = z().createBufferSource();
  s.buffer = o, s.playbackRate.value = a;
  const { loopBegin: d = 0, loopEnd: l = 1, begin: i = 0, end: p = 1 } = e, r = s.buffer.duration, h = i * r;
  e.loop && (s.loop = !0, s.loopStart = d * r, s.loopEnd = l * r);
  const m = r / s.playbackRate.value, G = (p - i) * m;
  return { bufferSource: s, offset: h, bufferDuration: r, playbackDuration: m, sliceDuration: G };
}, dt = (e, t, n, o = 0) => {
  const a = n ? `sound "${n}:${o}"` : "sample";
  if (e = e.replace("#", "%23"), !tt[e]) {
    j(`[sampler] load ${a}..`, "load-sample", { url: e });
    const c = Date.now();
    tt[e] = fetch(e).then((s) => s.arrayBuffer()).then(async (s) => {
      const d = Date.now() - c, l = qn(s.byteLength);
      j(`[sampler] load ${a}... done! loaded ${l} in ${d}ms`, "loaded-sample", { url: e });
      const i = await t.decodeAudioData(s);
      return yt[e] = i, i;
    });
  }
  return tt[e];
};
function to(e) {
  const t = z(), n = t.createBuffer(e.numberOfChannels, e.length, t.sampleRate);
  for (let o = 0; o < e.numberOfChannels; o++)
    n.copyToChannel(e.getChannelData(o).slice().reverse(), o, o);
  return n;
}
const Oo = (e) => yt[e];
function Ot(e) {
  if (e.startsWith("bubo:")) {
    const [t, n] = e.split(":");
    e = `github:Bubobubobubobubo/dough-${n}`;
  }
  return e;
}
function Dt(e, t = "") {
  if (!e.startsWith("github:"))
    throw new Error('expected "github:" at the start of pseudoUrl');
  let n = e.slice(7);
  n = n.endsWith("/") ? n.slice(0, -1) : n;
  let o = n.split("/"), a = o[0], c = o.length >= 2 ? o[1] : "samples", s = o.length >= 3 ? o[2] : "main", d = o.slice(3);
  return d.push(t || ""), d = d.join("/"), `https://raw.githubusercontent.com/${a}/${c}/${s}/${d}`;
}
const no = (e, t, n = e._base || "") => Object.entries(e).forEach(([o, a]) => {
  if (typeof a == "string" && (a = [a]), typeof a != "object")
    throw new Error("wrong sample map format for " + o);
  n = a._base || n, n = Ot(n), n.startsWith("github:") && (n = Dt(n, ""));
  const c = (s) => n + s;
  Array.isArray(a) ? a = a.map(c) : a = Object.fromEntries(
    Object.entries(a).map(([s, d]) => [s, (typeof d == "string" ? [d] : d).map(c)])
  ), t(o, a);
});
let At = {};
function Do(e, t) {
  At[e] = t;
}
function oo(e) {
  const t = Object.entries(At).find(([n]) => e.startsWith(n));
  if (t)
    return t[1];
}
async function co(e) {
  const t = oo(e);
  if (t)
    return t(e);
  if (e = Ot(e), e.startsWith("github:") && (e = Dt(e, "strudel.json")), e.startsWith("local:") && (e = "http://localhost:5432"), e.startsWith("shabda:")) {
    let [a, c] = e.split("shabda:");
    e = `https://shabda.ndre.gr/${c}.json?strudel=1`;
  }
  if (e.startsWith("shabda/speech")) {
    let [a, c] = e.split("shabda/speech");
    c = c.startsWith("/") ? c.substring(1) : c;
    let [s, d] = c.split(":"), l = "f", i = "en-GB";
    s && ([i, l] = s.split("/")), e = `https://shabda.ndre.gr/speech/${d}.json?gender=${l}&language=${i}&strudel=1'`;
  }
  if (typeof fetch != "function")
    return;
  const n = Jt(e);
  if (typeof fetch > "u")
    return;
  const o = await fetch(e).then((a) => a.json()).catch((a) => {
    throw console.error(a), new Error(`error loading "${e}"`);
  });
  return [o, o._base || n];
}
const ao = async (e, t = e._base || "", n = {}) => {
  if (typeof e == "string") {
    const [c, s] = await co(e);
    return ao(c, t || s, n);
  }
  const { prebake: o, tag: a } = n;
  no(
    e,
    (c, s) => {
      io(c, s, { baseUrl: t, prebake: o, tag: a });
    },
    t
  );
}, Kt = [];
async function so(e, t, n, o, a) {
  let {
    s: c,
    nudge: s = 0,
    // TODO: is this in seconds?
    cut: d,
    loop: l,
    clip: i = void 0,
    // if set, samples will be cut off when the hap ends
    n: p = 0,
    speed: r = 1,
    // sample playback speed
    duration: h
  } = t;
  if (r === 0)
    return;
  const u = z();
  let [m, G, b, f] = $([t.attack, t.decay, t.sustain, t.release]);
  const { bufferSource: y, sliceDuration: M, offset: Z } = await eo(t, o, a);
  if (!y) {
    j(`[sampler] could not load "${c}:${p}"`, "error");
    return;
  }
  if (u.currentTime > e) {
    j(`[sampler] loading sound "${c}:${p}" took too long`, "highlight"), Y(y);
    return;
  }
  const W = Te(y.detune, t, e), S = e + s;
  y.start(S, Z);
  const Q = u.createGain(), F = y.connect(Q);
  i == null && l == null && t.release == null && (h = M);
  let N = e + h;
  _(F.gain, m, G, b, f, 0, 1, e, N, "linear"), He(y.detune, t, e, N);
  const g = u.createGain();
  F.connect(g), ue(y, function() {
    Y(y), W?.stop(), Y(F), Y(g), n();
  });
  let C = N + f + 0.01;
  y.stop(C);
  const K = (k) => {
    y.stop(k);
  }, I = { node: g, nodes: { source: [y], ...W?.nodes }, stop: K };
  if (d !== void 0) {
    const k = Kt[d];
    k && (k.node.gain.setValueAtTime(1, S), k.node.gain.linearRampToValueAtTime(0, S + 0.01)), Kt[d] = I;
  }
  return I;
}
function lo(e, t, n) {
  ce(e, (o, a, c) => so(o, a, c, t), {
    type: "sample",
    samples: t,
    ...n
  });
}
function io(e, t, n) {
  e.startsWith("wt_") ? _t(e, t, n) : lo(e, t, n);
}
const fe = (e, t) => e !== void 0 && e !== t, lt = (e) => new GainNode(e, { gain: 1, channelCount: 2, channelCountMode: "explicit" });
class ro {
  reverbNode;
  delayNode;
  output;
  summingNode;
  djfNode;
  audioContext;
  constructor(t) {
    this.audioContext = t, this.output = lt(t), this.summingNode = lt(t), this.summingNode.connect(this.output);
  }
  disconnect() {
    this.output.disconnect(), this.summingNode.disconnect(), this.delayNode?.disconnect(), this.reverbNode?.disconnect();
  }
  getDjf(t, n = 0) {
    return this.djfNode == null && (this.djfNode = q(this.audioContext, "djf-processor", { value: t }), this.summingNode.disconnect(), this.summingNode.connect(this.djfNode), this.djfNode.connect(this.output)), this.djfNode.parameters.get("value").setValueAtTime(t, n), this.djfNode;
  }
  getDelay(t = 0, n = 0.5, o) {
    return n = se(n, 0, 0.98), this.delayNode == null && (this.delayNode = this.audioContext.createFeedbackDelay(1, t, n), this.delayNode.connect(this.summingNode), this.delayNode.start?.(o)), this.delayNode.delayTime.value !== t && this.delayNode.delayTime.setValueAtTime(t, o), this.delayNode.feedback.value !== n && this.delayNode.feedback.setValueAtTime(n, o), this.delayNode;
  }
  getReverb(t, n, o, a, c, s, d) {
    return this.reverbNode == null && (this.reverbNode = this.audioContext.createReverb(t, n, o, a, c, s, d), this.reverbNode.connect(this.summingNode)), (fe(t, this.reverbNode.duration) || fe(n, this.reverbNode.fade) || fe(o, this.reverbNode.lp) || fe(a, this.reverbNode.dim) || fe(s, this.reverbNode.irspeed) || fe(d, this.reverbNode.irbegin) || this.reverbNode.ir !== c) && this.reverbNode.generate(t, n, o, a, c, s, d), this.reverbNode;
  }
  sendReverb(t, n) {
    return Ue(t, this.reverbNode, n);
  }
  sendDelay(t, n) {
    return Ue(t, this.delayNode, n);
  }
  duck(t, n = 0, o = 0.1, a = 1) {
    const c = n, s = Math.max(o, 2e-3), d = this.output.gain;
    pe(
      this.audioContext,
      () => {
        const l = this.audioContext.currentTime, i = d.value;
        d.cancelScheduledValues(l), d.setValueAtTime(i, l);
        const p = Math.max(t, l), r = se(1 - Math.sqrt(a), 0.01, i);
        d.exponentialRampToValueAtTime(r, p + c), d.exponentialRampToValueAtTime(1, p + c + s);
      },
      0,
      t - 0.01
    );
  }
  connectToOutput(t) {
    t.connect(this.summingNode);
  }
}
class po {
  channelMerger;
  destinationGain;
  constructor(t) {
    this.audioContext = t, this.initializeAudio();
  }
  initializeAudio() {
    const t = this.audioContext, n = t.destination.maxChannelCount;
    this.audioContext.destination.channelCount = n, this.channelMerger = new ChannelMergerNode(t, { numberOfInputs: t.destination.channelCount }), this.destinationGain = new GainNode(t), this.channelMerger.connect(this.destinationGain), this.destinationGain.connect(t.destination);
  }
  reset() {
    this.disconnect(), this.initializeAudio();
  }
  disconnect() {
    this.channelMerger.disconnect(), this.destinationGain.disconnect(), this.destinationGain = null, this.channelMerger = null;
  }
  connectToDestination = (t, n = [0, 1]) => {
    const o = new StereoPannerNode(this.audioContext);
    t.connect(o);
    const a = new ChannelSplitterNode(this.audioContext, {
      numberOfOutputs: o.channelCount
    });
    o.connect(a), n.forEach((c, s) => {
      a.connect(this.channelMerger, s % o.channelCount, c % this.audioContext.destination.channelCount);
    });
  };
}
class uo {
  audioContext;
  output;
  nodes = {};
  buses = {};
  constructor(t) {
    this.audioContext = t, this.output = new po(t);
  }
  reset() {
    Object.values(this.nodes).forEach((t) => {
      t.disconnect();
    }), Object.values(this.buses).forEach((t) => {
      t.disconnect();
    }), this.nodes = {}, this.buses = {}, this.output.reset();
  }
  duck(t, n, o = 0, a = 0.1, c = 1) {
    const s = [t].flat(), d = [o].flat(), l = [a].flat(), i = [c].flat();
    s.forEach((p, r) => {
      const h = this.nodes[p];
      if (h == null) {
        ct(new Error(`duck target orbit ${p} does not exist`), "superdough");
        return;
      }
      const u = d[r] ?? d[0], m = Math.max(l[r] ?? l[0], 2e-3), G = i[r] ?? i[0];
      h.duck(n, u, m, G);
    });
  }
  getOrbit(t, n) {
    return this.nodes[t] == null && (this.nodes[t] = new ro(this.audioContext), this.output.connectToDestination(this.nodes[t].output, n)), this.nodes[t];
  }
  getBus(t) {
    return this.buses[t] == null && (this.buses[t] = lt(this.audioContext)), this.buses[t];
  }
}
const gt = Object.freeze({
  NONE: 0,
  ASYM: 1,
  MIRROR: 2,
  BENDP: 3,
  BENDM: 4,
  BENDMP: 5,
  SYNC: 6,
  QUANT: 7,
  FOLD: 8,
  PWM: 9,
  ORBIT: 10,
  SPIN: 11,
  CHAOS: 12,
  PRIMES: 13,
  BINARY: 14,
  BROWNIAN: 15,
  RECIPROCAL: 16,
  WORMHOLE: 17,
  LOGISTIC: 18,
  SIGMOID: 19,
  FRACTAL: 20,
  FLIP: 21
}), it = /* @__PURE__ */ new Set();
function ho() {
  it.clear();
}
async function mo(e, t, n = 2048) {
  const o = `${e},${n}`;
  if (!it.has(o)) {
    const c = (await bo(e, t)).getChannelData(0), s = c.length, d = Math.max(1, Math.floor(s / n)), l = new Array(d);
    for (let i = 0; i < d; i++) {
      const p = i * n;
      l[i] = c.subarray(p, p + n);
    }
    return it.add(o), { frames: l, frameLen: n, numFrames: d, key: o };
  }
  return { frameLen: n, key: o };
}
function Go(e, t) {
  var n = 1024;
  if (e < n) return e + " B";
  var o = ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"], a = -1;
  do
    e /= n, ++a;
  while (e >= n);
  return e.toFixed(1) + " " + o[a];
}
function Xo(e) {
  const t = new DataView(e);
  let n = 12;
  for (; n + 8 <= t.byteLength; ) {
    const o = String.fromCharCode(t.getUint8(n), t.getUint8(n + 1), t.getUint8(n + 2), t.getUint8(n + 3)), a = t.getUint32(n + 4, !0);
    if (o === "fmt ")
      return t.getUint32(n + 12, !0);
    n += 8 + a + (a & 1);
  }
  return null;
}
async function yo(e) {
  const t = Xo(e) || 44100;
  return await new OfflineAudioContext(1, 1, t).decodeAudioData(e);
}
const nt = {}, bo = (e, t) => {
  if (e = e.replace("#", "%23"), !nt[e]) {
    j(`[wavetable] load table ${t}..`, "load-table", { url: e });
    const n = Date.now();
    nt[e] = fetch(e).then((o) => o.arrayBuffer()).then(async (o) => {
      const a = Date.now() - n, c = Go(o.byteLength);
      return j(`[wavetable] load table ${t}... done! loaded ${c} in ${a}ms`, "loaded-table", { url: e }), await yo(o);
    });
  }
  return nt[e];
};
function qt(e, t = "") {
  if (!e.startsWith("github:"))
    throw new Error('expected "github:" at the start of pseudoUrl');
  let [n, o] = e.split("github:");
  return o = o.endsWith("/") ? o.slice(0, -1) : o, o.split("/").length === 2 && (o += "/main"), `https://raw.githubusercontent.com/${o}/${t}`;
}
const Nt = (e, t, n, o = {}) => (t = e._base || t, Object.entries(e).forEach(([a, c]) => {
  if (a === "_base") return !1;
  if (typeof c == "string" && (c = [c]), typeof c != "object")
    throw new Error("wrong json format for " + a);
  let s = t;
  s.startsWith("github:") && (s = qt(s, "")), c = c.map((d) => s + d).filter((d) => d.toLowerCase().endsWith(".wav") ? !0 : (j(`[wavetable] skipping ${d} -- wavetables must be ".wav" format`), !1)), c.length && _t(a, c, { baseUrl: t, frameLen: n });
}));
function _t(e, t, n) {
  ce(
    e,
    (o, a, c, s) => Zo(o, a, c, t, s, n?.frameLen ?? 2048),
    {
      type: "wavetable",
      tables: t,
      ...n
    }
  );
}
const Ao = async (e, t, n, o = {}) => {
  if (n !== void 0) return Nt(n, e, t);
  e.startsWith("github:") && (e = qt(e, "strudel.json")), e.startsWith("local:") && (e = "http://localhost:5432");
  const a = Jt(e);
  if (typeof fetch == "function" && !(typeof fetch > "u"))
    return fetch(e).then((c) => c.json()).then((c) => Nt(c, a, t, o)).catch((c) => {
      throw console.error(c), new Error(`error loading "${e}"`);
    });
};
async function Zo(e, t, n, o, a, c) {
  const { s, n: d = 0, duration: l, clip: i } = t, p = z(), [r, h, u, m] = $([t.attack, t.decay, t.sustain, t.release]);
  let { warpmode: G } = t;
  typeof G == "string" && (G = gt[G.toUpperCase()] ?? gt.NONE);
  const b = Xe(t), { url: f, label: y } = It(t, o), M = await mo(f, y, c);
  let Z = e + l;
  i !== void 0 && (Z = Math.min(e + i * l, Z));
  const W = Z + m, S = W + 0.01, Q = {
    begin: e,
    end: S,
    frequency: b,
    freqspread: t.detune,
    position: t.wt,
    warp: t.warp,
    warpMode: G,
    voices: Math.max(t.unison ?? 1, 1),
    panspread: t.spread,
    phaserand: t.wtphaserand ?? t.unison > 1 ? 1 : 0
  }, N = we("wavetable", () => new AudioWorkletNode(p, "wavetable-oscillator-processor", { outputChannelCount: [2] }));
  if (Object.entries(Q).forEach(([Ye, oe]) => {
    const me = N.parameters.get(Ye), Ee = oe !== void 0 ? oe : me.defaultValue;
    me.value = Ee;
  }), N.port.postMessage({ type: "initialize", payload: M }), p.currentTime > e) {
    j(`[wavetable] still loading sound "${s}:${d}"`, "highlight");
    return;
  }
  const g = [t.wtattack, t.wtdecay, t.wtsustain, t.wtrelease], C = [t.warpattack, t.warpdecay, t.warpsustain, t.warprelease], K = N.parameters, I = K.get("position"), k = K.get("warp");
  let O = t.wtrate;
  t.wtsync != null && (O = a * t.wtsync);
  const w = zt(
    p,
    I,
    e,
    W,
    {
      offset: t.wt,
      amount: t.wtenv,
      defaultAmount: 0.5,
      shape: "linear",
      values: g,
      holdEnd: Z,
      defaultValues: [0, 0.5, 0, 0.1]
    },
    {
      frequency: O,
      depth: t.wtdepth,
      defaultDepth: 0.5,
      shape: t.wtshape,
      skew: t.wtskew,
      dcoffset: t.wtdc ?? 0
    }
  );
  let E = t.warprate;
  t.warpsync != null && (E = E = a * t.warpsync);
  const ee = zt(
    p,
    k,
    e,
    W,
    {
      offset: t.warp,
      amount: t.warpenv,
      defaultAmount: 0.5,
      shape: "linear",
      values: C,
      holdEnd: Z,
      defaultValues: [0, 0.5, 0, 0.1]
    },
    {
      frequency: E,
      depth: t.warpdepth,
      defaultDepth: 0.5,
      shape: t.warpshape,
      skew: t.warpskew,
      dcoffset: t.warpdc ?? 0
    }
  ), he = Te(N.parameters.get("detune"), t, e), Re = je(N.parameters.get("frequency"), t, e), Qe = p.createGain(), de = N.connect(Qe);
  _(de.gain, r, h, u, m, 0, 0.3, e, Z, "linear"), He(N.parameters.get("detune"), t, e, Z);
  const be = {
    node: de,
    nodes: {
      source: [N],
      wt_lfo: [w],
      warp_lfo: [ee],
      ...Re?.nodes,
      ...he?.nodes
    }
  }, ve = pe(
    p,
    () => {
      ht(N), he?.stop(), Re?.stop(), Y(w), Y(ee), n();
    },
    e,
    S
  );
  return be.stop = (Ye) => {
    ve.stop(Ye);
  }, be;
}
const $t = 128, rt = "System Standard";
let en = $t;
function Wo(e) {
  en = parseInt(e) ?? $t;
}
let tn = !1;
function fo(e) {
  tn = e == !0;
}
const ae = rn();
function ce(e, t, n = {}) {
  e = e.toLowerCase().replace(/\s+/g, "_"), ae.setKey(e, { onTrigger: t, data: n });
}
let nn = (e) => e;
function ie(e) {
  return nn(e);
}
function qo(e) {
  nn = e;
}
function pt(e) {
  for (const n in e)
    e[n.toLowerCase()] = e[n];
  const t = ae.get();
  for (const n in t) {
    const [o, a] = n.split("_");
    if (!a) continue;
    const c = e[o];
    if (c) {
      if (typeof c == "string")
        t[`${c}_${a}`.toLowerCase()] = t[n];
      else if (Array.isArray(c))
        for (const s of c)
          t[`${s}_${a}`.toLowerCase()] = t[n];
    }
  }
  ae.set({ ...t });
}
async function Mo(e) {
  const n = await (await fetch(e)).json();
  pt(n);
}
async function _o(...e) {
  switch (e.length) {
    case 1:
      return typeof e[0] == "string" ? Mo(e[0]) : pt(e[0]);
    case 2:
      return pt({ [e[0]]: e[1] });
    default:
      throw new Error("aliasMap expects 1 or 2 arguments, received " + e.length);
  }
}
function $o(e, t) {
  if (Me(e) == null) {
    j("soundAlias: original sound not found");
    return;
  }
  ae.setKey(t, Me(e));
}
function Me(e) {
  return typeof e != "string" ? (console.warn(`getSound: expected string got "${e}". fall back to triangle`), ae.get().triangle) : ae.get()[e.toLowerCase()];
}
const Vo = async () => {
  await navigator.mediaDevices.getUserMedia({ audio: !0 });
  let e = await navigator.mediaDevices.enumerateDevices();
  e = e.filter((n) => n.kind === "audiooutput" && n.deviceId !== "default");
  const t = /* @__PURE__ */ new Map();
  return t.set(rt, ""), e.forEach((n) => {
    t.set(n.label, n.deviceId);
  }), t;
};
let Ce = {
  s: "triangle",
  gain: 0.8,
  postgain: 1,
  density: ".03",
  channels: [1, 2],
  phaserdepth: 0.75,
  shapevol: 1,
  distortvol: 1,
  distorttype: 0,
  delay: 0,
  busgain: 1,
  byteBeatExpression: "0",
  delayfeedback: 0.5,
  delaysync: 3 / 16,
  orbit: 1,
  i: 1,
  velocity: 1,
  fft: 8,
  tremolodepth: 1,
  tremolophase: 0,
  release: 0.01
};
const Lo = Object.freeze({ ...Ce });
function ec(e, t) {
  Ce[e] = t;
}
function tc() {
  Ce = { ...Lo };
}
let bt = new Map(Object.entries(Ce));
function on(e, t) {
  bt.set(e, t);
}
function U(e) {
  return bt.get(e);
}
function nc(e) {
  Object.keys(e).forEach((t) => {
    on(t, e[t]);
  });
}
function xo() {
  bt = new Map(Object.entries(Ce));
}
function oc(e) {
  xo(), e === "1.0" && on("fanchor", 0.5);
}
const cc = () => ae.set({});
let cn = [];
function ac(e) {
  cn.push(e);
}
let Je;
function zo() {
  if (!Je) {
    const e = z(), t = cn.concat([Un]);
    Je = Promise.all(t.map((n) => e.audioWorklet.addModule(n))).then(
      () => Je = void 0
    );
  }
  return Je;
}
async function Ro(e = {}) {
  const {
    disableWorklets: t = !1,
    maxPolyphony: n,
    audioDeviceName: o = rt,
    multiChannelOrbits: a = !1
  } = e;
  if (Wo(n), fo(a), ho(), typeof window > "u")
    return;
  const c = z();
  if (o != null && o != rt)
    try {
      const d = (await Vo()).get(o), l = (d ?? "").length > 0;
      c.sinkId !== d && l && await c.setSinkId(d), j(
        `[superdough] Audio Device set to ${o}, it might take a few seconds before audio plays on all output channels`
      );
    } catch {
      j("[superdough] failed to set audio interface", "warning");
    }
  if (!c instanceof OfflineAudioContext && await c.resume(), t) {
    j("[superdough]: AudioWorklets disabled with disableWorklets");
    return;
  }
  try {
    await zo(), j("[superdough] AudioWorklets loaded");
  } catch (s) {
    console.warn("could not load AudioWorklet effects", s);
  }
  j("[superdough] ready");
}
let ot;
async function sc(e) {
  return ot || (ot = new Promise((t) => {
    document.addEventListener("mousedown", async function n() {
      document.removeEventListener("mousedown", n), await Ro(e), t();
    });
  })), ot;
}
let ye;
function Zt() {
  return ye == null && (ye = new uo(z())), ye;
}
function dc(e) {
  return ye = e, ye;
}
function lc(e, t) {
  Zt().output.connectToDestination(e, t);
}
function Yo(e, t, n = 1, o = 0.5, a = 1e3, c = 2e3) {
  const s = z(), d = Fe(s, { frequency: n, depth: c * 2, begin: e, end: t }), l = 1;
  let i = 282;
  const p = [];
  for (let r = 0; r < l; r++) {
    const h = we("filter", () => s.createBiquadFilter());
    h.type = "notch", h.gain.value = 1, h.frequency.value = a + i, h.Q.value = 2 - Math.min(Math.max(o * 2, 0), 1.9), d.connect(h.detune), i += 282, p.push(h);
  }
  return { filterChain: p, lfo: d };
}
function So(e) {
  e = e ?? 0;
  const t = ["12db", "ladder", "24db"];
  return typeof e == "number" ? t[Math.floor(Pt(e, t.length))] : e;
}
let ne = {}, Le = {};
function Ko(e, t = 1024, n = 0.5) {
  if (!ne[e] || ne[e].context != z()) {
    const o = z().createAnalyser();
    o.fftSize = t, o.smoothingTimeConstant = n, ne[e] = o, Le[e] = new Float32Array(ne[e].frequencyBinCount);
  }
  return ne[e].fftSize !== t && (ne[e].fftSize = t, Le[e] = new Float32Array(ne[e].frequencyBinCount)), ne[e];
}
function ic(e = "time", t = 1) {
  const n = {
    time: () => ne[t]?.getFloatTimeDomainData(Le[t]),
    frequency: () => ne[t]?.getFloatFrequencyData(Le[t])
  }[e];
  if (!n)
    throw new Error(`getAnalyzerData: ${e} not supported. use one of ${Object.keys(n).join(", ")}`);
  return n(), Le[t];
}
function rc() {
  ye?.reset(), ne = {}, Le = {};
}
let Ne = /* @__PURE__ */ new Map();
function Ht(e) {
  return (Array.isArray(e) ? e : [e]).map((t) => t - 1);
}
class go {
  constructor() {
    this.audioNodes = [], this.tails = [];
  }
  connect(...t) {
    return t.forEach((n) => {
      this.tails.forEach((o) => {
        o.connect(n);
      });
    }), this.tails = t, this.audioNodes.push(...t), this;
  }
  connectOne(t, n) {
    return this.tails[t].connect(n), this.tails[t] = n, this.audioNodes.push(n), this;
  }
  releaseNodes() {
    this.audioNodes.forEach((t) => hn(t) ? ht(t) : Y(t)), this.audioNodes = [], this.tails = [];
  }
}
const No = async (e, t, n, o = 0.5, a = 0.5) => {
  const c = { main: {} }, s = z(), d = Zt();
  let { stretch: l } = e;
  if (l != null && (t = t - 0.04), typeof e != "object")
    throw new Error(
      `expected hap.value to be an object, but got "${e}". Hint: append .note() or .s() to the end`,
      "error"
    );
  if (e.duration = n, t < s.currentTime) {
    console.warn(
      `[superdough]: cannot schedule sounds in the past (target: ${t.toFixed(2)}, now: ${s.currentTime.toFixed(2)})`
    );
    return;
  }
  let {
    s: i = U("s"),
    bank: p,
    source: r,
    postgain: h = U("postgain"),
    duckorbit: u,
    duckonset: m,
    duckattack: G,
    duckdepth: b,
    djf: f,
    release: y = U("release"),
    dry: M,
    delay: Z = U("delay"),
    delayfeedback: W = U("delayfeedback"),
    delaysync: S = U("delaysync"),
    delaytime: Q,
    orbit: F = U("orbit"),
    bus: N,
    busgain: g = U("busgain"),
    room: C,
    roomfade: K,
    roomlp: I,
    roomdim: k,
    roomsize: O,
    ir: w,
    irspeed: E,
    irbegin: ee,
    i: he = U("i"),
    analyze: Re,
    // analyser wet
    fft: Qe = U("fft"),
    // fftSize 0 - 10
    FX: de = [],
    FXrelease: be
  } = e;
  Q = Q ?? Lt(S, o);
  const ve = Ht(
    tn && F > 0 ? [F * 2 - 1, F * 2] : U("channels")
  ), Ye = e.channels != null ? Ht(e.channels) : ve, oe = d.getOrbit(F, Ye);
  u != null && d.duck(u, t, m, G, b), h = ie(h), Z = ie(Z), g = ie(g);
  const me = t + n, Ee = Math.max(y, be ?? 0), le = me + Ee, Oe = Math.round(Math.random() * 1e6);
  for (let R = 0; R <= Ne.size - en; R++) {
    const X = Ne.entries().next(), v = X.value[1].deref(), L = X.value[0], P = t + 0.25;
    v?.node?.gain?.linearRampToValueAtTime(0, P), v?.stop?.(P), Ne.delete(L);
  }
  if (["-", "~", "_"].includes(i))
    return;
  p && i && (i = `${p}_${i}`, e.s = i);
  const x = new go();
  let Se;
  if (r)
    Se = r(t, e, n, o), c.main.source = [Se];
  else if (Me(i)) {
    const { onTrigger: R } = Me(i), v = await R(t, e, () => pe(
      s,
      () => {
        x.releaseNodes(), Ne.delete(Oe);
      },
      0,
      le
    ), o);
    v && (Se = v.node, Ne.set(Oe, new WeakRef(v)), c.main = { ...c.main, ...v.nodes });
  } else
    throw new Error(`sound ${i} not found! Is it loaded?`);
  if (!Se)
    return;
  if (s.currentTime > t) {
    j("[webaudio] skip hap: still loading", s.currentTime - t);
    return;
  }
  x.connect(Se), de = [...de, e];
  for (let [R, X] of Object.entries(de)) {
    const v = R == de.length - 1 ? "main" : R;
    c[v] ??= {};
    const L = c[v];
    let {
      gain: P = U("gain"),
      velocity: te = U("velocity"),
      shapevol: De = U("shapevol"),
      distorttype: sn = U("distorttype"),
      distortvol: Ae = U("distortvol"),
      tremolodepth: ke = U("tremolodepth"),
      phaserdepth: Wt = U("phaserdepth"),
      delay: ft = U("delay"),
      delayfeedback: Pe = U("delayfeedback"),
      delaysync: dn = U("delaysync"),
      delaytime: Ie,
      i: ln = U("i")
    } = X;
    if (P = ie(re(P, 1)), De = ie(De), Ae = ie(Ae), te = ie(te), ke = ie(ke), P *= te, Ie = Ie ?? Lt(dn, o), X.workletSrc !== void 0) {
      const V = q(s, "generic-processor", {}, { outputChannelCount: [2] });
      x.connect(V);
      const H = X.workletSrc.replace(/\bpat\[(\d+)\]/g, (A, Ke) => X.workletInputs[Ke]).replaceAll("sFreq", Xe(e)).replaceAll("sGate", `cc('strudel-gate-${Oe}')`), { src: B, ugens: J, registers: D } = compileKabel(H);
      V.port.postMessage({ src: B, schema: { ugens: J, registers: D }, start: t, gateEnd: me, end: le });
    }
    if (X.stretch !== void 0) {
      const V = q(s, "phase-vocoder-processor", { pitchFactor: X.stretch });
      x.connect(V), L.stretch = [V];
    }
    if (X.transient !== void 0) {
      const V = q(
        s,
        "transient-processor",
        {},
        {
          processorOptions: {
            attack: X.transient,
            sustain: X.transsustain,
            begin: t,
            end: le
          }
        }
      );
      x.connect(V), L.transient = V;
    }
    const Mt = T(P);
    L.gain = [Mt], x.connect(Mt);
    const qe = So(e.ftype), Ze = (V) => xn(s, t, me, V, o, a);
    if (X.cutoff !== void 0) {
      const H = et(X, {
        frequency: "cutoff",
        q: "resonance",
        attack: "lpattack",
        decay: "lpdecay",
        sustain: "lpsustain",
        release: "lprelease",
        env: "lpenv",
        anchor: "fanchor",
        model: "ftype",
        drive: "drive",
        rate: "lprate",
        sync: "lpsync",
        depth: "lpdepth",
        depthfrequency: "lpdepthfrequency",
        shape: "lpshape",
        dcoffset: "lpdc",
        skew: "lpskew"
      });
      H.type = "lowpass";
      const { filter: B, lfo: J } = Ze(H);
      if (L.lpf = [B], L.lpf_lfo = [J], x.connect(B), J && x.audioNodes.push(J), qe === "24db") {
        const { filter: D, lfo: A } = Ze(H);
        L.lpf.push(D), L.lpf_lfo.push(A), x.connect(D), A && x.audioNodes.push(A);
      }
    }
    if (X.hcutoff !== void 0) {
      const H = et(X, {
        frequency: "hcutoff",
        q: "hresonance",
        attack: "hpattack",
        decay: "hpdecay",
        sustain: "hpsustain",
        release: "hprelease",
        env: "hpenv",
        anchor: "fanchor",
        model: "ftype",
        drive: "drive",
        rate: "hprate",
        sync: "hpsync",
        depth: "hpdepth",
        depthfrequency: "hpdepthfrequency",
        shape: "hpshape",
        dcoffset: "hpdc",
        skew: "hpskew"
      });
      H.type = "highpass";
      const { filter: B, lfo: J } = Ze(H);
      if (L.hpf = [B], L.hpf_lfo = [J], J && x.audioNodes.push(J), x.connect(B), qe === "24db") {
        const { filter: D, lfo: A } = Ze(H);
        L.hpf.push(D), L.hpf_lfo.push(A), x.connect(D), A && x.audioNodes.push(A);
      }
    }
    if (X.bandf !== void 0) {
      const H = et(X, {
        frequency: "bandf",
        q: "bandq",
        attack: "bpattack",
        decay: "bpdecay",
        sustain: "bpsustain",
        release: "bprelease",
        env: "bpenv",
        anchor: "fanchor",
        model: "ftype",
        drive: "drive",
        rate: "bprate",
        sync: "bpsync",
        depth: "bpdepth",
        depthfrequency: "bpdepthfrequency",
        shape: "bpshape",
        dcoffset: "bpdc",
        skew: "bpskew"
      });
      H.type = "bandpass";
      const { filter: B, lfo: J } = Ze(H);
      if (L.bpf = [B], L.bpf_lfo = [J], x.connect(B), J && x.audioNodes.push(J), qe === "24db") {
        const { filter: D, lfo: A } = Ze(H);
        L.bpf.push(D), L.bpf_lfo.push(A), x.connect(D), A && x.audioNodes.push(A);
      }
    }
    if (X.vowel !== void 0) {
      const V = s.createVowelFilter(X.vowel);
      L.vowel = V.filters, x.connect(V);
    }
    if (X.coarse !== void 0) {
      const V = q(s, "coarse-processor", { coarse: X.coarse });
      L.coarse = [V], x.connect(V);
    }
    if (X.crush !== void 0) {
      const V = q(s, "crush-processor", { crush: X.crush });
      L.crush = [V], x.connect(V);
    }
    if (X.shape !== void 0) {
      const V = q(s, "shape-processor", { shape: X.shape, postgain: De });
      L.shape = [V], x.connect(V);
    }
    if (X.distort !== void 0) {
      const V = Cn(X.distort, Ae, sn);
      L.distort = [V], x.connect(V);
    }
    let _e = X.tremolo;
    if (X.tremolosync != null && (_e = o * X.tremolosync), _e !== void 0) {
      const V = Math.max(1 - ke, 0), H = new GainNode(s, { gain: V }), B = a / o, J = Fe(s, {
        skew: X.tremoloskew ?? (X.tremoloshape != null ? 0.5 : 1),
        frequency: _e,
        depth: ke,
        time: B,
        dcoffset: 0,
        shape: X.tremoloshape,
        phaseoffset: X.tremolophase,
        min: 0,
        max: 1,
        curve: 1.5,
        begin: t,
        end: le
      });
      L.tremolo = [J], L.tremolo_gain = [H], J.connect(H.gain), x.audioNodes.push(J), x.connect(H);
    }
    if (X.compressor !== void 0) {
      const V = Ln(
        s,
        X.compressor,
        X.compressorRatio,
        X.compressorKnee,
        X.compressorAttack,
        X.compressorRelease
      );
      L.compressor = [V], x.connect(V);
    }
    if (X.pan !== void 0) {
      const V = s.createStereoPanner();
      L.pan = [V], V.pan.value = 2 * X.pan - 1, x.connect(V);
    }
    if (X.phaserrate !== void 0 && Wt > 0) {
      const { filterChain: V, lfo: H } = Yo(
        t,
        le,
        X.phaserrate,
        Wt,
        X.phasercenter,
        X.phasersweep
      );
      L.phaser = [...V], L.phaser_lfo = [H], V.forEach((B) => x.connect(B)), x.audioNodes.push(H);
    }
    if (v !== "main" && ft > 0 && Ie > 0 && Pe > 0) {
      const V = T(1);
      Pe = se(Pe, 0, 0.98);
      const H = s.createFeedbackDelay(1, Ie, Pe), B = T(ft), J = T(X.dry ?? 1), D = new GainNode(s, { gain: 1, channelCount: 2, channelCountMode: "explicit" });
      x.connect(V).connect(J, H).connectOne(1, B).connect(D), x.audioNodes.push(H.feedbackGain, H.delayGain), L.delay = [H], L.delay_mix = [B];
    }
    if (v !== "main" && X.room > 0) {
      let V;
      if (X.ir !== void 0) {
        let Ke, We = Me(X.ir);
        Array.isArray(We) ? Ke = We.data.samples[X.i % We.data.samples.length] : typeof We == "object" && (Ke = Object.values(We.data.samples).flat()[ln % Object.values(We.data.samples).length]), V = await dt(Ke, s, X.ir, 0);
      }
      const H = T(1), B = s.createReverb(
        X.roomsize,
        X.roomfade,
        X.roomlp,
        X.roomdim,
        V,
        X.irspeed,
        X.irbegin
      ), J = T(X.room), D = T(X.dry ?? 1), A = new GainNode(s, { gain: 1, channelCount: 2, channelCountMode: "explicit" });
      x.connect(H).connect(D, B).connectOne(1, J).connect(A), L.room = [B], L.room_mix = [J];
    }
  }
  if (be !== void 0 && be > y) {
    const R = T(1);
    R.gain.setValueAtTime(1, me + y), R.gain.linearRampToValueAtTime(0, le), x.connect(R);
  }
  const Ge = new GainNode(s, { gain: h });
  if (c.main.post = [Ge], x.connect(Ge), Z > 0 && Q > 0 && W > 0) {
    const R = oe.getDelay(Q, W, t);
    c.main.delay = [R];
    const X = oe.sendDelay(Ge, Z);
    c.main.delay_mix = [X], x.audioNodes.push(X);
  }
  if (C > 0) {
    let R;
    if (w !== void 0) {
      let L, P = Me(w);
      Array.isArray(P) ? L = P.data.samples[he % P.data.samples.length] : typeof P == "object" && (L = Object.values(P.data.samples).flat()[he % Object.values(P.data.samples).length]), R = await dt(L, s, w, 0);
    }
    const X = oe.getReverb(O, K, I, k, R, E, ee);
    c.main.room = [X];
    const v = oe.sendReverb(Ge, C);
    c.main.room_mix = [v], x.audioNodes.push(v);
  }
  if (N != null) {
    const R = d.getBus(N), X = Ue(Ge, R, g);
    x.audioNodes.push(X);
  }
  if (f != null) {
    const R = oe.getDjf(f, t);
    c.main.djf = [R];
  }
  if (Re && !(s instanceof OfflineAudioContext)) {
    const R = Ko(Re, 2 ** (Qe + 5)), X = Ue(Ge, R, 1);
    x.audioNodes.push(X);
  }
  if (M != null) {
    M = ie(M);
    const R = new GainNode(s, { gain: M });
    x.connect(R), oe.connectToOutput(R);
  } else
    oe.connectToOutput(Ge);
  de.forEach((R, X) => {
    const v = X === de.length - 1 ? "main" : X;
    if (R.lfo)
      for (const L of R.lfo.__ids) {
        const P = R.lfo[L];
        P.fxi ??= v;
        const te = On(
          L,
          {
            ...P,
            cps: o,
            cycle: a,
            begin: t,
            end: le
          },
          c
        );
        te && x.audioNodes.push(te);
      }
    if (R.env)
      for (const L of R.env.__ids) {
        const P = R.env[L];
        P.fxi ??= v;
        const te = Dn(
          L,
          {
            ...P,
            begin: t,
            end: le
          },
          c
        );
        te && x.audioNodes.push(te);
      }
    if (R.bmod)
      for (const L of R.bmod.__ids) {
        const P = R.bmod[L];
        P.fxi ??= v;
        const { toCleanup: te } = An({ ...P, begin: t, end: le }, c, ye);
        x.audioNodes.push(...te);
      }
  });
}, pc = (e, t, n, o) => {
  No(t, e - n, t.duration / o, o);
}, Ho = ["triangle", "square", "sawtooth", "sine", "user", "one"], To = [
  ["tri", "triangle"],
  ["sqr", "square"],
  ["saw", "sawtooth"],
  ["sin", "sine"]
];
function wo(e, t) {
  const n = e, o = new Float32Array(t);
  for (let a = 0; a < t; a++) {
    const c = a * 2 / t - 1;
    o[a] = Math.tanh(c * n);
  }
  return o;
}
function uc() {
  [...Ho].forEach((e) => {
    ce(
      e,
      (t, n, o) => {
        const [a, c, s, d] = $(
          [n.attack, n.decay, n.sustain, n.release],
          "linear",
          [1e-3, 0.05, 0.6, 0.01]
        ), l = T(0.3), i = Co(e, t, n, () => {
          Y(l), o();
        }), { node: p, nodes: r, stop: h, triggerRelease: u } = i, { duration: m } = n, G = T(1), b = p.connect(l).connect(G), f = t + m;
        _(b.gain, a, c, s, d, 0, 1, t, f, "linear");
        const y = f + d + 0.01;
        return u?.(y), h(y), {
          node: b,
          nodes: r,
          stop: (M) => {
            h(M);
          }
        };
      },
      { type: "synth", prebake: !0 }
    );
  }), ce(
    "sbd",
    (e, t, n) => {
      const { duration: o, decay: a = 0.5, pdecay: c = 0.5, penv: s = 36, clip: d } = t, l = z(), i = 0.02, p = 1.2, r = 0.025, h = 1, u = l.createOscillator();
      u.type = "triangle", u.frequency.value = Xe(t, 29), u.detune.setValueAtTime(s * 100, 0), u.detune.setValueAtTime(s * 100, e), u.detune.exponentialRampToValueAtTime(1e-3, e + c);
      const m = T(1);
      m.gain.setValueAtTime(1, e + i), m.gain.exponentialRampToValueAtTime(1e-3, e + i + a), u.start(e);
      const G = at("brown", e, 2), b = T(1);
      b.gain.setValueAtTime(p, e), b.gain.exponentialRampToValueAtTime(1e-3, e + r);
      const f = new WaveShaperNode(l);
      f.curve = wo(2, l.sampleRate);
      const y = T(h);
      ue(u, () => {
        Y(u), Y(m), Y(f), Y(G.node), Y(b), Y(y), n();
      });
      const M = u.connect(f).connect(m).connect(y);
      G.node.connect(b).connect(y);
      let W = e + a + 0.01;
      return d != null && (W = Math.min(e + d * o, W)), y.gain.setValueAtTime(h, W - 0.01), y.gain.linearRampToValueAtTime(0, W), u.stop(W), G.stop(W), {
        node: M,
        nodes: { source: [u] },
        stop: (S) => {
          u.stop(S);
        }
      };
    },
    { type: "synth", prebake: !0 }
  ), ce(
    "supersaw",
    (e, t, n) => {
      const o = z();
      let { duration: a, n: c, unison: s = 5, spread: d = 0.6, detune: l } = t;
      l = l ?? c ?? 0.18;
      const i = Xe(t), [p, r, h, u] = $(
        [t.attack, t.decay, t.sustain, t.release],
        "linear",
        [1e-3, 0.05, 0.6, 0.01]
      ), m = e + a, G = m + u + 0.01, b = se(s, 1, 100);
      let f = b > 1 ? se(d, 0, 1) : 0;
      const y = {
        frequency: i,
        begin: e,
        end: G,
        freqspread: l,
        voices: b,
        panspread: f
      }, Z = we("supersaw", () => new AudioWorkletNode(o, "supersaw-oscillator", { outputChannelCount: [2] }));
      Object.entries(y).forEach(([g, C]) => {
        const K = Z.parameters.get(g), I = C !== void 0 ? C : K.defaultValue;
        K.value = I;
      }), Z.port.postMessage({ type: "initialize" });
      const W = 1 / Math.sqrt(b);
      He(Z.parameters.get("detune"), t, e, m);
      const S = Te(Z.parameters.get("detune"), t, e), Q = je(Z.parameters.get("frequency"), t, e);
      let F = T(1);
      F = Z.connect(F), _(F.gain, p, r, h, u, 0, 0.3 * W, e, m, "linear");
      let N = pe(
        o,
        () => {
          ht(Z), n(), Q?.stop(), S?.stop();
        },
        e,
        G
      );
      return {
        node: F,
        nodes: { source: [Z], ...Q?.nodes, ...S?.nodes },
        stop: (g) => {
          N.stop(g);
        }
      };
    },
    { prebake: !0, type: "synth" }
  ), ce(
    "bytebeat",
    (e, t, n) => {
      const o = [
        "(t%255 >= t/255%255)*255",
        "(t*(t*8%60 <= 300)|(-t)*(t*4%512 < 256))+t/400",
        "t",
        "t*(t >> 10^t)",
        "t&128",
        "t&t>>8",
        "((t%255+t%128+t%64+t%32+t%16+t%127.8+t%64.8+t%32.8+t%16.8)/3)",
        "((t%64+t%63.8+t%64.15+t%64.35+t%63.5)/1.25)",
        "(t&(t>>7)-t)",
        "(sin(t*PI/128)*127+127)",
        "((t^t/2+t+64*(sin((t*PI/64)+(t*PI/32768))+64))%128*2)",
        "((t^t/2+t+64*(cos >> 0))%127.85*2)",
        "((t^t/2+t+64)%128*2)",
        "(((t * .25)^(t * .25)/100+(t * .25))%128)*2",
        "((t^t/2+t+64)%7 * 24)"
      ], { n: a = 0 } = t, c = Xe(t), { byteBeatExpression: s = o[a % o.length], byteBeatStartTime: d } = t, l = z();
      let { duration: i } = t;
      const [p, r, h, u] = $(
        [t.attack, t.decay, t.sustain, t.release],
        "linear",
        [1e-3, 0.05, 0.6, 0.01]
      ), m = e + i, G = m + u + 0.01;
      let b = q(
        l,
        "byte-beat-processor",
        {
          frequency: c,
          begin: e,
          end: G
        },
        {
          outputChannelCount: [2]
        }
      );
      b.port.postMessage({ codeText: s, byteBeatStartTime: d, frequency: c });
      let f = T(1);
      f = b.connect(f), _(f.gain, p, r, h, u, 0, 1, e, m, "linear");
      let y = pe(
        l,
        () => {
          Y(b), n();
        },
        e,
        G
      );
      return {
        node: f,
        source: b,
        stop: (M) => {
          y.stop(M);
        }
      };
    },
    { prebake: !0, type: "synth" }
  ), ce(
    "pulse",
    (e, t, n) => {
      const o = z();
      let { pwrate: a, pwsweep: c } = t;
      c == null && (a != null ? c = 0.3 : c = 0), a == null && c != null && (a = 1);
      let { duration: s, pw: d = 0.5 } = t;
      const l = Xe(t), [i, p, r, h] = $(
        [t.attack, t.decay, t.sustain, t.release],
        "linear",
        [1e-3, 0.05, 0.6, 0.01]
      ), u = e + s, m = u + h + 0.01;
      let G = q(
        o,
        "pulse-oscillator",
        {
          frequency: l,
          begin: e,
          end: m,
          pulsewidth: d
        },
        {
          outputChannelCount: [2]
        }
      );
      He(G.parameters.get("detune"), t, e, u);
      const b = Te(G.parameters.get("detune"), t, e), f = je(G.parameters.get("frequency"), t, e);
      let y = T(1);
      y = G.connect(y), _(y.gain, i, p, r, h, 0, 1, e, u, "linear");
      let M;
      c != 0 && (M = Fe(o, { frequency: a, depth: c, begin: e, end: m }), M.connect(G.parameters.get("pulsewidth")));
      let Z = pe(
        o,
        () => {
          Y(G), Y(M), n(), f?.stop(), b?.stop();
        },
        e,
        m
      );
      return {
        node: y,
        nodes: { source: [G], pw_lfo: [M], ...f?.nodes, ...b?.nodes },
        stop: (W) => {
          Z.stop(W);
        }
      };
    },
    { prebake: !0, type: "synth" }
  ), ce(
    "bus",
    (e, t, n) => {
      const o = z(), [a, c, s, d] = $(
        [t.attack, t.decay, t.sustain, t.release],
        "linear",
        [1e-3, 0.05, 1, 0.01]
      ), l = e + t.duration, i = l + d + 0.01, p = Zt().getBus(t.n ?? 0), r = p.connect(T(0));
      _(r.gain, a, c, s, d, 0, 1, e, l, "linear");
      const h = pe(
        o,
        () => {
          p.disconnect(r), n();
        },
        e,
        i
      );
      return {
        node: r,
        nodes: { source: [p] },
        stop: (u) => {
          h.stop(u);
        }
      };
    },
    { prebake: !0, type: "input" }
  ), [...Ut].forEach((e) => {
    ce(
      e,
      (t, n, o) => {
        const [a, c, s, d] = $(
          [n.attack, n.decay, n.sustain, n.release],
          "linear",
          [1e-3, 0.05, 0.6, 0.01]
        );
        let l, { density: i } = n;
        l = at(e, t, i);
        let { node: p, stop: r, triggerRelease: h } = l;
        const u = T(0.3), { duration: m } = n;
        ue(p, () => {
          Y(p), Y(u), o();
        });
        const G = T(1);
        let b = p.connect(u).connect(G);
        const f = t + m;
        _(b.gain, a, c, s, d, 0, 1, t, f, "linear");
        const y = f + d + 0.01;
        return h?.(y), r(y), {
          node: b,
          nodes: { source: [p] },
          stop: (M) => {
            r(M);
          }
        };
      },
      { type: "synth", prebake: !0 }
    );
  }), To.forEach(([e, t]) => ae.set({ ...ae.get(), [e]: ae.get()[t] }));
}
const Tt = 2 * Math.PI;
function Fo(e, t, n) {
  e = typeof e == "object" ? e : new Float32Array(e).fill(1);
  const a = e.length, c = new Float32Array(a + 1), s = new Float32Array(a + 1), d = z(), l = d.createOscillator(), i = {
    sawtooth: (r) => [0, -1 / r],
    square: (r) => [0, r % 2 === 0 ? 0 : 1 / r],
    triangle: (r) => [r % 2 === 0 ? 0 : 1 / (r * r), 0],
    user: (r) => [0, 1]
  };
  if (!i[n])
    throw new Error(`unknown wave type ${n}`);
  for (let r = 0; r < a; r++) {
    const h = e[r], [u, m] = i[n](r + 1), G = t?.[r] ?? 0;
    let b = u * h, f = m * h;
    if (G !== 0) {
      const y = Math.cos(Tt * G), M = Math.sin(Tt * G);
      b = y * b - M * f, f = M * b + y * f;
    }
    c[r + 1] = b, s[r + 1] = f;
  }
  const p = d.createPeriodicWave(c, s);
  return l.setPeriodicWave(p), l;
}
function Co(e, t, n, o) {
  const { duration: a, noise: c = 0 } = n, s = n.partials ?? n.n;
  let d;
  if (e === "user" && !s && (j(
    "[superdough] Synth 'user' was selected, but partials not specified. Defaulting to triangle. Use pat.partials to setup custom waveform"
  ), e = "triangle"), e = e === "user" && !s ? "triangle" : e, e === "one")
    return d = new ConstantSourceNode(z(), { offset: 1 }), d.start(t), {
      node: d,
      nodes: { source: d },
      stop: (r) => d?.stop(r)
    };
  !s || s?.length === 0 || e === "sine" ? (d = z().createOscillator(), d.type = e || "triangle") : d = Fo(s, n.phases, e), d.frequency.value = Xe(n);
  const l = Te(d.detune, n, t);
  He(d.detune, n, t, t + a);
  const i = je(d.frequency, n, t);
  let p;
  return c && (p = un(d, c, t)), ue(d, () => {
    p?.teardown(), Y(d), Y(p?.node), o();
  }), d.start(t), {
    node: p?.node || d,
    nodes: { source: [d], ...l?.nodes, ...i?.nodes },
    stop: (r) => {
      i.stop(r), l?.stop(r), p?.stop(r), d.stop(r);
    },
    triggerRelease: (r) => {
    }
  };
}
function ko(e = 1, t = 0.05, n = 220, o = 0, a = 0, c = 0.1, s = 0, d = 1, l = 0, i = 0, p = 0, r = 0, h = 0, u = 0, m = 0, G = 0, b = 0, f = 1, y = 0, M = 0) {
  let Z = Math.PI * 2, W = z().sampleRate, S = (he) => he > 0 ? 1 : -1, Q = l *= 500 * Z / W / W, F = n *= (1 + t * 2 * Math.random() - t) * Z / W, N = [], g = 0, C = 0, K = 0, I = 1, k = 0, O = 0, w = 0, E, ee;
  for (o = o * W + 9, y *= W, a *= W, c *= W, b *= W, i *= 500 * Z / W ** 3, m *= Z / W, p *= Z / W, r *= W, h = h * W | 0, ee = o + y + a + c + b | 0; K < ee; N[K++] = w)
    ++O % (G * 100 | 0) || (w = s ? s > 1 ? s > 2 ? s > 3 ? Math.sin((g % Z) ** 3) : Math.max(Math.min(Math.tan(g), 1), -1) : 1 - (2 * g / Z % 2 + 2) % 2 : 1 - 4 * Math.abs(Math.round(g / Z) - g / Z) : Math.sin(g), w = (h ? 1 - M + M * Math.sin(Z * K / h) : 1) * S(w) * Math.abs(w) ** d * // curve 0=square, 2=pointy
    e * 1 * // envelope
    (K < o ? K / o : K < o + y ? 1 - (K - o) / y * (1 - f) : K < o + y + a ? f : K < ee - b ? (ee - K - b) / c * // release falloff
    f : 0), w = b ? w / 2 + (b > K ? 0 : (K < ee - b ? 1 : (ee - K) / b) * // release delay
    N[K - b | 0] / 2) : w), E = (n += l += i) * // frequency
    Math.cos(m * C++), g += E - E * u * (1 - (Math.sin(K) + 1) * 1e9 % 2), I && ++I > r && (n += p, F += p, I = 0), h && !(++k % h) && (n = F, l = Q, I ||= 1);
  return N;
}
const Po = (e, t) => {
  let {
    s: n,
    note: o = 36,
    freq: a,
    //
    zrand: c = 0,
    attack: s = 0,
    decay: d = 0,
    sustain: l = 0.8,
    release: i = 0.1,
    curve: p = 1,
    slide: r = 0,
    deltaSlide: h = 0,
    pitchJump: u = 0,
    pitchJumpTime: m = 0,
    lfo: G = 0,
    znoise: b = 0,
    zmod: f = 0,
    zcrush: y = 0,
    zdelay: M = 0,
    tremolo: Z = 0,
    duration: W = 0.2,
    zzfx: S
  } = e;
  const Q = Math.max(W - s - d, 0);
  typeof o == "string" && (o = Be(o)), !a && typeof o == "number" && (a = kt(o)), n = n.replace("z_", "");
  const F = ["sine", "triangle", "sawtooth", "tan", "noise"].indexOf(n) || 0;
  p = n === "square" ? 0 : p;
  const g = (
    /* ZZFX. */
    ko(...S || [
      0.25,
      // volume
      c,
      a,
      s,
      Q,
      i,
      F,
      p,
      r,
      h,
      u,
      m,
      G,
      b,
      f,
      y,
      M,
      l,
      // sustain volume!
      d,
      Z
    ])
  ), C = z(), K = C.createBuffer(1, g.length, C.sampleRate);
  K.getChannelData(0).set(g);
  const I = z().createBufferSource();
  return I.buffer = K, I.start(t), {
    node: I
  };
};
function hc() {
  ["zzfx", "z_sine", "z_sawtooth", "z_triangle", "z_square", "z_tan", "z_noise"].forEach((e) => {
    ce(
      e,
      (t, n, o) => {
        const { node: a } = Po({ s: e, ...n }, t);
        return ue(a, () => {
          Y(a), o();
        }), {
          node: a,
          nodes: { source: [a] },
          stop: () => {
          }
        };
      },
      { type: "synth", prebake: !0 }
    );
  });
}
let xe;
async function Io(e, t) {
  const n = `dsp-worklet-${Date.now()}`, o = `${t}
let __q = []; // trigger queue
class MyProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.t = 0;
    this.stopped = false;
    this.port.onmessage = (e) => {
      if(e.data==='stop') {
        this.stopped = true;
      } else if(e.data?.dough) {
        __q.push(e.data)
      } else {
        msg?.(e.data)
      }
    };
  }
  process(inputs, outputs, parameters) {
    const output = outputs[0];
    if(__q.length) {
      for(let i=0;i<__q.length;++i) {
        const deadline = __q[i].time-currentTime;
        if(deadline<=0) {
          trigger(__q[i].dough)
          __q.splice(i,1)
        }
      }
    }
    for (let i = 0; i < output[0].length; i++) {
      const out = dsp(this.t / sampleRate);
      output.forEach((channel) => {
        channel[i] = out;
      });
      this.t++;
    }
  return !this.stopped;
  }
}
registerProcessor('${n}', MyProcessor);
`, c = `data:text/javascript;base64,${btoa(o)}`;
  await e.audioWorklet.addModule(c);
  const s = new AudioWorkletNode(e, n);
  return { node: s, stop: () => s.port.postMessage("stop") };
}
const an = () => {
  xe && (xe?.stop(), xe?.node?.disconnect());
};
typeof window < "u" && window.addEventListener("message", (e) => {
  e.data === "strudel-stop" ? an() : e.data?.dough && xe?.node.port.postMessage(e.data);
});
const mc = async (e) => {
  const t = z();
  an(), xe = await Io(t, e), xe.node.connect(t.destination);
};
function Gc(e, t, n, o) {
  window.postMessage({ time: o, dough: e.value, currentTime: t, duration: e.duration, cps: n });
}
export {
  $t as DEFAULT_MAX_POLYPHONY,
  gt as Warpmode,
  _o as aliasBank,
  ne as analysers,
  Le as analysersData,
  je as applyFM,
  ie as applyGainCurve,
  zt as applyParameterModulators,
  kn as cleanupOnEnd,
  An as connectBusModulator,
  Dn as connectEnvelope,
  On as connectLFO,
  lc as connectToDestination,
  xn as createFilter,
  Et as distortionAlgorithms,
  mc as dough,
  Gc as doughTrigger,
  zn as drywet,
  Io as dspWorklet,
  Ue as effectSend,
  ct as errorLogger,
  co as fetchSampleMap,
  T as gainNode,
  $ as getADSRValues,
  Ko as getAnalyserById,
  ic as getAnalyzerData,
  z as getAudioContext,
  jo as getAudioContextCurrentTime,
  Vo as getAudioDevices,
  Eo as getCachedBuffer,
  Ln as getCompressor,
  U as getDefaultValue,
  Cn as getDistortion,
  vo as getDistortionAlgorithm,
  Vn as getEnvelope,
  Xe as getFrequencyFromValue,
  Fe as getLfo,
  Oo as getLoadedBuffer,
  Co as getOscillator,
  _ as getParamADSR,
  jt as getParamLfo,
  He as getPitchEnvelope,
  $n as getSampleBuffer,
  eo as getSampleBufferSource,
  _n as getSampleInfo,
  Me as getSound,
  Zt as getSuperdoughAudioController,
  Te as getVibratoOscillator,
  q as getWorklet,
  Po as getZZFX,
  Ro as initAudio,
  sc as initAudioOnFirstClick,
  dt as loadBuffer,
  zo as loadWorklets,
  j as logger,
  en as maxPolyphony,
  tn as multiChannelOrbits,
  Ut as noises,
  so as onTriggerSample,
  Zo as onTriggerSynth,
  ue as onceEnded,
  no as processSampleMap,
  io as registerSampleSource,
  Do as registerSamplesPrefix,
  ce as registerSound,
  uc as registerSynthSounds,
  _t as registerWaveTable,
  ac as registerWorklet,
  hc as registerZZFXSounds,
  Y as releaseAudioNode,
  xo as resetDefaultValues,
  tc as resetDefaults,
  rc as resetGlobalEffects,
  cc as resetLoadedSounds,
  ho as resetSeenKeys,
  to as reverseBuffer,
  ao as samples,
  Qo as scheduleAtTime,
  Uo as setAudioContext,
  ec as setDefault,
  pn as setDefaultAudioContext,
  on as setDefaultValue,
  nc as setDefaultValues,
  qo as setGainCurve,
  Bo as setLogger,
  Wo as setMaxPolyphony,
  fo as setMultiChannelOrbits,
  dc as setSuperdoughAudioController,
  oc as setVersionDefaults,
  $o as soundAlias,
  ae as soundMap,
  No as superdough,
  pc as superdoughTrigger,
  Ao as tables,
  Fo as waveformN,
  pe as webAudioTimeout
};
