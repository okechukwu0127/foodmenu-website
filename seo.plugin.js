// Build-time SEO for the LiberQ website:
//  • fills __SITE_URL__ in index.html with VITE_SITE_URL (default https://liberq.co.uk)
//  • writes real HTML files for /privacy-policy and /terms-conditions with their own
//    title, description and share details (social apps don't run JavaScript)
//  • writes robots.txt and sitemap.xml
import fs from 'node:fs';
import path from 'node:path';

const PAGES = [
  { path: '/privacy-policy', title: 'Privacy Policy - LiberQ', description: 'How LiberQ collects, uses and protects personal data for restaurants, partners, beta testers and customers ordering through LiberQ-powered apps.' },
  { path: '/terms-conditions', title: 'Terms and Conditions - LiberQ', description: 'The terms for using LiberQ: the website, restaurant subscriptions, the partner programme, ordering through LiberQ-powered apps and beta testing.' },
];

const swap = (html, page, site) => {
  const url = `${site}${page.path}`;
  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${page.title}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${page.description}`)
    .replace(/(<link rel="canonical" href=")[^"]*/, `$1${url}`)
    .replace(/(<meta property="og:url" content=")[^"]*/, `$1${url}`)
    .replace(/(<meta property="og:type" content=")[^"]*/, '$1article')
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${page.title}`)
    .replace(/(<meta property="og:description" content=")[^"]*/, `$1${page.description}`)
    .replace(/(<meta name="twitter:title" content=")[^"]*/, `$1${page.title}`)
    .replace(/(<meta name="twitter:description" content=")[^"]*/, `$1${page.description}`);
};

export default function seo() {
  let site = 'https://liberq.co.uk';
  let outDir = 'dist';
  return {
    name: 'liberq-seo',
    configResolved(config) {
      site = (config.env.VITE_SITE_URL || site).replace(/\/+$/, '');
      outDir = path.resolve(config.root, config.build.outDir);
    },
    transformIndexHtml(html) {
      return html.replaceAll('__SITE_URL__', site);
    },
    closeBundle() {
      const indexFile = path.join(outDir, 'index.html');
      if (!fs.existsSync(indexFile)) return;
      const html = fs.readFileSync(indexFile, 'utf8');
      for (const page of PAGES) {
        const dir = path.join(outDir, page.path);
        const pageHtml = swap(html, page, site);
        // Both shapes, so any host serves it at /privacy-policy with its own share details.
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, 'index.html'), pageHtml);
        fs.writeFileSync(`${dir}.html`, pageHtml);
      }
      const today = new Date().toISOString().slice(0, 10);
      const urls = [{ loc: `${site}/`, priority: '1.0', freq: 'weekly' }, ...PAGES.map((p) => ({ loc: `${site}${p.path}`, priority: '0.3', freq: 'yearly' }))];
      fs.writeFileSync(path.join(outDir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${today}</lastmod><changefreq>${u.freq}</changefreq><priority>${u.priority}</priority></url>`).join('\n')}\n</urlset>\n`);
      fs.writeFileSync(path.join(outDir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`);
    },
  };
}
