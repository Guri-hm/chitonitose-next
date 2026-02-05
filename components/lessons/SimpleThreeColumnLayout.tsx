'use client';

import { useState } from 'react';
import { ListIcon } from '@/components/ui/Icons';

interface LessonNavigation {
  no: number;
  title: string;
  href: string;
}

interface SimpleThreeColumnLayoutProps {
  prevLesson?: LessonNavigation;
  nextLesson?: LessonNavigation;
  sidebarLeft?: React.ReactNode;
  children: React.ReactNode;
}

export default function SimpleThreeColumnLayout({
  prevLesson,
  nextLesson,
  sidebarLeft,
  children
}: SimpleThreeColumnLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="layout">
      {/* サイドバー左 (目次) */}
      <div className={`left-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        {sidebarLeft}
      </div>

      {/* メインコンテンツ */}
      <div className="main-content">
        {/* モバイルメニューボタン */}
        <button
          className="mobile-menu-button"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="メニュー"
        >
          <ListIcon />
        </button>

        {children}

        {/* ページナビゲーション */}
        {(prevLesson || nextLesson) && (
          <div className="lesson-navigation">
            {prevLesson ? (
              <a href={prevLesson.href} className="nav-button prev">
                <span className="arrow">←</span>
                <div className="nav-content">
                  <span className="nav-label">前へ</span>
                  <span className="nav-title">{prevLesson.title}</span>
                </div>
              </a>
            ) : (
              <div className="nav-button-placeholder"></div>
            )}
            
            {nextLesson ? (
              <a href={nextLesson.href} className="nav-button next">
                <div className="nav-content">
                  <span className="nav-label">次へ</span>
                  <span className="nav-title">{nextLesson.title}</span>
                </div>
                <span className="arrow">→</span>
              </a>
            ) : (
              <div className="nav-button-placeholder"></div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
