import fs from 'fs/promises';
import path from 'path';
import { compileMDX } from 'next-mdx-remote/rsc';
import matter from 'gray-matter';
import { remarkPlugins, rehypePlugins } from './mdx-config.mjs';
import { remarkToc } from './remark-toc.mjs';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';

const contentDir = path.join(process.cwd(), 'content');

export interface TocItem {
  id: string;
  text: string;
  children?: TocItem[];
}

export interface LessonFrontmatter {
  title: string;
  overview: string;
}

export interface LessonData {
  frontmatter: LessonFrontmatter;
  content: React.ReactElement;
  toc: TocItem[];
}

/**
 * MDXレッスンファイルを読み込んでコンパイルする
 */
export async function getMDXLesson(subject: string, lessonId: string): Promise<LessonData | null> {
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
    
    // Store for accessing vfile data
    let tocData: TocItem[] = [];
    
    const { content } = await compileMDX<LessonFrontmatter>({
      source: mdxContent,
      options: {
        parseFrontmatter: false,
        mdxOptions: {
          remarkPlugins,
          rehypePlugins,
        },
      },
    });

    // Extract TOC from the compilation result
    // Note: We need to parse the file again to get vfile.data
    const { unified } = await import('unified');
    const remarkParse = (await import('remark-parse')).default;
    const remarkStringify = (await import('remark-stringify')).default;
    const processor = unified()
      .use(remarkParse)
      .use(remarkStringify)
      .use(remarkGfm)
      .use(remarkDirective)
      .use(remarkToc);
    
    const vfile = await processor.process(mdxContent);
    tocData = (vfile.data.toc as TocItem[]) || [];

    console.log(`[MDX] Compilation successful`);
    console.log(`[MDX] TOC items:`, tocData.length);
    
    return {
      frontmatter: frontmatterData as LessonFrontmatter,
      content,
      toc: tocData,
    };
  } catch (error) {
    console.error(`[MDX ERROR] ============================================`);
    console.error(`[MDX ERROR] File: ${subject}/lessons/${lessonId}.md`);
    console.error(`[MDX ERROR] Error type: ${error instanceof Error ? error.name : 'Unknown'}`);
    console.error(`[MDX ERROR] Message: ${error instanceof Error ? error.message : String(error)}`);
    if (error instanceof Error && error.stack) {
      console.error(`[MDX ERROR] Stack trace:`);
      console.error(error.stack);
    }
    console.error(`[MDX ERROR] ============================================`);
    throw error; // Re-throw to propagate to page component
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
