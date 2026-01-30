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

  console.log('[MarkdownContent] イベントリスナー追加開始！！');

    const root = contentRef.current;
    let mounted = true;

    // タイマーでDOM安定を待って画像データを収集（setImagesのみ）
    const timer = setTimeout(() => {
      if (!root || !mounted) return;

      const placeholders = root.querySelectorAll('.lesson-image-wrapper');
      console.log(`[MarkdownContent] 画像プレースホルダー数: ${placeholders.length}`);

      const imageDataList: ImageData[] = Array.from(placeholders).map((placeholder) => {
        const webpSrc = (placeholder as HTMLElement).getAttribute('data-src') || '';
        const originalSrc = (placeholder as HTMLElement).getAttribute('data-original') || webpSrc;
        const alt = (placeholder as HTMLElement).getAttribute('data-alt') || '';
        const caption = (placeholder as HTMLElement).getAttribute('data-caption') || '';
        return { src: originalSrc, alt, caption };
      });

      setImages(imageDataList);
      console.log('[MarkdownContent] 画像データ一覧:', imageDataList);

      // カーソルスタイルを設定
      placeholders.forEach(p => (p as HTMLElement).style.cursor = 'pointer');

      const allElements = root.querySelectorAll('.all');
      allElements.forEach(el => (el as HTMLElement).style.cursor = 'pointer');
      console.log(`[MarkdownContent] .all要素数: ${allElements.length}`);
    }, 100); // 100ms待機

    // イベントデリゲーション用ハンドラ（親1つで画像・赤字を処理）
    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!root) return;

      // 画像クリック（.lesson-image-wrapper）
      const imageWrapper = target.closest('.lesson-image-wrapper') as HTMLElement | null;
      if (imageWrapper) {
        const placeholders = root.querySelectorAll('.lesson-image-wrapper');
        // クリック時に最新の画像リストを DOM から即時構築（クロージャの古い images に依存しない）
        const currentImageList: ImageData[] = Array.from(placeholders).map((placeholder) => {
          const webpSrc = (placeholder as HTMLElement).getAttribute('data-src') || '';
          const originalSrc = (placeholder as HTMLElement).getAttribute('data-original') || webpSrc;
          const alt = (placeholder as HTMLElement).getAttribute('data-alt') || '';
          const caption = (placeholder as HTMLElement).getAttribute('data-caption') || '';
          return { src: originalSrc, alt, caption };
        });
        const index = Array.from(placeholders).indexOf(imageWrapper);
        if (index !== -1) {
          console.log(`[MarkdownContent] 画像クリック: index=${index}, list length=${currentImageList.length}`);
          // images state を最新リストで更新してから index をセット
          setImages(currentImageList);
          setCurrentIndex(index);
          setIsFullscreen(true);
        }
        return;
      }

      // 赤字クリック（.all）
      const allElement = target.closest('.all') as HTMLElement | null;
      if (allElement) {
        console.log('[MarkdownContent] 赤字クリック:', allElement.textContent);
        const current = allElement.style.color;
        // 比較でrgb表記も扱う
        if (current === 'red' || current === 'rgb(255, 0, 0)') {
          allElement.style.color = 'transparent';
        } else {
          allElement.style.color = 'red';
        }
      }
    };

    // 登録（タイマー開始直後でも root が有効なら先に登録して良い）
    root.addEventListener('click', handleClick);

    // クリーンアップ
    return () => {
      mounted = false;
      clearTimeout(timer);
      if (root) root.removeEventListener('click', handleClick);
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

  // モーダル表示中はbodyのスクロールを無効化（ちらつき防止）
  useEffect(() => {
    if (isFullscreen) {
      // スクロールバーの幅を計測してpaddingで調整（ちらつき防止）
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isFullscreen]);

  // ESCキーでモーダルを閉じる
  useEffect(() => {
    if (!isFullscreen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeFullscreen();
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isFullscreen]);

  return (
    <>
      <div
        ref={contentRef}
        className="markdown-content"
        dangerouslySetInnerHTML={{ __html: processedHtml }}
      />
      
      {/* フルスクリーンモーダル（画面全体を覆うオーバーレイ） */}
      {isFullscreen && currentImage && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#F5F5F5',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}
          onClick={closeFullscreen}
        >
          {/* 閉じるボタン */}
          <button
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'none',
              border: 'none',
              color: '#121212',
              fontSize: '40px',
              cursor: 'pointer',
              zIndex: 10000,
              padding: '10px',
              lineHeight: '1'
            }}
            onClick={closeFullscreen}
            aria-label="閉じる"
          >
            ×
          </button>
          
          {/* 前へボタン */}
          {currentIndex > 0 && (
            <button
              style={{
                position: 'absolute',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#121212',
                border: 'none',
                color: '#F5F5F5',
                fontSize: '48px',
                cursor: 'pointer',
                zIndex: 10000,
                padding: '20px 15px',
                borderRadius: '8px',
                lineHeight: '1'
              }}
              onClick={(e) => {
                e.stopPropagation();
                goToPrev();
              }}
              aria-label="前の画像"
            >
              ‹
            </button>
          )}
          
          {/* 画像とキャプション */}
          <div 
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: '90vw',
              maxHeight: '90vh',
              gap: '16px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentImage.src}
              alt={currentImage.alt}
              style={{
                maxWidth: '90vw',
                maxHeight: '80vh',
                objectFit: 'contain',
                display: 'block'
              }}
            />
            {currentImage.caption && (
              <p 
                style={{
                  color: '#121212',
                  textAlign: 'center',
                  maxWidth: '800px',
                  margin: '0',
                  padding: '0 20px',
                  fontSize: '14px'
                }}
                dangerouslySetInnerHTML={{ __html: currentImage.caption }}
              />
            )}
            <div style={{ color: '#121212', fontSize: '14px', opacity: 0.8 }}>
              {currentIndex + 1} / {images.length}
            </div>
          </div>
          
          {/* 次へボタン */}
          {currentIndex < images.length - 1 && (
            <button
              style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#121212',
                border: 'none',
                color: '#F5F5F5',
                fontSize: '48px',
                cursor: 'pointer',
                zIndex: 10000,
                padding: '20px 15px',
                borderRadius: '8px',
                lineHeight: '1'
              }}
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              aria-label="次の画像"
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  );
}
