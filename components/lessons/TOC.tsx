'use client';

import { useEffect, useState } from 'react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export default function TOC() {
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);

  useEffect(() => {
    // ページ内のh2, h3を検索してTOCを生成
    const headers = document.querySelectorAll('.markdown-content h2, .markdown-content h3');
    const items: TOCItem[] = [];

    headers.forEach((header) => {
      if (header.id && header.textContent) {
        items.push({
          id: header.id,
          text: header.textContent,
          level: header.tagName === 'H2' ? 2 : 3,
        });
      }
    });

    setTocItems(items);
  }, []);

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <div id="toc" style={{ position: 'relative', marginTop: '20px' }}>
      <div className="title">目次</div>
      <ol className="toc-item">
        {tocItems.map((item, index) => {
          if (item.level === 2) {
            // h2の場合、次のh2までのh3を子要素として含める
            const children = tocItems.slice(index + 1).filter((child, childIndex, arr) => {
              const nextH2Index = arr.findIndex(h => h.level === 2);
              return child.level === 3 && (nextH2Index === -1 || childIndex < nextH2Index);
            });

            return (
              <li key={item.id}>
                <a href={`#${item.id}`}>{item.text}</a>
                {children.length > 0 && (
                  <ol>
                    {children.map((child) => (
                      <li key={child.id}>
                        <a href={`#${child.id}`}>{child.text}</a>
                      </li>
                    ))}
                  </ol>
                )}
              </li>
            );
          }
          // h3で、直前にh2がない場合のみ表示（それ以外は親のh2の中で表示済み）
          const prevItem = tocItems[index - 1];
          if (!prevItem || prevItem.level !== 2) {
            return (
              <li key={item.id}>
                <a href={`#${item.id}`}>{item.text}</a>
              </li>
            );
          }
          return null;
        })}
      </ol>
    </div>
  );
}
