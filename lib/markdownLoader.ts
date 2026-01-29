import fs from 'fs';
import path from 'path';

export interface LessonData {
  subject: string;
  lessonNo: number;
  content: string; // HTML形式（本文のみ、overviewは含まない）
  overview?: string; // 概要テキスト
  rawMarkdown: string; // 元のMarkdown
}

/**
 * カスタムMarkdownをHTMLに変換
 * スクリプトから関数を同期的に読み込み
 */
function parseCustomMarkdown(markdown: string, subject: string): string {
  // scripts/markdown-to-html.js をrequireで読み込み
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { parseCustomMarkdown: parser } = require('../scripts/markdown-to-html.js');
  return parser(markdown, subject);
}

/**
 * カスタムMarkdownファイルを読み込んでHTMLに変換
 */
export async function loadLesson(subject: string, lessonNo: number): Promise<LessonData> {
  const filePath = path.join(process.cwd(), 'content', subject, 'lessons', `${lessonNo}.md`);
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`Lesson file not found: ${filePath}`);
  }
  
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  
  // overviewを抽出
  const overviewMatch = fileContent.match(/---overview---\n([\s\S]*?)\n---/);
  const overview = overviewMatch ? overviewMatch[1].trim() : undefined;
  
  // gray-matterは使わず、直接Markdownとして扱う
  // （カスタムMarkdown形式のため、フロントマターは使用しない）
  const rawMarkdown = fileContent;
  
  // カスタムMarkdownをHTMLに変換（科目情報を渡す）
  const htmlContent = parseCustomMarkdown(rawMarkdown, subject);
  
  return {
    subject: subject,
    lessonNo: lessonNo,
    content: htmlContent,
    overview,
    rawMarkdown
  };
}

/**
 * 特定科目の全レッスン一覧を取得
 */
export function getLessonList(subject: string): number[] {
  const lessonsDir = path.join(process.cwd(), 'content', subject, 'lessons');
  
  if (!fs.existsSync(lessonsDir)) {
    return [];
  }
  
  const files = fs.readdirSync(lessonsDir);
  
  return files
    .filter(file => file.endsWith('.md'))
    .map(file => parseInt(file.replace('.md', ''), 10))
    .filter(num => !isNaN(num))
    .sort((a, b) => a - b);
}

/**
 * 静的生成のためのパス一覧を取得
 */
export function getAllLessonPaths(subject: string) {
  const lessonNumbers = getLessonList(subject);
  
  return lessonNumbers.map(num => ({
    params: { id: num.toString() }
  }));
}
