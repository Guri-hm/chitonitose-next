'use client';

import { useEffect } from 'react';
import './ImageModal.css';

interface ImageModalProps {
  src: string;
  alt: string;
  onClose: () => void;
}

/**
 * 画像拡大表示用モーダルコンポーネント
 * 
 * 機能:
 * - 画像をフルサイズで表示
 * - 背景クリックまたはESCキーで閉じる
 * - スムーズなフェードイン/フェードアウトアニメーション
 */
export default function ImageModal({ src, alt, onClose }: ImageModalProps) {
  useEffect(() => {
    // ESCキーで閉じる
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // スクロールを無効化
    document.body.style.overflow = 'hidden';
    
    window.addEventListener('keydown', handleEscape);
    
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="image-modal-backdrop" onClick={handleBackdropClick}>
      <div className="image-modal-content">
        <button
          className="image-modal-close"
          onClick={onClose}
          aria-label="閉じる"
        >
          ×
        </button>
        <img
          src={src}
          alt={alt}
          className="image-modal-image"
        />
        <p className="image-modal-caption">{alt}</p>
      </div>
    </div>
  );
}
