'use client';

import { useEffect } from 'react';

export default function TermClickHandler() {
  useEffect(() => {
    // Original chg() function from PHP site
    const handleTermClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target && target.classList.contains('all')) {
        if (target.style.color === 'rgb(255, 0, 0)' || target.style.color === 'red') {
          target.style.color = '';
        } else {
          target.style.color = '#FF0000';
        }
      }
    };

    document.addEventListener('click', handleTermClick);

    return () => {
      document.removeEventListener('click', handleTermClick);
    };
  }, []);

  return null;
}
