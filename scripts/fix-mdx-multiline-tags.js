/**
 * MDXファイルの複数行にまたがるタグを1行に修正するスクリプト
 * 主な対象: <ruby>タグ、<span>タグなど
 * Usage: node scripts/fix-mdx-multiline-tags.js <mdx-file-path>
 */

const fs = require('fs');
const path = require('path');

const filePath = process.argv[2];

if (!filePath) {
  console.error('使用方法: node scripts/fix-mdx-multiline-tags.js <mdx-file-path>');
  process.exit(1);
}

console.log(`修正中: ${filePath}`);

// UTF-8エンコーディングを明示的に指定
let content = fs.readFileSync(filePath, { encoding: 'utf-8' });

// 複数行にまたがる<ruby>タグを1行に修正
// パターン: <ruby>...の後に改行とタブがあり、その後</ruby>で閉じる
content = content.replace(
  /<ruby>([^<]*)<rt>([^<]*)<\/rt>\n\s*<\/ruby>/g,
  '<ruby>$1<rt>$2</rt></ruby>'
);

// より複雑なパターン: タグの開始から閉じタグまでが複数行
content = content.replace(
  /<ruby>([^<]*?)<rt>([^<]*?)(?:\n\s*)?<\/rt>\s*(?:\n\s*)?<\/ruby>/gs,
  '<ruby>$1<rt>$2</rt></ruby>'
);

// <span>タグの複数行も修正
content = content.replace(
  /<span([^>]*)>\n\s*([^<\n]+)\n\s*<\/span>/g,
  '<span$1>$2</span>'
);

// UTF-8で保存
fs.writeFileSync(filePath, content, { encoding: 'utf-8' });

console.log('✓ 修正完了');
