import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getMDXLesson } from '@/lib/mdxLoader';
import { getPages } from '@/lib/dataLoader';
import ThreeColumnLayout from '@/components/lessons/ThreeColumnLayout';
import TermClickHandler from '@/components/lessons/TermClickHandler';
import ImageClickHandler from '@/components/lessons/ImageClickHandler';
import AnswerButtons from '@/components/AnswerButtons';
import TableOfContents from '@/components/lessons/TableOfContents';
import NotationGuide from '@/components/lessons/NotationGuide';
import { PenIcon, ListIcon, RightIcon, LeftIcon } from '@/components/ui/Icons';

interface CulturalHistoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

// テーマ史（文化史）のタイトル一覧
const culturalHistoryTitles = [
  { id: 1, title: '文化史（飛鳥文化～室町文化）' },
  { id: 2, title: '文化史（桃山文化～化政文化）' },
  { id: 3, title: '文化史（明治～現代）' },
];

export async function generateMetadata({ params }: CulturalHistoryPageProps): Promise<Metadata> {
  const { id } = await params;
  const historyId = parseInt(id, 10);
  const history = culturalHistoryTitles.find(h => h.id === historyId);

  if (!history) {
    return {
      title: 'ページが見つかりません | ちとにとせ',
    };
  }

  return {
    title: `テーマ史 - ${history.title} | ちとにとせ`,
    description: `日本史 テーマ史 ${history.title}のページです。`,
    keywords: ['日本史', '高校', '受験', 'テーマ史', '文化史', 'ちとにとせ'],
  };
}

export async function generateStaticParams() {
  return culturalHistoryTitles.map((history) => ({
    id: history.id.toString(),
  }));
}

export default async function CulturalHistoryPage({ params }: CulturalHistoryPageProps) {
  const { id } = await params;
  const historyId = parseInt(id, 10);
  const history = culturalHistoryTitles.find(h => h.id === historyId);

  if (!history) {
    notFound();
  }

  const prevHistory = culturalHistoryTitles.find(h => h.id === historyId - 1);
  const nextHistory = culturalHistoryTitles.find(h => h.id === historyId + 1);

  // レッスンページ一覧を取得（アコーディオンメニュー用）
  const pages = await getPages('jh');

  // MDXコンテンツを読み込み
  let mdxData = null;
  let mdxError = null;
  try {
    mdxData = await getMDXLesson('jh/cultural-history', String(historyId));
  } catch (error) {
    console.error(`[PAGE ERROR] Failed to load cultural history ${historyId}:`, error);
    mdxError = error instanceof Error ? error.message : String(error);
  }

  return (
    <>
      <link rel="stylesheet" href="/css/jh.css" />
      <link rel="stylesheet" href="/css/content_common.css" />
      
      <ThreeColumnLayout
        subject="jh"
        pages={pages}
        title={mdxData?.frontmatter.title || history.title}
        currentSection="cultural-history"
        currentItemId={historyId}
        prevLesson={prevHistory ? { no: prevHistory.id, title: prevHistory.title, href: `/jh/cultural-history/${prevHistory.id}` } : undefined}
        nextLesson={nextHistory ? { no: nextHistory.id, title: nextHistory.title, href: `/jh/cultural-history/${nextHistory.id}` } : undefined}
      >
        <TermClickHandler />
        <ImageClickHandler />
        <div id="toc-range" className="contents">
          {mdxData ? (
            <>
              {/* 答えの一括表示/非表示ボタン */}
              <AnswerButtons />
              
              {/* 表記説明 */}
              <NotationGuide />
              
              {/* 目次 */}
              <TableOfContents toc={mdxData.toc} />
              
              {/* MDXコンテンツ */}
              <div className="markdown-content">
                {mdxData.content}
              </div>
            </>
          ) : (
            <div className="error-container" style={{ padding: '2rem', border: '2px solid red', borderRadius: '8px', margin: '2rem 0' }}>
              <h2 style={{ color: 'red' }}>❌ コンテンツを読み込めませんでした</h2>
              {mdxError && (
                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
                  <strong>エラー詳細:</strong>
                  <pre style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {mdxError}
                  </pre>
                </div>
              )}
              <p style={{ marginTop: '1rem' }}>
                コンテンツファイル `content/jh/cultural-history/{historyId}.md` を作成してください。<br />
                元ファイル: origin/chitonitose/jh/jh_omnibus_cultural_history{historyId}.html
              </p>
            </div>
          )}

          {/* ナビゲーション */}
          <div className="text-center d-flex flex-wrap sm-flex-column justify-content-center gy-10 my-10">
            {prevHistory && (
              <div className="d-flex flex-column align-center order-1 mx-10 border border-2 border-subject-color p-10 border-radius-5">
                <a className="w-100" href={`/jh/cultural-history/${prevHistory.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <LeftIcon size={20} />
                  <div>
                    <div>前の内容</div>
                    <div>{prevHistory.title}</div>
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
            
            {nextHistory && (
              <div className="d-flex flex-column align-center order-3 mx-10 border border-2 border-subject-color p-10 border-radius-5">
                <a className="w-100" href={`/jh/cultural-history/${nextHistory.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div>
                    <div>次の内容</div>
                    <div>{nextHistory.title}</div>
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
