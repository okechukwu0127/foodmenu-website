import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import 'lenis/dist/lenis.css';
import './styles.css';
import App from './App.jsx';
import Legal from './components/Legal.jsx';
import { legalPages } from './legal/legal.config.js';

// /privacy-policy and /terms-conditions are their own pages; everything else is the one-page site.
const path = window.location.pathname.replace(/\/+$/, '') || '/';
const legalPage = legalPages[path];
createRoot(document.getElementById('root')).render(<React.StrictMode>{legalPage ? <Legal page={legalPage} /> : <App />}</React.StrictMode>);
