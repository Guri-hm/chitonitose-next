const fs = require('fs');
const { parseCustomMarkdown } = require('./markdown-to-html.js');

const md = fs.readFileSync('content/jh/lessons/1.md', 'utf-8');
const html = parseCustomMarkdown(md);

// 問題の箇所を抽出
const idx1 = html.indexOf('氷河時代');
const idx2 = html.indexOf('浜北人');
const idx3 = html.indexOf('炭素');
const idx4 = html.indexOf('野尻湖');

console.log('=== 氷河時代周辺 ===');
console.log(html.slice(idx1-100, idx1+100));

console.log('\n=== 野尻湖周辺 ===');
console.log(html.slice(idx4-100, idx4+100));

console.log('\n=== 浜北人周辺 ===');
console.log(html.slice(idx2-100, idx2+100));

console.log('\n=== 炭素周辺 ===');
console.log(html.slice(idx3-100, idx3+200));
