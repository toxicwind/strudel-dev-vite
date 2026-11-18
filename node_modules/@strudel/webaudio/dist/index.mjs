import * as Q from "@strudel/core";
import { Pattern as v, clamp as x } from "@strudel/core";
import { getAudioContext as S, getWorklet as X, connectToDestination as Y, registerWorklet as Z, setLogger as ee, doughTrigger as te, superdough as P, setAudioContext as $, setSuperdoughAudioController as z, initAudio as ne, errorLogger as oe, resetGlobalEffects as se, analysers as M, getAnalyzerData as W } from "superdough";
export * from "superdough";
import { workletUrl as ae } from "supradough";
import { getTheme as G, getDrawContext as O } from "@strudel/draw";
let C;
function ie() {
  const e = S();
  C = X(
    e,
    "dough-processor",
    {},
    {
      outputChannelCount: [2]
    }
  ), Y(C);
}
const A = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map();
v.prototype.supradough = function() {
  return this.onTrigger((e, t, n, o) => {
    e.value._begin = o, e.value._duration = e.duration / n, !C && ie();
    const s = (e.value.bank ? e.value.bank + "_" : "") + e.value.s, a = e.value.n ?? 0, r = `${s}:${a}`;
    if (A.has(s) && (e.value.s = r), A.has(s) && !E.has(r)) {
      const i = A.get(s), c = i[a % i.length];
      console.log(`load ${r} from ${c}`);
      const h = ue(c);
      E.set(r, h), h.then(
        ({ channels: u, sampleRate: l }) => C.port.postMessage({
          sample: r,
          channels: u,
          sampleRate: l
        })
      );
    }
    C.port.postMessage({ spawn: e.value });
  }, 1);
};
function re(e, t = "") {
  if (!e.startsWith("github:"))
    throw new Error('expected "github:" at the start of pseudoUrl');
  let [n, o] = e.split("github:");
  return o = o.endsWith("/") ? o.slice(0, -1) : o, o.split("/").length === 2 && (o += "/main"), `https://raw.githubusercontent.com/${o}/${t}`;
}
async function ce(e) {
  if (e.startsWith("github:") && (e = re(e, "strudel.json")), e.startsWith("local:") && (e = "http://localhost:5432"), e.startsWith("shabda:")) {
    let [o, s] = e.split("shabda:");
    e = `https://shabda.ndre.gr/${s}.json?strudel=1`;
  }
  if (e.startsWith("shabda/speech")) {
    let [o, s] = e.split("shabda/speech");
    s = s.startsWith("/") ? s.substring(1) : s;
    let [a, r] = s.split(":"), i = "f", c = "en-GB";
    a && ([c, i] = a.split("/")), e = `https://shabda.ndre.gr/speech/${r}.json?gender=${i}&language=${c}&strudel=1'`;
  }
  if (typeof fetch != "function")
    return;
  const t = e.split("/").slice(0, -1).join("/");
  if (typeof fetch > "u")
    return;
  const n = await fetch(e).then((o) => o.json()).catch((o) => {
    throw console.error(o), new Error(`error loading "${e}"`);
  });
  return [n, n._base || t];
}
async function ue(e) {
  const t = await fetch(e).then((o) => o.arrayBuffer()).then((o) => S().decodeAudioData(o));
  let n = [];
  for (let o = 0; o < t.numberOfChannels; o++)
    n.push(t.getChannelData(o));
  return { channels: n, sampleRate: t.sampleRate };
}
async function le(e, t) {
  if (typeof e == "string") {
    const [n, o] = await ce(e);
    return le(n, o);
  }
  Object.entries(e).map(async ([n, o]) => {
    n !== "_base" && (o = o.map((s) => t + s), A.set(n, o));
  });
}
let T;
const de = () => (T = new AudioContext(), T), he = () => T || de();
let fe = (e) => console.log(e);
function ge(e, t = "superdough") {
  process.env.NODE_ENV === "development" && console.error(e), B(`[${t}] error: ${e.message}`);
}
const B = (...e) => fe(...e), j = (e, t, n) => Math.min(Math.max(e, t), n);
function I(e) {
  const t = he().createGain();
  return t.gain.value = e, t;
}
function R(e, t, n) {
  const o = I(n);
  return e.connect(o), o.connect(t), o;
}
function pe(e, t, n, o) {
  const s = new AudioWorkletNode(e, t, o);
  return Object.entries(n).forEach(([a, r]) => {
    r !== void 0 && (s.parameters.get(a).value = r);
  }), s;
}
function me(e, t, n, o) {
  const s = new ConstantSourceNode(e), a = I(0);
  return a.connect(e.destination), s.connect(a), Te(s, () => {
    U(a), U(s), t();
  }), s.start(n), s.stop(o), s;
}
const q = (e) => e / (1 + e), ve = (e, t) => (e % t + t) % t, be = (e, t) => (1 + t) * e / (1 + t * Math.abs(e)), y = (e, t) => Math.tanh(e * (1 + t)), we = (e, t) => j((1 + t) * e, -1, 1), F = (e, t) => {
  let n = (1 + 0.5 * t) * e;
  const o = ve(n + 1, 4);
  return 1 - Math.abs(o - 2);
}, ye = (e, t) => Math.sin(Math.PI / 2 * F(e, t)), Ce = (e, t) => {
  const n = q(Math.log1p(t)), o = (e - n / 3 * e * e * e) / (1 - n / 3);
  return y(o, t);
}, L = (e, t, n = !1) => {
  const o = 1 + 2 * t, a = 0.07 * q(Math.log1p(t)), r = y(e + a, 2 * t), i = y(n ? a : -e + a, 2 * t), c = r - i, h = 1 / Math.cosh(o * a), u = h * h, l = Math.max(1e-8, (n ? 1 : 2) * o * u);
  return y(c / l, t);
}, Ne = (e, t) => L(e, t, !0), Ae = (e, t) => {
  const n = 10 * Math.log1p(t);
  let o = 1, s = e, a, r = 0;
  for (let i = 1; i < 64; i++) {
    if (i < 2) {
      r += i == 0 ? o : s;
      continue;
    }
    a = 2 * e * o - s, s = o, o = a, i % 2 === 0 && (r += Math.min(1.3 * n / i, 2) * a);
  }
  return y(r, n / 20);
}, Me = {
  scurve: be,
  soft: y,
  hard: we,
  cubic: Ce,
  diode: L,
  asym: Ne,
  fold: F,
  sinefold: ye,
  chebyshev: Ae
};
Object.freeze(Object.keys(Me));
const Te = (e, t) => {
  const n = t;
  e.onended = function() {
    n(), this.onended = null;
  };
}, U = (e) => {
  if (e != null) {
    if (!(e instanceof AudioNode))
      throw new Error("releaseAudioNode can only release an AudioNode");
    if (e.disconnect(), e instanceof AudioScheduledSourceNode) {
      process.env.NODE_ENV === "development" && e.onended && e.onended.name !== "cleanup" && B(
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
}, w = (e, t) => e !== void 0 && e !== t, D = (e) => new GainNode(e, { gain: 1, channelCount: 2, channelCountMode: "explicit" });
class Se {
  reverbNode;
  delayNode;
  output;
  summingNode;
  djfNode;
  audioContext;
  constructor(t) {
    this.audioContext = t, this.output = D(t), this.summingNode = D(t), this.summingNode.connect(this.output);
  }
  disconnect() {
    this.output.disconnect(), this.summingNode.disconnect(), this.delayNode?.disconnect(), this.reverbNode?.disconnect();
  }
  getDjf(t, n = 0) {
    return this.djfNode == null && (this.djfNode = pe(this.audioContext, "djf-processor", { value: t }), this.summingNode.disconnect(), this.summingNode.connect(this.djfNode), this.djfNode.connect(this.output)), this.djfNode.parameters.get("value").setValueAtTime(t, n), this.djfNode;
  }
  getDelay(t = 0, n = 0.5, o) {
    return n = j(n, 0, 0.98), this.delayNode == null && (this.delayNode = this.audioContext.createFeedbackDelay(1, t, n), this.delayNode.connect(this.summingNode), this.delayNode.start?.(o)), this.delayNode.delayTime.value !== t && this.delayNode.delayTime.setValueAtTime(t, o), this.delayNode.feedback.value !== n && this.delayNode.feedback.setValueAtTime(n, o), this.delayNode;
  }
  getReverb(t, n, o, s, a, r, i) {
    return this.reverbNode == null && (this.reverbNode = this.audioContext.createReverb(t, n, o, s, a, r, i), this.reverbNode.connect(this.summingNode)), (w(t, this.reverbNode.duration) || w(n, this.reverbNode.fade) || w(o, this.reverbNode.lp) || w(s, this.reverbNode.dim) || w(r, this.reverbNode.irspeed) || w(i, this.reverbNode.irbegin) || this.reverbNode.ir !== a) && this.reverbNode.generate(t, n, o, s, a, r, i), this.reverbNode;
  }
  sendReverb(t, n) {
    return R(t, this.reverbNode, n);
  }
  sendDelay(t, n) {
    return R(t, this.delayNode, n);
  }
  duck(t, n = 0, o = 0.1, s = 1) {
    const a = n, r = Math.max(o, 2e-3), i = this.output.gain;
    me(
      this.audioContext,
      () => {
        const c = this.audioContext.currentTime, h = i.value;
        i.cancelScheduledValues(c), i.setValueAtTime(h, c);
        const u = Math.max(t, c), l = j(1 - Math.sqrt(s), 0.01, h);
        i.exponentialRampToValueAtTime(l, u + a), i.exponentialRampToValueAtTime(1, u + a + r);
      },
      0,
      t - 0.01
    );
  }
  connectToOutput(t) {
    t.connect(this.summingNode);
  }
}
class Oe {
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
    const s = new ChannelSplitterNode(this.audioContext, {
      numberOfOutputs: o.channelCount
    });
    o.connect(s), n.forEach((a, r) => {
      s.connect(this.channelMerger, r % o.channelCount, a % this.audioContext.destination.channelCount);
    });
  };
}
class _e {
  audioContext;
  output;
  nodes = {};
  buses = {};
  constructor(t) {
    this.audioContext = t, this.output = new Oe(t);
  }
  reset() {
    Object.values(this.nodes).forEach((t) => {
      t.disconnect();
    }), Object.values(this.buses).forEach((t) => {
      t.disconnect();
    }), this.nodes = {}, this.buses = {}, this.output.reset();
  }
  duck(t, n, o = 0, s = 0.1, a = 1) {
    const r = [t].flat(), i = [o].flat(), c = [s].flat(), h = [a].flat();
    r.forEach((u, l) => {
      const f = this.nodes[u];
      if (f == null) {
        ge(new Error(`duck target orbit ${u} does not exist`), "superdough");
        return;
      }
      const p = i[l] ?? i[0], d = Math.max(c[l] ?? c[0], 2e-3), g = h[l] ?? h[0];
      f.duck(n, p, d, g);
    });
  }
  getOrbit(t, n) {
    return this.nodes[t] == null && (this.nodes[t] = new Se(this.audioContext), this.output.connectToDestination(this.nodes[t].output, n)), this.nodes[t];
  }
  getBus(t) {
    return this.buses[t] == null && (this.buses[t] = D(this.audioContext)), this.buses[t];
  }
}
Z(ae);
const { Pattern: $e, logger: k, repl: je } = Q;
ee(k);
const K = (e) => (e.ensureObjectValue(), e.value), De = (e, t, n, o, s) => P(K(e), s, n, o, e.whole?.begin.valueOf());
async function qe(e, t, n, o, s, a, r, i = void 0) {
  let c = S();
  await c.close(), c = new OfflineAudioContext(2, (o - n) / t * s, s), $(c), z(new _e(c)), await ne({
    maxPolyphony: a,
    multiChannelOrbits: r
  }), k("[webaudio] preloading");
  let h = e.queryArc(n, o, { _cps: t }).sort((u, l) => u.whole.begin.valueOf() - l.whole.begin.valueOf());
  for (const u of h)
    if (u.hasOnset())
      try {
        await P(
          K(u),
          (u.whole.begin.valueOf() - n) / t,
          u.duration / t,
          t,
          (u.whole?.begin.valueOf() - n) / t
        );
      } catch (l) {
        oe(l, "webaudio");
      }
  return k("[webaudio] start rendering"), c.startRendering().then((u) => {
    const l = ke(u), f = new Blob([l], { type: "audio/wav" }), p = URL.createObjectURL(f), d = document.createElement("a");
    d.href = p, i = i ? `${i}.wav` : `${(/* @__PURE__ */ new Date()).toISOString()}.wav`, d.download = `${i}`, document.body.appendChild(d), d.click(), document.body.removeChild(d), URL.revokeObjectURL(p);
  }).finally(async () => {
    $(null), z(null), se();
  });
}
function Fe(e = {}) {
  const t = e.audioContext ?? S();
  return $(t), e = {
    getTime: () => t.currentTime,
    defaultOutput: De,
    ...e
  }, je(e);
}
$e.prototype.dough = function() {
  return this.onTrigger(te, 1);
};
function ke(e, t) {
  t = t || {};
  var n = e.numberOfChannels, o = e.sampleRate, s = t.float32 ? 3 : 1, a = s === 3 ? 32 : 16, r;
  return n === 2 ? r = ze(e.getChannelData(0), e.getChannelData(1)) : r = e.getChannelData(0), We(r, s, o, n, a);
}
function We(e, t, n, o, s) {
  var a = s / 8, r = o * a, i = new ArrayBuffer(44 + e.length * a), c = new DataView(i);
  return N(c, 0, "RIFF"), c.setUint32(4, 36 + e.length * a, !0), N(c, 8, "WAVE"), N(c, 12, "fmt "), c.setUint32(16, 16, !0), c.setUint16(20, t, !0), c.setUint16(22, o, !0), c.setUint32(24, n, !0), c.setUint32(28, n * r, !0), c.setUint16(32, r, !0), c.setUint16(34, s, !0), N(c, 36, "data"), c.setUint32(40, e.length * a, !0), t === 1 ? Re(c, 44, e) : Ee(c, 44, e), i;
}
function ze(e, t) {
  for (var n = e.length + t.length, o = new Float32Array(n), s = 0, a = 0; s < n; )
    o[s++] = e[a], o[s++] = t[a], a++;
  return o;
}
function Ee(e, t, n) {
  for (var o = 0; o < n.length; o++, t += 4)
    e.setFloat32(t, n[o], !0);
}
function Re(e, t, n) {
  for (var o = 0; o < n.length; o++, t += 2) {
    var s = Math.max(-1, Math.min(1, n[o]));
    e.setInt16(t, s < 0 ? s * 32768 : s * 32767, !0);
  }
}
function N(e, t, n) {
  for (var o = 0; o < n.length; o++)
    e.setUint8(t + o, n.charCodeAt(o));
}
function Ue(e, {
  align: t = !0,
  color: n = "white",
  thickness: o = 3,
  scale: s = 0.25,
  pos: a = 0.75,
  trigger: r = 0,
  ctx: i = O(),
  id: c = 1
} = {}) {
  i.lineWidth = o, i.strokeStyle = n;
  let h = i.canvas;
  if (!e) {
    i.beginPath();
    let g = a * h.height;
    i.moveTo(0, g), i.lineTo(h.width, g), i.stroke();
    return;
  }
  const u = W("time", c);
  i.beginPath();
  const l = e.frequencyBinCount;
  let f = t ? Array.from(u).findIndex((g, m, b) => m && b[m - 1] > -r && g <= -r) : 0;
  f = Math.max(f, 0);
  const p = h.width * 1 / l;
  let d = 0;
  for (let g = f; g < l; g++) {
    const m = u[g] + 1, b = (a - s * (m - 1)) * h.height;
    g === 0 ? i.moveTo(d, b) : i.lineTo(d, b), d += p;
  }
  i.stroke();
}
function Ve(e, { color: t = "white", scale: n = 0.25, pos: o = 0.75, lean: s = 0.5, min: a = -150, max: r = 0, ctx: i = O(), id: c = 1 } = {}) {
  if (!e) {
    i.beginPath();
    let d = o * u.height;
    i.moveTo(0, d), i.lineTo(u.width, d), i.stroke();
    return;
  }
  const h = W("frequency", c), u = i.canvas;
  i.fillStyle = t;
  const l = e.frequencyBinCount, f = u.width * 1 / l;
  let p = 0;
  for (let d = 0; d < l; d++) {
    const m = x((h[d] - a) / (r - a), 0, 1) * n, b = m * u.height, J = (o - m * s) * u.height;
    i.fillRect(p, J, Math.max(f, 1), b), p += f;
  }
}
function H(e = 0, t = "0,0,0", n = O()) {
  e ? (n.fillStyle = `rgba(${t},${1 - e})`, n.fillRect(0, 0, n.canvas.width, n.canvas.height)) : n.clearRect(0, 0, n.canvas.width, n.canvas.height);
}
v.prototype.fscope = function(e = {}) {
  let t = e.id ?? 1;
  return this.analyze(t).draw(
    () => {
      H(e.smear, "0,0,0", e.ctx), M[t] && Ve(M[t], e);
    },
    { id: t }
  );
};
v.prototype.tscope = function(e = {}) {
  let t = e.id ?? 1;
  return this.analyze(t).draw(
    (n) => {
      e.color = n[0]?.value?.color || G().foreground, e.color, H(e.smear, "0,0,0", e.ctx), Ue(M[t], e);
    },
    { id: t }
  );
};
v.prototype.scope = v.prototype.tscope;
let V = {};
v.prototype.spectrum = function(e = {}) {
  let t = e.id ?? 1;
  return this.analyze(t).draw(
    (n) => {
      e.color = n[0]?.value?.color || V[t] || G().foreground, V[t] = e.color, xe(M[t], e);
    },
    { id: t }
  );
};
v.prototype.scope = v.prototype.tscope;
const _ = /* @__PURE__ */ new Map();
function xe(e, { thickness: t = 3, speed: n = 1, min: o = -80, max: s = 0, ctx: a = O(), id: r = 1, color: i } = {}) {
  if (a.lineWidth = t, a.strokeStyle = i, !e)
    return;
  const c = n, h = W("frequency", r), u = a.canvas;
  a.fillStyle = i;
  const l = e.frequencyBinCount;
  let f = _.get(r) || a.getImageData(0, 0, u.width, u.height);
  _.set(r, f), a.clearRect(0, 0, a.canvas.width, a.canvas.height), a.putImageData(f, -c, 0);
  let p = u.width - n;
  for (let d = 0; d < l; d++) {
    const g = x((h[d] - o) / (s - o), 0, 1);
    a.globalAlpha = g;
    const m = Math.log(d + 1) / Math.log(l) * u.height;
    a.fillRect(p, u.height - m, c, 2);
  }
  _.set(r, a.getImageData(0, 0, u.width, u.height));
}
export {
  le as doughsamples,
  Ve as drawFrequencyScope,
  Ue as drawTimeScope,
  ce as fetchSampleMap,
  qe as renderPatternAudio,
  De as webaudioOutput,
  Fe as webaudioRepl
};
