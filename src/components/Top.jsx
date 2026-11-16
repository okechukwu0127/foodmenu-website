import { useEffect, useRef, useState } from 'react';
import { nav, hero, looks, t, demoLink } from '../content.js';
import { Phone, ScreenVideo, Swap, Check, Arrow } from './ui.jsx';
import { mouse } from '../lib/motion.js';

const ForkIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden><path d="M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10M17 3c-2 2-3 5-3 8h3v10" /></svg>;

export function Nav({ mode, setMode }) {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on(); window.addEventListener('scroll', on, { passive: true }); return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <nav className={`nav ${solid ? 'solid' : ''}`}>
      <div className="wrap navin">
        <a className="logo" href="#top" aria-label="LiberQ home"><img src="/assets/brand/logo.svg" alt="LiberQ" /></a>
        <div className="aud glass" role="tablist" aria-label="Who are you?">
          {['restaurant', 'partner'].map((m) => (
            <button key={m} role="tab" aria-selected={mode === m} className={mode === m ? 'on' : ''} onClick={() => setMode(m)}>
              <span className="ic">{m === 'restaurant' ? <ForkIcon /> : '£'}</span>
              <span>{nav.modes[m].label}<em>{nav.modes[m].hint}</em></span>
            </button>
          ))}
        </div>
        <div className="navr">
          <a href="#beta">{nav.beta}</a>
          <a className="btn btn-line sm navdemo" href={demoLink('nav')} target="_blank" rel="noopener"><span className="livedot" aria-hidden />{nav.demo}</a>
          <a className="btn btn-main sm" href="#contact">{t(nav.cta, mode)}</a>
        </div>
      </div>
    </nav>
  );
}

export function Hero({ mode, look, setLook }) {
  const phone = useRef(null);
  const stage = useRef(null);
  const current = looks.find((l) => l.id === look) || looks[0];

  // Hero phone: strong tilt toward the mouse, a soft bounce, and it spins as you scroll
  // (scroll down = clockwise, scroll back up = anticlockwise).
  useEffect(() => {
    let cx = 0, cy = 0, spin = 0, raf;
    const loop = (time) => {
      cx += (mouse.x - cx) * 0.08; cy += (mouse.y - cy) * 0.08;
      const sy = window.scrollY;
      spin += (sy * 0.36 - spin) * 0.08;
      const bounce = -Math.abs(Math.sin(time / 760)) * 16;
      const s = Math.min(sy / window.innerHeight, 1.2);
      const el = phone.current;
      if (el) el.style.transform = `translate3d(${cx * 46}px, ${bounce + cy * 24 + s * 70}px, 0) rotateY(${spin + cx * 34 - 8}deg) rotateX(${-cy * 22 + 4}deg) rotateZ(${cx * -4}deg) scale(${1 - s * 0.1})`;
      if (stage.current) { stage.current.style.setProperty('--mx', cx.toFixed(3)); stage.current.style.setProperty('--my', cy.toFixed(3)); }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const title = hero.title[mode];
  const cards = hero.cards[mode];
  return (
    <header className="hero" id="top">
      <video key={current.id} className="hero-bg" muted autoPlay loop playsInline poster={current.poster} aria-hidden>
        <source src={`${current.video}.webm`} type="video/webm" />
        <source src={`${current.video}.mp4`} type="video/mp4" />
      </video>
      <div className="veil" /><div className="glow" />
      <div className="looks glass" aria-label="Background look">
        {looks.map((l) => <button key={l.id} title={l.name} aria-label={l.name} className={l.id === look ? 'on' : ''} style={{ background: l.swatch }} onClick={() => setLook(l.id)} />)}
      </div>
      <div className="wrap inner">
        <div data-sa="" data-sa-d="0">
          <Swap k={mode} className="copy">
            <div className="eyebrow" style={{ marginBottom: 22 }}>{t(hero.eyebrow, mode)}</div>
            <h1 className="serif">{title.lines.map((l, i) => <span key={l} className="ln" style={{ animationDelay: `${i * 120}ms` }}>{l}<br /></span>)}<em className="gel ln" style={{ animationDelay: `${title.lines.length * 120}ms` }}>{title.accent}</em></h1>
            <p className="lead">{t(hero.lead, mode)}</p>
            <div className="btns">
              <a className="btn btn-main" href="#contact">{t(hero.cta, mode)} <Arrow /></a>
              <a className="btn btn-line" href="#how">{t(hero.secondary, mode)}</a>
            </div>
            <div className="ticks">{t(hero.ticks, mode).map((x) => <span key={x}><Check />{x}</span>)}</div>
          </Swap>
        </div>
        <div className="stage" ref={stage}>
          <Phone ref={phone} back className="hero-phone"><ScreenVideo src={hero.video} poster={hero.poster} /></Phone>
          {cards.map((c, i) => (
            <div key={`${mode}${i}`} className={`callout c${i}`} style={{ animationDelay: `${i * 3 + 0.6}s` }}>
              <div className="k" style={c.lav ? { color: 'var(--lav)', fontWeight: 600 } : undefined}>{c.k}</div>
              {c.v && <div className="v">{c.v}</div>}
              {c.note && <div className="n">{c.note}</div>}
              {(c.text || c.strong) && <div className="tx">{c.strongFirst ? <><b>{c.strong}</b> {c.text}</> : <>{c.text} <b>{c.strong}</b></>}</div>}
            </div>
          ))}
        </div>
      </div>
      <div className="scrollhint">{hero.scroll}</div>
    </header>
  );
}
