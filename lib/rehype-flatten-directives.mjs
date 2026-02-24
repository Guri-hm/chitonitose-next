import { visit } from 'unist-util-visit';

/**
 * Rehype plugin to flatten nested directives.
 *
 * :::top
 * 田植え
 * :::middle
 * 収穫
 * :::last
 * 炊く
 * :::
 *
 * は hast 上では div.top > div.middle > div.last と深くネストするが、
 * これを div.top の直下に div.middle, div.last を並べるフラット構造に変換する。
 *
 * 入力 (ネスト):
 *   <div class="top">
 *     田植え
 *     <div class="middle">
 *       収穫
 *       <div class="last">炊く</div>
 *     </div>
 *   </div>
 *
 * 出力 (フラット):
 *   <div class="top">
 *     田植え
 *     <div class="middle">収穫</div>
 *     <div class="last">炊く</div>
 *   </div>
 */

const DIRECTIVE_CLASSES = new Set(['top', 'middle', 'last', 'sup', 'lead']);

/**
 * div.top の children を走査し、
 * ネストした directive 子ノード（middle/last/lead）を
 * div.top の直接の children としてフラット展開する。
 *
 * 入力:  div.top > [text, div.middle > [text2, div.last > [text3]]]
 * 出力:  div.top > [text, div.middle > [text2], div.last > [text3]]
 *
 * @param {object[]} children - div.top の children 配列
 * @returns {object[]} フラット化した children 配列
 */
function flattenChildren(children) {
  const result = [];
  for (const child of children || []) {
    const childCls = getClass(child);
    if (child.type === 'element' && DIRECTIVE_CLASSES.has(childCls)) {
      // このノード自身は残す。ただし、その中にさらにネストがあれば再帰
      const grandchildren = child.children || [];
      const nested = [];
      const own = [];
      for (const gc of grandchildren) {
        if (gc.type === 'element' && DIRECTIVE_CLASSES.has(getClass(gc))) {
          nested.push(gc);
        } else {
          own.push(gc);
        }
      }
      // このノードの children からネストを除去
      result.push({ ...child, children: own });
      // ネストしていたノードを兄弟として追加（再帰）
      result.push(...flattenChildren(nested));
    } else {
      result.push(child);
    }
  }
  return result;
}

function getClass(node) {
  if (node?.type !== 'element') return null;
  const cls = node.properties?.className;
  if (Array.isArray(cls)) return cls[0] ?? null;
  if (typeof cls === 'string') return cls.split(' ')[0];
  return null;
}

export function rehypeFlattenDirectives() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      const cls = getClass(node);
      // top / sup を起点として処理
      if (cls === 'top' || cls === 'sup') {
        // 直接の子に middle/last/lead などのディレクティブがあればフラット化
        const hasNestedDirective = (node.children || []).some(
          child => child.type === 'element' && DIRECTIVE_CLASSES.has(getClass(child))
        );
        if (!hasNestedDirective) return;

        // div.top の children をフラット展開（div.top 自体はそのまま）
        node.children = flattenChildren(node.children);
      }
    });
  };
}
