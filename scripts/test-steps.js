const fs = require('fs');
const matter = require('gray-matter');

const fileContent = fs.readFileSync('content/jh/lessons/1.md', 'utf-8');
const { content: markdown } = matter(fileContent);

// 該当行のみ抽出
const lines = markdown.split('\n');
const targetLineIdx = lines.findIndex(l => l.includes('氷河時代'));
const targetLine = lines[targetLineIdx];

console.log('=== 元のMarkdown ===');
console.log(targetLine);
console.log('');

// Step-by-step processing
let html = targetLine;

// Normalize line endings
html = html.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
console.log('Step 1 (normalize): ', html.indexOf('氷河時代') >= 0 ? html.slice(html.indexOf('氷河時代')-20, html.indexOf('氷河時代')+20) : 'NOT FOUND');

// マーカー処理
html = html.replace(/==([^=]+)==/g, (match, content) => {
  let processed = content;
  processed = processed.replace(/\{\{([^\|]+)\|([^\}]+)\}\}/g, '<ruby>$1<rt>$2</rt></ruby>');
  processed = processed.replace(/\[\[([^\|]+)\|([^\]]+)\]\]/g, '<span onclick="chg(this)" class="all"><ruby>$1<rt>$2</rt></ruby></span>');
  processed = processed.replace(/\[\[(.+?)\]\]/g, '<span onclick="chg(this)" class="all">$1</span>');
  return `<span class="marker">${processed}</span>`;
});
console.log('Step 2 (marker): ', html.indexOf('氷河時代') >= 0 ? html.slice(html.indexOf('氷河時代')-20, html.indexOf('氷河時代')+20) : 'NOT FOUND');

// 赤文字処理
html = html.replace(/\*\*\{\{([^\|]+)\|([^\}]+)\}\}\*\*/g, '<font color="#FF0000"><ruby>$1<rt>$2</rt></ruby></font>');
html = html.replace(/\*\*([^\*]+)\*\*/g, '<font color="#FF0000">$1</font>');
console.log('Step 3 (red): ', html.indexOf('氷河時代') >= 0 ? html.slice(html.indexOf('氷河時代')-20, html.indexOf('氷河時代')+20) : 'NOT FOUND');

// ルビ処理
html = html.replace(/\{\{([^\|]+)\|([^\}]+)\}\}/g, '<ruby>$1<rt>$2</rt></ruby>');
console.log('Step 4 (ruby): ', html.indexOf('氷河時代') >= 0 ? html.slice(html.indexOf('氷河時代')-20, html.indexOf('氷河時代')+20) : 'NOT FOUND');

// クリック - ルビ付き
html = html.replace(/\[\[([^\|]+)\|([^\]]+)\]\]/g, '<span onclick="chg(this)" class="all"><ruby>$1<rt>$2</rt></ruby></span>');
console.log('Step 5 (click ruby): ', html.indexOf('氷河時代') >= 0 ? html.slice(html.indexOf('氷河時代')-20, html.indexOf('氷河時代')+20) : 'NOT FOUND');

// クリック - ルビなし
console.log('\nBefore click plain, searching for [[氷河時代]]:');
console.log('Full line:', html);
console.log('Has [[:', html.indexOf('[['));
console.log('Has ]]:', html.indexOf(']]'));

const before = html;
html = html.replace(/\[\[(.+?)\]\]/g, '<span onclick="chg(this)" class="all">$1</span>');
console.log('\nAfter click plain:');
console.log('Changed:', before !== html);
console.log('Step 6 (click plain): ', html.indexOf('氷河時代') >= 0 ? html.slice(html.indexOf('氷河時代')-20, html.indexOf('氷河時代')+20) : 'NOT FOUND');

console.log('\n=== Final HTML ===');
console.log(html);
