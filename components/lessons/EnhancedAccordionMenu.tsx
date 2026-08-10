'use client';

import { useState } from 'react';
import './AccordionMenu.css';
import { GEO_CATEGORIES } from '@/lib/geoLessons';

interface Page {
  no: number;
  title: string;
  slug?: string; // geo用のslugベースナビゲーション
}

interface Era {
  name: string;
  range: [number, number];
}

interface ExtraSection {
  title: string;
  items: Array<{
    id: number | string;
    title: string;
    href: string;
  }>;
}

interface EnhancedAccordionMenuProps {
  subject: 'jh' | 'wh' | 'geo';
  pages: Page[];
  currentLessonNo?: number;
  currentSection?: string; // 'lessons' | 'omnibus' | 'cultural-history' | 'q-a'
  currentItemId?: number | string;
  currentSlug?: string; // geo用
}

// 日本史の時代区分
const JH_ERAS: Era[] = [
  { name: '原始・古代', range: [1, 40] },
  { name: '中世', range: [41, 80] },
  { name: '近世', range: [81, 120] },
  { name: '近代', range: [121, 160] },
  { name: '現代', range: [161, 170] },
];

// 世界史の時代区分
const WH_ERAS: Era[] = [
  { name: '古代', range: [1, 26] },
  { name: '中世', range: [27, 44] },
  { name: '近世・近代', range: [45, 81] },
  { name: '近代（２つの大戦）', range: [82, 99] },
  { name: '現代', range: [100, 114] },
];

// 短期攻略の項目
const JH_OMNIBUS_ITEMS = [
  { id: 1, title: '旧石器時代～弥生時代', href: '/jh/omnibus/1' },
  { id: 2, title: '古墳時代～飛鳥時代', href: '/jh/omnibus/2' },
  { id: 3, title: '奈良時代', href: '/jh/omnibus/3' },
  { id: 4, title: '平安時代①', href: '/jh/omnibus/4' },
  { id: 5, title: '平安時代②', href: '/jh/omnibus/5' },
  { id: 6, title: '鎌倉時代①', href: '/jh/omnibus/6' },
  { id: 7, title: '鎌倉時代②', href: '/jh/omnibus/7' },
  { id: 8, title: '室町時代①', href: '/jh/omnibus/8' },
  { id: 9, title: '室町時代②', href: '/jh/omnibus/9' },
  { id: 10, title: '安土桃山時代', href: '/jh/omnibus/10' },
  { id: 11, title: '江戸時代①', href: '/jh/omnibus/11' },
  { id: 12, title: '江戸時代②', href: '/jh/omnibus/12' },
  { id: 13, title: '江戸時代③', href: '/jh/omnibus/13' },
  { id: 14, title: '明治時代①', href: '/jh/omnibus/14' },
  { id: 15, title: '明治時代②', href: '/jh/omnibus/15' },
  { id: 16, title: '明治時代③', href: '/jh/omnibus/16' },
  { id: 17, title: '大正時代', href: '/jh/omnibus/17' },
  { id: 18, title: '昭和時代①', href: '/jh/omnibus/18' },
  { id: 19, title: '昭和時代②', href: '/jh/omnibus/19' },
  { id: 20, title: '昭和時代③', href: '/jh/omnibus/20' },
  { id: 21, title: '昭和時代④', href: '/jh/omnibus/21' },
  { id: 22, title: '昭和時代⑤', href: '/jh/omnibus/22' },
  { id: 23, title: '昭和時代⑥', href: '/jh/omnibus/23' },
  { id: 24, title: '昭和時代⑦', href: '/jh/omnibus/24' },
  { id: 25, title: '昭和時代⑧', href: '/jh/omnibus/25' },
  { id: 26, title: '昭和時代⑨', href: '/jh/omnibus/26' },
];

// テーマ史の項目
const JH_CULTURAL_HISTORY_ITEMS = [
  { id: 1, title: '飛鳥文化～室町文化', href: '/jh/cultural-history/1' },
  { id: 2, title: '桃山文化～化政文化', href: '/jh/cultural-history/2' },
  { id: 3, title: '明治～現代', href: '/jh/cultural-history/3' },
  { id: 'agri', title: '農業・産業史', href: '/jh/agriculture-industrial-history' },
];

// 一問一答の項目
const JH_QA_ITEMS = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  title: `第${i + 1}単元`,
  href: `/jh/q-a/${i + 1}`,
}));

