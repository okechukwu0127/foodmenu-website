import { brochure as B } from '../content.js';
import { Reveal, Swap, Check } from './ui.jsx';
import { useMouseGlide } from '../lib/hooks.js';

const Download = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v11M7 10.5l5 5 5-5M5 20h14" /></svg>;

// "Download the brochure" callout - shows the restaurant or partner brochure to match the switch.
export default function Brochure({ mode }) {
  const b = B[mode];
  const otherMode = mode === 'restaurant' ? 'partner' : 'restaurant';
  const glide = useMouseGlide(0.5);
  return (
    <section id="brochure" className="brochure-sec"><div className="wrap">
      <Reveal className="bro">
        <div className="bro-glow" />
        <div className="bro-art">
          <div ref={glide} className="glide">
            <Swap k={mode} className="bro-stack">
              <img className="bro-page" src={b.page} alt="" loading="lazy" />
              <img className="bro-cover" src={b.cover} alt={`${b.cta} - cover`} loading="lazy" />
            </Swap>
          </div>
        </div>
        <Swap k={mode} className="bro-copy">
          <div className="eyebrow">{b.eyebrow}</div>
          <h2 className="serif">{b.title[0]}<br /><em className="gel">{b.title[1]}</em></h2>
          <p className="muted bro-body">{b.body}</p>
          <ul className="list bro-list">{b.points.map((p) => <li key={p}><Check />{p}</li>)}</ul>
          <div className="btns">
            <a className="btn btn-main" href={b.file} download={b.downloadName}><Download />{b.cta}</a>
            <a className="btn btn-line" href={b.file} target="_blank" rel="noopener">{B.view}</a>
          </div>
          <div className="bro-meta">{b.meta}</div>
          <div className="bro-other">{B.other[mode].text} <a href={B[otherMode].file} download={B[otherMode].downloadName}>{B.other[mode].link}</a></div>
        </Swap>
      </Reveal>
    </div></section>
  );
}
