import T from "fraction.js";
import { SalatRepl as Ge } from "@kabelsalat/web";
const oe = "strudel.log";
let Qe = 1e3, Ut, Xt;
function zt(t, e = "cyclist") {
  process.env.NODE_ENV === "development" && console.error(t), E(`[${e}] error: ${t.message}`);
}
function E(t, e, n = {}) {
  let s = performance.now();
  Ut === t && s - Xt < Qe || (Ut = t, Xt = s, console.log(`%c${t}`, "background-color: black;color:white;border-radius:15px"), typeof document < "u" && typeof CustomEvent < "u" && document.dispatchEvent(
    new CustomEvent(oe, {
      detail: {
        message: t,
        type: e,
        data: n
      }
    })
  ));
}
E.key = oe;
const Yf = (t) => /^[a-gA-G][#bsf]*[0-9]*$/.test(t), Mt = (t) => /^[a-gA-G][#bsf]*-?[0-9]*$/.test(t), Ue = (t) => {
  if (typeof t != "string")
    return [];
  const [e, n = "", s] = t.match(/^([a-gA-G])([#bsf]*)(-?[0-9]*)$/)?.slice(1) || [];
  return e ? [e, n, s ? Number(s) : void 0] : [];
}, Xe = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 }, Ke = { "#": 1, b: -1, s: 1, f: -1 }, Ye = (t) => t?.split("").reduce((e, n) => e + Ke[n], 0) || 0, gt = (t, e = 3) => {
  const [n, s, r = e] = Ue(t);
  if (!n)
    throw new Error('not a note: "' + t + '"');
  const o = Xe[n.toLowerCase()], i = Ye(s);
  return (Number(r) + 1) * 12 + o + i;
}, it = (t) => Math.pow(2, (t - 69) / 12) * 440, Ze = (t) => 12 * Math.log(t / 440) / Math.LN2 + 69, Zf = (t, e) => {
  if (typeof t != "object")
    throw new Error("valueToMidi: expected object value");
  let { freq: n, note: s } = t;
  if (typeof n == "number")
    return Ze(n);
  if (typeof s == "string")
    return gt(s);
  if (typeof s == "number")
    return s;
  if (!e)
    throw new Error("valueToMidi: expected freq or note to be set");
  return e;
}, th = (t, e) => (t - e) * 1e3, tn = (t) => it(typeof t == "number" ? t : gt(t)), en = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"], eh = (t) => {
  const e = Math.floor(t / 12) - 1;
  return en[t % 12] + e;
}, bt = (t, e) => (t % e + e) % e, nn = (t) => t.reduce((e, n) => e + n) / t.length;
function sn(t, e = 0) {
  return isNaN(Number(t)) ? (E(`"${t}" is not a number, falling back to ${e}`, "warning"), e) : t;
}
const nh = (t, e) => bt(Math.round(sn(t ?? 0, 0)), e), sh = (t) => {
  let { value: e, context: n } = t, s = e;
  if (typeof s == "object" && !Array.isArray(s) && (s = s.note || s.n || s.value, s === void 0))
    throw new Error(`cannot find a playable note for ${JSON.stringify(e)}`);
  if (typeof s == "number" && n.type !== "frequency")
    s = it(t.value);
  else if (typeof s == "number" && n.type === "frequency")
    s = t.value;
  else if (typeof s != "string" || !Mt(s))
    throw new Error("not a note: " + JSON.stringify(s));
  return s;
}, rh = (t) => {
  let { value: e, context: n } = t;
  if (typeof e == "object")
    return e.freq ? e.freq : tn(e.note || e.n || e.value);
  if (typeof e == "number" && n.type !== "frequency")
    e = it(t.value);
  else if (typeof e == "string" && Mt(e))
    e = it(gt(t.value));
  else if (typeof e != "number")
    throw new Error("not a note or frequency: " + e);
  return e;
}, rn = (t, e) => t.slice(e).concat(t.slice(0, e)), on = (...t) => t.reduce(
  (e, n) => (...s) => e(n(...s)),
  (e) => e
), oh = (...t) => on(...t.reverse()), lt = (t) => t.filter((e) => e != null), G = (t) => [].concat(...t), ot = (t) => t, ch = (t, e) => t, _t = (t, e) => Array.from({ length: e - t + 1 }, (n, s) => s + t);
function w(t, e, n = t.length) {
  const s = function r(...o) {
    if (o.length >= n)
      return t.apply(this, o);
    {
      const i = function(...a) {
        return r.apply(this, o.concat(a));
      };
      return e && e(i, o), i;
    }
  };
  return e && e(s, []), s;
}
function ce(t) {
  const e = Number(t);
  if (!isNaN(e))
    return e;
  if (Mt(t))
    return gt(t);
  throw new Error(`cannot parse as numeral: "${t}"`);
}
function ie(t, e) {
  return (...n) => t(...n.map(e));
}
function L(t) {
  return ie(t, ce);
}
function cn(t) {
  const e = Number(t);
  if (!isNaN(e))
    return e;
  const n = {
    pi: Math.PI,
    w: 1,
    h: 0.5,
    q: 0.25,
    e: 0.125,
    s: 0.0625,
    t: 1 / 3,
    f: 0.2,
    x: 1 / 6
  }[t];
  if (typeof n < "u")
    return n;
  throw new Error(`cannot parse as fractional: "${t}"`);
}
const ih = (t) => ie(t, cn), ue = function(t, e) {
  return [e.slice(0, t), e.slice(t)];
}, Pt = (t, e, n) => e.map((s, r) => t(s, n[r])), un = function(t) {
  const e = [];
  for (let n = 0; n < t.length - 1; ++n)
    e.push([t[n], t[n + 1]]);
  return e;
}, an = (t, e, n) => Math.min(Math.max(t, e), n), ln = ["Do", "Reb", "Re", "Mib", "Mi", "Fa", "Solb", "Sol", "Lab", "La", "Sib", "Si"], pn = [
  "Sa",
  "Re",
  "Ga",
  "Ma",
  "Pa",
  "Dha",
  "Ni"
], fn = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Hb", "H"], hn = [
  "Ni",
  "Pab",
  "Pa",
  "Voub",
  "Vou",
  "Ga",
  "Dib",
  "Di",
  "Keb",
  "Ke",
  "Zob",
  "Zo"
], dn = [
  "I",
  "Ro",
  "Ha",
  "Ni",
  "Ho",
  "He",
  "To"
], mn = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"], uh = (t, e = "letters") => {
  const s = (e === "solfeggio" ? ln : e === "indian" ? pn : e === "german" ? fn : e === "byzantine" ? hn : e === "japanese" ? dn : mn)[t % 12], r = Math.floor(t / 12) - 1;
  return s + r;
};
function ah(t) {
  var e = {};
  return t.filter(function(n) {
    return e.hasOwn(n) ? !1 : e[n] = !0;
  });
}
function lh(t) {
  return t.sort().filter(function(e, n, s) {
    return !n || e != s[n - 1];
  });
}
function yn(t) {
  return t.sort((e, n) => e.compare(n)).filter(function(e, n, s) {
    return !n || e.ne(s[n - 1]);
  });
}
function wn(t) {
  const e = new TextEncoder().encode(t);
  return btoa(String.fromCharCode(...e));
}
function gn(t) {
  const e = new Uint8Array(
    atob(t).split("").map((s) => s.charCodeAt(0))
  );
  return new TextDecoder().decode(e);
}
function ph(t) {
  return encodeURIComponent(wn(t));
}
function fh(t) {
  return gn(decodeURIComponent(t));
}
function bn(t, e) {
  return Array.isArray(t) ? t.map(e) : Object.fromEntries(Object.entries(t).map(([n, s], r) => [n, e(s, n, r)]));
}
function Kt(t, e) {
  return t / e;
}
class _n {
  constructor({
    getTargetClockTime: e = vn,
    weight: n = 16,
    offsetDelta: s = 5e-3,
    checkAfterTime: r = 2,
    resetAfterTime: o = 8
  }) {
    this.offsetTime, this.timeAtPrevOffsetSample, this.prevOffsetTimes = [], this.getTargetClockTime = e, this.weight = n, this.offsetDelta = s, this.checkAfterTime = r, this.resetAfterTime = o, this.reset = () => {
      this.prevOffsetTimes = [], this.offsetTime = null, this.timeAtPrevOffsetSample = null;
    };
  }
  calculateOffset(e) {
    const n = this.getTargetClockTime(), s = n - this.timeAtPrevOffsetSample, r = n - e;
    if (s > this.resetAfterTime && this.reset(), this.offsetTime == null && (this.offsetTime = r), this.prevOffsetTimes.push(r), this.prevOffsetTimes.length > this.weight && this.prevOffsetTimes.shift(), this.timeAtPrevOffsetSample == null || s > this.checkAfterTime) {
      this.timeAtPrevOffsetSample = n;
      const o = nn(this.prevOffsetTimes);
      Math.abs(o - this.offsetTime) > this.offsetDelta && (this.offsetTime = o);
    }
    return this.offsetTime;
  }
  calculateTimestamp(e, n) {
    return this.calculateOffset(e) + n;
  }
}
function hh() {
  return performance.now() * 1e-3;
}
function vn() {
  return Date.now() * 1e-3;
}
const kn = /* @__PURE__ */ new Map([
  ["control", "Control"],
  ["ctrl", "Control"],
  ["alt", "Alt"],
  ["shift", "Shift"],
  ["down", "ArrowDown"],
  ["up", "ArrowUp"],
  ["left", "ArrowLeft"],
  ["right", "ArrowRight"]
]);
let rt;
function qn() {
  if (rt == null) {
    if (typeof window > "u")
      return;
    rt = {}, window.addEventListener("keydown", (t) => {
      rt[t.key] = !0;
    }), window.addEventListener("keyup", (t) => {
      rt[t.key] = !1;
    });
  }
  return { ...rt };
}
function ae(t, e = !1) {
  return typeof t == "object" ? e ? JSON.stringify(t).slice(1, -1).replaceAll('"', "").replaceAll(",", " ") : JSON.stringify(t) : t;
}
T.prototype.sam = function() {
  return this.floor();
};
T.prototype.nextSam = function() {
  return this.sam().add(1);
};
T.prototype.wholeCycle = function() {
  return new B(this.sam(), this.nextSam());
};
T.prototype.cyclePos = function() {
  return this.sub(this.sam());
};
T.prototype.lt = function(t) {
  return this.compare(t) < 0;
};
T.prototype.gt = function(t) {
  return this.compare(t) > 0;
};
T.prototype.lte = function(t) {
  return this.compare(t) <= 0;
};
T.prototype.gte = function(t) {
  return this.compare(t) >= 0;
};
T.prototype.eq = function(t) {
  return this.compare(t) == 0;
};
T.prototype.ne = function(t) {
  return this.compare(t) != 0;
};
T.prototype.max = function(t) {
  return this.gt(t) ? this : t;
};
T.prototype.maximum = function(...t) {
  return t = t.map((e) => new T(e)), t.reduce((e, n) => n.max(e), this);
};
T.prototype.min = function(t) {
  return this.lt(t) ? this : t;
};
T.prototype.mulmaybe = function(t) {
  return t !== void 0 ? this.mul(t) : void 0;
};
T.prototype.divmaybe = function(t) {
  return t !== void 0 ? this.div(t) : void 0;
};
T.prototype.addmaybe = function(t) {
  return t !== void 0 ? this.add(t) : void 0;
};
T.prototype.submaybe = function(t) {
  return t !== void 0 ? this.sub(t) : void 0;
};
T.prototype.show = function() {
  return this.s * this.n + "/" + this.d;
};
T.prototype.or = function(t) {
  return this.eq(0) ? t : this;
};
const m = (t) => T(t), Sn = (...t) => {
  if (t = lt(t), t.length !== 0)
    return t.reduce((e, n) => e.gcd(n), m(1));
}, Y = (...t) => {
  if (t = lt(t), t.length === 0)
    return;
  const e = t.pop();
  return t.reduce(
    (n, s) => n === void 0 || s === void 0 ? void 0 : n.lcm(s),
    e
  );
}, An = (t) => t instanceof T;
m._original = T;
class B {
  constructor(e, n) {
    this.begin = m(e), this.end = m(n);
  }
  get spanCycles() {
    const e = [];
    var n = this.begin;
    const s = this.end, r = s.sam();
    if (n.equals(s))
      return [new B(n, s)];
    for (; s.gt(n); ) {
      if (n.sam().equals(r)) {
        e.push(new B(n, this.end));
        break;
      }
      const o = n.nextSam();
      e.push(new B(n, o)), n = o;
    }
    return e;
  }
  get duration() {
    return this.end.sub(this.begin);
  }
  cycleArc() {
    const e = this.begin.cyclePos(), n = e.add(this.duration);
    return new B(e, n);
  }
  withTime(e) {
    return new B(e(this.begin), e(this.end));
  }
  withEnd(e) {
    return new B(this.begin, e(this.end));
  }
  withCycle(e) {
    const n = this.begin.sam(), s = n.add(e(this.begin.sub(n))), r = n.add(e(this.end.sub(n)));
    return new B(s, r);
  }
  intersection(e) {
    const n = this.begin.max(e.begin), s = this.end.min(e.end);
    if (!n.gt(s) && !(n.equals(s) && (n.equals(this.end) && this.begin.lt(this.end) || n.equals(e.end) && e.begin.lt(e.end))))
      return new B(n, s);
  }
  intersection_e(e) {
    const n = this.intersection(e);
    if (n == null)
      throw "TimeSpans do not intersect";
    return n;
  }
  midpoint() {
    return this.begin.add(this.duration.div(m(2)));
  }
  equals(e) {
    return this.begin.equals(e.begin) && this.end.equals(e.end);
  }
  show() {
    return this.begin.show() + " → " + this.end.show();
  }
}
class S {
  /*
        Event class, representing a value active during the timespan
        'part'. This might be a fragment of an event, in which case the
        timespan will be smaller than the 'whole' timespan, otherwise the
        two timespans will be the same. The 'part' must never extend outside of the
        'whole'. If the event represents a continuously changing value
        then the whole will be returned as None, in which case the given
        value will have been sampled from the point halfway between the
        start and end of the 'part' timespan.
        The context is to store a list of source code locations causing the event.
  
        The word 'Event' is more or less a reserved word in javascript, hence this
        class is named called 'Hap'.
        */
  constructor(e, n, s, r = {}, o = !1) {
    this.whole = e, this.part = n, this.value = s, this.context = r, this.stateful = o, o && console.assert(typeof this.value == "function", "Stateful values must be functions");
  }
  get duration() {
    let e;
    return typeof this.value?.duration == "number" ? e = m(this.value.duration) : e = this.whole.end.sub(this.whole.begin), typeof this.value?.clip == "number" ? e.mul(this.value.clip) : e;
  }
  get endClipped() {
    return this.whole.begin.add(this.duration);
  }
  isActive(e) {
    return this.whole.begin <= e && this.endClipped >= e;
  }
  isInPast(e) {
    return e > this.endClipped;
  }
  isInNearPast(e, n) {
    return n - e <= this.endClipped;
  }
  isInFuture(e) {
    return e < this.whole.begin;
  }
  isInNearFuture(e, n) {
    return n < this.whole.begin && n > this.whole.begin - e;
  }
  isWithinTime(e, n) {
    return this.whole.begin <= n && this.endClipped >= e;
  }
  wholeOrPart() {
    return this.whole ? this.whole : this.part;
  }
  withSpan(e) {
    const n = this.whole ? e(this.whole) : void 0;
    return new S(n, e(this.part), this.value, this.context);
  }
  withValue(e) {
    return new S(this.whole, this.part, e(this.value), this.context);
  }
  hasOnset() {
    return this.whole != null && this.whole.begin.equals(this.part.begin);
  }
  hasTag(e) {
    return this.context.tags?.includes(e);
  }
  resolveState(e) {
    if (this.stateful && this.hasOnset()) {
      console.log("stateful");
      const n = this.value, [s, r] = n(e);
      return [s, new S(this.whole, this.part, r, this.context, !1)];
    }
    return [e, this];
  }
  spanEquals(e) {
    return this.whole == null && e.whole == null || this.whole.equals(e.whole);
  }
  equals(e) {
    return this.spanEquals(e) && this.part.equals(e.part) && // TODO would == be better ??
    this.value === e.value;
  }
  show(e = !1) {
    const n = typeof this.value == "object" ? e ? JSON.stringify(this.value).slice(1, -1).replaceAll('"', "").replaceAll(",", " ") : JSON.stringify(this.value) : this.value;
    var s = "";
    if (this.whole == null)
      s = "~" + this.part.show;
    else {
      var r = this.whole.begin.equals(this.part.begin) && this.whole.end.equals(this.part.end);
      this.whole.begin.equals(this.part.begin) || (s = this.whole.begin.show() + " ⇜ "), r || (s += "("), s += this.part.show(), r || (s += ")"), this.whole.end.equals(this.part.end) || (s += " ⇝ " + this.whole.end.show());
    }
    return "[ " + s + " | " + n + " ]";
  }
  showWhole(e = !1) {
    return `${this.whole == null ? "~" : this.whole.show()}: ${ae(this.value, e)}`;
  }
  combineContext(e) {
    const n = this;
    return { ...n.context, ...e.context, locations: (n.context.locations || []).concat(e.context.locations || []) };
  }
  setContext(e) {
    return new S(this.whole, this.part, this.value, e);
  }
  ensureObjectValue() {
    if (typeof this.value != "object")
      throw new Error(
        `expected hap.value to be an object, but got "${this.value}". Hint: append .note() or .s() to the end`,
        "error"
      );
  }
}
class ut {
  constructor(e, n = {}) {
    this.span = e, this.controls = n;
  }
  // Returns new State with different span
  setSpan(e) {
    return new ut(e, this.controls);
  }
  withSpan(e) {
    return this.setSpan(e(this.span));
  }
  // Returns new State with added controls.
  setControls(e) {
    return new ut(this.span, { ...this.controls, ...e });
  }
}
function Tn(t, e, n) {
  if (e?.value !== void 0 && Object.keys(e).length === 1)
    return E("[warn]: Can't do arithmetic on control pattern."), t;
  const s = Object.keys(t).filter((r) => Object.keys(e).includes(r));
  return Object.assign({}, t, e, Object.fromEntries(s.map((r) => [r, n(t[r], e[r])])));
}
w((t, e) => t * e);
w((t, e) => e.map(t));
function Cn(t, e = 60) {
  let n = 0, s = m(0), r = [""], o = "";
  for (; r[0].length < e; ) {
    const i = t.queryArc(n, n + 1), a = i.filter((h) => h.hasOnset()).map((h) => h.duration), u = Sn(...a), p = u.inverse();
    r = r.map((h) => h + "|"), o += "|";
    for (let h = 0; h < p; h++) {
      const [y, g] = [s, s.add(u)], v = i.filter((O) => O.whole.begin.lte(y) && O.whole.end.gte(g)), _ = v.length - r.length;
      _ > 0 && (r = r.concat(Array(_).fill(o))), r = r.map((O, A) => {
        const I = v[A];
        if (I) {
          const P = I.whole.begin.eq(y) ? "" + I.value : "-";
          return O + P;
        }
        return O + ".";
      }), o += ".", s = s.add(u);
    }
    n++;
  }
  return r.join(`
`);
}
const le = {}, xn = async (...t) => {
  const e = await Promise.allSettled(t), n = e.filter((s) => s.status === "fulfilled").map((s) => s.value);
  return e.forEach((s, r) => {
    s.status === "rejected" && console.warn(`evalScope: module with index ${r} could not be loaded:`, s.reason);
  }), n.forEach((s) => {
    Object.entries(s).forEach(([r, o]) => {
      globalThis[r] = o, le[r] = o;
    });
  }), n;
};
function Bn(t, e = {}) {
  const { wrapExpression: n = !0, wrapAsync: s = !0 } = e;
  n && (t = `{${t}}`), s && (t = `(async ()=>${t})()`);
  const r = `"use strict";return (${t})`;
  return Function(r)();
}
const On = async (t, e, n) => {
  let s = {};
  if (e) {
    const i = e(t, n);
    t = i.output, s = i;
  }
  return { mode: "javascript", pattern: await Bn(t, { wrapExpression: !!e }), meta: s };
};
let Ct, J = !0;
const dh = function(t) {
  J = !!t;
}, mh = (t) => Ct = t;
class f {
  /**
   * Create a pattern. As an end user, you will most likely not create a Pattern directly.
   *
   * @param {function} query - The function that maps a `State` to an array of `Hap`.
   * @noAutocomplete
   */
  constructor(e, n = void 0) {
    this.query = e, this._Pattern = !0, this._steps = n;
  }
  get _steps() {
    return this.__steps;
  }
  set _steps(e) {
    this.__steps = e === void 0 ? void 0 : m(e);
  }
  setSteps(e) {
    return this._steps = e, this;
  }
  withSteps(e) {
    return J ? new f(this.query, this._steps === void 0 ? void 0 : e(this._steps)) : this;
  }
  get hasSteps() {
    return this._steps !== void 0;
  }
  //////////////////////////////////////////////////////////////////////
  // Haskell-style functor, applicative and monadic operations
  /**
   * Returns a new pattern, with the function applied to the value of
   * each hap. It has the alias `fmap`.
   * @synonyms fmap
   * @param {Function} func to to apply to the value
   * @returns Pattern
   * @example
   * "0 1 2".withValue(v => v + 10).log()
   */
  withValue(e) {
    const n = new f((s) => this.query(s).map((r) => r.withValue(e)));
    return n._steps = this._steps, n;
  }
  // runs func on query state
  withState(e) {
    return new f((n) => this.query(e(n)));
  }
  /**
   * see `withValue`
   * @noAutocomplete
   */
  fmap(e) {
    return this.withValue(e);
  }
  /**
   * Assumes 'this' is a pattern of functions, and given a function to
   * resolve wholes, applies a given pattern of values to that
   * pattern of functions.
   * @param {Function} whole_func
   * @param {Function} func
   * @noAutocomplete
   * @returns Pattern
   */
  appWhole(e, n) {
    const s = this, r = function(o) {
      const i = s.query(o), a = n.query(o), u = function(p, h) {
        const y = p.part.intersection(h.part);
        if (y != null)
          return new S(
            e(p.whole, h.whole),
            y,
            p.value(h.value),
            h.combineContext(p)
          );
      };
      return G(
        i.map((p) => lt(a.map((h) => u(p, h))))
      );
    };
    return new f(r);
  }
  /**
   * When this method is called on a pattern of functions, it matches its haps
   * with those in the given pattern of values.  A new pattern is returned, with
   * each matching value applied to the corresponding function.
   *
   * In this `_appBoth` variant, where timespans of the function and value haps
   * are not the same but do intersect, the resulting hap has a timespan of the
   * intersection. This applies to both the part and the whole timespan.
   * @param {Pattern} pat_val
   * @noAutocomplete
   * @returns Pattern
   */
  appBoth(e) {
    const n = this, s = function(o, i) {
      if (!(o == null || i == null))
        return o.intersection_e(i);
    }, r = n.appWhole(s, e);
    return J && (r._steps = Y(e._steps, n._steps)), r;
  }
  /**
   * As with `appBoth`, but the `whole` timespan is not the intersection,
   * but the timespan from the function of patterns that this method is called
   * on. In practice, this means that the pattern structure, including onsets,
   * are preserved from the pattern of functions (often referred to as the left
   * hand or inner pattern).
   * @param {Pattern} pat_val
   * @noAutocomplete
   * @returns Pattern
   */
  appLeft(e) {
    const n = this, s = function(o) {
      const i = [];
      for (const a of n.query(o)) {
        const u = e.query(o.setSpan(a.wholeOrPart()));
        for (const p of u) {
          const h = a.whole, y = a.part.intersection(p.part);
          if (y) {
            const g = a.value(p.value), v = p.combineContext(a), _ = new S(h, y, g, v);
            i.push(_);
          }
        }
      }
      return i;
    }, r = new f(s);
    return r._steps = this._steps, r;
  }
  /**
   * As with `appLeft`, but `whole` timespans are instead taken from the
   * pattern of values, i.e. structure is preserved from the right hand/outer
   * pattern.
   * @param {Pattern} pat_val
   * @noAutocomplete
   * @returns Pattern
   */
  appRight(e) {
    const n = this, s = function(o) {
      const i = [];
      for (const a of e.query(o)) {
        const u = n.query(o.setSpan(a.wholeOrPart()));
        for (const p of u) {
          const h = a.whole, y = p.part.intersection(a.part);
          if (y) {
            const g = p.value(a.value), v = a.combineContext(p), _ = new S(h, y, g, v);
            i.push(_);
          }
        }
      }
      return i;
    }, r = new f(s);
    return r._steps = e._steps, r;
  }
  bindWhole(e, n) {
    const s = this, r = function(o) {
      const i = function(u, p) {
        return new S(
          e(u.whole, p.whole),
          p.part,
          p.value,
          Object.assign({}, u.context, p.context, {
            locations: (u.context.locations || []).concat(p.context.locations || [])
          })
        );
      }, a = function(u) {
        return n(u.value).query(o.setSpan(u.part)).map((p) => i(u, p));
      };
      return G(s.query(o).map((u) => a(u)));
    };
    return new f(r);
  }
  bind(e) {
    const n = function(s, r) {
      if (!(s == null || r == null))
        return s.intersection_e(r);
    };
    return this.bindWhole(n, e);
  }
  join() {
    return this.bind(ot);
  }
  outerBind(e) {
    return this.bindWhole((n) => n, e).setSteps(this._steps);
  }
  outerJoin() {
    return this.outerBind(ot);
  }
  innerBind(e) {
    return this.bindWhole((n, s) => s, e);
  }
  innerJoin() {
    return this.innerBind(ot);
  }
  // Flatterns patterns of patterns, by retriggering/resetting inner patterns at onsets of outer pattern haps
  resetJoin(e = !1) {
    const n = this;
    return new f((s) => n.discreteOnly().query(s).map((r) => r.value.late(e ? r.whole.begin : r.whole.begin.cyclePos()).query(s).map(
      (o) => new S(
        // Supports continuous haps in the inner pattern
        o.whole ? o.whole.intersection(r.whole) : void 0,
        o.part.intersection(r.part),
        o.value
      ).setContext(r.combineContext(o))
    ).filter((o) => o.part)).flat());
  }
  restartJoin() {
    return this.resetJoin(!0);
  }
  // Like the other joins above, joins a pattern of patterns of values, into a flatter
  // pattern of values. In this case it takes whole cycles of the inner pattern to fit each event
  // in the outer pattern.
  squeezeJoin() {
    const e = this;
    function n(s) {
      const r = e.discreteOnly().query(s);
      function o(a) {
        const p = a.value._focusSpan(a.wholeOrPart()).query(s.setSpan(a.part));
        function h(y, g) {
          let v;
          if (g.whole && y.whole && (v = g.whole.intersection(y.whole), !v))
            return;
          const _ = g.part.intersection(y.part);
          if (!_)
            return;
          const O = g.combineContext(y);
          return new S(v, _, g.value, O);
        }
        return p.map((y) => h(a, y));
      }
      return G(r.map(o)).filter((a) => a);
    }
    return new f(n);
  }
  squeezeBind(e) {
    return this.fmap(e).squeezeJoin();
  }
  polyJoin = function() {
    const e = this;
    return e.fmap((n) => n.extend(e._steps.div(n._steps))).outerJoin();
  };
  polyBind(e) {
    return this.fmap(e).polyJoin();
  }
  //////////////////////////////////////////////////////////////////////
  // Utility methods mainly for internal use
  /**
   * Query haps inside the given time span.
   *
   * @param {Fraction | number} begin from time
   * @param {Fraction | number} end to time
   * @returns Hap[]
   * @example
   * const pattern = sequence('a', ['b', 'c'])
   * const haps = pattern.queryArc(0, 1)
   * console.log(haps)
   * silence
   * @noAutocomplete
   */
  queryArc(e, n, s = {}) {
    try {
      return this.query(new ut(new B(e, n), s));
    } catch (r) {
      return zt(r, "query"), [];
    }
  }
  /**
   * Returns a new pattern, with queries split at cycle boundaries. This makes
   * some calculations easier to express, as all haps are then constrained to
   * happen within a cycle.
   * @returns Pattern
   * @noAutocomplete
   */
  splitQueries() {
    const e = this, n = (s) => G(s.span.spanCycles.map((r) => e.query(s.setSpan(r))));
    return new f(n);
  }
  /**
   * Returns a new pattern, where the given function is applied to the query
   * timespan before passing it to the original pattern.
   * @param {Function} func the function to apply
   * @returns Pattern
   * @noAutocomplete
   */
  withQuerySpan(e) {
    return new f((n) => this.query(n.withSpan(e)));
  }
  withQuerySpanMaybe(e) {
    const n = this;
    return new f((s) => {
      const r = s.withSpan(e);
      return r.span ? n.query(r) : [];
    });
  }
  /**
   * As with `withQuerySpan`, but the function is applied to both the
   * begin and end time of the query timespan.
   * @param {Function} func the function to apply
   * @returns Pattern
   * @noAutocomplete
   */
  withQueryTime(e) {
    return new f((n) => this.query(n.withSpan((s) => s.withTime(e))));
  }
  /**
   * Similar to `withQuerySpan`, but the function is applied to the timespans
   * of all haps returned by pattern queries (both `part` timespans, and where
   * present, `whole` timespans).
   * @param {Function} func
   * @returns Pattern
   * @noAutocomplete
   */
  withHapSpan(e) {
    return new f((n) => this.query(n).map((s) => s.withSpan(e)));
  }
  /**
   * As with `withHapSpan`, but the function is applied to both the
   * begin and end time of the hap timespans.
   * @param {Function} func the function to apply
   * @returns Pattern
   * @noAutocomplete
   */
  withHapTime(e) {
    return this.withHapSpan((n) => n.withTime(e));
  }
  /**
   * Returns a new pattern with the given function applied to the list of haps returned by every query.
   * @param {Function} func
   * @returns Pattern
   * @noAutocomplete
   */
  withHaps(e) {
    const n = new f((s) => e(this.query(s), s));
    return n._steps = this._steps, n;
  }
  /**
   * As with `withHaps`, but applies the function to every hap, rather than every list of haps.
   * @param {Function} func
   * @returns Pattern
   * @noAutocomplete
   */
  withHap(e) {
    return this.withHaps((n) => n.map(e));
  }
  /**
   * Returns a new pattern with the context field set to every hap set to the given value.
   * @param {*} context
   * @returns Pattern
   * @noAutocomplete
   */
  setContext(e) {
    return this.withHap((n) => n.setContext(e));
  }
  /**
   * Returns a new pattern with the given function applied to the context field of every hap.
   * @param {Function} func
   * @returns Pattern
   * @noAutocomplete
   */
  withContext(e) {
    const n = this.withHap((s) => s.setContext(e(s.context)));
    return this.__pure !== void 0 && (n.__pure = this.__pure, n.__pure_loc = this.__pure_loc), n;
  }
  /**
   * Returns a new pattern with the context field of every hap set to an empty object.
   * @returns Pattern
   * @noAutocomplete
   */
  stripContext() {
    return this.withHap((e) => e.setContext({}));
  }
  /**
   * Returns a new pattern with the given location information added to the
   * context of every hap.
   * @param {Number} start start offset
   * @param {Number} end end offset
   * @returns Pattern
   * @noAutocomplete
   */
  withLoc(e, n) {
    const s = {
      start: e,
      end: n
    }, r = this.withContext((o) => {
      const i = (o.locations || []).concat([s]);
      return { ...o, locations: i };
    });
    return this.__pure && (r.__pure = this.__pure, r.__pure_loc = s), r;
  }
  /**
   * Returns a new Pattern, which only returns haps that meet the given test.
   * @param {Function} hap_test - a function which returns false for haps to be removed from the pattern
   * @returns Pattern
   * @example
   * s("bd*8").velocity(rand).filterHaps((h) => (h.whole.begin % 1) < h.value.velocity)
   */
  filterHaps(e) {
    return new f((n) => this.query(n).filter(e));
  }
  /**
   * As with `filterHaps`, but the function is applied to values
   * inside haps.
   * @param {Function} value_test
   * @returns Pattern
   * @example
   * const drums = s("bd sd bd sd")
   * kick: drums.filterValues((v) => v.s === 'bd').duck(2)
   * snare: drums.filterValues((v) => v.s === 'sd')
   * bass: s("saw!4").note("G#1").lpf(80).lpenv(4).orbit(2)
   */
  filterValues(e) {
    return new f((n) => this.query(n).filter((s) => e(s.value))).setSteps(this._steps);
  }
  /**
   * Returns a new pattern, with haps containing undefined values removed from
   * query results.
   * @returns Pattern
   * @noAutocomplete
   */
  removeUndefineds() {
    return this.filterValues((e) => e != null);
  }
  /**
   * Returns a new pattern, with all haps without onsets filtered out. A hap
   * with an onset is one with a `whole` timespan that begins at the same time
   * as its `part` timespan.
   * @returns Pattern
   * @noAutocomplete
   */
  onsetsOnly() {
    return this.filterHaps((e) => e.hasOnset());
  }
  /**
   * Returns a new pattern, with 'continuous' haps (those without 'whole'
   * timespans) removed from query results.
   * @returns Pattern
   * @noAutocomplete
   */
  discreteOnly() {
    return this.filterHaps((e) => e.whole);
  }
  /**
   * Combines adjacent haps with the same value and whole.  Only
   * intended for use in tests.
   * @noAutocomplete
   */
  defragmentHaps() {
    return this.discreteOnly().withHaps((n) => {
      const s = [];
      for (var r = 0; r < n.length; ++r) {
        for (var o = !0, i = n[r]; o; ) {
          const p = JSON.stringify(n[r].value);
          for (var a = !1, u = r + 1; u < n.length; u++) {
            const h = n[u];
            if (i.whole.equals(h.whole)) {
              if (i.part.begin.eq(h.part.end)) {
                if (p === JSON.stringify(h.value)) {
                  i = new S(i.whole, new B(h.part.begin, i.part.end), i.value), n.splice(u, 1), a = !0;
                  break;
                }
              } else if (h.part.begin.eq(i.part.end) && p == JSON.stringify(h.value)) {
                i = new S(i.whole, new B(i.part.begin, h.part.end), i.value), n.splice(u, 1), a = !0;
                break;
              }
            }
          }
          o = a;
        }
        s.push(i);
      }
      return s;
    });
  }
  /**
   * Queries the pattern for the first cycle, returning Haps. Mainly of use when
   * debugging a pattern.
   * @param {Boolean} with_context - set to true, otherwise the context field
   * will be stripped from the resulting haps.
   * @returns [Hap]
   * @noAutocomplete
   */
  firstCycle(e = !1) {
    var n = this;
    return e || (n = n.stripContext()), n.query(new ut(new B(m(0), m(1))));
  }
  /**
   * Accessor for a list of values returned by querying the first cycle.
   * @noAutocomplete
   */
  get firstCycleValues() {
    return this.firstCycle().map((e) => e.value);
  }
  /**
   * More human-readable version of the `firstCycleValues` accessor.
   * @noAutocomplete
   */
  get showFirstCycle() {
    return this.firstCycle().map(
      (e) => `${e.value}: ${e.whole.begin.toFraction()} - ${e.whole.end.toFraction()}`
    );
  }
  /**
   * Returns a new pattern, which returns haps sorted in temporal order. Mainly
   * of use when comparing two patterns for equality, in tests.
   * @returns Pattern
   * @noAutocomplete
   */
  sortHapsByPart() {
    return this.withHaps(
      (e) => e.sort(
        (n, s) => n.part.begin.sub(s.part.begin).or(n.part.end.sub(s.part.end)).or(n.whole.begin.sub(s.whole.begin).or(n.whole.end.sub(s.whole.end)))
      )
    );
  }
  asNumber() {
    return this.fmap(ce);
  }
  //////////////////////////////////////////////////////////////////////
  // Operators - see 'make composers' later..
  _opIn(e, n) {
    return this.fmap(n).appLeft(d(e));
  }
  _opOut(e, n) {
    return this.fmap(n).appRight(d(e));
  }
  _opMix(e, n) {
    return this.fmap(n).appBoth(d(e));
  }
  _opSqueeze(e, n) {
    const s = d(e);
    return this.fmap((r) => s.fmap((o) => n(r)(o))).squeezeJoin();
  }
  _opSqueezeOut(e, n) {
    const s = this;
    return d(e).fmap((o) => s.fmap((i) => n(i)(o))).squeezeJoin();
  }
  _opReset(e, n) {
    return d(e).fmap((r) => this.fmap((o) => n(o)(r))).resetJoin();
  }
  _opRestart(e, n) {
    return d(e).fmap((r) => this.fmap((o) => n(o)(r))).restartJoin();
  }
  _opPoly(e, n) {
    const s = d(e);
    return this.fmap((r) => s.fmap((o) => n(o)(r))).polyJoin();
  }
  //////////////////////////////////////////////////////////////////////
  // End-user methods.
  // Those beginning with an underscore (_) are 'patternified',
  // i.e. versions are created without the underscore, that are
  // magically transformed to accept patterns for all their arguments.
  //////////////////////////////////////////////////////////////////////
  // Methods without corresponding toplevel functions
  /**
   * Layers the result of the given function(s). Like `superimpose`, but without the original pattern:
   * @name layer
   * @memberof Pattern
   * @synonyms apply
   * @returns Pattern
   * @example
   * "<0 2 4 6 ~ 4 ~ 2 0!3 ~!5>*8"
   *   .layer(x=>x.add("0,2"))
   *   .scale('C minor').note()
   */
  layer(...e) {
    return z(...e.map((n) => n(this)));
  }
  /**
   * Superimposes the result of the given function(s) on top of the original pattern:
   * @name superimpose
   * @memberof Pattern
   * @returns Pattern
   * @example
   * "<0 2 4 6 ~ 4 ~ 2 0!3 ~!5>*8"
   *   .superimpose(x=>x.add(2))
   *   .scale('C minor').note()
   */
  superimpose(...e) {
    return this.stack(...e.map((n) => n(this)));
  }
  //////////////////////////////////////////////////////////////////////
  // Multi-pattern functions
  stack(...e) {
    return z(this, ...e);
  }
  sequence(...e) {
    return Q(this, ...e);
  }
  seq(...e) {
    return Q(this, ...e);
  }
  cat(...e) {
    return mt(this, ...e);
  }
  fastcat(...e) {
    return N(this, ...e);
  }
  slowcat(...e) {
    return Z(this, ...e);
  }
  //////////////////////////////////////////////////////////////////////
  // Context methods - ones that deal with metadata
  onTrigger(e, n = !0) {
    return this.withHap(
      (s) => s.setContext({
        ...s.context,
        onTrigger: (...r) => {
          s.context.onTrigger?.(...r), e(...r);
        },
        // if dominantTrigger is set to true, the default output (webaudio) will be disabled
        // when using multiple triggers, you cannot flip this flag to false again!
        // example: x.csound('CooLSynth').log() as well as x.log().csound('CooLSynth') should work the same
        dominantTrigger: s.context.dominantTrigger || n
      })
    );
  }
  /**
   * Writes the content of the current event to the console (visible in the side menu).
   * @name log
   * @memberof Pattern
   * @example
   * s("bd sd").log()
   */
  log(e = (s) => `[hap] ${s.showWhole(!0)}`, n = (s) => ({ hap: s })) {
    return this.onTrigger((...s) => {
      E(e(...s), void 0, n(...s));
    }, !1);
  }
  /**
   * A simplified version of `log` which writes all "values" (various configurable parameters)
   * within the event to the console (visible in the side menu).
   * @name logValues
   * @memberof Pattern
   * @example
   * s("bd sd").gain("0.25 0.5 1").n("2 1 0").logValues()
   */
  logValues(e = (n) => `[hap] ${ae(n, !0)}`) {
    return this.log((n) => e(n.value));
  }
  //////////////////////////////////////////////////////////////////////
  // Visualisation
  drawLine() {
    return console.log(Cn(this)), this;
  }
  //////////////////////////////////////////////////////////////////////
  // methods relating to breaking patterns into subcycles
  // Breaks a pattern into a pattern of patterns, according to the structure of the given binary pattern.
  unjoin(e, n = ot) {
    return e.withHap(
      (s) => s.withValue((r) => r ? n(this.ribbon(s.whole.begin, s.whole.duration)) : this)
    );
  }
  /**
   * Breaks a pattern into pieces according to the structure of a given pattern.
   * True values in the given pattern cause the corresponding subcycle of the
   * source pattern to be looped, and for an (optional) given function to be
   * applied. False values result in the corresponding part of the source pattern
   * to be played unchanged.
   * @name into
   * @memberof Pattern
   * @example
   * sound("bd sd ht lt").into("1 0", hurry(2))
   */
  into(e, n) {
    return this.unjoin(e, n).innerJoin();
  }
}
function zn(t, e) {
  let n = [];
  return e.forEach((s) => {
    const r = n.findIndex(([o]) => t(s, o));
    r === -1 ? n.push([s]) : n[r].push(s);
  }), n;
}
const Mn = (t, e) => t.spanEquals(e);
f.prototype.collect = function() {
  return this.withHaps(
    (t) => zn(Mn, t).map((e) => new S(e[0].whole, e[0].part, e, {}))
  );
};
const yh = l("arpWith", (t, e) => e.collect().fmap((n) => d(t(n))).innerJoin().withHap((n) => new S(n.whole, n.part, n.value.value, n.combineContext(n.value)))), wh = l(
  "arp",
  (t, e) => e.arpWith((n) => d(t).fmap((s) => n[s % n.length])),
  !1
);
function dt(t) {
  return !Array.isArray(t) && typeof t == "object" && !An(t);
}
function Pn(t, e, n) {
  return dt(t) || dt(e) ? (dt(t) || (t = { value: t }), dt(e) || (e = { value: e }), Tn(t, e, n)) : n(t, e);
}
(function() {
  const t = {
    set: [(n, s) => s],
    keep: [(n) => n],
    keepif: [(n, s) => s ? n : void 0],
    // numerical functions
    /**
     *
     * Assumes a pattern of numbers. Adds the given number to each item in the pattern.
     * @name add
     * @memberof Pattern
     * @example
     * // Here, the triad 0, 2, 4 is shifted by different amounts
     * n("0 2 4".add("<0 3 4 0>")).scale("C:major")
     * // Without add, the equivalent would be:
     * // n("<[0 2 4] [3 5 7] [4 6 8] [0 2 4]>").scale("C:major")
     * @example
     * // You can also use add with notes:
     * note("c3 e3 g3".add("<0 5 7 0>"))
     * // Behind the scenes, the notes are converted to midi numbers:
     * // note("48 52 55".add("<0 5 7 0>"))
     */
    add: [L((n, s) => n + s)],
    // support string concatenation
    /**
     *
     * Like add, but the given numbers are subtracted.
     * @name sub
     * @memberof Pattern
     * @example
     * n("0 2 4".sub("<0 1 2 3>")).scale("C4:minor")
     * // See add for more information.
     */
    sub: [L((n, s) => n - s)],
    /**
     *
     * Multiplies each number by the given factor.
     * @name mul
     * @memberof Pattern
     * @example
     * "<1 1.5 [1.66, <2 2.33>]>*4".mul(150).freq()
     */
    mul: [L((n, s) => n * s)],
    /**
     *
     * Divides each number by the given factor.
     * @name div
     * @memberof Pattern
     */
    div: [L((n, s) => n / s)],
    mod: [L(bt)],
    pow: [L(Math.pow)],
    log2: [L(Math.log2)],
    band: [L((n, s) => n & s)],
    bor: [L((n, s) => n | s)],
    bxor: [L((n, s) => n ^ s)],
    blshift: [L((n, s) => n << s)],
    brshift: [L((n, s) => n >> s)],
    // TODO - force numerical comparison if both look like numbers?
    lt: [(n, s) => n < s],
    gt: [(n, s) => n > s],
    lte: [(n, s) => n <= s],
    gte: [(n, s) => n >= s],
    eq: [(n, s) => n == s],
    eqt: [(n, s) => n === s],
    ne: [(n, s) => n != s],
    net: [(n, s) => n !== s],
    and: [(n, s) => n && s],
    or: [(n, s) => n || s],
    //  bitwise ops
    func: [(n, s) => s(n)]
  }, e = ["In", "Out", "Mix", "Squeeze", "SqueezeOut", "Reset", "Restart", "Poly"];
  for (const [n, [s, r]] of Object.entries(t)) {
    f.prototype["_" + n] = function(o) {
      return this.fmap((i) => s(i, o));
    }, Object.defineProperty(f.prototype, n, {
      // a getter that returns a function, so 'pat' can be
      // accessed by closures that are methods of that function..
      get: function() {
        const o = this, i = (...a) => o[n].in(...a);
        for (const a of e)
          i[a.toLowerCase()] = function(...u) {
            var p = o;
            u = Q(u), r && (p = r(p), u = r(u));
            var h;
            return n === "keepif" ? (h = p["_op" + a](u, (y) => (g) => s(y, g)), h = h.removeUndefineds()) : h = p["_op" + a](u, (y) => (g) => Pn(y, g, s)), h;
          };
        return i.squeezein = i.squeeze, i;
      }
    });
    for (const o of e)
      f.prototype[o.toLowerCase()] = function(...i) {
        return this.set[o.toLowerCase()](i);
      };
  }
  f.prototype.struct = function(...n) {
    return this.keepif.out(...n);
  }, f.prototype.structAll = function(...n) {
    return this.keep.out(...n);
  }, f.prototype.mask = function(...n) {
    return this.keepif.in(...n);
  }, f.prototype.maskAll = function(...n) {
    return this.keep.in(...n);
  }, f.prototype.reset = function(...n) {
    return this.keepif.reset(...n);
  }, f.prototype.resetAll = function(...n) {
    return this.keep.reset(...n);
  }, f.prototype.restart = function(...n) {
    return this.keepif.restart(...n);
  }, f.prototype.restartAll = function(...n) {
    return this.keep.restart(...n);
  };
})();
const gh = z, bh = z, _h = $t, pt = (t) => new f(() => [], t), q = pt(1), R = pt(0);
function C(t) {
  function e(s) {
    return s.span.spanCycles.map((r) => new S(m(r.begin).wholeCycle(), r, t));
  }
  const n = new f(e, 1);
  return n.__pure = t, n;
}
function pe(t) {
  return t instanceof f || t?._Pattern;
}
function d(t) {
  return pe(t) ? t : Ct && typeof t == "string" ? Ct(t) : C(t);
}
function En(t) {
  let e = C([]);
  for (const n of t)
    e = e.bind((s) => n.fmap((r) => s.concat([r])));
  return e;
}
function z(...t) {
  t = t.map((s) => Array.isArray(s) ? Q(...s) : d(s));
  const e = (s) => G(t.map((r) => r.query(s))), n = new f(e);
  return J && (n._steps = Y(...t.map((s) => s._steps))), n;
}
function Et(t, e) {
  if (e = e.map((o) => Array.isArray(o) ? Q(...o) : d(o)), e.length === 0)
    return q;
  if (e.length === 1)
    return e[0];
  const [n, ...s] = e.map((o) => o._steps), r = J ? n.maximum(...s) : void 0;
  return z(...t(r, e));
}
function jn(...t) {
  return Et(
    (e, n) => n.map((s) => s._steps.eq(e) ? s : $(s, pt(e.sub(s._steps)))),
    t
  );
}
function Jn(...t) {
  return Et(
    (e, n) => n.map((s) => s._steps.eq(e) ? s : $(pt(e.sub(s._steps)), s)),
    t
  );
}
function $n(...t) {
  return Et(
    (e, n) => n.map((s) => {
      if (s._steps.eq(e))
        return s;
      const r = pt(e.sub(s._steps).div(2));
      return $(r, s, r);
    }),
    t
  );
}
function vh(t, ...e) {
  const [n, ...s] = e.map((i) => i._steps), r = n.maximum(...s), o = {
    centre: $n,
    left: jn,
    right: Jn,
    expand: z,
    repeat: (...i) => $t(...i).steps(r)
  };
  return t.inhabit(o).fmap((i) => i(...e)).innerJoin().setSteps(r);
}
function Z(...t) {
  if (t = t.map((s) => Array.isArray(s) ? N(...s) : d(s)), t.length == 1)
    return t[0];
  const e = function(s) {
    const r = s.span, o = bt(r.begin.sam(), t.length), i = t[o];
    if (!i)
      return [];
    const a = r.begin.floor().sub(r.begin.div(t.length).floor());
    return i.withHapTime((u) => u.add(a)).query(s.setSpan(r.withTime((u) => u.sub(a))));
  }, n = J ? Y(...t.map((s) => s._steps)) : void 0;
  return new f(e).splitQueries().setSteps(n);
}
function fe(...t) {
  t = t.map(d);
  const e = function(n) {
    const s = Math.floor(n.span.begin) % t.length;
    return t[s]?.query(n) || [];
  };
  return new f(e).splitQueries();
}
function mt(...t) {
  return Z(...t);
}
function kh(...t) {
  const e = t.reduce((n, [s]) => n + s, 0);
  return t = t.map(([n, s]) => [n, s.fast(n)]), $(...t).slow(e);
}
function qh(...t) {
  let e = m(0);
  for (let n of t)
    n.length == 2 && n.unshift(e), e = n[1];
  return z(
    ...t.map(
      ([n, s, r]) => C(d(r)).compress(m(n).div(e), m(s).div(e))
    )
  ).slow(e).innerJoin();
}
function N(...t) {
  let e = Z(...t);
  return t.length > 1 && (e = e._fast(t.length), e._steps = t.length), t.length == 1 && t[0].__steps_source && (t._steps = t[0]._steps), e;
}
function Q(...t) {
  return N(...t);
}
function Nn(...t) {
  return N(...t);
}
function xt(t) {
  return Array.isArray(t) ? t.length == 0 ? [q, 0] : t.length == 1 ? xt(t[0]) : [N(...t.map((e) => xt(e)[0])), t.length] : [d(t), 1];
}
const Sh = w((t, e) => d(e).mask(t)), Ah = w((t, e) => d(e).struct(t)), Th = w((t, e) => d(e).superimpose(...t)), Ch = w((t, e) => d(e).withValue(t)), xh = w((t, e) => d(e).bind(t)), Bh = w((t, e) => d(e).innerBind(t)), Oh = w((t, e) => d(e).outerBind(t)), zh = w((t, e) => d(e).squeezeBind(t)), Mh = w((t, e) => d(e).stepBind(t)), Ph = w((t, e) => d(e).polyBind(t)), Eh = w((t, e) => d(e).set(t)), jh = w((t, e) => d(e).keep(t)), Jh = w((t, e) => d(e).keepif(t)), $h = w((t, e) => d(e).add(t)), Nh = w((t, e) => d(e).sub(t)), Lh = w((t, e) => d(e).mul(t)), Rh = w((t, e) => d(e).div(t)), Wh = w((t, e) => d(e).mod(t)), Fh = w((t, e) => d(e).pow(t)), Ih = w((t, e) => d(e).band(t)), Vh = w((t, e) => d(e).bor(t)), Hh = w((t, e) => d(e).bxor(t)), Dh = w((t, e) => d(e).blshift(t)), Gh = w((t, e) => d(e).brshift(t)), Qh = w((t, e) => d(e).lt(t)), Uh = w((t, e) => d(e).gt(t)), Xh = w((t, e) => d(e).lte(t)), Kh = w((t, e) => d(e).gte(t)), Yh = w((t, e) => d(e).eq(t)), Zh = w((t, e) => d(e).eqt(t)), td = w((t, e) => d(e).ne(t)), ed = w((t, e) => d(e).net(t)), nd = w((t, e) => d(e).and(t)), sd = w((t, e) => d(e).or(t)), rd = w((t, e) => d(e).func(t));
function l(t, e, n = !0, s = !1, r = (o) => o.innerJoin()) {
  if (Array.isArray(t)) {
    const u = {};
    for (const p of t)
      u[p] = l(p, e, n, s, r);
    return u;
  }
  const o = e.length;
  var i;
  n ? i = function(...u) {
    u = u.map(d);
    const p = u[u.length - 1];
    let h;
    if (o === 1)
      h = e(p);
    else {
      const y = u.slice(0, -1);
      if (y.every((g) => g.__pure != null)) {
        const g = y.map((_) => _.__pure), v = y.filter((_) => _.__pure_loc).map((_) => _.__pure_loc);
        h = e(...g, p), h = h.withContext((_) => {
          const O = (_.locations || []).concat(v);
          return { ..._, locations: O };
        });
      } else {
        const [g, ...v] = y;
        let _ = (...O) => e(...O, p);
        _ = w(_, null, o - 1), h = r(v.reduce((O, A) => O.appLeft(A), g.fmap(_)));
      }
    }
    return s && (h._steps = p._steps), h;
  } : i = function(...u) {
    u = u.map(d);
    const p = e(...u);
    return s && (p._steps = u[u.length - 1]._steps), p;
  }, f.prototype[t] = function(...u) {
    if (o === 2 && u.length !== 1)
      u = [Q(...u)];
    else if (o !== u.length + 1)
      throw new Error(`.${t}() expects ${o - 1} inputs but got ${u.length}.`);
    return u = u.map(d), i(...u, this);
  }, o > 1 && (f.prototype["_" + t] = function(...u) {
    const p = e(...u, this);
    return s && p.setSteps(this._steps), p;
  });
  const a = w(i, null, o);
  return le[t] = a, a;
}
function et(t, e, n = !0, s = !1, r = (o) => o.stepJoin()) {
  return l(t, e, n, s, r);
}
const od = l("round", function(t) {
  return t.asNumber().fmap((e) => Math.round(e));
}), cd = l("floor", function(t) {
  return t.asNumber().fmap((e) => Math.floor(e));
}), id = l("ceil", function(t) {
  return t.asNumber().fmap((e) => Math.ceil(e));
}), ud = l("toBipolar", function(t) {
  return t.fmap((e) => e * 2 - 1);
}), ad = l("fromBipolar", function(t) {
  return t.fmap((e) => (e + 1) / 2);
}), ld = l("range", function(t, e, n) {
  return n.mul(e - t).add(t);
}), pd = l("rangex", function(t, e, n) {
  return n._range(Math.log(t), Math.log(e)).fmap(Math.exp);
}), fd = l("range2", function(t, e, n) {
  return n.fromBipolar()._range(t, e);
}), hd = l(
  "ratio",
  (t) => t.fmap((e) => Array.isArray(e) ? e.slice(1).reduce((n, s) => n / s, e[0]) : e)
), dd = l("compress", function(t, e, n) {
  return t = m(t), e = m(e), t.gt(e) || t.gt(1) || e.gt(1) || t.lt(0) || e.lt(0) ? q : n._fastGap(m(1).div(e.sub(t)))._late(t);
}), { compressSpan: md, compressspan: yd } = l(["compressSpan", "compressspan"], function(t, e) {
  return e._compress(t.begin, t.end);
}), { fastGap: wd, fastgap: gd } = l(["fastGap", "fastgap"], function(t, e) {
  const n = function(r) {
    const o = r.begin.sam(), i = r.begin.sub(o).mul(t).min(1), a = r.end.sub(o).mul(t).min(1);
    if (!(i >= 1))
      return new B(o.add(i), o.add(a));
  }, s = function(r) {
    const o = r.part.begin, i = r.part.end, a = o.sam(), u = o.sub(a).div(t).min(1), p = i.sub(a).div(t).min(1), h = new B(a.add(u), a.add(p)), y = r.whole ? new B(
      h.begin.sub(o.sub(r.whole.begin).div(t)),
      h.end.add(r.whole.end.sub(i).div(t))
    ) : void 0;
    return new S(y, h, r.value, r.context);
  };
  return e.withQuerySpanMaybe(n).withHap(s).splitQueries();
}), bd = l("focus", function(t, e, n) {
  return t = m(t), e = m(e), n._early(t.sam())._fast(m(1).div(e.sub(t)))._late(t);
}), { focusSpan: _d, focusspan: vd } = l(["focusSpan", "focusspan"], function(t, e) {
  return e._focus(t.begin, t.end);
}), kd = l("ply", function(t, e) {
  const n = e.fmap((s) => C(s)._fast(t)).squeezeJoin();
  return J && (n._steps = m(t).mulmaybe(e._steps)), n;
}), { fast: qd, density: Sd } = l(
  ["fast", "density"],
  function(t, e) {
    return t === 0 ? q : (t = m(t), e.withQueryTime((s) => s.mul(t)).withHapTime((s) => s.div(t)).setSteps(e._steps));
  },
  !0,
  !0
), Ad = l("hurry", function(t, e) {
  return e._fast(t).mul(C({ speed: t }));
}), { slow: Td, sparsity: Cd } = l(["slow", "sparsity"], function(t, e) {
  return t === 0 ? q : e._fast(m(1).div(t));
}), xd = l("inside", function(t, e, n) {
  return e(n._slow(t))._fast(t);
}), Bd = l("outside", function(t, e, n) {
  return e(n._fast(t))._slow(t);
}), Od = l("lastOf", function(t, e, n) {
  const s = Array(t - 1).fill(n);
  return s.push(e(n)), fe(...s);
}), { firstOf: zd, every: Md } = l(["firstOf", "every"], function(t, e, n) {
  const s = Array(t - 1).fill(n);
  return s.unshift(e(n)), fe(...s);
}), Pd = l("apply", function(t, e) {
  return t(e);
}), Ed = l("cpm", function(t, e) {
  return e._fast(t / 60 / 1);
}), jd = l(
  "early",
  function(t, e) {
    return t = m(t), e.withQueryTime((n) => n.add(t)).withHapTime((n) => n.sub(t));
  },
  !0,
  !0
), Ln = l(
  "late",
  function(t, e) {
    return t = m(t), e._early(m(0).sub(t));
  },
  !0,
  !0
), Jd = l("zoom", function(t, e, n) {
  if (e = m(e), t = m(t), t.gte(e))
    return R;
  const s = e.sub(t), r = J ? n._steps?.mulmaybe(s) : void 0;
  return n.withQuerySpan((o) => o.withCycle((i) => i.mul(s).add(t))).withHapSpan((o) => o.withCycle((i) => i.sub(t).div(s))).splitQueries().setSteps(r);
}), { zoomArc: $d, zoomarc: Nd } = l(["zoomArc", "zoomarc"], function(t, e) {
  return e.zoom(t.begin, t.end);
}), Ld = l(
  "bite",
  (t, e, n) => e.fmap((s) => (r) => {
    const o = m(s).div(r).mod(1), i = o.add(m(1).div(r));
    return n.zoom(o, i);
  }).appLeft(t).squeezeJoin(),
  !1
), Rd = l(
  "linger",
  function(t, e) {
    return t == 0 ? q : t < 0 ? e._zoom(t.add(1), 1)._slow(t) : e._zoom(0, t)._slow(t);
  },
  !0,
  !0
), { segment: Wd, seg: Fd } = l(["segment", "seg"], function(t, e) {
  return e.struct(C(!0)._fast(t)).setSteps(t);
}), Id = l("swingBy", (t, e, n) => n.inside(e, Ln(Nn(0, t / 2)))), Vd = l("swing", (t, e) => e.swingBy(1 / 3, t)), { invert: Hd, inv: Dd } = l(
  ["invert", "inv"],
  function(t) {
    return t.fmap((e) => !e);
  },
  !0,
  !0
), Gd = l("when", function(t, e, n) {
  return t ? e(n) : n;
}), Qd = l("off", function(t, e, n) {
  return z(n, e(n.late(t)));
}), Ud = l("brak", function(t) {
  return t.when(Z(!1, !0), (e) => N(e, q)._late(0.25));
}), Rn = l(
  "rev",
  function(t) {
    const e = function(n) {
      const s = n.span, r = s.begin.sam(), o = s.begin.nextSam(), i = function(u) {
        const p = u.withTime((y) => r.add(o.sub(y))), h = p.begin;
        return p.begin = p.end, p.end = h, p;
      };
      return t.query(n.setSpan(i(s))).map((u) => u.withSpan(i));
    };
    return new f(e).splitQueries();
  },
  !1,
  !0
), Xd = l("revv", function(t) {
  const e = (n) => new B(m(0).sub(n.end), m(0).sub(n.begin));
  return t.withQuerySpan(e).withHapSpan(e);
}), Kd = l("pressBy", function(t, e) {
  return e.fmap((n) => C(n).compress(t, 1)).squeezeJoin();
}), Yd = l("press", function(t) {
  return t._pressBy(0.5);
});
f.prototype.hush = function() {
  return q;
};
const Zd = l(
  "palindrome",
  function(t) {
    return t.lastOf(2, Rn);
  },
  !0,
  !0
), { juxBy: tm, juxby: em } = l(["juxBy", "juxby"], function(t, e, n) {
  t /= 2;
  const s = function(i, a, u) {
    return a in i ? i[a] : u;
  }, r = n.withValue((i) => Object.assign({}, i, { pan: s(i, "pan", 0.5) - t })), o = e(n.withValue((i) => Object.assign({}, i, { pan: s(i, "pan", 0.5) + t })));
  return z(r, o).setSteps(J ? Y(r._steps, o._steps) : void 0);
}), nm = l("jux", function(t, e) {
  return e._juxBy(1, t, e);
}), { echoWith: sm, echowith: rm, stutWith: om, stutwith: cm } = l(
  ["echoWith", "echowith", "stutWith", "stutwith"],
  function(t, e, n, s) {
    return z(..._t(0, t - 1).map((r) => n(s.late(m(e).mul(r)), r)));
  }
), im = l("echo", function(t, e, n, s) {
  return s._echoWith(t, e, (r, o) => r.gain(Math.pow(n, o)));
}), um = l("stut", function(t, e, n, s) {
  return s._echoWith(t, n, (r, o) => r.gain(Math.pow(e, o)));
}), Wn = l("applyN", function(t, e, n) {
  let s = n;
  for (let r = 0; r < t; r++)
    s = e(s);
  return s;
}), am = l(["plyWith", "plywith"], function(t, e, n) {
  const s = n.fmap((r) => mt(..._t(0, t - 1).map((o) => Wn(o, e, r)))._fast(t)).squeezeJoin();
  return J && (s._steps = m(t).mulmaybe(n._steps)), s;
}), lm = l(["plyForEach", "plyforeach"], function(t, e, n) {
  const s = n.fmap((r) => mt(mt(C(r), ..._t(1, t - 1).map((o) => e(C(r), o))))._fast(t)).squeezeJoin();
  return J && (s._steps = m(t).mulmaybe(n._steps)), s;
}), jt = function(t, e, n = !1) {
  return t = m(t), Z(
    ..._t(0, t.sub(1)).map(
      (s) => n ? e.late(m(s).div(t)) : e.early(m(s).div(t))
    )
  );
}, pm = l(
  "iter",
  function(t, e) {
    return jt(t, e, !1);
  },
  !0,
  !0
), { iterBack: fm, iterback: hm } = l(
  ["iterBack", "iterback"],
  function(t, e) {
    return jt(t, e, !0);
  },
  !0,
  !0
), { repeatCycles: dm } = l(
  "repeatCycles",
  function(t, e) {
    return new f(function(n) {
      const s = n.span.begin.sam(), r = s.div(t).sam(), o = s.sub(r);
      return n = n.withSpan((i) => i.withTime((a) => a.sub(o))), e.query(n).map((i) => i.withSpan((a) => a.withTime((u) => u.add(o))));
    }).splitQueries();
  },
  !0,
  !0
), Jt = function(t, e, n, s = !1, r = !1) {
  const o = Array(t - 1).fill(!1);
  o.unshift(!0);
  const i = jt(t, Q(...o), !s);
  return r || (n = n.repeatCycles(t)), n.when(i, e);
}, { chunk: mm, slowchunk: ym, slowChunk: wm } = l(
  ["chunk", "slowchunk", "slowChunk"],
  function(t, e, n) {
    return Jt(t, e, n, !1, !1);
  },
  !0,
  !0
), { chunkBack: gm, chunkback: bm } = l(
  ["chunkBack", "chunkback"],
  function(t, e, n) {
    return Jt(t, e, n, !0);
  },
  !0,
  !0
), { fastchunk: _m, fastChunk: vm } = l(
  ["fastchunk", "fastChunk"],
  function(t, e, n) {
    return Jt(t, e, n, !1, !0);
  },
  !0,
  !0
), { chunkinto: km, chunkInto: qm } = l(["chunkinto", "chunkInto"], function(t, e, n) {
  return n.into(N(!0, ...Array(t - 1).fill(!1))._iterback(t), e);
}), { chunkbackinto: Sm, chunkBackInto: Am } = l(["chunkbackinto", "chunkBackInto"], function(t, e, n) {
  return n.into(
    N(!0, ...Array(t - 1).fill(!1))._iter(t)._early(1),
    e
  );
}), Tm = l(
  "bypass",
  function(t, e) {
    return t = !!parseInt(t), t ? q : e;
  },
  !0,
  !0
), { ribbon: Cm, rib: xm } = l(
  ["ribbon", "rib"],
  (t, e, n) => n.early(t).restart(C(1).slow(e))
), Bm = l("hsla", (t, e, n, s, r) => r.color(`hsla(${t}turn,${e * 100}%,${n * 100}%,${s})`)), Om = l("hsl", (t, e, n, s) => s.color(`hsl(${t}turn,${e * 100}%,${n * 100}%)`));
f.prototype.tag = function(t) {
  return this.withContext((e) => ({ ...e, tags: (e.tags || []).concat([t]) }));
};
const zm = l("filter", (t, e) => e.withHaps((n) => n.filter(t))), Mm = l("filterWhen", (t, e) => e.filter((n) => t(n.whole.begin))), Pm = l(
  "within",
  (t, e, n, s) => z(
    n(s.filterWhen((r) => r.cyclePos() >= t && r.cyclePos() <= e)),
    s.filterWhen((r) => r.cyclePos() < t || r.cyclePos() > e)
  )
);
f.prototype.stepJoin = function() {
  const t = this, e = $(...Yt(Zt(t.queryArc(0, 1))))._steps, n = function(s) {
    const o = t.early(s.span.begin.sam()).query(s.setSpan(new B(m(0), m(1))));
    return $(...Yt(Zt(o))).query(s);
  };
  return new f(n, e);
};
f.prototype.stepBind = function(t) {
  return this.fmap(t).stepJoin();
};
function Yt(t) {
  const e = t.filter((o, i) => i.hasSteps).reduce((o, i) => o.add(i), m(0)), n = lt(t.map((o, i) => i._steps)).reduce(
    (o, i) => o.add(i),
    m(0)
  ), s = e.eq(0) ? void 0 : n.div(e);
  function r(o, i) {
    return i._steps === void 0 ? [o.mulmaybe(s), i] : [i._steps, i];
  }
  return t.map((o) => r(...o));
}
function Zt(t) {
  const e = G(t.map((r) => [r.part.begin, r.part.end])), n = yn([m(0), m(1), ...e]);
  return un(n).map((r) => [
    r[1].sub(r[0]),
    z(...Fn(new B(...r), t).map((o) => o.value.withHap((i) => i.setContext(i.combineContext(o)))))
  ]);
}
function Fn(t, e) {
  return lt(e.map((n) => In(t, n)));
}
function In(t, e) {
  const n = t.intersection(e.part);
  if (n != null)
    return new S(e.whole, n, e.value, e.context);
}
const Vn = l("pace", function(t, e) {
  return e._steps === void 0 ? e : e._steps.eq(m(0)) ? R : e._fast(m(t).div(e._steps)).setSteps(t);
});
function Hn(t, ...e) {
  const n = e.map((r) => xt(r));
  if (n.length == 0)
    return q;
  t == 0 && (t = n[0][1]);
  const s = [];
  for (const r of n)
    r[1] != 0 && (t == r[1] ? s.push(r[0]) : s.push(r[0]._fast(m(t).div(m(r[1])))));
  return z(...s);
}
function $t(...t) {
  if (Array.isArray(t[0]))
    return Hn(0, ...t);
  if (t = t.filter((s) => s.hasSteps), t.length == 0)
    return q;
  const e = Y(...t.map((s) => s._steps));
  if (e.eq(m(0)))
    return R;
  const n = z(...t.map((s) => s.pace(e)));
  return n._steps = e, n;
}
function $(...t) {
  if (t.length === 0)
    return R;
  const e = (i) => Array.isArray(i) ? i : [i._steps ?? 1, i];
  if (t = t.map(e), t.find((i) => i[0] === void 0)) {
    const i = t.map((u) => u[0]).filter((u) => u !== void 0);
    if (i.length === 0)
      return N(...t.map((u) => u[1]));
    if (i.length === t.length)
      return R;
    const a = i.reduce((u, p) => u.add(p), m(0)).div(i.length);
    for (let u of t)
      u[0] === void 0 && (u[0] = a);
  }
  if (t.length == 1)
    return d(t[0][1]).withSteps((a) => t[0][0]);
  const n = t.map((i) => i[0]).reduce((i, a) => i.add(a), m(0));
  let s = m(0);
  const r = [];
  for (const [i, a] of t) {
    if (m(i).eq(0))
      continue;
    const u = s.add(i);
    r.push(d(a)._compress(s.div(n), u.div(n))), s = u;
  }
  const o = z(...r);
  return o._steps = n, o;
}
function Dn(...t) {
  t = t.map((r) => Array.isArray(r) ? r.map(d) : [d(r)]);
  const e = Y(...t.map((r) => m(r.length)));
  let n = [];
  for (let r = 0; r < e; ++r)
    n.push(...t.map((o) => o.length == 0 ? q : o[r % o.length]));
  n = n.filter((r) => r.hasSteps && r._steps > 0);
  const s = n.reduce((r, o) => r.add(o._steps), m(0));
  return n = $(...n), n._steps = s, n;
}
const Gn = et("take", function(t, e) {
  if (!e.hasSteps || e._steps.lte(0) || (t = m(t), t.eq(0)))
    return R;
  const n = t < 0;
  n && (t = t.abs());
  const s = t.div(e._steps);
  return s.lte(0) ? R : s.gte(1) ? e : n ? e.zoom(m(1).sub(s), 1) : e.zoom(0, s);
}), Qn = et("drop", function(t, e) {
  return e.hasSteps ? (t = m(t), t.lt(0) ? e.take(e._steps.add(t)) : e.take(m(0).sub(e._steps.sub(t)))) : R;
}), Un = et("extend", function(t, e) {
  return e.fast(t).expand(t);
}), Em = et("replicate", function(t, e) {
  return e.repeatCycles(t).fast(t).expand(t);
}), Xn = et("expand", function(t, e) {
  return e.withSteps((n) => n.mul(m(t)));
}), Kn = et("contract", function(t, e) {
  return e.withSteps((n) => n.div(m(t)));
});
f.prototype.shrinklist = function(t) {
  const e = this;
  if (!e.hasSteps)
    return [e];
  let [n, s] = Array.isArray(t) ? t : [t, e._steps];
  if (n = m(n), s === 0 || n === 0)
    return [e];
  const r = n > 0, o = [];
  if (r) {
    const i = m(1).div(e._steps).mul(n);
    for (let a = 0; a < s; ++a) {
      const u = i.mul(a);
      if (u.gt(1))
        break;
      o.push([u, 1]);
    }
  } else {
    n = m(0).sub(n);
    const i = m(1).div(e._steps).mul(n);
    for (let a = 0; a < s; ++a) {
      const u = m(1).sub(i.mul(a));
      if (u.lt(0))
        break;
      o.push([m(0), u]);
    }
  }
  return o.map((i) => e.zoom(...i));
};
const Yn = (t, e) => e.shrinklist(t), Zn = l(
  "shrink",
  function(t, e) {
    if (!e.hasSteps)
      return R;
    const n = e.shrinklist(t), s = $(...n);
    return s._steps = n.reduce((r, o) => r.add(o._steps), m(0)), s;
  },
  !0,
  !1,
  (t) => t.stepJoin()
), jm = l(
  "grow",
  function(t, e) {
    if (!e.hasSteps)
      return R;
    const n = e.shrinklist(m(0).sub(t));
    n.reverse();
    const s = $(...n);
    return s._steps = n.reduce((r, o) => r.add(o._steps), m(0)), s;
  },
  !0,
  !1,
  (t) => t.stepJoin()
), ts = function(t, ...e) {
  return t.tour(...e);
};
f.prototype.tour = function(...t) {
  return $(
    ...[].concat(
      ...t.map((e, n) => [...t.slice(0, t.length - n), this, ...t.slice(t.length - n)]),
      this,
      ...t
    )
  );
};
const es = function(...t) {
  t = t.filter((s) => s.hasSteps);
  const e = Z(...t.map((s) => s._slow(s._steps))), n = Y(...t.map((s) => s._steps));
  return e._fast(n).setSteps(n);
}, Jm = $, ns = $, $m = $, Nm = Dn, Lm = $t;
f.prototype.s_polymeter = f.prototype.polymeter;
const Rm = Zn;
f.prototype.s_taper = f.prototype.shrink;
const Wm = Yn;
f.prototype.s_taperlist = f.prototype.shrinklist;
const Fm = Gn;
f.prototype.s_add = f.prototype.take;
const Im = Qn;
f.prototype.s_sub = f.prototype.drop;
const Vm = Xn;
f.prototype.s_expand = f.prototype.expand;
const Hm = Un;
f.prototype.s_extend = f.prototype.extend;
const Dm = Kn;
f.prototype.s_contract = f.prototype.contract;
const Gm = ts;
f.prototype.s_tour = f.prototype.tour;
const Qm = es;
f.prototype.s_zip = f.prototype.zip;
const Um = Vn;
f.prototype.steps = f.prototype.pace;
const Xm = l("chop", function(t, e) {
  const s = Array.from({ length: t }, (i, a) => a).map((i) => ({ begin: i / t, end: (i + 1) / t })), r = function(i, a) {
    if ("begin" in i && "end" in i && i.begin !== void 0 && i.end !== void 0) {
      const u = i.end - i.begin;
      a = { begin: i.begin + a.begin * u, end: i.begin + a.end * u };
    }
    return Object.assign({}, i, a);
  }, o = function(i) {
    return Q(s.map((a) => r(i, a)));
  };
  return e.squeezeBind(o).setSteps(J ? m(t).mulmaybe(e._steps) : void 0);
}), Km = l("striate", function(t, e) {
  const s = Array.from({ length: t }, (o, i) => i).map((o) => ({ begin: o / t, end: (o + 1) / t })), r = Z(...s);
  return e.set(r)._fast(t).setSteps(J ? m(t).mulmaybe(e._steps) : void 0);
}), he = function(t, e, n = 0.5) {
  return e.speed(1 / t * n).unit("c").slow(t);
}, ss = l(
  "slice",
  function(t, e, n) {
    return t.innerBind(
      (s) => e.outerBind(
        (r) => n.outerBind((o) => {
          o = o instanceof Object ? o : { s: o };
          const i = Array.isArray(s) ? s[r] : r / s, a = Array.isArray(s) ? s[r + 1] : (r + 1) / s;
          return C({ begin: i, end: a, _slices: s, ...o });
        })
      )
    ).setSteps(e._steps);
  },
  !1
  // turns off auto-patternification
);
f.prototype.onTriggerTime = function(t) {
  return this.onTrigger((e, n, s, r) => {
    const o = r - n;
    window.setTimeout(() => {
      t(e);
    }, o * 1e3);
  }, !1);
};
const Ym = l(
  "splice",
  function(t, e, n) {
    const s = ss(t, e, n);
    return new f((r) => {
      const o = r.controls._cps || 1;
      return s.query(r).map(
        (a) => a.withValue((u) => ({
          speed: o / u._slices / a.whole.duration * (u.speed || 1),
          unit: "c",
          ...u
        }))
      );
    }).setSteps(e._steps);
  },
  !1
  // turns off auto-patternification
), { loopAt: Zm, loopat: ty } = l(["loopAt", "loopat"], function(t, e) {
  const n = e._steps ? e._steps.div(t) : void 0;
  return new f((s) => he(t, e, s.controls._cps).query(s), n);
}), ey = l(
  "fit",
  (t) => t.withHaps(
    (e, n) => e.map(
      (s) => s.withValue((r) => {
        const o = ("end" in r ? r.end : 1) - ("begin" in r ? r.begin : 0);
        return {
          ...r,
          speed: (n.controls._cps || 1) / s.whole.duration * o,
          unit: "c"
        };
      })
    )
  )
), { loopAtCps: ny, loopatcps: sy } = l(["loopAtCps", "loopatcps"], function(t, e, n) {
  return he(t, n, e);
}), ry = (t) => C(1).withValue(() => d(t())).innerJoin();
let te = (t) => t < 0.5 ? 1 : 1 - (t - 0.5) / 0.5, rs = (t, e, n) => {
  e = d(e), t = d(t), n = d(n);
  let s = e.fmap((o) => ({ gain: te(o) })), r = e.fmap((o) => ({ gain: te(1 - o) }));
  return z(t.mul(s), n.mul(r));
};
f.prototype.xfade = function(t, e) {
  return rs(this, t, e);
};
const os = (t) => (e, n, s) => {
  e = m(e).mod(n), n = m(n);
  const r = e.div(n), o = e.add(1).div(n);
  return t(s.fmap((i) => C(i)._compress(r, o)));
}, { beat: oy } = l(
  ["beat"],
  os((t) => t.innerJoin())
), de = (t, e, n) => {
  n = m(n);
  const s = m(1).div(t.length), r = (a) => {
    const u = [];
    for (const [p, h] of a.entries())
      h && u.push([m(p).div(a.length), h]);
    return u;
  }, o = Pt(
    ([a, u], [p, h]) => {
      const y = n.mul(p - a).add(a), g = y.add(s);
      return new B(y, g);
    },
    r(t),
    r(e)
  );
  function i(a) {
    const u = a.span.begin.sam(), p = a.span.cycleArc(), h = [];
    for (const y of o) {
      const g = y.intersection(p);
      g !== void 0 && h.push(
        new S(
          y.withTime((v) => v.add(u)),
          g.withTime((v) => v.add(u)),
          !0
        )
      );
    }
    return h;
  }
  return new f(i).splitQueries();
}, cy = (t, e, n) => (t = d(t), e = d(e), n = d(n), t.innerBind((s) => e.innerBind((r) => n.innerBind((o) => de(s, r, o))))), U = function(t) {
  const e = function(n, s) {
    const r = d(n).fmap((o) => Array.isArray(o) ? [...o, t] : [o, 1, t]);
    return s ? s.distort(r) : C({}).distort(r);
  };
  return f.prototype[t] = function(n) {
    return e(n, this);
  }, e;
}, iy = U("soft"), uy = U("hard"), ay = U("cubic"), ly = U("diode"), py = U("asym"), fy = U("fold"), hy = U("sinefold"), dy = U("chebyshev"), me = (t) => {
  let n = C(w((...s) => s, null, t.length));
  for (const s of t) n = n.appBoth(d(s));
  return n;
}, vt = (t) => Array.isArray(t) ? me(t) : d(t);
f.prototype.partials = function(t) {
  return this.withValue((e) => (n) => ({ ...e, partials: n })).appLeft(vt(t));
};
const my = (t) => vt(t).as("partials");
f.prototype.phases = function(t) {
  return this.withValue((e) => (n) => ({ ...e, phases: n })).appLeft(vt(t));
};
const yy = (t) => vt(t).as("phases");
f.prototype.FX = function(...t) {
  return t = t.map(d), this.withValue((e) => (n) => {
    const s = e.FX ?? [];
    return { ...e, FX: s.concat(n) };
  }).appLeft(me(t));
};
const cs = (t) => {
  let n = C(w((...s) => s, null, t.length));
  for (const s of t) n = n.appLeft(s);
  return n;
};
f.prototype.worklet = function(t, ...e) {
  return e = e.map(d), this.outerBind((n) => cs(e).withValue((s) => {
    const r = n.workletInputs ?? [];
    return { ...n, workletSrc: t, workletInputs: r.concat(s) };
  }));
};
const wy = (...t) => C({}).worklet(...t);
function Nt(t) {
  let e = Array.isArray(t);
  t = e ? t : [t];
  const n = t[0], s = (o) => {
    let i;
    if (typeof o == "object" && o.value !== void 0 && (i = { ...o }, o = o.value, delete i.value), e && Array.isArray(o)) {
      const a = i || {};
      return o.forEach((u, p) => {
        p < t.length && (a[t[p]] = u);
      }), a;
    } else return i ? (i[n] = o, i) : { [n]: o };
  }, r = function(o, i) {
    return i ? typeof o > "u" ? i.fmap(s) : i.set(d(o).withValue(s)) : d(o).withValue(s);
  };
  return f.prototype[n] = function(o) {
    return r(o, this);
  }, r;
}
const at = /* @__PURE__ */ new Map();
function is(t) {
  return at.has(t);
}
function c(t, ...e) {
  const n = Array.isArray(t) ? t[0] : t;
  let s = {};
  return s[n] = Nt(t), at.set(n, n), e.forEach((r) => {
    s[r] = s[n], at.set(r, n), f.prototype[r] = f.prototype[n];
  }), s;
}
function V(t, e, ...n) {
  t = Array.isArray(t) ? t : [t];
  let s = {};
  for (let r = 1; r <= e; r++) {
    let o = [...n], i = [...t];
    if (r === 1) {
      const u = o.map((h) => `${h}1`), p = i.map((h) => `${h}1`);
      o = o.concat(u).concat(p);
    } else
      o = o.map((u) => `${u}${r}`), i = i.map((u) => `${u}${r}`);
    const a = c(i, ...o);
    s = { ...s, ...a };
  }
  return s;
}
const { s: us, sound: as } = c(["s", "n", "gain"], "sound"), { wt: ls, wavetablePosition: ps } = c("wt", "wavetablePosition"), { wtenv: fs } = c("wtenv"), { wtattack: hs, wtatt: ds } = c("wtattack", "wtatt"), { wtdecay: ms, wtdec: ys } = c("wtdecay", "wtdec"), { wtsustain: ws, wtsus: gs } = c("wtsustain", "wtsus"), { wtrelease: bs, wtrel: _s } = c("wtrelease", "wtrel"), { wtrate: vs } = c("wtrate"), { wtsync: ks } = c("wtsync"), { wtdepth: qs } = c("wtdepth"), { wtshape: Ss } = c("wtshape"), { wtdc: As } = c("wtdc"), { wtskew: Ts } = c("wtskew"), { warp: Cs, wavetableWarp: xs } = c("warp", "wavetableWarp"), { warpattack: Bs, warpatt: Os } = c("warpattack", "warpatt"), { warpdecay: zs, warpdec: Ms } = c("warpdecay", "warpdec"), { warpsustain: Ps, warpsus: Es } = c("warpsustain", "warpsus"), { warprelease: js, warprel: Js } = c("warprelease", "warprel"), { warprate: $s } = c("warprate"), { warpdepth: Ns } = c("warpdepth"), { warpshape: Ls } = c("warpshape"), { warpdc: Rs } = c("warpdc"), { warpskew: Ws } = c("warpskew"), { warpmode: Fs, wavetableWarpMode: Is } = c("warpmode", "wavetableWarpMode"), { wtphaserand: Vs, wavetablePhaseRand: Hs } = c("wtphaserand", "wavetablePhaseRand"), { warpenv: Ds } = c("warpenv"), { warpsync: Gs } = c("warpsync"), { source: Qs, src: Us } = c("source", "src"), { n: Xs } = c("n"), { note: Ks } = c(["note", "n"]), { accelerate: Ys } = c("accelerate"), { velocity: Zs, vel: tr } = c("velocity", "vel"), { gain: er } = c("gain"), { postgain: nr } = c("postgain"), { amp: sr } = c("amp"), { attack: rr, att: or } = c("attack", "att"), { fmh: cr, fmh1: ir, fmh2: ur, fmh3: ar, fmh4: lr, fmh5: pr, fmh6: fr, fmh7: hr, fmh8: dr } = V(["fmh", "fmi"], 8, "fmh"), { fmi: mr, fmi1: yr, fmi2: wr, fmi3: gr, fmi4: br, fmi5: _r, fmi6: vr, fmi7: kr, fmi8: qr, fm: Sr, fm1: Ar, fm2: Tr, fm3: Cr, fm4: xr, fm5: Br, fm6: Or, fm7: zr, fm8: Mr } = V(["fmi", "fmh"], 8, "fm"), { fmenv: Pr, fmenv1: Er, fmenv2: jr, fmenv3: Jr, fmenv4: $r, fmenv5: Nr, fmenv6: Lr, fmenv7: Rr, fmenv8: Wr } = V(
  "fmenv",
  8
), {
  fmattack: Fr,
  fmattack1: Ir,
  fmattack2: Vr,
  fmattack3: Hr,
  fmattack4: Dr,
  fmattack5: Gr,
  fmattack6: Qr,
  fmattack7: Ur,
  fmattack8: Xr,
  fmatt: Kr,
  fmatt1: Yr,
  fmatt2: Zr,
  fmatt3: to,
  fmatt4: eo,
  fmatt5: no,
  fmatt6: so,
  fmatt7: ro,
  fmatt8: oo
} = V("fmattack", 8, "fmatt"), { fmwave: co, fmwave1: io, fmwave2: uo, fmwave3: ao, fmwave4: lo, fmwave5: po, fmwave6: fo, fmwave7: ho, fmwave8: mo } = V(
  "fmwave",
  8
), {
  fmdecay: yo,
  fmdecay1: wo,
  fmdecay2: go,
  fmdecay3: bo,
  fmdecay4: _o,
  fmdecay5: vo,
  fmdecay6: ko,
  fmdecay7: qo,
  fmdecay8: So,
  fmdec: Ao,
  fmdec1: To,
  fmdec2: Co,
  fmdec3: xo,
  fmdec4: Bo,
  fmdec5: Oo,
  fmdec6: zo,
  fmdec7: Mo,
  fmdec8: Po
} = V("fmdecay", 8, "fmdec"), {
  fmsustain: Eo,
  fmsustain1: jo,
  fmsustain2: Jo,
  fmsustain3: $o,
  fmsustain4: No,
  fmsustain5: Lo,
  fmsustain6: Ro,
  fmsustain7: Wo,
  fmsustain8: Fo,
  fmsus: Io,
  fmsus1: Vo,
  fmsus2: Ho,
  fmsus3: Do,
  fmsus4: Go,
  fmsus5: Qo,
  fmsus6: Uo,
  fmsus7: Xo,
  fmsus8: Ko
} = V("fmsustain", 8, "fmsus"), {
  fmrelease: Yo,
  fmrelease1: Zo,
  fmrelease2: tc,
  fmrelease3: ec,
  fmrelease4: nc,
  fmrelease5: sc,
  fmrelease6: rc,
  fmrelease7: oc,
  fmrelease8: cc,
  fmrel: ic,
  fmrel1: uc,
  fmrel2: ac,
  fmrel3: lc,
  fmrel4: pc,
  fmrel5: fc,
  fmrel6: hc,
  fmrel7: dc,
  fmrel8: mc
} = V("fmrelease", 8, "fmrel");
for (let t = 0; t <= 8; t++)
  for (let e = 0; e <= 8; e++)
    c(`fmi${t}${e}`, `fm${t}${e}`);
