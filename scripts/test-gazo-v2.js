// Force cache clear
delete require.cache[require.resolve('../lib/remark-custom-directives.js')];
delete require.cache[require.resolve('../lib/mdx-config.mjs')];

const { compileMDX } = require('next-mdx-remote/rsc');
const fs = require('fs');
const path = require('path');
const { remarkPlugins, rehypePlugins } = require('../lib/mdx-config.mjs');

async function testGazoRendering() {
  const testMdx = `:::gazo{size="half"}
![](/images/jh/img/1/7.jpg)

尖頭器
:::`;

  console.log('=== Input MDX ===');
  console.log(testMdx);
  console.log('\n=== Compiling... ===\n');

  try {
    const { content } = await compileMDX({
      source: testMdx,
      options: {
        parseFrontmatter: false,
        mdxOptions: {
          remarkPlugins,
          rehypePlugins,
          development: false,
        },
      },
    });

    console.log('=== Compilation successful ===');
    console.log('Content type:', typeof content);
    console.log('Content:', content);
    
    // Try to render it to see the actual HTML
    const React = require('react');
    const ReactDOMServer = require('react-dom/server');
    const html = ReactDOMServer.renderToStaticMarkup(content);
    console.log('\n=== Rendered HTML ===');
    console.log(html);
    
  } catch (error) {
    console.error('=== Compilation Error ===');
    console.error(error.message);
    if (error.cause) {
      console.error('Cause:', error.cause);
    }
  }
}

testGazoRendering();
