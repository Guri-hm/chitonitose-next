import { notFound } from 'next/navigation';
import { loadSubjectPages } from '@/lib/dataLoader';
import { loadLesson, getAllLessonPaths } from '@/lib/markdownLoader';
import type { Metadata } from 'next';
import LessonContent from '@/components/lessons/LessonContent';
import MarkdownContent from '@/components/MarkdownContent';

interface LessonPageProps {
  params: Promise<{
    id: string;
  }>;
}

// メタデータを動的に生成
export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { id } = await params;
  const pages = await loadSubjectPages(2); // 日本史
  const lessonNo = parseInt(id, 10);
  const lesson = pages.find(p => p.no === lessonNo);

  if (!lesson) {
    return {
      title: 'レッスンが見つかりません | ちとにとせ',
    };
  }

  return {
    title: `${lesson.title.trim()} | ちとにとせ`,
    description: `日本史 ${lesson.title.trim()}のレッスンページです。`,
    keywords: ['日本史', '高校', '受験', '勉強', lesson.title.trim(), 'ちとにとせ'],
  };
}

// 静的パスを生成（ビルド時）
export async function generateStaticParams() {
  const pages = await loadSubjectPages(2); // 日本史
  
  return pages.map((page) => ({
    id: page.no.toString(),
  }));
}

export default async function JHLessonPage({ params }: LessonPageProps) {
  const { id } = await params;
  const pages = await loadSubjectPages(2);
  const lessonNo = parseInt(id, 10);
  const lesson = pages.find(p => p.no === lessonNo);

  if (!lesson) {
    notFound();
  }

  // 前後のレッスンを取得
  const prevLesson = pages.find(p => p.no === lessonNo - 1);
  const nextLesson = pages.find(p => p.no === lessonNo + 1);

  // カスタムMarkdownファイルを読み込んでHTMLに変換
  let lessonData = null;
  try {
    lessonData = await loadLesson('jh', lessonNo);
  } catch (error) {
    console.error(`Failed to load lesson ${lessonNo}:`, error);
  }

  return (
    <>
      <link rel="stylesheet" href="/css/common.css" />
      <link rel="stylesheet" href="/css/jh.css" />
      <link rel="stylesheet" href="/css/lessons_common.css" />
      
      <h1><div className="first">{lesson.title}</div></h1>
      
      <div id="toc-range" className="contents">
        {lessonData ? (
          <MarkdownContent htmlContent={lessonData.content} />
        ) : (
          <p>レッスンの内容を読み込めませんでした。</p>
        )}
        
        <nav className="lesson-pagination">
          {prevLesson && (
            <a href={`/jh/lessons/${prevLesson.no}`} className="btn-prev">
              ← 前へ: {prevLesson.title}
            </a>
          )}
          {nextLesson && (
            <a href={`/jh/lessons/${nextLesson.no}`} className="btn-next">
              次へ: {nextLesson.title} →
            </a>
          )}
        </nav>
      </div>
    </>
  );
}
