const { readdirSync, readFileSync, statSync } = require('fs');
const { join, relative, sep } = require('path');

function walk(dir, exts, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, exts, out);
    else if (exts.some((ext) => full.endsWith(ext))) out.push(full);
  }
  return out;
}

function extractHrefs(files) {
  const hrefs = [];
  const hrefRe = /href\s*=\s*["'`]([^"'`]+)["'`]/g;
  const pushRe = /(?:router\.|navigation\.)push\(\s*["'`]([^"'`]+)["'`]/g;
  for (const file of files) {
    const text = readFileSync(file, 'utf8');
    for (const re of [hrefRe, pushRe]) {
      let m;
      while ((m = re.exec(text)) !== null) {
        hrefs.push({ file, href: m[1] });
      }
    }
  }
  return hrefs;
}

function getAppRoutes() {
  const pageFiles = walk('app', ['/page.tsx', '/page.ts', '/route.ts', '/route.tsx']);
  return pageFiles.map((file) => {
    let r = '/' + relative('app', file).replace(/\\/g, '/');
    r = r.replace(/\/(page|route)\.tsx?$/, '');
    r = r.replace(/\/\(.*?\)/g, '');
    r = r.replace(/\[locale\]/g, 'en');
    r = r.replace(/\[.*?\]/g, ':dynamic');
    r = r === '' ? '/' : r;
    return r;
  });
}

const files = [
  ...walk('app', ['.ts', '.tsx']),
  ...walk('components', ['.ts', '.tsx']),
];
const hrefs = extractHrefs(files);
const routes = getAppRoutes();

const broken = hrefs
  .filter(({ href }) => href.startsWith('/'))
  .filter(({ href }) => !href.startsWith('/api/'))
  .filter(({ href }) => !href.includes(':'))
  .filter(({ href }) => {
    const normalized = href.split('?')[0].replace(/\/$/, '') || '/';
    return !routes.some((route) => {
      const r = route.replace(/\/$/, '') || '/';
      if (r.includes(':dynamic')) {
        const prefix = r.split(':dynamic')[0];
        return normalized.startsWith(prefix);
      }
      return normalized === r;
    });
  });

console.log('BROKEN INTERNAL LINKS:');
for (const item of broken) console.log(`❌ ${item.href} (${item.file})`);
console.log(`\nTotal broken: ${broken.length}`);
