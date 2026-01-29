'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface ImageData {
  src: string;
  alt: string;
  caption: string;
}

interface ImageGalleryContextType {
  images: ImageData[];
  currentIndex: number;
  setImages: (images: ImageData[]) => void;
  setCurrentIndex: (index: number) => void;
  goToNext: () => void;
  goToPrev: () => void;
}

const ImageGalleryContext = createContext<ImageGalleryContextType | undefined>(undefined);

export function ImageGalleryProvider({ children }: { children: ReactNode }) {
  const [images, setImages] = useState<ImageData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <ImageGalleryContext.Provider
      value={{
        images,
        currentIndex,
        setImages,
        setCurrentIndex,
        goToNext,
        goToPrev,
      }}
    >
      {children}
    </ImageGalleryContext.Provider>
  );
}

export function useImageGallery() {
  const context = useContext(ImageGalleryContext);
  if (context === undefined) {
    throw new Error('useImageGallery must be used within ImageGalleryProvider');
  }
  return context;
}
