import { Fragment, useEffect, useMemo, useState } from 'react';
import termsMd from '../legal/terms.md?raw';
import privacyMd from '../legal/privacy.md?raw';
import { legal } from '../legal/legal.config.js';
import { Footer } from './Bottom.jsx';

const SOURCES = { terms: termsMd, privacy: privacyMd };
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// Inline: **bold**, [text](url), and [PLACEHOLDERS] highlighted until filled in.
function inline(text, key = 'i') {
  const out = []; let rest = text; let n = 0;
  const re = /(\*\*([^*]+)\*\*)|(\[([^\]]+)\]\(([^)]+)\))|(\[[A-Z][^\]]*\])/;
  while (rest) {
    const m = rest.match(re);
    if (!m) { out.push(rest); break; }
    if (m.index) out.push(rest.slice(0, m.index));
    const k = `${key}-${n++}`;
    if (m[1]) out.push(<strong key={k}>{inline(m[2], k)}</strong>);
    else if (m[3]) out.push(<a key={k} href={m[5]} {...(/^https?:/.test(m[5]) ? { target: '_blank', rel: 'noopener' } : {})}>{m[4]}</a>);
    else out.push(<mark key={k} className="ph" title="Fill this in in src/legal/legal.config.js">{m[6]}</mark>);
    rest = rest.slice(m.index + m[0].length);
  }
  return out;
}

// A deliberately small Markdown reader for the legal pages: headings, paragraphs, lists, tables.
function parse(md) {
  const filled = md.replace(/\{\{(\w+)\}\}/g, (_, k) => legal[k] ?? `[${k}]`);
  const lines = filled.split('\n');
  const blocks = []; let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (!l.trim()) { i++; continue; }
    const h = l.match(/^(#{1,3})\s+(.*)/);
    if (h) { blocks.push({ t: `h${h[1].length}`, text: h[2], id: slug(h[2]) }); i++; continue; }
    if (l.startsWith('|')) {
      const rows = [];
      while (i < lines.length && lines[i].startsWith('|')) { rows.push(lines[i]); i++; }
      const cells = (r) => r.split('|').slice(1, -1).map((c) => c.trim());
      blocks.push({ t: 'table', head: cells(rows[0]), body: rows.slice(2).map(cells) });
      continue;
    }
    if (/^- /.test(l)) {
      const items = [];
      while (i < lines.length && /^- /.test(lines[i])) { items.push(lines[i].slice(2)); i++; }
      blocks.push({ t: 'ul', items }); continue;
    }
    const para = [];
    while (i < lines.length && lines[i].trim() && !/^(#|\||- )/.test(lines[i])) { para.push(lines[i]); i++; }
    blocks.push({ t: 'p', text: para.join(' ') });
  }
  return blocks;
}

export default function Legal({ page }) {
  const blocks = useMemo(() => parse(SOURCES[page.key]), [page.key]);
  const title = blocks.find((b) => b.t === 'h1')?.text || page.title;
  const toc = blocks.filter((b) => b.t === 'h2');
  const [active, setActive] = useState(toc[0]?.id);
  useEffect(() => {
    document.title = `${title} — Liberq`;
    window.scrollTo(0, 0);
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-20% 0px -70% 0px' });
    document.querySelectorAll('.legal-body h2').forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [title]);
  const other = page.key === 'terms' ? ['/privacy-policy', 'Privacy Policy'] : ['/terms-conditions', 'Terms and Conditions'];
  return (
    <>
      <nav className="nav solid"><div className="wrap navin">
        <a className="logo" href="/" aria-label="Liberq home"><img src="/assets/brand/logo.svg" alt="Liberq" /></a>
        <div className="navr legal-navr"><a href={other[0]}>{other[1]}</a><a className="btn btn-main sm" href="/">Back to site</a></div>
      </div></nav>
      <main className="legal">
        <header className="legal-head"><div className="wrap">
          <div className="eyebrow">Legal</div>
          <h1 className="serif">{title}</h1>
          <p className="muted">{inline(blocks.find((b) => b.t === 'p')?.text || '')}</p>
        </div></header>
        <div className="wrap legal-grid">
          <aside className="legal-toc" aria-label="On this page">
            <div className="legal-toc-t">On this page</div>
            {toc.map((h) => <a key={h.id} href={`#${h.id}`} className={active === h.id ? 'on' : ''}>{h.text}</a>)}
            <button className="btn btn-line sm legal-print" onClick={() => window.print()}>Print or save as PDF</button>
          </aside>
          <article className="legal-body">
            {blocks.slice(2).map((b, n) => {
              const k = `b${n}`;
              if (b.t === 'h2') return <h2 key={k} id={b.id}>{b.text}</h2>;
              if (b.t === 'h3') return <h3 key={k} id={b.id}>{b.text}</h3>;
              if (b.t === 'ul') return <ul key={k}>{b.items.map((it, j) => <li key={j}>{inline(it, `${k}-${j}`)}</li>)}</ul>;
              if (b.t === 'table') return (
                <div key={k} className="legal-table"><table>
                  <thead><tr>{b.head.map((c, j) => <th key={j}>{inline(c)}</th>)}</tr></thead>
                  <tbody>{b.body.map((r, j) => <tr key={j}>{r.map((c, x) => <td key={x}>{inline(c, `${k}-${j}-${x}`)}</td>)}</tr>)}</tbody>
                </table></div>
              );
              return <p key={k}>{inline(b.text, k)}</p>;
            })}
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
