'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import ThemeSwitch from './ui/ThemeSwitch';
import { SearchIcon } from './ui/Icons';
import './Header.css';

// オリジナルサイトのGoogleカスタム検索（検索エンジンID）
const GOOGLE_CSE_CX = '001747183532355146742:pofmxgarv5s';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fontSize, setFontSize] = useState('m-size-font');
  const [theme, setTheme] = useState('light');

  useEffect(() => {
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
  }, []);

  // モバイルのフルスクリーンメニューを開いている間は、背後のページをスクロールさせない
  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', mobileMenuOpen);
    return () => document.documentElement.classList.remove('menu-open');
  }, [mobileMenuOpen]);

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
    <header id="top-head" className={mobileMenuOpen ? 'open' : ''}>
      <div className="inner">
        <div id="mobile-head">
          <div id="head-logo">
            <Link href="/">
              <Image 
                src="/images/share/header-logo.png" 
                alt="ちとにとせ"
                width={150}
                height={50}
              />
            </Link>
          </div>
          <div id="nav-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} role="button" aria-label={mobileMenuOpen ? 'メニューを閉じる' : 'メニューを開く'} aria-expanded={mobileMenuOpen}>
            <div>
              <p>MENU</p>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
        <nav id="global-nav" className={mobileMenuOpen ? 'open' : ''}>
          <ul role="list">
            <li className="nav-search">
              <form
                action="https://cse.google.com/cse"
                method="get"
                target="_blank"
                rel="noopener noreferrer"
                onSubmit={() => setMobileMenuOpen(false)}
              >
                <input type="hidden" name="cx" value={GOOGLE_CSE_CX} />
                <input type="text" name="q" placeholder="キーワード検索" aria-label="サイト内キーワード検索" className="search-input" />
                <button type="submit" aria-label="検索する" className="search-submit">
                  <SearchIcon size={18} />
                </button>
              </form>
            </li>
            <li>
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <div className="first-line">トップ</div>
                <div className="second-line">Top</div>
              </Link>
            </li>
            <li>
              <Link href="/geo" onClick={() => setMobileMenuOpen(false)}>
                <div className="first-line">地理</div>
                <div className="second-line">Geography</div>
              </Link>
            </li>
            <li>
              <Link href="/jh" onClick={() => setMobileMenuOpen(false)}>
                <div className="first-line">日本史</div>
                <div className="second-line">Japanese history</div>
              </Link>
            </li>
            <li>
              <Link href="/wh" onClick={() => setMobileMenuOpen(false)}>
                <div className="first-line">世界史</div>
                <div className="second-line">World history</div>
              </Link>
            </li>
            <li>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                <div className="first-line">お問い合わせ</div>
                <div className="second-line">Contact</div>
              </Link>
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


