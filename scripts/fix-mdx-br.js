/**
 * MDXファイルの<br />とテキスト混在問題を修正するスクリプト
 * Usage: node scripts/fix-mdx-br.js <mdx-file-path>
 */

const fs = require('fs');
const path = require('path');

const filePath = process.argv[2];

if (!filePath) {
  console.error('使用方法: node scripts/fix-mdx-br.js <mdx-file-path>');
  process.exit(1);
}

console.log(`修正中: ${filePath}`);

// UTF-8エンコーディングを明示的に指定
let content = fs.readFileSync(filePath, { encoding: 'utf-8' });

// パターン1: <div className="gazo"><img .../><br />テキスト</div>
// これを複数行に分割
content = content.replace(
  /<div className="gazo">(<img[^>]*\/>)<br \/>([^<\n]+)<\/div>/g,
  (match, img, text) => {
    return `<div className="gazo">\n\t\t${img}\n\t\t<br />\n\t\t${text.trim()}\n\t</div>`;
  }
);

// パターン2: 既に改行があるが、imgとbrが同じ行にある場合
content = content.replace(
  /<div className="gazo">(<img[^>]*\/>)<br \/>\n\t\t([^<\n]+)<\/div>/g,
  (match, img, text) => {
    return `<div className="gazo">\n\t\t${img}\n\t\t<br />\n\t\t${text.trim()}\n\t</div>`;
  }
);

// パターン3: <br />の後に複数行のテキストがある場合
content = content.replace(
  /<div className="gazo">(<img[^>]*\/>)<br \/>([^<]*?)<\/div>/gs,
  (match, img, text) => {
    const trimmedText = text.trim();
    if (trimmedText) {
      const lines = trimmedText.split(/\n/).map(line => line.trim()).filter(line => line);
      if (lines.length > 0) {
        return `<div className="gazo">\n\t\t${img}\n\t\t<br />\n\t\t${lines.join('\n\t\t')}\n\t</div>`;
      }
    }
    return `<div className="gazo">\n\t\t${img}\n\t</div>`;
  }
);

// UTF-8で保存
fs.writeFileSync(filePath, content, { encoding: 'utf-8' });

console.log('✓ 修正完了');
