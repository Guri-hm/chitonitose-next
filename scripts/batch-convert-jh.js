/**
 * 日本史レッスンを一括変換するスクリプト
 * Usage: node scripts/batch-convert-jh.js <start> <end>
 * Example: node scripts/batch-convert-jh.js 6 10
 */

const { execSync } = require('child_process');
const fs = require('fs');

const start = parseInt(process.argv[2], 10) || 6;
const end = parseInt(process.argv[3], 10) || 170;

console.log(`日本史レッスン ${start}～${end} を変換します...\n`);

for (let i = start; i <= end; i++) {
  const htmlPath = `origin/chitonitose/jh/jh_lessons${i}.html`;
  const mdPath = `content/jh/lessons/${i}.md`;
  
  // HTMLファイルが存在するかチェック
  if (!fs.existsSync(htmlPath)) {
    console.log(`⚠ スキップ: ${htmlPath} が見つかりません`);
    continue;
  }
  
  try {
    // 変換実行
    execSync(`node scripts/html-to-custom-md.js "${htmlPath}" "${mdPath}"`, {
      encoding: 'utf-8',
      stdio: 'pipe'
    });
    
    console.log(`✓ レッスン${i}を変換しました`);
  } catch (error) {
    console.error(`✗ レッスン${i}の変換に失敗: ${error.message}`);
  }
}

console.log(`\n完了！ ${start}～${end}の変換が終わりました。`);
