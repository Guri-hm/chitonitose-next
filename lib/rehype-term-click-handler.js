/**
 * Rehype plugin to add onclick="chg(this)" to <span class="all">
 */
const { visit } = require('unist-util-visit');

function rehypeTermClickHandler() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (
        node.tagName === 'span' && 
        node.properties && 
        node.properties.className &&
        node.properties.className.includes('all')
      ) {
        // Add onclick attribute
        node.properties.onclick = 'chg(this)';
      }
    });
  };
}

module.exports = { rehypeTermClickHandler };
