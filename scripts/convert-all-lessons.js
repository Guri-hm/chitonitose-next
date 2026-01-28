const fs = require('fs');
const path = require('path');
const { htmlToCustomMarkdown } = require('./markdown-to-html.js');

// 変換対象のディレクトリ
const categories = [
  { origin: 'origin/chitonitose/jh', pattern: 'jh_lessons', output: 'content/jh/lessons' },
  { origin: 'origin/chitonitose/geo', pattern: 'geo_lessons', output: 'content/geo/lessons' },
  { origin: 'origin/chitonitose/wh', pattern: 'wh_lessons', output: 'content/wh/lessons' }
];

let totalConverted = 0;
let totalErrors = 0;

categories.forEach(({ origin, pattern, output }) => {
  console.log(`\n=== ${pattern} の変換開始 ===`);
  
  // 出力ディレクトリを作成
  if (!fs.existsSync(output)) {
    fs.mkdirSync(output, { recursive: true });
  }
  
  // HTMLファイルを取得
  const files = fs.readdirSync(origin).filter(f => 
    f.startsWith(pattern) && 
    f.endsWith('.html') && 
    !f.includes('template')
  );
  
  console.log(`対象ファイル数: ${files.length}`);
  
  files.forEach((file, index) => {
    try {
      const inputPath = path.join(origin, file);
      const html = fs.readFileSync(inputPath, 'utf-8');
      
      // HTML→Markdownに変換
      const markdown = htmlToCustomMarkdown(html);
      
      // ファイル名を決定 (jh_lessons1.html → 1.md)
      let outputFileName;
      if (file.match(/lessons(\d+)\.html/)) {
        outputFileName = file.match(/lessons(\d+)\.html/)[1] + '.md';
      } else {
        // geo_lessons_Africa.html → Africa.md
        outputFileName = file
          .replace(pattern + '_', '')
          .replace('.html', '.md');
      }
      
      const outputPath = path.join(output, outputFileName);
      fs.writeFileSync(outputPath, markdown, 'utf-8');
      
      totalConverted++;
      
      if ((index + 1) % 10 === 0) {
        console.log(`  ${index + 1}/${files.length} 変換完了`);
      }
    } catch (error) {
      console.error(`  エラー: ${file} - ${error.message}`);
      totalErrors++;
    }
  });
  
  console.log(`${pattern} 完了: ${files.length}ファイル`);
});

console.log(`\n=== 変換完了 ===`);
console.log(`成功: ${totalConverted}ファイル`);
console.log(`エラー: ${totalErrors}ファイル`);
