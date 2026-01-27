/**
 * 複数のレッスンを一括でMDXに変換するスクリプト
 * 
 * 使用方法:
 * node scripts/batch-convert-mdx.js jh 1 10
 * 
 * 引数:
 * 1. subject: jh, wh, geo
 * 2. start: 開始番号
 * 3. end: 終了番号
 */

const { execSync } = require('child_process');

const args = process.argv.slice(2);
const subject = args[0];
const start = parseInt(args[1], 10);
const end = parseInt(args[2], 10);

if (!subject || isNaN(start) || isNaN(end)) {
  console.error('使用方法: node scripts/batch-convert-mdx.js <subject> <start> <end>');
  console.error('例: node scripts/batch-convert-mdx.js jh 1 10');
  process.exit(1);
}

console.log(`${subject}のレッスン${start}～${end}を一括変換します...\n`);

let successCount = 0;
let errorCount = 0;

for (let i = start; i <= end; i++) {
  try {
    console.log(`[${i}/${end}] レッスン${i}を変換中...`);
    execSync(`node scripts/html-to-mdx.js ${subject} ${i}`, { 
      stdio: 'inherit',
      encoding: 'utf-8'
    });
    successCount++;
  } catch (error) {
    console.error(`✗ レッスン${i}の変換に失敗しました`);
    errorCount++;
  }
  console.log('');
}

console.log('='.repeat(50));
console.log(`変換完了: 成功 ${successCount}件 / 失敗 ${errorCount}件`);
console.log('='.repeat(50));
