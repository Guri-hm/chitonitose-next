import React from 'react';

interface TocItem {
  id: string;
  text: string;
  children?: TocItem[];
}

interface TableOfContentsProps {
  toc: TocItem[];
}

export default function TableOfContents({ toc }: TableOfContentsProps) {
  if (!toc || toc.length === 0) {
    return null;
  }

  return (
    <div id="toc">
      <div className="title">目次</div>
      <ol className="toc-item">
        {toc.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`}>{item.text}</a>
            {item.children && item.children.length > 0 && (
              <ol>
                {item.children.map((child) => (
                  <li key={child.id}>
                    <a href={`#${child.id}`}>{child.text}</a>
                  </li>
                ))}
              </ol>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
