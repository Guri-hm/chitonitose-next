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

  return null;
}
