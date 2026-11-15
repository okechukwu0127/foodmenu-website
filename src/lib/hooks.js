import { useEffect, useRef, useState } from 'react';
import { mouse } from './motion.js';

export const safeGet = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
export const safeSet = (k, v) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } };

// true while the element is on screen (repeat = re-trigger every time it comes back).
export function useInView(threshold = 0.2, repeat = false) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return undefined;
    if (!('IntersectionObserver' in window)) { setSeen(true); return undefined; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); if (!repeat) io.disconnect(); } else if (repeat) setSeen(false);
    }, { threshold });
    io.observe(el); return () => io.disconnect();
  }, [threshold, repeat]);
  return [ref, seen];
}

export function useInterval(fn, ms, active = true) {
  const cb = useRef(fn); cb.current = fn;
  useEffect(() => {
    if (!active || !ms) return undefined;
    const id = setInterval(() => cb.current(), ms); return () => clearInterval(id);
  }, [ms, active]);
}

// Counts 0 → `to` whenever `start` turns true (and back to 0 when it turns false).
export function useCountUp(to, start, ms = 1600, delay = 0) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!start) { setV(0); return undefined; }
    let raf; let t0;
    const tick = (t) => {
      if (t0 === undefined) t0 = t + delay;
      const p = Math.max(0, Math.min((t - t0) / ms, 1));
      setV(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [to, start, ms, delay]);
  return v;
}

// Makes an element glide/tilt toward the mouse.
export function useMouseGlide(strength = 1) {
  const ref = useRef(null);
  useEffect(() => {
    let cx = 0, cy = 0, raf;
    const loop = () => {
      cx += (mouse.x - cx) * 0.07; cy += (mouse.y - cy) * 0.07;
      const el = ref.current;
      if (el) el.style.transform = `translate3d(${cx * 60 * strength}px, ${cy * 40 * strength}px, 0) rotateY(${cx * 26 * strength}deg) rotateX(${-cy * 16 * strength}deg)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop); return () => cancelAnimationFrame(raf);
  }, [strength]);
  return ref;
}

export const gbp = (n, d = 0) => '£' + Number(n).toLocaleString('en-GB', { minimumFractionDigits: d, maximumFractionDigits: d });
