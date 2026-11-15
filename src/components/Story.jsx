import { useEffect, useRef, useState } from 'react';
import { partnersStrip, problem, how, brands, ai, t } from '../content.js';
import { Reveal, Swap, Phone, ScreenSlides, ScreenVideo, ScreenFade, Check, Arrow } from './ui.jsx';
import { useInterval, useInView, useMouseGlide } from '../lib/hooks.js';

const Lines = ({ lines }) => lines.map((l, i) => <span key={l}>{l}{i < lines.length - 1 && <br />}</span>);
const Accent = ({ parts }) => <>{parts[0]}<span className="gel">{parts[1]}</span>{parts[2]}</>;

function Head({ mode, eyebrow, title, sub, accent = false, center = true, eyeStyle, motion = true }) {
  const inner = (
    <Swap k={mode}>
      <div className="eyebrow" style={eyeStyle}>{t(eyebrow, mode)}</div>
      <h2 className="serif">{accent ? <Accent parts={t(title, mode)} /> : <Lines lines={[].concat(t(title, mode))} />}</h2>
      {sub && <p className="sub muted">{t(sub, mode)}</p>}
    </Swap>
  );
  return motion ? <Reveal className={center ? 'center' : ''}>{inner}</Reveal> : <div className={center ? 'center' : ''}>{inner}</div>;
}

export function Strip() {
  return <div className="strip"><div className="wrap marquee"><div className="mq">{[...partnersStrip, ...partnersStrip].map((x, i) => <span key={i}>{x}</span>)}</div></div></div>;
}

export function Problem({ mode }) {
  const Card = ({ d, hi }) => (
    <div className={`card cmp ${hi ? 'hi' : ''}`}>
      <div className="ct">{d.title}</div>
      {d.rows.map(([a, b, c]) => <div className="row" key={a}><span>{a}</span><span className={c || ''}>{b}</span></div>)}
      <div className="row total"><span>{d.total[0]}</span><span className={hi ? 'pos' : ''}>{d.total[1]}</span></div>
    </div>
  );
  return (
    <section id="why"><div className="wrap">
      <Head mode={mode} eyebrow={problem.eyebrow} title={problem.title} sub={problem.sub} />
      <div className="compare"><Reveal className="from-l"><Card d={problem.marketplace} /></Reveal><Reveal delay={120} className="from-r"><Card d={problem.liberq} hi /></Reveal></div>
      <Reveal as="p" className="fine center">{problem.note}</Reveal>
    </div></section>
  );
}

// Restaurant view: the section pins (sticks) while you scroll and steps 01 → 04 change with the scroll.
function HowPinned({ mode }) {
  const sec = useRef(null);
  const [step, setStep] = useState(0);
  const [prog, setProg] = useState(0);
  const n = how.steps.length;
  useEffect(() => {
    let raf;
    const loop = () => {
      const el = sec.current;
      if (el) {
        const r = el.getBoundingClientRect();
        const total = el.offsetHeight - window.innerHeight;
        const p = Math.min(Math.max(-r.top / total, 0), 0.9999);
        const s = Math.floor(p * n);
        setStep((x) => (x === s ? x : s));
        const pr = Math.round((p * n - s) * 200) / 200;
        setProg((x) => (x === pr ? x : pr));
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop); return () => cancelAnimationFrame(raf);
  }, [n]);
  const goTo = (i) => {
    const el = sec.current; const total = el.offsetHeight - window.innerHeight;
    const y = el.getBoundingClientRect().top + window.scrollY + total * ((i + 0.15) / n);
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.1 }); else window.scrollTo({ top: y, behavior: 'smooth' });
  };
  const cur = how.steps[step];
  return (
    <section className="alt howpin" id="how" ref={sec} style={{ height: `${n * 85 + 100}vh` }}>
      <div className="sticky"><div className="wrap pingrid">
        <div>
          <Head mode={mode} eyebrow={how.eyebrow} title={how.title} center={false} motion={false} />
          <div className="steps">
            {how.steps.map((s, i) => (
              <button key={s.title} className={`step ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`} onClick={() => goTo(i)}>
                <div className="n">{String(i + 1).padStart(2, '0')}</div>
                <div className="sb"><h3>{s.title}</h3><p>{s.body}</p></div>
                <i className="prog" style={{ transform: `scaleX(${i === step ? prog : i < step ? 1 : 0})` }} />
              </button>
            ))}
          </div>
        </div>
        <div className="pin">
          <div className="pinphone" style={{ transform: `rotateY(${(prog - 0.5) * -14}deg) rotateZ(${(prog - 0.5) * 3}deg)` }}>
            <Phone className="mid">
              {how.steps.map((s, i) => (
                <div key={s.title} className={`layer ${i === step ? 'on' : ''}`}>
                  <ScreenSlides images={s.screens} interval={2600} active={i === step} alt={s.title} />
                </div>
              ))}
            </Phone>
          </div>
          <div className="stepcount"><b>{String(step + 1).padStart(2, '0')}</b> / {String(n).padStart(2, '0')}</div>
        </div>
      </div></div>
    </section>
  );
}

