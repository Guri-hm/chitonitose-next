import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPages } from '@/lib/dataLoader';
import ThreeColumnLayout from '@/components/lessons/ThreeColumnLayout';
import TermClickHandler from '@/components/lessons/TermClickHandler';
import ImageClickHandler from '@/components/lessons/ImageClickHandler';
import AnswerButtons from '@/components/AnswerButtons';
import TableOfContents from '@/components/lessons/TableOfContents';
import NotationGuide from '@/components/lessons/NotationGuide';
import { PenIcon, ListIcon, RightIcon, LeftIcon } from '@/components/ui/Icons';

interface QAPageProps {
  params: Promise<{
    id: string;
  }>;
}

// 一問一答のタイトル一覧
const qaTitles = [
  { id: 1, title: '旧石器時代', unit: 1 },
  { id: 2, title: '古墳時代', unit: 2 },
  { id: 3, title: '奈良時代', unit: 3 },
  { id: 4, title: '平安時代', unit: 4 },
  { id: 5, title: '平安時代（院政期）', unit: 5 },
  { id: 6, title: '鎌倉時代', unit: 6 },
  { id: 7, title: '建武の新政', unit: 7 },
  { id: 8, title: '室町時代', unit: 8 },
  { id: 9, title: '戦国時代・安土桃山時代', unit: 9 },
  { id: 10, title: '江戸時代', unit: 10 },
  { id: 11, title: '江戸時代（動揺期）', unit: 11 },
  { id: 12, title: '江戸時代（幕末）', unit: 12 },
  { id: 13, title: '明治時代', unit: 13 },
  { id: 14, title: '明治時代（憲法発布後）', unit: 14 },
  { id: 15, title: '大正時代', unit: 15 },
  { id: 16, title: '昭和（戦前）', unit: 16 },
  { id: 17, title: '昭和（占領期）', unit: 17 },
  { id: 18, title: '昭和（独立後）', unit: 18 },
];

export async function generateMetadata({ params }: QAPageProps): Promise<Metadata> {
  const { id } = await params;
  const qaId = parseInt(id, 10);
  const qa = qaTitles.find(q => q.id === qaId);

  if (!qa) {
    return {
      title: 'ページが見つかりません | ちとにとせ',
    };
  }

  return {
    title: `一問一答 - ${qa.title} | ちとにとせ`,
    description: `日本史 一問一答 ${qa.title}のページです。`,
    keywords: ['日本史', '高校', '受験', '一問一答', qa.title, 'ちとにとせ'],
  };
}

export async function generateStaticParams() {
  return qaTitles.map((qa) => ({
    id: qa.id.toString(),
  }));
}

export default async function QAPage({ params }: QAPageProps) {
  const { id } = await params;
  const qaId = parseInt(id, 10);
  const qa = qaTitles.find(q => q.id === qaId);

  if (!qa) {
    notFound();
  }

  const prevQA = qaTitles.find(q => q.id === qaId - 1);
  const nextQA = qaTitles.find(q => q.id === qaId + 1);

  // レッスンページ一覧を取得（アコーディオンメニュー用）
  const pages = await getPages('jh');

  return (
    <>
      <link rel="stylesheet" href="/css/jh.css" />
      <link rel="stylesheet" href="/css/content_common.css" />
      
      <ThreeColumnLayout
        subject="jh"
        pages={pages}
        title="日本史 一問一答"
        currentSection="q-a"
        currentItemId={qaId}
        prevLesson={prevQA ? { no: prevQA.id, title: prevQA.title, href: `/jh/q-a/${prevQA.id}` } : undefined}
        nextLesson={nextQA ? { no: nextQA.id, title: nextQA.title, href: `/jh/q-a/${nextQA.id}` } : undefined}
      >
        <TermClickHandler />
        <ImageClickHandler />
        <div id="toc-range" className="contents">
          <h2>{qa.title}</h2>
          <p style={{ padding: '20px', textAlign: 'center' }}>
            一問一答システムは実装中です。<br />
            元ページ: origin/chitonitose/jh/jh_exercises_q_a.html?unit={qa.unit}<br />
            データベースから問題データを読み込んで、インタラクティブなQ&Aシステムを実装する予定です。
          </p>

          {/* ナビゲーション */}
          <div className="text-center d-flex flex-wrap sm-flex-column justify-content-center gy-10 my-10">
            {prevQA && (
              <div className="d-flex flex-column align-center order-1 mx-10 border border-2 border-subject-color p-10 border-radius-5">
                <a className="w-100" href={`/jh/q-a/${prevQA.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <LeftIcon size={20} />
                  <div>
                    <div>前の内容</div>
                    <div>{prevQA.title}</div>
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
            
            {nextQA && (
              <div className="d-flex flex-column align-center order-3 mx-10 border border-2 border-subject-color p-10 border-radius-5">
                <a className="w-100" href={`/jh/q-a/${nextQA.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div>
                    <div>次の内容</div>
                    <div>{nextQA.title}</div>
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
