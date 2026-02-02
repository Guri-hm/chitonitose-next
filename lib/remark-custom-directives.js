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
          className: node.name, // lead, top, middle, last, gazo, etc.
        };
        
        // Special handling for :::gazo - add classes to images inside
        if (node.name === 'gazo' && node.children) {
          visit(node, 'image', (imageNode) => {
            const imageData = imageNode.data || (imageNode.data = {});
            imageData.hProperties = {
              ...(imageData.hProperties || {}),
              className: 'lazyload popup-img',
              style: 'cursor: pointer;',
            };
          });
        }
        
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
          className: node.name, // sup, arrow, etc.
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
    // Process all text nodes, including those at the start of directives
    visit(tree, (node) => {
      // Handle both direct text nodes and text within various containers
      if (node.type === 'text') {
        return; // Will be handled by parent visitor
      }
      
      // Process children of container nodes
      if (node.children && Array.isArray(node.children)) {
        for (let i = 0; i < node.children.length; i++) {
          const child = node.children[i];
          
          if (child.type === 'text') {
            const text = child.value;
            const regex = /\[\[([^\]]+)\]\]/g;
            
            if (!regex.test(text)) continue;
            
            const newNodes = [];
            let lastIndex = 0;
            
            // Reset regex for replace
            text.replace(regex, (match, term, offset) => {
              const beforeText = text.slice(lastIndex, offset);
              if (beforeText) {
                newNodes.push({
                  type: 'text',
                  value: beforeText,
                });
              }
              
              // Create a span using hast (HTML AST)
              newNodes.push({
                type: 'emphasis',
                data: {
                  hName: 'span',
                  hProperties: {
                    className: 'all',
                  },
                },
                children: [{
                  type: 'text',
                  value: term,
                }],
              });
              
              lastIndex = offset + match.length;
              return match;
            });
            
            const afterText = text.slice(lastIndex);
            if (afterText) {
              newNodes.push({
                type: 'text',
                value: afterText,
              });
            }
            
            if (newNodes.length > 1) {
              node.children.splice(i, 1, ...newNodes);
              i += newNodes.length - 1; // Adjust index for added nodes
            }
          }
        }
      }
    });
  };
}

/**
 * Remark plugin to convert ==marked text== to spans with marker class
 */
function remarkMarkers() {
  return (tree) => {
    // Process all nodes with children
    visit(tree, (node) => {
      if (node.children && Array.isArray(node.children)) {
        for (let i = 0; i < node.children.length; i++) {
          const child = node.children[i];
          
          if (child.type === 'text') {
            const text = child.value;
            const regex = /==([^=]+)==/g;
            
            if (!regex.test(text)) continue;
            
            const newNodes = [];
            let lastIndex = 0;
            
            // Reset regex for replace
            text.replace(regex, (match, markedText, offset) => {
              const beforeText = text.slice(lastIndex, offset);
              if (beforeText) {
                newNodes.push({
                  type: 'text',
                  value: beforeText,
                });
              }
              
              // Create a span using hast (HTML AST)
              newNodes.push({
                type: 'emphasis',
                data: {
                  hName: 'span',
                  hProperties: {
                    className: 'marker',
                  },
                },
                children: [{
                  type: 'text',
                  value: markedText,
                }],
              });
              
              lastIndex = offset + match.length;
              return match;
            });
            
            const afterText = text.slice(lastIndex);
            if (afterText) {
              newNodes.push({
                type: 'text',
                value: afterText,
              });
            }
            
            if (newNodes.length > 1) {
              node.children.splice(i, 1, ...newNodes);
              i += newNodes.length - 1; // Adjust index for added nodes
            }
          }
        }
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
      
      // Convert to red text using hast data
      const newNode = {
        type: 'emphasis',
        data: {
          hName: 'font',
          hProperties: {
            color: '#FF0000',
          },
        },
        children: [{
          type: 'text',
          value: textNode.value,
        }],
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

/**
 * Remark plugin to add class="en" to unordered lists containing :::lead directives
 */
function remarkListClasses() {
  return (tree) => {
    visit(tree, 'list', (node) => {
      // Check if list contains any :::lead directives
      let hasLeadDirective = false;
      visit(node, 'containerDirective', (childNode) => {
        if (childNode.name === 'lead') {
          hasLeadDirective = true;
        }
      });
      
      if (hasLeadDirective && node.ordered === false) {
        const data = node.data || (node.data = {});
        data.hProperties = {
          ...(data.hProperties || {}),
          className: 'en',
        };
        
        // Unwrap paragraphs in list items
        visit(node, 'listItem', (listItem) => {
          if (listItem.children && listItem.children.length > 0) {
            const newChildren = [];
            for (const child of listItem.children) {
              if (child.type === 'paragraph') {
                // Extract paragraph's children
                newChildren.push(...child.children);
              } else {
                newChildren.push(child);
              }
            }
            listItem.children = newChildren;
          }
        });
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
  remarkListClasses,
};
