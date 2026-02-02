'use client';

import { useState } from 'react';
import Image from 'next/image';

interface GazoImageProps {
  src: string;
  alt?: string;
  caption?: string;
  className?: string;
}

export default function GazoImage({ src, alt = '', caption, className = '' }: GazoImageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="gazo">
        <img
          src={src}
          alt={alt}
          className={`lazyload popup-img ${className}`.trim()}
          onClick={handleClick}
          style={{ cursor: 'pointer' }}
        />
        {caption && (
          <>
            <br />
            {caption}
          </>
        )}
      </div>

      {isModalOpen && (
        <div
          className="image-modal"
          onClick={closeModal}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            cursor: 'pointer',
          }}
        >
          <img
            src={src}
            alt={alt}
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              objectFit: 'contain',
            }}
          />
        </div>
      )}
    </>
  );
}
