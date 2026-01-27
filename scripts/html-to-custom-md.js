/**
 * 既存のHTMLファイルをカスタムMarkdown形式に変換するスクリプト
 * 
 * Usage: node scripts/html-to-custom-md.js <html-file-path> <output-md-path>
 * Example: node scripts/html-to-custom-md.js origin/chitonitose/jh/jh_lessons1.html content/jh/lessons/1.md
 */

const fs = require('fs');
const path = require('path');
const { htmlToCustomMarkdown } = require('./markdown-to-html');

const htmlFilePath = process.argv[2];
const outputPath = process.argv[3];

if (!htmlFilePath || !outputPath) {
  console.error('使用方法: node scripts/html-to-custom-md.js <html-file-path> <output-md-path>');
  console.error('例: node scripts/html-to-custom-md.js origin/chitonitose/jh/jh_lessons1.html content/jh/lessons/1.md');
  process.exit(1);
}

console.log(`変換中: ${htmlFilePath} → ${outputPath}`);

// HTMLファイルを読み込み
let html = fs.readFileSync(htmlFilePath, 'utf-8');

// コンテンツ部分のみを抽出（<div id='toc-range' class="contents">内）
const contentMatch = html.match(/<div id='toc-range' class="contents">([\s\S]*?)<!-- \/contents -->/);
if (!contentMatch) {
  console.error('エラー: コンテンツセクションが見つかりません');
  console.error('HTMLファイルの構造を確認してください');
  process.exit(1);
}

let content = contentMatch[1];

// PHPインクルードとボタン、目次divを削除
content = content.replace(/<\?php[\s\S]*?\?>/g, '');
content = content.replace(/<!--[\s\S]*?-->/g, '');
content = content.replace(/<div id="toc"><\/div>/g, '');

// ファイル番号を抽出（例: jh_lessons1.html → 1）
const lessonMatch = htmlFilePath.match(/lessons(\d+)\.html/);
const lessonNo = lessonMatch ? lessonMatch[1] : '1';

// 科目を判定（jh, wh, geo）
let subject = 'jh';
if (htmlFilePath.includes('/wh/')) subject = 'wh';
if (htmlFilePath.includes('/geo/')) subject = 'geo';

// data-srcをsrcに変換
content = content.replace(/data-src="/g, 'src="');

// loading.svgを削除（lazyload用のプレースホルダー）
content = content.replace(/\s*src="[^"]*loading\.svg"\s*/g, '');

// 画像パスを修正（img/ → /share/img/1/）
content = content.replace(/src="img\//g, `src="/share/img/${lessonNo}/`);

// fontタグを完全に削除して中身だけ残す（後でカスタム記法に変換）
content = content.replace(/<font color="([^"]+)">([^<]+(?:<[^\/][^>]*>[^<]*<\/[^>]*>)*[^<]*)<\/font>/g, '$2');

// class を className に変換（JavaScriptでの処理を考慮）
content = content.replace(/class="/g, 'className="');

// onclick を onClick に変換
content = content.replace(/onclick="/g, 'onClick="');

// カスタムMarkdownに変換
const markdown = htmlToCustomMarkdown(content);

// フロントマターを追加
const finalMarkdown = `---
subject: ${subject}
lessonNo: ${lessonNo}
---

${markdown}
`;

// 出力ディレクトリを作成
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// ファイルに書き込み
fs.writeFileSync(outputPath, finalMarkdown, 'utf-8');

console.log(`✓ 変換完了: ${outputPath}`);
console.log('\n---プレビュー---');
console.log(finalMarkdown.substring(0, 500) + '...\n');
