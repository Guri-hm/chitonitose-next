/**
 * Rehype plugin to convert inline table styles to align attributes
 */
const { visit } = require('unist-util-visit');

function rehypeTableAlign() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if ((node.tagName === 'th' || node.tagName === 'td') && node.properties) {
        // Convert style="text-align:center" to align="center"
        if (node.properties.style) {
          const style = node.properties.style;
          if (typeof style === 'string' && style.includes('text-align:center')) {
            node.properties.align = 'center';
            delete node.properties.style;
          } else if (typeof style === 'string' && style.includes('text-align:left')) {
            node.properties.align = 'left';
            delete node.properties.style;
          }
        }
      }
      
      // Add width and border to table
      if (node.tagName === 'table' && node.properties) {
        node.properties.width = '100%';
        node.properties.border = '1';
      }
    });
  };
}

module.exports = { rehypeTableAlign };
