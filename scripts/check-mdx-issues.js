/**
 * MDXファイルの問題パターンをチェックするスクリプト
 * Usage: node scripts/check-mdx-issues.js <mdx-file-path>
 */

const fs = require('fs');

const filePath = process.argv[2];

if (!filePath) {
  console.error('使用方法: node scripts/check-mdx-issues.js <mdx-file-path>');
  process.exit(1);
}

console.log(`チェック中: ${filePath}\n`);

const content = fs.readFileSync(filePath, { encoding: 'utf-8' });
const lines = content.split('\n');

let issueCount = 0;

// パターン1: 複数行にまたがる<ruby>タグ
const rubyPattern = /<ruby>([^<]*)<rt>([^<]*)<\/rt>\s*\n/g;
let match;
while ((match = rubyPattern.exec(content)) !== null) {
  issueCount++;
  const lineNum = content.substring(0, match.index).split('\n').length;
  console.log(`❌ 問題1: 複数行rubyタグ (行${lineNum})`);
  console.log(`   ${match[0].replace(/\n/g, '\\n')}\n`);
}

// パターン2: 閉じタグが次の行にあるdiv
const divPattern = /<div className="([^"]+)">([^\n<][^\n]*?)\n\s*<\/div>/g;
while ((match = divPattern.exec(content)) !== null) {
  issueCount++;
  const lineNum = content.substring(0, match.index).split('\n').length;
  console.log(`❌ 問題2: 閉じタグが次の行 (行${lineNum}): className="${match[1]}"`);
  console.log(`   内容: ${match[2].substring(0, 50)}...`);
  console.log(`   修正後: <div className="${match[1]}">${match[2]}</div>\n`);
}

// パターン3: 複数行にまたがるdiv（ブロック要素を含まない）
const multilineDivPattern = /<div className="([^"]+)">\n([^<]+)\n([^<]+)\n\s*<\/div>/g;
while ((match = multilineDivPattern.exec(content)) !== null) {
  issueCount++;
  const lineNum = content.substring(0, match.index).split('\n').length;
  console.log(`❌ 問題3: 複数行div (行${lineNum}): className="${match[1]}"`);
  console.log(`   1行目: ${match[2].trim().substring(0, 50)}...`);
  console.log(`   2行目: ${match[3].trim().substring(0, 50)}...\n`);
}

if (issueCount === 0) {
  console.log('✅ 問題は見つかりませんでした！');
} else {
  console.log(`\n合計 ${issueCount} 個の問題が見つかりました。`);
  console.log('fix-mdx-complete.js を実行して修正してください。');
}