const { bank: yc } = c("bank"), { chorus: wc } = c("chorus"), { analyze: gc } = c("analyze"), { fft: bc } = c("fft"), { decay: _c, dec: vc } = c("decay", "dec"), { sustain: kc, sus: qc } = c("sustain", "sus"), { release: Sc, rel: Ac } = c("release", "rel"), { hold: Tc } = c("hold"), { bandf: Cc, bpf: xc, bp: Bc } = c(["bandf", "bandq", "bpenv"], "bpf", "bp"), { bandq: Oc, bpq: zc } = c("bandq", "bpq"), { begin: Mc } = c("begin"), { end: Pc } = c("end"), { loop: Ec } = c("loop"), { loopBegin: jc, loopb: Jc } = c("loopBegin", "loopb"), { loopEnd: $c, loope: Nc } = c("loopEnd", "loope"), { crush: Lc } = c("crush"), { coarse: Rc } = c("coarse"), { tremolo: Wc, trem: Fc } = c(["tremolo", "tremolodepth", "tremoloskew", "tremolophase"], "trem"), { tremolosync: Ic } = c(
  ["tremolosync", "tremolodepth", "tremoloskew", "tremolophase"],
  "tremsync"
), { tremolodepth: Vc } = c("tremolodepth", "tremdepth"), { tremoloskew: Hc } = c("tremoloskew", "tremskew"), { tremolophase: Dc } = c("tremolophase", "tremphase"), { tremoloshape: Gc } = c("tremoloshape", "tremshape"), { drive: Qc } = c("drive"), { duck: Uc } = c("duckorbit", "duck"), { duckdepth: Xc } = c("duckdepth"), { duckonset: Kc } = c("duckonset", "duckons"), { duckattack: Yc } = c("duckattack", "duckatt"), { byteBeatExpression: Zc, bbexpr: ti } = c("byteBeatExpression", "bbexpr"), { byteBeatStartTime: ei, bbst: ni } = c("byteBeatStartTime", "bbst"), { channels: si, ch: ri } = c("channels", "ch"), { pw: oi } = c(["pw", "pwrate", "pwsweep"]), { pwrate: ci } = c("pwrate"), { pwsweep: ii } = c("pwsweep"), { phaserrate: ui, ph: ai, phaser: li } = c(
  ["phaserrate", "phaserdepth", "phasercenter", "phasersweep"],
  "ph",
  "phaser"
), { phasersweep: pi, phs: fi } = c("phasersweep", "phs"), { phasercenter: hi, phc: di } = c("phasercenter", "phc"), { phaserdepth: mi, phd: yi, phasdp: wi } = c("phaserdepth", "phd", "phasdp"), { channel: gi } = c("channel"), { cut: bi } = c("cut"), { cutoff: _i, ctf: vi, lpf: ki, lp: qi } = c(["cutoff", "resonance", "lpenv"], "ctf", "lpf", "lp"), { lpenv: Si, lpe: Ai } = c("lpenv", "lpe"), { hpenv: Ti, hpe: Ci } = c("hpenv", "hpe"), { bpenv: xi, bpe: Bi } = c("bpenv", "bpe"), { lpattack: Oi, lpa: zi } = c("lpattack", "lpa"), { hpattack: Mi, hpa: Pi } = c("hpattack", "hpa"), { bpattack: Ei, bpa: ji } = c("bpattack", "bpa"), { lpdecay: Ji, lpd: $i } = c("lpdecay", "lpd"), { hpdecay: Ni, hpd: Li } = c("hpdecay", "hpd"), { bpdecay: Ri, bpd: Wi } = c("bpdecay", "bpd"), { lpsustain: Fi, lps: Ii } = c("lpsustain", "lps"), { hpsustain: Vi, hps: Hi } = c("hpsustain", "hps"), { bpsustain: Di, bps: Gi } = c("bpsustain", "bps"), { lprelease: Qi, lpr: Ui } = c("lprelease", "lpr"), { hprelease: Xi, hpr: Ki } = c("hprelease", "hpr"), { bprelease: Yi, bpr: Zi } = c("bprelease", "bpr"), { ftype: tu } = c("ftype"), { fanchor: eu } = c("fanchor"), { lprate: nu } = c("lprate"), { lpsync: su } = c("lpsync"), { lpdepth: ru } = c("lpdepth"), { lpdepthfrequency: ou, lpdepthfreq: cu } = c("lpdepthfrequency", "lpdepthfreq"), { lpshape: iu } = c("lpshape"), { lpdc: uu } = c("lpdc"), { lpskew: au } = c("lpskew"), { bprate: lu } = c("bprate"), { bpsync: pu } = c("bpsync"), { bpdepth: fu } = c("bpdepth"), { bpdepthfrequency: hu, bpdepthfreq: du } = c("bpdepthfrequency", "bpdepthfreq"), { bpshape: mu } = c("bpshape"), { bpdc: yu } = c("bpdc"), { bpskew: wu } = c("bpskew"), { hprate: gu } = c("hprate"), { hpsync: bu } = c("hpsync"), { hpdepth: _u } = c("hpdepth"), { hpdepthfrequency: vu, hpdepthfreq: ku } = c("hpdepthfrequency", "hpdepthfreq"), { hpshape: qu } = c("hpshape"), { hpdc: Su } = c("hpdc"), { hpskew: Au } = c("hpskew"), { vib: Tu, vibrato: Cu, v: xu } = c(["vib", "vibmod"], "vibrato", "v"), { noise: Bu } = c("noise"), { vibmod: Ou, vmod: zu } = c(["vibmod", "vib"], "vmod"), { hcutoff: Mu, hpf: Pu, hp: Eu } = c(["hcutoff", "hresonance", "hpenv"], "hpf", "hp"), { hresonance: ju, hpq: Ju } = c("hresonance", "hpq"), { resonance: $u, lpq: Nu } = c("resonance", "lpq"), { djf: Lu } = c("djf"), { delay: Ru } = c(["delay", "delaytime", "delayfeedback"]), { delayfeedback: Wu, delayfb: Fu, dfb: Iu } = c("delayfeedback", "delayfb", "dfb"), { delayspeed: Vu } = c("delayspeed"), { delaytime: Hu, delayt: Du, dt: Gu } = c("delaytime", "delayt", "dt"), { delaysync: Qu } = c("delaysync"), { lock: Uu } = c("lock"), { detune: Xu, det: Ku } = c("detune", "det"), { unison: Yu } = c("unison"), { spread: Zu } = c("spread"), { dry: ta } = c("dry"), { fadeTime: ea, fadeOutTime: na } = c("fadeTime", "fadeOutTime"), { fadeInTime: sa } = c("fadeInTime"), { freq: ra } = c("freq"), { pattack: oa, patt: ca } = c("pattack", "patt"), { pdecay: ia, pdec: ua } = c("pdecay", "pdec"), { psustain: aa, psus: la } = c("psustain", "psus"), { prelease: pa, prel: fa } = c("prelease", "prel"), { penv: ha } = c("penv"), { pcurve: da } = c("pcurve"), { panchor: ma } = c("panchor"), { gate: ya, gat: wa } = c("gate", "gat"), { leslie: ga } = c("leslie"), { lrate: ba } = c("lrate"), { lsize: _a } = c("lsize"), { activeLabel: va } = c("activeLabel"), { label: ka } = c(["label", "activeLabel"]), { degree: qa } = c("degree"), { mtranspose: Sa } = c("mtranspose"), { ctranspose: Aa } = c("ctranspose"), { harmonic: Ta } = c("harmonic"), { stepsPerOctave: Ca } = c("stepsPerOctave"), { octaveR: xa } = c("octaveR"), { nudge: Ba } = c("nudge"), { octave: Oa, oct: za } = c("octave", "oct"), { orbit: Ma } = c("orbit", "o"), { bus: Pa } = c("bus"), { busgain: Ea, bgain: ja } = c("busgain", "bgain"), { overgain: Ja } = c("overgain"), { overshape: $a } = c("overshape"), { pan: Na } = c("pan"), { panspan: La } = c("panspan"), { pansplay: Ra } = c("pansplay"), { panwidth: Wa } = c("panwidth"), { panorient: Fa } = c("panorient"), { slide: Ia } = c("slide"), { semitone: Va } = c("semitone"), { voice: Ha } = c("voice"), { chord: Da } = c("chord"), { dictionary: Ga, dict: Qa } = c("dictionary", "dict"), { anchor: Ua } = c("anchor"), { offset: Xa } = c("offset"), { octaves: Ka } = c("octaves"), { mode: Ya } = c(["mode", "anchor"]), { room: Za } = c(["room", "size"]), { roomlp: tl, rlp: el } = c("roomlp", "rlp"), { roomdim: nl, rdim: sl } = c("roomdim", "rdim"), { roomfade: rl, rfade: ol } = c("roomfade", "rfade"), { ir: cl, iresponse: il } = c(["ir", "i"], "iresponse"), { irspeed: ul } = c("irspeed"), { irbegin: al } = c("irbegin"), { roomsize: ll, size: pl, sz: fl, rsize: hl } = c("roomsize", "size", "sz", "rsize"), { shape: dl } = c(["shape", "shapevol"]), { distort: ml, dist: yl } = c(["distort", "distortvol", "distorttype"], "dist"), { distortvol: wl } = c("distortvol", "distvol"), { distorttype: gl } = c("distorttype", "disttype"), { compressor: bl } = c([
  "compressor",
  "compressorRatio",
  "compressorKnee",
  "compressorAttack",
  "compressorRelease"
]), { compressorKnee: _l } = c("compressorKnee"), { compressorRatio: vl } = c("compressorRatio"), { compressorAttack: kl } = c("compressorAttack"), { compressorRelease: ql } = c("compressorRelease"), { speed: ye } = c("speed"), { stretch: Sl } = c("stretch"), { unit: Al } = c("unit"), { squiz: Tl } = c("squiz"), { vowel: Cl } = c("vowel"), { waveloss: xl } = c("waveloss"), { density: Bl } = c("density"), { expression: Ol } = c("expression"), { sustainpedal: zl } = c("sustainpedal"), { fshift: Ml } = c("fshift"), { fshiftnote: Pl } = c("fshiftnote"), { fshiftphase: El } = c("fshiftphase"), { triode: jl } = c("triode"), { krush: Jl } = c("krush"), { kcutoff: $l } = c("kcutoff"), { octer: Nl } = c("octer"), { octersub: Ll } = c("octersub"), { octersubsub: Rl } = c("octersubsub"), { ring: Wl } = c("ring"), { ringf: Fl } = c("ringf"), { ringdf: Il } = c("ringdf"), { freeze: Vl } = c("freeze"), { xsdelay: Hl } = c("xsdelay"), { tsdelay: Dl } = c("tsdelay"), { real: Gl } = c("real"), { imag: Ql } = c("imag"), { enhance: Ul } = c("enhance"), { comb: Xl } = c("comb"), { smear: Kl } = c("smear"), { scram: Yl } = c("scram"), { binshift: Zl } = c("binshift"), { hbrick: tp } = c("hbrick"), { lbrick: ep } = c("lbrick"), { frameRate: np } = c("frameRate"), { frames: sp } = c("frames"), { hours: rp } = c("hours"), { minutes: op } = c("minutes"), { seconds: cp } = c("seconds"), { songPtr: ip } = c("songPtr"), { uid: up } = c("uid"), { val: ap } = c("val"), { cps: lp } = c("cps"), { clip: pp, legato: fp } = c("clip", "legato"), { duration: hp, dur: dp } = c("duration", "dur"), { zrand: mp } = c("zrand"), { curve: yp } = c("curve"), { deltaSlide: wp } = c("deltaSlide"), { pitchJump: gp } = c("pitchJump"), { pitchJumpTime: bp } = c("pitchJumpTime"), { znoise: _p } = c("znoise"), { zmod: vp } = c("zmod"), { zcrush: kp } = c("zcrush"), { zdelay: qp } = c("zdelay"), { zzfx: Sp } = c("zzfx"), { color: Ap, colour: Tp } = c(["color", "colour"]);
let Cp = (...t) => t.reduce((e, n) => Object.assign(e, { [n]: Nt(n) }), {});
const xp = l("adsr", (t, e) => {
  t = Array.isArray(t) ? t : [t];
  const [n, s, r, o] = t;
  return e.set({ attack: n, decay: s, sustain: r, release: o });
}), Bp = l("ad", (t, e) => {
  t = Array.isArray(t) ? t : [t];
  const [n, s = n] = t;
  return e.attack(n).decay(s);
}), Op = l("ds", (t, e) => {
  t = Array.isArray(t) ? t : [t];
  const [n, s = 0] = t;
  return e.set({ decay: n, sustain: s });
}), zp = l("ar", (t, e) => {
  t = Array.isArray(t) ? t : [t];
  const [n, s = n] = t;
  return e.set({ attack: n, release: s });
}), { midichan: Mp } = c("midichan"), { midimap: Pp } = c("midimap"), { midiport: Ep } = c("midiport"), { midicmd: jp } = c("midicmd"), Jp = l("control", (t, e) => {
  if (!Array.isArray(t))
    throw new Error("control expects an array of [ccn, ccv]");
  const [n, s] = t;
  return e.ccn(n).ccv(s);
}), { ccn: $p } = c("ccn"), { ccv: Np } = c("ccv"), { ctlNum: Lp } = c("ctlNum"), { nrpnn: Rp } = c("nrpnn"), { nrpv: Wp } = c("nrpv"), { progNum: Fp } = c("progNum"), Ip = l("sysex", (t, e) => {
  if (!Array.isArray(t))
    throw new Error("sysex expects an array of [id, data]");
  const [n, s] = t;
  return e.sysexid(n).sysexdata(s);
}), { sysexid: Vp } = c("sysexid"), { sysexdata: Hp } = c("sysexdata"), { midibend: Dp } = c("midibend"), { miditouch: Gp } = c("miditouch"), { polyTouch: Qp } = c("polyTouch"), { oschost: Up } = c("oschost"), { oscport: Xp } = c("oscport"), yt = (t) => at.has(t) ? at.get(t) : t, Kp = l("as", (t, e) => (t = Array.isArray(t) ? t : [t], e.fmap((n) => {
  n = Array.isArray(n) ? n : [n];
  const s = [];
  for (let r = 0; r < t.length; ++r)
    n[r] !== void 0 && s.push([yt(t[r]), n[r]]);
  return Object.fromEntries(s);
}))), Yp = l(
  "scrub",
  (t, e) => t.outerBind((n) => {
    Array.isArray(n) || (n = [n]);
    const [s, r = 1] = n;
    return e.begin(s).mul(ye(r)).clip(1);
  }),
  !1
), Bt = /* @__PURE__ */ new Map(), Zp = (t, e, ...n) => {
  const s = Bt.get(t) ?? /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set([e, ...n]);
  for (const o of r)
    s.set(String(o).toLowerCase(), e);
  Bt.set(t, s);
}, Lt = (t, e = []) => {
  for (const [n, ...s] of e)
    Zp(t, n, ...s);
}, tf = (t, e) => {
  const n = Bt.get(t);
  return n ? n.get(String(e).toLowerCase()) ?? e : e;
};
Lt("lfo", [
  ["control", "c"],
  ["subControl", "sc"],
  ["rate", "r"],
  ["depth", "dep", "dr"],
  ["depthabs", "da"],
  ["dcoffset", "dc"],
  ["shape", "sh"],
  ["skew", "sk"],
  ["curve", "cu"],
  ["sync", "s"],
  ["fxi"]
]);
Lt("env", [
  ["control", "c"],
  ["subControl", "sc"],
  ["attack", "att", "a"],
  ["decay", "dec", "d"],
  ["sustain", "sus", "s"],
  ["release", "rel", "r"],
  ["depth", "dep", "dr"],
  ["depthabs", "da"],
  ["acurve", "ac"],
  ["dcurve", "dc"],
  ["rcurve", "rc"],
  ["fxi"]
]);
Lt("bmod", [
  ["bus", "b"],
  ["control", "c"],
  ["subControl", "sc"],
  ["depth", "dep", "dr"],
  ["depthabs", "da"],
  ["dc"],
  ["fxi"]
]);
f.prototype.modulate = function(t, e, n) {
  e = { control: void 0, ...e };
  const s = ["lfo", "env", "bmod"];
  if (!s.includes(t))
    return E(`[core] Modulation type ${t} not found. Please use one of 'lfo', 'env', 'bmod'`), this;
  let r = this, o;
  r = r.fmap((i) => (a) => ({ v: i, id: a })).appLeft(d(n));
  for (const [i, a] of Object.entries(e)) {
    const u = tf(t, i), p = d(a);
    r = r.fmap(({ v: h, id: y }) => (g) => {
      if (o === void 0) {
        let _ = yt(Object.keys(h).at(-1));
        s.includes(_) && (_ = `${_}_${[...h[_].__ids].at(-1)}`), o = _;
      }
      h[t] ??= { __ids: /* @__PURE__ */ new Set() };
      const v = h[t];
      return y ??= v.__ids.size, v[y] ??= { control: o }, v.__ids.add(y), g === void 0 ? { v: h, id: y } : (u === "control" || u === "subControl" ? v[y][u] = yt(g) : v[y][u] = g, { v: h, id: y });
    }).appLeft(p);
  }
  return r.fmap(({ v: i }) => i);
};
f.prototype.lfo = function(t, e) {
  return this.modulate("lfo", t, e);
};
const ef = (t) => C({}).lfo(t);
f.prototype.env = function(t, e) {
  return this.modulate("env", t, e);
};
const nf = (t) => C({}).env(t);
f.prototype.bmod = function(t, e) {
  return this.modulate("bmod", t, e);
};
const sf = (t) => C({}).bmod(t), { transient: rf } = c(["transient", "transsustain"]), { FXrelease: of, FXrel: cf, FXr: uf, fxr: af } = c("FXrelease", "FXrel", "FXr", "fxr"), gy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  FXr: uf,
  FXrel: cf,
  FXrelease: of,
  accelerate: Ys,
  activeLabel: va,
  ad: Bp,
  adsr: xp,
  amp: sr,
  analyze: gc,
  anchor: Ua,
  ar: zp,
  as: Kp,
  att: or,
  attack: rr,
  bandf: Cc,
  bandq: Oc,
  bank: yc,
  bbexpr: ti,
  bbst: ni,
  begin: Mc,
  bgain: ja,
  binshift: Zl,
  bmod: sf,
  bp: Bc,
  bpa: ji,
  bpattack: Ei,
  bpd: Wi,
  bpdc: yu,
  bpdecay: Ri,
  bpdepth: fu,
  bpdepthfreq: du,
  bpdepthfrequency: hu,
  bpe: Bi,
  bpenv: xi,
  bpf: xc,
  bpq: zc,
  bpr: Zi,
  bprate: lu,
  bprelease: Yi,
  bps: Gi,
  bpshape: mu,
  bpskew: wu,
  bpsustain: Di,
  bpsync: pu,
  bus: Pa,
  busgain: Ea,
  byteBeatExpression: Zc,
  byteBeatStartTime: ei,
  ccn: $p,
  ccv: Np,
  ch: ri,
  channel: gi,
  channels: si,
  chord: Da,
  chorus: wc,
  clip: pp,
  coarse: Rc,
  color: Ap,
  colour: Tp,
  comb: Xl,
  compressor: bl,
  compressorAttack: kl,
  compressorKnee: _l,
  compressorRatio: vl,
  compressorRelease: ql,
  control: Jp,
  cps: lp,
  createParam: Nt,
  createParams: Cp,
  crush: Lc,
  ctf: vi,
  ctlNum: Lp,
  ctranspose: Aa,
  curve: yp,
  cut: bi,
  cutoff: _i,
  dec: vc,
  decay: _c,
  degree: qa,
  delay: Ru,
  delayfb: Fu,
  delayfeedback: Wu,
  delayspeed: Vu,
  delaysync: Qu,
  delayt: Du,
  delaytime: Hu,
  deltaSlide: wp,
  density: Bl,
  det: Ku,
  detune: Xu,
  dfb: Iu,
  dict: Qa,
  dictionary: Ga,
  dist: yl,
  distort: ml,
  distorttype: gl,
  distortvol: wl,
  djf: Lu,
  drive: Qc,
  dry: ta,
  ds: Op,
  dt: Gu,
  duck: Uc,
  duckattack: Yc,
  duckdepth: Xc,
  duckonset: Kc,
  dur: dp,
  duration: hp,
  end: Pc,
  enhance: Ul,
  env: nf,
  expression: Ol,
  fadeInTime: sa,
  fadeOutTime: na,
  fadeTime: ea,
  fanchor: eu,
  fft: bc,
  fm: Sr,
  fm1: Ar,
  fm2: Tr,
  fm3: Cr,
  fm4: xr,
  fm5: Br,
  fm6: Or,
  fm7: zr,
  fm8: Mr,
  fmatt: Kr,
  fmatt1: Yr,
  fmatt2: Zr,
  fmatt3: to,
  fmatt4: eo,
  fmatt5: no,
  fmatt6: so,
  fmatt7: ro,
  fmatt8: oo,
  fmattack: Fr,
  fmattack1: Ir,
  fmattack2: Vr,
  fmattack3: Hr,
  fmattack4: Dr,
  fmattack5: Gr,
  fmattack6: Qr,
  fmattack7: Ur,
  fmattack8: Xr,
  fmdec: Ao,
  fmdec1: To,
  fmdec2: Co,
  fmdec3: xo,
  fmdec4: Bo,
  fmdec5: Oo,
  fmdec6: zo,
  fmdec7: Mo,
  fmdec8: Po,
  fmdecay: yo,
  fmdecay1: wo,
  fmdecay2: go,
  fmdecay3: bo,
  fmdecay4: _o,
  fmdecay5: vo,
  fmdecay6: ko,
  fmdecay7: qo,
  fmdecay8: So,
  fmenv: Pr,
  fmenv1: Er,
  fmenv2: jr,
  fmenv3: Jr,
  fmenv4: $r,
  fmenv5: Nr,
  fmenv6: Lr,
  fmenv7: Rr,
  fmenv8: Wr,
  fmh: cr,
  fmh1: ir,
  fmh2: ur,
  fmh3: ar,
  fmh4: lr,
  fmh5: pr,
  fmh6: fr,
  fmh7: hr,
  fmh8: dr,
  fmi: mr,
  fmi1: yr,
  fmi2: wr,
  fmi3: gr,
  fmi4: br,
  fmi5: _r,
  fmi6: vr,
  fmi7: kr,
  fmi8: qr,
  fmrel: ic,
  fmrel1: uc,
  fmrel2: ac,
  fmrel3: lc,
  fmrel4: pc,
  fmrel5: fc,
  fmrel6: hc,
  fmrel7: dc,
  fmrel8: mc,
  fmrelease: Yo,
  fmrelease1: Zo,
  fmrelease2: tc,
  fmrelease3: ec,
  fmrelease4: nc,
  fmrelease5: sc,
  fmrelease6: rc,
  fmrelease7: oc,
  fmrelease8: cc,
  fmsus: Io,
  fmsus1: Vo,
  fmsus2: Ho,
  fmsus3: Do,
  fmsus4: Go,
  fmsus5: Qo,
  fmsus6: Uo,
  fmsus7: Xo,
  fmsus8: Ko,
  fmsustain: Eo,
  fmsustain1: jo,
  fmsustain2: Jo,
  fmsustain3: $o,
  fmsustain4: No,
  fmsustain5: Lo,
  fmsustain6: Ro,
  fmsustain7: Wo,
  fmsustain8: Fo,
  fmwave: co,
  fmwave1: io,
  fmwave2: uo,
  fmwave3: ao,
  fmwave4: lo,
  fmwave5: po,
  fmwave6: fo,
  fmwave7: ho,
  fmwave8: mo,
  frameRate: np,
  frames: sp,
  freeze: Vl,
  freq: ra,
  fshift: Ml,
  fshiftnote: Pl,
  fshiftphase: El,
  ftype: tu,
  fxr: af,
  gain: er,
  gat: wa,
  gate: ya,
  getControlName: yt,
  harmonic: Ta,
  hbrick: tp,
  hcutoff: Mu,
  hold: Tc,
  hours: rp,
  hp: Eu,
  hpa: Pi,
  hpattack: Mi,
  hpd: Li,
  hpdc: Su,
  hpdecay: Ni,
  hpdepth: _u,
  hpdepthfreq: ku,
  hpdepthfrequency: vu,
  hpe: Ci,
  hpenv: Ti,
  hpf: Pu,
  hpq: Ju,
  hpr: Ki,
  hprate: gu,
  hprelease: Xi,
  hps: Hi,
  hpshape: qu,
  hpskew: Au,
  hpsustain: Vi,
  hpsync: bu,
  hresonance: ju,
  imag: Ql,
  ir: cl,
  irbegin: al,
  iresponse: il,
  irspeed: ul,
  isControlName: is,
  kcutoff: $l,
  krush: Jl,
  label: ka,
  lbrick: ep,
  legato: fp,
  leslie: ga,
  lfo: ef,
  lock: Uu,
  loop: Ec,
  loopBegin: jc,
  loopEnd: $c,
  loopb: Jc,
  loope: Nc,
  lp: qi,
  lpa: zi,
  lpattack: Oi,
  lpd: $i,
  lpdc: uu,
  lpdecay: Ji,
  lpdepth: ru,
  lpdepthfreq: cu,
  lpdepthfrequency: ou,
  lpe: Ai,
  lpenv: Si,
  lpf: ki,
  lpq: Nu,
  lpr: Ui,
  lprate: nu,
  lprelease: Qi,
  lps: Ii,
  lpshape: iu,
  lpskew: au,
  lpsustain: Fi,
  lpsync: su,
  lrate: ba,
  lsize: _a,
  midibend: Dp,
  midichan: Mp,
  midicmd: jp,
  midimap: Pp,
  midiport: Ep,
  miditouch: Gp,
  minutes: op,
  mode: Ya,
  mtranspose: Sa,
  n: Xs,
  noise: Bu,
  note: Ks,
  nrpnn: Rp,
  nrpv: Wp,
  nudge: Ba,
  oct: za,
  octave: Oa,
  octaveR: xa,
  octaves: Ka,
  octer: Nl,
  octersub: Ll,
  octersubsub: Rl,
  offset: Xa,
  orbit: Ma,
  oschost: Up,
  oscport: Xp,
  overgain: Ja,
  overshape: $a,
  pan: Na,
  panchor: ma,
  panorient: Fa,
  panspan: La,
  pansplay: Ra,
  panwidth: Wa,
  patt: ca,
  pattack: oa,
  pcurve: da,
  pdec: ua,
  pdecay: ia,
  penv: ha,
  ph: ai,
  phasdp: wi,
  phaser: li,
  phasercenter: hi,
  phaserdepth: mi,
  phaserrate: ui,
  phasersweep: pi,
  phc: di,
  phd: yi,
  phs: fi,
  pitchJump: gp,
  pitchJumpTime: bp,
  polyTouch: Qp,
  postgain: nr,
  prel: fa,
  prelease: pa,
  progNum: Fp,
  psus: la,
  psustain: aa,
  pw: oi,
  pwrate: ci,
  pwsweep: ii,
  rdim: sl,
  real: Gl,
  registerControl: c,
  registerMultiControl: V,
  rel: Ac,
  release: Sc,
  resonance: $u,
  rfade: ol,
  ring: Wl,
  ringdf: Il,
  ringf: Fl,
  rlp: el,
  room: Za,
  roomdim: nl,
  roomfade: rl,
  roomlp: tl,
  roomsize: ll,
  rsize: hl,
  s: us,
  scram: Yl,
  scrub: Yp,
  seconds: cp,
  semitone: Va,
  shape: dl,
  size: pl,
  slide: Ia,
  smear: Kl,
  songPtr: ip,
  sound: as,
  source: Qs,
  speed: ye,
  spread: Zu,
  squiz: Tl,
  src: Us,
  stepsPerOctave: Ca,
  stretch: Sl,
  sus: qc,
  sustain: kc,
  sustainpedal: zl,
  sysex: Ip,
  sysexdata: Hp,
  sysexid: Vp,
  sz: fl,
  transient: rf,
  trem: Fc,
  tremolo: Wc,
  tremolodepth: Vc,
  tremolophase: Dc,
  tremoloshape: Gc,
  tremoloskew: Hc,
  tremolosync: Ic,
  triode: jl,
  tsdelay: Dl,
  uid: up,
  unison: Yu,
  unit: Al,
  v: xu,
  val: ap,
  vel: tr,
  velocity: Zs,
  vib: Tu,
  vibmod: Ou,
  vibrato: Cu,
  vmod: zu,
  voice: Ha,
  vowel: Cl,
  warp: Cs,
  warpatt: Os,
  warpattack: Bs,
  warpdc: Rs,
  warpdec: Ms,
  warpdecay: zs,
  warpdepth: Ns,
  warpenv: Ds,
  warpmode: Fs,
  warprate: $s,
  warprel: Js,
  warprelease: js,
  warpshape: Ls,
  warpskew: Ws,
  warpsus: Es,
  warpsustain: Ps,
  warpsync: Gs,
  waveloss: xl,
  wavetablePhaseRand: Hs,
  wavetablePosition: ps,
  wavetableWarp: xs,
  wavetableWarpMode: Is,
  wt: ls,
  wtatt: ds,
  wtattack: hs,
  wtdc: As,
  wtdec: ys,
  wtdecay: ms,
  wtdepth: qs,
  wtenv: fs,
  wtphaserand: Vs,
  wtrate: vs,
  wtrel: _s,
  wtrelease: bs,
  wtshape: Ss,
  wtskew: Ts,
  wtsus: gs,
  wtsustain: ws,
  wtsync: ks,
  xsdelay: Hl,
  zcrush: kp,
  zdelay: qp,
  zmod: vp,
  znoise: _p,
  zrand: mp,
  zzfx: Sp
}, Symbol.toStringTag, { value: "Module" })), lf = function(t, e) {
  const [n, s] = t, [r, o] = e, [i, a] = ue(s, r);
  return [
    [s, n - s],
    [Pt((u, p) => u.concat(p), i, o), a]
  ];
}, pf = function(t, e) {
  const [n, s] = t, [r, o] = e, [i, a] = ue(n, o);
  return [
    [n, s - n],
    [Pt((p, h) => p.concat(h), r, i), a]
  ];
}, we = function(t, e) {
  const [n, s] = t;
  return Math.min(n, s) <= 1 ? [t, e] : we(...n > s ? lf(t, e) : pf(t, e));
}, ge = function(t, e) {
  const n = t < 0, s = Math.abs(t), r = e - s, o = Array(s).fill([1]), i = Array(r).fill([0]), a = we([s, r], [o, i]), u = G(a[1][0]).concat(G(a[1][1]));
  return n ? u.map((p) => 1 - p) : u;
}, kt = function(t, e, n) {
  const s = ge(t, e);
  return n ? rn(s, -n) : s;
}, by = l("euclid", function(t, e, n) {
  return n.struct(kt(t, e, 0));
}), _y = l("bjork", function(t, e) {
  Array.isArray(t) || (t = [t]);
  const [n, s = n, r = 0] = t;
  return e.struct(kt(n, s, r));
}), { euclidrot: vy, euclidRot: ky } = l(["euclidrot", "euclidRot"], function(t, e, n, s) {
  return s.struct(kt(t, e, n));
}), be = function(t, e, n, s) {
  if (t < 1)
    return q;
  const o = kt(t, e, 0).join("").split("1").slice(1).map((i) => [i.length + 1, !0]);
  return s.struct(ns(...o)).late(m(n).div(e));
}, qy = l(["euclidLegato"], function(t, e, n) {
  return be(t, e, 0, n);
}), Sy = l(["euclidLegatoRot"], function(t, e, n, s) {
  return be(t, e, n, s);
}), { euclidish: Ay, eish: Ty } = l(["euclidish", "eish"], function(t, e, n, s) {
  const r = de(ge(t, e), new Array(t).fill(1), n);
  return s.struct(r).setSteps(e);
});
function ff(t, e, n = 0.05, s = 0.1, r = 0.1, o = globalThis.setInterval, i = globalThis.clearInterval, a = !0) {
  let u = 0, p = 0, h = 10 ** 4, y = 0.01;
  const g = (x) => n = x(n);
  r = r || s / 2;
  const v = () => {
    const x = t(), D = x + s + r;
    for (p === 0 && (p = x + y); p < D; )
      p = a ? Math.round(p * h) / h : p, e(p, n, u, x), p += n, u++;
  };
  let _;
  const O = () => {
    A(), v(), _ = o(v, s * 1e3);
  }, A = () => {
    _ !== void 0 && i(_), _ = void 0;
  };
  return { setDuration: g, start: O, stop: () => {
    u = 0, p = 0, A();
  }, pause: () => A(), duration: n, interval: s, getPhase: () => p, minLatency: y };
}
class hf {
  constructor({
    interval: e,
    onTrigger: n,
    onToggle: s,
    onError: r,
    getTime: o,
    latency: i = 0.1,
    setInterval: a,
    clearInterval: u,
    beforeStart: p
  }) {
    this.started = !1, this.beforeStart = p, this.cps = 0.5, this.num_ticks_since_cps_change = 0, this.lastTick = 0, this.lastBegin = 0, this.lastEnd = 0, this.getTime = o, this.num_cycles_at_cps_change = 0, this.seconds_at_cps_change, this.onToggle = s, this.latency = i, this.clock = ff(
      o,
      // called slightly before each cycle
      (h, y, g, v) => {
        this.num_ticks_since_cps_change === 0 && (this.num_cycles_at_cps_change = this.lastEnd, this.seconds_at_cps_change = h), this.num_ticks_since_cps_change++;
        const O = this.num_ticks_since_cps_change * y * this.cps;
        try {
          const A = this.lastEnd;
          this.lastBegin = A;
          const I = this.num_cycles_at_cps_change + O;
          if (this.lastEnd = I, this.lastTick = h, h < v) {
            console.log("skip query: too late");
            return;
          }
          this.pattern.queryArc(A, I, { _cps: this.cps, cyclist: "cyclist" }).forEach((P) => {
            if (P.hasOnset()) {
              const x = (P.whole.begin - this.num_cycles_at_cps_change) / this.cps + this.seconds_at_cps_change + i, D = P.duration / this.cps, nt = x - h;
              n?.(P, nt, D, this.cps, x), P.value.cps !== void 0 && this.cps != P.value.cps && (this.cps = P.value.cps, this.num_ticks_since_cps_change = 0);
            }
          });
        } catch (A) {
          zt(A), r?.(A);
        }
      },
      e,
      // duration of each cycle
      0.1,
      0.1,
      a,
      u
    );
  }
  now() {
    if (!this.started)
      return 0;
    const e = this.getTime() - this.lastTick - this.clock.duration;
    return this.lastBegin + e * this.cps;
  }
  setStarted(e) {
    this.started = e, this.onToggle?.(e);
  }
  async start() {
    if (await this.beforeStart?.(), this.num_ticks_since_cps_change = 0, this.num_cycles_at_cps_change = 0, !this.pattern)
      throw new Error("Scheduler: no pattern set! call .setPattern first.");
    E("[cyclist] start"), this.clock.start(), this.setStarted(!0);
  }
  pause() {
    E("[cyclist] pause"), this.clock.pause(), this.setStarted(!1);
  }
  stop() {
    E("[cyclist] stop"), this.clock.stop(), this.lastEnd = 0, this.setStarted(!1);
  }
  async setPattern(e, n = !1) {
    this.pattern = e, n && !this.started && await this.start();
  }
  setCps(e = 0.5) {
    this.cps !== e && (this.cps = e, this.num_ticks_since_cps_change = 0);
  }
  log(e, n, s) {
    const r = s.filter((o) => o.hasOnset());
    console.log(`${e.toFixed(4)} - ${n.toFixed(4)} ${Array(r.length).fill("I").join("")}`);
  }
}
let ct = {};
const df = function() {
  mf();
}, mf = function() {
  ct = {};
}, Cy = l(
  "timeline",
  function(t, e) {
    t = d(t);
    const n = function(s) {
      const r = !!s.controls.cyclist, o = t.query(s), i = [];
      for (const a of o) {
        const u = a.value;
        let p;
        if (u === 0)
          p = 0;
        else if (u in ct)
          p = ct[u];
        else {
          const y = a.wholeOrPart();
          !r || s.span.begin.lt(y.midpoint()) ? p = y.begin : p = y.end;
        }
        r && (ct[u] = p, u !== 0 && delete ct[-u]);
        const h = e.late(p).query(s.setSpan(a.part)).map((y) => y.setContext(y.combineContext(a)));
        i.push(...h);
      }
      return i;
    };
    return new f(n, e._steps);
  },
  !1
), F = function(t, e, n = !0) {
  const s = Array.isArray(t), r = Object.keys(t).length;
  return t = bn(t, d), r === 0 ? q : e.fmap((o) => {
    let i = o;
    return s && (i = n ? Math.round(i) % r : an(Math.round(i), 0, t.length - 1)), t[i];
  });
}, yf = function(t, e) {
  return Array.isArray(e) && ([e, t] = [t, e]), wf(t, e);
}, wf = l("pick", function(t, e) {
  return F(t, e, !1).innerJoin();
}), gf = l("pickmod", function(t, e) {
  return F(t, e, !0).innerJoin();
}), xy = l("pickF", function(t, e, n) {
  return n.apply(yf(t, e));
}), By = l("pickmodF", function(t, e, n) {
  return n.apply(gf(t, e));
}), Oy = l("pickOut", function(t, e) {
  return F(t, e, !1).outerJoin();
}), zy = l("pickmodOut", function(t, e) {
  return F(t, e, !0).outerJoin();
}), My = l("pickRestart", function(t, e) {
  return F(t, e, !1).restartJoin();
}), Py = l("pickmodRestart", function(t, e) {
  return F(t, e, !0).restartJoin();
}), Ey = l("pickReset", function(t, e) {
  return F(t, e, !1).resetJoin();
}), jy = l("pickmodReset", function(t, e) {
  return F(t, e, !0).resetJoin();
}), { inhabit: Jy, pickSqueeze: $y } = l(["inhabit", "pickSqueeze"], function(t, e) {
  return F(t, e, !1).squeezeJoin();
}), { inhabitmod: Ny, pickmodSqueeze: Ly } = l(["inhabitmod", "pickmodSqueeze"], function(t, e) {
  return F(t, e, !0).squeezeJoin();
}), Ry = (t, e) => (e = e.map(d), e.length == 0 ? q : t.fmap((n) => {
  const s = bt(Math.round(n), e.length);
  return e[s];
}).squeezeJoin());
class bf {
  constructor({ onTrigger: e, onToggle: n, getTime: s }) {
    this.started = !1, this.cps = 0.5, this.getTime = s, this.time_at_last_tick_message = 0, this.collator = new _n({ getTargetClockTime: s }), this.onToggle = n, this.latency = 0.1, this.cycle = 0, this.id = Math.round(Date.now() * Math.random()), this.worker = new SharedWorker(new URL(
      /* @vite-ignore */
      "" + new URL("assets/clockworker-ZDiUtESR.js", import.meta.url).href,
      import.meta.url
    )), this.worker.port.start(), this.channel = new BroadcastChannel("strudeltick");
    const r = (i) => {
      const { cps: a, begin: u, end: p, cycle: h, time: y } = i;
      this.cps = a, this.cycle = h;
      const g = this.collator.calculateOffset(y) + y;
      o(u, p, g), this.time_at_last_tick_message = g;
    }, o = (i, a, u) => {
      if (this.started === !1)
        return;
      this.pattern.queryArc(i, a, { _cps: this.cps, cyclist: "neocyclist" }).forEach((h) => {
        if (h.hasOnset()) {
          const g = Kt(h.whole.begin - this.cycle, this.cps) + u + this.latency, v = Kt(h.duration, this.cps);
          e?.(h, 0, v, this.cps, g);
        }
      });
    };
    this.channel.onmessage = (i) => {
      if (!this.started)
        return;
      const { payload: a, type: u } = i.data;
      switch (u) {
        case "tick":
          r(a);
      }
    };
  }
  sendMessage(e, n) {
    this.worker.port.postMessage({ type: e, payload: n, id: this.id });
  }
  now() {
    const e = (this.getTime() - this.time_at_last_tick_message) * this.cps;
    return this.cycle + e;
  }
  setCps(e = 1) {
    this.sendMessage("cpschange", { cps: e });
  }
  setCycle(e) {
    this.sendMessage("setcycle", { cycle: e });
  }
  setStarted(e) {
    this.sendMessage("toggle", { started: e }), this.started = e, this.onToggle?.(e);
  }
  start() {
    E("[cyclist] start"), this.setStarted(!0);
  }
  stop() {
    E("[cyclist] stop"), this.collator.reset(), this.setStarted(!1);
  }
  setPattern(e, n = !1) {
    this.pattern = e, n && !this.started && this.start();
  }
  log(e, n, s) {
    const r = s.filter((o) => o.hasOnset());
    console.log(`${e.toFixed(4)} - ${n.toFixed(4)} ${Array(r.length).fill("I").join("")}`);
  }
}
let Ot, _e, ve, ke, qe;
function Wy() {
  if (!Ot)
    throw new Error("no time set! use setTime to define a time source");
  return Ot();
}
function ee(t) {
  Ot = t;
}
function _f(t) {
  _e = t;
}
function Fy() {
  return _e?.();
}
function vf(t) {
  ve = t;
}
function Iy() {
  return ve;
}
function kf(t) {
  ke = t;
}
function Vy() {
  return ke;
}
function qf(t) {
  qe = !!t;
}
function Hy() {
  return qe;
}
function Dy({
  defaultOutput: t,
  onEvalError: e,
  beforeEval: n,
  beforeStart: s,
  afterEval: r,
  getTime: o,
  transpiler: i,
  onToggle: a,
  editPattern: u,
  onUpdateState: p,
  sync: h = !1,
  setInterval: y,
  clearInterval: g,
  id: v,
  mondo: _ = !1
}) {
  const O = new Ge({ localScope: !0 }), A = {
    schedulerError: void 0,
    evalError: void 0,
    code: "// LOADING",
    activeCode: "// LOADING",
    pattern: void 0,
    miniLocations: [],
    widgets: [],
    pending: !1,
    started: !1
  }, I = {
    id: v
  }, H = (b) => {
    Object.assign(A, b), A.isDirty = A.code !== A.activeCode, A.error = A.evalError || A.schedulerError, p?.(A);
  }, P = {
    onTrigger: Sf({ defaultOutput: t, getTime: o }),
    getTime: o,
    onToggle: (b) => {
      H({ started: b }), qf(b), a?.(b), b || df();
    },
    setInterval: y,
    clearInterval: g,
    beforeStart: s
  }, x = h && typeof SharedWorker < "u" ? new bf(P) : new hf(P);
  kf(P.onTrigger), _f(() => x.cps);
  let D = {}, nt = 0, tt;
  const Vt = function() {
    return D = {}, nt = 0, tt = void 0, q;
  }, Je = (b) => O.evaluate(b).compile({ log: !1 });
  function Ht(b) {
    return b._Pattern ? b.__pure : b;
  }
  const Dt = async (b, k = !0) => (b = u?.(b) || b, await x.setPattern(b, k), vf(b), b);
  ee(() => x.now());
  const $e = () => x.stop(), Ne = () => x.start(), Le = () => x.pause(), Re = () => x.toggle(), St = (b) => (x.setCps(Ht(b)), q), Gt = (b) => (x.setCps(Ht(b) / 60), q);
  let ft = [];
  const We = function(b) {
    return ft.push(b), q;
  }, Fe = function(b) {
    return tt = b, q;
  }, Ie = () => {
    f.prototype.p = function(k) {
      return typeof k == "string" && (k.startsWith("_") || k.endsWith("_")) ? q : (k.includes("$") && (k = `${k}${nt}`, nt++), D[k] = this, this);
    }, f.prototype.q = function(k) {
      return q;
    };
    try {
      for (let k = 1; k < 10; ++k)
        Object.defineProperty(f.prototype, `d${k}`, {
          get() {
            return this.p(k);
          },
          configurable: !0
        }), Object.defineProperty(f.prototype, `p${k}`, {
          get() {
            return this.p(k);
          },
          configurable: !0
        }), f.prototype[`q${k}`] = q;
    } catch (k) {
      console.warn("injectPatternMethods: error:", k);
    }
    const b = l("cpm", function(k, At) {
      return At._fast(k / 60 / x.cps);
    });
    return xn({
      all: We,
      each: Fe,
      hush: Vt,
      cpm: b,
      setCps: St,
      setcps: St,
      setCpm: Gt,
      setcpm: Gt,
      compileKabel: Je
    });
  };
  return { scheduler: x, evaluate: async (b, k = !0, At = !0) => {
    if (!b)
      throw new Error("no code to evaluate");
    try {
      H({ code: b, pending: !0 }), await Ie(), ee(() => x.now()), await n?.({ code: b }), ft = [], At && Vt(), _ && (b = `mondolang\`${b}\``);
      let { pattern: M, meta: Tt } = await On(b, i, I);
      if (Object.keys(D).length) {
        let X = [], ht = !1;
        for (const [st, Ve] of Object.entries(D)) {
          const Qt = st.length > 1 && st.startsWith("S");
          if (Qt && ht === !1 && (X = [], ht = !0), !ht || ht && Qt) {
            const He = Ve.withState((De) => De.setControls({ id: st }));
            X.push(He);
          }
        }
        tt && (X = X.map((st) => tt(st))), M = z(...X);
      } else tt && (M = tt(M));
      if (ft.length)
        for (const X of ft)
          M = X(M);
      return pe(M) || (M = q), E("[eval] code updated"), M = await Dt(M, k), H({
        miniLocations: Tt?.miniLocations || [],
        widgets: Tt?.widgets || [],
        activeCode: b,
        pattern: M,
        evalError: void 0,
        schedulerError: void 0,
        pending: !1
      }), r?.({ code: b, pattern: M, meta: Tt }), M;
    } catch (M) {
      E(`[eval] error: ${M.message}`, "error"), console.error(M), H({ evalError: M, pending: !1 }), e?.(M);
    }
  }, start: Ne, stop: $e, pause: Le, setCps: St, setPattern: Dt, setCode: (b) => H({ code: b }), toggle: Re, state: A };
}
const Sf = ({ getTime: t, defaultOutput: e }) => async (n, s, r, o, i) => {
  try {
    (!n.context.onTrigger || !n.context.dominantTrigger) && await e(n, s, r, o, i), n.context.onTrigger && await n.context.onTrigger(n, t(), o, i);
  } catch (a) {
    zt(a, "getTrigger");
  }
};
function Gy(t) {
  return new f((e) => [new S(void 0, e.span, t)]);
}
const j = (t) => {
  const e = (n) => [new S(void 0, n.span, t(n.span.begin, n.controls))];
  return new f(e);
}, qt = j((t) => t % 1), Se = qt.toBipolar(), Rt = j((t) => 1 - t % 1), Ae = Rt.toBipolar(), Te = j((t) => Math.sin(Math.PI * 2 * t)), Af = Te.fromBipolar(), Qy = Af._early(m(1).div(4)), Uy = Te._early(m(1).div(4)), Tf = j((t) => Math.floor(t * 2 % 2)), Xy = Tf.toBipolar(), Ky = N(qt, Rt), Yy = N(Se, Ae), Zy = N(Rt, qt), tw = N(Ae, Se), ew = j(ot);
let Wt = 0, Ft = 0;
typeof window < "u" && document.addEventListener("mousemove", (t) => {
  Wt = t.clientY / document.body.clientHeight, Ft = t.clientX / document.body.clientWidth;
});
const nw = j(() => Wt), sw = j(() => Wt), rw = j(() => Ft), ow = j(() => Ft), Cf = (t) => (t |= 0, t ^= t >>> 16, t = Math.imul(t, 2246822507), t ^= t >>> 13, t = Math.imul(t, 3266489909), t ^= t >>> 16, t >>> 0), xf = (t) => Math.floor(t * 536870912), Bf = (t, e = 0, n = 0) => {
  const s = t >>> 0 >>> 0, r = Math.floor(t / 4294967296) >>> 0;
  let o = s ^ Math.imul(r ^ 2246822507, 3266489909);
  return o ^= Math.imul(e ^ 2135587861, 2654435769), o ^= Math.imul(n ^ 374761393, 668265261), o >>> 0;
}, ne = (t, e = 0, n = 0) => Cf(Bf(t, e, n)) / 4294967296, Of = (t, e, n = 0) => {
  const s = xf(t);
  if (e === 1)
    return ne(s, 0, n);
  const r = new Array(e);
  for (let o = 0; o < e; o++) r[o] = ne(s, o, n);
  return r;
}, Ce = (t) => {
  const e = t << 13 ^ t, n = e >> 17 ^ e;
  return n << 5 ^ n;
}, zf = (t) => t - Math.trunc(t), Mf = (t) => Ce(Math.trunc(zf(t / 300) * 536870912)), se = (t) => t % 536870912 / 536870912, Pf = (t, e) => {
  if (e === 1)
    return Math.abs(se(t));
  const n = [];
  for (let s = 0; s < e; s++)
    n.push(se(t)), t = Ce(t);
  return n;
}, Ef = (t, e) => Pf(Mf(t), e);
let xe = "legacy";
const K = (t, e = 1, n = 0) => xe === "legacy" ? Ef(t + n, e) : Of(t, e, n), cw = (t = "legacy") => xe = t, jf = (t) => qt.range(0, t).round().segment(t), iw = (t) => {
  const e = d(t).log2(0).floor().add(1);
  return Jf(t, e);
}, Jf = (t, e = 16) => {
  e = d(e);
  const n = jf(e).mul(-1).add(e.sub(1));
  return d(t).segment(e).brshift(n).band(C(1));
}, uw = (t) => {
  const e = d(t).log2(0).floor().add(1);
  return $f(t, e);
}, $f = (t, e = 16) => d(t).withValue((n) => (s) => {
  const r = [];
  for (let o = s - 1; o >= 0; o--)
    r.push(n >> o & 1);
  return r;
}).appLeft(d(e)), aw = (t) => j((e) => (n) => K(e, n).map(Math.abs)).appLeft(d(t)), Nf = (t) => j((e, n) => {
  const r = K(e.floor().add(0.5), t, n.randSeed).map((i, a) => [i, a]).sort((i, a) => (i[0] > a[0]) - (i[0] < a[0])).map((i) => i[1]), o = e.cyclePos().mul(t).floor() % t;
  return r[o];
})._segment(t), Be = (t, e, n) => {
  const s = [...Array(e).keys()].map((r) => n.zoom(m(r).div(e), m(r + 1).div(e)));
  return t.fmap((r) => s[r].repeatCycles(e)._fast(e)).innerJoin();
}, lw = l("shuffle", (t, e) => Be(Nf(t), t, e)), pw = l("scramble", (t, e) => Be(ze(t)._segment(t), t, e)), Lf = (t, e) => new f((n) => {
  let { randSeed: s, ...r } = n.controls;
  return s = t(s), e.query(n.setControls({ ...r, randSeed: s }));
}, e._steps), fw = l("seed", (t, e) => Lf(() => t, e)), W = j((t, e) => K(t, 1, e.randSeed)), hw = W.toBipolar(), Oe = (t) => W.fmap((e) => e < t), dw = (t) => d(t).fmap(Oe).innerJoin(), mw = Oe(0.5), ze = (t) => W.fmap((e) => Math.trunc(e * t)), yw = (t) => d(t).fmap(ze).innerJoin(), Me = (t, e) => (e = e.map(d), e.length == 0 ? q : t.range(0, e.length).fmap((n) => {
  const s = Math.min(Math.max(Math.floor(n), 0), e.length - 1);
  return e[s];
})), It = (t, e) => Me(t, e).outerJoin(), Pe = (t, e) => Me(t, e).innerJoin(), Rf = (...t) => It(W, t), ww = (...t) => Pe(W, t), gw = Rf;
f.prototype.choose = function(...t) {
  return It(this, t);
};
f.prototype.choose2 = function(...t) {
  return It(this.fromBipolar(), t);
};
const Wf = (...t) => Pe(W.segment(1), t), bw = Wf, Ee = function(t, ...e) {
  const n = e.map((a) => d(a[0])), s = [];
  let r = C(0);
  for (const a of e)
    r = r.add(a[1]), s.push(r);
  const o = En(s), i = function(a) {
    const u = r.mul(a);
    return o.fmap((p) => (h) => n[p.findIndex((y) => y > h, p)]).appLeft(u);
  };
  return t.bind(i);
}, Ff = (...t) => Ee(...t).outerJoin(), _w = (...t) => Ff(W, ...t), If = (...t) => Ee(W.segment(1), ...t).innerJoin(), vw = If;
function Vf(t, e = 0) {
  let n = Math.floor(t), s = n + 1;
  const r = (p) => 6 * p ** 5 - 15 * p ** 4 + 10 * p ** 3, o = (p) => (h) => (y) => h + r(p) * (y - h), i = K(n, 1, e), a = K(s, 1, e);
  return o(t - n)(i)(a);
}
function Hf(t, e = 0) {
  const n = Math.floor(t), s = n + 1, r = K(n, 1, e), o = K(s, 1, e), i = r + o, a = (t - n) / (s - n);
  return ((p, h, y) => p + y * (h - p))(r, i, a) / 2;
}
const kw = j((t, e) => Vf(t, e.randSeed)), qw = j((t, e) => Hf(t, e.randSeed)), Sw = l(
  "degradeByWith",
  (t, e, n) => n.fmap((s) => (r) => s).appLeft(t.filterValues((s) => s > e)),
  !0,
  !0
), Aw = l(
  "degradeBy",
  function(t, e) {
    return e._degradeByWith(W, t);
  },
  !0,
  !0
), Tw = l("degrade", (t) => t._degradeBy(0.5), !0, !0), Cw = l(
  "undegradeBy",
  function(t, e) {
    return e._degradeByWith(
      W.fmap((n) => 1 - n),
      t
    );
  },
  !0,
  !0
), xw = l("undegrade", (t) => t._undegradeBy(0.5), !0, !0), Bw = l("sometimesBy", function(t, e, n) {
  return d(t).fmap((s) => z(n._degradeBy(s), e(n._undegradeBy(1 - s)))).innerJoin();
}), Ow = l("sometimes", function(t, e) {
  return e._sometimesBy(0.5, t);
}), zw = l("someCyclesBy", function(t, e, n) {
  return d(t).fmap(
    (s) => z(
      n._degradeByWith(W._segment(1), s),
      e(n._degradeByWith(W.fmap((r) => 1 - r)._segment(1), 1 - s))
    )
  ).innerJoin();
}), Mw = l("someCycles", function(t, e) {
  return e._someCyclesBy(0.5, t);
}), Pw = l("often", function(t, e) {
  return e.sometimesBy(0.75, t);
}), Ew = l("rarely", function(t, e) {
  return e.sometimesBy(0.25, t);
}), jw = l("almostNever", function(t, e) {
  return e.sometimesBy(0.1, t);
}), Jw = l("almostAlways", function(t, e) {
  return e.sometimesBy(0.9, t);
}), $w = l("never", function(t, e) {
  return e;
}), Nw = l("always", function(t, e) {
  return t(e);
});
function je(t) {
  Array.isArray(t) === !1 && (t = [t]);
  const e = qn();
  return t.every((n) => {
    const s = kn.get(n) ?? n;
    return e[s];
  });
}
const Lw = l("whenKey", function(t, e, n) {
  return n.when(je(t), e);
}), Rw = l("keyDown", function(t) {
  return t.fmap(je);
}), Ww = new f(function(t) {
  return [new S(void 0, t.span, t.span.duration)];
}), Df = new f(function(t) {
  return [new S(void 0, t.span, m(1).div(t.span.duration))];
}), Fw = Df, Iw = new f(function(t) {
  const e = m(1).div(t.span.duration);
  return [new S(void 0, t.span, Math.log(e) / Math.log(2) + 1)];
});
let wt;
try {
  wt = window?.speechSynthesis;
} catch {
  console.warn("cannot use window: not in browser?");
}
let re = wt?.getVoices();
function Gf(t, e, n) {
  wt.cancel();
  const s = new SpeechSynthesisUtterance(t);
  s.lang = e, re = wt.getVoices();
  const r = re.filter((o) => o.lang.includes(e));
  typeof n == "number" ? s.voice = r[n % r.length] : typeof n == "string" && (s.voice = r.find((o) => o.name === o)), speechSynthesis.speak(s);
}
const Vw = l("speak", function(t, e, n) {
  return n.onTrigger((s) => {
    Gf(s.value, t, e);
  });
}), Hw = function(t, e = {}) {
  const n = document.getElementById("code"), s = "background-image:url(" + t + ");background-size:contain;";
  n.style = s;
  const { className: r } = n, o = (u, p) => {
    ({
      style: () => n.style = s + ";" + p,
      className: () => n.className = p + " " + r
    })[u]();
  }, i = Object.entries(e).filter(([u, p]) => typeof p == "function");
  Object.entries(e).filter(([u, p]) => typeof p == "string").forEach(([u, p]) => o(u, p)), i.length;
}, Dw = () => {
  const t = document.getElementById("code");
  t && (t.style = "");
};
E("🌀 @strudel/core loaded 🌀");
globalThis._strudelLoaded && console.warn(
  `@strudel/core was loaded more than once...
This might happen when you have multiple versions of strudel installed. 
Please check with "npm ls @strudel/core".`
);
globalThis._strudelLoaded = !0;
export {
  _n as ClockCollator,
  hf as Cyclist,
  uf as FXr,
  cf as FXrel,
  of as FXrelease,
  m as Fraction,
  S as Hap,
  f as Pattern,
  ut as State,
  B as TimeSpan,
  Me as __chooseWith,
  Oe as _brandBy,
  Fn as _fitslice,
  ze as _irand,
  je as _keyDown,
  In as _match,
  bt as _mod,
  de as _morph,
  Hn as _polymeterListSteps,
  Yt as _retime,
  Zt as _slices,
  Ys as accelerate,
  va as activeLabel,
  Bp as ad,
  $h as add,
  xp as adsr,
  Jw as almostAlways,
  jw as almostNever,
  Nw as always,
  sr as amp,
  gc as analyze,
  Ua as anchor,
  nd as and,
  Pd as apply,
  Wn as applyN,
  zp as ar,
  wh as arp,
  yh as arpWith,
  kh as arrange,
  Kp as as,
  py as asym,
  or as att,
  rr as attack,
  nn as averageArray,
  Hw as backgroundImage,
  Ih as band,
  Cc as bandf,
  Oc as bandq,
  yc as bank,
  gn as base64ToUnicode,
  ti as bbexpr,
  ni as bbst,
  oy as beat,
  Mc as begin,
  qw as berlin,
  ja as bgain,
  iw as binary,
  uw as binaryL,
  Jf as binaryN,
  $f as binaryNL,
  xh as bind,
  Zl as binshift,
  Ld as bite,
  _y as bjork,
  ge as bjorklund,
  Dh as blshift,
  sf as bmod,
  Vh as bor,
  Bc as bp,
  ji as bpa,
  Ei as bpattack,
  Wi as bpd,
  yu as bpdc,
  Ri as bpdecay,
  fu as bpdepth,
  du as bpdepthfreq,
  hu as bpdepthfrequency,
  Bi as bpe,
  xi as bpenv,
  xc as bpf,
  zc as bpq,
  Zi as bpr,
  lu as bprate,
  Yi as bprelease,
  Gi as bps,
  mu as bpshape,
  wu as bpskew,
  Di as bpsustain,
  pu as bpsync,
  Ud as brak,
  mw as brand,
  dw as brandBy,
  Gh as brshift,
  Pa as bus,
  Ea as busgain,
  Hh as bxor,
  Tm as bypass,
  Zc as byteBeatExpression,
  ei as byteBeatStartTime,
  dh as calculateSteps,
  mt as cat,
  $p as ccn,
  Np as ccv,
  id as ceil,
  ri as ch,
  gi as channel,
  si as channels,
  dy as chebyshev,
  Rf as choose,
  Wf as chooseCycles,
  ww as chooseIn,
  Pe as chooseInWith,
  gw as chooseOut,
  It as chooseWith,
  Xm as chop,
  Da as chord,
  wc as chorus,
  mm as chunk,
  gm as chunkBack,
  Am as chunkBackInto,
  qm as chunkInto,
  bm as chunkback,
  Sm as chunkbackinto,
  km as chunkinto,
  an as clamp,
  Dw as cleanupUi,
  pp as clip,
  Rc as coarse,
  ph as code2hash,
  Ap as color,
  Tp as colour,
  Xl as comb,
  oh as compose,
  dd as compress,
  md as compressSpan,
  bl as compressor,
  kl as compressorAttack,
  _l as compressorKnee,
  vl as compressorRatio,
  ql as compressorRelease,
  yd as compressspan,
  ch as constant,
  Kn as contract,
  Jp as control,
  gy as controls,
  Qy as cosine,
  Uy as cosine2,
  Ed as cpm,
  lp as cps,
  ff as createClock,
  Nt as createParam,
  Cp as createParams,
  Lc as crush,
  vi as ctf,
  Lp as ctlNum,
  Aa as ctranspose,
  ay as cubic,
  w as curry,
  yp as curve,
  bi as cut,
  _i as cutoff,
  Kt as cycleToSeconds,
  Ww as cyclesPer,
  vc as dec,
  _c as decay,
  Tw as degrade,
  Aw as degradeBy,
  Sw as degradeByWith,
  qa as degree,
  Ru as delay,
  Fu as delayfb,
  Wu as delayfeedback,
  Vu as delayspeed,
  Qu as delaysync,
  Du as delayt,
  Hu as delaytime,
  wp as deltaSlide,
  Ku as det,
  Xu as detune,
  Iu as dfb,
  Qa as dict,
  Ga as dictionary,
  ly as diode,
  yl as dist,
  ml as distort,
  gl as distorttype,
  wl as distortvol,
  Rh as div,
  Lu as djf,
  Cn as drawLine,
  Qc as drive,
  Qn as drop,
  ta as dry,
  Op as ds,
  Gu as dt,
  Uc as duck,
  Yc as duckattack,
  Xc as duckdepth,
  Kc as duckonset,
  dp as dur,
  hp as duration,
  jd as early,
  im as echo,
  sm as echoWith,
  rm as echowith,
  Ty as eish,
  Pc as end,
  Ul as enhance,
  nf as env,
  Yh as eq,
  Zh as eqt,
  zt as errorLogger,
  by as euclid,
  qy as euclidLegato,
  Sy as euclidLegatoRot,
  ky as euclidRot,
  Ay as euclidish,
  vy as euclidrot,
  xn as evalScope,
  On as evaluate,
  Md as every,
  Xn as expand,
  Ol as expression,
  Un as extend,
  sa as fadeInTime,
  na as fadeOutTime,
  ea as fadeTime,
  eu as fanchor,
  qd as fast,
  vm as fastChunk,
  wd as fastGap,
  N as fastcat,
  _m as fastchunk,
  gd as fastgap,
  bc as fft,
  zm as filter,
  Mm as filterWhen,
  zd as firstOf,
  ey as fit,
  G as flatten,
  cd as floor,
  Sr as fm,
  Ar as fm1,
  Tr as fm2,
  Cr as fm3,
  xr as fm4,
  Br as fm5,
  Or as fm6,
  zr as fm7,
  Mr as fm8,
  Kr as fmatt,
  Yr as fmatt1,
  Zr as fmatt2,
  to as fmatt3,
  eo as fmatt4,
  no as fmatt5,
  so as fmatt6,
  ro as fmatt7,
  oo as fmatt8,
  Fr as fmattack,
  Ir as fmattack1,
  Vr as fmattack2,
  Hr as fmattack3,
  Dr as fmattack4,
  Gr as fmattack5,
  Qr as fmattack6,
  Ur as fmattack7,
  Xr as fmattack8,
  Ao as fmdec,
  To as fmdec1,
  Co as fmdec2,
  xo as fmdec3,
  Bo as fmdec4,
  Oo as fmdec5,
  zo as fmdec6,
  Mo as fmdec7,
  Po as fmdec8,
  yo as fmdecay,
  wo as fmdecay1,
  go as fmdecay2,
  bo as fmdecay3,
  _o as fmdecay4,
  vo as fmdecay5,
  ko as fmdecay6,
  qo as fmdecay7,
  So as fmdecay8,
  Pr as fmenv,
  Er as fmenv1,
  jr as fmenv2,
  Jr as fmenv3,
  $r as fmenv4,
  Nr as fmenv5,
  Lr as fmenv6,
  Rr as fmenv7,
  Wr as fmenv8,
  cr as fmh,
  ir as fmh1,
  ur as fmh2,
  ar as fmh3,
  lr as fmh4,
  pr as fmh5,
  fr as fmh6,
  hr as fmh7,
  dr as fmh8,
  mr as fmi,
  yr as fmi1,
  wr as fmi2,
  gr as fmi3,
  br as fmi4,
  _r as fmi5,
  vr as fmi6,
  kr as fmi7,
  qr as fmi8,
  ic as fmrel,
  uc as fmrel1,
  ac as fmrel2,
  lc as fmrel3,
  pc as fmrel4,
  fc as fmrel5,
  hc as fmrel6,
  dc as fmrel7,
  mc as fmrel8,
  Yo as fmrelease,
  Zo as fmrelease1,
  tc as fmrelease2,
  ec as fmrelease3,
  nc as fmrelease4,
  sc as fmrelease5,
  rc as fmrelease6,
  oc as fmrelease7,
  cc as fmrelease8,
  Io as fmsus,
  Vo as fmsus1,
  Ho as fmsus2,
  Do as fmsus3,
  Go as fmsus4,
  Qo as fmsus5,
  Uo as fmsus6,
  Xo as fmsus7,
  Ko as fmsus8,
  Eo as fmsustain,
  jo as fmsustain1,
  Jo as fmsustain2,
  $o as fmsustain3,
  No as fmsustain4,
  Lo as fmsustain5,
  Ro as fmsustain6,
  Wo as fmsustain7,
  Fo as fmsustain8,
  co as fmwave,
  io as fmwave1,
  uo as fmwave2,
  ao as fmwave3,
  lo as fmwave4,
  po as fmwave5,
  fo as fmwave6,
  ho as fmwave7,
  mo as fmwave8,
  bd as focus,
  _d as focusSpan,
  vd as focusspan,
  fy as fold,
  ih as fractionalArgs,
  np as frameRate,
  sp as frames,
  Vl as freeze,
  ra as freq,
  Ze as freqToMidi,
  ad as fromBipolar,
  Ml as fshift,
  Pl as fshiftnote,
  El as fshiftphase,
  tu as ftype,
  rd as func,
  af as fxr,
  er as gain,
  pt as gap,
  wa as gat,
  ya as gate,
  Ye as getAccidentalsOffset,
  yt as getControlName,
  Fy as getCps,
  qn as getCurrentKeyboardState,
  th as getEventOffsetMs,
  tn as getFreq,
  rh as getFrequency,
  Hy as getIsStarted,
  Iy as getPattern,
  hh as getPerformanceTimeSeconds,
  sh as getPlayableNoteValue,
  K as getRandsAtTime,
  nh as getSoundIndex,
  Wy as getTime,
  Sf as getTrigger,
  Vy as getTriggerFunc,
  jm as grow,
  Uh as gt,
  Kh as gte,
  uy as hard,
  Ta as harmonic,
  fh as hash2code,
  tp as hbrick,
  Mu as hcutoff,
  Tc as hold,
  rp as hours,
  Eu as hp,
  Pi as hpa,
  Mi as hpattack,
  Li as hpd,
  Su as hpdc,
  Ni as hpdecay,
  _u as hpdepth,
  ku as hpdepthfreq,
  vu as hpdepthfrequency,
  Ci as hpe,
  Ti as hpenv,
  Pu as hpf,
  Ju as hpq,
  Ki as hpr,
  gu as hprate,
  Xi as hprelease,
  Hi as hps,
  qu as hpshape,
  Au as hpskew,
  Vi as hpsustain,
  bu as hpsync,
  ju as hresonance,
  Om as hsl,
  Bm as hsla,
  Ad as hurry,
  ot as id,
  Ql as imag,
  Jy as inhabit,
  Ny as inhabitmod,
  Bh as innerBind,
  xd as inside,
  Dd as inv,
  Hd as invert,
  cl as ir,
  yw as irand,
  al as irbegin,
  il as iresponse,
  ul as irspeed,
  is as isControlName,
  Mt as isNote,
  Yf as isNoteWithOctave,
  pe as isPattern,
  Rt as isaw,
  Ae as isaw2,
  pm as iter,
  fm as iterBack,
  hm as iterback,
  Zy as itri,
  tw as itri2,
  nm as jux,
  tm as juxBy,
  em as juxby,
  $l as kcutoff,
  jh as keep,
  Jh as keepif,
  kn as keyAlias,
  Rw as keyDown,
  Jl as krush,
  ka as label,
  Od as lastOf,
  Ln as late,
  ep as lbrick,
  fp as legato,
  ga as leslie,
  ef as lfo,
  Rd as linger,
  _t as listRange,
  Uu as lock,
  oe as logKey,
  E as logger,
  Ec as loop,
  Zm as loopAt,
  ny as loopAtCps,
  jc as loopBegin,
  $c as loopEnd,
  ty as loopat,
  sy as loopatcps,
  Jc as loopb,
  Nc as loope,
  qi as lp,
  zi as lpa,
  Oi as lpattack,
  $i as lpd,
  uu as lpdc,
  Ji as lpdecay,
  ru as lpdepth,
  cu as lpdepthfreq,
  ou as lpdepthfrequency,
  Ai as lpe,
  Si as lpenv,
  ki as lpf,
  Nu as lpq,
  Ui as lpr,
  nu as lprate,
  Qi as lprelease,
  Ii as lps,
  iu as lpshape,
  au as lpskew,
  Fi as lpsustain,
  su as lpsync,
  ba as lrate,
  _a as lsize,
  Qh as lt,
  Xh as lte,
  ie as mapArgs,
  Sh as mask,
  eh as midi2note,
  it as midiToFreq,
  Dp as midibend,
  Mp as midichan,
  jp as midicmd,
  Pp as midimap,
  Ep as midiport,
  Gp as miditouch,
  op as minutes,
  Wh as mod,
  Ya as mode,
  cy as morph,
  ow as mouseX,
  sw as mouseY,
  rw as mousex,
  nw as mousey,
  Sa as mtranspose,
  Lh as mul,
  Xs as n,
  sn as nanFallback,
  td as ne,
  ed as net,
  $w as never,
  Bu as noise,
  Ks as note,
  gt as noteToMidi,
  R as nothing,
  Rp as nrpnn,
  Wp as nrpv,
  Ba as nudge,
  L as numeralArgs,
  bn as objectMap,
  za as oct,
  Oa as octave,
  xa as octaveR,
  Ka as octaves,
  Nl as octer,
  Ll as octersub,
  Rl as octersubsub,
  Qd as off,
  Xa as offset,
  Pw as often,
  sd as or,
  Ma as orbit,
  Up as oschost,
  Xp as oscport,
  Oh as outerBind,
  Bd as outside,
  Ja as overgain,
  $a as overshape,
  Vn as pace,
  un as pairs,
  Zd as palindrome,
  Na as pan,
  ma as panchor,
  Fa as panorient,
  La as panspan,
  Ra as pansplay,
  Wa as panwidth,
  me as parray,
  cn as parseFractional,
  ce as parseNumeral,
  my as partials,
  ca as patt,
  oa as pattack,
  da as pcurve,
  ua as pdec,
  ia as pdecay,
  ha as penv,
  Df as per,
  Fw as perCycle,
  kw as perlin,
  Iw as perx,
  ai as ph,
  wi as phasdp,
  li as phaser,
  hi as phasercenter,
  mi as phaserdepth,
  ui as phaserrate,
  pi as phasersweep,
  yy as phases,
  di as phc,
  yi as phd,
  fi as phs,
  yf as pick,
  xy as pickF,
  Oy as pickOut,
  Ey as pickReset,
  My as pickRestart,
  $y as pickSqueeze,
  gf as pickmod,
  By as pickmodF,
  zy as pickmodOut,
  jy as pickmodReset,
  Py as pickmodRestart,
  Ly as pickmodSqueeze,
  on as pipe,
  gp as pitchJump,
  bp as pitchJumpTime,
  kd as ply,
  lm as plyForEach,
  am as plyWith,
  _h as pm,
  Ph as polyBind,
  Qp as polyTouch,
  $t as polymeter,
  gh as polyrhythm,
  nr as postgain,
  Fh as pow,
  bh as pr,
  fa as prel,
  pa as prelease,
  Yd as press,
  Kd as pressBy,
  Fp as progNum,
  la as psus,
  aa as psustain,
  C as pure,
  oi as pw,
  ci as pwrate,
  ii as pwsweep,
  W as rand,
  hw as rand2,
  aw as randL,
  bw as randcat,
  Nf as randrun,
  ld as range,
  fd as range2,
  pd as rangex,
  Ew as rarely,
  hd as ratio,
  sl as rdim,
  Gl as real,
  ry as ref,
  l as register,
  c as registerControl,
  V as registerMultiControl,
  d as reify,
  Ac as rel,
  Sc as release,
  lt as removeUndefineds,
  dm as repeatCycles,
  Dy as repl,
  Em as replicate,
  df as reset_state,
  mf as reset_timelines,
  $u as resonance,
  Rn as rev,
  Xd as revv,
  ol as rfade,
  xm as rib,
  Cm as ribbon,
  Wl as ring,
  Il as ringdf,
  Fl as ringf,
  el as rlp,
  Za as room,
  nl as roomdim,
  rl as roomfade,
  tl as roomlp,
  ll as roomsize,
  rn as rotate,
  od as round,
  hl as rsize,
  jf as run,
  us as s,
  Fm as s_add,
  Nm as s_alt,
  $m as s_cat,
  Dm as s_contract,
  Vm as s_expand,
  Hm as s_extend,
  Lm as s_polymeter,
  Im as s_sub,
  Rm as s_taper,
  Wm as s_taperlist,
  Gm as s_tour,
  Qm as s_zip,
  qt as saw,
  Se as saw2,
  Yl as scram,
  pw as scramble,
  Yp as scrub,
  cp as seconds,
  fw as seed,
  Fd as seg,
  Wd as segment,
  Va as semitone,
  Nn as seq,
  qh as seqPLoop,
  Q as sequence,
  En as sequenceP,
  Eh as set,
  _f as setCpsFunc,
  qf as setIsStarted,
  vf as setPattern,
  mh as setStringParser,
  ee as setTime,
  kf as setTriggerFunc,
  dl as shape,
  Zn as shrink,
  Yn as shrinklist,
  lw as shuffle,
  j as signal,
  q as silence,
  Af as sine,
  Te as sine2,
  hy as sinefold,
  pl as size,
  ss as slice,
  Ia as slide,
  Td as slow,
  wm as slowChunk,
  Z as slowcat,
  fe as slowcatPrime,
  ym as slowchunk,
  Kl as smear,
  iy as soft,
  uh as sol2note,
  Mw as someCycles,
  zw as someCyclesBy,
  Ow as sometimes,
  Bw as sometimesBy,
  ip as songPtr,
  as as sound,
  Qs as source,
  Cd as sparsity,
  Vw as speak,
  ye as speed,
  Ym as splice,
  ue as splitAt,
  Zu as spread,
  Tf as square,
  Xy as square2,
  Ry as squeeze,
  zh as squeezeBind,
  Tl as squiz,
  Us as src,
  z as stack,
  vh as stackBy,
  $n as stackCentre,
  jn as stackLeft,
  Jn as stackRight,
  Gy as steady,
  Mh as stepBind,
  Dn as stepalt,
  $ as stepcat,
  Um as steps,
  Ca as stepsPerOctave,
  Sl as stretch,
  Km as striate,
  ae as stringifyValues,
  Ah as struct,
  le as strudelScope,
  um as stut,
  om as stutWith,
  cm as stutwith,
  Nh as sub,
  Th as superimpose,
  qc as sus,
  kc as sustain,
  zl as sustainpedal,
  Vd as swing,
  Id as swingBy,
  Ip as sysex,
  Hp as sysexdata,
  Vp as sysexid,
  fl as sz,
  Gn as take,
  ew as time,
  ns as timeCat,
  Jm as timecat,
  Cy as timeline,
  ud as toBipolar,
  Ue as tokenizeNote,
  ts as tour,
  rf as transient,
  Fc as trem,
  Wc as tremolo,
  Vc as tremolodepth,
  Dc as tremolophase,
  Gc as tremoloshape,
  Hc as tremoloskew,
  Ic as tremolosync,
  Ky as tri,
  Yy as tri2,
  jl as triode,
  Dl as tsdelay,
  up as uid,
  xw as undegrade,
  Cw as undegradeBy,
  wn as unicodeToBase64,
  ah as uniq,
  lh as uniqsort,
  yn as uniqsortr,
  Yu as unison,
  Al as unit,
  cw as useRNG,
  xu as v,
  ap as val,
  Zf as valueToMidi,
  tr as vel,
  Zs as velocity,
  Tu as vib,
  Ou as vibmod,
  Cu as vibrato,
  zu as vmod,
  Ha as voice,
  Cl as vowel,
  Cs as warp,
  Os as warpatt,
  Bs as warpattack,
  Rs as warpdc,
  Ms as warpdec,
  zs as warpdecay,
  Ns as warpdepth,
  Ds as warpenv,
  Fs as warpmode,
  $s as warprate,
  Js as warprel,
  js as warprelease,
  Ls as warpshape,
  Ws as warpskew,
  Es as warpsus,
  Ps as warpsustain,
  Gs as warpsync,
  xl as waveloss,
  Hs as wavetablePhaseRand,
  ps as wavetablePosition,
  xs as wavetableWarp,
  Is as wavetableWarpMode,
  _w as wchoose,
  If as wchooseCycles,
  Gd as when,
  Lw as whenKey,
  Lf as withSeed,
  Ch as withValue,
  Pm as within,
  wy as worklet,
  vw as wrandcat,
  ls as wt,
  ds as wtatt,
  hs as wtattack,
  As as wtdc,
  ys as wtdec,
  ms as wtdecay,
  qs as wtdepth,
  fs as wtenv,
  Vs as wtphaserand,
  vs as wtrate,
  _s as wtrel,
  bs as wtrelease,
  Ss as wtshape,
  Ts as wtskew,
  gs as wtsus,
  ws as wtsustain,
  ks as wtsync,
  rs as xfade,
  Hl as xsdelay,
  kp as zcrush,
  qp as zdelay,
  es as zip,
  Pt as zipWith,
  vp as zmod,
  _p as znoise,
  Jd as zoom,
  $d as zoomArc,
  Nd as zoomarc,
  mp as zrand,
  Sp as zzfx
};
