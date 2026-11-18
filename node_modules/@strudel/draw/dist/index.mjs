import { Pattern as O, getTime as se, silence as Ee, createParams as Re, register as x, pure as Oe, freqToMidi as _e, noteToMidi as ze, isPattern as Le, midiToFreq as We, getFrequency as Ne } from "@strudel/core";
const Z = (t = "test-canvas", e) => {
  let { contextType: n = "2d", pixelated: o = !1, pixelRatio: a = window.devicePixelRatio } = e || {}, r = document.querySelector("#" + t);
  if (!r) {
    r = document.createElement("canvas"), r.id = t, r.width = window.innerWidth * a, r.height = window.innerHeight * a, r.style = "pointer-events:none;width:100%;height:100%;position:fixed;top:0;left:0", o && (r.style.imageRendering = "pixelated"), document.body.prepend(r);
    let l;
    window.addEventListener("resize", () => {
      l && clearTimeout(l), l = setTimeout(() => {
        r.width = window.innerWidth * a, r.height = window.innerHeight * a;
      }, 200);
    });
  }
  return r.getContext(n, { willReadFrequently: !0 });
};
let $ = {};
function pe(t) {
  $[t] !== void 0 && (cancelAnimationFrame($[t]), delete $[t]);
}
function De(t) {
  Object.keys($).forEach((e) => (!t || e.startsWith(t)) && pe(e));
}
let R = {};
O.prototype.draw = function(t, e) {
  if (typeof window > "u")
    return this;
  let { id: n = 1, lookbehind: o = 0, lookahead: a = 0 } = e, r = Math.max(se(), 0);
  pe(n), o = Math.abs(o), R[n] = (R[n] || []).filter((g) => !g.isInFuture(r));
  let l = this.queryArc(r, r + a).filter((g) => g.hasOnset());
  R[n] = R[n].concat(l);
  let f;
  const i = () => {
    const g = se(), u = g + a;
    R[n] = R[n].filter((d) => d.isInNearPast(o, g));
    let c = Math.max(f || u, u - 1 / 10);
    const b = this.queryArc(c, u).filter((d) => d.hasOnset());
    R[n] = R[n].concat(b), f = u, t(R[n], g, u, this), $[n] = requestAnimationFrame(i);
  };
  return $[n] = requestAnimationFrame(i), this;
};
const Ke = (t = !0, e) => {
  const n = Z();
  t && n.clearRect(0, 0, n.canvas.width, n.canvas.height), De(e);
};
O.prototype.onPaint = function(t) {
  return this.withState((e) => (e.controls.painters || (e.controls.painters = []), e.controls.painters.push(t), e));
};
O.prototype.getPainters = function() {
  let t = [];
  return this.queryArc(0, 0, { painters: t }), t;
};
class $e {
  constructor(e, n) {
    this.onFrame = e, this.onError = n;
  }
  start() {
    const e = this;
    let n = requestAnimationFrame(function o(a) {
      try {
        e.onFrame(a);
      } catch (r) {
        e.onError(r);
      }
      n = requestAnimationFrame(o);
    });
    e.cancel = () => {
      cancelAnimationFrame(n);
    };
  }
  stop() {
    this.cancel && this.cancel();
  }
}
class Qe {
  constructor(e, n) {
    this.visibleHaps = [], this.lastFrame = null, this.drawTime = n, this.painters = [], this.framer = new $e(
      () => {
        if (!this.scheduler) {
          console.warn("Drawer: no scheduler");
          return;
        }
        const o = Math.abs(this.drawTime[0]), a = this.drawTime[1], r = this.scheduler.now() + a;
        if (this.lastFrame === null) {
          this.lastFrame = r;
          return;
        }
        const l = this.scheduler.pattern.queryArc(Math.max(this.lastFrame, r - 1 / 10), r);
        this.lastFrame = r, this.visibleHaps = (this.visibleHaps || []).filter((i) => i.whole && i.endClipped >= r - o - a).concat(l.filter((i) => i.hasOnset()));
        const f = r - a;
        e(this.visibleHaps, f, this, this.painters);
      },
      (o) => {
        console.warn("draw error", o);
      }
    );
  }
  setDrawTime(e) {
    this.drawTime = e;
  }
  invalidate(e = this.scheduler, n) {
    if (!e)
      return;
    n = n ?? e.now(), this.scheduler = e;
    let [o, a] = this.drawTime;
    const [r, l] = [Math.max(n, 0), n + a + 0.1];
    this.visibleHaps = this.visibleHaps.filter((i) => i.whole?.begin < n), this.painters = [];
    const f = e.pattern.queryArc(r, l, { painters: this.painters });
    this.visibleHaps = this.visibleHaps.concat(f);
  }
  start(e) {
    this.scheduler = e, this.invalidate(), this.framer.start();
  }
  stop() {
    this.framer && this.framer.stop();
  }
}
function Ue(t) {
  return typeof window > "u" ? "#fff" : getComputedStyle(document.documentElement).getPropertyValue(t);
}
let ye = {
  background: "#222",
  foreground: "#75baff",
  caret: "#ffcc00",
  selection: "rgba(128, 203, 196, 0.5)",
  selectionMatch: "#036dd626",
  lineHighlight: "#00000050",
  gutterBackground: "transparent",
  gutterForeground: "#8a919966"
};
function W() {
  return ye;
}
function Ze(t) {
  ye = t;
}
let fe = "#22222210";
O.prototype.animate = function({ callback: t, sync: e = !1, smear: n = 0.5 } = {}) {
  window.frame && cancelAnimationFrame(window.frame);
  const o = Z();
  let { clientWidth: a, clientHeight: r } = o.canvas;
  a *= window.devicePixelRatio, r *= window.devicePixelRatio;
  let l = n === 0 ? "99" : Number((1 - n) * 100).toFixed(0);
  l = l.length === 1 ? `0${l}` : l, fe = `#200010${l}`;
  const f = (i) => {
    let g;
    i = Math.round(i), g = this.slow(1e3).queryArc(i, i), o.fillStyle = fe, o.fillRect(0, 0, a, r), g.forEach((u) => {
      let { x: c, y: b, w: d, h: w, s: p, r: k, angle: h = 0, fill: S = "darkseagreen" } = u.value;
      if (d *= a, w *= r, k !== void 0 && h !== void 0) {
        const v = h * 2 * Math.PI, [y, P] = [(a - d) / 2, (r - w) / 2];
        c = y + Math.cos(v) * k * y, b = P + Math.sin(v) * k * P;
      } else
        c *= a - d, b *= r - w;
      const A = { ...u.value, x: c, y: b, w: d, h: w };
      o.fillStyle = S, p === "rect" ? o.fillRect(c, b, d, w) : p === "ellipse" && (o.beginPath(), o.ellipse(c + d / 2, b + w / 2, d / 2, w / 2, 0, 0, 2 * Math.PI), o.fill()), t && t(o, A, u);
    }), window.frame = requestAnimationFrame(f);
  };
  return window.frame = requestAnimationFrame(f), Ee;
};
const { x: we, y: xe, w: et, h: tt, angle: nt, r: rt, fill: at, smear: ot } = Re("x", "y", "w", "h", "angle", "r", "fill", "smear"), it = x("rescale", function(t, e) {
  return e.mul(we(t).w(t).y(t).h(t));
}), lt = x("moveXY", function(t, e, n) {
  return n.add(we(t).y(e));
}), st = x("zoomIn", function(t, e) {
  const n = Oe(1).sub(t).div(2);
  return e.rescale(t).move(n, n);
}), ce = {
  aliceblue: "#f0f8ff",
  antiquewhite: "#faebd7",
  aqua: "#00ffff",
  aquamarine: "#7fffd4",
  azure: "#f0ffff",
  beige: "#f5f5dc",
  bisque: "#ffe4c4",
  black: "#000000",
  blanchedalmond: "#ffebcd",
  blue: "#0000ff",
  blueviolet: "#8a2be2",
  brown: "#a52a2a",
  burlywood: "#deb887",
  cadetblue: "#5f9ea0",
  chartreuse: "#7fff00",
  chocolate: "#d2691e",
  coral: "#ff7f50",
  cornflowerblue: "#6495ed",
  cornsilk: "#fff8dc",
  crimson: "#dc143c",
  cyan: "#00ffff",
  darkblue: "#00008b",
  darkcyan: "#008b8b",
  darkgoldenrod: "#b8860b",
  darkgray: "#a9a9a9",
  darkgreen: "#006400",
  darkgrey: "#a9a9a9",
  darkkhaki: "#bdb76b",
  darkmagenta: "#8b008b",
  darkolivegreen: "#556b2f",
  darkorange: "#ff8c00",
  darkorchid: "#9932cc",
  darkred: "#8b0000",
  darksalmon: "#e9967a",
  darkseagreen: "#8fbc8f",
  darkslateblue: "#483d8b",
  darkslategray: "#2f4f4f",
  darkslategrey: "#2f4f4f",
  darkturquoise: "#00ced1",
  darkviolet: "#9400d3",
  deeppink: "#ff1493",
  deepskyblue: "#00bfff",
  dimgray: "#696969",
  dimgrey: "#696969",
  dodgerblue: "#1e90ff",
  firebrick: "#b22222",
  floralwhite: "#fffaf0",
  forestgreen: "#228b22",
  fuchsia: "#ff00ff",
  gainsboro: "#dcdcdc",
  ghostwhite: "#f8f8ff",
  gold: "#ffd700",
  goldenrod: "#daa520",
  gray: "#808080",
  green: "#008000",
  greenyellow: "#adff2f",
  grey: "#808080",
  honeydew: "#f0fff0",
  hotpink: "#ff69b4",
  indianred: "#cd5c5c",
  indigo: "#4b0082",
  ivory: "#fffff0",
  khaki: "#f0e68c",
  lavender: "#e6e6fa",
  lavenderblush: "#fff0f5",
  lawngreen: "#7cfc00",
  lemonchiffon: "#fffacd",
  lightblue: "#add8e6",
  lightcoral: "#f08080",
  lightcyan: "#e0ffff",
  lightgoldenrodyellow: "#fafad2",
  lightgray: "#d3d3d3",
  lightgreen: "#90ee90",
  lightgrey: "#d3d3d3",
  lightpink: "#ffb6c1",
  lightsalmon: "#ffa07a",
  lightseagreen: "#20b2aa",
  lightskyblue: "#87cefa",
  lightslategray: "#778899",
  lightslategrey: "#778899",
  lightsteelblue: "#b0c4de",
  lightyellow: "#ffffe0",
  lime: "#00ff00",
  limegreen: "#32cd32",
  linen: "#faf0e6",
  magenta: "#ff00ff",
  maroon: "#800000",
  mediumaquamarine: "#66cdaa",
  mediumblue: "#0000cd",
  mediumorchid: "#ba55d3",
  mediumpurple: "#9370db",
  mediumseagreen: "#3cb371",
  mediumslateblue: "#7b68ee",
  mediumspringgreen: "#00fa9a",
  mediumturquoise: "#48d1cc",
  mediumvioletred: "#c71585",
  midnightblue: "#191970",
  mintcream: "#f5fffa",
  mistyrose: "#ffe4e1",
  moccasin: "#ffe4b5",
  navajowhite: "#ffdead",
  navy: "#000080",
  oldlace: "#fdf5e6",
  olive: "#808000",
  olivedrab: "#6b8e23",
  orange: "#ffa500",
  orangered: "#ff4500",
  orchid: "#da70d6",
  palegoldenrod: "#eee8aa",
  palegreen: "#98fb98",
  paleturquoise: "#afeeee",
  palevioletred: "#db7093",
  papayawhip: "#ffefd5",
  peachpuff: "#ffdab9",
  peru: "#cd853f",
  pink: "#ffc0cb",
  plum: "#dda0dd",
  powderblue: "#b0e0e6",
  purple: "#800080",
  red: "#ff0000",
  rosybrown: "#bc8f8f",
  royalblue: "#4169e1",
  saddlebrown: "#8b4513",
  salmon: "#fa8072",
  sandybrown: "#f4a460",
  seagreen: "#2e8b57",
  seashell: "#fff5ee",
  sienna: "#a0522d",
  silver: "#c0c0c0",
  skyblue: "#87ceeb",
  slateblue: "#6a5acd",
  slategray: "#708090",
  slategrey: "#708090",
  snow: "#fffafa",
  springgreen: "#00ff7f",
  steelblue: "#4682b4",
  tan: "#d2b48c",
  teal: "#008080",
  thistle: "#d8bfd8",
  tomato: "#ff6347",
  turquoise: "#40e0d0",
  violet: "#ee82ee",
  wheat: "#f5deb3",
  white: "#ffffff",
  whitesmoke: "#f5f5f5",
  yellow: "#ffff00",
  yellowgreen: "#9acd32"
};
function ft(t) {
  return t = t.toLowerCase(), t[0] === "#" ? de(t) : ce[t] !== void 0 ? de(ce[t]) : -1;
}
function de(t) {
  return t = t.slice(1), parseInt(t, 16);
}
const G = (t, e, n) => t * (n - e) + e, he = (t) => {
  let { value: e } = t;
  typeof t.value != "object" && (e = { value: e });
  let { note: n, n: o, freq: a, s: r } = e;
  if (a)
    return _e(a);
  if (n = n ?? o, typeof n == "string")
    try {
      return ze(n);
    } catch {
      return 0;
    }
  return typeof n == "number" ? n : r ? "_" + r : e;
};
O.prototype.pianoroll = function(t = {}) {
  let { cycles: e = 4, playhead: n = 0.5, overscan: o = 0, hideNegative: a = !1, ctx: r = Z(), id: l = 1 } = t, f = -e * n, i = e * (1 - n);
  const g = (u, c) => (!a || u.whole.begin >= 0) && u.isWithinTime(c + f, c + i);
  return this.draw(
    (u, c) => {
      ee({
        ...t,
        time: c,
        ctx: r,
        haps: u.filter((b) => g(b, c))
      });
    },
    {
      lookbehind: f - o,
      lookahead: i + o,
      id: l
    }
  ), this;
};
function ct(t) {
  return Le(t) ? t.pianoroll() : (e) => e.pianoroll(t);
}
function ee({
  time: t,
  haps: e,
  cycles: n = 4,
  playhead: o = 0.5,
  flipTime: a = 0,
  flipValues: r = 0,
  hideNegative: l = !1,
  inactive: f = W().foreground,
  active: i = W().foreground,
  background: g = "transparent",
  smear: u = 0,
  playheadColor: c = W().foreground,
  minMidi: b = 10,
  maxMidi: d = 90,
  autorange: w = 0,
  timeframe: p,
  fold: k = 1,
  vertical: h = 0,
  labels: S = !1,
  fill: A = 1,
  fillActive: v = !1,
  strokeActive: y = !0,
  stroke: P,
  hideInactive: H = 0,
  colorizeInactive: q = 1,
  fontFamily: C,
  ctx: s,
  id: _
} = {}) {
  const T = s.canvas.width, I = s.canvas.height;
  let z = -n * o, j = n * (1 - o);
  _ && (e = e.filter((m) => m.hasTag(_))), p && (console.warn("timeframe is deprecated! use from/to instead"), z = 0, j = p);
  const N = h ? I : T, E = h ? T : I;
  let L = h ? [N, 0] : [0, N];
  const J = j - z, te = h ? [0, E] : [E, 0];
  let K = d - b + 1, D = E / K, Q = [];
  a && L.reverse(), r && te.reverse();
  const { min: ke, max: Pe, values: Te } = e.reduce(
    ({ min: m, max: F, values: X }, Y) => {
      const M = he(Y);
      return {
        min: M < m ? M : m,
        max: M > F ? M : F,
        values: X.includes(M) ? X : [...X, M]
      };
    },
    { min: 1 / 0, max: -1 / 0, values: [] }
  );
  w && (b = ke, d = Pe, K = d - b + 1), Q = Te.sort(
    (m, F) => typeof m == "number" && typeof F == "number" ? m - F : typeof m == "number" ? 1 : String(m).localeCompare(String(F))
  ), D = k ? E / Q.length : E / K, s.fillStyle = g, s.globalAlpha = 1, u || (s.clearRect(0, 0, T, I), s.fillRect(0, 0, T, I)), e.forEach((m) => {
    const F = m.whole.begin <= t && m.endClipped > t;
    let X = P ?? (y && F), Y = !F && A || F && v;
    if (H && !F)
      return;
    let M = m.value?.color;
    i = M || i, f = q && M || f, M = F ? i : f, s.fillStyle = Y ? M : "transparent", s.strokeStyle = M;
    const { velocity: Ae = 1, gain: qe = 1 } = m.value || {};
    s.globalAlpha = Ae * qe;
    const Fe = (m.whole.begin - (a ? j : z)) / J, ne = G(Fe, ...L);
    let B = G(m.duration / J, 0, N);
    const re = he(m), Me = k ? Q.indexOf(re) / Q.length : (Number(re) - b) / K, ae = G(Me, ...te);
    let oe = 0;
    const ie = G(t / J, ...L);
    let V;
    if (h ? V = [
      ae + 1 - (r ? D : 0),
      // x
      N - ie + ne + oe + 1 - (a ? 0 : B),
      // y
      D - 2,
      // width
      B - 2
      // height
    ] : V = [
      ne - ie + oe + 1 - (a ? B : 0),
      // x
      ae + 1 - (r ? 0 : D),
      // y
      B - 2,
      // widith
      D - 2
      // height
    ], X && s.strokeRect(...V), Y && s.fillRect(...V), S) {
      const Se = m.value.note ?? m.value.s + (m.value.n ? `:${m.value.n}` : ""), { label: le, activeLabel: Ce } = m.value, He = (F && Ce || le) ?? Se;
      let Ie = h ? B : D * 0.75;
      s.font = `${Ie}px ${C || "monospace"}`, s.fillStyle = /* isActive &&  */
      Y ? "black" : M, s.textBaseline = "top", s.fillText(He, ...V);
    }
  }), s.globalAlpha = 1;
  const U = G(-z / J, ...L);
  return s.strokeStyle = c, s.beginPath(), h ? (s.moveTo(0, U), s.lineTo(E, U)) : (s.moveTo(U, 0), s.lineTo(U, E)), s.stroke(), this;
}
function ve(t, e = {}) {
  let [n, o] = t;
  n = Math.abs(n);
  const a = o + n, r = a !== 0 ? n / a : 0;
  return { fold: 1, ...e, cycles: a, playhead: r };
}
const je = (t = {}) => (e, n, o, a) => ee({ ctx: e, time: n, haps: o, ...ve(a, t) });
O.prototype.punchcard = function(t) {
  return this.onPaint(je(t));
};
O.prototype.wordfall = function(t) {
  return this.punchcard({ vertical: 1, labels: 1, stroke: 0, fillActive: 1, active: "white", ...t });
};
function dt(t) {
  const { drawTime: e, ...n } = t;
  ee({ ...ve(e), ...n });
}
function Xe(t, e, n, o) {
  const a = (t - 90) * Math.PI / 180;
  return [n + Math.cos(a) * e, o + Math.sin(a) * e];
}
const ue = (t, e, n, o, a = 0) => Xe((t + a) * 360, e * t, n, o);
function me(t) {
  let {
    ctx: e,
    from: n = 0,
    to: o = 3,
    margin: a = 50,
    cx: r = 100,
    cy: l = 100,
    rotate: f = 0,
    thickness: i = a / 2,
    color: g = W().foreground,
    cap: u = "round",
    stretch: c = 1,
    fromOpacity: b = 1,
    toOpacity: d = 1
  } = t;
  n *= c, o *= c, f *= c, e.lineWidth = i, e.lineCap = u, e.strokeStyle = g, e.globalAlpha = b, e.beginPath();
  let [w, p] = ue(n, a, r, l, f);
  e.moveTo(w, p);
  const k = 1 / 60;
  let h = n;
  for (; h <= o; ) {
    const [S, A] = ue(h, a, r, l, f);
    e.globalAlpha = (h - n) / (o - n) * d, e.lineTo(S, A), h += k;
  }
  e.stroke();
}
function Ye(t) {
  let {
    stretch: e = 1,
    size: n = 80,
    thickness: o = n / 2,
    cap: a = "butt",
    // round butt squar,
    inset: r = 3,
    // start angl,
    playheadColor: l = "#ffffff",
    playheadLength: f = 0.02,
    playheadThickness: i = o,
    padding: g = 0,
    steady: u = 1,
    activeColor: c = W().foreground,
    inactiveColor: b = W().gutterForeground,
    colorizeInactive: d = 0,
    fade: w = !0,
    // logSpiral = true,
    ctx: p,
    time: k,
    haps: h,
    drawTime: S,
    id: A
  } = t;
  A && (h = h.filter((T) => T.hasTag(A)));
  const [v, y] = [p.canvas.width, p.canvas.height];
  p.clearRect(0, 0, v * 2, y * 2);
  const [P, H] = [v / 2, y / 2], q = {
    margin: n / e,
    cx: P,
    cy: H,
    stretch: e,
    cap: a,
    thickness: o
  }, C = {
    ...q,
    thickness: i,
    from: r - f,
    to: r,
    color: l
  }, [s] = S, _ = u * k;
  h.forEach((T) => {
    const I = T.whole.begin <= k && T.endClipped > k, z = T.whole.begin - k + r, j = T.endClipped - k + r - g, N = T.value?.color || c, E = d || I ? N : b, L = w ? 1 - Math.abs((T.whole.begin - k) / s) : 1;
    me({
      ctx: p,
      ...q,
      from: z,
      to: j,
      rotate: _,
      color: E,
      fromOpacity: L,
      toOpacity: L
    });
  }), me({
    ctx: p,
    ...C,
    rotate: _
  });
}
O.prototype.spiral = function(t = {}) {
  return this.onPaint((e, n, o, a) => Ye({ ctx: e, time: n, haps: o, drawTime: a, ...t }));
};
const Be = We(36), ge = (t, e, n, o) => {
  o = o * Math.PI * 2;
  const a = Math.sin(o) * n + t, r = Math.cos(o) * n + e;
  return [a, r];
}, be = (t, e) => 0.5 - Math.log2(t / e) % 1;
function Ve({
  haps: t,
  ctx: e,
  id: n,
  hapcircles: o = 1,
  circle: a = 0,
  edo: r = 12,
  root: l = Be,
  thickness: f = 3,
  hapRadius: i = 6,
  mode: g = "flake",
  margin: u = 10
} = {}) {
  const c = g === "polygon", b = g === "flake", d = e.canvas.width, w = e.canvas.height;
  e.clearRect(0, 0, d, w);
  const p = W().foreground, h = Math.min(d, w) / 2 - f / 2 - i - u, S = d / 2, A = w / 2;
  n && (t = t.filter((y) => y.hasTag(n))), e.strokeStyle = p, e.fillStyle = p, e.globalAlpha = 1, e.lineWidth = f, a && (e.beginPath(), e.arc(S, A, h, 0, 2 * Math.PI), e.stroke()), r && (Array.from({ length: r }, (y, P) => {
    const H = be(l * Math.pow(2, P / r), l), [q, C] = ge(S, A, h, H);
    e.beginPath(), e.arc(q, C, i, 0, 2 * Math.PI), e.fill();
  }), e.stroke());
  let v = [];
  e.lineWidth = i, t.forEach((y) => {
    let P;
    try {
      P = Ne(y);
    } catch {
      return;
    }
    const H = be(P, l), [q, C] = ge(S, A, h, H), s = y.value.color || p;
    e.strokeStyle = s, e.fillStyle = s;
    const { velocity: _ = 1, gain: T = 1 } = y.value || {}, I = _ * T;
    e.globalAlpha = I, v.push([q, C, H, s, I]), e.beginPath(), o && (e.moveTo(q + i, C), e.arc(q, C, i, 0, 2 * Math.PI), e.fill()), b && (e.moveTo(S, A), e.lineTo(q, C)), e.stroke();
  }), e.strokeStyle = p, e.globalAlpha = 1, c && v.length && (v = v.sort((y, P) => y[2] - P[2]), e.beginPath(), e.moveTo(v[0][0], v[0][1]), v.forEach(([y, P, H, q, C]) => {
    e.strokeStyle = q, e.globalAlpha = C, e.lineTo(y, P);
  }), e.lineTo(v[0][0], v[0][1]), e.stroke());
}
O.prototype.pitchwheel = function(t = {}) {
  let { ctx: e = Z(), id: n = 1 } = t;
  return this.tag(n).onPaint(
    (o, a, r) => Ve({
      ...t,
      time: a,
      ctx: e,
      haps: r.filter((l) => l.isActive(a)),
      id: n
    })
  );
};
export {
  Qe as Drawer,
  $e as Framer,
  ee as __pianoroll,
  nt as angle,
  Ke as cleanupDraw,
  ce as colorMap,
  ft as convertColorToNumber,
  de as convertHexToNumber,
  dt as drawPianoroll,
  at as fill,
  Ue as getComputedPropertyValue,
  Z as getDrawContext,
  ve as getDrawOptions,
  je as getPunchcardPainter,
  W as getTheme,
  tt as h,
  lt as moveXY,
  ct as pianoroll,
  Ve as pitchwheel,
  rt as r,
  it as rescale,
  Ze as setTheme,
  ot as smear,
  et as w,
  we as x,
  xe as y,
  st as zoomIn
};
