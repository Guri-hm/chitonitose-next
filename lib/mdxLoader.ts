import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'content');

/**
 * MDXレッスンファイルを読み込む
 */
export async function getMDXLesson(subject: string, lessonId: string) {
  try {
    let filePath: string;
    
    if (subject === 'geo') {
      // 地理はファイル名ベース
      filePath = path.join(contentDir, subject, `${lessonId}.mdx`);
    } else {
      // 日本史・世界史は番号ベース
      filePath = path.join(contentDir, subject, 'lessons', `${lessonId}.mdx`);
    }

    // ファイルの存在確認
    if (!fs.existsSync(filePath)) {
      return null;
    }

    // ファイルを読み込み
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    // フロントマターとコンテンツを分離
    const { data, content } = matter(fileContent);

    return {
      frontMatter: data,
      content,
    };
  } catch (error) {
    console.error(`Error loading MDX lesson: ${error}`);
    return null;
  }
}

/**
 * すべてのMDXレッスンファイルのパスを取得
 */
export async function getAllMDXLessonPaths(subject: string) {
  try {
    let lessonsDir: string;
    
    if (subject === 'geo') {
      lessonsDir = path.join(contentDir, subject);
    } else {
      lessonsDir = path.join(contentDir, subject, 'lessons');
    }

    // ディレクトリが存在しない場合は空配列を返す
    if (!fs.existsSync(lessonsDir)) {
      return [];
    }

    const files = fs.readdirSync(lessonsDir);
    
    return files
      .filter(file => file.endsWith('.mdx'))
      .map(file => file.replace('.mdx', ''));
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
