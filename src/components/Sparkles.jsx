import { useEffect, useRef } from 'react';

// Soft sparkles drifting across the page, plus a short glittering trail behind the cursor.
// Each sparkle is a pre-rendered glow sprite, so drawing stays cheap even on Retina screens.
const COLORS = ['#B48CFF', '#FF90B4', '#FFAB70', '#8B8CFF', '#FFFFFF'];

function sprite(color) {
  const c = document.createElement('canvas'); c.width = c.height = 32; const g = c.getContext('2d');
  const r = g.createRadialGradient(16, 16, 0, 16, 16, 16);
  r.addColorStop(0, '#fff'); r.addColorStop(0.18, color); r.addColorStop(0.5, `${color}55`); r.addColorStop(1, `${color}00`);
  g.fillStyle = r; g.fillRect(0, 0, 32, 32);
  g.fillStyle = `${color}aa`; g.fillRect(0, 15.4, 32, 1.2); g.fillRect(15.4, 0, 1.2, 32);
  return c;
}

export default function Sparkles({ count = 40 }) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; const ctx = cv.getContext('2d');
    const sprites = COLORS.map(sprite);
    let w = 0, h = 0, raf, last = 0, running = true;
    const resize = () => { const dpr = Math.min(window.devicePixelRatio || 1, 1.5); w = window.innerWidth; h = window.innerHeight; cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    resize(); window.addEventListener('resize', resize);
    const rnd = (a, b) => a + Math.random() * (b - a);
    const pick = () => (Math.random() * COLORS.length) | 0;
    const float = Array.from({ length: count }, () => ({ x: rnd(0, 1), y: rnd(0, 1), r: rnd(3, 9), s: rnd(0.4, 1.2), p: rnd(0, 6.28), c: pick(), dx: rnd(-0.2, 0.2) }));
    const trail = [];
    let lastScroll = window.scrollY;
    const move = (e) => {
      const now = performance.now(); if (now - last < 30) return; last = now;
      trail.push({ x: e.clientX + rnd(-6, 6), y: e.clientY + rnd(-6, 6), vx: rnd(-0.3, 0.3), vy: rnd(-0.6, 0.1), life: 1, r: rnd(6, 12), c: pick() });
      if (trail.length > 30) trail.shift();
    };
    window.addEventListener('pointermove', move, { passive: true });
    const vis = () => { running = !document.hidden; if (running) raf = requestAnimationFrame(loop); };
    document.addEventListener('visibilitychange', vis);

    function loop(t) {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      const sc = window.scrollY - lastScroll; lastScroll = window.scrollY;
      for (const p of float) {
        p.y -= (p.s * 0.00012 + sc * 0.00022); p.x += p.dx * 0.0002;
        if (p.y < -0.05) { p.y = 1.05; p.x = Math.random(); } if (p.y > 1.05) p.y = -0.05;
        if (p.x < -0.05) p.x = 1.05; if (p.x > 1.05) p.x = -0.05;
        ctx.globalAlpha = 0.18 + 0.5 * (0.5 + 0.5 * Math.sin(t * 0.0012 * p.s + p.p));
        ctx.drawImage(sprites[p.c], p.x * w - p.r, p.y * h - p.r, p.r * 2, p.r * 2);
      }
      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i]; p.x += p.vx; p.y += p.vy; p.life -= 0.025;
        if (p.life <= 0) { trail.splice(i, 1); continue; }
        const r = p.r * p.life; ctx.globalAlpha = p.life * 0.9;
        ctx.drawImage(sprites[p.c], p.x - r, p.y - r, r * 2, r * 2);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => { running = false; cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('pointermove', move); document.removeEventListener('visibilitychange', vis); };
  }, [count]);
  return <canvas ref={ref} className="sparkles" aria-hidden />;
}