// 世界史のテーマ史の項目
const WH_OMNIBUS_ITEMS = [
  { id: 1, title: '遊牧民', href: '/wh/omnibus/1' },
];

// 世界史の一問一答の項目
const WH_QA_ITEMS = [
  { id: 2, title: 'アジア・アメリカの古代文明', href: '/wh/q-a?unit=2' },
  { id: 10, title: 'ヨーロッパ世界の拡大', href: '/wh/q-a?unit=10' },
];

// geo用：カテゴリ内アコーディオンセクション
function GeoAccordionSection({
  category,
  currentSlug,
}: {
  category: import('@/lib/geoLessons').GeoCategory;
  currentSlug?: string;
}) {
  const [open, setOpen] = useState(() =>
    category.sections.some((sec) => sec.lessons.some((l) => l.slug === currentSlug))
  );
  return (
    <div className="accordion-section">
      <button className="accordion-header" onClick={() => setOpen((v) => !v)}>
        <span className="accordion-title">{category.title}</span>
        <span className={`accordion-arrow ${open ? 'open' : ''}`}>▼</span>
      </button>
      {open && (
        <div className="accordion-content">
          {category.sections.map((sec) => (
            <div key={sec.period} className="era-section">
              <div className="era-header" style={{ cursor: 'default' }}>
                <span>{sec.period}</span>
              </div>
              <ul className="lesson-list">
                {sec.lessons.map((lesson) => (
                  <li key={lesson.slug}>
                    <a
                      href={`/geo/${lesson.slug}`}
                      className={currentSlug === lesson.slug ? 'active' : ''}
                    >
                      <span className="lesson-title">{lesson.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function EnhancedAccordionMenu({
  subject,
  pages,
  currentLessonNo,
  currentSection = 'lessons',
  currentItemId,
  currentSlug,
}: EnhancedAccordionMenuProps) {
  const eras = subject === 'wh' ? WH_ERAS : JH_ERAS;
  const omnibusItems = subject === 'wh' ? WH_OMNIBUS_ITEMS : JH_OMNIBUS_ITEMS;
  const qaItems = subject === 'wh' ? WH_QA_ITEMS : JH_QA_ITEMS;
  
  const subjectColors = {
    jh: { 
      scrollNormal: 'rgba(204, 51, 102, 0.3)',
      scrollHover: 'rgba(204, 51, 102, 0.6)',
      activeBg: '#fce4ec',
      activeText: '#c2185b',
      activeBorder: '#cc3366',
    },
    wh: { 
      scrollNormal: 'rgba(0, 153, 255, 0.3)',
      scrollHover: 'rgba(0, 153, 255, 0.6)',
      activeBg: '#e3f2fd',
      activeText: '#1976d2',
      activeBorder: '#0099FF',
    },
    geo: { 
      scrollNormal: 'rgba(26, 171, 18, 0.3)',
      scrollHover: 'rgba(26, 171, 18, 0.6)',
      activeBg: '#e8f5e9',
      activeText: '#388e3c',
      activeBorder: '#1AAB12',
    },
  };
  
  const colors = subjectColors[subject];
  
  // 初期状態で開くセクションを決定
  const getInitialOpenSections = () => {
    const sections = new Set<string>();
    
    if (currentSection === 'lessons' && currentLessonNo) {
      // 本編：現在のレッスンが属する時代
      sections.add('lessons');
      const eraIndex = eras.findIndex(era => 
        currentLessonNo >= era.range[0] && currentLessonNo <= era.range[1]
      );
      if (eraIndex >= 0) {
        sections.add(`era-${eraIndex}`);
      }
    } else if (currentSection === 'omnibus') {
      sections.add('omnibus');
    } else if (currentSection === 'cultural-history') {
      sections.add('cultural-history');
    } else if (currentSection === 'q-a') {
      sections.add('q-a');
    }
    
    return sections;
  };
  
  const [openSections, setOpenSections] = useState<Set<string>>(getInitialOpenSections());

  const toggleSection = (sectionKey: string) => {
    setOpenSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionKey)) {
        newSet.delete(sectionKey);
      } else {
        newSet.add(sectionKey);
      }
      return newSet;
    });
  };

  // geo はカテゴリ別グループ表示
  if (subject === 'geo') {
    return (
      <div
        className="accordion-menu"
        style={{
          '--scrollbar-color': colors.scrollNormal,
          '--scrollbar-hover-color': colors.scrollHover,
          '--active-bg': colors.activeBg,
          '--active-text': colors.activeText,
          '--active-border': colors.activeBorder,
        } as React.CSSProperties}
      >
        {GEO_CATEGORIES.map((category) => (
          <GeoAccordionSection
            key={category.title}
            category={category}
            currentSlug={currentSlug}
          />
        ))}
      </div>
    );
  }

  return (
    <div 
      className="accordion-menu"
      style={{
        '--scrollbar-color': colors.scrollNormal,
        '--scrollbar-hover-color': colors.scrollHover,
        '--active-bg': colors.activeBg,
        '--active-text': colors.activeText,
        '--active-border': colors.activeBorder,
      } as React.CSSProperties}
    >
      {/* 本編セクション */}
      <div className="accordion-section">
        <button 
          className="accordion-header" 
          onClick={() => toggleSection('lessons')}
        >
          <span className="accordion-title">本編</span>
          <span className={`accordion-arrow ${openSections.has('lessons') ? 'open' : ''}`}>▼</span>
        </button>
        
        {openSections.has('lessons') && (
          <div className="accordion-content">
            {eras.map((era, eraIndex) => {
              const eraPages = pages.filter(p => 
                p.no >= era.range[0] && p.no <= era.range[1]
              );
              
              return (
                <div key={eraIndex} className="era-section">
                  <button 
                    className="era-header" 
                    onClick={() => toggleSection(`era-${eraIndex}`)}
                  >
                    <span>{era.name}</span>
                    <span className={`era-arrow ${openSections.has(`era-${eraIndex}`) ? 'open' : ''}`}>▶</span>
                  </button>
                  
                  {openSections.has(`era-${eraIndex}`) && (
                    <ul className="lesson-list">
                      {eraPages.map(page => (
                        <li key={page.no}>
                          <a 
                            href={`/${subject}/lessons/${page.no}`}
                            className={
                              currentSection === 'lessons' && currentLessonNo === page.no 
                                ? 'active' 
                                : ''
                            }
                          >
                            <span className="lesson-no">{page.no}.</span>
                            <span className="lesson-title">{page.title}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 短期攻略・テーマ史セクション */}
      {(subject === 'jh' || subject === 'wh') && (
        <div className="accordion-section">
          <button 
            className="accordion-header" 
            onClick={() => toggleSection('omnibus')}
          >
            <span className="accordion-title">{subject === 'jh' ? '短期攻略' : 'テーマ史'}</span>
            <span className={`accordion-arrow ${openSections.has('omnibus') ? 'open' : ''}`}>▼</span>
          </button>
          
          {openSections.has('omnibus') && (
            <div className="accordion-content">
              <ul className="lesson-list">
                {omnibusItems.map(item => (
                  <li key={item.id}>
                    <a 
                      href={item.href}
                      className={
                        currentSection === 'omnibus' && currentItemId === item.id 
                          ? 'active' 
                          : ''
                      }
                    >
                      <span className="lesson-no">{item.id}.</span>
                      <span className="lesson-title">{item.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* テーマ史セクション */}
      {subject === 'jh' && (
        <div className="accordion-section">
          <button 
            className="accordion-header" 
            onClick={() => toggleSection('cultural-history')}
          >
            <span className="accordion-title">テーマ史</span>
            <span className={`accordion-arrow ${openSections.has('cultural-history') ? 'open' : ''}`}>▼</span>
          </button>
          
          {openSections.has('cultural-history') && (
            <div className="accordion-content">
              <ul className="lesson-list">
                {JH_CULTURAL_HISTORY_ITEMS.map(item => (
                  <li key={item.id}>
                    <a 
                      href={item.href}
                      className={
                        currentSection === 'cultural-history' && currentItemId === item.id 
                          ? 'active' 
                          : ''
                      }
                    >
                      <span className="lesson-title">{item.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 一問一答セクション */}
      {(subject === 'jh' || subject === 'wh') && (
        <div className="accordion-section">
          <button 
            className="accordion-header" 
            onClick={() => toggleSection('q-a')}
          >
            <span className="accordion-title">一問一答</span>
            <span className={`accordion-arrow ${openSections.has('q-a') ? 'open' : ''}`}>▼</span>
          </button>
          
          {openSections.has('q-a') && (
            <div className="accordion-content">
              <ul className="lesson-list">
                {qaItems.map(item => (
                  <li key={item.id}>
                    <a 
                      href={item.href}
                      className={
                        currentSection === 'q-a' && currentItemId === item.id 
                          ? 'active' 
                          : ''
                      }
                    >
                      <span className="lesson-title">{item.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
