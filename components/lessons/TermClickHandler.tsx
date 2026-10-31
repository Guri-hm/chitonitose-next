'use client';

import { useEffect } from 'react';

export default function TermClickHandler() {
  useEffect(() => {
    // Handle click on .all / .choice elements to toggle the answer using CSS classes
    const handleTermClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target) return;
      if (target.classList.contains('all')) {
        target.classList.toggle('show');
        return;
      }
      // 《A/B》形式の選択肢：クリックで正しい選択肢を枠で囲み、誤りに取り消し線を引く
      const choice = target.closest('.choice');
      if (choice) choice.classList.toggle('show');
    };

    document.addEventListener('click', handleTermClick);

    return () => {
      document.removeEventListener('click', handleTermClick);
    };
  }, []);

  return null;
}
