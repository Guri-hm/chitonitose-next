'use client';

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import OptimizedImage from '@/components/ui/OptimizedImage';

interface MDXContentProps {
  source: MDXRemoteSerializeResult;
}

// MDXで使用可能なカスタムコンポーネント
const components = {
  img: (props: any) => {
    // lazyload と popup-img クラスがある画像は最適化コンポーネントを使用
    if (props.className?.includes('popup-img')) {
      return (
        <OptimizedImage
          src={props.src}
          alt={props.alt || ''}
          className={props.className}
        />
      );
    }
    // 通常の画像
    return <img {...props} loading="lazy" />;
  },
  
  // その他のカスタムコンポーネントをここに追加可能
};

/**
 * MDXコンテンツをレンダリングするコンポーネント
 */
export default function MDXContent({ source }: MDXContentProps) {
  return (
    <div className="mdx-content">
      <MDXRemote {...source} components={components} />
    </div>
  );
}
