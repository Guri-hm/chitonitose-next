'use client';

import { useState } from 'react';
import './AccordionMenu.css';

interface Page {
  no: number;
  title: string;
}

interface Era {
  name: string;
  range: [number, number]; // [開始no, 終了no]
}

interface AccordionMenuProps {
  subject: 'jh' | 'wh' | 'geo';
  pages: Page[];
  currentLessonNo: number;
}

// 日本史の時代区分
const JH_ERAS: Era[] = [
  { name: '原始・古代', range: [1, 40] },
  { name: '中世', range: [41, 80] },
  { name: '近世', range: [81, 120] },
  { name: '近代', range: [121, 160] },
  { name: '現代', range: [161, 170] },
];

// 世界史の時代区分（仮）
const WH_ERAS: Era[] = [
  { name: '古代文明', range: [1, 40] },
  { name: '中世', range: [41, 80] },
  { name: '近代', range: [81, 120] },
  { name: '現代', range: [121, 170] },
];

// 地理の時代区分（仮）
const GEO_ERAS: Era[] = [
  { name: '世界の地理', range: [1, 50] },
  { name: '日本の地理', range: [51, 100] },
];

export default function AccordionMenu({ subject, pages, currentLessonNo }: AccordionMenuProps) {
  const eras = subject === 'jh' ? JH_ERAS : subject === 'wh' ? WH_ERAS : GEO_ERAS;
  
  // 科目別のスクロールバー色とアクティブ色（規定カラーに基づく淡い色）
  const subjectColors = {
    jh: { 
      scrollNormal: 'rgba(204, 51, 102, 0.3)',  // #cc3366 (jh.css --subject-color)
      scrollHover: 'rgba(204, 51, 102, 0.6)',
      activeBg: '#fce4ec',                       // 淡いピンク
      activeText: '#c2185b',                     // 濃いピンク
      activeBorder: '#cc3366',                   // jh規定カラー
    },
    wh: { 
      scrollNormal: 'rgba(0, 153, 255, 0.3)',   // #0099FF (wh.css --subject-color)
      scrollHover: 'rgba(0, 153, 255, 0.6)',
      activeBg: '#e3f2fd',                       // 淡い青
      activeText: '#1976d2',                     // 濃い青
      activeBorder: '#0099FF',                   // wh規定カラー
    },
    geo: { 
      scrollNormal: 'rgba(26, 171, 18, 0.3)',   // #1AAB12 (geo.css --subject-color)
      scrollHover: 'rgba(26, 171, 18, 0.6)',
      activeBg: '#e8f5e9',                       // 淡い緑
      activeText: '#388e3c',                     // 濃い緑
      activeBorder: '#1AAB12',                   // geo規定カラー
    },
  };
  
  const colors = subjectColors[subject];
  
  // 現在のレッスンが属する時代を初期状態で開く
  const currentEraIndex = eras.findIndex(era => 
    currentLessonNo >= era.range[0] && currentLessonNo <= era.range[1]
  );
  
  const [openEras, setOpenEras] = useState<Set<number>>(
    new Set(currentEraIndex >= 0 ? [currentEraIndex] : [])
  );

  const toggleEra = (index: number) => {
    setOpenEras(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div 
      className="accordion-menu"
      style={{
        '--scrollbar-color': colors.scrollNormal,
        '--scrollbar-hover-color': colors.scrollHover,
        '--active-bg-color': colors.activeBg,
        '--active-text-color': colors.activeText,
        '--active-border-color': colors.activeBorder,
      } as React.CSSProperties}
    >
      {eras.map((era, eraIndex) => {
        const isOpen = openEras.has(eraIndex);
        const eraPages = pages.filter(p => p.no >= era.range[0] && p.no <= era.range[1]);
        
        return (
          <div key={eraIndex} className={`accordion-item ${isOpen ? 'open' : ''}`}>
            <button
              className="accordion-header"
              onClick={() => toggleEra(eraIndex)}
              aria-expanded={isOpen}
            >
              <span className="accordion-title">{era.name}</span>
              <span className="accordion-icon">{isOpen ? '−' : '+'}</span>
            </button>
            
            {isOpen && (
              <div className="accordion-content">
                {eraPages.map(page => (
                  <a
                    key={page.no}
                    href={`/${subject}/lessons/${page.no}`}
                    className={currentLessonNo === page.no ? 'active' : ''}
                  >
                    <span className="lesson-no">{page.no}</span>
                    <span className="lesson-title">{page.title}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
