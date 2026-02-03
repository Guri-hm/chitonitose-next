const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// batch-convert-jh-lessons.jsからHtmlToMdxConverterクラスを読み込む
const batchScript = fs.readFileSync(
  path.join(__dirname, 'batch-convert-jh-lessons.js'),
  'utf8'
);

// クラス定義部分を抽出して実行
eval(batchScript.split('// メイン処理')[0]);

// lesson 6のHTMLを読み込む
const htmlPath = path.join(__dirname, '..', 'origin', 'chitonitose', 'jh', 'jh_lessons6.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const $ = cheerio.load(html);

// コンバーターを初期化
const converter = new HtmlToMdxConverter($);

// <ul class="en">を見つけて変換をテスト
const $ulEn = $('ul.en').first();
console.log('=== HTMLソース ===');
console.log($ulEn.html());

console.log('\n=== 変換結果 ===');
const converted = converter.convertList($ulEn, 'ul');
console.log(converted);

console.log('\n=== 期待される出力 ===');
console.log(`:::list{class="en"}
- ヤマト政権の５人の王...
- 倭の五王の武が過去の征服事実...
- 478年、武が安東大将軍の称号...
:::`);
