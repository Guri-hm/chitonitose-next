const fs = require('fs');
const { parseCustomMarkdown } = require('./markdown-to-html.js');

// 該当行だけ抽出してテスト
const testMd = `::top
約260万年前、地球は=={{間氷期|かんぴょうき}}と{{氷期|ひょうき}}を交互に繰り返す==[[更新世|こうしんせい]]（[[氷河時代]]）を迎えました。
::`;

console.log('=== Input ===');
console.log(testMd);

const html = parseCustomMarkdown(testMd);

console.log('\n=== Output ===');
console.log(html);

console.log('\n=== 氷河時代を検索 ===');
const idx = html.indexOf('氷河時代');
console.log(html.slice(idx-50, idx+50));
