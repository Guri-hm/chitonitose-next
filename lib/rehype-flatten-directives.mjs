import { visit, SKIP } from 'unist-util-visit';

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
 * div.middle / div.last / div.lead のネストを再帰的に解体し、
 * フラットな子ノードのリストを返す。
 *
 * @param {object} node - hast element ノード
 * @returns {object[]} フラット化した子ノード配列
 */
function flattenNode(node) {
  const cls = getClass(node);
  if (!DIRECTIVE_CLASSES.has(cls)) {
    // 対象外のノードはそのまま返す
    return [node];
  }

  const result = [];
  const ownChildren = []; // このノード自身に残す子

  for (const child of node.children || []) {
    const childCls = getClass(child);
    if (child.type === 'element' && DIRECTIVE_CLASSES.has(childCls)) {
      // ネストしたディレクティブ → 再帰的にフラット化して兄弟に昇格
      result.push(...flattenNode(child));
    } else {
      ownChildren.push(child);
    }
  }

  // このノード自身（子はネスト前のテキストのみ）
  const selfNode = { ...node, children: ownChildren };
  return [selfNode, ...result];
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
    visit(tree, 'element', (node, index, parent) => {
      const cls = getClass(node);
      // top / sup を起点として処理
      if ((cls === 'top' || cls === 'sup') && parent && index != null) {
        const hasNestedDirective = (node.children || []).some(
          child => child.type === 'element' && DIRECTIVE_CLASSES.has(getClass(child))
        );
        if (!hasNestedDirective) return;

        // フラット化した [top本体, middle, middle, last, ...] を取得
        const flattened = flattenNode(node);

        // 親の children 内で元のノードをフラット化した複数ノードに置き換え
        parent.children.splice(index, 1, ...flattened);

        // splice で要素数が増えたので visit に SKIP + 再訪させない
        return [SKIP, index + flattened.length];
      }
    });
  };
}
