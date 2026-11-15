import { dashboard as D, t } from '../content.js';
import { Reveal, Swap } from './ui.jsx';
import { useInView, useCountUp } from '../lib/hooks.js';

// Everything here animates from 0 each time the dashboard scrolls into view.
const fmt = (n, pre = '', post = '') => `${pre}${Math.round(n).toLocaleString('en-GB')}${post}`;

function Num({ v, go, pre, post, ms = 1600, delay = 0 }) {
  const n = useCountUp(v, go, ms, delay);
  return <>{fmt(n, pre, post)}</>;
}

function Kpi({ k, v, pre = '', post = '', tone, go, i }) {
  return <div className="kpi"><div className="k">{k}</div><div className={`v ${tone || ''}`}><Num v={v} go={go} pre={pre} post={post} delay={i * 120} /></div></div>;
}

function Donut({ parts, go, center }) {
  let off = 25;
  return (
    <svg width="124" height="124" viewBox="0 0 42 42" aria-hidden>
      <circle cx="21" cy="21" r="15.9" fill="none" stroke="#2E2A38" strokeWidth="6" />
      {parts.map(([name, pct, color], i) => {
        const el = <circle key={name} className="arc" cx="21" cy="21" r="15.9" fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={`${go ? pct : 0} ${go ? 100 - pct : 100}`} strokeDashoffset={off} style={{ transitionDelay: `${300 + i * 350}ms` }} />;
        off = (off - pct + 100) % 100; return el;
      })}
      <text x="21" y="23" textAnchor="middle" fill="#F3F0EA" fontSize={center.length > 3 ? 5 : 6} fontWeight="700" fontFamily="Inter">{center}</text>
    </svg>
  );
}

function Legend({ parts, go }) {
  return <div className="legend">{parts.map(([n, p, c], i) => <div key={n}><b style={{ color: c }}>●</b> {n} <Num v={p} go={go} post="%" delay={300 + i * 350} ms={1100} /></div>)}</div>;
}

// Vertical bars with a value axis; each bar grows from 0 and its label counts up.
function Bars({ data, go, pre = '', ticks, tall, labels }) {
  const max = ticks[ticks.length - 1];
  return (
    <div className={`bars ${tall ? 'tall' : ''}`}>
      <div className="yaxis">{[...ticks].reverse().map((v) => <span key={v}>{pre}{v.toLocaleString('en-GB')}</span>)}</div>
      <div className="plot">
        <div className="grid">{ticks.map((v) => <i key={v} />)}</div>
        <div className="hb">
          {data.map(([lab, v], i) => (
            <div key={lab + i} className="col">
              <span className={`bar ${v >= max * 0.6 ? 'hi' : ''}`} style={{ height: `${(v / max) * 100}%`, transitionDelay: `${i * 70}ms` }}>
                {labels && <em><Num v={v} go={go} pre={pre} ms={1100} delay={i * 70} /></em>}
              </span>
            </div>
          ))}
        </div>
        <div className="axis">{data.map(([lab], i) => <span key={lab + i}>{lab}</span>)}</div>
      </div>
    </div>
  );
}

function Line({ data, before, go }) {
  const max = 2500, W = 560, H = 160;
  const pts = (arr) => arr.map((v, i) => [(i / (arr.length - 1)) * W, H - (v / max) * H]);
  const path = (p) => p.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const a = pts(data), b = pts(before);
  const last = a[a.length - 1];
  return (
    <div className="bars">
      <div className="yaxis">{['£2.5k', '£2k', '£1.5k', '£1k', '£500', '£0'].map((v) => <span key={v}>{v}</span>)}</div>
      <div className="plot">
        <svg className="line" width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden>
          <defs><linearGradient id="ga" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#B48CFF" stopOpacity=".4" /><stop offset="1" stopColor="#B48CFF" stopOpacity="0" /></linearGradient></defs>
          <g stroke="#2E2A38">{[0, 1, 2, 3, 4].map((i) => <line key={i} x1="0" x2={W} y1={(i * H) / 5} y2={(i * H) / 5} />)}</g>
          <path className="area" d={`${path(a)} L${W},${H} L0,${H} Z`} fill="url(#ga)" />
          <path className="fadein" d={path(b)} fill="none" stroke="#FFAB5C" strokeWidth="2" strokeDasharray="6 6" />
          <path className="draw" pathLength="1" d={path(a)} fill="none" stroke="#B48CFF" strokeWidth="3" />
        </svg>
        <div className="endlabel" style={{ top: `${(last[1] / H) * 100}%` }}><Num v={data[data.length - 1]} go={go} pre="£" ms={2000} delay={300} /></div>
        <div className="axis"><span>14 days ago</span><span>Today</span></div>
      </div>
    </div>
  );
}

