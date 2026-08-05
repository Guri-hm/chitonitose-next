import type { Metadata } from 'next';
import { loadQAData, loadUnitInfo, loadFileInfo, loadSubjectPages } from '@/lib/dataLoader';
import ThreeColumnLayout from '@/components/lessons/ThreeColumnLayout';
import TermClickHandler from '@/components/lessons/TermClickHandler';
import ImageClickHandler from '@/components/lessons/ImageClickHandler';
import QAContent from '@/components/lessons/QAContent';

export const metadata: Metadata = {
  title: '一問一答 | 世界史 | ちとにとせ',
  description: '世界史の一問一答ページです。単元・授業番号で絞り込めます。',
  keywords: ['世界史', '高校', '受験', '一問一答', 'ちとにとせ'],
};

export default async function QAPage() {
  const [pages, allItems, units, fileInfo] = await Promise.all([
    loadSubjectPages(1),
    loadQAData('wh'),
    loadUnitInfo(1),
    loadFileInfo('wh'),
  ]);

  return (
    <>
      <link rel="stylesheet" href="/css/wh.css" />
      <link rel="stylesheet" href="/css/content_common.css" />

      <ThreeColumnLayout
        subject="wh"
        pages={pages}
        title="世界史 一問一答"
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
