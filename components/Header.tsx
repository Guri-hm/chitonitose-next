'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import ThemeSwitch from './ui/ThemeSwitch';
import './Header.css';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fontSize, setFontSize] = useState('m-size-font');
  const [theme, setTheme] = useState('light');
  const [isFixed, setIsFixed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // フォントサイズの初期化
    const savedFontSize = sessionStorage.getItem('fontSize') || 'm-size-font';
    setFontSize(savedFontSize);
    document.body.className = savedFontSize;

    // テーマの初期化
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    // スクロールイベント（固定ヘッダー）
    const header = document.getElementById('top-head');
    if (!header) return;
    
    // h1要素（トップページのヒーロー画像）を取得
    const h1Element = document.getElementById('top');
    let triggerPosition = 0;
    
    if (h1Element) {
      // h1要素がある場合（トップページ）、その高さを取得
      triggerPosition = h1Element.offsetHeight;
    } else {
      // h1要素がない場合（他のページ）、ヘッダーの初期位置を使用
      const headerRect = header.getBoundingClientRect();
      triggerPosition = headerRect.top + window.scrollY;
    }

    const handleScroll = () => {
      if (window.scrollY > triggerPosition) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    // 初期チェック
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeFontSize = (newSize: string) => {
    setFontSize(newSize);
    document.body.className = newSize;
    sessionStorage.setItem('fontSize', newSize);
  };

  const handleThemeChange = (isDark: boolean) => {
    const newTheme = isDark ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  return (
    <header id="top-head" className={mounted && isFixed ? 'fixed' : ''}>
      <div className="inner">
        <div id="mobile-head">
          <div id="head-logo">
            <Link href="/">
              <Image 
                src="/images/share/header-logo.png" 
                alt="ちとにとせ"
                width={150}
                height={50}
                className={mounted && isFixed ? 'smaller' : ''}
              />
            </Link>
          </div>
          <div id="nav-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <div>
              <p>MENU</p>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
        <nav id="global-nav" className={mobileMenuOpen ? 'open' : ''}>
          <ul>
            <li>
              <Link href="/">
                <div className="first-line">トップ</div>
                <div className="second-line">Top</div>
              </Link>
            </li>
            <li>
              <Link href="/geo">
                <div className="first-line">地理</div>
                <div className="second-line">Geography</div>
              </Link>
            </li>
            <li>
              <Link href="/jh">
                <div className="first-line">日本史</div>
                <div className="second-line">Japanese history</div>
              </Link>
            </li>
            <li>
              <Link href="/wh">
                <div className="first-line">世界史</div>
                <div className="second-line">World history</div>
              </Link>
            </li>
            <li>
              <a href="/charts">
                <div className="first-line">📊 グラフ</div>
                <div className="second-line">Charts</div>
              </a>
            </li>
          </ul>
          <div className="controls">
            <div className="font-size-control">
              <span>文字サイズ: </span>
              <button 
                className={fontSize === 's-size-font' ? 'active' : ''} 
                onClick={() => changeFontSize('s-size-font')}
                data-font="s-size-font"
              >
                小
              </button>
              <button 
                className={fontSize === 'm-size-font' ? 'active' : ''} 
                onClick={() => changeFontSize('m-size-font')}
                data-font="m-size-font"
              >
                中
              </button>
              <button 
                className={fontSize === 'l-size-font' ? 'active' : ''} 
                onClick={() => changeFontSize('l-size-font')}
                data-font="l-size-font"
              >
                大
              </button>
            </div>
            <div className="theme-control">
              <ThemeSwitch 
                onChange={handleThemeChange}
                defaultChecked={theme === 'dark'}
              />
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}


