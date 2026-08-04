import type { Metadata } from 'next';
import { loadPdfList } from '@/lib/dataLoader';

export const metadata: Metadata = {
  title: '授業プリント（PDF配布） | ちとにとせ',
  description: '日本史の授業プリントをPDF形式で配布しています。',
  keywords: ['日本史', '高校', '受験', 'プリント', 'PDF', 'ちとにとせ'],
};

export default async function PrintPage() {
  const pdfList = await loadPdfList('jh');

  return (
    <>
      <link rel="stylesheet" href="/css/subject.css" />
      <link rel="stylesheet" href="/css/jh.css" />
      <link rel="stylesheet" href="/css/pdf.css" />

      <h1>
        <div className="first-line">授業プリント（PDF配布）</div>
      </h1>

      <div className="main-block bg-gray">
        <div id="toc-range" className="contents">
          <div className="overview">
            リンク先は、授業で使用しているプリントのPDFです。学習・教材研究に役立てていただければ幸いです。再配布はご遠慮ください。
            <br />
            PDFファイルの閲覧にはAdobe Reader等のPDF閲覧ソフトが必要です。
          </div>

          <table className="table_pdflist">
            <tbody>
              {pdfList.map((pdf) => (
                <tr key={pdf.no}>
                  <th>No.{pdf.no}</th>
                  <td>
                    <a
                      className="link-active"
                      href={`/pdf/jh_print/${pdf.file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {pdf.title}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