const Pill = ({ tone, children }) => <span className={`pill ${tone}`}>{children}</span>;

function RestaurantDash({ go }) {
  const d = D.restaurant;
  const hourLabels = ['11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '10p', '11p'];
  return (
    <div className="card dash">
      <div className="side">{d.menu.map((m, i) => <div key={m} className={i === 0 ? 'on' : ''}>{m}</div>)}</div>
      <div>
        <div className="kpis">{d.kpis.map(([k, v, pre, post, tone], i) => <Kpi key={k} {...{ k, v, pre, post, tone, go, i }} />)}</div>
        <div className="dgrid">
          <div className="panel s8"><h4>Revenue — last 14 days <span className="ok">▲ <Num v={18} go={go} post="%" /></span></h4>
            <Line data={d.revenue} before={d.before} go={go} />
            <div className="legend row2"><span><b style={{ color: '#B48CFF' }}>━</b> Your app</span><span><b style={{ color: '#FFAB5C' }}>┅</b> Marketplace (before)</span></div></div>
          <div className="panel s4"><h4>Orders by channel</h4><div className="donut"><Donut parts={d.channels} go={go} center={fmt(useCountUp(86, go))} /><Legend parts={d.channels} go={go} /></div></div>
          <div className="panel s5"><h4>Orders by hour</h4><Bars data={d.hours.map((v, i) => [hourLabels[i], v])} ticks={[0, 10, 20, 30]} go={go} labels /></div>
          <div className="panel s4 top"><h4>Top dishes <span>orders</span></h4>{d.dishes.map(([n, v, img], i) => (
            <div key={n}><img src={img} alt="" /><span className="dn">{n}</span><div className="barx"><i style={{ width: `${(v / 40) * 100}%`, transitionDelay: `${i * 120}ms` }} /></div><b className="dv"><Num v={v} go={go} delay={i * 120} ms={1100} /></b></div>
          ))}</div>
          <div className="panel s3 feed"><h4>Live orders <span className="ok">● live</span></h4>{d.orders.map(([a, b, tone], i) => <div key={a} style={{ transitionDelay: `${400 + i * 250}ms` }}><span>{a}</span><Pill tone={tone}>{b}</Pill></div>)}</div>
        </div>
      </div>
    </div>
  );
}

function PartnerDash({ go }) {
  const d = D.partner;
  return (
    <div className="card dash">
      <div className="side">{d.menu.map((m, i) => <div key={m} className={i === 0 ? 'on' : ''}>{m}</div>)}</div>
      <div>
        <div className="kpis">{d.kpis.map(([k, v, pre, post, tone], i) => <Kpi key={k} {...{ k, v, pre, post, tone, go, i }} />)}</div>
        <div className="dgrid">
          <div className="panel s7"><h4>Earnings by month <span className="ok">▲ <Num v={34} go={go} post="%" /></span></h4>
            <Bars data={d.months} ticks={[0, 100, 200, 300, 400]} pre="£" go={go} tall labels /></div>
          <div className="panel s5"><h4>Where it comes from</h4><div className="donut"><Donut parts={d.split} go={go} center={`£${(useCountUp(1.9, go) || 0).toFixed(1)}k`} /><Legend parts={d.split} go={go} /></div></div>
          <div className="panel s12 feed"><h4>Your restaurants</h4>{d.restaurants.map(([a, b, tone], i) => <div key={a} style={{ transitionDelay: `${400 + i * 250}ms` }}><span>{a}</span><Pill tone={tone}>{b}</Pill></div>)}</div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard({ mode }) {
  const [ref, go] = useInView(0.3, true);
  return (
    <section id="dashboard"><div className="wrap">
      <Reveal className="center"><Swap k={mode}>
        <div className="eyebrow">{t(D.eyebrow, mode)}</div>
        <h2 className="serif">{t(D.title, mode)}</h2>
        <p className="sub muted">{t(D.sub, mode)}</p>
      </Swap></Reveal>
      <Reveal className="dashwrap"><div ref={ref} className={go ? 'go' : ''}>
        <Swap k={mode}>{mode === 'restaurant' ? <RestaurantDash go={go} /> : <PartnerDash go={go} />}</Swap>
      </div></Reveal>
      <Reveal as="p" className="fine center">{D.note}</Reveal>
    </div></section>
  );
}
