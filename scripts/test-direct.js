const fs = require('fs');
const matter = require('gray-matter');
const path = require('path');

// markdown-to-html.jsの内容を直接読み込む
const moduleCode = fs.readFileSync(path.join(__dirname, 'markdown-to-html.js'), 'utf-8');

// evalで評価
eval(moduleCode);

// テスト
const fileContent = fs.readFileSync('content/jh/lessons/1.md', 'utf-8');
const { content: md } = matter(fileContent);

console.log('=== Markdown input (around 氷河時代) ===');
const idx = md.indexOf('氷河時代');
console.log(md.substring(idx-50, idx+50));
console.log('');

const html = parseCustomMarkdown(md);

console.log('=== HTML output (around 氷河時代) ===');
const htmlIdx = html.indexOf('氷河時代');
console.log(html.substring(htmlIdx-100, htmlIdx+50));
console.log('');

console.log('=== Validation ===');
console.log('Has [[: ', html.includes('[['));
console.log('Has ]]: ', html.includes(']]'));
