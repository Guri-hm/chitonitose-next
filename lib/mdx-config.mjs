/**
 * MDX コンパイル用の共通プラグイン設定
 * test-mdx-compilation.mjs と mdxLoader.ts の両方で使用
 */

import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import remarkFrontmatter from 'remark-frontmatter';
import rehypeSlug from 'rehype-slug';
import {
  remarkCustomDirectives,
  remarkTerms,
  remarkMarkers,
  remarkListClasses,
  remarkRuby,
  remarkArrows,
  remarkCustomImages,
  remarkRedText,
} from './remark-custom-directives.mjs';
import { remarkToc } from './remark-toc.mjs';
import { rehypeStrongToRed } from './rehype-strong-to-red.mjs';
import { rehypeTableAlign } from './rehype-table-align.mjs';
import { rehypeGazoImages } from './rehype-gazo-images.mjs';
import { rehypeFlattenDirectives } from './rehype-flatten-directives.mjs';

/**
 * 共通の remark プラグイン設定
 */
export const remarkPlugins = [
  remarkGfm,
  remarkFrontmatter,
  remarkDirective,
  remarkRuby,
  remarkCustomDirectives,
  remarkTerms,
  remarkMarkers,
  remarkRedText,  // **text** を <span class="red-text"> に変換
  remarkArrows,
  remarkCustomImages,
  remarkListClasses,
  remarkToc,
];

/**
 * 共通の rehype プラグイン設定
 */
export const rehypePlugins = [
  rehypeSlug,
  rehypeStrongToRed,
  rehypeFlattenDirectives,  // div.top > div.middle のネストをフラット化
  rehypeGazoImages,  // Add size classes to images in gazo directives
  rehypeTableAlign,
];
