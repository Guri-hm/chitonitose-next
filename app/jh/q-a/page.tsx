import type { Metadata } from 'next';
import { getPages, loadQAData, loadUnitInfo, loadFileInfo } from '@/lib/dataLoader';
import ThreeColumnLayout from '@/components/lessons/ThreeColumnLayout';
import TermClickHandler from '@/components/lessons/TermClickHandler';
import ImageClickHandler from '@/components/lessons/ImageClickHandler';
import QAContent from '@/components/lessons/QAContent';

export const metadata: Metadata = {
  title: '一問一答 | 日本史 | ちとにとせ',
  description: '日本史の一問一答ページです。単元・授業番号で絞り込めます。',
  keywords: ['日本史', '高校', '受験', '一問一答', 'ちとにとせ'],
};

export default async function QAPage() {
  const [pages, allItems, units, fileInfo] = await Promise.all([
    getPages('jh'),
    loadQAData('jh'),
    loadUnitInfo(2),
    loadFileInfo('jh'),
  ]);

  return (
    <>
      <link rel="stylesheet" href="/css/jh.css" />
      <link rel="stylesheet" href="/css/content_common.css" />

      <ThreeColumnLayout
        subject="jh"
        pages={pages}
        title="日本史 一問一答"
        currentSection="q-a"
      >
        <TermClickHandler />
        <ImageClickHandler />
        <div id="toc-range" className="contents">

          <QAContent
            allItems={allItems}
            units={units}
            fileInfo={fileInfo}
          />
        </div>
      </ThreeColumnLayout>
    </>
  );
}
