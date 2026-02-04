/**
 * remark-custom-directivesプラグインの動作確認
 */

const { unified } = require('unified');
const remarkParse = require('remark-parse').default;
const remarkGfm = require('remark-gfm').default;
const remarkDirective = require('remark-directive').default;
const {
  remarkCustomDirectives,
  remarkTerms,
  remarkMarkers,
  remarkRedText,
  remarkListClasses,
  remarkRuby,
  remarkArrows,
  remarkCustomImages,
} = require('../lib/remark-custom-directives.mjs');

async function debugMDX() {
  // テスト1: 赤字
  console.log('=== テスト1: 赤字の変換 ===');
  const redTextTest = '**<ruby>山下町洞人<rt>やましたちょうどうじん</rt></ruby>**や**ヘラジカ**';
  
  const processor1 = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkDirective)
    .use(remarkRuby)
    .use(remarkRedText);
  
  const ast1 = processor1.parse(redTextTest);
  const result1 = await processor1.run(ast1);
  
  console.log('入力:', redTextTest);
  console.log('AST:', JSON.stringify(result1, null, 2));
  console.log('');
  
  // テスト2: 画像サイズ（half）
  console.log('=== テスト2: gazoディレクティブ（半分サイズ） ===');
  const imageTest = `:::gazo{size="half"}
![](/images/jh/img/1/7.jpg)
:::`;
  
  const processor2 = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkDirective)
    .use(remarkCustomDirectives);
  
  const ast2 = processor2.parse(imageTest);
  const result2 = await processor2.run(ast2);
  
  console.log('入力:', imageTest);
  console.log('AST:', JSON.stringify(result2, null, 2));
  console.log('');
  
  // テスト3: 画像サイズ（twice）
  console.log('=== テスト3: gazoディレクティブ（2倍サイズ） ===');
  const imageTwiceTest = `:::gazo{size="twice"}
![](/images/jh/img/1/2.jpg)
:::`;
  
  const processor3 = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkDirective)
    .use(remarkCustomDirectives);
  
  const ast3 = processor3.parse(imageTwiceTest);
  const result3 = await processor3.run(ast3);
  
  console.log('入力:', imageTwiceTest);
  console.log('AST:', JSON.stringify(result3, null, 2));
}

debugMDX().catch(console.error);
