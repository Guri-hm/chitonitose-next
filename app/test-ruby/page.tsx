import { readFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import { remarkCustomDirectives, remarkListClasses, remarkMarkers, remarkTerms, remarkRedText } from '@/lib/remark-custom-directives';

export default async function TestRubyPage() {
  const filePath = join(process.cwd(), 'test-ruby-terms.md');
  const fileContent = readFileSync(filePath, 'utf8');
  const { content, data } = matter(fileContent);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
      <div className="prose max-w-none">
        <MDXRemote
          source={content}
          options={{
            mdxOptions: {
              remarkPlugins: [
                remarkGfm,
                remarkDirective,
                remarkCustomDirectives,
                remarkListClasses,
                remarkMarkers,
                remarkTerms,
                remarkRedText,
              ],
            },
          }}
        />
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-bold mb-2">ブラウザのDevToolsで確認:</h2>
        <ul className="list-disc pl-6">
          <li>各パターンのHTML出力を確認</li>
          <li>class="all"が正しく適用されているか</li>
          <li>rubyタグの構造が正しいか</li>
        </ul>
      </div>
    </div>
  );
}
