import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { loadCustomLesson } from '@/lib/markdownLoader';
import { loadSubjectPages } from '@/lib/dataLoader';
import AnswerButtons from '@/components/AnswerButtons';
import ThreeColumnLayout from '@/components/lessons/ThreeColumnLayout';
import TermClickHandler from '@/components/lessons/TermClickHandler';
import ImageClickHandler from '@/components/lessons/ImageClickHandler';
import NotationGuide from '@/components/lessons/NotationGuide';
import { ListIcon } from '@/components/ui/Icons';

interface OmnibusPageProps {
  params: Promise<{
    id: string;
  }>;
}

// テーマ史の項目一覧
const omnibusTitles = [
  { id: 1, title: '遊牧民' },
];

export async function generateMetadata({ params }: OmnibusPageProps): Promise<Metadata> {
  const { id } = await params;
  const omnibusId = parseInt(id, 10);
  const omnibus = omnibusTitles.find(o => o.id === omnibusId);

  if (!omnibus) {
    return {
      title: 'ページが見つかりません | ちとにとせ',
    };
  }

  return {
    title: `テーマ史 - ${omnibus.title} | ちとにとせ`,
    description: `世界史 テーマ史 ${omnibus.title}のページです。`,
    keywords: ['世界史', '高校', '受験', 'テーマ史', omnibus.title, 'ちとにとせ'],
  };
}

export async function generateStaticParams() {
  return omnibusTitles.map((omnibus) => ({
    id: omnibus.id.toString(),
  }));
}

export default async function OmnibusPage({ params }: OmnibusPageProps) {
  const { id } = await params;
  const omnibusId = parseInt(id, 10);
  const omnibus = omnibusTitles.find(o => o.id === omnibusId);

  if (!omnibus) {
    notFound();
  }

  let lessonData = null;
  try {
    lessonData = await loadCustomLesson('wh', 'omnibus', omnibusId);
  } catch (error) {
    console.error(`Failed to load omnibus ${omnibusId}:`, error);
  }

  const pages = await loadSubjectPages(1);

  return (
    <>
      <link rel="stylesheet" href="/css/wh.css" />
      <link rel="stylesheet" href="/css/content_common.css" />

      <ThreeColumnLayout
        subject="wh"
        pages={pages}
        title={omnibus.title}
        currentSection="omnibus"
        currentItemId={omnibusId}
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
              <h2 style={{ color: 'red' }}>❌ コンテンツを読み込めませんでした</h2>
              <p style={{ marginTop: '1rem' }}>
                ターミナルのログを確認してください。詳細なエラー情報が出力されています。
              </p>
            </div>
          )}

          {/* ナビゲーション */}
          <div className="text-center d-flex flex-wrap sm-flex-column justify-content-center gy-10 my-10">
            <div className="d-flex align-center order-2 mx-10 border border-2 border-subject-color p-10 border-radius-5">
              <a className="w-100" href="/wh" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ListIcon size={20} />
                <span>一覧</span>
              </a>
            </div>
          </div>
        </div>
      </ThreeColumnLayout>
    </>
  );
}
