import { forwardRef, useState } from 'react';
import { useInterval } from '../lib/hooks.js';

// Scroll-linked in/out transition (see lib/motion.js). `delay` (ms) staggers siblings; `stay` = no fade-out.
export function Reveal({ as: Tag = 'div', className = '', delay = 0, stay = false, children, ...rest }) {
  return <Tag data-sa="" data-sa-d={delay || undefined} data-sa-stay={stay ? '' : undefined} className={className} {...rest}>{children}</Tag>;
}

// Re-plays a soft fade whenever `k` changes (used for the audience switch).
export const Swap = ({ k, className = '', children, as: Tag = 'div', ...rest }) => <Tag key={k} className={`swap ${className}`} {...rest}>{children}</Tag>;

// Phone frame. `back` adds a rear face so the phone can spin all the way round.
export const Phone = forwardRef(function Phone({ className = '', style, back = false, children }, ref) {
  return (
    <div ref={ref} className={`phone ${back ? 'has-back' : ''} ${className}`} style={style}>
      <div className="face front"><div className="scr">{children}<div className="sheen" /></div></div>
      {back && (
        <div className="face back" aria-hidden>
          <div className="cam"><i /><i /><i /></div>
          <img src="/assets/brand/mark.svg" alt="" className="bmark" />
          <span className="bword">LIBERQ</span>
        </div>
      )}
    </div>
  );
});

// A looping, muted screen recording (mp4 + webm with the same base name).
export const ScreenVideo = forwardRef(function ScreenVideo({ src, poster, onTime }, ref) {
  return (
    <video ref={ref} className="screen" muted autoPlay loop playsInline preload="auto" poster={poster} aria-label="App screen recording"
      onTimeUpdate={onTime ? (e) => onTime(e.currentTarget.currentTime) : undefined}>
      <source src={`${src}.webm`} type="video/webm" />
      <source src={`${src}.mp4`} type="video/mp4" />
    </video>
  );
});

// Auto-playing image carousel with a soft slide.
export function ScreenSlides({ images, interval = 2800, active = true, alt = '' }) {
  const [i, setI] = useState(0);
  useInterval(() => setI((n) => (n + 1) % images.length), interval, active && images.length > 1);
  return (
    <div className="slides">
      <div className="track" style={{ transform: `translateX(-${i * 100}%)` }}>
        {images.map((src, n) => <img key={src} src={src} alt={n === i ? alt : ''} draggable="false" />)}
      </div>
    </div>
  );
}

// Cross-fades between images.
export function ScreenFade({ images, index }) {
  return <div className="fade">{images.map((src, n) => <img key={src} src={src} alt="" className={n === index ? 'on' : ''} />)}</div>;
}

export const Check = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>;
export const Arrow = () => <span aria-hidden>→</span>;
