import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkDirective from 'remark-directive';
import { remarkCustomDirectives } from '../lib/remark-custom-directives.js';
import { inspect } from 'util';

async function testDirectPlugin() {
  const testMdx = `:::gazo{size="half"}
![](/images/jh/img/1/7.jpg)

尖頭器
:::`;

  console.log('=== Input ===');
  console.log(testMdx);
  console.log('\n=== Processing... ===\n');

  const processor = unified()
    .use(remarkParse)
    .use(remarkDirective)
    .use(remarkCustomDirectives);

  const ast = processor.parse(testMdx);
  const result = await processor.run(ast);

  console.log('\n=== Final AST ===');
  console.log(inspect(result, { depth: 10, colors: true }));
}

testDirectPlugin();
