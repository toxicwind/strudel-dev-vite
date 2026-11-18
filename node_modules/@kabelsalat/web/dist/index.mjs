function W(e, t) {
  if (t || (t = "assertion failed"), !e)
    throw new Error(t);
}
class c {
  constructor(t, i) {
    this.type = t, i !== void 0 && (this.value = i), this.ins = [];
  }
  static parseInput(t, i) {
    if (typeof t == "function") {
      if (!i)
        throw new Error(
          "tried to parse function input without without passing node.."
        );
      return t(i);
    }
    return typeof t == "object" ? t : typeof t == "number" && !isNaN(t) || typeof t == "string" ? f(t) : (console.log(
      `invalid input type "${typeof t}" for node of type "${i.type}", falling back to 0. The input was:`,
      t
    ), 0);
  }
}
const x = (e, t) => new c(e, t);
let y = /* @__PURE__ */ new Map();
const Z = "poly", Y = "exit";
c.prototype.inherit = function(e) {
  return e.inputOf && (this.inputOf = e.inputOf), e.outputOf && (this.outputOf = e.outputOf), this;
};
c.prototype.toObject = function() {
  return JSON.parse(JSON.stringify(this));
};
c.prototype.stringify = function() {
  return JSON.stringify(this, null, 2).replaceAll('"', "'");
};
function F(e, ...t) {
  let i = 1;
  if (t = t.map((l) => {
    if (Array.isArray(l)) {
      if (l.length === 1)
        return l[0];
      l = new c(Z).withIns(...l);
    }
    if (typeof l == "function") {
      const o = l(new c("peek"));
      o.type === Z && (i = Math.max(o.ins.length, i));
    }
    return l.type === Z && (i = Math.max(l.ins.length, i)), l;
  }), i === 1) {
    const l = x(e);
    return l.withIns(...t.map((o) => c.parseInput(o, l)));
  }
  if (e === Y) {
    const l = t.map((o) => o.type === Z ? o.ins.map((d) => c.parseInput(d).inherit(d)) : o).flat();
    return x(Y).withIns(...l);
  }
  const n = Array.from({ length: i }, (l, o) => {
    const d = new c(e), G = t.map((p) => p.type === Z ? c.parseInput(p.ins[o % p.ins.length], d).inherit(p) : (p = c.parseInput(p, d), p.type === Z && (p = p.ins[o]), p));
    return d.withIns(...G);
  });
  return new c(Z).withIns(...n);
}
function oe(e, t) {
  const i = y.get(e);
  return i?.ins?.[t] ? i.ins[t].name : "";
}
let a = (e, t) => u(e, (...i) => F(e, ...i), t);
y.set("register", {
  tags: ["meta"],
  graph: !1,
  description: "Registers a new Node function. Sets it on the prototype + returns the function itself. Like `module` but doesn't hide complexity in graph viz.",
  examples: [
    `let kick = register('kick', gate => gate.adsr(0,.11,0,.11)
.apply(env => env.mul(env)
  .mul(158)
  .sine(env)
  .distort(.85)
))
impulse(2).kick().out()`
  ]
});
let u = (e, t, i) => (i && y.set(e, i), c.prototype[e] = function(...n) {
  return t(this, ...n);
}, c.prototype["_" + e] = function() {
  return this;
}, t);
y.set("module", {
  tags: ["meta"],
  graph: !0,
  description: "Creates a module. Like `register`, but the graph viz will hide the internal complexity of the module.",
  examples: [
    `let kick = module('kick', gate => gate.adsr(0,.11,0,.11)
.apply(env => env.mul(env)
  .mul(158)
  .sine(env)
  .distort(.85)
))
impulse(2).kick().out()`
  ]
});
let de = 0;
function g(e, t, i) {
  return u(
    e,
    (...n) => {
      const l = de++;
      return n = n.map(
        (o, d) => c.parseInput(o).asModuleInput?.(e, l, d)
      ), t(...n).asModuleOutput?.(e, l);
    },
    i
  );
}
y.set("n", {
  tags: ["math"],
  description: "Constant value node. Turns a number into a Node.",
  ins: [{ name: "value", default: 0 }]
});
function f(e) {
  return Array.isArray(e) ? poly(...e.map((t) => f(t))) : typeof e == "object" ? e : x("n", e);
}
y.set("out", {
  tags: ["meta"],
  description: "Sends the node to the audio output"
});
y.set("withIns", {
  internal: !0,
  tags: ["innards"],
  description: "Sets the inputs of a node. Returns the node itself",
  ins: [{ name: "in", dynamic: !0 }]
});
c.prototype.withIns = function(...e) {
  return this.ins = e, this;
};
y.set("flatten", {
  internal: !0,
  tags: ["innards"],
  description: "Flattens the node to a list of all nodes in the graph, where each Node's ins are now indices"
});
c.prototype.flatten = function() {
  return pe(this);
};
y.set("apply", {
  graph: !0,
  tags: ["meta"],
  description: "Applies the given function to the Node. Useful when a node has to be used multiple times.",
  examples: [
    `impulse(4)
.apply(imp=>imp
  .seq(110,220,330,440)
  .sine()
  .mul( imp.ad(.1,.1) )
).out()`
  ]
});
c.prototype.apply = function(e) {
  return e(this);
};
y.set("clone", {
  internal: !0,
  tags: ["innards"],
  description: "Clones the node"
});
c.prototype.clone = function() {
  return new c(this.type, this.value).withIns(...this.ins);
};
y.set("map", {
  tags: ["meta"],
  description: "Applies the given function to all ins if it's poly node. Otherwise it applies the function to itself.",
  examples: [
    `n([110,220,330])
.map( freq=>freq.mul([1,1.007]).saw().mix() )
.mix(2).mul(.5).out()`
  ]
});
c.prototype.map = function(e) {
  return this.type !== "poly" ? e(this) : poly(...this.ins.map(e));
};
c.prototype.channel = function(e) {
  return this.type !== "poly" ? this : this.ins[e % this.ins.length];
};
y.set("select", {
  tags: ["meta"],
  graph: !0,
  description: "Find the first occurence of the given type up in the graph and returns the match. Useful to exit a feedback loop at another point.",
  examples: [
    `sine(220).mul(impulse(1).ad(.001,.2))
.add( x=>x.delay(.2).mul(.8) )
.select('delay').out()
`
  ]
});
c.prototype.select = function(e) {
  for (let t of this.ins) {
    if (t.type === e)
      return t;
    const i = t.select(e);
    if (i)
      return i;
  }
};
y.set("debug", {
  tags: ["meta"],
  description: "Logs the node to the console"
});
c.prototype.debug = function(e = (t) => t) {
  return console.log(e(this)), this;
};
function ce(e) {
  const t = modules.get(e), i = Array.from(
    { length: t.length },
    (l, o) => x(`$INPUT${o}`)
  ), n = t(...i);
  return JSON.stringify(n, null, 2);
}
function pe(e) {
  const t = [];
  return S(e, (i) => (t.push(i), i)), t.map((i) => {
    let n = {
      ...i,
      type: i.type,
      ins: i.ins.map((l) => t.indexOf(l) + "")
    };
    return i.value !== void 0 && (n.value = i.value), i.to !== void 0 && (n.to = t.indexOf(i.to)), n;
  });
}
let J = a("exit", { internal: !0 });
function j(e, t) {
  let i = [];
  const n = u("out", function(o, d = [0, 1]) {
    return i.push(o.output(d)), o;
  });
  return t ? (t.out = n, Function(...Object.keys(t), e)(...Object.values(t))) : (globalThis.out = n, Function(e)()), J(...i);
}
c.prototype.over = function(e) {
  return this.apply((t) => add(t, e(t)));
};
c.prototype.dfs = function(e, t) {
  return this.apply((i) => S(i, e, t));
};
c.prototype.apply2 = function(e) {
  return e(this, this);
};
let S = (e, t, i = []) => (e = t(e, i), i.push(e), e.ins = e.ins.map((n) => i.includes(n) ? n : S(n, t, i)), e);
c.prototype.asModuleInput = function(e, t, i) {
  return this.inputOf = this.inputOf || [], this.inputOf.push([e, t, i]), this;
};
c.prototype.asModuleOutput = function(e, t) {
  return this.outputOf = [e, t], this;
};
function T(e, t = {}) {
  const {
    log: i = !1,
    lang: n = "js",
    fallbackType: l = "thru",
    constType: o = "n",
    getRegister: d = (h) => `r[${h}]`,
    getOutput: G = (h) => `o[${h}]`,
    getSource: p = (h) => `s[${h}]`
  } = t;
  i && console.log("compile", e);
  const m = ue(e);
  let r = [], R = (h) => m[h].type !== o ? d(h) : typeof m[h].value == "string" ? `"${m[h].value}"` : m[h].value;
  const X = [];
  for (let h in m) {
    const v = m[h], I = m[h].ins.map((ae) => R(m.indexOf(ae))), se = X.length;
    let b = y.get(v.type);
    b || (console.warn(
      `unhandled node type "${m[h].type}". falling back to "${l}"`
    ), b = y.get(l));
    const le = {
      vars: I,
      node: v,
      nodes: m,
      id: h,
      ugenIndex: se,
      ugen: b.ugen,
      name: R(h),
      lang: n,
      getRegister: d,
      getOutput: G,
      getSource: p
    };
    b.compile && r.push(b.compile(le)), b.ugen && X.push({ type: b.ugen, inputs: I });
  }
  const z = r.join(`
`);
  return i && (console.log("compiled code:"), console.log(z)), { src: z, ugens: X, registers: m.length };
}
c.prototype.compile = function(e) {
  return T(this, e);
};
function ue(e) {
  const t = [], i = /* @__PURE__ */ new Set();
  function n(l) {
    if (!(typeof l != "object" || i.has(l))) {
      i.add(l);
      for (let o in l.ins)
        n(l.ins[o]);
      t.push(l);
    }
  }
  return n(e), t;
}
const U = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  compile: T
}, Symbol.toStringTag, { value: "Module" }));
class Q {
  constructor() {
    this._events = {};
  }
  on(t, i) {
    this._events[t] || (this._events[t] = []);
    let n = this._events[t];
    W(n.indexOf(i) == -1), n.push(i);
  }
  removeListener(t, i) {
    let n = this._events[t], l = n.indexOf(i);
    l != -1 && n.splice(l, 1);
  }
  trigger(t, ...i) {
    let n = this._events[t] || [];
    for (let l = 0; l < n.length; l++)
      n[l].apply(null, i);
  }
}
class me extends Q {
  constructor(t = navigator) {
    super(), this.midiAccess = null, this.getMIDIAccess(t);
  }
  // Try to get MIDI access from the browser
  async getMIDIAccess(t) {
    if ("requestMIDIAccess" in t) {
      this.midiAccess = await t.requestMIDIAccess({ sysex: !1 }), console.log("got MIDI access");
      for (let i of this.midiAccess.inputs.values())
        i.state == "connected" && (i.onmidimessage = (n) => this.trigger("midimessage", i.id, n.data));
      this.midiAccess.onstatechange = (i) => {
        i.port.type == "input" && i.port.state == "connected" && (console.log(
          "MIDI device connected:",
          i.port.name,
          "PORT:",
          i.port.id
        ), i.port.onmidimessage = (n) => this.trigger("midimessage", i.port.id, n.data));
      };
    }
  }
  // Send a message to all MIDI devices
  broadcast(t, i) {
    if (midi)
      for (let n of this.midiAccess.outputs.values())
        n.send(t, i);
  }
}
function re(e) {
  let t = e[0] & 240, i = (e[0] & 15) + 1;
  if (t == 176 && e.length == 3) {
    let n = e[1], o = e[2] / 127 * 2 - 1;
    return { type: "CC", channel: i, cc: n, value: o };
  }
  if (t == 224 && e.length == 3) {
    let n = e[1], d = (e[2] << 7 | n) / 16383 * 2 - 1;
    return { type: "PITCHBEND", channel: i, value: d };
  }
  if (t == 144 && e.length == 3) {
    let n = e[1], l = e[2] / 127;
    return { type: "NOTE_ON", channel: i, note: n, velocity: l };
  }
  if (t == 128 && e.length == 3) {
    let n = e[1];
    return { type: "NOTE_ON", channel: i, note: n, velocity: 0 };
  }
}
class he extends Q {
  constructor() {
    super(), this.attach();
  }
  attach() {
    typeof window < "u" && (this.handleMouseMove = (t) => {
      const i = t.clientX / document.body.clientWidth * 2 - 1, n = t.clientY / document.body.clientHeight * 2 - 1;
      this.trigger("move", i, n);
    }, document.addEventListener("mousemove", this.handleMouseMove));
  }
  detach() {
    typeof window < "u" && document.removeEventListener("mousemove", this.handleMouseMove);
  }
}
const Ge = "data:text/javascript;base64,KGZ1bmN0aW9uKCl7InVzZSBzdHJpY3QiO2Z1bmN0aW9uIGcoaCx0KXtpZih0fHwodD0iYXNzZXJ0aW9uIGZhaWxlZCIpLCFoKXRocm93IG5ldyBFcnJvcih0KX1mdW5jdGlvbiBTKGgsdCxzKXtyZXR1cm4gaDw9MD90Omg+PTE/czp0K2gqKHMtdCl9ZnVuY3Rpb24gUChoLHQscyl7cmV0dXJuIGg8PXQ/MDpoPj1zPzE6cz09PXQ/MDooaC10KS8ocy10KX1mdW5jdGlvbiBFKGgsdCl7cmV0dXJuIGg8dD8oaC89dCxoK2gtaCpoLTEpOmg+MS10PyhoPShoLTEpL3QsaCpoK2graCsxKTowfWZ1bmN0aW9uIFUoaCl7cmV0dXJuIE1hdGguZmxvb3IoaCk9PT1ofWZ1bmN0aW9uIF8oaCl7cmV0dXJuIFUoaCkmJmg+MH1mdW5jdGlvbiBrKGgsdCl7dD1NYXRoLm1pbihNYXRoLm1heCh0LDApLDEpLHQtPS4wMTt2YXIgcz0yKnQvKDEtdCksZT0oMStzKSpoLygxK3MqTWF0aC5hYnMoaCkpO3JldHVybiBlfWZ1bmN0aW9uIHcoaCx0LHMpe3JldHVybiBoPj0xP3M6dCtoKihzLXQpfWZ1bmN0aW9uIFQoKXt0aGlzLnN0YXRlPSJvZmYiLHRoaXMuc3RhcnRUaW1lPTAsdGhpcy5zdGFydFZhbD0wfVQucHJvdG90eXBlLmV2YWw9ZnVuY3Rpb24oaCx0LHMsZSxpLG4pe3N3aXRjaCh0aGlzLnN0YXRlKXtjYXNlIm9mZiI6cmV0dXJuIHQ+MCYmKHRoaXMuc3RhdGU9ImF0dGFjayIsdGhpcy5zdGFydFRpbWU9aCx0aGlzLnN0YXJ0VmFsPTApLDA7Y2FzZSJhdHRhY2siOntsZXQgcj1oLXRoaXMuc3RhcnRUaW1lO3JldHVybiByPnM/KHRoaXMuc3RhdGU9ImRlY2F5Iix0aGlzLnN0YXJ0VGltZT1oLDEpOncoci9zLHRoaXMuc3RhcnRWYWwsMSl9Y2FzZSJkZWNheSI6e2xldCByPWgtdGhpcy5zdGFydFRpbWUsbD13KHIvZSwxLGkpO3JldHVybiB0PD0wPyh0aGlzLnN0YXRlPSJyZWxlYXNlIix0aGlzLnN0YXJ0VGltZT1oLHRoaXMuc3RhcnRWYWw9bCxsKTpyPmU/KHRoaXMuc3RhdGU9InN1c3RhaW4iLHRoaXMuc3RhcnRUaW1lPWgsaSk6bH1jYXNlInN1c3RhaW4iOnJldHVybiB0PD0wJiYodGhpcy5zdGF0ZT0icmVsZWFzZSIsdGhpcy5zdGFydFRpbWU9aCx0aGlzLnN0YXJ0VmFsPWkpLGk7Y2FzZSJyZWxlYXNlIjp7bGV0IHI9aC10aGlzLnN0YXJ0VGltZTtpZihyPm4pcmV0dXJuIHRoaXMuc3RhdGU9Im9mZiIsMDtsZXQgbD13KHIvbix0aGlzLnN0YXJ0VmFsLDApO3JldHVybiB0PjAmJih0aGlzLnN0YXRlPSJhdHRhY2siLHRoaXMuc3RhcnRUaW1lPWgsdGhpcy5zdGFydFZhbD1sKSxsfX10aHJvdyJpbnZhbGlkIGVudmVsb3BlIHN0YXRlIn07ZnVuY3Rpb24gdigpe3RoaXMuczA9MCx0aGlzLnMxPTB9di5wcm90b3R5cGUuYXBwbHk9ZnVuY3Rpb24oaCx0LHMpe2coIWlzTmFOKGgpLCJOYU4gdmFsdWUgZmVkIGluIFR3b1BvbGVGaWx0ZXIiKSx0PU1hdGgubWluKHQsMSkscz1NYXRoLm1heChzLDApO3ZhciBlPU1hdGgucG93KC41LCgxLXQpLy4xMjUpLGk9TWF0aC5wb3coLjUsKHMrLjEyNSkvLjEyNSksbj0xLWkqZSxyPXRoaXMuczAsbD10aGlzLnMxO3JldHVybiByPW4qci1lKmwrZSpoLGw9bipsK2UqcixoPWwsdGhpcy5zMD1yLHRoaXMuczE9bCxofTtsZXQgQT1jbGFzcyBDe2NvbnN0cnVjdG9yKHQscyl7dGhpcy5zYW1wbGVSYXRlPXQscz90aGlzLmJ1ZmZlcj1zLnNsaWNlKDApOih0aGlzLmJ1ZmZlcj1uZXcgRmxvYXQzMkFycmF5KDEwKnQpLHRoaXMuYnVmZmVyLmZpbGwoMCkpLHRoaXMud3JpdGVJZHg9MCx0aGlzLnJlYWRJZHg9MH1yZXNldCgpe3RoaXMuYnVmZmVyLmZpbGwoMCksdGhpcy53cml0ZUlkeD0wLHRoaXMucmVhZElkeD0wfWNsb25lKCl7Y29uc3QgdD1uZXcgQyh0aGlzLnNhbXBsZVJhdGUsdGhpcy5idWZmZXIpO3JldHVybiB0LndyaXRlSWR4PXRoaXMud3JpdGVJZHgsdC5yZWFkSWR4PXRoaXMucmVhZElkeCx0fXdyaXRlKHQscyl7dGhpcy53cml0ZUlkeD0odGhpcy53cml0ZUlkeCsxKSV0aGlzLmJ1ZmZlci5sZW5ndGgsdGhpcy5idWZmZXJbdGhpcy53cml0ZUlkeF09dDtsZXQgZT1NYXRoLm1pbihNYXRoLmZsb29yKHRoaXMuc2FtcGxlUmF0ZSpzKSx0aGlzLmJ1ZmZlci5sZW5ndGgtMSk7dGhpcy5yZWFkSWR4PXRoaXMud3JpdGVJZHgtZSx0aGlzLnJlYWRJZHg8MCYmKHRoaXMucmVhZElkeCs9dGhpcy5idWZmZXIubGVuZ3RoKX1yZWFkKCl7cmV0dXJuIHRoaXMuYnVmZmVyW3RoaXMucmVhZElkeF19fTtjb25zdCB5PTEvNDhlMyxNPTI0LE49TS80O2NsYXNzIG97Y29uc3RydWN0b3IodCxzLGUsaSl7dGhpcy5ub2RlSWQ9dCx0aGlzLnN0YXRlPXMsdGhpcy5zYW1wbGVSYXRlPWUsdGhpcy5zYW1wbGVUaW1lPTEvZSx0aGlzLnNlbmQ9aX19Y2xhc3MgcSBleHRlbmRzIG97Y29uc3RydWN0b3IodCxzLGUsaSl7c3VwZXIodCxzLGUsaSksdGhpcy5lbnY9bmV3IFR9dXBkYXRlKHQscyxlLGksbixyKXtyZXR1cm4gdGhpcy5lbnYuZXZhbCh0LHMsZSxpLG4scil9fWNsYXNzIEYgZXh0ZW5kcyBve2NvbnN0cnVjdG9yKHQscyxlLGkpe3N1cGVyKHQscyxlLGkpLHRoaXMucGhhc2U9MH11cGRhdGUodCl7bGV0IHM9TSp0LzYwLGU9LjU7cmV0dXJuIHRoaXMucGhhc2UrPXRoaXMuc2FtcGxlVGltZSpzLHRoaXMucGhhc2UlMTxlPzE6LTF9fWNsYXNzIEQgZXh0ZW5kcyBve2NvbnN0cnVjdG9yKHQscyxlLGkpe3N1cGVyKHQscyxlLGkpLHRoaXMuaW5TZ249ITAsdGhpcy5vdXRTZ249ITAsdGhpcy5jbG9ja0NudD0wfXVwZGF0ZSh0LHMpe2xldCBlPXQ+MDtyZXR1cm4gdGhpcy5pblNnbiE9ZSYmKHRoaXMuY2xvY2tDbnQrKyx0aGlzLmNsb2NrQ250Pj1zJiYodGhpcy5jbG9ja0NudD0wLHRoaXMub3V0U2duPSF0aGlzLm91dFNnbikpLHRoaXMuaW5TZ249ZSx0aGlzLm91dFNnbj8xOi0xfX1jbGFzcyBMIGV4dGVuZHMgb3tjb25zdHJ1Y3Rvcih0LHMsZSxpKXtzdXBlcih0LHMsZSxpKSx0aGlzLmluU2duPSExfXVwZGF0ZSh0LHMpe2xldCBlPXM+MDtyZXR1cm4gZSYmdGhpcy5pblNnbiE9ZSYmdGhpcy5zZW5kKHt0eXBlOiJDTE9DS19QVUxTRSIsbm9kZUlkOnRoaXMubm9kZUlkLHRpbWU6dH0pLHRoaXMuaW5TZ249ZSwwfX1jb25zdCBPPW5ldyBNYXA7Y2xhc3MgViBleHRlbmRzIG97Y29uc3RydWN0b3IodCxzLGUsaSl7c3VwZXIodCxzLGUsaSk7Y29uc3Qgbj1zLmlucHV0c1syXTtuJiZPLmhhcyhuKT90aGlzLmRlbGF5PU8uZ2V0KG4pLmNsb25lKCk6dGhpcy5kZWxheT1uZXcgQShlKSxuJiZPLnNldChuLHRoaXMuZGVsYXkpfXVwZGF0ZSh0LHMpe3JldHVybiB0aGlzLmRlbGF5LndyaXRlKHQscyksdGhpcy5kZWxheS5yZWFkKCl9fWNsYXNzIEcgZXh0ZW5kcyBve2NvbnN0cnVjdG9yKHQscyxlLGkpe3N1cGVyKHQscyxlLGkpfXVwZGF0ZSh0LHMpe3JldHVybiBrKHQscyl9fWNsYXNzIFIgZXh0ZW5kcyBve2NvbnN0cnVjdG9yKHQscyxlLGkpe3N1cGVyKHQscyxlLGkpLHRoaXMudmFsdWU9MCx0aGlzLnRyaWdTZ249ITF9d3JpdGUodCxzKXshdGhpcy50cmlnU2duJiZzPjAmJih0aGlzLnZhbHVlPXQpLHRoaXMudHJpZ1Nnbj1zPjB9cmVhZCgpe3JldHVybiB0aGlzLnZhbHVlfXVwZGF0ZSh0LHMpe3JldHVybiB0aGlzLndyaXRlKHQscyksdGhpcy5yZWFkKCl9fWNsYXNzIEJ7Y29uc3RydWN0b3IoKXt0aGlzLnZhbHVlPTB9dXBkYXRlKHQpe3JldHVybiB0aGlzLnZhbHVlPXQsdGhpcy52YWx1ZX19Y29uc3QgJD0zNDA7bGV0IEk9MDtjbGFzcyBIe2NvbnN0cnVjdG9yKCl7dGhpcy5jaD1JLHRoaXMuc3RhcnRfc2VlZD0kKih0aGlzLmNoKzEpPj4+MCx0aGlzLnN0YXRlPXRoaXMuc3RhcnRfc2VlZCx0aGlzLnZhbHVlPTAsdGhpcy5hPTE2NjQ1MjUsdGhpcy5jPTEwMTM5MDQyMjMsdGhpcy5tYXNrPTE2Nzc3MjE1LHRoaXMuc2NhbGU9MS8oMTw8MjQpLEkrK311cGRhdGUodCxzKXtpZighdClyZXR1cm4gdGhpcy52YWx1ZTtzJiYodGhpcy5zdGF0ZT10aGlzLnN0YXJ0X3NlZWQpLHRoaXMuc3RhdGU9dGhpcy5zdGF0ZSp0aGlzLmErdGhpcy5jPj4+MDtjb25zdCBlPSh0aGlzLnN0YXRlJnRoaXMubWFzaykqdGhpcy5zY2FsZTtyZXR1cm4gdGhpcy52YWx1ZT1lKjItMSx0aGlzLnZhbHVlfX1jbGFzcyBqe2NvbnN0cnVjdG9yKCl7dGhpcy52YWx1ZT1NYXRoLnJhbmRvbSgpKjItMX11cGRhdGUodCl7cmV0dXJuIHQ/KHRoaXMudmFsdWU9TWF0aC5yYW5kb20oKSoyLTEsdGhpcy52YWx1ZSk6dGhpcy52YWx1ZX19Y2xhc3MgS3t1cGRhdGUodCl7cmV0dXJuIE1hdGgucmFuZG9tKCk8dCp5P01hdGgucmFuZG9tKCk6MH19Y2xhc3MgV3tjb25zdHJ1Y3Rvcigpe3RoaXMub3V0PTB9dXBkYXRlKCl7bGV0IHQ9TWF0aC5yYW5kb20oKSoyLTE7cmV0dXJuIHRoaXMub3V0PSh0aGlzLm91dCsuMDIqdCkvMS4wMix0aGlzLm91dH19Y2xhc3MgWHtjb25zdHJ1Y3Rvcigpe3RoaXMuYjA9MCx0aGlzLmIxPTAsdGhpcy5iMj0wLHRoaXMuYjM9MCx0aGlzLmI0PTAsdGhpcy5iNT0wLHRoaXMuYjY9MH11cGRhdGUoKXtjb25zdCB0PU1hdGgucmFuZG9tKCkqMi0xO3RoaXMuYjA9Ljk5ODg2KnRoaXMuYjArdCouMDU1NTE3OSx0aGlzLmIxPS45OTMzMip0aGlzLmIxK3QqLjA3NTA3NTksdGhpcy5iMj0uOTY5KnRoaXMuYjIrdCouMTUzODUyLHRoaXMuYjM9Ljg2NjUqdGhpcy5iMyt0Ki4zMTA0ODU2LHRoaXMuYjQ9LjU1KnRoaXMuYjQrdCouNTMyOTUyMix0aGlzLmI1PS0uNzYxNip0aGlzLmI1LXQqLjAxNjg5ODtjb25zdCBzPXRoaXMuYjArdGhpcy5iMSt0aGlzLmIyK3RoaXMuYjMrdGhpcy5iNCt0aGlzLmI1K3RoaXMuYjYrdCouNTM2MjtyZXR1cm4gdGhpcy5iNj10Ki4xMTU5MjYscyouMTF9fWNsYXNzIFkgZXh0ZW5kcyBve2NvbnN0cnVjdG9yKHQscyxlLGkpe3N1cGVyKHQscyxlLGkpLHRoaXMucGhhc2U9MX11cGRhdGUodCl7dGhpcy5waGFzZSs9dGhpcy5zYW1wbGVUaW1lKnQ7bGV0IHM9dGhpcy5waGFzZT49MT8xOjA7cmV0dXJuIHRoaXMucGhhc2U9dGhpcy5waGFzZSUxLHN9fWNsYXNzIHogZXh0ZW5kcyBve2NvbnN0cnVjdG9yKHQscyxlLGkpe3N1cGVyKHQscyxlLGkpLHRoaXMucGhhc2U9MH11cGRhdGUodCxzKXtyZXR1cm4gdGhpcy5waGFzZSs9dGhpcy5zYW1wbGVUaW1lKnQsdGhpcy5waGFzZSUxPHM/MTotMX19Y2xhc3MgWiBleHRlbmRzIG97Y29uc3RydWN0b3IodCxzLGUsaSl7c3VwZXIodCxzLGUsaSksdGhpcy5waGFzZT0wfXVwZGF0ZSh0KXtyZXR1cm4gdGhpcy5waGFzZSs9dGhpcy5zYW1wbGVUaW1lKnQsdGhpcy5waGFzZSUxKjItMX19Y2xhc3MgSntjb25zdHJ1Y3Rvcigpe3RoaXMucGhhc2U9TWF0aC5yYW5kb20oKX11cGRhdGUodCl7Y29uc3Qgcz10L3NhbXBsZVJhdGU7bGV0IGU9RSh0aGlzLnBoYXNlLHMpLGk9Mip0aGlzLnBoYXNlLTEtZTtyZXR1cm4gdGhpcy5waGFzZSs9cyx0aGlzLnBoYXNlPjEmJih0aGlzLnBoYXNlLT0xKSxpfX1jbGFzcyBRIGV4dGVuZHMgb3tjb25zdHJ1Y3Rvcih0LHMsZSxpKXtzdXBlcih0LHMsZSxpKSx0aGlzLnBoYXNlPTAsdGhpcy5zeW5jU2duPSExfXVwZGF0ZSh0LHMsZSl7IXRoaXMuc3luY1NnbiYmcz4wJiYodGhpcy5waGFzZT0wKSx0aGlzLnN5bmNTZ249cz4wO2xldCBpPSh0aGlzLnBoYXNlK2UpJTE7cmV0dXJuIHRoaXMucGhhc2UrPXRoaXMuc2FtcGxlVGltZSp0LE1hdGguc2luKGkqMipNYXRoLlBJKX19Y2xhc3MgdHR7ZEJUb0xpbmVhcih0KXtyZXR1cm4gTWF0aC5wb3coMTAsdC8yMCl9bGluZWFyVG9EQih0KXtyZXR1cm4gMjAqTWF0aC5sb2cxMCh0KX11cGRhdGUodCxzLGUpe2xldCBpPXRoaXMubGluZWFyVG9EQihNYXRoLmFicyh0KSksbj0wO3JldHVybiBpPnMmJihuPShpLXMpKigxLTEvZSkpLHRoaXMuZEJUb0xpbmVhcigtbil9fWNsYXNzIHN0IGV4dGVuZHMgb3tjb25zdHJ1Y3Rvcih0LHMsZSxpKXtzdXBlcih0LHMsZSxpKSx0aGlzLnBoYXNlPTB9dXBkYXRlKHQpe3RoaXMucGhhc2UrPXRoaXMuc2FtcGxlVGltZSp0O2xldCBzPXRoaXMucGhhc2UlMTtyZXR1cm4oczwuNT8yKnM6MS0yKihzLS41KSkqMi0xfX1jbGFzcyBldCBleHRlbmRzIG97Y29uc3RydWN0b3IodCxzLGUsaSl7c3VwZXIodCxzLGUsaSk7Y29uc3Qgbj1lLzMwO2coXyhuKSksdGhpcy5idWZmZXI9bmV3IEZsb2F0MzJBcnJheShuKSx0aGlzLndyaXRlUG9zPTB9dXBkYXRlKHQscyxlLGkpe3JldHVybiB0aGlzLmJ1ZmZlclt0aGlzLndyaXRlUG9zXT10LHRoaXMud3JpdGVQb3MrKyx0aGlzLndyaXRlUG9zJXRoaXMuYnVmZmVyLmxlbmd0aD09MCYmKHRoaXMud3JpdGVQb3M9MCx0aGlzLnNlbmQoe3R5cGU6IlNFTkRfU0FNUExFUyIsaWQ6cyxzYW1wbGVzOnRoaXMuYnVmZmVyLGNoYW5uZWxzOmUsY2hhbm5lbDppfSkpLHR9fWNsYXNzIGl0e2NvbnN0cnVjdG9yKCl7dGhpcy5sYWdVbml0PTQ0MTAsdGhpcy5zPTB9dXBkYXRlKHQscyl7cmV0dXJuIHM9cyp0aGlzLmxhZ1VuaXQsczwxJiYocz0xKSx0aGlzLnMrPTEvcyoodC10aGlzLnMpLHRoaXMuc319Y2xhc3MgaHR7Y29uc3RydWN0b3IoKXt0aGlzLmxhc3Q9MH11cGRhdGUodCxzLGUpe2NvbnN0IGk9cyp5LG49ZSp5O2xldCByPXQtdGhpcy5sYXN0O3JldHVybiByPmk/cj1pOnI8LW4mJihyPS1uKSx0aGlzLmxhc3QrPXIsdGhpcy5sYXN0fX1jbGFzcyBhdCBleHRlbmRzIG97Y29uc3RydWN0b3IodCxzLGUsaSl7c3VwZXIodCxzLGUsaSksdGhpcy5zPTB9dXBkYXRlKHQscyl7cmV0dXJuIHM9cyoxZTMsczwxJiYocz0xKSx0aGlzLnMrPTEvcyoodC10aGlzLnMpLHRoaXMuc319Y2xhc3MgbnQgZXh0ZW5kcyBve2NvbnN0cnVjdG9yKHQscyxlLGkpe3N1cGVyKHQscyxlLGkpLHRoaXMuZmlsdGVyPW5ldyB2fXVwZGF0ZSh0LHMsZSl7cmV0dXJuIHRoaXMuZmlsdGVyLmFwcGx5KHQscyxlKSx0aGlzLmZpbHRlci5zMX19Y2xhc3MgcnQgZXh0ZW5kcyBve2NvbnN0cnVjdG9yKHQscyxlLGkpe3N1cGVyKHQscyxlLGkpLHRoaXMuZmlsdGVyPW5ldyB2fXVwZGF0ZSh0LHMsZSl7cmV0dXJuIHRoaXMuZmlsdGVyLmFwcGx5KHQscyxlKSx0aGlzLmZpbHRlci5zMH19Y2xhc3MgdXQgZXh0ZW5kcyBve2NvbnN0cnVjdG9yKHQscyxlLGkpe3N1cGVyKHQscyxlLGkpfXVwZGF0ZSh0LHMpe3JldHVybiBzPDAmJihzPTApLHM9cysxLHQ9dCpzLDQqKE1hdGguYWJzKC4yNSp0Ky4yNS1NYXRoLnJvdW5kKC4yNSp0Ky4yNSkpLS4yNSl9fWNsYXNzIGx0IGV4dGVuZHMgb3t1cGRhdGUodCl7cmV0dXJuIHR9fWNsYXNzIG0gZXh0ZW5kcyBve2NvbnN0cnVjdG9yKHQscyxlLGkpe3N1cGVyKHQscyxlLGkpLHRoaXMubm90ZT0wLHRoaXMuZnJlcT0wLHRoaXMudmVsb2NpdHk9MCx0aGlzLmdhdGVTdGF0ZT0ib2ZmIix0aGlzLnR5cGU9Im1pZGlpbiIsdGhpcy5jaGFubmVsPS0xfWlzRnJlZSgpe3JldHVybiB0aGlzLmdhdGVTdGF0ZT09PSJvZmYifW5vdGVPbih0LHMpe3M+MD8odGhpcy5ub3RlPXQsdGhpcy52ZWxvY2l0eT1zLHRoaXMuZnJlcT0yKiooKHQtNjkpLzEyKSo0NDAsdGhpcy5nYXRlU3RhdGU9InByZXRyaWciKTp0aGlzLm5vdGVPZmYoKX1ub3RlT2ZmKCl7dGhpcy5ub3RlPTAsdGhpcy5nYXRlU3RhdGU9Im9mZiJ9Z2V0R2F0ZSgpe3N3aXRjaCh0aGlzLmdhdGVTdGF0ZSl7Y2FzZSJwcmV0cmlnIjpyZXR1cm4gdGhpcy5nYXRlU3RhdGU9Im9uIiwwO2Nhc2Uib24iOnJldHVybiAxO2Nhc2Uib2ZmIjpyZXR1cm4gMDtkZWZhdWx0OmcoITEpfX1nZXRGcmVxKCl7c3dpdGNoKHRoaXMuZ2F0ZVN0YXRlKXtjYXNlInByZXRyaWciOnJldHVybiB0aGlzLmdhdGVTdGF0ZT0ib24iLDA7Y2FzZSJvbiI6cmV0dXJuIHRoaXMuZnJlcTtjYXNlIm9mZiI6cmV0dXJuIHRoaXMuZnJlcTtkZWZhdWx0OmcoITEpfX1nZXRWZWxvY2l0eSgpe3N3aXRjaCh0aGlzLmdhdGVTdGF0ZSl7Y2FzZSJwcmV0cmlnIjpyZXR1cm4gdGhpcy5nYXRlU3RhdGU9Im9uIiwwO2Nhc2Uib24iOnJldHVybiB0aGlzLnZlbG9jaXR5O2Nhc2Uib2ZmIjpyZXR1cm4gdGhpcy52ZWxvY2l0eTtkZWZhdWx0OmcoITEpfX19Y2xhc3Mgb3QgZXh0ZW5kcyBte2NvbnN0cnVjdG9yKHQscyxlLGkpe3N1cGVyKHQscyxlLGkpLHRoaXMudHlwZT0ibWlkaWdhdGUifXVwZGF0ZSh0KXtyZXR1cm4gdGhpcy5jaGFubmVsPXQsdGhpcy5nZXRHYXRlKCl9fWNsYXNzIGN0IGV4dGVuZHMgbXtjb25zdHJ1Y3Rvcih0LHMsZSxpKXtzdXBlcih0LHMsZSxpKSx0aGlzLnR5cGU9Im1pZGlmcmVxIn11cGRhdGUodCl7cmV0dXJuIHRoaXMuY2hhbm5lbD10LHRoaXMuZ2V0RnJlcSgpfX1jbGFzcyBkdCBleHRlbmRzIG17Y29uc3RydWN0b3IodCxzLGUsaSl7c3VwZXIodCxzLGUsaSksdGhpcy50eXBlPSJtaWRpdmVsIn11cGRhdGUodCl7cmV0dXJuIHRoaXMuY2hhbm5lbD10LHRoaXMuZ2V0VmVsb2NpdHkoKX19Y2xhc3MgZnR7Y29uc3RydWN0b3IodCxzLGUsaSl7dGhpcy51cD0hMSx0aGlzLnNlbmQ9aSx0aGlzLnZhbHVlPTAsdGhpcy50eXBlPSJjYyJ9c2V0VmFsdWUodCl7dGhpcy52YWx1ZT10fXVwZGF0ZSh0LHMsZSl7cmV0dXJuIHRoaXMuaWQ9cywhdGhpcy51cCYmdD4wPyh0aGlzLnVwPSEwLHRoaXMuc2VuZCh7dHlwZToiU0lHTkFMX1RSSUdHRVIiLGlkOnMsdGltZTplfSksdGhpcy52YWx1ZSk6KHRoaXMudXA9dD4wLHRoaXMudmFsdWUpfX1jbGFzcyBwdCBleHRlbmRzIG97Y29uc3RydWN0b3IodCxzLGUsaSl7c3VwZXIodCxzLGUsaSksdGhpcy50eXBlPSJjYyIsdGhpcy52YWx1ZT1zLmlucHV0c1sxXT8/MH1zZXRWYWx1ZSh0KXt0aGlzLnZhbHVlPXR9dXBkYXRlKHQpe3JldHVybiB0aGlzLmlkPXQsdGhpcy52YWx1ZX19Y2xhc3MgYnQgZXh0ZW5kcyBve2NvbnN0cnVjdG9yKHQscyxlLGkpe3N1cGVyKHQscyxlLGkpLHRoaXMudHlwZT0ibWlkaWNjIix0aGlzLnZhbHVlPXMuaW5wdXRzWzJdPz8tMSx0aGlzLmNoYW5uZWw9LTEsdGhpcy5jY251bWJlcj0tMX1zZXRWYWx1ZSh0KXt0aGlzLnZhbHVlPXR9dXBkYXRlKHQscyl7cmV0dXJuIHRoaXMuY2NudW1iZXI9dCx0aGlzLmNoYW5uZWw9cyx0aGlzLnZhbHVlfX1jbGFzcyBndCBleHRlbmRzIG97Y29uc3RydWN0b3IodCxzLGUsaSl7c3VwZXIodCxzLGUsaSksdGhpcy5jbG9ja1Nnbj0hMCx0aGlzLnN0ZXA9MCx0aGlzLmZpcnN0PSEwfXVwZGF0ZSh0LC4uLnMpe3JldHVybiF0aGlzLmNsb2NrU2duJiZ0PjA/KHRoaXMuc3RlcD0odGhpcy5zdGVwKzEpJXMubGVuZ3RoLHRoaXMuY2xvY2tTZ249dD4wLDApOih0aGlzLmNsb2NrU2duPXQ+MCxzW3RoaXMuc3RlcF0pfX1jbGFzcyBtdCBleHRlbmRzIG97dXBkYXRlKHQsLi4ucyl7Y29uc3QgZT10JXMubGVuZ3RoK3MubGVuZ3RoO3JldHVybiBzW01hdGguZmxvb3IoZSklcy5sZW5ndGhdfX1jbGFzcyBTdHt1cGRhdGUodCxzLGUsaSxuKXtsZXQgcj1QKHQscyxlKTtyZXR1cm4gUyhyLGksbil9fWNsYXNzIHd0e3VwZGF0ZSh0LHMsZSl7cmV0dXJuIE1hdGgubWluKE1hdGgubWF4KHQscyksZSl9fWNsYXNzIHZ0e2NvbnN0cnVjdG9yKCl7dGhpcy5oaT0hMX11cGRhdGUodCl7cmV0dXJuIXRoaXMuaGkmJnQ+MD8odGhpcy5oaT0hMCwxKToodGhpcy5oaSYmdDw9MCYmKHRoaXMuaGk9ITEpLDApfX1jbGFzcyB5dHtjb25zdHJ1Y3Rvcigpe3RoaXMueDE9MCx0aGlzLngyPTAsdGhpcy55MT0wLHRoaXMueTI9MCx0aGlzLmEwPTEsdGhpcy5hMT0wLHRoaXMuYTI9MCx0aGlzLmIwPTEsdGhpcy5iMT0wLHRoaXMuYjI9MH11cGRhdGUodD0wLHM9MCxlPTUwMCxpPTEsbj0xKXtjb25zdCByPTIqTWF0aC5QSSplL3NhbXBsZVJhdGUsbD1NYXRoLnNpbihyKTtpPU1hdGgucG93KDEwLGkvMjApO2NvbnN0IHU9bC8oMippKSxjPU1hdGguY29zKHIpO2lmKHM9PT0wKXRoaXMuYjE9MS1jLHRoaXMuYjA9dGhpcy5iMS8yLHRoaXMuYjI9dGhpcy5iMCx0aGlzLmEwPTErdSx0aGlzLmExPS0yKmMsdGhpcy5hMj0xLXU7ZWxzZSBpZihzPT09MSl0aGlzLmIwPSgxK2MpLzIsdGhpcy5iMT0tKDErYyksdGhpcy5iMj10aGlzLmIwLHRoaXMuYTA9MSt1LHRoaXMuYTE9LTIqYyx0aGlzLmEyPTEtdTtlbHNlIGlmKHM9PT0yKXRoaXMuYjA9bC8yLHRoaXMuYjE9MCx0aGlzLmIyPS10aGlzLmIwLHRoaXMuYTA9MSt1LHRoaXMuYTE9LTIqYyx0aGlzLmEyPTEtdTtlbHNlIGlmKHM9PT0zKXRoaXMuYjA9MSx0aGlzLmIxPS0yKmMsdGhpcy5iMj0xLHRoaXMuYTA9MSt1LHRoaXMuYTE9LTIqYyx0aGlzLmEyPTEtdTtlbHNlIGlmKHM9PT00KXRoaXMuYjA9MS11LHRoaXMuYjE9LTIqYyx0aGlzLmIyPTErdSx0aGlzLmEwPTErdSx0aGlzLmExPS0yKmMsdGhpcy5hMj0xLXU7ZWxzZSBpZihzPT09NSl7Y29uc3QgYT1NYXRoLnBvdygxMCxuLzQwKTt0aGlzLmIwPTErdSphLHRoaXMuYjE9LTIqYyx0aGlzLmIyPTEtdSphLHRoaXMuYTA9MSt1L2EsdGhpcy5hMT0tMipjLHRoaXMuYTI9MS11L2F9ZWxzZSBpZihzPT09Nil7Y29uc3QgYT1NYXRoLnBvdygxMCxuLzQwKSxkPTIqTWF0aC5zcXJ0KGEpKnUsZj0oYS0xKSpjLHA9KGErMSkqYzt0aGlzLmIwPWEqKGErMS1mK2QpLHRoaXMuYjE9MiphKihhLTEtcCksdGhpcy5iMj1hKihhKzEtZi1kKSx0aGlzLmEwPWErMStmK2QsdGhpcy5hMT0tMiooYS0xK3ApLHRoaXMuYTI9YSsxK2YtZH1lbHNlIGlmKHM9PT03KXtjb25zdCBhPU1hdGgucG93KDEwLG4vNDApLGQ9MipNYXRoLnNxcnQoYSkqdSxmPShhLTEpKmMscD0oYSsxKSpjO3RoaXMuYjA9YSooYSsxK2YrZCksdGhpcy5iMT0tMiphKihhLTErcCksdGhpcy5iMj1hKihhKzErZi1kKSx0aGlzLmEwPWErMS1mK2QsdGhpcy5hMT0yKihhLTEtcCksdGhpcy5hMj1hKzEtZi1kfXRoaXMuYjAvPXRoaXMuYTAsdGhpcy5iMS89dGhpcy5hMCx0aGlzLmIyLz10aGlzLmEwLHRoaXMuYTEvPXRoaXMuYTAsdGhpcy5hMi89dGhpcy5hMCx0aGlzLmEwPTE7Y29uc3QgYj10aGlzLmIwKnQrdGhpcy5iMSp0aGlzLngxK3RoaXMuYjIqdGhpcy54Mi10aGlzLmExKnRoaXMueTEtdGhpcy5hMip0aGlzLnkyO3JldHVybiB0aGlzLngyPXRoaXMueDEsdGhpcy54MT10LHRoaXMueTI9dGhpcy55MSx0aGlzLnkxPWIsYn19Y29uc3QgTXQ9T2JqZWN0LmZyZWV6ZShPYmplY3QuZGVmaW5lUHJvcGVydHkoe19fcHJvdG9fXzpudWxsLEFEU1JOb2RlOnEsQXVkaW9JbjpsdCxBdWRpb05vZGU6byxCUEY6cnQsQmlxdWFkRmlsdGVyOnl0LEJyb3duTm9pc2VPc2M6VyxDQzpwdCxDTE9DS19QUFE6TSxDTE9DS19QUFM6TixDbGlwOnd0LENsb2NrOkYsQ2xvY2tEaXY6RCxDbG9ja091dDpMLERlbGF5OlYsRGlzdG9ydDpHLER1c3RPc2M6SyxGaWx0ZXI6bnQsRm9sZDp1dCxIb2xkOlIsSW1wdWxzZU9zYzpZLExhZzppdCxMY2dOb2lzZTpILE1pZGlDQzpidCxNaWRpRnJlcTpjdCxNaWRpR2F0ZTpvdCxNaWRpSW46bSxNaWRpVmVsOmR0LE5vaXNlT3NjOmosT3V0cHV0OkIsUGljazptdCxQaW5rTm9pc2U6WCxQdWxzZU9zYzp6LFJlbWFwOlN0LFNhd09zYzpKLFNjb3BlOmV0LFNlcXVlbmNlOmd0LFNpZGVjaGFpbkNvbXByZXNzb3I6dHQsU2lnbmFsOmZ0LFNpbmVPc2M6USxTbGV3Omh0LFNsaWRlOmF0LFRyaU9zYzpzdCxUcmlnOnZ0LFphd09zYzpafSxTeW1ib2wudG9TdHJpbmdUYWcse3ZhbHVlOiJNb2R1bGUifSkpLHg9bmV3IE1hcChPYmplY3QuZW50cmllcyhNdCkpO2NsYXNzIE90e2NvbnN0cnVjdG9yKHQscyl7Zyh0PT00OGUzKSx0aGlzLnNhbXBsZVJhdGU9dCx0aGlzLnBsYXlQb3M9MCx0aGlzLnNlbmQ9cyx0aGlzLnVuaXRzPVtdLHRoaXMudW5pdElEPTAsdGhpcy5mYWRlVGltZT0uMDEsdGhpcy5tYXhVbml0cz0xLHRoaXMucT1bXX1mYWRlT3V0VW5pdCh0KXt0LmZhZGVPdXQodGhpcy5wbGF5UG9zLHRoaXMuZmFkZVRpbWUpLHRoaXMuZnJlZVVuaXQodC5pZCx0aGlzLmZhZGVUaW1lKX1mYWRlT3V0VW5pdEJ5SWQodCl7Y29uc3Qgcz10aGlzLnVuaXRzLmZpbmQoZT0+ZS5pZD09PXQpO3MmJnRoaXMuZmFkZU91dFVuaXQocyl9ZmFkZU91dEFsbFVuaXRzKCl7dGhpcy51bml0cy5mb3JFYWNoKHQ9PnRoaXMuZmFkZU91dFVuaXQodCkpfWZhZGVPdXRPbGRVbml0cygpe2NvbnN0IHQ9dGhpcy51bml0cy5maWx0ZXIoZT0+ZS5hY3RpdmUpLHM9dC5sZW5ndGgtdGhpcy5tYXhVbml0cztzPD0wfHx0LnNsaWNlKDAscykuZm9yRWFjaChlPT50aGlzLmZhZGVPdXRVbml0KGUpKX1zdG9wKCl7dGhpcy5mYWRlT3V0QWxsVW5pdHMoKSx0aGlzLnNlbmQoe3R5cGU6IlNUT1AiLGZhZGVUaW1lOnRoaXMuZmFkZVRpbWV9KX1zcGF3blVuaXQodCxzKXtjb25zdCBlPW5ldyB4dCh0aGlzLnVuaXRJRCsrLHQsdGhpcy5zYW1wbGVSYXRlLHRoaXMuc2VuZCk7dGhpcy51bml0cy5wdXNoKGUpLGUuZmFkZUluKHRoaXMucGxheVBvcyx0aGlzLmZhZGVUaW1lKSx0aGlzLmZhZGVPdXRPbGRVbml0cygpLGNvbnNvbGUubG9nKGBzcGF3biB1bml0ICR7ZS5pZH0sIHVuaXRzIGFsaXZlOiAke3RoaXMudW5pdHMubGVuZ3RofWApLHMmJnRoaXMuc2NoZWR1bGVNZXNzYWdlKHttc2c6e3R5cGU6IkZBREVfT1VUX1VOSVQiLGlkOmUuaWR9LHRpbWU6c30pfWZyZWVVbml0KHQscyl7aWYocyl7dGhpcy5zY2hlZHVsZU1lc3NhZ2Uoe21zZzp7dHlwZToiRlJFRV9VTklUIixpZDp0fSx0aW1lOnN9KTtyZXR1cm59Y29uc3QgZT10aGlzLnVuaXRzLmxlbmd0aDt0aGlzLnVuaXRzPXRoaXMudW5pdHMuZmlsdGVyKGk9PmkuaWQhPT10KSxlPnRoaXMudW5pdHMubGVuZ3RoJiZjb25zb2xlLmxvZyhgZnJlZSB1bml0ICR7dH0sIHVuaXRzIGFsaXZlOiAke3RoaXMudW5pdHMubGVuZ3RofWApfXBhcnNlTXNnKHQpe3N3aXRjaCh0LnR5cGUpe2Nhc2UiU1BBV05fVU5JVCI6dGhpcy5zcGF3blVuaXQodC51bml0LHQuZHVyYXRpb24pO2JyZWFrO2Nhc2UiRlJFRV9VTklUIjp0aGlzLmZyZWVVbml0KHQuaWQpO2JyZWFrO2Nhc2UiRkFERV9PVVRfVU5JVCI6dGhpcy5mYWRlT3V0VW5pdEJ5SWQodC5pZCk7YnJlYWs7Y2FzZSJOT1RFX09OIjp0aGlzLm5vdGVPbih0KTticmVhaztjYXNlIkNDIjp0aGlzLm1pZGlDQyh0KTticmVhaztjYXNlIlNFVF9DT05UUk9MIjp0aGlzLnNldENvbnRyb2wodCk7YnJlYWs7Y2FzZSJGQURFX1RJTUUiOnRoaXMuZmFkZVRpbWU9TnVtYmVyKHQuZmFkZVRpbWUpO2JyZWFrO2Nhc2UiTUFYX1VOSVRTIjp0aGlzLm1heFVuaXRzPU51bWJlcih0Lm1heFVuaXRzKTticmVhaztjYXNlIlNUT1AiOnRoaXMuc3RvcCgpO2JyZWFrO2Nhc2UiU0VUX1VHRU4iOnRoaXMuYWRkVWdlbih0LmNsYXNzTmFtZSx0LnVnZW4pO2JyZWFrO2Nhc2UiU0NIRURVTEVfTVNHIjp0aGlzLnNjaGVkdWxlTWVzc2FnZSh0KTticmVhaztjYXNlIkJBVENIX01TRyI6dC5tZXNzYWdlcy5mb3JFYWNoKHM9PnRoaXMucGFyc2VNc2cocykpO2JyZWFrO2RlZmF1bHQ6dGhyb3cgbmV3IFR5cGVFcnJvcihgdW5rbm93biBtZXNzYWdlIHR5cGUgJHt0LnR5cGV9YCl9fW5vdGVPbih0KXt0aGlzLnVuaXRzLmZvckVhY2gocz0+cy5ub3RlT24odCkpfW1pZGlDQyh0KXt0aGlzLnVuaXRzLmZvckVhY2gocz0+cy5taWRpQ0ModCkpfXNldENvbnRyb2wodCl7dGhpcy51bml0cy5mb3JFYWNoKHM9PnMuc2V0Q29udHJvbCh0KSl9c2NoZWR1bGVNZXNzYWdlKHQpe2lmKHQudGltZT10aGlzLnBsYXlQb3MrdC50aW1lLCF0aGlzLnEubGVuZ3RoKXt0aGlzLnEucHVzaCh0KTtyZXR1cm59bGV0IHM9MDtmb3IoO3M8dGhpcy5xLmxlbmd0aCYmdGhpcy5xW3NdLnRpbWU8dC50aW1lOylzKys7dGhpcy5xLnNwbGljZShzLDAsdCl9Z2VuU2FtcGxlKHQpe2Zvcig7dGhpcy5xLmxlbmd0aD4wJiZ0aGlzLnFbMF0udGltZTw9dGhpcy5wbGF5UG9zOyl0aGlzLnBhcnNlTXNnKHRoaXMucVswXS5tc2cpLHRoaXMucS5zaGlmdCgpO2lmKCF0aGlzLnVuaXRzLmxlbmd0aClyZXR1cm5bMCwwXTtjb25zdCBzPVswLDBdO2ZvcihsZXQgZT0wO2U8dGhpcy51bml0cy5sZW5ndGg7ZSsrKXtjb25zdCBpPXRoaXMudW5pdHNbZV0sbj1pLmdldExldmVsKHRoaXMucGxheVBvcyk7aS5nZW5TYW1wbGUodGhpcy5wbGF5UG9zLGkubm9kZXMsdCxpLnJlZ2lzdGVycyxpLm91dHB1dHMsaS5zb3VyY2VzKSxzWzBdKz1pLm91dHB1dHNbMF0qbixzWzFdKz1pLm91dHB1dHNbMV0qbn1yZXR1cm4gdGhpcy5wbGF5UG9zKz0xLzQ4ZTMsc31hZGRVZ2VuKHQscyl7Y29uc3QgZT1uZXcgRnVuY3Rpb24oYCR7c307cmV0dXJuICR7dH1gKSgpO3guc2V0KHQsZSl9fWNsYXNzIHh0e2NvbnN0cnVjdG9yKHQscyxlLGkpe3RoaXMuaWQ9dCx0aGlzLnNhbXBsZVJhdGU9ZSx0aGlzLnNlbmQ9aSx0aGlzLm5vZGVzPVtdLHRoaXMuYWN0aXZlPSEwO2ZvcihsZXQgciBpbiBzLnVnZW5zKXtjb25zdCBsPXMudWdlbnNbcl07aWYoeC5oYXMobC50eXBlKSl7Y29uc3QgdT14LmdldChsLnR5cGUpLGM9TnVtYmVyKHIpO3RoaXMubm9kZXNbY109bmV3IHUoYyxsLHRoaXMuc2FtcGxlUmF0ZSx0aGlzLnNlbmQpfWVsc2UgY29uc29sZS53YXJuKGB1bmtub3duIHVnZW4gIiR7bC50eXBlfSJgKX10aGlzLnJlZ2lzdGVycz1uZXcgQXJyYXkocy5yZWdpc3RlcnMpLmZpbGwoMCk7bGV0IG49MTY7dGhpcy5vdXRwdXRzPW5ldyBBcnJheShuKS5maWxsKDApLHRoaXMuc291cmNlcz1uZXcgQXJyYXkobikuZmlsbCgwKSxzLnNyYz1gby5maWxsKDApOyAvLyByZXNldCBvdXRwdXRzCmArcy5zcmMsdGhpcy5nZW5TYW1wbGU9bmV3IEZ1bmN0aW9uKCJ0aW1lIiwibm9kZXMiLCJpbnB1dCIsInIiLCJvIiwicyIscy5zcmMpfW5vdGVPbih0KXt2YXIgdSxjLGI7Y29uc3R7Y2hhbm5lbDpzLG5vdGU6ZSx2ZWxvY2l0eTppfT10LG49dGhpcy5ub2Rlcy5maWx0ZXIoYT0+YS50eXBlPT09Im1pZGlmcmVxIiYmKGEuY2hhbm5lbD09PS0xfHxhLmNoYW5uZWw9PT1zKSkscj10aGlzLm5vZGVzLmZpbHRlcihhPT5hLnR5cGU9PT0ibWlkaWdhdGUiJiYoYS5jaGFubmVsPT09LTF8fGEuY2hhbm5lbD09PXMpKSxsPXRoaXMubm9kZXMuZmlsdGVyKGE9PmEudHlwZT09PSJtaWRpdmVsIiYmKGEuY2hhbm5lbD09PS0xfHxhLmNoYW5uZWw9PT1zKSk7aWYoaT4wKXtsZXQgYT1uLmZpbmQocD0+cC5pc0ZyZWUoKSl8fG5bMF0sZD1yLmZpbmQocD0+cC5pc0ZyZWUoKSl8fHJbMF0sZj1sLmZpbmQocD0+cC5pc0ZyZWUoKSl8fGxbMF07YT09bnVsbHx8YS5ub3RlT24oZSxpKSxkPT1udWxsfHxkLm5vdGVPbihlLGkpLGY9PW51bGx8fGYubm90ZU9uKGUsaSl9ZWxzZSh1PW4uZmluZChhPT5hLm5vdGU9PT1lKSk9PW51bGx8fHUubm90ZU9mZigpLChjPXIuZmluZChhPT5hLm5vdGU9PT1lKSk9PW51bGx8fGMubm90ZU9mZigpLChiPWwuZmluZChhPT5hLm5vdGU9PT1lKSk9PW51bGx8fGIubm90ZU9mZigpfW1pZGlDQyh0KXtjb25zdHtjaGFubmVsOnMsY2M6ZSx2YWx1ZTppfT10O3RoaXMubm9kZXMuZm9yRWFjaChuPT57bi50eXBlPT09Im1pZGljYyImJihuLmNoYW5uZWw9PT0tMXx8bi5jaGFubmVsPT09cykmJm4uY2NudW1iZXI9PT1lJiZuLnNldFZhbHVlKGkpfSl9c2V0Q29udHJvbCh0KXtjb25zdHt2YWx1ZTpzLGlkOmV9PXQsaT10aGlzLm5vZGVzLmZpbmQobj0+bi50eXBlPT09ImNjIiYmbi5pZD09PWUpO2kmJmkuc2V0VmFsdWUocyl9Z2V0TGV2ZWwodCl7cmV0dXJuIHRoaXMuZmFkZVN0YXJ0PT09dm9pZCAwPzA6dGhpcy5hY3RpdmU/UygodC10aGlzLmZhZGVTdGFydCkvdGhpcy5mYWRlVGltZSwwLC4zKTpTKCh0LXRoaXMuZmFkZVN0YXJ0KS90aGlzLmZhZGVUaW1lLHRoaXMuZmFkZUZyb20sMCl9ZmFkZUluKHQscyl7dGhpcy5mYWRlU3RhcnQ9dCx0aGlzLmZhZGVUaW1lPXN9ZmFkZU91dCh0LHMpe3RoaXMuZmFkZVRpbWU9cyx0aGlzLmZhZGVGcm9tPXRoaXMuZ2V0TGV2ZWwodCksdGhpcy5hY3RpdmU9ITEsdGhpcy5mYWRlU3RhcnQ9dH1pc0RvbmUodCl7cmV0dXJuIXRoaXMuYWN0aXZlJiZ0aGlzLmdldExldmVsKHQpPT09MH19Y2xhc3MgVHQgZXh0ZW5kcyBBdWRpb1dvcmtsZXRQcm9jZXNzb3J7Y29uc3RydWN0b3IoKXtzdXBlcigpLHRoaXMucG9ydC5vbm1lc3NhZ2U9dGhpcy5vbm1lc3NhZ2UuYmluZCh0aGlzKSx0aGlzLmF1ZGlvR3JhcGg9bmV3IE90KDQ4ZTMsdGhpcy5wb3J0LnBvc3RNZXNzYWdlLmJpbmQodGhpcy5wb3J0KSl9b25tZXNzYWdlKHQpe2xldCBzPXQuZGF0YTt0aGlzLmF1ZGlvR3JhcGgucGFyc2VNc2cocyl9cHJvY2Vzcyh0LHMsZSl7Y29uc3QgaT1zWzBdLG49dFswXVswXSxyPWlbMF0sbD1pWzFdO2ZvcihsZXQgdT0wO3U8ci5sZW5ndGg7dSsrKXtsZXRbYyxiXT10aGlzLmF1ZGlvR3JhcGguZ2VuU2FtcGxlKG4/blt1XTowKTtyW3VdPWMsbFt1XT1ifXJldHVybiEwfX1yZWdpc3RlclByb2Nlc3Nvcigic2FtcGxlLWdlbmVyYXRvciIsVHQpfSkoKTsK", ye = "data:text/javascript;base64,KGZ1bmN0aW9uKCl7InVzZSBzdHJpY3QiO2NsYXNzIG4gZXh0ZW5kcyBBdWRpb1dvcmtsZXRQcm9jZXNzb3J7c3RhdGljIGdldCBwYXJhbWV0ZXJEZXNjcmlwdG9ycygpe3JldHVyblt7bmFtZToiaXNSZWNvcmRpbmciLGRlZmF1bHRWYWx1ZTowfV19Y29uc3RydWN0b3IoKXtzdXBlcigpLHRoaXMuX2J1ZmZlclNpemU9MjA0OCx0aGlzLl9idWZmZXI9bmV3IEZsb2F0MzJBcnJheSh0aGlzLl9idWZmZXJTaXplKSx0aGlzLl9pbml0QnVmZmVyKCl9X2luaXRCdWZmZXIoKXt0aGlzLl9ieXRlc1dyaXR0ZW49MH1faXNCdWZmZXJFbXB0eSgpe3JldHVybiB0aGlzLl9ieXRlc1dyaXR0ZW49PT0wfV9pc0J1ZmZlckZ1bGwoKXtyZXR1cm4gdGhpcy5fYnl0ZXNXcml0dGVuPT09dGhpcy5fYnVmZmVyU2l6ZX1fYXBwZW5kVG9CdWZmZXIoZSl7dGhpcy5faXNCdWZmZXJGdWxsKCkmJnRoaXMuX2ZsdXNoKCksdGhpcy5fYnVmZmVyW3RoaXMuX2J5dGVzV3JpdHRlbl09ZSx0aGlzLl9ieXRlc1dyaXR0ZW4rPTF9X2ZsdXNoKCl7bGV0IGU9dGhpcy5fYnVmZmVyO3RoaXMuX2J5dGVzV3JpdHRlbjx0aGlzLl9idWZmZXJTaXplJiYoZT1lLnNsaWNlKDAsdGhpcy5fYnl0ZXNXcml0dGVuKSksdGhpcy5wb3J0LnBvc3RNZXNzYWdlKHtldmVudFR5cGU6ImRhdGEiLGF1ZGlvQnVmZmVyOmV9KSx0aGlzLl9pbml0QnVmZmVyKCl9X3JlY29yZGluZ1N0b3BwZWQoKXt0aGlzLnBvcnQucG9zdE1lc3NhZ2Uoe2V2ZW50VHlwZToic3RvcCJ9KX1wcm9jZXNzKGUsbyxoKXtjb25zdCBpPWguaXNSZWNvcmRpbmcsZj1vWzBdLHM9ZVswXSx1PWZbMF0sXz1mWzFdO2xldCByPSExO2ZvcihsZXQgdD0wO3Q8dS5sZW5ndGg7dCsrKXQ8aS5sZW5ndGgmJihyPWlbdF09PT0xKSwhciYmIXRoaXMuX2lzQnVmZmVyRW1wdHkoKSYmKHRoaXMuX2ZsdXNoKCksdGhpcy5fcmVjb3JkaW5nU3RvcHBlZCgpKSxyJiYodGhpcy5fYXBwZW5kVG9CdWZmZXIoc1swXVt0XSksdGhpcy5fYXBwZW5kVG9CdWZmZXIoc1sxXVt0XSkpLHVbdF09c1swXVt0XSxfW3RdPXNbMV1bdF07cmV0dXJuITB9fXJlZ2lzdGVyUHJvY2Vzc29yKCJyZWNvcmRlciIsbil9KSgpOwo=";
function fe(e, t, i) {
  if (e.length < 1)
    return;
  e[0];
  const n = 3, l = 32, o = e.map((X) => X.length).reduce((X, z) => X + z, 0), d = l / 8, G = i * d, p = 44, m = new ArrayBuffer(p + o * d), r = new DataView(m);
  V(r, 0, "RIFF"), r.setUint32(4, 36 + o * d, !0), V(r, 8, "WAVE"), V(r, 12, "fmt "), r.setUint32(16, 16, !0), r.setUint16(20, n, !0), r.setUint16(22, i, !0), r.setUint32(24, t, !0), r.setUint32(28, t * G, !0), r.setUint16(32, G, !0), r.setUint16(34, l, !0), V(r, 36, "data"), r.setUint32(40, o * d, !0);
  let R = 44;
  for (const X of e)
    ge(r, R, X), R += X.length * d;
  return m;
}
function V(e, t, i) {
  for (let n = 0; n < i.length; n++)
    e.setUint8(t + n, i.charCodeAt(n));
}
function ge(e, t, i) {
  for (var n = 0; n < i.length; n++, t += 4)
    e.setFloat32(t, i[n], !0);
}
const k = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Node: c,
  compile: T,
  evaluate: j,
  exit: J,
  exportModule: ce,
  getInletName: oe,
  getNode: F,
  module: g,
  n: f,
  node: x,
  nodeRegistry: y,
  outputType: Y,
  polyType: Z,
  register: u,
  registerNode: a
}, Symbol.toStringTag, { value: "Module" }));
let Xe = (e) => `Math.sin(${e})`, Ze = (e) => `Math.cos(${e})`, be = (e) => `Math.tan(${e})`, xe = (e) => `Math.asin(${e})`, Re = (e) => `Math.acos(${e})`, Le = (e) => `Math.atan(${e})`, B = (e, t, i) => `${e} = ${t};${i ? ` /* ${i} */` : ""}`, w = (e, ...t) => B(
  e.name,
  `nodes[${e.ugenIndex}].update(${t.join(",")})`,
  e.node.type
), Me = (e) => `(2 ** ((${e} - 69) / 12) * 440)`, ze = (e, t) => `${e} ** ${t}`, Ve = (e) => `Math.exp(${e})`, We = (e) => `Math.log(${e})`, Ye = (e, t) => `${e}%${t}`, Ne = (e) => `Math.abs(${e})`, He = (e) => `Math.round(${e})`, Se = (e) => `Math.floor(${e})`, Te = (e) => `Math.sign(${e})`, we = (e) => `Math.ceil(${e})`, Ke = (e, t) => `Math.min(${e}, ${t})`, Ce = (e, t) => `Math.max(${e}, ${t})`, ve = (e, t) => `[${e}, ${t}]`, L = (e) => `${e}[0]`, Ie = (e) => `${e}[1]`, Ue = (e, t) => `(${L(e)} < ${L(t)} ? ${e} : ${t})`, ke = (e, t) => `(${L(e)} > ${L(t)} ? ${e} : ${t})`;
const Pe = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  abs: Ne,
  ceil: we,
  def: B,
  defAcos: Re,
  defAsin: xe,
  defAtan: Le,
  defCos: Ze,
  defSin: Xe,
  defTan: be,
  defUgen: w,
  exp: Ve,
  floor: Se,
  log: We,
  max: Ce,
  midinote: Me,
  min: Ke,
  mod: Ye,
  pair_a: L,
  pair_a_max: ke,
  pair_a_min: Ue,
  pair_b: Ie,
  pair_make: ve,
  pow: ze,
  round: He,
  sign: Te
}, Symbol.toStringTag, { value: "Module" }));
class Fe {
  constructor(t = null) {
    this.ugens = /* @__PURE__ */ new Map(), this.outputNode = t;
  }
  async spawn(t, i) {
    this.graph = t;
    const { src: n, ugens: l, registers: o } = t.compile({
      log: !1
    });
    !this.mouse && n.includes("mouse") && this.initMouse(), !this.midiInited && l.some((d) => d.type.startsWith("Midi")) && this.initMidi(), !this.audioIn && l.some((d) => d.type === "AudioIn") && await this.initAudioIn(), this.sendCustomUgens(), this.send({
      type: "SPAWN_UNIT",
      unit: { src: n, ugens: l, registers: o },
      duration: i
      // experimental
    });
  }
  // ugen is expected to be a class
  registerUgen(t) {
    this.ugens.set(t.name, t);
  }
  // custom ugens
  sendCustomUgens() {
    if (!this.ugens.size)
      return;
    let t = [];
    for (let [i, n] of this.ugens)
      t.push({
        type: "SET_UGEN",
        className: i,
        ugen: n + ""
      });
    this.send({
      type: "BATCH_MSG",
      messages: t
    });
  }
  scheduleMessage(t, i) {
    this.send({
      type: "SCHEDULE_MSG",
      msg: t,
      time: i
    });
  }
  setControl(t, i, n) {
    const l = {
      type: "SET_CONTROL",
      id: t,
      value: i
    };
    n ? this.send({ type: "SCHEDULE_MSG", time: n, msg: l }) : this.send(l);
  }
  // controls: { id, value, time }[]
  setControls(t) {
    const i = {
      type: "BATCH_MSG",
      messages: t.map((n) => {
        const l = { type: "SET_CONTROL", id: n.id, value: n.value };
        return n.time === void 0 ? l : {
          type: "SCHEDULE_MSG",
          time: n.time,
          msg: l
        };
      })
    };
    this.send(i);
  }
  async initAudioIn() {
    console.log("init audio input...");
    const t = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: !1,
        noiseSuppression: !1,
        autoGainControl: !1
      }
    });
    this.audioCtx.createMediaStreamSource(t).connect(this.audioWorklet);
  }
  initMidi() {
    console.log("init midi input..."), this.midiInited = !0, new me().on("midimessage", (i, n) => {
      const l = re(n);
      l && this.send(l);
    });
  }
  initMouse() {
    console.log("init mouse"), this.mouse = new he(), this.mouse.on("move", (t, i) => {
      this.setControl("mouseX", t), this.setControl("mouseY", i);
    });
  }
  /**
   * Send a message to the audio thread (audio worket)
   */
  send(t) {
    W(t instanceof Object), this.audioWorklet && this.audioWorklet.port.postMessage(t);
  }
  async init() {
    if (!this.audioCtx) {
      if (W(!this.audioCtx), this.audioCtx = this.outputNode?.context || new AudioContext({
        latencyHint: "interactive",
        sampleRate: 48e3
      }), await this.audioCtx.resume(), !this.audioCtx.audioWorklet)
        throw new Error(
          "Audio cannot be loaded: non-secure origin? (AudioContext.audioWorklet is undefined)"
        );
      await this.audioCtx.audioWorklet.addModule(Ge), await this.audioCtx.audioWorklet.addModule(ye), this.audioWorklet = new AudioWorkletNode(
        this.audioCtx,
        "sample-generator",
        {
          outputChannelCount: [2]
        }
      ), this.audioWorklet.port.onmessage = (t) => {
        const { id: i, time: n, type: l } = t.data;
        l === "SIGNAL_TRIGGER" ? this.graph.dfs((o) => {
          if (o.type === "signal" && o.id === i) {
            const d = o.callback(n, i);
            isNaN(d) ? d !== void 0 && console.warn(
              `expected number from "on" callback with id "${i}", got "${d}" instead.`
            ) : window.postMessage({
              type: "KABELSALAT_SET_CONTROL",
              value: d,
              id: i
            });
          }
          return o;
        }) : l === "STOP" ? setTimeout(() => this.destroy(), t.data.fadeTime * 1e3 + 200) : l === "SEND_SAMPLES" && this.graph.dfs((o) => (o.type !== "scope" || o.ins.length < 2 || o.ins[1].value !== i || window.postMessage({
          type: "KABELSALAT_UPDATE_SCOPE",
          samples: t.data.samples,
          channels: t.data.channels,
          channel: t.data.channel,
          id: i
        }), o));
      }, this.recorder = new window.AudioWorkletNode(this.audioCtx, "recorder"), this.audioWorklet.connect(this.recorder), this.sendCustomUgens(), this.recorder.connect(this.outputNode || this.audioCtx.destination), this.recorder.port.onmessage = (t) => {
        if (t.data.eventType === "data" && this.recordedBuffers.push(t.data.audioBuffer), t.data.eventType === "stop") {
          console.log("recording stopped");
          const i = fe(
            this.recordedBuffers,
            this.audioCtx.sampleRate,
            2
          );
          Je(i, "kabelsalat.wav", "audio/wav"), this.recordedBuffers = [];
        }
      }, this.recordOnPlay && this.record();
    }
  }
  destroy() {
    this.audioWorklet?.disconnect(), this.audioWorklet = null, this.recorder?.disconnect(), this.recorder = null, !this.outputNode && this.audioCtx?.close(), this.audioCtx = null;
  }
  /**
   * Stop audio playback
   */
  stop() {
    this.audioCtx && this.send({ type: "STOP" }), this.mouse?.detach();
  }
  record() {
    if (!this.audioCtx) {
      this.recordOnPlay = !0;
      return;
    }
    this.recordedBuffers = [], this.recorder.parameters.get("isRecording").setValueAtTime(1, 0), console.log("recording started");
  }
  stopRecording() {
    this.recordOnPlay = !1, this.audioCtx && this.recorder.parameters.get("isRecording").setValueAtTime(0, 0);
  }
  set fadeTime(t) {
    this.send({ type: "FADE_TIME", fadeTime: t });
  }
  set maxUnits(t) {
    this.send({ type: "MAX_UNITS", maxUnits: t });
  }
}
function Je(e, t, i) {
  const n = new Blob([e], { type: i }), l = document.createElement("a");
  l.href = window.URL.createObjectURL(n), l.download = t, l.click();
}
let je = 0, _i = u(
  "signal",
  (e, t) => {
    const i = je++, n = getNode("signal", e, i);
    return n.callback = t, n.id = i, n;
  },
  {
    ugen: "Signal",
    compile: ({ vars: [e, t], ...i }) => w(i, e, t, "time")
  }
), Qe = (e) => `sin(${e})`, Be = (e) => `cos(${e})`, Ee = (e) => `tan(${e})`, Oe = (e) => `asin(${e})`, $e = (e) => `acos(${e})`, De = (e) => `atan(${e})`, N = (e, t, i) => `${e} = ${t};${i ? ` /* ${i} */` : ""}`, Ae = (e, ...t) => {
  if (t.unshift(`nodes[${e.ugenIndex}]`), e.ugen === "Sequence" || e.ugen === "Pick") {
    const i = t.length - 2, n = `(float[${i}]){${t.slice(2).join(",")}}`;
    return N(
      e.name,
      `${e.ugen}_update(${t[0]}, ${t[1]}, ${i}, ${n})`,
      e.ugen
    );
  }
  return N(e.name, `${e.ugen}_update(${t.join(",")})`, e.ugen);
}, qe = (e) => `pow(2.0, ((${e} - 69.0) / 12.0)) * 440.0`, _e = (e, t) => `pow(${e}, ${t})`, et = (e) => `exp(${e})`, tt = (e) => `log(${e})`, it = (e, t) => `${e}>=${t}?${e}-${t}:${e}`, nt = (e) => `fabs(${e})`, st = (e, t) => `fmin(${e}, ${t})`, lt = (e, t) => `fmax(${e}, ${t})`, at = (e) => `fround(${e})`, ot = (e) => `floor(${e})`, dt = (e) => `ceil(${e})`, ct = (e, t) => `((pair) {${e}, ${t}})`, M = (e) => `${e}.a`, pt = (e) => `${e}.b`, ut = (e, t) => `(${M(e)} < ${M(t)} ? ${e} : ${t})`, mt = (e, t) => `(${M(e)} > ${M(t)} ? ${e} : ${t})`;
const rt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  abs: nt,
  ceil: dt,
  def: N,
  defAcos: $e,
  defAsin: Oe,
  defAtan: De,
  defCos: Be,
  defSin: Qe,
  defTan: Ee,
  defUgen: Ae,
  exp: et,
  floor: ot,
  log: tt,
  max: lt,
  midinote: qe,
  min: st,
  mod: it,
  pair_a: M,
  pair_a_max: mt,
  pair_a_min: ut,
  pair_b: pt,
  pair_make: ct,
  pow: _e,
  round: at
}, Symbol.toStringTag, { value: "Module" })), s = {
  js: Pe,
  c: rt
}, E = (e, t) => a(e, {
  ugen: t,
  compile: ({ vars: i, ...n }) => s[n.lang].defUgen(n, ...i)
});
let ht = u("time", (e) => new c("time", e), {
  tags: ["meta"],
  description: "Returns elapsed time in seconds",
  compile: ({ name: e, lang: t }) => s[t].def(e, "time")
}), Gt = u(
  "raw",
  (e, t) => new c("raw", t).withIns(f(e)),
  {
    ins: [
      { name: "in" },
      {
        name: "code",
        description: "expression with variable `t` being the elapsed time and `$input` the input."
      }
    ],
    tags: ["meta"],
    description: "Raw code node, expects floats between -1 and 1",
    compile: ({ vars: e, node: t, name: i }) => `let $input = ${e[0]}; 
const ${i} = (${t.value}); // raw`,
    examples: [
      `sine(4).range(.5,1)
.raw("(time*110%1*2-1)*$input")
.out()`
    ]
  }
), yt = u(
  "bytebeat",
  (e, t) => new c("bytebeat", t).withIns(f(e)),
  {
    ins: [
      { name: "t", description: "time in samples" },
      {
        name: "code",
        description: "bytebeat code with variable `t`"
      }
    ],
    tags: ["meta"],
    description: "Bytebeat node, expects numbers from 0 to 255",
    examples: [
      `time().mul(8000).bytebeat\`
// Fractalized Past
// by: lhphr
// from: https://dollchan.net/btb/res/3.html#69

(t>>10^t>>11)%5*((t>>14&3^t>>15&1)+1)*t%99+((3+(t>>14&3)-(t>>16&1))/3*t%99&64)
\`.out()`
    ],
    compile: ({ vars: e, node: t, name: i }) => `let t = ${e[0]}; 
const ${i} = ((${t.value}) & 255) / 127.5 - 1; // bytebeat`
  }
), ft = u(
  "floatbeat",
  (e, t) => new c("bytebeat", t).withIns(f(e)),
  {
    ins: [
      { name: "t", description: "time in samples" },
      {
        name: "code",
        description: "floatbeat code with variable `t`"
      }
    ],
    tags: ["meta"],
    description: "Raw code node, expects numbers from -1 to 1",
    compile: ({ vars: e, node: t, name: i }) => `let t = ${e[0]}; const ${i} = (${t.value}); // floatbeat`
  }
), gt = a("adsr", {
  ugen: "ADSRNode",
  tags: ["envelope"],
  description: "ADSR envelope",
  examples: [
    `impulse(1).perc(.5)
.adsr(.01, .1, .5, .1)
.mul(sine(220)).out()`
  ],
  ins: [
    { name: "gate", default: 0, description: "gate input" },
    { name: "att", default: 0.02, description: "attack time" },
    { name: "dec", default: 0.1, description: "decay time" },
    { name: "sus", default: 0.2, description: "sustain level" },
    { name: "rel", default: 0.1, description: "release time" }
  ],
  compile: ({
    vars: [e = 0, t = 0.02, i = 0.1, n = 0.2, l = 0.1],
    ...o
  }) => s[o.lang].defUgen(o, "time", e, t, i, n, l)
}), Xt = g(
  "ar",
  (e = 0, t = 0.02, i = 0.1) => e.adsr(t, 0, 1, i),
  {
    tags: ["envelope"],
    description: "AR envelope",
    examples: ["impulse(1).ad(.01, .1).mul(sine(220)).out()"],
    ins: [
      { name: "trig", default: 0, description: "gate input" },
      { name: "att", default: 0.02, description: "attack time" },
      { name: "rel", default: 0.1, description: "release time" }
    ]
  }
), Zt = g(
  "ad",
  (e = 0, t = 0.02, i = 0.1) => e.adsr(t, i, 0, i),
  {
    tags: ["envelope"],
    description: "AD envelope",
    examples: ["impulse(1).ad(.01, .1).mul(sine(220)).out()"],
    ins: [
      { name: "trig", default: 0, description: "gate input" },
      { name: "att", default: 0.02, description: "attack time" },
      { name: "dec", default: 0.1, description: "decay time" }
    ]
  }
), bt = a("clock", {
  ugen: "Clock",
  internal: !0,
  // impulse is the preferred way..
  tags: ["regular", "clock"],
  description: "Clock source, with tempo in BPM",
  examples: ["clock(120).clockdiv(16).mul(sine(220)).out()"],
  ins: [
    {
      name: "bpm",
      default: 120,
      description: "clock tempo in bpm (beats per minute)"
    }
  ],
  compile: ({ vars: [e = 120], ...t }) => s[t.lang].defUgen(t, e)
}), xt = a("clockdiv", {
  ugen: "ClockDiv",
  tags: ["clock", "trigger"],
  description: "Clock signal divider",
  examples: ["impulse(8).clockdiv(2).ad(.1,.1).mul(sine(220)).out()"],
  ins: [
    { name: "clock", default: 0, description: "clock input" },
    { name: "divisor", default: 2, description: "tempo divisor" }
  ],
  compile: ({ vars: [e = 0, t = 2], ...i }) => s[i.lang].defUgen(i, e, t)
}), Rt = a("distort", {
  ugen: "Distort",
  tags: ["fx", "distortion"],
  description: "Overdrive-style distortion",
  examples: [
    `sine(220)
.distort( saw(.5).range(0,1) )
.out()`
  ],
  ins: [
    { name: "in", default: 0 },
    { name: "amt", default: 0, description: "distortion amount" }
  ],
  compile: ({ vars: [e = 0, t = 0], ...i }) => s[i.lang].defUgen(i, e, t)
}), O = a("noise", {
  ugen: "NoiseOsc",
  tags: ["source", "noise"],
  description: "White noise source",
  examples: ["noise().mul(.25).out()"],
  ins: [
    {
      name: "next",
      default: 1,
      description: "if 0, the noise will hold the previous value. defaults to 1."
    }
  ],
  compile: ({ lang: e, vars: [t = 1], ...i }) => s[e].defUgen(i, t)
}), Lt = a("lcgnoise", {
  ugen: "LcgNoise",
  tags: ["source", "noise"],
  description: "Lcg white noise source.",
  examples: ["lcgnoise().mul(.25).out()"],
  ins: [
    {
      name: "next",
      default: 1,
      description: "if 0, the noise will hold the previous value. defaults to 1."
    },
    {
      name: "reset",
      default: 0,
      description: "if 1, the random number generator sequence will reset."
    }
  ],
  compile: ({ lang: e, vars: [t = 1, i = 0], ...n }) => s[e].defUgen(n, t, i)
}), Mt = a("pink", {
  ugen: "PinkNoise",
  tags: ["source", "noise"],
  description: "Pink noise source",
  examples: ["pink().mul(.5).out()"],
  ins: [],
  compile: ({ lang: e, ...t }) => s[e].defUgen(t)
}), zt = a("brown", {
  ugen: "BrownNoiseOsc",
  tags: ["source", "noise"],
  description: "Brown noise source",
  examples: ["brown().out()"],
  ins: [],
  compile: ({ lang: e, ...t }) => s[e].defUgen(t)
}), Vt = a("dust", {
  ugen: "DustOsc",
  tags: ["trigger", "noise", "source"],
  description: "Generates random impulses from 0 to +1.",
  examples: ["dust(200).out()"],
  ins: [
    { name: "density", default: 0, description: "average impulses per second" }
  ],
  compile: ({ vars: [e = 0], ...t }) => s[t.lang].defUgen(t, e)
}), $ = a("impulse", {
  ugen: "ImpulseOsc",
  tags: ["regular", "trigger"],
  description: "Regular single sample impulses (0 - 1)",
  examples: ["impulse(10).out()"],
  ins: [
    { name: "freq", default: 0 },
    { name: "phase", default: 0 }
  ],
  compile: ({ vars: [e = 0, t = 0], ...i }) => s[i.lang].defUgen(i, e, t)
}), Wt = a("saw", {
  ugen: "SawOsc",
  tags: ["regular", "waveform", "source"],
  description: "Sawtooth wave oscillator with anti aliasing",
  examples: ["saw(110).mul(.5).out()"],
  ins: [{ name: "freq", default: 0 }],
  compile: ({ vars: [e = 0], ...t }) => s[t.lang].defUgen(t, e)
}), Yt = a("zaw", {
  ugen: "ZawOsc",
  tags: ["regular", "waveform", "source"],
  description: "Sawtooth wave oscillator with sharp edges. Use saw for anti aliased variant.",
  examples: ["zaw(110).mul(.5).out()"],
  ins: [{ name: "freq", default: 0 }],
  compile: ({ vars: [e = 0], ...t }) => s[t.lang].defUgen(t, e)
}), Nt = a("sine", {
  tags: ["regular", "waveform", "source"],
  ugen: "SineOsc",
  description: "Sine wave oscillator",
  examples: ["sine(220).out()"],
  ins: [
    { name: "freq", default: 0 },
    { name: "sync", default: 0, description: "sync input" },
    { name: "phase", default: 0, description: "phase offset" }
  ],
  compile: ({ vars: [e = 0, t = 0, i = 0], ...n }) => s[n.lang].defUgen(n, e, t, i)
}), Ht = a("tri", {
  ugen: "TriOsc",
  tags: ["regular", "waveform", "source"],
  description: "Triangle wave oscillator",
  examples: ["tri(220).out()"],
  ins: [{ name: "freq", default: 0 }],
  compile: ({ vars: [e = 0], ...t }) => s[t.lang].defUgen(t, e)
}), St = a("pulse", {
  ugen: "PulseOsc",
  tags: ["regular", "waveform", "source"],
  description: "Pulse wave oscillator",
  examples: ["pulse(220, sine(.1).range(.1,.5)).mul(.5).out()"],
  ins: [
    { name: "freq", default: 0 },
    { name: "pw", default: 0.5, description: "pulse width 0 - 1" }
  ],
  compile: ({ vars: [e = 0, t = 0.5], ...i }) => s[i.lang].defUgen(i, e, t)
}), Tt = a("slide", {
  ugen: "Slide",
  tags: ["fx"],
  internal: !0,
  description: "Slide/portamento node",
  examples: [
    `impulse(2).seq(55,110,220,330)
.slide(4).sine().out()`
  ],
  ins: [
    { name: "in", default: 0 },
    { name: "rate", default: 1 }
  ],
  compile: ({ vars: [e = 0, t = 1], ...i }) => s[i.lang].defUgen(i, e, t)
}), wt = a("lag", {
  ugen: "Lag",
  tags: ["fx"],
  description: "Smoothes a signal. Good for slide / portamento effects.",
  examples: [
    `impulse(2).seq(220,330,440,550)
.lag(.4).sine().out()`
  ],
  ins: [
    { name: "in", default: 0 },
    { name: "rate", default: 1, description: "60 dB lag time in seconds" }
  ],
  compile: ({ vars: [e = 0, t = 1], ...i }) => s[i.lang].defUgen(i, e, t)
}), Kt = a("slew", {
  ugen: "Slew",
  tags: ["fx"],
  description: "Limits the slope of an input signal. The slope is expressed in units per second.",
  examples: ["pulse(800).slew(4000, 4000).out()"],
  ins: [
    { name: "in", default: 0 },
    {
      name: "up",
      default: 1,
      description: "Maximum upward slope in units per second"
    },
    {
      name: "dn",
      default: 1,
      description: "Maximum downward slope in units per second"
    }
  ],
  compile: ({ vars: [e = 0, t = 1, i = 1], ...n }) => s[n.lang].defUgen(n, e, t, i)
}), D = a("filter", {
  ugen: "Filter",
  tags: ["fx", "filter"],
  internal: !0,
  description: "Two-pole low-pass filter",
  examples: ["saw(55).lpf( sine(1).range(.4,.8) ).out()"],
  ins: [
    { name: "in", default: 0 },
    { name: "cutoff", default: 1 },
    { name: "reso", default: 0 }
  ],
  compile: ({ vars: [e = 0, t = 1, i = 0], ...n }) => s[n.lang].defUgen(n, e, t, i)
}), Ct = a("fold", {
  ugen: "Fold",
  tags: ["fx", "distortion", "limiter"],
  description: 'Distort incoming audio signal by "folding"',
  examples: [
    `sine(55)
.fold( sine(.5).range(0.2,4) )
.out()`
  ],
  ins: [
    { name: "in", default: 0 },
    { name: "rate", default: 0 }
  ],
  compile: ({ vars: [e = 0, t = 0], ...i }) => s[i.lang].defUgen(i, e, t)
}), vt = a("seq", {
  ugen: "Sequence",
  tags: ["sequencer"],
  description: "Trigger controlled sequencer",
  examples: [
    `impulse(2).seq(220,330,440,550)
.sine().out()`
  ],
  ins: [
    { name: "trig", default: 0 },
    { name: "step", default: 0, dynamic: !0, description: "step inputs" }
    // 1-Infinity of steps
  ],
  compile: ({ vars: e, ...t }) => s[t.lang].defUgen(t, ...e)
}), It = a("delay", {
  ugen: "Delay",
  tags: ["fx"],
  description: "Delay line node",
  examples: [
    `impulse(1).ad(.01,.2).mul(sine(220))
.add(x=>x.delay(.1).mul(.8)).out()`
  ],
  ins: [
    { name: "in", default: 0 },
    { name: "time", default: 0 }
  ],
  compile: ({ vars: [e = 0, t = 0], ...i }) => s[i.lang].defUgen(i, e, t)
}), Ut = a("hold", {
  ugen: "Hold",
  tags: ["fx"],
  description: "Sample and hold",
  examples: [
    `noise().hold(impulse(2))
.range(220,880).sine().out()`
  ],
  ins: [
    { name: "in", default: 0 },
    { name: "trig", default: 0 }
  ],
  compile: ({ vars: [e = 0, t = 0], ...i }) => s[i.lang].defUgen(i, e, t)
}), kt = a("midifreq", {
  ugen: "MidiFreq",
  tags: ["external", "midi"],
  description: "Outputs frequency of midi note in. Multiple instances will do voice allocation",
  examples: ["midifreq().sine().out()"],
  ins: [
    {
      name: "channel",
      default: -1,
      description: "Channel filter. Defaults to all channels"
    }
  ],
  compile: ({ vars: [e = -1], ...t }) => s[t.lang].defUgen(t, e)
}), Pt = a("midigate", {
  ugen: "MidiGate",
  tags: ["external", "midi"],
  description: "outputs gate of midi note in. Multiple instances will do voice allocation",
  examples: ["midigate().lag(1).mul(sine(220)).out()"],
  ins: [{ name: "channel", default: -1 }],
  compile: ({ vars: [e = -1], ...t }) => s[t.lang].defUgen(t, e)
}), Ft = a("midivel", {
  ugen: "MidiVel",
  tags: ["external", "midi"],
  description: "outputs velocity of midi note in. Multiple instances will do voice allocation",
  examples: [
    "midigate().ar(0.01,0.2).mul(saw(midifreq())).mul(midivel()).mul(.8).out()"
  ],
  ins: [{ name: "channel", default: -1 }],
  compile: ({ vars: [e = -1], ...t }) => s[t.lang].defUgen(t, e)
}), Jt = a("midicc", {
  ugen: "MidiCC",
  tags: ["external", "midi"],
  description: "Outputs bipolar value of given midi cc number. initValue can be set to be the output before getting first cc message.",
  examples: ["midicc(74).range(100,200).sine().out()"],
  ins: [
    { name: "ccnumber", default: -1 },
    { name: "channel", default: -1 },
    { name: "initValue", default: -1 }
    // could not name it "default" because syntax error
  ],
  compile: ({ vars: [e = -1, t = -1], ...i }) => s[i.lang].defUgen(i, e, t)
}), K = a("cc", {
  ugen: "CC",
  tags: ["external"],
  description: "CC control",
  ins: [
    { name: "id", default: 0 },
    { name: "value", default: 0 }
  ],
  compile: ({ vars: [e], ...t }) => s[t.lang].defUgen(t, e)
}), jt = a("audioin", {
  ugen: "AudioIn",
  tags: ["source", "external"],
  description: "External Audio Input, depends on your system input",
  examples: ["audioin().add(x=>x.delay(.1).mul(.8)).out()"],
  ins: [],
  compile: (e) => s[e.lang].defUgen(e, "input")
}), H = a("log", {
  tags: ["math"],
  description: "calculates the logarithm (base 10) of the input signal",
  ins: [{ name: "in" }],
  compile: ({ vars: [e = 0], name: t, lang: i }) => s[i].def(t, s[i].log(e))
}), A = a("exp", {
  tags: ["math"],
  description: "raises e to the power of the input signal",
  ins: [{ name: "in" }],
  compile: ({ vars: [e = 0], name: t, lang: i }) => s[i].def(t, s[i].exp(e))
}), Qt = a("pow", {
  tags: ["math"],
  description: "raises the input to the given power",
  ins: [{ name: "in" }, { name: "power" }],
  compile: ({ vars: [e = 0, t = 1], name: i, lang: n }) => s[n].def(i, s[n].pow(e, t))
}), q = a("sin", {
  tags: ["math"],
  description: "calculates the sine of the input signal",
  ins: [{ name: "in" }],
  compile: ({ vars: [e = 0], name: t, lang: i }) => s[i].def(t, s[i].defSin(e))
}), _ = a("cos", {
  tags: ["math"],
  description: "calculates the cosine of the input signal",
  ins: [{ name: "in" }],
  compile: ({ vars: [e = 0], name: t, lang: i }) => s[i].def(t, s[i].defCos(e))
}), Bt = a("tan", {
  tags: ["math"],
  description: "calculates the tan of the input signal",
  ins: [{ name: "in" }],
  compile: ({ vars: [e = 0], name: t, lang: i }) => s[i].def(t, s[i].defTan(e))
}), Et = a("acos", {
  tags: ["math"],
  description: "calculates the acos of the input signal",
  ins: [{ name: "in" }],
  compile: ({ vars: [e = 0], name: t, lang: i }) => s[i].def(t, s[i].defAcos(e))
}), Ot = a("asin", {
  tags: ["math"],
  description: "calculates the asin of the input signal",
  ins: [{ name: "in" }],
  compile: ({ vars: [e = 0], name: t, lang: i }) => s[i].def(t, s[i].defAsin(e))
}), $t = a("atan", {
  tags: ["math"],
  description: "calculates the atan of the input signal",
  ins: [{ name: "in" }],
  compile: ({ vars: [e = 0], name: t, lang: i }) => s[i].def(t, s[i].defAtan(e))
}), Dt = a("mul", {
  tags: ["math"],
  description: "Multiplies the given signals.",
  examples: ["sine(220).mul( sine(4).range(.25,1) ).out()"],
  ins: [{ name: "in", dynamic: !0 }],
  compile: ({ vars: e, name: t, lang: i }) => s[i].def(t, e.join(" * ") || 0)
}), C = a("add", {
  tags: ["math"],
  description: "sums the given signals",
  examples: ["n([0,3,7,10]).add(60).midinote().sine().mix(2).out()"],
  ins: [{ name: "in", dynamic: !0 }],
  compile: ({ vars: e, name: t, lang: i }) => s[i].def(t, e.join(" + ") || 0)
}), At = a("div", {
  tags: ["math"],
  description: "adds the given signals",
  ins: [{ name: "in", dynamic: !0 }],
  compile: ({ vars: e, name: t, lang: i }) => s[i].def(t, e.join(" / ") || 0)
}), qt = a("sub", {
  tags: ["math"],
  description: "subtracts the given signals",
  ins: [{ name: "in", dynamic: !0 }],
  compile: ({ vars: e, name: t, lang: i }) => s[i].def(t, e.join(" - ") || 0)
}), _t = a("mod", {
  tags: ["math"],
  description: "calculates the modulo",
  examples: ["add(x=>x.add(.003).mod(1)).out()"],
  ins: [{ name: "in" }, { name: "modulo" }],
  compile: ({ vars: e, name: t, lang: i }) => s[i].def(t, s[i].mod(...e) || 0)
}), ei = a("abs", {
  tags: ["math"],
  description: "returns the absolute value of the signal",
  ins: [{ name: "in" }],
  examples: ["sine(440).abs().out()"],
  compile: ({ vars: [e = 0], name: t, lang: i }) => s[i].def(t, s[i].abs(e))
}), ti = a("round", {
  tags: ["math"],
  description: "Rounds the signal to the nearest integer",
  ins: [{ name: "in" }],
  examples: ["sine(440.5).round().out()"],
  compile: ({ vars: [e = 0], name: t, lang: i }) => s[i].def(t, s[i].round(e))
}), ii = a("clamp", {
  tags: ["math"],
  description: "Clamps the signal to stay within the given range",
  ins: [{ name: "in" }, { name: "min" }, { name: "max" }],
  examples: ["sine(440.5).clamp(-.6,.6).out()"],
  compile: ({ vars: [e = 0, t = -1, i = 1], name: n, lang: l }) => {
    const o = s[l].min(t, i), d = s[l].max(t, i), G = s[l].min(s[l].max(e, o), d);
    return s[l].def(n, G);
  }
}), ni = a("floor", {
  tags: ["math"],
  description: "Rounds the signal down",
  ins: [{ name: "in" }],
  examples: ["sine(440.5).floor().out()"],
  compile: ({ vars: [e = 0], name: t, lang: i }) => s[i].def(t, s[i].floor(e))
}), si = a("ceil", {
  tags: ["math"],
  description: "Rounds the signal up",
  ins: [{ name: "in" }],
  examples: ["sine(440.5).ceil().out()"],
  compile: ({ vars: [e = 0], name: t, lang: i }) => s[i].def(t, s[i].ceil(e))
}), li = a("sign", {
  tags: ["math"],
  description: "Returns 1 if positive and -1 if negative. uses Math.sign",
  ins: [{ name: "in" }],
  examples: ["sine(440.5).ceil().out()"],
  compile: ({ vars: [e = 0], name: t, lang: i }) => s[i].def(t, s[i].sign(e))
}), ai = a("min", {
  tags: ["math"],
  description: "returns the minimum of the given signals",
  examples: [
    "impulse(4).apply(x => min(x.seq(0,3,2), x.seq(0,7,0,5,0)).add(48).midinote().sine()).out()"
  ],
  ins: [{ name: "in", dynamic: !0 }],
  compile: ({ vars: e, name: t, lang: i }) => s[i].def(t, e.reduce(s[i].min) || 0)
}), oi = a("max", {
  tags: ["math"],
  description: "returns the maximum of the given signals",
  examples: [
    "impulse(4).apply(x => max(x.seq(0,3,2), x.seq(0,7,0,5,0)).add(48).midinote().sine()).out()"
  ],
  ins: [{ name: "in", dynamic: !0 }],
  compile: ({ vars: e, name: t, lang: i }) => s[i].def(t, e.reduce(s[i].max) || 0)
}), di = a("argmin", {
  tags: ["math"],
  description: "returns the index of the minimum of the given signals",
  examples: [
    "argmin(saw(1), saw(3), saw(5)).mul(12).add(48).midinote().sine().out()"
  ],
  ins: [{ name: "in", dynamic: !0 }],
  compile: ({ vars: e, name: t, lang: i }) => s[i].def(
    t,
    s[i].pair_b(
      e.map(s[i].pair_make).reduce(s[i].pair_a_min)
    ) || 0
  )
}), ci = a("argmax", {
  tags: ["math"],
  description: "returns the index of the maximum of the given signals",
  examples: [
    "argmax(saw(1), saw(3), saw(5)).mul(12).add(48).midinote().sine().out()"
  ],
  ins: [{ name: "in", dynamic: !0 }],
  compile: ({ vars: e, name: t, lang: i }) => s[i].def(
    t,
    s[i].pair_b(
      e.map(s[i].pair_make).reduce(s[i].pair_a_max)
    ) || 0
  )
}), ee = a("greater", {
  tags: ["logic"],
  description: "returns 1 if input is greater then threshold",
  ins: [{ name: "in" }, { name: "threshold" }],
  examples: [
    `greater(sine(1),0)
.bipolar().range(100,200)
.sine().out()`
  ],
  compile: ({ vars: [e = 0, t = 0], name: i, lang: n }) => s[n].def(i, `${e} > ${t}`)
}), te = a("lower", {
  tags: ["logic"],
  description: "returns 1 if input is lower then threshold",
  ins: [{ name: "in" }, { name: "threshold" }],
  examples: [
    `lower(sine(1),0)
.bipolar().range(100,200)
.sine().out()`
  ],
  compile: ({ vars: [e = 0, t = 0], name: i, lang: n }) => s[n].def(i, `${e} < ${t}`)
}), pi = ee, ui = te, mi = a("xor", {
  tags: ["logic"],
  description: "returns 1 if exactly one of the inputs is 1",
  ins: [{ name: "a" }, { name: "b" }],
  compile: ({ vars: [e = 0, t = 0], name: i, lang: n }) => s[n].def(i, `${e} != ${t} ? 1 : 0`)
}), ri = a("and", {
  tags: ["logic"],
  description: "returns 1 if both inputs are 1",
  ins: [{ name: "a" }, { name: "b" }],
  compile: ({ vars: [e = 0, t = 0], name: i, lang: n }) => s[n].def(i, `${e} && ${t} ? 1 : 0`)
}), hi = a("or", {
  tags: ["logic"],
  description: "returns 1 if one or both inputs are 1",
  ins: [{ name: "a" }, { name: "b" }],
  compile: ({ vars: [e = 0, t = 0], name: i, lang: n }) => s[n].def(i, `${e} || ${t} ? 1 : 0`)
}), Gi = a("not", {
  tags: ["logic"],
  description: "returns 1 if input is 0, otherwise 0",
  ins: [{ name: "in" }],
  compile: ({ vars: [e = 0], name: t, lang: i }) => s[i].def(t, `(${e} === 0 ? 1 : 0)`)
}), yi = a("bool", {
  tags: ["logic"],
  description: "returns 1 signal is non zero. inspired by genish",
  ins: [{ name: "a" }],
  compile: ({ vars: [e = 0], name: t, lang: i }) => s[i].def(t, `(${e} === 0 ? 0 : 1)`)
}), fi = a("ifelse", {
  tags: ["logic"],
  description: "if control is 1, a is returned, otherwise b",
  ins: [{ name: "control" }, { name: "a" }, { name: "b" }],
  compile: ({ vars: [e = 0, t = 0, i = 0], name: n, lang: l }) => s[l].def(n, `(${e} === 1 ? ${t} : ${i})`),
  examples: ["ifelse(pulse(1), sine(220), sine(330)).out()"]
}), gi = a("range", {
  tags: ["math"],
  description: "Scales the incoming bipolar value to the given range.",
  examples: ["sine(.5).range(.25,1).mul(sine(440)).out()"],
  ins: [{ name: "in" }, { name: "min" }, { name: "max" }],
  compile: ({ vars: e, name: t, lang: i }) => {
    const [n, l, o, d = 1] = e, G = `((${n} + 1) * 0.5)`, p = d === 1 ? G : s[i].pow(G, d);
    return s[i].def(t, `${p} * (${o} - ${l}) + ${l}`);
  }
}), Xi = a("remap", {
  ugen: "Remap",
  tags: ["math"],
  description: "Remaps input from one value range to another",
  ins: [
    { name: "in" },
    { name: "inmin" },
    { name: "inmax" },
    { name: "outmin" },
    { name: "outmax" }
  ],
  // examples: [`sine(440).abs().out()`],
  compile: ({
    vars: [e = 0, t = -1, i = 1, n = -1, l = 1],
    ...o
  }) => s[o.lang].defUgen(o, e, t, i, n, l)
}), Zi = a("thru", {
  compile: ({ name: e, vars: t, lang: i }) => s[i].def(e, t[0], "thru")
}), bi = g(
  "rangex",
  (e, t, i) => {
    let n = H(t), l = H(i).sub(n), d = e.unipolar().mul(l).add(n);
    return A(d);
  },
  {
    tags: ["math"],
    description: "exponential range",
    ins: [{ name: "in" }, { name: "min" }, { name: "max" }],
    examples: ["sine([1,3]).rangex(100, 2e3).sine().out()"]
  }
), xi = a("midinote", {
  compile: ({ vars: [e], name: t, lang: i }) => s[i].def(t, s[i].midinote(e)),
  tags: ["math"],
  description: "convert midi number to frequency",
  ins: [{ name: "midi" }],
  examples: [
    `impulse(4).seq(0,3,7,12).add(60)
.midinote().sine().out()`
  ]
}), Ri = a("src", {
  internal: !0,
  compile: ({ vars: [e = 0], name: t, lang: i, ...n }) => s[i].def(t, n.getSource(e), `read source ${e}`)
}), Li = a("output", {
  internal: !0,
  ugen: "Output",
  compile: ({ vars: [e, t = 0], name: i, lang: n, ...l }) => {
    const o = l.getOutput(t), d = l.getSource(t);
    return [
      s[n].def(o, [o, e].join(" + "), `+ output ${t}`),
      s[n].def(d, o, `write source ${t}`)
    ].join(`
`);
  }
}), ie = a("poly"), ne = f(Math.PI), Mi = u(
  "fork",
  (e, t = 1) => ie(...Array.from({ length: t }, () => e.clone())),
  {
    ins: [{ name: "in" }, { name: "times" }],
    tags: ["multi-channel"],
    description: "split the signal into n channels",
    examples: ["dust(4).fork(2).adsr(.1).mul(sine(220)).out()"]
  }
), zi = g("perc", (e, t) => e.adsr(0, 0, 1, t), {
  tags: ["envelope"],
  description: "percussive envelope. usable with triggers or gates",
  ins: [{ name: "gate" }, { name: "release" }],
  examples: ["impulse(4).perc(.1).mul( pink() ).out()"]
}), Vi = g(
  "hpf",
  (e, t, i = 0) => e.sub(e.lpf(t, i)),
  {
    ins: [{ name: "in" }, { name: "cutoff" }, { name: "reso" }],
    description: "high pass filter",
    tags: ["fx", "filter"],
    examples: ["tri([220,331,442]).mix().hpf(sine(.5).range(0,.9)).out()"]
  }
), Wi = g("lpf", D, {
  ins: [{ name: "in" }, { name: "cutoff" }, { name: "reso" }],
  description: "low pass filter",
  tags: ["fx", "filter"],
  examples: ["saw(55).lpf( sine(1).range(.4,.8) ).out()"]
}), Yi = a("bpf", {
  ugen: "BPF",
  ins: [{ name: "in" }, { name: "cutoff" }, { name: "reso" }],
  description: "high pass filter",
  tags: ["fx", "filter"],
  compile: ({ vars: [e = 0, t = 1, i = 0], ...n }) => s[n.lang].defUgen(n, e, t, i)
}), Ni = g("lfnoise", (e) => O().hold($(e)), {
  ins: [{ name: "freq" }],
  description: "low frequency stepped noise.",
  tags: ["regular", "noise"],
  examples: ["lfnoise(4).range(200,800).sine().out()"]
}), Hi = g(
  "bipolar",
  (e) => f(e).mul(2).sub(1),
  {
    ins: [{ name: "in" }],
    description: "convert unipolar [0,1] signal to bipolar [-1,1]",
    tags: ["math"]
    // examples: [], // tbd
  }
), Si = g(
  "unipolar",
  (e) => f(e).add(1).div(2),
  {
    ins: [{ name: "in" }],
    description: "convert bipolar [-1,1] signal to unipolar [0,1]",
    tags: ["math"]
    // examples: [], // tbd
  }
), Ti = g(
  "pan",
  (e, t) => (t = f(t).add(1).mul(ne, 0.25), e.mul([_(t), q(t)])),
  {
    ins: [
      { name: "in" },
      {
        name: "pos",
        description: "bipolar position: -1 = left, 0 = center, 1 = right"
      }
    ],
    description: "pans signal to stereo position. splits signal path in 2",
    tags: ["multi-channel"],
    examples: ["sine(220).pan(sine(.25)).out()"]
  }
), wi = a("pick", {
  tags: ["multi-channel"],
  ugen: "Pick",
  description: "Pick",
  ins: [{ name: "index" }, { name: "inputs", dynamic: !0 }],
  description: "picks input of given index",
  examples: [
    `sine(.25).range(0,2).round()
.pick(...sine([220,330,440]).ins)
.out()`
  ],
  compile: ({ vars: e, ...t }) => s[t.lang].defUgen(t, ...e)
}), Ki = a("clip", {
  tags: ["fx"],
  ugen: "Clip",
  description: "Hard limits the signal between lo and hi.",
  ins: [{ name: "input" }, { name: "lo" }, { name: "hi" }],
  compile: ({ vars: [e = 0, t = -1, i = 1], ...n }) => s[n.lang].defUgen(n, e, t, i)
}), Ci = a("trig", {
  tags: ["trigger"],
  ugen: "Trig",
  description: "Emits a trigger impulse whenever the signal becomes positive. Useful to turn gates into triggers.",
  ins: [
    { name: "input", default: 0 },
    { name: "lo", default: -1 },
    { name: "hi", default: 1 }
  ],
  compile: ({ vars: [e = 0, t = -1, i = 1], ...n }) => s[n.lang].defUgen(n, e, t, i),
  examples: [
    `pulse(2)
.trig() // comment out to hear difference
.ar(.01,.2)
.mul(sine(200)).out()`
  ]
}), vi = a("qf", {
  tags: ["fx", "filter"],
  ugen: "BiquadFilter",
  description: "biQuad Filter.",
  ins: [
    { name: "input", default: 0 },
    {
      name: "type",
      default: 0,
      description: "filter type: 0 = lowpass, 1 = highpass, 2 = band pass, 3 = notch, 4 = allpass, 5 = peaking, 6 = lowshelf, 7 = highshelf"
    },
    { name: "freq", default: 500, description: "filter cutoff in Hz" },
    { name: "q", default: 1, description: "q factor" },
    { name: "gain", default: 1 }
  ],
  compile: ({ vars: e, ...t }) => s[t.lang].defUgen(t, ...e),
  examples: [
    `pink()
.qf(
 impulse(.5).seq(0,1,2,3,4,5,6,7), // type
  tri(0.5).rangex(100, 8000),  // freq
 10, // Q
 1, // gain (only relevant for types 5-7)
).div(4).out();`
  ]
}), Ii = u(
  "qlpf",
  (e, t, i = 10) => e.qf(0, t, i),
  {
    description: "biQuad Low Pass Filter",
    ins: [
      { name: "input" },
      { name: "freq" },
      { name: "q", description: "resonance" }
    ],
    tags: ["fx", "filter"],
    examples: [
      `pink().qlpf(
  tri(0.5).rangex(100, 8000), // cutoff freq
  10 // Q
).out()`
    ]
  }
), Ui = u(
  "qhpf",
  (e, t, i = 10) => e.qf(1, t, i),
  {
    description: "biQuad High pass filter",
    ins: [
      { name: "input" },
      { name: "freq" },
      { name: "q", description: "resonance" }
    ],
    tags: ["fx", "filter"],
    examples: [
      `pink().qhpf(
  tri(0.5).rangex(100, 8000), // cutoff freq
  10 // Q
).out()`
    ]
  }
), ki = u(
  "qbpf",
  (e, t, i = 10) => e.qf(2, t, i),
  {
    description: "biQuad Band Pass Filter",
    ins: [
      { name: "input" },
      { name: "freq" },
      { name: "q", description: "resonance" }
    ],
    tags: ["fx", "filter"],
    examples: [
      `pink().qbpf(
  tri(0.5).rangex(100, 8000), // cutoff freq
  10 // Q
).out()`
    ]
  }
), Pi = u(
  "qnf",
  (e, t, i = 10) => e.qf(3, t, i),
  {
    description: "biQuad Notch Filter",
    ins: [
      { name: "input" },
      { name: "freq" },
      { name: "q", description: "resonance" }
    ],
    tags: ["fx", "filter"],
    examples: [
      `pink().qnf(
  tri(0.5).rangex(100, 8000), // cutoff freq
  10 // Q
).out()`
    ]
  }
), Fi = u(
  "qapf",
  (e, t, i = 10) => e.qf(3, t, i),
  {
    description: "biQuad All Pass Filter",
    ins: [
      { name: "input" },
      { name: "freq" },
      { name: "q", description: "resonance" }
    ],
    tags: ["fx", "filter"],
    examples: [
      `impulse(1).qapf(
  tri(0.5).rangex(100, 8000), // cutoff freq
  10 // Q
).out()`
    ]
  }
), Ji = u(
  "split",
  (e, t) => e.type !== "poly" ? t([e]) : t(e.ins),
  {
    ins: [{ name: "input" }, { name: "fn" }],
    tags: ["multi-channel"],
    description: "apply fn to an array of signals, one for each channel in input",
    examples: ["sine([220,330,550]).split(chs => add(...chs)).out()"]
  }
), ji = u(
  "mix",
  (e, t = 1) => {
    if ([1, 2].includes(t) || (t = 2, console.warn("mix only supports 1 or 2 channels atm.. falling back to 2")), e.type !== "poly")
      return e;
    if (t === 2) {
      const i = e.ins.map((n, l, o) => {
        const G = (l / (o.length - 1) * 2 - 1 + 1) * Math.PI / 4;
        return n.mul([Math.cos(G), Math.sin(G)]).inherit(e);
      });
      return C(...i);
    }
    return e.ins = e.ins.map((i) => i.inherit(e)), x("mix").withIns(...e.ins);
  },
  {
    compile: ({ vars: e, name: t, lang: i }) => s[i].def(t, `(${e.join(" + ")})`),
    description: `mixes down multiple channels. Useful to make sure you get a mono or stereo signal out at the end. 
When mixing down to 2 channels, the input channels are equally distributed over the stereo image, e.g. 3 channels are panned [-1,0,1]`,
    ins: [
      { name: "in" },
      {
        name: "channels",
        default: 1,
        description: "how many channels to mix down to. Only supports 1 and 2"
      }
    ],
    tags: ["multi-channel"],
    examples: ["sine([220,330,440]).mix(2).out()"]
  }
);
c.prototype.feedback = function(e) {
  return this.add(e);
};
let Qi = (e) => C(e), Bi = f, Ei = f, Oi = g("mouseX", () => K("mouseX"), {
  ins: [],
  description: "X position of mouse, bipolar range",
  tags: ["external"],
  examples: ["mouseX.range(100,800).sine().out()"]
}), $i = Oi(), Di = g("mouseY", () => K("mouseY"), {
  ins: [],
  description: "Y position of mouse, bipolar range",
  tags: ["external"],
  examples: ["mouseY.range(800,100).sine().out()"]
}), Ai = Di(), qi = u(
  "scope",
  (e, t) => {
    let i = 1;
    e.type === "poly" && (i = e.ins.length);
    const n = getNode("scope", e, t, i);
    return n.type !== "poly" ? (n.ins.push({ type: "n", value: 0, ins: [] }), n) : (n.ins.forEach((l, o) => l.ins.push({ type: "n", value: o, ins: [] })), n);
  },
  {
    ugen: "Scope",
    description: "renders an an oscilloscope of the current point in the graph. expects values between -1 and 1. warning: this feature is still experimental! when using it, make sure to not switch tabs, as it might fry your browser.",
    compile: ({ vars: [e, t, i, n], ...l }) => w(l, e, t, i, n)
  }
);
const P = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  B: Bi,
  PI: ne,
  _: Ei,
  abs: ei,
  acos: Et,
  ad: Zt,
  add: C,
  adsr: gt,
  and: ri,
  ar: Xt,
  argmax: ci,
  argmin: di,
  asin: Ot,
  atan: $t,
  audioin: jt,
  bipolar: Hi,
  bool: yi,
  bpf: Yi,
  brown: zt,
  bytebeat: yt,
  cc: K,
  ceil: si,
  clamp: ii,
  clip: Ki,
  clock: bt,
  clockdiv: xt,
  cos: _,
  delay: It,
  distort: Rt,
  div: At,
  dust: Vt,
  exp: A,
  feedback: Qi,
  filter: D,
  floatbeat: ft,
  floor: ni,
  fold: Ct,
  fork: Mi,
  greater: ee,
  gt: pi,
  hold: Ut,
  hpf: Vi,
  ifelse: fi,
  impulse: $,
  lag: wt,
  lfnoise: Ni,
  log: H,
  lower: te,
  lpf: Wi,
  lt: ui,
  max: oi,
  midicc: Jt,
  midifreq: kt,
  midigate: Pt,
  midinote: xi,
  midivel: Ft,
  min: ai,
  mix: ji,
  mod: _t,
  mouseX: $i,
  mouseY: Ai,
  mul: Dt,
  noise: O,
  not: Gi,
  or: hi,
  output: Li,
  pan: Ti,
  perc: zi,
  pick: wi,
  pink: Mt,
  poly: ie,
  pow: Qt,
  pulse: St,
  qapf: Fi,
  qbpf: ki,
  qf: vi,
  qhpf: Ui,
  qlpf: Ii,
  qnf: Pi,
  range: gi,
  rangex: bi,
  raw: Gt,
  registerUgen: E,
  remap: Xi,
  rng: Lt,
  round: ti,
  saw: Wt,
  scope: qi,
  seq: vt,
  sign: li,
  sin: q,
  sine: Nt,
  slew: Kt,
  slide: Tt,
  split: Ji,
  src: Ri,
  sub: qt,
  tan: Bt,
  thru: Zi,
  time: ht,
  tri: Ht,
  trig: Ci,
  unipolar: Si,
  xor: mi,
  zaw: Yt
}, Symbol.toStringTag, { value: "Module" }));
class en {
  constructor({
    onToggle: t,
    onToggleRecording: i,
    beforeEval: n,
    transpiler: l,
    localScope: o = !1,
    outputNode: d = null
  } = {}) {
    this.outputNode = d, this.audio = new Fe(this.outputNode), this.onToggle = t, this.transpiler = l, this.onToggleRecording = i, this.beforeEval = n, this.localScope = o, typeof window < "u" && (o || (Object.assign(globalThis, k), Object.assign(globalThis, P), Object.assign(globalThis, U), Object.assign(globalThis, { repl: this })), window.addEventListener("message", (p) => {
      p.data.type === "KABELSALAT_SET_CONTROL" && this.audio.setControl(p.data.id, p.data.value);
    }));
    const G = this;
    c.prototype.spawn = function(p = [0, 1], m) {
      G.audio.spawn(this.output(p).exit(), m);
    };
  }
  registerUgen(t, i) {
    return this.audio.registerUgen(i), E(t, i.name);
  }
  evaluate(t) {
    this.localScope || (Object.assign(globalThis, { audio: this.audio }), Object.assign(globalThis, {
      addUgen: this.registerUgen.bind(this)
    }));
    let i;
    this.transpiler ? i = this.transpiler(t) : i = { output: t }, this.beforeEval?.(i);
    let n;
    return this.localScope && (n = {
      ...k,
      ...P,
      ...U,
      audio: this.audio,
      addUgen: this.registerUgen.bind(this),
      repl: this
    }), j(i.output, n);
  }
  async play(t) {
    await this.audio.init(), t.ins.length && this.audio.spawn(t), this.onToggle?.(!0);
  }
  run(t) {
    const i = this.evaluate(t);
    this.play(i);
  }
  stop() {
    this.stopRecording(), this.audio.stop(), this.onToggle?.(!1);
  }
  record() {
    this.audio.record(), this.onToggleRecording?.(!0);
  }
  stopRecording() {
    this.audio.stopRecording(), this.onToggleRecording?.(!1);
  }
}
export {
  Fe as AudioView,
  Bi as B,
  c as Node,
  ne as PI,
  en as SalatRepl,
  Ei as _,
  ei as abs,
  Et as acos,
  Zt as ad,
  C as add,
  gt as adsr,
  ri as and,
  Xt as ar,
  ci as argmax,
  di as argmin,
  Ot as asin,
  $t as atan,
  jt as audioin,
  Hi as bipolar,
  yi as bool,
  Yi as bpf,
  zt as brown,
  yt as bytebeat,
  K as cc,
  si as ceil,
  ii as clamp,
  Ki as clip,
  bt as clock,
  xt as clockdiv,
  T as compile,
  _ as cos,
  It as delay,
  Rt as distort,
  At as div,
  Vt as dust,
  j as evaluate,
  J as exit,
  A as exp,
  ce as exportModule,
  Qi as feedback,
  D as filter,
  ft as floatbeat,
  ni as floor,
  Ct as fold,
  Mi as fork,
  oe as getInletName,
  F as getNode,
  ee as greater,
  pi as gt,
  Ut as hold,
  Vi as hpf,
  fi as ifelse,
  $ as impulse,
  wt as lag,
  Ni as lfnoise,
  H as log,
  te as lower,
  Wi as lpf,
  ui as lt,
  oi as max,
  Jt as midicc,
  kt as midifreq,
  Pt as midigate,
  xi as midinote,
  Ft as midivel,
  ai as min,
  ji as mix,
  _t as mod,
  g as module,
  $i as mouseX,
  Ai as mouseY,
  Dt as mul,
  f as n,
  x as node,
  y as nodeRegistry,
  O as noise,
  Gi as not,
  hi as or,
  Li as output,
  Y as outputType,
  Ti as pan,
  zi as perc,
  wi as pick,
  Mt as pink,
  ie as poly,
  Z as polyType,
  Qt as pow,
  St as pulse,
  Fi as qapf,
  ki as qbpf,
  vi as qf,
  Ui as qhpf,
  Ii as qlpf,
  Pi as qnf,
  gi as range,
  bi as rangex,
  Gt as raw,
  u as register,
  a as registerNode,
  E as registerUgen,
  Xi as remap,
  Lt as rng,
  ti as round,
  Wt as saw,
  qi as scope,
  vt as seq,
  li as sign,
  _i as signal,
  q as sin,
  Nt as sine,
  Kt as slew,
  Tt as slide,
  Ji as split,
  Ri as src,
  qt as sub,
  Bt as tan,
  Zi as thru,
  ht as time,
  Ht as tri,
  Ci as trig,
  Si as unipolar,
  mi as xor,
  Yt as zaw
};
