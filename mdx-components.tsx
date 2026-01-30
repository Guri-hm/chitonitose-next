import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // カスタムコンポーネントのマッピング
    img: (props) => {
      const { src, alt, className } = props;
      
      // 画像をラップするdivを返す
      return (
        <div className={`gazo lesson-image-wrapper`} 
             data-src={src} 
             data-original={src}
             data-alt={alt || ''}
             data-caption={alt || ''}>
          <img 
            src={src as string} 
            alt={alt as string} 
            className={className as string || 'lazyload popup-img'}
          />
          {alt && <><br />{alt}</>}
        </div>
      );
    },
    ...components,
  };
}
