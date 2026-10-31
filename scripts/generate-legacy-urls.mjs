// 旧サイト（PHP/さくら）のURL → 新サイトのURL の対応表（data/legacy-urls.json）を作る。
// 元サイトのファイル一覧（origin/chitonitose）とsitemap.xmlから作成し、結果をコミットしておく
// （CIには origin/ が無いため、postbuild.mjs はこのJSONだけを読む）。
//   node scripts/generate-legacy-urls.mjs
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const origin = path.join(root, 'origin', 'chitonitose');

function listHtml(dir) {
  return fs.readdirSync(path.join(origin, dir)).filter((f) => f.endsWith('.html'));
}

const entries = new Map(); // from -> { to, fallback }
function add(from, to, fallback) {
  entries.set(from, { from, to, fallback: fallback ?? null });
}

add('/index.html', '/');
add('/guide/guide.html', '/guide/');
add('/other/jh/kyukokumei.html', '/jh/old-country-name/', '/jh/');

for (const f of listHtml('geo')) {
  const name = f.replace(/\.html$/, '');
  const from = `/geo/${f}`;
  if (name === 'geo') add(from, '/geo/');
  else if (name.startsWith('geo_lessons_')) add(from, `/geo/${name.slice('geo_lessons_'.length)}/`, '/geo/');
  else add(from, `/geo/${name}/`, '/geo/');
}

const jhFixed = {
  jh: '/jh/',
  jh_old_country_name: '/jh/old-country-name/',
  jh_print: '/jh/print/',
  jh_exercises_q_a: '/jh/q-a/',
  jh_cabinet: '/jh/cabinet/',
  jh_cabinet2: '/jh/cabinet-events/',
  jh_omnibus_agriculture_industrial_history: '/jh/agriculture-industrial-history/',
};
for (const f of listHtml('jh')) {
  const name = f.replace(/\.html$/, '');
  const from = `/jh/${f}`;
  let m;
  if (jhFixed[name]) add(from, jhFixed[name], '/jh/');
  else if ((m = name.match(/^jh_lessons(\d+)$/))) add(from, `/jh/lessons/${m[1]}/`, '/jh/');
  else if ((m = name.match(/^jh_omnibus_cultural_history(\d+)$/))) add(from, `/jh/cultural-history/${m[1]}/`, '/jh/');
  else if ((m = name.match(/^jh_omnibus(\d+)$/))) add(from, `/jh/omnibus/${m[1]}/`, '/jh/');
  else add(from, '/jh/');
}

const whFixed = {
  wh: '/wh/',
  wh_print: '/wh/print/',
  wh_exercises_q_a: '/wh/q-a/',
  wh_nomad: '/wh/omnibus/1/',
};
for (const f of listHtml('wh')) {
  const name = f.replace(/\.html$/, '');
  const from = `/wh/${f}`;
  let m;
  if (whFixed[name]) add(from, whFixed[name], '/wh/');
  else if ((m = name.match(/^wh_lessons(\d+)$/))) add(from, `/wh/lessons/${m[1]}/`, '/wh/');
  else add(from, '/wh/');
}

// jh/pdf/jh_print.html のようにファイルが無くてもリンクされているものはsitemapから拾う
const sitemap = fs.readFileSync(path.join(origin, 'sitemap.xml'), 'utf8');
for (const m of sitemap.matchAll(/<loc>https:\/\/chitonitose\.com([^<?]*)(?:\?[^<]*)?<\/loc>/g)) {
  const p = m[1];
  if (!p.endsWith('.html') || entries.has(p)) continue;
  if (p === '/jh/pdf/jh_print.html') add(p, '/jh/print/', '/jh/');
  else if (p === '/wh/pdf/wh_print.html') add(p, '/wh/print/', '/wh/');
}

const list = [...entries.values()].sort((a, b) => a.from.localeCompare(b.from));
fs.writeFileSync(path.join(root, 'data', 'legacy-urls.json'), JSON.stringify(list, null, 2) + '\n');
console.log(`legacy-urls.json: ${list.length} entries`);
