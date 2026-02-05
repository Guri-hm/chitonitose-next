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

interface OmnibusPageProps {
  params: Promise<{
    id: string;
  }>;
}

// 短期攻略のタイトル一覧
const omnibusTitles = [
  { id: 1, title: '旧石器時代～弥生時代' },
  { id: 2, title: '古墳時代' },
  { id: 3, title: '飛鳥時代' },
  { id: 4, title: '奈良時代' },
  { id: 5, title: '平安時代①' },
  { id: 6, title: '平安時代②' },
  { id: 7, title: '鎌倉時代①' },
  { id: 8, title: '鎌倉時代②' },
  { id: 9, title: '室町時代①' },
  { id: 10, title: '室町時代②' },
  { id: 11, title: '戦国時代' },
  { id: 12, title: '江戸時代①' },
  { id: 13, title: '江戸時代②' },
  { id: 14, title: '江戸時代③' },
  { id: 15, title: '江戸時代④' },
  { id: 16, title: '江戸時代⑤' },
  { id: 17, title: '明治時代①' },
  { id: 18, title: '明治時代②' },
  { id: 19, title: '明治時代③' },
  { id: 20, title: '明治時代④（明治の内閣）' },
  { id: 21, title: '大正時代①（大正の内閣）' },
  { id: 22, title: '大正時代②' },
  { id: 23, title: '昭和時代①' },
  { id: 24, title: '昭和時代②' },
  { id: 25, title: '昭和時代③' },
  { id: 26, title: '戦後史①' },
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
    title: `短期攻略 - ${omnibus.title} | ちとにとせ`,
    description: `日本史 短期攻略 ${omnibus.title}のページです。`,
    keywords: ['日本史', '高校', '受験', '短期攻略', omnibus.title, 'ちとにとせ'],
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

  const prevOmnibus = omnibusTitles.find(o => o.id === omnibusId - 1);
  const nextOmnibus = omnibusTitles.find(o => o.id === omnibusId + 1);

  // レッスンページ一覧を取得（アコーディオンメニュー用）
  const pages = await getPages('jh');

  // MDXコンテンツを読み込み
  let mdxData = null;
  let mdxError = null;
  try {
    mdxData = await getMDXLesson('jh/omnibus', String(omnibusId));
  } catch (error) {
    console.error(`[PAGE ERROR] Failed to load omnibus ${omnibusId}:`, error);
    mdxError = error instanceof Error ? error.message : String(error);
  }

  return (
    <>
      <link rel="stylesheet" href="/css/jh.css" />
      <link rel="stylesheet" href="/css/content_common.css" />
      
      <ThreeColumnLayout
        subject="jh"
        pages={pages}
        title="日本史 短期攻略"
        currentSection="omnibus"
        currentItemId={omnibusId}
        prevLesson={prevOmnibus ? { no: prevOmnibus.id, title: prevOmnibus.title, href: `/jh/omnibus/${prevOmnibus.id}` } : undefined}
        nextLesson={nextOmnibus ? { no: nextOmnibus.id, title: nextOmnibus.title, href: `/jh/omnibus/${nextOmnibus.id}` } : undefined}
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
                コンテンツファイル `content/jh/omnibus/{omnibusId}.md` を作成してください。
              </p>
            </div>
          )}

          {/* ナビゲーション */}
          <div className="text-center d-flex flex-wrap sm-flex-column justify-content-center gy-10 my-10">
            {prevOmnibus && (
              <div className="d-flex flex-column align-center order-1 mx-10 border border-2 border-subject-color p-10 border-radius-5">
                <a className="w-100" href={`/jh/omnibus/${prevOmnibus.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <LeftIcon size={20} />
                  <div>
                    <div>前の内容</div>
                    <div>{prevOmnibus.title}</div>
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
            
            {nextOmnibus && (
              <div className="d-flex flex-column align-center order-3 mx-10 border border-2 border-subject-color p-10 border-radius-5">
                <a className="w-100" href={`/jh/omnibus/${nextOmnibus.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div>
                    <div>次の内容</div>
                    <div>{nextOmnibus.title}</div>
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
