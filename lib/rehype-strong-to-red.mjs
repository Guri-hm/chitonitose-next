/**
 * Rehype plugin to convert <strong> to <span class="red-text">
 * This handles cases where GFM table processing converts ** to <strong> before remarkRedText can process it
 */
import { visit } from 'unist-util-visit';

function rehypeStrongToRed() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'strong') {
        // Convert <strong> to <span class="red-text">
        node.tagName = 'span';
        node.properties = {
          ...node.properties,
          className: ['red-text']
        };
      }
    });
  };
}

export { rehypeStrongToRed };
