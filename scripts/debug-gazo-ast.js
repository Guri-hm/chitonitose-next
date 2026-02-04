const { unified } = require('unified');
const remarkParse = require('remark-parse').default;
const remarkDirective = require('remark-directive').default;
const { inspect } = require('util');

async function debugGazoAST() {
  const testMdx = `:::gazo{size="half"}
![](/images/jh/img/1/7.jpg)

尖頭器
:::`;

  const processor = unified()
    .use(remarkParse)
    .use(remarkDirective);

  const ast = processor.parse(testMdx);
  const result = await processor.run(ast);

  console.log('=== AST after remarkDirective ===');
  console.log(inspect(result, { depth: 10, colors: true }));
}

debugGazoAST();
