'use client';

import { useState } from 'react';
import { ListIcon, LeftIcon, RightIcon } from '@/components/ui/Icons';
import EnhancedAccordionMenu from './EnhancedAccordionMenu';
import AdUnit from '@/components/AdUnit';

interface Page {
  no: number;
  title: string;
  slug?: string; // geo用
}

interface LessonNavigation {
  no?: number;
  title: string;
  href: string;
}

interface ThreeColumnLayoutProps {
  subject: 'jh' | 'wh' | 'geo';
  currentLessonNo?: number;
  currentSection?: 'lessons' | 'omnibus' | 'cultural-history' | 'q-a';
  currentItemId?: number | string;
  currentSlug?: string; // geo用
  pages: Page[];
  title: string;
  prevLesson?: LessonNavigation;
  nextLesson?: LessonNavigation;
  children: React.ReactNode;
}

export default function ThreeColumnLayout({
  subject,
  currentLessonNo,
  currentSection = 'lessons',
  currentItemId,
  currentSlug,
  pages,
  title,
  prevLesson,
  nextLesson,
  children
}: ThreeColumnLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFabOpen, setIsFabOpen] = useState(false);

  const subjectNames: Record<string, string> = {
    jh: '日本史',
    wh: '世界史',
    geo: '地理'
  };

  const openSidebar = () => {
    setIsFabOpen(false);
    setIsSidebarOpen(true);
  };

  return (
    <>
      {/* h1タイトル（画面横幅いっぱい） */}
      <h1><div className="first">{title}</div></h1>

      {/* スマホ用：サイドバーモーダル */}
      {isSidebarOpen && (
        <div className="sidebar-modal-overlay" onClick={() => setIsSidebarOpen(false)}>
          <div className="sidebar-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sidebar-modal-header">
              <h2>{subjectNames[subject]}コンテンツ一覧</h2>
              <button onClick={() => setIsSidebarOpen(false)} aria-label="閉じる">×</button>
            </div>
            <EnhancedAccordionMenu 
              subject={subject} 
              pages={pages} 
              currentLessonNo={currentLessonNo}
              currentSection={currentSection}
              currentItemId={currentItemId}
              currentSlug={currentSlug}
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
            <EnhancedAccordionMenu 
              subject={subject} 
              pages={pages} 
              currentLessonNo={currentLessonNo}
              currentSection={currentSection}
              currentItemId={currentItemId}
              currentSlug={currentSlug}
            />
          </div>
        </aside>

        {/* 中央カラム：メインコンテンツ */}
        <main className="center-column">
          {children}
          <AdUnit />
        </main>

        {/* 右カラム：広告・その他（将来用） */}
        <aside className="right-column">
          {/* 将来的に広告などを配置 */}
        </aside>
      </div>

      {/* スマホ用：画面左下の操作ボタン（コンテンツ一覧／前へ／次へ）
          ヘッダーが常時表示（sticky）になったため、画面上下を固定要素で
          挟むと閲覧できる範囲が狭くなってしまう。そこで小さなボタン1つに
          まとめ、タップ時だけ選択肢を表示する方式にした。
          一覧がサイドバーの左からのスライド表示であることに合わせ、
          ボタンも左下に配置している。 */}
      <div className="mobile-fab-wrapper">
        {isFabOpen && (
          <div className="mobile-fab-backdrop" onClick={() => setIsFabOpen(false)} />
        )}
        {isFabOpen && (
          <div className="mobile-fab-menu">
            {nextLesson ? (
              <a href={nextLesson.href} className="mobile-fab-item">
                <RightIcon size={18} />
                <span>次のページ</span>
              </a>
            ) : (
              <span className="mobile-fab-item disabled">
                <RightIcon size={18} />
                <span>次のページ</span>
              </span>
            )}
            {prevLesson ? (
              <a href={prevLesson.href} className="mobile-fab-item">
                <LeftIcon size={18} />
                <span>前のページ</span>
              </a>
            ) : (
              <span className="mobile-fab-item disabled">
                <LeftIcon size={18} />
                <span>前のページ</span>
              </span>
            )}
            <button className="mobile-fab-item" onClick={openSidebar}>
              <ListIcon size={18} />
              <span>コンテンツ一覧</span>
            </button>
          </div>
        )}
        <button
          className={`mobile-fab-btn${isFabOpen ? ' open' : ''}`}
          onClick={() => setIsFabOpen(!isFabOpen)}
          aria-label={isFabOpen ? 'メニューを閉じる' : 'ページ操作メニューを開く'}
          aria-expanded={isFabOpen}
        >
          <ListIcon size={24} />
        </button>
      </div>
    </>
  );
}

