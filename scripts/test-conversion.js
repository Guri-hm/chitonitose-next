const fs = require('fs');
const matter = require('gray-matter');

// キャッシュをクリアして最新のモジュールを読み込む
delete require.cache[require.resolve('./markdown-to-html.js')];
const { parseCustomMarkdown } = require('./markdown-to-html.js');

const fileContent = fs.readFileSync('content/jh/lessons/1.md', 'utf-8');
const { content: md } = matter(fileContent);
const html = parseCustomMarkdown(md);

// HTMLをファイルに保存
fs.writeFileSync('scripts/test-output.html', html, 'utf-8');
console.log('=== 出力HTMLをscripts/test-output.htmlに保存しました ===\n');

console.log('=== DOM検証 ===');
console.log('Has ::top marker:', html.includes('::top'));
console.log('Has ::middle marker:', html.includes('::middle'));
console.log('Has ::last marker:', html.includes('::last'));
console.log('Has ::sup marker:', html.includes('::sup'));
console.log('');
console.log('Count <div class="top">:', (html.match(/<div class="top">/g) || []).length);
console.log('Count <div class="middle">:', (html.match(/<div class="middle">/g) || []).length);
console.log('Count <div class="last">:', (html.match(/<div class="last">/g) || []).length);
console.log('Count <div class="sup">:', (html.match(/<div class="sup">/g) || []).length);
console.log('');

// 最初の数行をサンプル出力
const lines = html.split('\n');
console.log('=== 出力HTMLサンプル（最初の30行） ===');
console.log(lines.slice(0, 30).join('\n'));
console.log('\n...\n');

// Ruby検証
console.log('=== Ruby検証 ===');
console.log('Has <ruby> tag:', html.includes('<ruby>'));
console.log('Count <ruby>:', (html.match(/<ruby>/g) || []).length);
console.log('Has {{ marker:', html.includes('{{'));
console.log('');

// onclick検証
console.log('=== onclick検証 ===');
console.log('Has onclick attr:', html.includes('onclick'));
console.log('Has [[ marker:', html.includes('[['));
console.log('');

// 赤文字検証
console.log('=== 赤文字検証 ===');
console.log('Has <font color:', html.includes('<font color'));
console.log('Count **:', (html.match(/\*\*/g) || []).length);
