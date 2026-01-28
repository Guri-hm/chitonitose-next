const fs = require('fs');
const matter = require('gray-matter');
const { parseCustomMarkdown } = require('./markdown-to-html.js');

const fileContent = fs.readFileSync('content/jh/lessons/1.md', 'utf-8');
const { content: md } = matter(fileContent);  // フロントマター削除
const html = parseCustomMarkdown(md);

// 氷河時代を検索
const idx1 = html.indexOf('氷河時代');
console.log('=== 氷河時代周辺（フロントマター削除後） ===');
console.log(html.slice(idx1-100, idx1+100));

// Markdown該当行
const mdLines = md.split('\n');
const targetLine = mdLines.find(l => l.includes('氷河時代'));
console.log('\n=== Markdown元データ ===');
console.log(targetLine);

// その行だけを変換
const singleLineHtml = parseCustomMarkdown(targetLine);
console.log('\n=== 該当行のみ変換 ===');
console.log(singleLineHtml);
