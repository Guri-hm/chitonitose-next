'use client';

import { useState } from 'react';
import ImageModal from './ImageModal';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

/**
 * 画像最適化コンポーネント
 * 
 * 機能:
 * - WebP形式の軽量画像を初期表示
 * - クリックで元画像をモーダルで拡大表示
 * - SEO対策とページ速度改善
 * 
 * 使用例:
 * <OptimizedImage src="/share/img/example.jpg" alt="説明" />
 */
export default function OptimizedImage({ src, alt, className = '', width, height }: OptimizedImageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // WebP画像のパスを生成（拡張子を.webpに変更）
  const webpSrc = src.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp');
  
  // WebP画像が存在しない場合は元の画像を使用
  const thumbnailSrc = webpSrc;

  const handleClick = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <img
        src={thumbnailSrc}
        alt={alt}
        className={`optimized-image ${className}`}
        width={width}
        height={height}
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
        loading="lazy"
        onError={(e) => {
          // WebPが存在しない場合は元の画像にフォールバック
          const target = e.target as HTMLImageElement;
          if (target.src === thumbnailSrc && thumbnailSrc !== src) {
            target.src = src;
          }
        }}
      />
      
      {isModalOpen && (
        <ImageModal
          src={src}
          alt={alt}
          onClose={handleClose}
        />
      )}
    </>
  );
}
