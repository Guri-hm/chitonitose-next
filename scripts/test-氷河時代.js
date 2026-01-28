const fs = require('fs');
const matter = require('gray-matter');

const fileContent = fs.readFileSync('content/jh/lessons/1.md', 'utf-8');
const { content: md } = matter(fileContent);

// 氷河時代周辺のみ抽出
const idx = md.indexOf('を交互に繰り返す');
const section = md.substring(idx, idx+100);

console.log('=== 元のMarkdown ===');
console.log(section);
console.log('');

let html = section;

// Step 1: マーカー
console.log('Step 1: Marker ==...==');
html = html.replace(/==([^=]+)==/g, (match, content) => {
  console.log('  Matched:', match);
  let processed = content;
  processed = processed.replace(/\{\{([^\|]+)\|([^\}]+)\}\}/g, '<ruby>$1<rt>$2</rt></ruby>');
  processed = processed.replace(/\[\[([^\|]+)\|([^\]]+)\]\]/g, '<span onclick="chg(this)" class="all"><ruby>$1<rt>$2</rt></ruby></span>');
  processed = processed.replace(/\[\[(.+?)\]\]/g, '<span onclick="chg(this)" class="all">$1</span>');
  const result = `<span class="marker">${processed}</span>`;
  console.log('  Result:', result);
  return result;
});
console.log('After marker:');
console.log(html);
console.log('');

// Step 2: Ruby
console.log('Step 2: Ruby {{...|...}}');
const before2 = html;
html = html.replace(/\{\{([^\|]+)\|([^\}]+)\}\}/g, '<ruby>$1<rt>$2</rt></ruby>');
console.log('Changed:', before2 !== html);
console.log(html);
console.log('');

// Step 3: [[...|...]]
console.log('Step 3: [[...|...]]');
console.log('Has [[:', html.includes('[['));
const regex1 = /\[\[([^\|]+)\|([^\]]+)\]\]/g;
let match;
while ((match = regex1.exec(html)) !== null) {
  console.log('  Match:', match[0], '-> term:', match[1], ', reading:', match[2]);
}
html = html.replace(/\[\[([^\|]+)\|([^\]]+)\]\]/g, '<span onclick="chg(this)" class="all"><ruby>$1<rt>$2</rt></ruby></span>');
console.log('After [[...|...]]:');
console.log(html);
console.log('');

// Step 4: [[...]]
console.log('Step 4: [[...]]');
console.log('Has [[:', html.includes('[['));
const regex2 = /\[\[(.+?)\]\]/g;
while ((match = regex2.exec(html)) !== null) {
  console.log('  Match:', match[0], '-> term:', match[1]);
}
html = html.replace(/\[\[(.+?)\]\]/g, '<span onclick="chg(this)" class="all">$1</span>');
console.log('Final:');
console.log(html);
