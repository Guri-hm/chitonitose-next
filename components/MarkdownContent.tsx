'use client';

import { useEffect, useRef, useState, useMemo } from 'react';

interface MarkdownContentProps {
  htmlContent: string;
  showAnswerButtons?: boolean; // 廃止予定（互換性のため残す）
}

interface ImageData {
  src: string;
  alt: string;
  caption: string;
}

/**
 * カスタムMarkdownから変換されたHTMLをレンダリングするコンポーネント
 * - dangerouslySetInnerHTMLを使用してHTMLを挿入
 * - onClick="chg(this)"などのJavaScriptイベントは、useEffectで後付け
 * - Hydration警告を避けるため、onClick属性は削除してJSで処理
 * - .lesson-image-placeholderを実際の画像タグに変換
 */
export default function MarkdownContent({ htmlContent }: MarkdownContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<ImageData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [processedHtml, setProcessedHtml] = useState<string>('');

  // HTMLを前処理してプレースホルダーを実際の画像タグに変換 + 目次を生成
  useEffect(() => {
    // 1. 画像プレースホルダーを変換
    let html = htmlContent.replace(
      /<div class="gazo lesson-image-placeholder" data-src="([^"]*)" data-original="([^"]*)" data-alt="([^"]*)" data-class="([^"]*)" data-caption="([^"]*)"><\/div>/g,
      (match, webpSrc, originalSrc, alt, className, caption) => {
        // WebP画像を表示、クリック時に元画像を表示
        const captionHtml = caption ? `<br />${caption}` : '';
        return `<div class="gazo lesson-image-wrapper" data-src="${webpSrc}" data-original="${originalSrc}" data-alt="${alt}" data-caption="${caption}">
          <img src="${webpSrc}" alt="${caption || alt}" class="${className}" />${captionHtml}
        </div>`;
      }
    );

    // 2. 目次を生成してHTMLの先頭に挿入
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const headlines = tempDiv.querySelectorAll('h2, h3');
    
    if (headlines.length >= 3) {
      let toc = '<div id="toc" style="position: relative; margin-top: 20px;"><div class="title">目次</div><ol class="toc-item">';
      let hierarchy: number | undefined;
      let element = 0;
      let count = 0;

      headlines.forEach((elm) => {
        count++;
        elm.id = 'chapter-' + count;

        if (elm.nodeName === 'H2') {
          element = 0;
        } else {
          element = 1;
        }

        if (hierarchy === element) {
          toc += '</li>';
        } else if (hierarchy !== undefined && hierarchy < element) {
          toc += '<ol>';
          hierarchy = 1;
        } else if (hierarchy !== undefined && hierarchy > element) {
          toc += '</li></ol></li>';
          hierarchy = 0;
        } else if (count === 1) {
          hierarchy = 0;
        }

        toc += '<li><a href="#' + elm.id + '">' + elm.textContent + '</a>';
      });

      if (element === 0) {
        toc += '</li></ol>';
      } else if (element === 1) {
        toc += '</li></ol></li></ol>';
      }
      toc += '</div>';

      // 目次をHTMLの先頭に挿入
      html = toc + tempDiv.innerHTML;
    } else {
      html = tempDiv.innerHTML;
    }

    setProcessedHtml(html);
  }, [htmlContent]);

  useEffect(() => {
    if (!contentRef.current || !processedHtml) return;

    console.log('[MarkdownContent] イベントリスナー追加開始');

    // DOMの更新を待つ
    const timer = setTimeout(() => {
      if (!contentRef.current) return;

      // 1. 画像クリックイベント（イベントデリゲーション）
      const imageDataList: ImageData[] = [];
      const placeholders = contentRef.current.querySelectorAll('.lesson-image-wrapper');
      
      console.log(`[MarkdownContent] 画像プレースホルダー数: ${placeholders.length}`);
      
      placeholders.forEach((placeholder, index) => {
        const webpSrc = placeholder.getAttribute('data-src') || '';
        const originalSrc = placeholder.getAttribute('data-original') || webpSrc;
        const alt = placeholder.getAttribute('data-alt') || '';
        const caption = placeholder.getAttribute('data-caption') || '';
        
        // 画像データを収集（元画像を保存）
        imageDataList.push({ src: originalSrc, alt, caption });
      });
      
      setImages(imageDataList);
      console.log('[MarkdownContent] 画像データ一覧:', imageDataList);

      // 2. イベントデリゲーションでクリックイベントを追加
      const handleClick = (e: Event) => {
        const target = e.target as HTMLElement;
        
        // 画像クリック処理（親要素.lesson-image-wrapperをクリック）
        const imageWrapper = target.closest('.lesson-image-wrapper') as HTMLElement;
        if (imageWrapper) {
          const index = Array.from(placeholders).indexOf(imageWrapper);
          if (index !== -1) {
            console.log(`[MarkdownContent] 画像クリック: index=${index}`);
            setCurrentIndex(index);
            setIsFullscreen(true);
          }
          return;
        }
        
        // 赤字クリック処理（.all要素）
        const allElement = target.closest('.all') as HTMLElement;
        if (allElement) {
          console.log('[MarkdownContent] 赤字クリック:', allElement.textContent);
          if (allElement.style.color === 'red' || allElement.style.color === 'rgb(255, 0, 0)') {
            allElement.style.color = 'transparent';
          } else {
            allElement.style.color = 'red';
          }
        }
      };

      contentRef.current.addEventListener('click', handleClick);
      
      // カーソルスタイルを設定
      placeholders.forEach(placeholder => {
        (placeholder as HTMLElement).style.cursor = 'pointer';
      });
      
      const allElements = contentRef.current.querySelectorAll('.all');
      allElements.forEach(element => {
        (element as HTMLElement).style.cursor = 'pointer';
      });
      
      console.log(`[MarkdownContent] .all要素数: ${allElements.length}`);

      // クリーンアップ関数を返す
      return () => {
        if (contentRef.current) {
          contentRef.current.removeEventListener('click', handleClick);
        }
      };
    }, 100); // 100ms待機

    // クリーンアップ
    return () => {
      clearTimeout(timer);
    };
  }, [processedHtml]);

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

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

  const currentImage = images[currentIndex];

  return (
    <>
      <div
        ref={contentRef}
        className="markdown-content"
        dangerouslySetInnerHTML={{ __html: processedHtml }}
      />
      
      {/* フルスクリーンモーダル */}
      {isFullscreen && currentImage && (
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
              goToPrev();
            }}
            disabled={currentIndex === 0}
            aria-label="前の画像"
          >
            ‹
          </button>
          
          {/* 画像表示 */}
          <div 
            className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentImage.src}
              alt={currentImage.alt}
              className="max-w-full max-h-[85vh] object-contain"
            />
            {currentImage.caption && (
              <p 
                className="text-white mt-4 text-center max-w-2xl"
                dangerouslySetInnerHTML={{ __html: currentImage.caption }}
              />
            )}
            <div className="text-white mt-2 text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
          
          {/* 次へボタン */}
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-5xl hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
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
