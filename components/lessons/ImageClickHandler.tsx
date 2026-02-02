'use client';

import { useEffect } from 'react';

export default function ImageClickHandler() {
  useEffect(() => {
    const handleImageClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Check if the clicked element is an image with popup-img class
      if (target && target.tagName === 'IMG' && target.classList.contains('popup-img')) {
        const img = target as HTMLImageElement;
        
        // Create modal overlay
        const modal = document.createElement('div');
        modal.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.9);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          cursor: pointer;
        `;
        
        // Create modal image
        const modalImg = document.createElement('img');
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        modalImg.style.cssText = `
          max-width: 90%;
          max-height: 90%;
          object-fit: contain;
        `;
        
        modal.appendChild(modalImg);
        document.body.appendChild(modal);
        
        // Close modal on click
        modal.addEventListener('click', () => {
          document.body.removeChild(modal);
        });
        
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        
        // Restore scroll when modal is closed
        modal.addEventListener('click', () => {
          document.body.style.overflow = '';
        }, { once: true });
      }
    };
    
    document.addEventListener('click', handleImageClick);
    
    return () => {
      document.removeEventListener('click', handleImageClick);
    };
  }, []);
  
  return null;
}
