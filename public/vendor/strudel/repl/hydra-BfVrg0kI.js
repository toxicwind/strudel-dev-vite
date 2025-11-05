import { g as r, P as f, Q as g, R as m, S as i } from "./index-C7dSFg4w.js";
let t, a;
async function u(e = {}) {
  if (t && JSON.stringify(t) !== JSON.stringify(e) && document.getElementById("hydra-canvas")?.remove(), t = e, !document.getElementById("hydra-canvas")) {
    const {
      src: c = "https://unpkg.com/hydra-synth",
      feedStrudel: d = !1,
      contextType: l = "webgl",
      pixelRatio: y = 1,
      pixelated: o = !0,
      ...s
    } = {
      detectAudio: !1,
      ...e
    }, { canvas: h } = r("hydra-canvas", { contextType: l, pixelRatio: y, pixelated: o });
    if (s.canvas = h, await import(
      /* @vite-ignore */
      c
    ), a = new Hydra(s), d) {
      const { canvas: n } = r();
      n.style.display = "none", a.synth.s0.init({ src: n });
    }
  }
}
function v() {
  a && a.hush(), globalThis.s0?.clear(), document.getElementById("hydra-canvas")?.remove(), globalThis.speed = f, globalThis.shape = g;
}
const x = (e) => () => m(e).queryArc(i(), i())[0].value;
export {
  x as H,
  v as clearHydra,
  u as initHydra
};
