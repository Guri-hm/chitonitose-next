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

const DIRECTIVE_CLASSES = new Set(['top', 'middle', 'last', 'sup', 'lead', 'equal']);

/**
 * div.top の children を走査し、
 * ネストした directive 子ノード（middle/last/lead/equal）を
 * div.top の直接の children としてフラット展開する。
 *
 * また ul > li > p > div.last のような p でラップされた
 * directive を li の直接の子に引き上げる。
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
      result.push({ ...child, children: own });
      result.push(...flattenChildren(nested));

    } else if (child.type === 'element' && child.tagName === 'ul') {
      // ul > li の中で p にラップされた directive を li 直下に引き上げる
      const newLiList = (child.children || []).map(li => {
        if (li.type !== 'element' || li.tagName !== 'li') return li;
        const newLiChildren = [];
        for (const liChild of li.children || []) {
          // p タグの中に directive があれば p を解体して directive を直接 li の子にする
          if (liChild.type === 'element' && liChild.tagName === 'p') {
            const pDirectives = (liChild.children || []).filter(
              c => c.type === 'element' && DIRECTIVE_CLASSES.has(getClass(c))
            );
            if (pDirectives.length > 0) {
              // p の中の非directive部分は p として残す
              const pNonDirectives = (liChild.children || []).filter(
                c => !(c.type === 'element' && DIRECTIVE_CLASSES.has(getClass(c)))
              );
              if (pNonDirectives.length > 0) {
                newLiChildren.push({ ...liChild, children: pNonDirectives });
              }
              newLiChildren.push(...pDirectives);
            } else {
              newLiChildren.push(liChild);
            }
          } else {
            newLiChildren.push(liChild);
          }
        }
        return { ...li, children: newLiChildren };
      });
      result.push({ ...child, children: newLiList });

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
        // 直接の子、またはul>li>p の中にdirectiveがあればフラット化
        const hasNestedDirective = (node.children || []).some(child => {
          if (child.type === 'element' && DIRECTIVE_CLASSES.has(getClass(child))) return true;
          // ul > li > p の中を確認
          if (child.type === 'element' && child.tagName === 'ul') {
            return (child.children || []).some(li =>
              li.type === 'element' && li.tagName === 'li' &&
              (li.children || []).some(liChild =>
                liChild.type === 'element' && liChild.tagName === 'p' &&
                (liChild.children || []).some(pChild =>
                  pChild.type === 'element' && DIRECTIVE_CLASSES.has(getClass(pChild))
                )
              )
            );
          }
          return false;
        });
        if (!hasNestedDirective) return;

        // div.top の children をフラット展開（div.top 自体はそのまま）
        node.children = flattenChildren(node.children);
      }
    });
  };
}
