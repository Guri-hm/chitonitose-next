// `next build` の後に実行する後処理（out/ に対して）。
//  1. 旧サイトURLのリダイレクト用スタブHTMLを作る（GitHub Pagesはサーバー側の301が使えないため）
//  2. sitemap.xml と robots.txt を作る
// 環境変数: SITE_URL（既定 https://chitonitose.com）、NEXT_PUBLIC_NOINDEX=true でクロール禁止
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const out = path.join(root, 'out');
const site = (process.env.SITE_URL || 'https://chitonitose.com').replace(/\/$/, '');
const noindex = process.env.NEXT_PUBLIC_NOINDEX === 'true';

const exists = (urlPath) => fs.existsSync(path.join(out, urlPath, 'index.html'));
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function stub(to) {
  const abs = `${site}${to}`;
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>ページが移動しました | ちとにとせ</title>
<meta name="viewport" content="width=device-width">
<link rel="canonical" href="${esc(abs)}">
<meta http-equiv="refresh" content="0;url=${esc(to)}">
<script>location.replace(${JSON.stringify(to)} + location.search + location.hash);</script>
</head>
<body>
<p>ページが移動しました。自動で移動しない場合は <a href="${esc(to)}">こちら</a> をクリックしてください。</p>
</body>
</html>
`;
}

// 1. リダイレクト
const legacy = JSON.parse(fs.readFileSync(path.join(root, 'data', 'legacy-urls.json'), 'utf8'));
let written = 0;
const unresolved = [];
for (const { from, to, fallback } of legacy) {
  const dest = exists(to === '/' ? '' : to) ? to : fallback && exists(fallback) ? fallback : null;
  if (!dest) {
    unresolved.push(from);
    continue;
  }
  const file = path.join(out, from);
  if (fs.existsSync(file)) continue;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, stub(dest));
  written++;
}
console.log(`[postbuild] redirect stubs: ${written} written, ${unresolved.length} unresolved`);
if (unresolved.length) console.warn('[postbuild] unresolved:', unresolved.slice(0, 10).join(', '));

// 2. sitemap.xml / robots.txt
const urls = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name === 'index.html') {
      const rel = path.relative(out, dir).split(path.sep).join('/');
      urls.push(rel ? `/${rel}/` : '/');
    }
  }
})(out);
urls.sort();
fs.writeFileSync(
  path.join(out, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${site}${u}</loc></url>`).join('\n') +
    `\n</urlset>\n`
);
fs.writeFileSync(
  path.join(out, 'robots.txt'),
  noindex ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`
);
console.log(`[postbuild] sitemap.xml: ${urls.length} urls, robots.txt (${noindex ? 'noindex' : 'index'})`);
