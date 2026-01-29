import { notFound } from 'next/navigation';
import { loadSubjectPages } from '@/lib/dataLoader';
import { loadLesson, getAllLessonPaths } from '@/lib/markdownLoader';
import type { Metadata } from 'next';
import LessonContent from '@/components/lessons/LessonContent';
import MarkdownContent from '@/components/MarkdownContent';
import AnswerButtons from '@/components/AnswerButtons';
import { PenIcon, ListIcon, RightIcon, LeftIcon } from '@/components/ui/Icons';

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
          <>
            {/* 答えの一括表示/非表示ボタン */}
            <AnswerButtons />
            
            {/* 概要 */}
            {lessonData.overview && (
              <div className="overview">
                <div className="title">概要</div>
                {lessonData.overview}
              </div>
            )}
            
            {/* コンテンツ（目次も含む） */}
            <MarkdownContent htmlContent={lessonData.content} showAnswerButtons={false} />
          </>
        ) : (
          <p>レッスンの内容を読み込めませんでした。</p>
        )}

        {/* 一問一答リンク */}
        <div className="d-flex flex-wrap justify-content-center gy-10 mt-10 mb-20">
          <div className="d-flex align-center order-2 mx-10 border border-2 border-subject-color p-10 border-radius-5">
            <a href={`/jh/exercises/q-a?page=${lessonNo}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PenIcon size={20} />
              <span>このページの一問一答</span>
            </a>
          </div>
        </div>

        {/* ナビゲーション */}
        <div className="text-center d-flex flex-wrap sm-flex-column justify-content-center gy-10 my-10">
          {prevLesson && (
            <div className="d-flex flex-column align-center order-1 mx-10 border border-2 border-subject-color p-10 border-radius-5">
              <a className="w-100" href={`/jh/lessons/${prevLesson.no}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <LeftIcon size={20} />
                <div>
                  <div>前の内容</div>
                  <div>{prevLesson.title}</div>
                </div>
              </a>
            </div>
          )}
          
          <div className="d-flex align-center order-2 mx-10 border border-2 border-subject-color p-10 border-radius-5">
            <a className="w-100" href="/jh" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ListIcon size={20} />
              <span>一覧</span>
            </a>
          </div>
          
          {nextLesson && (
            <div className="d-flex flex-column align-center order-3 mx-10 border border-2 border-subject-color p-10 border-radius-5">
              <a className="w-100" href={`/jh/lessons/${nextLesson.no}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div>
                  <div>次の内容</div>
                  <div>{nextLesson.title}</div>
                </div>
                <RightIcon size={20} />
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
