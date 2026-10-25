'use client';

import { useEffect } from 'react';

/**
 * bodyのclassNameをクライアントサイドで管理するコンポーネント
 * Hydrationエラーを防ぐため、マウント後にclassNameを設定
 */
export default function BodyClassManager() {
  useEffect(() => {
    // 初回マウント時にフォントサイズを設定
    if (typeof window !== 'undefined') {
      const savedFontSize = sessionStorage.getItem('fontSize') || 'm-size-font';
      document.body.className = savedFontSize;
    }
  }, []);

  useEffect(() => {
    // ウィンドウ幅をドラッグで連続的に変更すると、ブレークポイントを跨ぐたびに
    // transition付きの要素（ハンバーガーメニュー等）が中途半端な状態で再描画され、
    // ちらつき（複数フレームの残像）が見えることがある。
    // リサイズ中だけ一時的にtransition/animationを無効化して防止する。
    let timer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      document.documentElement.classList.add('is-resizing');
      clearTimeout(timer);
      timer = setTimeout(() => {
        document.documentElement.classList.remove('is-resizing');
      }, 150);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  return null;
}
