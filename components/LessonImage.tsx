'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useImageGallery } from '@/contexts/ImageGalleryContext';

interface LessonImageProps {
  src: string;
  alt?: string;
  caption?: string;
  className?: string;
  imageIndex?: number;
}

export default function LessonImage({ src, alt = '', caption, className = '', imageIndex = 0 }: LessonImageProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { images, currentIndex, setCurrentIndex, goToNext, goToPrev } = useImageGallery();
  
  // 画像をクリックしたときにフルスクリーン表示
  const handleImageClick = () => {
    setCurrentIndex(imageIndex);
    setIsFullscreen(true);
  };
  
  const closeFullscreen = () => {
    setIsFullscreen(false);
  };
  
  // 次の画像
  const handleNext = () => {
    goToNext();
  };
  
  // 前の画像
  const handlePrev = () => {
    goToPrev();
  };

  // フルスクリーン表示時の現在の画像データ
  const currentImage = images[currentIndex] || { src, alt, caption };
  
  return (
    <>
      <div className={`lesson-image ${className}`}>
        <div 
          className="image-wrapper cursor-pointer"
          onClick={handleImageClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleImageClick()}
        >
          <Image
            src={src}
            alt={alt}
            width={800}
            height={600}
            className="w-full h-auto rounded-lg shadow-md hover:shadow-xl transition-shadow"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI2UwZTBlMCIvPjwvc3ZnPg=="
          />
        </div>
        {caption && (
          <p 
            className="text-sm text-gray-600 mt-2 text-center"
            dangerouslySetInnerHTML={{ __html: caption }}
          />
        )}
      </div>
      
      {/* フルスクリーンモーダル */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={closeFullscreen}
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 z-10"
            onClick={closeFullscreen}
            aria-label="閉じる"
          >
            ×
          </button>
          
          {/* 前へボタン */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-5xl hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            disabled={currentIndex === 0}
            aria-label="前の画像"
          >
            ‹
          </button>
          
          {/* 画像表示 */}
          <div 
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={currentImage.src}
              alt={currentImage.alt}
              width={1920}
              height={1080}
              className="w-auto h-auto max-w-full max-h-[90vh] object-contain"
              quality={100}
            />
            {currentImage.caption && (
              <p 
                className="text-white text-center mt-4"
                dangerouslySetInnerHTML={{ __html: currentImage.caption }}
              />
            )}
            <p className="text-white text-center mt-2 text-sm opacity-70">
              {currentIndex + 1} / {images.length}
            </p>
          </div>
          
          {/* 次へボタン */}
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-5xl hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            disabled={currentIndex === images.length - 1}
            aria-label="次の画像"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
