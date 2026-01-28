const fs = require('fs');
const path = require('path');
const { convertHtmlToMarkdown } = require('./html-to-md-simple.js');

// 変換対象
const categories = [
  { origin: 'origin/chitonitose/jh', pattern: 'jh_lessons', output: 'content/jh/lessons' },
  { origin: 'origin/chitonitose/geo', pattern: 'geo_lessons', output: 'content/geo/lessons' },
  { origin: 'origin/chitonitose/wh', pattern: 'wh_lessons', output: 'content/wh/lessons' }
];

let totalConverted = 0;

categories.forEach(({ origin, pattern, output }) => {
  console.log(`\n=== ${pattern} 変換開始 ===`);
  
  if (!fs.existsSync(output)) {
    fs.mkdirSync(output, { recursive: true });
  }
  
  const files = fs.readdirSync(origin).filter(f => 
    f.startsWith(pattern) && 
    f.endsWith('.html') && 
    !f.includes('template')
  );
  
  console.log(`対象: ${files.length}ファイル`);
  
  files.forEach((file, index) => {
    const inputPath = path.join(origin, file);
    const markdown = convertHtmlToMarkdown(inputPath);
    
    // ファイル名決定
    let outputFileName;
    if (file.match(/lessons(\d+)\.html/)) {
      outputFileName = file.match(/lessons(\d+)\.html/)[1] + '.md';
    } else {
      outputFileName = file
        .replace(pattern + '_', '')
        .replace('.html', '.md');
    }
    
    const outputPath = path.join(output, outputFileName);
    fs.writeFileSync(outputPath, markdown, 'utf-8');
    
    totalConverted++;
    
    if ((index + 1) % 20 === 0) {
      console.log(`  ${index + 1}/${files.length} 完了`);
    }
  });
  
  console.log(`${pattern} 完了`);
});

console.log(`\n✅ 合計 ${totalConverted}ファイル変換完了`);
