import { useEffect, useState } from 'react';
import { forRestaurants as FR, forPartners as FP, contact as C, footer, site, ukCities, t } from '../content.js';
import { Reveal, Swap, Check } from './ui.jsx';
import { gbp } from '../lib/hooks.js';
import { submitBeta, submitLead } from '../lib/api.js';

function Range({ label, value, display, min, max, step, onChange }) {
  const p = ((value - min) / (max - min)) * 100;
  return (
    <label className="rng">
      <span className="rl"><span>{label}</span><b>{display}</b></span>
      <input type="range" min={min} max={max} step={step} value={value} style={{ '--p': `${p}%` }} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}

function RestaurantSix() {
  const c = FR.calc;
  const [o, setO] = useState(c.orders.value), [a, setA] = useState(c.avg.value), [s, setS] = useState(c.share.value);
  const kept = o * (s / 100) * 52 * a * (c.marketplaceRate - c.cardRate);
  return (
    <>
      <Reveal><div className="eyebrow">{FR.eyebrow}</div><h2 className="serif">{FR.title[0]}<br />{FR.title[1]}</h2></Reveal>
      <div className="six">
        <Reveal className="card calc"><h3>{c.title}</h3>
          <Range {...c.orders} label={c.orders.label} value={o} display={o} onChange={setO} />
          <Range {...c.avg} label={c.avg.label} value={a} display={gbp(a)} onChange={setA} />
          <Range {...c.share} label={c.share.label} value={s} display={`${s}%`} onChange={setS} />
          <div className="result"><div className="k">{c.resultLabel}</div><div className="big serif">{gbp(Math.round(kept))}</div>
            <div className="sm">{c.netLabel}: <b className="ok">{gbp(Math.round(kept - c.planMonthly * 12))}</b></div></div>
          <p className="fine">{c.note}</p>
        </Reveal>
        <Reveal delay={120}>
          <div className="h3">{FR.qr.title}</div>
          <div className="qr">{FR.qr.steps.map((x, i) => <div key={x}><b>{i + 1}</b>{x}</div>)}</div>
          <ul className="list">{FR.points.map((x) => <li key={x}><Check />{x}</li>)}</ul>
        </Reveal>
      </div>
      <div className="plans">
        {FR.plans.map((p, i) => (
          <Reveal key={p.name} delay={i * 90} className={`card plan ${p.featured ? 'pop' : ''}`}>
            <b>{p.name}</b>{p.featured && <span className="badge">{FR.popular}</span>}
            <div className="price serif">£{p.price}<span>{p.unit}</span></div>
            <div className="muted pb">{p.blurb}</div>
            <ul>{p.features.map((f) => <li key={f}><Check />{f}</li>)}</ul>
          </Reveal>
        ))}
      </div>
      <p className="center muted foot">{FR.footnote}</p>
    </>
  );
}

function PartnerSix() {
  const c = FP.calc;
  const [n, setN] = useState(c.perMonth.value), [plan, setPlan] = useState(c.defaultPlan);
  const per = c.bonus[plan] + c.prices[plan] * c.commissionRate * c.commissionMonths;
  return (
    <>
      <Reveal><div className="eyebrow">{FP.eyebrow}</div><h2 className="serif">{FP.title[0]}<br />{FP.title[1]}</h2></Reveal>
      <div className="six">
        <Reveal className="card calc"><h3>{c.title}</h3>
          <Range {...c.perMonth} label={c.perMonth.label} value={n} display={n} onChange={setN} />
          <div className="rng"><span className="rl"><span>{c.planLabel}</span></span>
            <div className="seg">{c.plans.map((p) => <button key={p} className={p === plan ? 'on' : ''} onClick={() => setPlan(p)}>{p}</button>)}</div></div>
          <div className="result"><div className="k">{c.perLabel}</div><div className="big serif">{gbp(per, 2)}</div>
            <div className="sm">{c.yearLabel}: <b className="ok">{gbp(per * n * 12, 2)}</b></div></div>
          <p className="fine">{c.note}</p>
        </Reveal>
        <Reveal delay={120}>
          <div className="h3">{FP.timelineTitle}</div>
          <div className="timeline">{FP.timeline.map(([w, x]) => <div key={w}><b>{w}</b>{x}</div>)}</div>
          <ul className="list"><li><Check />{FP.point}</li></ul>
        </Reveal>
      </div>
    </>
  );
}

export function Six({ mode }) {
  return <section className="alt" id="six"><div className="wrap"><Swap k={mode}>{mode === 'restaurant' ? <RestaurantSix /> : <PartnerSix />}</Swap></div></section>;
}

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
const phoneOk = (v) => /^(\+44|0044|0)\d{9,10}$/.test(v.replace(/[\s\-()]/g, ''));

function LeadForm({ mode }) {
  const f = C.form[mode];
  const empty = { name: '', business: '', email: '', phone: '', consent: false, company: '' };
  const [v, setV] = useState(empty), [state, setState] = useState('idle'), [err, setErr] = useState('');
  useEffect(() => { setV((x) => ({ ...x, business: '' })); setState('idle'); setErr(''); }, [mode]);
  const set = (k) => (e) => setV({ ...v, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    if (!v.name.trim() || !v.business.trim() || !v.email.trim() || !v.phone.trim()) return setErr(C.errors.required);
    if (!emailOk(v.email)) return setErr(C.errors.email);
    if (!phoneOk(v.phone)) return setErr(C.errors.phone);
    if (!v.consent) return setErr(C.errors.consent);
    setErr(''); setState('sending');
    try { await submitLead({ kind: mode === 'partner' ? 'partner' : 'demo', ...v }); setState('done'); setV(empty); }
    catch (x) { setErr(x.message); setState('idle'); }
  };
  return (
    <form className="card form" onSubmit={submit} noValidate>
      <b className="ft">{f.title}</b>
      {state === 'done' ? <p className="okmsg">{f.success}</p> : (
        <>
          <div className="fields">
            <input className="field" placeholder={f.name} value={v.name} onChange={set('name')} autoComplete="name" required />
            {mode === 'partner' ? (
              <select className="field" value={v.business} onChange={set('business')} required aria-label={f.business}>
                <option value="">{f.business}</option>{ukCities.map((c) => <option key={c}>{c}</option>)}
              </select>
            ) : <input className="field" placeholder={f.business} value={v.business} onChange={set('business')} autoComplete="organization" required />}
            <input className="field" type="email" placeholder={f.email} value={v.email} onChange={set('email')} autoComplete="email" required />
            <input className="field" type="tel" placeholder={f.phone} value={v.phone} onChange={set('phone')} autoComplete="tel" required />
          </div>
          <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden name="company" value={v.company} onChange={set('company')} />
          <label className="consent"><input type="checkbox" checked={v.consent} onChange={set('consent')} /><span>{C.consent} See our <a href="/privacy-policy" target="_blank" rel="noopener">Privacy Policy</a>.</span></label>
          {err && <p className="err" role="alert">{err}</p>}
          <button className="btn btn-main wide" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : f.submit}</button>
        </>
      )}
    </form>
  );
}

function BetaForm() {
  const b = C.beta;
  const [platform, setPlatform] = useState('ios'), [email, setEmail] = useState(''), [consent, setConsent] = useState(false), [company, setCompany] = useState('');
  const [state, setState] = useState('idle'), [msg, setMsg] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    if (!emailOk(email)) { setMsg(C.errors.email); return; }
    if (!consent) { setMsg(C.errors.consent); return; }
    setState('sending'); setMsg('');
    try { const m = await submitBeta({ email: email.trim(), platform, company }); setState('done'); setMsg(m || b.success); }
    catch (x) { setState('idle'); setMsg(x.message); }
  };
  return (
    <form className="card form" id="beta" onSubmit={submit} noValidate>
      <b className="ft">{b.title}</b><p className="muted" style={{ marginTop: 6 }}>{b.body}</p>
      {state === 'done' ? <p className="okmsg">{msg}</p> : (
        <>
          <div className="seg" style={{ margin: '20px 0 14px' }}>
            {['ios', 'android'].map((p) => <button type="button" key={p} className={platform === p ? 'on' : ''} onClick={() => setPlatform(p)}>{b[p]}</button>)}
          </div>
          <input className="field" type="email" placeholder={b.email[platform]} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden value={company} onChange={(e) => setCompany(e.target.value)} name="company" />
          <label className="consent"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} /><span>{b.consent} See our <a href="/privacy-policy" target="_blank" rel="noopener">Privacy Policy</a>.</span></label>
          {msg && <p className="err" role="alert">{msg}</p>}
          <button className="btn btn-line wide" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : b.submit}</button>
        </>
      )}
    </form>
  );
}

export function Contact({ mode }) {
  return (
    <section id="contact"><div className="wrap">
      <Reveal className="center"><Swap k={mode}>
        <h2 className="serif">{t(C.title, mode).map((l, i, a) => <span key={l}>{l}{i < a.length - 1 && <br />}</span>)}</h2>
        <p className="sub muted">{t(C.sub, mode)}</p>
      </Swap></Reveal>
      <Reveal className="ctas"><LeadForm mode={mode} /><BetaForm /></Reveal>
    </div></section>
  );
}

export function Footer() {
  return (
    <footer><div className="wrap fw">
      <img src="/assets/brand/logo.svg" alt="LiberQ" />
      <span>{footer.line} · <a href={`mailto:${site.email}`}>{site.email}</a></span>
      <span className="flinks"><a href="/privacy-policy">Privacy Policy</a><a href="/terms-conditions">Terms and Conditions</a><span>© {site.year} LiberQ</span></span>
    </div></footer>
  );
}
