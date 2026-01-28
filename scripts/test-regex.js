// 正規表現のテスト
const test1 = '[[野尻湖|のじりこ]]';
const test2 = '[[浜北人]]';
const test3 = '[[氷河時代]]';

console.log('=== テスト1: [[野尻湖|のじりこ]] ===');
const result1 = test1.replace(/\[\[([^\|]+)\|([^\]]+)\]\]/g, '<span onclick="chg(this)" class="all"><ruby>$1<rt>$2</rt></ruby></span>');
console.log(result1);

console.log('\n=== テスト2: [[浜北人]] ===');
const result2 = test2.replace(/\[\[(.+?)\]\]/g, '<span onclick="chg(this)" class="all">$1</span>');
console.log(result2);

console.log('\n=== テスト3: [[氷河時代]] ===');
const result3 = test3.replace(/\[\[(.+?)\]\]/g, '<span onclick="chg(this)" class="all">$1</span>');
console.log(result3);

console.log('\n=== 組み合わせテスト ===');
let combined = '約260万年前、[[更新世|こうしんせい]]（[[氷河時代]]）を迎えました';
console.log('Before:', combined);
// ルビ付きを先に
combined = combined.replace(/\[\[([^\|]+)\|([^\]]+)\]\]/g, '<span onclick="chg(this)" class="all"><ruby>$1<rt>$2</rt></ruby></span>');
console.log('After step 1:', combined);
// ルビなし
combined = combined.replace(/\[\[(.+?)\]\]/g, '<span onclick="chg(this)" class="all">$1</span>');
console.log('After step 2:', combined);
