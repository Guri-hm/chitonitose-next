'use client';

import { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number; // 0 for h2, 1 for h3
}

/**
 * 目次(Table of Contents)コンポーネント
 * 元HTMLのmakeLinkToHeadline()関数を再実装
 */
export default function TableOfContents() {
  const [tocHtml, setTocHtml] = useState<string>('');
  const [shouldShow, setShouldShow] = useState<boolean>(false);

  useEffect(() => {
    // #toc-range内のh2, h3要素を取得
    const headlines = document.querySelectorAll('#toc-range h2, #toc-range h3');
    
    if (headlines.length < 3) {
      setShouldShow(false);
      return;
    }

    let toc = '<ol class="toc-item">';
    let hierarchy: number | undefined;
    let element = 0;
    let count = 0;

    headlines.forEach((elm) => {
      count++;
      // h2・h3タグにIDの属性値を指定
      elm.id = 'chapter-' + count;

      // 現在のループで扱う要素を判断
      if (elm.nodeName === 'H2') {
        element = 0;
      } else {
        element = 1;
      }

      // 現在の状態を判断する条件分岐
      if (hierarchy === element) {
        // h2またはh3がそれぞれ連続する場合
        toc += '</li>';
      } else if (hierarchy !== undefined && hierarchy < element) {
        // h2の次がh3となる場合
        toc += '<ol>';
        hierarchy = 1;
      } else if (hierarchy !== undefined && hierarchy > element) {
        // h3の次がh2となる場合
        toc += '</li></ol></li>';
        hierarchy = 0;
      } else if (count === 1) {
        // 最初の項目の場合
        hierarchy = 0;
      }

      // 目次の項目を作成
      toc += '<li><a href="#' + elm.id + '">' + elm.textContent + '</a>';
    });

    // 目次の最後の項目をどの要素から作成したかにより、タグの閉じ方を変更
    if (element === 0) {
      toc += '</li></ol>';
    } else if (element === 1) {
      toc += '</li></ol></li></ol>';
    }

    setTocHtml(toc);
    setShouldShow(true);
  }, []);

  if (!shouldShow) {
    return null;
  }

  return (
    <div id="toc" style={{ position: 'relative', marginTop: '20px' }}>
      <div className="title">目次</div>
      <div dangerouslySetInnerHTML={{ __html: tocHtml }} />
    </div>
  );
}
