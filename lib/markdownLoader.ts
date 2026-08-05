import fs from 'fs';
import path from 'path';

export interface LessonData {
  subject: string;
  lessonNo: number;
  content: string; // HTML形式(本文のみ、overviewは含まない)
  overview?: string; // 概要HTML(ruby/用語クリック記法を変換済み。dangerouslySetInnerHTMLで表示する)
  rawMarkdown: string; // 元のMarkdown
}

/**
 * カスタムMarkdownをHTMLに変換
 * スクリプトから関数を同期的に読み込み
 */
function parseCustomMarkdown(markdown: string, subject: string): string {
  // scripts/markdown-to-html.js をrequireで読み込み
  const { parseCustomMarkdown: parser } = require('../scripts/markdown-to-html.js');
  return parser(markdown, subject);
}

/**
 * 概要テキスト中のカスタムMarkdown記法(ruby/クリック用語など)をHTMLに変換
 */
function convertOverview(overview: string): string {
  const { convertInlineMarkdown } = require('../scripts/markdown-to-html.js');
  return convertInlineMarkdown(overview);
}

/**
 * カスタムMarkdownファイルを読み込んでHTMLに変換（内部共通処理）
 */
function loadCustomMarkdownFile(filePath: string, subject: string, lessonNo: number): LessonData {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');

  // overviewを抽出（CRLF/LF両対応のため改行コードを正規化してから照合）
  const normalized = fileContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const overviewMatch = normalized.match(/---overview---\n([\s\S]*?)\n---/);
  const overview = overviewMatch ? convertOverview(overviewMatch[1].trim()) : undefined;

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
 * カスタムMarkdownファイルを読み込んでHTMLに変換
 */
export async function loadLesson(subject: string, lessonNo: number): Promise<LessonData> {
  const filePath = path.join(process.cwd(), 'content', subject, 'lessons', `${lessonNo}.md`);
  return loadCustomMarkdownFile(filePath, subject, lessonNo);
}

/**
 * テーマ史（短期攻略）などのカスタムMarkdownファイルを読み込んでHTMLに変換
 * @param subject - 科目コード ('jh' | 'wh' | 'geo')
 * @param dir - content/{subject}配下のディレクトリ名（例: 'omnibus'）
 * @param id - ファイル名（拡張子抜き）
 */
export async function loadCustomLesson(subject: string, dir: string, id: string | number): Promise<LessonData> {
  const filePath = path.join(process.cwd(), 'content', subject, dir, `${id}.md`);
  const lessonNo = typeof id === 'number' ? id : parseInt(String(id), 10) || 0;
  return loadCustomMarkdownFile(filePath, subject, lessonNo);
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
