/**
 * MDXファイルのすべての問題を包括的に修正するスクリプト
 * 
 * 根本的な問題: MDXは<div>内で改行があると、それをパラグラフとして扱う
 * 解決策: すべてのdiv内のコンテンツを1行に統合する
 * 
 * Usage: node scripts/fix-mdx-complete.js <mdx-file-path>
 */

const fs = require('fs');

const filePath = process.argv[2];

if (!filePath) {
  console.error('使用方法: node scripts/fix-mdx-complete.js <mdx-file-path>');
  process.exit(1);
}

console.log(`修正中: ${filePath}`);

// UTF-8エンコーディングを明示的に指定
let content = fs.readFileSync(filePath, { encoding: 'utf-8' });

// 1. 複数行にまたがる<ruby>タグを1行に修正
content = content.replace(
  /<ruby>([^<]*?)<rt>([^<]*?)<\/rt>\s*\n\s*<\/ruby>/g,
  '<ruby>$1<rt>$2</rt></ruby>'
);

// 2. 【重要】gazo以外のdivで<br />とテキストが複数行にまたがるパターンを1行に統合
// gazoクラスはこの処理から除外（gazoの<br />は保持する必要がある）
content = content.replace(
  /<div className="(?!gazo)([^"]+)">\s*([^<\n]*.*?)<br \/>\s*\n([\s\S]*?)<\/div>/g,
  (match, className, firstLine, restContent) => {
    // 内容を1行に統合（改行とインデントを削除）
    const combined = (firstLine + '<br />' + restContent)
      .replace(/\n\s*/g, '')
      .trim();
    
    return `<div className="${className}">${combined}</div>`;
  }
);

// 3. gazo div内のパターンは元の形式を保持
content = content.replace(
  /<div className="gazo">(<img[^>]*\/>)<br \/>([^<\n]+)<\/div>/g,
  (match, img, text) => {
    return `<div className="gazo">\n\t\t${img}\n\t\t<br />\n\t\t${text.trim()}\n\t</div>`;
  }
);

// 4. 閉じタグが次の行にあるシンプルなパターン
content = content.replace(
  /<div className="([^"]+)">([^\n<][^\n]*?)\r?\n\s*<\/div>/g,
  '<div className="$1">$2</div>'
);

// 5. ネストしたdivで内部に改行がある場合（leadなど）
// これも1行に統合
content = content.replace(
  /<div className="([^"]+)">([^<]*)<div className="([^"]+)">([^<]*)<\/div>\s*\n\s*<\/div>/g,
  '<div className="$1">$2<div className="$3">$4</div></div>'
);

// UTF-8で保存
fs.writeFileSync(filePath, content, { encoding: 'utf-8' });

console.log('✓ 修正完了');
