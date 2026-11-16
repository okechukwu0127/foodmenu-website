import { liveDemo as L, demoLink, t } from '../content.js';
import { Reveal, Swap, Phone, Check, Arrow } from './ui.jsx';
import { useMouseGlide } from '../lib/hooks.js';

// "Try the live demo" callout. Desktop shows a QR code to open the demo on a phone;
// on mobile the QR is hidden and the button opens the demo straight away.
export default function LiveDemo({ mode }) {
  const glide = useMouseGlide(0.5);
  return (
    <section id="live-demo" className="demo-sec"><div className="wrap">
      <Reveal className="demo">
        <div className="demo-glow" />
        <Swap k={mode} className="demo-copy">
          <div className="eyebrow"><span className="livedot" aria-hidden />{t(L.eyebrow, mode)}</div>
          <h2 className="serif">{t(L.title, mode)[0]}<br /><em className="gel">{t(L.title, mode)[1]}</em></h2>
          <p className="muted demo-body">{t(L.body, mode)}</p>
          <ul className="list demo-list">{L.points.map((p) => <li key={p}><Check />{p}</li>)}</ul>
          <a className="btn btn-main" href={demoLink('callout')} target="_blank" rel="noopener">{t(L.cta, mode)} <Arrow /></a>
          <div className="demo-note">{L.note}</div>
        </Swap>
        <div className="demo-art">
          <div className="demo-qr">
            <div className="qrbox"><img src={L.qr} alt="QR code that opens the LiberQ live demo" width="168" height="168" /></div>
            <b>{L.qrTitle}</b><span>{L.qrSub}</span>
          </div>
          <div className="demo-phone"><div ref={glide} className="glide"><Phone className="small"><img className="screen" src={L.screen} alt="The LiberQ demo app" loading="lazy" /></Phone></div></div>
        </div>
      </Reveal>
    </div></section>
  );
}
