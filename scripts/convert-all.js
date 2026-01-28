const fs = require('fs');
const path = require('path');
const { convertHtmlToMarkdown } = require('./html-to-md.js');

const dirs = [
  { html: 'origin/chitonitose/jh', md: 'content/jh/lessons', prefix: 'jh_lessons' },
  { html: 'origin/chitonitose/geo', md: 'content/geo/lessons', prefix: 'geo_lessons' },
  { html: 'origin/chitonitose/wh', md: 'content/wh/lessons', prefix: 'wh_lessons' }
];

let total = 0;

dirs.forEach(dir => {
  const htmlDir = path.join(process.cwd(), dir.html);
  const mdDir = path.join(process.cwd(), dir.md);
  
  const files = fs.readdirSync(htmlDir).filter(f => f.startsWith(dir.prefix) && f.endsWith('.html'));
  
  console.log(`\n=== ${dir.prefix} 変換開始 ===`);
  console.log(`対象: ${files.length}ファイル`);
  
  files.forEach(file => {
    const htmlPath = path.join(htmlDir, file);
    const markdown = convertHtmlToMarkdown(htmlPath);
    
    // ファイル名: jh_lessons1.html → 1.md
    let mdName = file.replace(dir.prefix, '').replace('.html', '.md');
    // geo_lessons_Africa.html → Africa.md
    mdName = mdName.replace(/^_/, '');
    
    const mdPath = path.join(mdDir, mdName);
    fs.writeFileSync(mdPath, markdown, 'utf-8');
  });
  
  console.log(`${dir.prefix} 完了`);
  total += files.length;
});

console.log(`\n✅ 合計 ${total}ファイル変換完了`);
