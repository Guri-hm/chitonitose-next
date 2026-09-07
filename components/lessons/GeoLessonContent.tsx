'use client';

import { useEffect, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import LessonImage from '@/components/LessonImage';
import LessonChart from '@/components/charts/LessonChart';
import { useImageGallery } from '@/contexts/ImageGalleryContext';

interface GeoLessonContentProps {
  htmlContent: string;
  chartDatasets?: Record<string, any[]>;
}

// data-chart-*属性の並び順に依存しないよう、開始タグ全体を取得してから個別に属性を読む
const CHART_PLACEHOLDER_RE = /<div class="lesson-chart-placeholder"([^>]*)><\/div>/g;

function parseChartAttrs(attrsStr: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const re = /data-chart-([\w-]+)="([^"]*)"/g;
  let m;
  while ((m = re.exec(attrsStr)) !== null) {
    attrs[m[1]] = m[2].replace(/&quot;/g, '"');
  }
  return attrs;
}

type Segment =
  | { type: 'html'; html: string }
  | { type: 'chart'; chartType: string; dataset: string; params: string; title: string };

/**
 * htmlContent中の`.lesson-chart-placeholder`を実際のReactの子要素の境界として切り出す。
 * dangerouslySetInnerHTMLで描画したDOMの子孫ノードをcreateRoot/createPortalのコンテナに
 * 使うのはReact 19で未定義動作と明記されている（facebook/react#32774）ため、チャート部分は
 * 最初からdangerouslySetInnerHTMLの外側の、本来のReact子要素としてレンダリングする。
 */
function splitIntoSegments(htmlContent: string): Segment[] {
  const segments: Segment[] = [];
  let lastIndex = 0;
  const re = new RegExp(CHART_PLACEHOLDER_RE.source, 'g');
  let m: RegExpExecArray | null;
  while ((m = re.exec(htmlContent)) !== null) {
    if (m.index > lastIndex) {
      segments.push({ type: 'html', html: htmlContent.slice(lastIndex, m.index) });
    }
    const attrs = parseChartAttrs(m[1]);
    segments.push({
      type: 'chart',
      chartType: attrs.type || 'PieChart',
      dataset: attrs.dataset || '',
      params: attrs.params || '{}',
      title: attrs.title || '',
    });
    lastIndex = re.lastIndex;
  }
  if (lastIndex < htmlContent.length) {
    segments.push({ type: 'html', html: htmlContent.slice(lastIndex) });
  }
  return segments;
}

export default function GeoLessonContent({ htmlContent, chartDatasets }: GeoLessonContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const { setImages } = useImageGallery();
  const segments = useMemo(() => splitIntoSegments(htmlContent), [htmlContent]);

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

    return () => {
      roots.forEach((root) => root.unmount());
    };
  }, [htmlContent, setImages]);

  return (
    <div ref={contentRef} className="markdown-content">
      {segments.map((segment, index) =>
        segment.type === 'chart' ? (
          <LessonChart
            key={index}
            chartType={segment.chartType}
            dataset={segment.dataset}
            params={segment.params}
            datasets={chartDatasets || {}}
            title={segment.title}
          />
        ) : (
          // display:contentsでラッパー自体はレイアウトに影響を与えず、中身のブロック要素のみを配置する
          <div key={index} style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: segment.html }} />
        )
      )}
    </div>
  );
}

