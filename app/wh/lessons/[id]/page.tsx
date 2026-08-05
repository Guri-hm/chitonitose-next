import { notFound } from 'next/navigation';
import { loadSubjectPages } from '@/lib/dataLoader';
import { loadLesson } from '@/lib/markdownLoader';
import type { Metadata } from 'next';
import AnswerButtons from '@/components/AnswerButtons';
import ThreeColumnLayout from '@/components/lessons/ThreeColumnLayout';
import TermClickHandler from '@/components/lessons/TermClickHandler';
import ImageClickHandler from '@/components/lessons/ImageClickHandler';
import NotationGuide from '@/components/lessons/NotationGuide';
import { ListIcon, RightIcon, LeftIcon } from '@/components/ui/Icons';

interface LessonPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { id } = await params; // paramsをawait
  const pages = await loadSubjectPages(1); // 世界史
  const lessonNo = parseInt(id, 10);
  const lesson = pages.find(p => p.no === lessonNo);

  if (!lesson) {
    return {
      title: 'レッスンが見つかりません | ちとにとせ',
    };
  }

  return {
    title: `${lesson.title.trim()} | ちとにとせ`,
    description: `世界史 ${lesson.title.trim()}のレッスンページです。`,
    keywords: ['世界史', '高校', '受験', '勉強', lesson.title.trim(), 'ちとにとせ'],
  };
}

export async function generateStaticParams() {
  const pages = await loadSubjectPages(1);
  
  return pages.map((page) => ({
    id: page.no.toString(),
  }));
}

export default async function WHLessonPage({ params }: LessonPageProps) {
  const { id } = await params; // paramsをawait
  const pages = await loadSubjectPages(1);
  const lessonNo = parseInt(id, 10);
  const lesson = pages.find(p => p.no === lessonNo);

  if (!lesson) {
    notFound();
  }

  const prevLesson = pages.find(p => p.no === lessonNo - 1);
  const nextLesson = pages.find(p => p.no === lessonNo + 1);

  // カスタムMarkdownを読み込んでHTMLに変換
  let lessonData = null;
  try {
    lessonData = await loadLesson('wh', lessonNo);
  } catch (error) {
    console.error(`Failed to load lesson ${lessonNo}:`, error);
  }

  return (
    <>
      <link rel="stylesheet" href="/css/wh.css" />
      <link rel="stylesheet" href="/css/content_common.css" />

      <ThreeColumnLayout
        subject="wh"
        currentLessonNo={lessonNo}
        currentSection="lessons"
        pages={pages}
        title={lesson.title}
        prevLesson={prevLesson ? { no: prevLesson.no, title: prevLesson.title, href: `/wh/lessons/${prevLesson.no}` } : undefined}
        nextLesson={nextLesson ? { no: nextLesson.no, title: nextLesson.title, href: `/wh/lessons/${nextLesson.no}` } : undefined}
      >
        <TermClickHandler />
        <ImageClickHandler />
        <div id="toc-range" className="contents">
          {lessonData ? (
            <>
              {/* 答えの一括表示/非表示ボタン */}
              <AnswerButtons />

              {/* 表記説明 */}
              <NotationGuide />

              {/* 概要 */}
              {lessonData.overview && (
                <div className="overview">
                  <div className="title">概要</div>
                  <div dangerouslySetInnerHTML={{ __html: lessonData.overview }} />
                </div>
              )}

              {/* コンテンツ */}
              <div className="markdown-content" dangerouslySetInnerHTML={{ __html: lessonData.content }} />
            </>
          ) : (
            <div className="error-container" style={{ padding: '2rem', border: '2px solid red', borderRadius: '8px', margin: '2rem 0' }}>
              <h2 style={{ color: 'red' }}>❌ レッスンの内容を読み込めませんでした</h2>
              <p style={{ marginTop: '1rem' }}>
                ターミナルのログを確認してください。詳細なエラー情報が出力されています。
              </p>
            </div>
          )}

          {/* ナビゲーション */}
          <div className="text-center d-flex flex-wrap sm-flex-column justify-content-center gy-10 my-10">
            {prevLesson && (
              <div className="d-flex flex-column align-center order-1 mx-10 border border-2 border-subject-color p-10 border-radius-5">
                <a className="w-100" href={`/wh/lessons/${prevLesson.no}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <LeftIcon size={20} />
                  <div>
                    <div>前の内容</div>
                    <div>{prevLesson.title}</div>
                  </div>
                </a>
              </div>
            )}

            <div className="d-flex align-center order-2 mx-10 border border-2 border-subject-color p-10 border-radius-5">
              <a className="w-100" href="/wh" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ListIcon size={20} />
                <span>一覧</span>
              </a>
            </div>

            {nextLesson && (
              <div className="d-flex flex-column align-center order-3 mx-10 border border-2 border-subject-color p-10 border-radius-5">
                <a className="w-100" href={`/wh/lessons/${nextLesson.no}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
      </ThreeColumnLayout>
    </>
  );
}
