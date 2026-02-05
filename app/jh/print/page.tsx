import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '授業プリント（PDF配布） | ちとにとせ',
  description: '日本史の授業プリントをPDF形式で配布しています。',
  keywords: ['日本史', '高校', '受験', 'プリント', 'PDF', 'ちとにとせ'],
};

export default async function PrintPage() {
  return (
    <>
      <link rel="stylesheet" href="/css/subject.css" />
      <link rel="stylesheet" href="/css/jh.css" />
      
      <h1>
        <div className="first-line">授業プリント（PDF配布）</div>
      </h1>
      
      <div className="main-block bg-gray">
        <div className="lessons">
          <h2>授業プリント</h2>
          <p style={{ padding: '20px', textAlign: 'center' }}>
            このページは準備中です。元のHTMLファイル（jh_print.html）からPDFファイルの情報を移植する必要があります。
          </p>
        </div>
      </div>
    </>
  );
}
