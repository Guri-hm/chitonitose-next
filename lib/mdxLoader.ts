import fs from 'fs/promises';
import path from 'path';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import matter from 'gray-matter';
const {
  remarkCustomDirectives,
  remarkTerms,
  remarkMarkers,
  remarkRedText,
  remarkListClasses,
} = require('./remark-custom-directives.js');

const contentDir = path.join(process.cwd(), 'content');

export interface LessonFrontmatter {
  title: string;
  overview?: string;
}

/**
 * MDXレッスンファイルを読み込んでコンパイルする
 */
export async function getMDXLesson(subject: string, lessonId: string) {
  try {
    let filePath: string;
    
    if (subject === 'geo') {
      // 地理はファイル名ベース
      filePath = path.join(contentDir, subject, `${lessonId}.md`);
    } else {
      // 日本史・世界史は番号ベース
      filePath = path.join(contentDir, subject, 'lessons', `${lessonId}.md`);
    }

    const source = await fs.readFile(filePath, 'utf-8');
    
    // Parse frontmatter manually with gray-matter
    const { data: frontmatterData, content: mdxContent } = matter(source);
    
    console.log(`[MDX] Loading file: ${filePath}`);
    console.log(`[MDX] Frontmatter:`, frontmatterData);
    
    const { content } = await compileMDX<LessonFrontmatter>({
      source: mdxContent,
      options: {
        parseFrontmatter: false,
        mdxOptions: {
          remarkPlugins: [
            remarkGfm,
            remarkDirective,
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
    
    console.log(`[MDX] Compilation successful`);
    
    return {
      frontMatter: frontmatterData as LessonFrontmatter,
      content,
    };
  } catch (error) {
    console.error(`[MDX ERROR] File: ${subject}/lessons/${lessonId}.md`);
    console.error(`[MDX ERROR] Error type: ${error instanceof Error ? error.name : 'Unknown'}`);
    console.error(`[MDX ERROR] Message: ${error instanceof Error ? error.message : String(error)}`);
    if (error instanceof Error && error.stack) {
      console.error(`[MDX ERROR] Stack trace:`, error.stack);
    }
    return null;
  }
}

/**
 * すべてのMDXレッスンファイルのパスを取得
 */
export async function getAllMDXLessonPaths(subject: string) {
  const fsSync = await import('fs');
  
  try {
    let lessonsDir: string;
    
    if (subject === 'geo') {
      lessonsDir = path.join(contentDir, subject);
    } else {
      lessonsDir = path.join(contentDir, subject, 'lessons');
    }

    // ディレクトリが存在しない場合は空配列を返す
    if (!fsSync.existsSync(lessonsDir)) {
      return [];
    }

    const files = fsSync.readdirSync(lessonsDir);
    
    return files
      .filter((file: string) => file.endsWith('.md'))
      .map((file: string) => file.replace('.md', ''));
  } catch (error) {
    console.error(`Error getting MDX lesson paths: ${error}`);
    return [];
  }
}

/**
 * MDXレッスンが存在するかチェック
 */
export async function mdxLessonExists(subject: string, lessonId: string): Promise<boolean> {
  const lesson = await getMDXLesson(subject, lessonId);
  return lesson !== null;
}
