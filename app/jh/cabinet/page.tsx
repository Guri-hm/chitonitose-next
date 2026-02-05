import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '歴代首相 | ちとにとせ',
  description: '日本の歴代首相一覧です。',
  keywords: ['日本史', '高校', '受験', '歴代首相', '内閣', 'ちとにとせ'],
};

export default async function CabinetPage() {
  return (
    <>
      <link rel="stylesheet" href="/css/subject.css" />
      <link rel="stylesheet" href="/css/jh.css" />
      
      <h1>
        <div className="first-line">歴代首相</div>
      </h1>
      
      <div className="main-block bg-gray">
        <div className="lessons">
          <h2>日本の歴代首相</h2>
          <p style={{ padding: '20px', textAlign: 'center' }}>
            このページは準備中です。元のHTMLファイル（jh_cabinet.html）から歴代首相の情報を移植する必要があります。
          </p>
        </div>
      </div>
    </>
  );
}
