const { visit } = require('unist-util-visit');

// Ruby tag placeholder storage
const rubyPlaceholders = new Map();
let rubyCounter = 0;

/**
 * Remark plugin to temporarily replace <ruby> tags with placeholders
 * This allows other text-based plugins (markers, terms) to work correctly
 */
function remarkRubyEncode() {
  return (tree) => {
    visit(tree, 'html', (node) => {
      const html = node.value;
      // Match <ruby>...</ruby> tags
      const rubyRegex = /<ruby>([^<]+)<rt>([^<]+)<\/rt><\/ruby>/g;
      
      if (rubyRegex.test(html)) {
        let newValue = html;
        newValue = newValue.replace(rubyRegex, (match, base, reading) => {
          const id = `__RUBY_${rubyCounter++}__`;
          rubyPlaceholders.set(id, match);
          return id;
        });
        node.value = newValue;
      }
    });
    
    // Also encode ruby in text nodes
    visit(tree, 'text', (node) => {
      const text = node.value;
      const rubyRegex = /<ruby>([^<]+)<rt>([^<]+)<\/rt><\/ruby>/g;
      
      if (rubyRegex.test(text)) {
        let newValue = text;
        newValue = newValue.replace(rubyRegex, (match, base, reading) => {
          const id = `__RUBY_${rubyCounter++}__`;
          rubyPlaceholders.set(id, match);
          return id;
        });
        node.value = newValue;
      }
    });
  };
}

/**
 * Remark plugin to restore <ruby> placeholders back to HTML tags
 * This should run after all text processing plugins
 */
function remarkRubyDecode() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type === 'text' && node.value) {
        const placeholderRegex = /__RUBY_\d+__/g;
        if (placeholderRegex.test(node.value)) {
          let newValue = node.value;
          for (const [id, rubyTag] of rubyPlaceholders) {
            newValue = newValue.replace(id, rubyTag);
          }
          node.value = newValue;
        }
      }
      
      if (node.type === 'html' && node.value) {
        const placeholderRegex = /__RUBY_\d+__/g;
        if (placeholderRegex.test(node.value)) {
          let newValue = node.value;
          for (const [id, rubyTag] of rubyPlaceholders) {
            newValue = newValue.replace(id, rubyTag);
          }
          node.value = newValue;
        }
      }
    });
    
    // Clear placeholders for next file
    rubyPlaceholders.clear();
    rubyCounter = 0;
  };
}

/**
 * Remark plugin to convert custom directives like :::lead, ::top, etc.
 * to HTML divs with appropriate classes
 */
function remarkCustomDirectives() {
  return (tree, file) => {
    visit(tree, (node) => {
      // Handle container directives (:::)
      if (node.type === 'containerDirective') {
        try {
          const data = node.data || (node.data = {});
          const tagName = 'div';
          
          console.log(`[remarkCustomDirectives] Processing :::${node.name} at line ${node.position?.start.line}`);
          
          data.hName = tagName;
          data.hProperties = {
            className: node.name, // lead, top, middle, last, gazo, etc.
          };
          
        // Special handling for :::gazo - add classes to images inside
        if (node.name === 'gazo' && node.children) {
          // Get size attribute from directive attributes
          const sizeClass = node.attributes?.size || '';
          
          visit(node, 'image', (imageNode) => {
            const imageData = imageNode.data || (imageNode.data = {});
            const classes = ['lazyload', 'popup-img'];
            if (sizeClass) {
              classes.push(sizeClass);
            }
            imageData.hProperties = {
              ...(imageData.hProperties || {}),
              className: classes.join(' '),
              style: 'cursor: pointer;',
            };
          });
        }          // Unwrap paragraphs - extract children from paragraph nodes
          if (node.children && node.children.length > 0) {
            const newChildren = [];
            for (const child of node.children) {
              if (child.type === 'paragraph') {
                console.log(`[remarkCustomDirectives]   Unwrapping paragraph with ${child.children?.length || 0} children`);
                // Extract paragraph's children instead of keeping the paragraph
                newChildren.push(...child.children);
              } else {
                newChildren.push(child);
              }
            }
            node.children = newChildren;
            console.log(`[remarkCustomDirectives]   Final children count: ${node.children.length}`);
          }
        } catch (error) {
          console.error(`[remarkCustomDirectives ERROR] at line ${node.position?.start.line}: ${error.message}`);
          throw error;
        }
      }
      
      // Handle leaf directives (::)
      if (node.type === 'leafDirective') {
        const data = node.data || (node.data = {});
        const tagName = 'div';
        
        console.log(`[remarkCustomDirectives] Processing ::${node.name} at line ${node.position?.start.line}`);
        
        data.hName = tagName;
        data.hProperties = {
          className: node.name, // sup, arrow, etc.
        };
      }
    });
  };
}

