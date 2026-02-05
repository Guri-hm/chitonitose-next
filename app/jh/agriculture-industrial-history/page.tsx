import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'テーマ史 - 農業・産業史 | ちとにとせ',
  description: '日本史 テーマ史 農業・産業史のページです。',
  keywords: ['日本史', '高校', '受験', 'テーマ史', '農業史', '産業史', 'ちとにとせ'],
};

export default async function AgricultureIndustrialHistoryPage() {
  return (
    <>
      <link rel="stylesheet" href="/css/subject.css" />
      <link rel="stylesheet" href="/css/jh.css" />
      
      <h1>
        <div className="first-line">日本史 テーマ史</div>
      </h1>
      
      <div className="main-block bg-gray">
        <div className="lessons">
          <h2>農業・産業史</h2>
          <p style={{ padding: '20px', textAlign: 'center' }}>
            このページは準備中です。元のHTMLファイルからコンテンツを移植する必要があります。
          </p>
        </div>
      </div>
    </>
  );
}
