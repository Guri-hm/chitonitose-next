'use client';

import { useEffect } from 'react';

export default function TermClickHandler() {
  useEffect(() => {
    // Handle click on .all elements to toggle red text visibility using CSS classes
    const handleTermClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target && target.classList.contains('all')) {
        // Toggle 'show' class instead of using inline styles
        target.classList.toggle('show');
      }
    };

    document.addEventListener('click', handleTermClick);

    return () => {
      document.removeEventListener('click', handleTermClick);
    };
  }, []);

  return null;
}
