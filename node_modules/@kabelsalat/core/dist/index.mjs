class o {
  constructor(e, n) {
    this.type = e, n !== void 0 && (this.value = n), this.ins = [];
  }
  static parseInput(e, n) {
    if (typeof e == "function") {
      if (!n)
        throw new Error(
          "tried to parse function input without without passing node.."
        );
      return e(n);
    }
    return typeof e == "object" ? e : typeof e == "number" && !isNaN(e) || typeof e == "string" ? g(e) : (console.log(
      `invalid input type "${typeof e}" for node of type "${n.type}", falling back to 0. The input was:`,
      e
    ), 0);
  }
}
const d = (t, e) => new o(t, e);
let p = /* @__PURE__ */ new Map();
const h = "poly", N = "exit";
o.prototype.inherit = function(t) {
  return t.inputOf && (this.inputOf = t.inputOf), t.outputOf && (this.outputOf = t.outputOf), this;
};
o.prototype.toObject = function() {
  return JSON.parse(JSON.stringify(this));
};
o.prototype.stringify = function() {
  return JSON.stringify(this, null, 2).replaceAll('"', "'");
};
function j(t, ...e) {
  let n = 1;
  if (e = e.map((i) => {
    if (Array.isArray(i)) {
      if (i.length === 1)
        return i[0];
      i = new o(h).withIns(...i);
    }
    if (typeof i == "function") {
      const r = i(new o("peek"));
      r.type === h && (n = Math.max(r.ins.length, n));
    }
    return i.type === h && (n = Math.max(i.ins.length, n)), i;
  }), n === 1) {
    const i = d(t);
    return i.withIns(...e.map((r) => o.parseInput(r, i)));
  }
  if (t === N) {
    const i = e.map((r) => r.type === h ? r.ins.map((l) => o.parseInput(l).inherit(l)) : r).flat();
    return d(N).withIns(...i);
  }
  const s = Array.from({ length: n }, (i, r) => {
    const l = new o(t), y = e.map((a) => a.type === h ? o.parseInput(a.ins[r % a.ins.length], l).inherit(a) : (a = o.parseInput(a, l), a.type === h && (a = a.ins[r]), a));
    return l.withIns(...y);
  });
  return new o(h).withIns(...s);
}
function C(t, e) {
  const n = p.get(t);
  return n?.ins?.[e] ? n.ins[e].name : "";
}
let M = (t, e) => w(t, (...n) => j(t, ...n), e);
p.set("register", {
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
let w = (t, e, n) => (n && p.set(t, n), o.prototype[t] = function(...s) {
  return e(this, ...s);
}, o.prototype["_" + t] = function() {
  return this;
}, e);
p.set("module", {
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
let T = 0;
function L(t, e, n) {
  return w(
    t,
    (...s) => {
      const i = T++;
      return s = s.map(
        (r, l) => o.parseInput(r).asModuleInput?.(t, i, l)
      ), e(...s).asModuleOutput?.(t, i);
    },
    n
  );
}
p.set("n", {
  tags: ["math"],
  description: "Constant value node. Turns a number into a Node.",
  ins: [{ name: "value", default: 0 }]
});
function g(t) {
  return Array.isArray(t) ? poly(...t.map((e) => g(e))) : typeof t == "object" ? t : d("n", t);
}
p.set("out", {
  tags: ["meta"],
  description: "Sends the node to the audio output"
});
p.set("withIns", {
  internal: !0,
  tags: ["innards"],
  description: "Sets the inputs of a node. Returns the node itself",
  ins: [{ name: "in", dynamic: !0 }]
});
o.prototype.withIns = function(...t) {
  return this.ins = t, this;
};
p.set("flatten", {
  internal: !0,
  tags: ["innards"],
  description: "Flattens the node to a list of all nodes in the graph, where each Node's ins are now indices"
});
o.prototype.flatten = function() {
  return F(this);
};
p.set("apply", {
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
o.prototype.apply = function(t) {
  return t(this);
};
p.set("clone", {
  internal: !0,
  tags: ["innards"],
  description: "Clones the node"
});
o.prototype.clone = function() {
  return new o(this.type, this.value).withIns(...this.ins);
};
p.set("map", {
  tags: ["meta"],
  description: "Applies the given function to all ins if it's poly node. Otherwise it applies the function to itself.",
  examples: [
    `n([110,220,330])
.map( freq=>freq.mul([1,1.007]).saw().mix() )
.mix(2).mul(.5).out()`
  ]
});
o.prototype.map = function(t) {
  return this.type !== "poly" ? t(this) : poly(...this.ins.map(t));
};
o.prototype.channel = function(t) {
  return this.type !== "poly" ? this : this.ins[t % this.ins.length];
};
p.set("select", {
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
o.prototype.select = function(t) {
  for (let e of this.ins) {
    if (e.type === t)
      return e;
    const n = e.select(t);
    if (n)
      return n;
  }
};
p.set("debug", {
  tags: ["meta"],
  description: "Logs the node to the console"
});
o.prototype.debug = function(t = (e) => e) {
  return console.log(t(this)), this;
};
function U(t) {
  const e = modules.get(t), n = Array.from(
    { length: e.length },
    (i, r) => d(`$INPUT${r}`)
  ), s = e(...n);
  return JSON.stringify(s, null, 2);
}
function F(t) {
  const e = [];
  return x(t, (n) => (e.push(n), n)), e.map((n) => {
    let s = {
      ...n,
      type: n.type,
      ins: n.ins.map((i) => e.indexOf(i) + "")
    };
    return n.value !== void 0 && (s.value = n.value), n.to !== void 0 && (s.to = e.indexOf(n.to)), s;
  });
}
let J = M("exit", { internal: !0 });
function _(t, e) {
  let n = [];
  const s = w("out", function(r, l = [0, 1]) {
    return n.push(r.output(l)), r;
  });
  return e ? (e.out = s, Function(...Object.keys(e), t)(...Object.values(e))) : (globalThis.out = s, Function(t)()), J(...n);
}
o.prototype.over = function(t) {
  return this.apply((e) => add(e, t(e)));
};
o.prototype.dfs = function(t, e) {
  return this.apply((n) => x(n, t, e));
};
o.prototype.apply2 = function(t) {
  return t(this, this);
};
let x = (t, e, n = []) => (t = e(t, n), n.push(t), t.ins = t.ins.map((s) => n.includes(s) ? s : x(s, e, n)), t);
o.prototype.asModuleInput = function(t, e, n) {
  return this.inputOf = this.inputOf || [], this.inputOf.push([t, e, n]), this;
};
o.prototype.asModuleOutput = function(t, e) {
  return this.outputOf = [t, e], this;
};
function R(t, e = {}) {
  const {
    log: n = !1,
    lang: s = "js",
    fallbackType: i = "thru",
    constType: r = "n",
    getRegister: l = (u) => `r[${u}]`,
    getOutput: y = (u) => `o[${u}]`,
    getSource: a = (u) => `s[${u}]`
  } = e;
  n && console.log("compile", t);
  const c = q(t);
  let O = [], v = (u) => c[u].type !== r ? l(u) : typeof c[u].value == "string" ? `"${c[u].value}"` : c[u].value;
  const m = [];
  for (let u in c) {
    const I = c[u], b = c[u].ins.map((A) => v(c.indexOf(A))), S = m.length;
    let f = p.get(I.type);
    f || (console.warn(
      `unhandled node type "${c[u].type}". falling back to "${i}"`
    ), f = p.get(i));
    const $ = {
      vars: b,
      node: I,
      nodes: c,
      id: u,
      ugenIndex: S,
      ugen: f.ugen,
      name: v(u),
      lang: s,
      getRegister: l,
      getOutput: y,
      getSource: a
    };
    f.compile && O.push(f.compile($)), f.ugen && m.push({ type: f.ugen, inputs: b });
  }
  const k = O.join(`
`);
  return n && (console.log("compiled code:"), console.log(k)), { src: k, ugens: m, registers: c.length };
}
o.prototype.compile = function(t) {
  return R(this, t);
};
function q(t) {
  const e = [], n = /* @__PURE__ */ new Set();
  function s(i) {
    if (!(typeof i != "object" || n.has(i))) {
      n.add(i);
      for (let r in i.ins)
        s(i.ins[r]);
      e.push(i);
    }
  }
  return s(t), e;
}
export {
  o as Node,
  R as compile,
  _ as evaluate,
  J as exit,
  U as exportModule,
  C as getInletName,
  j as getNode,
  L as module,
  g as n,
  d as node,
  p as nodeRegistry,
  N as outputType,
  h as polyType,
  w as register,
  M as registerNode
};
