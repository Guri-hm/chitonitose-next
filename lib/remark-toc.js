const { visit } = require('unist-util-visit');

/**
 * Remark plugin to generate table of contents with sequential chapter numbering
 * H2 and H3 headings get sequential #chapter-N ids (N = 1, 2, 3, ...)
 */
function remarkToc() {
  return (tree, file) => {
    const toc = [];
    let chapterCount = 0;
    let currentH2 = null;

    visit(tree, 'heading', (node) => {
      if (node.depth === 2) {
        chapterCount++;
        const id = `chapter-${chapterCount}`;
        
        // Extract text from heading
        let text = '';
        visit(node, 'text', (textNode) => {
          text += textNode.value;
        });

        // Set id on the heading node
        const data = node.data || (node.data = {});
        data.hProperties = {
          ...(data.hProperties || {}),
          id: id,
        };

        currentH2 = {
          id: id,
          text: text,
          children: [],
        };
        toc.push(currentH2);
      } else if (node.depth === 3 && currentH2) {
        chapterCount++; // H3も連番でカウント
        const id = `chapter-${chapterCount}`;
        
        // Extract text from heading
        let text = '';
        visit(node, 'text', (textNode) => {
          text += textNode.value;
        });

        // Set id on the heading node
        const data = node.data || (node.data = {});
        data.hProperties = {
          ...(data.hProperties || {}),
          id: id,
        };

        currentH2.children.push({
          id: id,
          text: text,
        });
      }
    });

    // Store TOC data in file.data for use in components
    file.data.toc = toc;
  };
}

module.exports = { remarkToc };
