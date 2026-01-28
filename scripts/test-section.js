const fs = require('fs');
const matter = require('gray-matter');

const fileContent = fs.readFileSync('content/jh/lessons/1.md', 'utf-8');
const { content: markdown } = matter(fileContent);

// 該当セクションを抽出（::top から :: まで）
const lines = markdown.split('\n');
const topIdx = lines.findIndex(l => l.includes('::top'));
const targetLineIdx = lines.findIndex(l => l.includes('氷河時代'));
const endIdx = lines.findIndex((l, i) => i > targetLineIdx && l.trim() === '::');

const section = lines.slice(topIdx, endIdx + 1).join('\n');

console.log('=== 抽出したセクション ===');
console.log(section);
console.log('\n=== 処理開始 ===\n');

let html = section;

// Normalize
html = html.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

// マーカー処理
html = html.replace(/==([^=]+)==/g, (match, content) => {
  let processed = content;
  processed = processed.replace(/\{\{([^\|]+)\|([^\}]+)\}\}/g, '<ruby>$1<rt>$2</rt></ruby>');
  processed = processed.replace(/\[\[([^\|]+)\|([^\]]+)\]\]/g, '<span onclick="chg(this)" class="all"><ruby>$1<rt>$2</rt></ruby></span>');
  processed = processed.replace(/\[\[(.+?)\]\]/g, '<span onclick="chg(this)" class="all">$1</span>');
  return `<span class="marker">${processed}</span>`;
});
console.log('After marker:');
console.log(html.indexOf('氷河時代') >= 0 ? html.slice(html.indexOf('氷河時代')-30, html.indexOf('氷河時代')+30) : 'NOT FOUND');

// 赤文字処理
html = html.replace(/\*\*\{\{([^\|]+)\|([^\}]+)\}\}\*\*/g, '<font color="#FF0000"><ruby>$1<rt>$2</rt></ruby></font>');
html = html.replace(/\*\*([^\*]+)\*\*/g, '<font color="#FF0000">$1</font>');

// ルビ処理
html = html.replace(/\{\{([^\|]+)\|([^\}]+)\}\}/g, '<ruby>$1<rt>$2</rt></ruby>');

// クリック - ルビ付き
html = html.replace(/\[\[([^\|]+)\|([^\]]+)\]\]/g, '<span onclick="chg(this)" class="all"><ruby>$1<rt>$2</rt></ruby></span>');

// クリック - ルビなし
console.log('\nBefore click plain:');
console.log('Has [[:', html.indexOf('[['));
console.log(html.slice(html.indexOf('[['), html.indexOf('[[') + 30));

html = html.replace(/\[\[(.+?)\]\]/g, '<span onclick="chg(this)" class="all">$1</span>');
console.log('\nAfter click plain:');
console.log(html.indexOf('氷河時代') >= 0 ? html.slice(html.indexOf('氷河時代')-30, html.indexOf('氷河時代')+30) : 'NOT FOUND');

// ::top ... :: 処理
console.log('\nBefore ::top処理:');
console.log(html.slice(0, 200));

html = html.replace(/\n?::top\n?((?:(?!::(?:top|middle|last|sup))[\s\S])*?)::\n?/g, '<div class="top">$1</div>\n');

console.log('\nAfter ::top処理:');
console.log(html.slice(0, 300));
console.log('\n氷河時代周辺:');
console.log(html.indexOf('氷河時代') >= 0 ? html.slice(html.indexOf('氷河時代')-50, html.indexOf('氷河時代')+30) : 'NOT FOUND');
