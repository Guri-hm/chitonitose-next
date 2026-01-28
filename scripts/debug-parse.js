const fs = require('fs');
const matter = require('gray-matter');

const fileContent = fs.readFileSync('content/jh/lessons/1.md', 'utf-8');
const { content: markdown } = matter(fileContent);

// 氷河時代を含む行のみ抽出
const lines = markdown.split('\n');
const targetLine = lines.find(l => l.includes('氷河時代'));

console.log('=== 元のMarkdown ===');
console.log(targetLine);
console.log('');

let html = targetLine;

// Normalize
html = html.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

// 9. マーカー処理
html = html.replace(/==([^=]+)==/g, (match, content) => {
  console.log('Marker match:', content);
  let processed = content;
  processed = processed.replace(/\{\{([^\|]+)\|([^\}]+)\}\}/g, '<ruby>$1<rt>$2</rt></ruby>');
  processed = processed.replace(/\[\[([^\|]+)\|([^\]]+)\]\]/g, '<span onclick="chg(this)" class="all"><ruby>$1<rt>$2</rt></ruby></span>');
  processed = processed.replace(/\[\[(.+?)\]\]/g, '<span onclick="chg(this)" class="all">$1</span>');
  return `<span class="marker">${processed}</span>`;
});

console.log('\nAfter marker:');
console.log(html);

// 10-13. 赤文字・ルビ・クリック処理
html = html.replace(/\*\*\{\{([^\|]+)\|([^\}]+)\}\}\*\*/g, '<font color="#FF0000"><ruby>$1<rt>$2</rt></ruby></font>');
html = html.replace(/\*\*([^\*]+)\*\*/g, '<font color="#FF0000">$1</font>');
html = html.replace(/\{\{([^\|]+)\|([^\}]+)\}\}/g, '<ruby>$1<rt>$2</rt></ruby>');

console.log('\nBefore [[...|...]] processing:');
console.log('Has [[:', html.includes('[['));
console.log(html.slice(html.indexOf('[['), html.indexOf('[[') + 50));

html = html.replace(/\[\[([^\|]+)\|([^\]]+)\]\]/g, (match, p1, p2) => {
  console.log(`Matched [[${p1}|${p2}]]`);
  return `<span onclick="chg(this)" class="all"><ruby>${p1}<rt>${p2}</rt></ruby></span>`;
});

console.log('\nAfter [[...|...]] processing:');
console.log('Has [[:', html.includes('[['));
if (html.includes('[[')) {
  console.log(html.slice(html.indexOf('[['), html.indexOf('[[') + 50));
}

html = html.replace(/\[\[(.+?)\]\]/g, (match, p1) => {
  console.log(`Matched [[${p1}]]`);
  return `<span onclick="chg(this)" class="all">${p1}</span>`;
});

console.log('\n=== Final HTML ===');
console.log(html);
