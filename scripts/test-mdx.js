/**
 * MDXコンパイルテストスクリプト
 * Usage: node scripts/test-mdx.js [subject] [lessonId]
 * Example: node scripts/test-mdx.js jh 2
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

async function testMDX(subject, lessonId) {
  console.log(`\n========================================`);
  console.log(`Testing MDX: ${subject}/lessons/${lessonId}.md`);
  console.log(`========================================\n`);

  const filePath = path.join(__dirname, '..', 'content', subject, 'lessons', `${lessonId}.md`);

  try {
    // 1. ファイル存在チェック
    console.log(`[1/5] ファイル存在チェック...`);
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    console.log(`✅ ファイルが存在します: ${filePath}\n`);

    // 2. ファイル読み込み
    console.log(`[2/5] ファイル読み込み...`);
    const source = fs.readFileSync(filePath, 'utf-8');
    console.log(`✅ ファイルサイズ: ${source.length} bytes\n`);

    // 3. Frontmatter解析
    console.log(`[3/5] Frontmatter解析...`);
    const { data: frontmatterData, content: mdxContent } = matter(source);
    console.log(`✅ Frontmatter:`, frontmatterData);
    console.log(`✅ Content length: ${mdxContent.length} bytes\n`);

    // 4. TOC生成テスト
    console.log(`[4/5] TOC生成テスト...`);
    const { unified } = await import('unified');
    const remarkParse = (await import('remark-parse')).default;
    const remarkStringify = (await import('remark-stringify')).default;
    const remarkGfm = (await import('remark-gfm')).default;
    const remarkDirective = (await import('remark-directive')).default;
    const { remarkToc } = require('../lib/remark-toc.js');

    const processor = unified()
      .use(remarkParse)
      .use(remarkStringify)
      .use(remarkGfm)
      .use(remarkDirective)
      .use(remarkToc);

    const vfile = await processor.process(mdxContent);
    console.log(`✅ TOC生成成功`);
    console.log(`✅ TOC items: ${vfile.data.toc ? vfile.data.toc.length : 0}`);
    if (vfile.data.toc && vfile.data.toc.length > 0) {
      console.log(`\nTOC構造:`);
      vfile.data.toc.forEach((item, i) => {
        console.log(`  ${i + 1}. ${item.text} (#${item.id})`);
        if (item.children && item.children.length > 0) {
          item.children.forEach((child, j) => {
            console.log(`     ${i + 1}.${j + 1}. ${child.text} (#${child.id})`);
          });
        }
      });
    }
    console.log();

    // 5. next-mdx-remote/rsc でコンパイル
    console.log(`[5/5] next-mdx-remote/rsc コンパイル...`);
    const { compileMDX } = await import('next-mdx-remote/rsc');
    const rehypeSlug = (await import('rehype-slug')).default;
    const rehypeAutolinkHeadings = (await import('rehype-autolink-headings')).default;
    const {
      remarkCustomDirectives,
      remarkTerms,
      remarkMarkers,
      remarkRedText,
      remarkListClasses,
    } = require('../lib/remark-custom-directives.js');

    const { content } = await compileMDX({
      source: mdxContent,
      options: {
        parseFrontmatter: false,
        mdxOptions: {
          remarkPlugins: [
            remarkGfm,
            remarkDirective,
            remarkToc,
            remarkCustomDirectives,
            remarkListClasses,
            remarkTerms,
            remarkMarkers,
            remarkRedText,
          ],
          rehypePlugins: [
            rehypeSlug,
            [rehypeAutolinkHeadings, { behavior: 'wrap' }],
          ],
        },
      },
    });

    console.log(`✅ MDXコンパイル成功\n`);

    console.log(`\n========================================`);
    console.log(`✅ すべてのテストが成功しました！`);
    console.log(`========================================\n`);

    return true;
  } catch (error) {
    console.error(`\n❌ テスト失敗\n`);
    console.error(`Error type: ${error.constructor.name}`);
    console.error(`Error message: ${error.message}`);
    if (error.stack) {
      console.error(`\nStack trace:`);
      console.error(error.stack);
    }
    console.error(`\n========================================\n`);
    return false;
  }
}

// コマンドライン引数を取得
const args = process.argv.slice(2);
const subject = args[0] || 'jh';
const lessonId = args[1] || '2';

testMDX(subject, lessonId).then((success) => {
  process.exit(success ? 0 : 1);
});
