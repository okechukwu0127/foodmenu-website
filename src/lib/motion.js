// Scroll motion for the whole page.
//  • Smooth scrolling (Lenis).
//  • Every element marked data-sa fades/slides IN as it enters from the bottom
//    and fades/slides OUT as it leaves at the top — tied to the scroll position,
//    so it plays forwards and backwards. data-sa-d="<ms>" staggers an element.
import Lenis from 'lenis';

const clamp = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

export function startMotion() {
  const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -70 } });
  window.__lenis = lenis;
  const items = new Map();
  const scan = () => {
    document.querySelectorAll('[data-sa]').forEach((el) => { if (!items.has(el)) items.set(el, { v: 0, y: 70, s: 0.96 }); });
    items.forEach((_, el) => { if (!el.isConnected) items.delete(el); });
  };
  const mo = new MutationObserver(scan);
  mo.observe(document.body, { childList: true, subtree: true });
  scan();

  let raf;
  const tick = (time) => {
    lenis.raf(time);
    const vh = window.innerHeight;
    items.forEach((st, el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -vh || r.top > vh * 2) return;
      const d = (Number(el.dataset.saD) || 0) * 0.45;
      const enter = clamp((vh - r.top - d) / (vh * 0.3));
      const exit = el.dataset.saStay !== undefined ? 1 : clamp(r.bottom / (vh * 0.2));
      const v = Math.min(enter, exit);
      const y = (1 - enter) * 70 - (1 - exit) * 55;
      const s = 0.96 + 0.04 * v;
      const dv = v - st.v, dy = y - st.y;
      if (st.done && Math.abs(dv) < 0.002 && Math.abs(dy) < 0.2) return;
      st.v += dv * 0.14; st.y += dy * 0.14; st.s += (s - st.s) * 0.14;
      st.done = Math.abs(v - st.v) < 0.002 && Math.abs(y - st.y) < 0.2;
      el.style.opacity = st.v.toFixed(3);
      el.style.transform = st.v > 0.998 ? 'none' : `translate3d(0, ${st.y.toFixed(1)}px, 0) scale(${st.s.toFixed(4)})`;
    });
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => { cancelAnimationFrame(raf); mo.disconnect(); lenis.destroy(); };
}

// Shared, smoothed mouse position (-0.5 … 0.5).
export const mouse = { x: 0, y: 0 };
if (typeof window !== 'undefined') {
  window.addEventListener('pointermove', (e) => { mouse.x = e.clientX / window.innerWidth - 0.5; mouse.y = e.clientY / window.innerHeight - 0.5; }, { passive: true });
}
