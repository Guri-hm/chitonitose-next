const { visit } = require('unist-util-visit');

/**
 * Remark plugin to convert custom directives like :::lead, ::top, etc.
 * to HTML divs with appropriate classes
 */
function remarkCustomDirectives() {
  return (tree) => {
    visit(tree, (node) => {
      // Handle container directives (:::)
      if (node.type === 'containerDirective') {
        const data = node.data || (node.data = {});
        const tagName = 'div';
        
        data.hName = tagName;
        data.hProperties = {
          className: node.name, // lead, top, middle, last, etc.
        };
        
        // Unwrap paragraphs - extract children from paragraph nodes
        if (node.children && node.children.length > 0) {
          const newChildren = [];
          for (const child of node.children) {
            if (child.type === 'paragraph') {
              // Extract paragraph's children instead of keeping the paragraph
              newChildren.push(...child.children);
            } else {
              newChildren.push(child);
            }
          }
          node.children = newChildren;
        }
      }
      
      // Handle leaf directives (::)
      if (node.type === 'leafDirective') {
        const data = node.data || (node.data = {});
        const tagName = 'div';
        
        data.hName = tagName;
        data.hProperties = {
          className: node.name, // sup, gazo, etc.
        };
      }
    });
  };
}

/**
 * Remark plugin to convert [[term]] to clickable spans
 */
function remarkTerms() {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      if (!parent || index === null) return;
      
      const text = node.value;
      const regex = /\[\[([^\]]+)\]\]/g;
      
      if (!regex.test(text)) return;
      
      const newNodes = [];
      let lastIndex = 0;
      const matches = Array.from(text.matchAll(/\[\[([^\]]+)\]\]/g));
      
      for (const match of matches) {
        const beforeText = text.slice(lastIndex, match.index);
        if (beforeText) {
          newNodes.push({
            type: 'text',
            value: beforeText,
          });
        }
        
        newNodes.push({
          type: 'html',
          value: `<span class="all">${match[1]}</span>`,
        });
        
        lastIndex = match.index + match[0].length;
      }
      
      const afterText = text.slice(lastIndex);
      if (afterText) {
        newNodes.push({
          type: 'text',
          value: afterText,
        });
      }
      
      if (newNodes.length > 0) {
        parent.children.splice(index, 1, ...newNodes);
      }
    });
  };
}

/**
 * Remark plugin to convert ==marked text== to spans with marker class
 */
function remarkMarkers() {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      if (!parent || index === null) return;
      
      const text = node.value;
      const regex = /==([^=]+)==/g;
      
      if (!regex.test(text)) return;
      
      const newNodes = [];
      let lastIndex = 0;
      const matches = Array.from(text.matchAll(/==([^=]+)==/g));
      
      for (const match of matches) {
        const beforeText = text.slice(lastIndex, match.index);
        if (beforeText) {
          newNodes.push({
            type: 'text',
            value: beforeText,
          });
        }
        
        newNodes.push({
          type: 'html',
          value: `<span class="marker">${match[1]}</span>`,
        });
        
        lastIndex = match.index + match[0].length;
      }
      
      const afterText = text.slice(lastIndex);
      if (afterText) {
        newNodes.push({
          type: 'text',
          value: afterText,
        });
      }
      
      if (newNodes.length > 0) {
        parent.children.splice(index, 1, ...newNodes);
      }
    });
  };
}

/**
 * Remark plugin to convert **red text** to red font
 */
function remarkRedText() {
  return (tree) => {
    visit(tree, 'strong', (node, index, parent) => {
      if (!parent || index === null) return;
      
      // Get the text content
      const textNode = node.children[0];
      if (!textNode || textNode.type !== 'text') return;
      
      // Convert to red text HTML
      const newNode = {
        type: 'html',
        value: `<font color="#FF0000">${textNode.value}</font>`,
      };
      
      parent.children[index] = newNode;
    });
  };
}

/**
 * Remark plugin to handle custom image syntax with classes
 * ![](img/2/1.svg){.twice}
 */
function remarkCustomImages() {
  return (tree) => {
    visit(tree, 'image', (node, index, parent) => {
      if (!parent || index === null) return;
      
      // Check if there's a class specification after the image
      const nextNode = parent.children[index + 1];
      if (nextNode && nextNode.type === 'text' && nextNode.value.startsWith('{.')) {
        const classMatch = nextNode.value.match(/^\{\.([^}]+)\}/);
        if (classMatch) {
          const className = classMatch[1];
          const data = node.data || (node.data = {});
          data.hProperties = {
            ...(data.hProperties || {}),
            className: `lazyload popup-img ${className}`,
          };
          
          // Remove the class specification from the text node
          nextNode.value = nextNode.value.replace(/^\{\.([^}]+)\}/, '').trim();
          if (!nextNode.value) {
            parent.children.splice(index + 1, 1);
          }
        }
      } else {
        // Default classes
        const data = node.data || (node.data = {});
        data.hProperties = {
          ...(data.hProperties || {}),
          className: 'lazyload popup-img',
        };
      }
    });
  };
}

/**
 * Remark plugin to handle ---arrow--- dividers
 */
function remarkArrows() {
  return (tree) => {
    visit(tree, 'paragraph', (node, index, parent) => {
      if (!parent || index === null) return;
      
      // Check if paragraph contains only "---arrow---"
      if (node.children.length === 1 && 
          node.children[0].type === 'text' && 
          node.children[0].value.trim() === '---arrow---') {
        const newNode = {
          type: 'html',
          value: '<div class="arrow"></div>',
        };
        
        parent.children[index] = newNode;
      }
    });
  };
}

module.exports = {
  remarkCustomDirectives,
  remarkTerms,
  remarkMarkers,
  remarkRedText,
  remarkCustomImages,
  remarkArrows,
};
