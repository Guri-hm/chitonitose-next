'use client';

import { useEffect, useRef } from 'react';

interface MarkdownContentProps {
  htmlContent: string;
}

/**
 * カスタムMarkdownから変換されたHTMLをレンダリングするコンポーネント
 * - dangerouslySetInnerHTMLを使用してHTMLを挿入
 * - onClick="chg(this)"などのJavaScriptイベントは、useEffectで後付け
 * - Hydration警告を避けるため、onClick属性は削除してJSで処理
 */
export default function MarkdownContent({ htmlContent }: MarkdownContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    // onClick="chg(this)" の機能を実装
    // 赤字用語のクリックで表示/非表示を切り替え
    const handleClick = (element: HTMLElement) => {
      if (element.style.color === 'red' || element.style.color === 'rgb(255, 0, 0)' || element.style.color === '#FF0000') {
        element.style.color = '';
      } else {
        element.style.color = 'red';
      }
    };

    // すべての .all クラス要素にクリックイベントを追加
    const allElements = contentRef.current.querySelectorAll('.all');
    const listeners = new Map<Element, () => void>();

    allElements.forEach(element => {
      const htmlElement = element as HTMLElement;
      htmlElement.style.cursor = 'pointer';
      
      const listener = () => handleClick(htmlElement);
      listeners.set(element, listener);
      htmlElement.addEventListener('click', listener);
    });

    // クリーンアップ
    return () => {
      listeners.forEach((listener, element) => {
        element.removeEventListener('click', listener);
      });
    };
  }, [htmlContent]);

  // onclick属性を削除したHTMLを生成（Hydration警告を避けるため）
  const sanitizedHtml = htmlContent.replace(/\s+onclick="[^"]*"/gi, '');

  return (
    <div
      ref={contentRef}
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
