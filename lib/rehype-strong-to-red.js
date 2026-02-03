/**
 * Rehype plugin to convert <strong> to <font color="#FF0000">
 * This handles cases where GFM table processing converts ** to <strong> before remarkRedText can process it
 */
const { visit } = require('unist-util-visit');

function rehypeStrongToRed() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'strong') {
        // Convert <strong> to <font color="#FF0000">
        node.tagName = 'font';
        node.properties = {
          ...node.properties,
          color: '#FF0000'
        };
      }
    });
  };
}

module.exports = { rehypeStrongToRed };
