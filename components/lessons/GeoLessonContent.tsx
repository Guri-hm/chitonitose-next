'use client';

import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import LessonImage from '@/components/LessonImage';
import LessonChart from '@/components/charts/LessonChart';
import { useImageGallery } from '@/contexts/ImageGalleryContext';

interface GeoLessonContentProps {
  htmlContent: string;
  chartDatasets?: Record<string, any[]>;
}

export default function GeoLessonContent({ htmlContent, chartDatasets }: GeoLessonContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const { setImages } = useImageGallery();

  useEffect(() => {
    if (!contentRef.current) return;

    const roots: ReturnType<typeof createRoot>[] = [];

    // 画像プレースホルダーをLessonImageコンポーネントとしてマウント
    const imagePlaceholders = contentRef.current.querySelectorAll('.lesson-image-placeholder');
    const imageDataList: Array<{ src: string; alt: string; caption: string }> = [];
    imagePlaceholders.forEach((placeholder, index) => {
      const src = placeholder.getAttribute('data-src') || '';
      const alt = placeholder.getAttribute('data-alt') || '';
      const className = placeholder.getAttribute('data-class') || '';
      const caption = placeholder.getAttribute('data-caption') || '';
      imageDataList.push({ src, alt, caption });
      const root = createRoot(placeholder);
      roots.push(root);
      root.render(
        <LessonImage src={src} alt={alt} className={className} caption={caption} imageIndex={index} />
      );
    });
    setImages(imageDataList);

    // チャートプレースホルダーをLessonChartコンポーネントとしてマウント
    const chartPlaceholders = contentRef.current.querySelectorAll('.lesson-chart-placeholder');
    chartPlaceholders.forEach((placeholder) => {
      const chartType = (placeholder.getAttribute('data-chart-type') || 'PieChart') as any;
      const dataset = placeholder.getAttribute('data-chart-dataset') || '';
      const filter = placeholder.getAttribute('data-chart-filter') || '';
      const fields = placeholder.getAttribute('data-chart-fields') || '';
      const title = placeholder.getAttribute('data-chart-title') || '';
      const rows = chartDatasets?.[dataset] || [];
      const root = createRoot(placeholder);
      roots.push(root);
      root.render(
        <LessonChart chartType={chartType} rows={rows} filter={filter} fields={fields} title={title} />
      );
    });

    return () => {
      roots.forEach((root) => root.unmount());
    };
  }, [htmlContent, setImages, chartDatasets]);

  return (
    <div
      ref={contentRef}
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
