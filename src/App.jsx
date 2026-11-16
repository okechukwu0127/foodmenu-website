import { useEffect, useState } from 'react';
import { looks } from './content.js';
import { safeGet, safeSet } from './lib/hooks.js';
import { startMotion } from './lib/motion.js';
import Sparkles from './components/Sparkles.jsx';
import { Nav, Hero } from './components/Top.jsx';
import { Strip, Problem, How, Brands, AiWaiter } from './components/Story.jsx';
import Dashboard from './components/Dashboard.jsx';
import { Six, Contact, Footer } from './components/Bottom.jsx';
import Brochure from './components/Brochure.jsx';
import LiveDemo from './components/LiveDemo.jsx';

const modeFromHash = () => (window.location.hash === '#partners' ? 'partner' : 'restaurant');

// First visit = Aurora; later visits pick a random look; ?look=aurora|dusk|noir forces one.
function pickLook() {
  const q = new URLSearchParams(window.location.search).get('look');
  if (q && looks.some((l) => l.id === q)) return q;
  if (!safeGet('liberq-visited')) { safeSet('liberq-visited', '1'); return looks[0].id; }
  return looks[Math.floor(Math.random() * looks.length)].id;
}

export default function App() {
  const [mode, setModeState] = useState(modeFromHash);
  const [look, setLook] = useState(pickLook);

  const setMode = (m) => {
    setModeState(m);
    window.history.replaceState(null, '', m === 'partner' ? '#partners' : '#restaurants');
  };

  useEffect(() => { document.body.dataset.mode = mode; }, [mode]);
  useEffect(() => startMotion(), []);
  useEffect(() => {
    const on = () => { if (['#partners', '#restaurants'].includes(window.location.hash)) setModeState(modeFromHash()); };
    window.addEventListener('hashchange', on); return () => window.removeEventListener('hashchange', on);
  }, []);

  return (
    <>
      <Sparkles />
      <Nav mode={mode} setMode={setMode} />
      <main>
        <Hero mode={mode} look={look} setLook={setLook} />
        <Strip />
        <Problem mode={mode} />
        <How mode={mode} />
        <Brands mode={mode} />
        <LiveDemo mode={mode} />
        <AiWaiter mode={mode} />
        <Dashboard mode={mode} />
        <Six mode={mode} />
        <Brochure mode={mode} />
        <Contact mode={mode} />
      </main>
      <Footer />
    </>
  );
}
