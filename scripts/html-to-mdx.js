/**
 * HTMLレッスンファイルをMDX形式に変換するスクリプト
 * 
 * 使用方法:
 * node scripts/html-to-mdx.js jh 1
 * 
 * 引数:
 * 1. subject: jh, wh, geo
 * 2. lesson_no: レッスン番号（地理の場合はファイル名）
 */

const fs = require('fs');
const path = require('path');

// コマンドライン引数を取得
const args = process.argv.slice(2);
const subject = args[0]; // jh, wh, geo
const lessonNo = args[1]; // レッスン番号

if (!subject || !lessonNo) {
  console.error('使用方法: node scripts/html-to-mdx.js <subject> <lesson_no>');
  console.error('例: node scripts/html-to-mdx.js jh 1');
  process.exit(1);
}

// パス設定
const originDir = path.join(__dirname, '..', 'origin', 'chitonitose', subject);
let inputFile;
let outputDir;
let outputFile;

if (subject === 'geo') {
  // 地理はファイル名ベース
  inputFile = path.join(originDir, `${lessonNo}.html`);
  outputDir = path.join(__dirname, '..', 'content', subject);
  outputFile = path.join(outputDir, `${lessonNo}.mdx`);
} else {
  // 日本史・世界史は番号ベース
  inputFile = path.join(originDir, `${subject}_lessons${lessonNo}.html`);
  outputDir = path.join(__dirname, '..', 'content', subject, 'lessons');
  outputFile = path.join(outputDir, `${lessonNo}.mdx`);
}

console.log(`変換開始: ${inputFile} -> ${outputFile}`);

// 入力ファイルの存在確認
if (!fs.existsSync(inputFile)) {
  console.error(`エラー: 入力ファイルが見つかりません: ${inputFile}`);
  process.exit(1);
}

// 出力ディレクトリの作成
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// HTMLファイルを読み込み
let htmlContent = fs.readFileSync(inputFile, 'utf-8');

// PHP includeを除去
htmlContent = htmlContent.replace(/<\?php.*?\?>/gs, '');

// <div id='toc-range' class="contents">...</div>のコンテンツのみを抽出
const contentsMatch = htmlContent.match(/<div[^>]*id=['"]toc-range['"][^>]*>(.*?)<\/div>\s*<\?php include/s);
let mainContent = contentsMatch ? contentsMatch[1] : htmlContent;

// HTMLタグをMDX互換に変換
mainContent = mainContent
  // コメントを除去
  .replace(/<!--.*?-->/gs, '')
  
  // PHPタグを除去
  .replace(/<\?php.*?\?>/gs, '')
  
  // data-src を src に変更（lazyload対応）
  .replace(/data-src=/g, 'src=')
  
  // loading.svgのsrc属性を除去（重複除去）
  .replace(/\s+src="[^"]*loading\.svg"/g, '')
  
  // <br> を <br /> に統一（self-closing）
  .replace(/<br>/gi, '<br />')
  
  // <br />の後のテキストを別のdivに分離（MDX互換のため）
  .replace(/(<\/img>)<br \/>(.*?)<br \/>(.*?)(\s*<\/div>)/g, '$1{" "}<br />{" "}$2{" "}<br />{" "}$3$4')
  
  // class を className に変更
  .replace(/class=/g, 'className=')
  
  // onclick を onClick に変更  
  .replace(/onclick=/g, 'onClick=')
  
  // oncontextmenu を onContextMenu に変更
  .replace(/oncontextmenu=/g, 'onContextMenu=')
  
  // font タグを span に変更
  .replace(/<font color="([^"]+)">([^<]+)<\/font>/g, '<span style={{color:"$1"}}>$2</span>')
  .replace(/<font color="([^"]+)">(.*?)<\/font>/gs, '<span style={{color:"$1"}}>$2</span>')
  
  // 画像パスを修正
  .replace(/src="img\//g, 'src="/share/img/')
  .replace(/src="\.\.\/share\/img\//g, 'src="/share/img/')
  
  // 自己閉じタグに修正
  .replace(/<img([^>]*[^\/])>/g, '<img$1 />')
  
  // 不要な属性を整理
  .replace(/\s+src=""/g, '')
  
  // 改行を整理
  .replace(/\n\s*\n\s*\n/g, '\n\n')
  .trim();

// MDX互換のために複数行にまたがるタグを1行に修正
// <ruby>タグの修正
mainContent = mainContent.replace(
  /<ruby>([^<]*)<rt>([^<]*)<\/rt>\n\s*<\/ruby>/g,
  '<ruby>$1<rt>$2</rt></ruby>'
);

// より複雑なパターン
mainContent = mainContent.replace(
  /<ruby>([^<]*?)<rt>([^<]*?)(?:\n\s*)?<\/rt>\s*(?:\n\s*)?<\/ruby>/gs,
  '<ruby>$1<rt>$2</rt></ruby>'
);

// gazo div内のimg+br+textパターンを適切にフォーマット
mainContent = mainContent.replace(
  /<div className="gazo">(<img[^>]*\/>)<br \/>([^<\n]+)<\/div>/g,
  (match, img, text) => {
    return `<div className="gazo">\n\t\t${img}\n\t\t<br />\n\t\t${text.trim()}\n\t</div>`;
  }
);

// top/middle/lastクラスのdivで複数行にまたがるテキストを1行に統一
mainContent = mainContent.replace(
  /<div className="(top|middle|last)">\n([\s\S]*?)<\/div>/g,
  (match, className, innerContent) => {
    // 内部にdivやh2などのブロック要素がある場合は変更しない
    if (/<(?:div|h[1-6]|p|ul|ol|table)[\s>]/.test(innerContent)) {
      return match;
    }
    
    // 複数行のテキストとインライン要素を1行に結合
    const lines = innerContent.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    if (lines.length > 1) {
      const combined = lines.join('');
      return `<div className="${className}">${combined}</div>`;
    }
    
    // 1行の場合もトリムして整形
    if (lines.length === 1) {
      return `<div className="${className}">${lines[0]}</div>`;
    }
    
    return match;
  }
);

// MDXファイルのフロントマター作成
const frontMatter = `---
subject: ${subject}
lessonNo: ${lessonNo}
---

`;

// MDXファイルを作成
const mdxContent = frontMatter + mainContent;

// ファイルを保存
fs.writeFileSync(outputFile, mdxContent, 'utf-8');

console.log(`✓ 変換完了: ${outputFile}`);
console.log(`\nMDXファイルを確認してください。必要に応じて手動で調整してください。`);