export function How({ mode }) {
  if (mode === 'restaurant') return <HowPinned mode={mode} />;
  return (
    <section className="alt" id="how"><div className="wrap">
      <Head mode={mode} eyebrow={how.eyebrow} title={how.title} />
      <div className="feat">
        <div className="steps">
          {how.partnerSteps.map((s, i) => <Reveal key={s.title} delay={i * 110} className="step active plain"><div className="n">{String(i + 1).padStart(2, '0')}</div><div className="sb"><h3>{s.title}</h3><p>{s.body}</p></div></Reveal>)}
        </div>
        <Reveal delay={150} className="card kit"><div className="kt">{how.kitTitle}</div><ul className="list">{how.kit.map((k) => <li key={k}><Check />{k}</li>)}</ul></Reveal>
      </div>
    </div></section>
  );
}

export function Brands({ mode }) {
  const b = brands.build;
  const glide = useMouseGlide(0.8);
  return (
    <section id="brands"><div className="wrap center">
      <Head mode={mode} eyebrow={brands.eyebrow} title={brands.title} />
      <div className="brands">
        {brands.list.map((x, i) => (
          <Reveal key={x.name} className="brand" delay={i * 110}>
            <img src={x.image} alt={x.name} loading="lazy" />
            <div><i style={{ background: x.color }}>{x.initial}</i>{x.name}{mode === 'partner' && <small className="swap">{brands.partnerTag}</small>}</div>
          </Reveal>
        ))}
      </div>
      <div className="bbspace" />
      <Reveal className="buildbrand rise">
        <Swap k={mode}>
          <div className="eyebrow" style={{ color: 'var(--lav)' }}>{b.eyebrow}</div>
          <h2 className="serif bb"><Accent parts={t(b.title, mode)} /></h2>
          <p className="muted bbp">{t(b.body, mode)}</p>
          <div className="steps3">{b.steps.map(([h, x]) => <div key={h}><b>{h}</b>{x}</div>)}</div>
          <a className="btn btn-main" href="#contact">{t(b.cta, mode)} <Arrow /></a>
        </Swap>
        <div className="bbphone"><div ref={glide} className="glide"><Phone className="small"><img className="screen" src={b.screen} alt="Your brand’s app" loading="lazy" /></Phone></div></div>
      </Reveal>
    </div></section>
  );
}

export function AiWaiter({ mode }) {
  const [beat, setBeat] = useState(0);
  const [ref, inView] = useInView(0.25, true);
  const vid = useRef(null);
  const hasVideo = !!ai.video;
  // Steps + chat bubbles follow the recording's timeline.
  const onTime = (sec) => {
    let b = 0; ai.beats.forEach((x, i) => { if (sec >= x.at) b = i; });
    setBeat((cur) => (cur === b ? cur : b));
  };
  useEffect(() => {
    const v = vid.current; if (!v) return;
    if (inView) { v.currentTime = 0; v.play().catch(() => {}); } else v.pause();
  }, [inView]);
  useInterval(() => setBeat((b) => (b + 1) % ai.beats.length), 3200, !hasVideo && inView);
  return (
    <section className="alt" id="ai"><div className="wrap">
      <Head mode={mode} eyebrow={ai.eyebrow} title={ai.title} sub={ai.sub} accent eyeStyle={{ color: 'var(--lav)' }} />
      <div className="ai" ref={ref}>
        <Reveal as="ol" className="beats from-l">
          {ai.beats.map((b, i) => <li key={b.title} className={i === beat ? 'on' : i < beat ? 'done' : ''}><span className="num">{i + 1}</span><div><b>{b.title}</b><span>{b.body}</span></div></li>)}
        </Reveal>
        <Reveal delay={100} className="aiphone">
          <div className="orbglow" />
          <Phone className="mid">{hasVideo ? <ScreenVideo ref={vid} src={ai.video} poster={ai.poster} onTime={onTime} /> : <ScreenFade images={ai.screens} index={beat} />}</Phone>
        </Reveal>
        <Reveal delay={200} className="bubbles from-r">
          {ai.bubbles.map((b, i) => (
            <div key={i} className={`bubble ${b.me ? 'me' : ''} ${b.ok ? 'ok' : ''} ${beat >= b.beat ? 'in' : ''}`} style={{ transitionDelay: `${beat >= b.beat && i === ai.bubbles.length - 1 ? 900 : 0}ms` }}>
              {b.who && <small>{b.who}</small>}{b.text}
            </div>
          ))}
        </Reveal>
      </div>
      <div className="aistat">{ai.stats.map(([v, l], i) => <Reveal key={v} delay={i * 110}><b>{v}</b><span className="muted">{l}</span></Reveal>)}</div>
    </div></section>
  );
}
