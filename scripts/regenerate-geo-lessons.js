/**
 * content/geo/lessons/*.md を、対応するorigin/chitonitose/geo/geo_lessons_*.htmlから
 * htmlToCustomMarkdown()で再変換して上書きする（gazo単一行バグ修正後の再生成用）。
 * 対応するhtmlが存在しないmdファイルはスキップする。
 */
const fs = require('fs');
const path = require('path');
const { htmlToCustomMarkdown } = require('./markdown-to-html.js');

const contentDir = path.join(__dirname, '..', 'content', 'geo', 'lessons');
const originDir = path.join(__dirname, '..', 'origin', 'chitonitose', 'geo');

const mdFiles = fs.readdirSync(contentDir).filter((f) => f.endsWith('.md'));

const updated = [];
const skipped = [];

for (const mdFile of mdFiles) {
  const base = mdFile.replace(/\.md$/, '');
  const htmlPath = path.join(originDir, `geo_lessons_${base}.html`);

  if (!fs.existsSync(htmlPath)) {
    skipped.push(base);
    continue;
  }

  const html = fs.readFileSync(htmlPath, 'utf-8');
  const newMd = htmlToCustomMarkdown(html);

  if (!newMd || !newMd.trim()) {
    skipped.push(base + ' (empty output)');
    continue;
  }

  const mdPath = path.join(contentDir, mdFile);
  const oldMd = fs.readFileSync(mdPath, 'utf-8');

  if (oldMd.trim() === newMd.trim()) {
    continue; // 変化なし
  }

  fs.writeFileSync(mdPath, newMd, 'utf-8');
  updated.push(`${base} (${oldMd.split('\n').length} -> ${newMd.split('\n').length} lines)`);
}

console.log(`更新: ${updated.length}件`);
updated.forEach((u) => console.log('  ' + u));
console.log(`スキップ（対応html無し）: ${skipped.length}件`);
skipped.forEach((s) => console.log('  ' + s));
