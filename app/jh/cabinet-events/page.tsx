import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '組閣中の出来事 | ちとにとせ',
  description: '各内閣組閣中の主な出来事の一覧です。',
  keywords: ['日本史', '高校', '受験', '内閣', '出来事', 'ちとにとせ'],
};

export default async function CabinetEventsPage() {
  return (
    <>
      <link rel="stylesheet" href="/css/subject.css" />
      <link rel="stylesheet" href="/css/jh.css" />
      
      <h1>
        <div className="first-line">組閣中の出来事</div>
      </h1>
      
      <div className="main-block bg-gray">
        <div className="lessons">
          <h2>各内閣組閣中の主な出来事</h2>
          <p style={{ padding: '20px', textAlign: 'center' }}>
            このページは準備中です。元のHTMLファイル（jh_cabinet2.html）から組閣中の出来事の情報を移植する必要があります。
          </p>
        </div>
      </div>
    </>
  );
}
