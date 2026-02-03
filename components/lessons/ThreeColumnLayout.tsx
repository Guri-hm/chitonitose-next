'use client';

import { useState } from 'react';
import { ListIcon } from '@/components/ui/Icons';
import AccordionMenu from './AccordionMenu';

interface Page {
  no: number;
  title: string;
}

interface ThreeColumnLayoutProps {
  subject: 'jh' | 'wh' | 'geo';
  currentLessonNo: number;
  pages: Page[];
  title: string;
  children: React.ReactNode;
}

export default function ThreeColumnLayout({
  subject,
  currentLessonNo,
  pages,
  title,
  children
}: ThreeColumnLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const subjectNames: Record<string, string> = {
    jh: '日本史',
    wh: '世界史',
    geo: '地理'
  };

  return (
    <>
      {/* h1タイトル（画面横幅いっぱい） */}
      <h1><div className="first">{title}</div></h1>

      {/* スマホ用：サイドバー表示ボタン */}
      <button
        className="sidebar-toggle-btn"
        onClick={() => setIsSidebarOpen(true)}
        aria-label="コンテンツ一覧を開く"
      >
        <ListIcon size={24} />
      </button>

      {/* スマホ用：サイドバーモーダル */}
      {isSidebarOpen && (
        <div className="sidebar-modal-overlay" onClick={() => setIsSidebarOpen(false)}>
          <div className="sidebar-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sidebar-modal-header">
              <h2>{subjectNames[subject]}コンテンツ一覧</h2>
              <button onClick={() => setIsSidebarOpen(false)} aria-label="閉じる">×</button>
            </div>
            <AccordionMenu 
              subject={subject} 
              pages={pages} 
              currentLessonNo={currentLessonNo} 
            />
          </div>
        </div>
      )}

      {/* 3カラムレイアウト */}
      <div className="three-column-layout">
        {/* 左カラム：コンテンツ一覧（PC/タブレット表示） */}
        <aside className="left-column">
          <div className="sidebar-sticky">
            <h2 className="sidebar-title">{subjectNames[subject]}コンテンツ一覧</h2>
            <AccordionMenu 
              subject={subject} 
              pages={pages} 
              currentLessonNo={currentLessonNo} 
            />
          </div>
        </aside>

        {/* 中央カラム：メインコンテンツ */}
        <main className="center-column">
          {children}
        </main>

        {/* 右カラム：広告・その他（将来用） */}
        <aside className="right-column">
          {/* 将来的に広告などを配置 */}
        </aside>
      </div>
    </>
  );
}
