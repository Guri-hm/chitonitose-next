import { visit } from 'unist-util-visit';

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
          
          // Special handling for :::gazo - store size class for rehype plugin
          if (node.name === 'gazo') {
            const sizeClass = node.attributes?.size || '';
            console.log('[gazo] node.attributes:', JSON.stringify(node.attributes), 'sizeClass:', sizeClass);
            if (sizeClass) {
              // Add size-{class} to the gazo div's className for rehype plugin to detect
              data.hProperties.className = `gazo size-${sizeClass}`;
              console.log('[gazo] Set className to:', data.hProperties.className);
            }
            
            // Wrap text nodes after images in divs
            const newChildren = [];
            for (let i = 0; i < node.children.length; i++) {
              const child = node.children[i];
              if (child.type === 'paragraph') {
                // Check if paragraph contains image
                const hasImage = child.children.some(c => c.type === 'image');
                if (hasImage) {
                  // Extract paragraph children
                  newChildren.push(...child.children);
                } else {
                  // Text paragraph after image - wrap in div
                  newChildren.push({
                    type: 'element',
                    tagName: 'div',
                    children: child.children,
                  });
                }
              } else {
                newChildren.push(child);
              }
            }
            node.children = newChildren;
          }
          
          // Special handling for :::gazo-center - text-center gazo
          if (node.name === 'gazo-center') {
            const sizeClass = node.attributes?.size || '';
            if (sizeClass) {
              data.hProperties.className = `text-center gazo size-${sizeClass}`;
            } else {
              data.hProperties.className = 'text-center gazo';
            }
          }
          
          // Special handling for :::explanation - detailed image caption
        if (node.name === 'explanation' && node.children) {
          data.hProperties.className = 'explanation';
          
          // Convert line breaks in explanation text to <br/> tags
          const processTextNodes = (children) => {
            const newChildren = [];
            for (let i = 0; i < children.length; i++) {
              const child = children[i];
              if (child.type === 'text' && child.value.includes('\n')) {
                // Split by newlines and insert <br/> between segments
                const lines = child.value.split('\n').filter(line => line.trim());
                for (let j = 0; j < lines.length; j++) {
                  newChildren.push({ type: 'text', value: lines[j] });
                  if (j < lines.length - 1) {
                    newChildren.push({
                      type: 'break',
                      data: { hName: 'br' }
                    });
                  }
                }
              } else {
                newChildren.push(child);
              }
            }
            return newChildren;
          };
          
          // Process text nodes in explanation
          if (node.children.length > 0 && node.children[0].type === 'paragraph') {
            node.children[0].children = processTextNodes(node.children[0].children);
          }
        }
        
        // Special handling for :::list - wrapper that adds class to contained ul/ol
        if (node.name === 'list' && node.children) {
          const customClass = node.attributes?.class || '';
          
          // Find ul or ol children and add the class directly
          visit(node, (child) => {
            if (child.type === 'list') {
              const childData = child.data || (child.data = {});
              childData.hProperties = {
                ...(childData.hProperties || {}),
                className: customClass,
              };
            }
          });
          
          // Replace the :::list container with its children (unwrap it)
          // We only need the list itself with the class, not the wrapping div
          data.hName = null; // Don't create a wrapper element
        }
        
        // Unwrap paragraphs - extract children from paragraph nodes (for non-gazo directives)
        if (node.name !== 'gazo' && node.children && node.children.length > 0) {
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

/**
 * Remark plugin to convert [[term]] to clickable spans
 * Works across text and html nodes (for ruby tags)
 */
function remarkTerms() {
  return (tree) => {
    let changed = true;
    while (changed) {
      changed = false;
      visit(tree, (parent) => {
        if (!parent.children) return;
        
        const children = parent.children;
        let i = 0;
        
        while (i < children.length) {
          const child = children[i];
          
          if (child.type === 'text') {
            const text = child.value;
            const startIdx = text.indexOf('[[');
            
            if (startIdx >= 0) {
              const beforeText = text.slice(0, startIdx);
              const afterStart = text.slice(startIdx + 2);
              const endIdx = afterStart.indexOf(']]');
              
              if (endIdx >= 0) {
                // Simple case: [[term]] within one text node
                const term = afterStart.slice(0, endIdx);
                const afterText = afterStart.slice(endIdx + 2);
                
                const newNodes = [];
                if (beforeText) newNodes.push({ type: 'text', value: beforeText });
                newNodes.push({
                  type: 'emphasis',
                  data: { hName: 'span', hProperties: { className: 'all' } },
                  children: [{ type: 'text', value: term }],
                });
                if (afterText) newNodes.push({ type: 'text', value: afterText });
                
                children.splice(i, 1, ...newNodes);
                changed = true;
                i += newNodes.length;
                continue;
              } else {
                // Complex: [[ starts here but ]] is in later nodes
                const collected = [];
                if (afterStart) collected.push({ type: 'text', value: afterStart });
                
                let found = false;
                for (let j = i + 1; j < children.length; j++) {
                  const next = children[j];
                  if (next.type === 'text') {
                    const endIdx2 = next.value.indexOf(']]');
                    if (endIdx2 >= 0) {
                      const before = next.value.slice(0, endIdx2);
                      if (before) collected.push({ type: 'text', value: before });
                      
                      const newNodes = [];
                      if (beforeText) newNodes.push({ type: 'text', value: beforeText });
                      newNodes.push({
                        type: 'emphasis',
                        data: { hName: 'span', hProperties: { className: 'all' } },
                        children: collected,
                      });
                      
                      const after = next.value.slice(endIdx2 + 2);
                      if (after) newNodes.push({ type: 'text', value: after });
                      
                      children.splice(i, j - i + 1, ...newNodes);
                      changed = true;
                      i += newNodes.length;
                      found = true;
                      break;
                    } else {
                      collected.push(next);
                    }
                  } else {
                    collected.push(next);
                  }
                }
                if (found) continue;
              }
            }
          }
          i++;
        }
      });
    }
  };
}

/**
 * Remark plugin to convert {{text|reading}} to <ruby> tags
 * Example: {{間氷期|かんぴょうき}} → <ruby>間氷期<rt>かんぴょうき</rt></ruby>
 */
function remarkRuby() {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      if (!parent || index === null) return;
      
      const text = node.value;
      const regex = /\{\{([^|}]+)\|([^}]+)\}\}/g;
      
      if (!regex.test(text)) return;
      
      const newNodes = [];
      let lastIndex = 0;
      
      // Reset regex for replace
      text.replace(regex, (match, baseText, reading, offset) => {
        const beforeText = text.slice(lastIndex, offset);
        if (beforeText) {
          newNodes.push({
            type: 'text',
            value: beforeText,
          });
        }
        
        // Create <ruby> tag structure
        newNodes.push({
          type: 'emphasis',
          data: {
            hName: 'ruby',
            hProperties: {},
          },
          children: [
            {
              type: 'text',
              value: baseText,
            },
            {
              type: 'emphasis',
              data: {
                hName: 'rt',
                hProperties: {},
              },
              children: [{
                type: 'text',
                value: reading,
              }],
            },
          ],
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
      
      if (newNodes.length > 0) {
        parent.children.splice(index, 1, ...newNodes);
        return [visit.SKIP, index + newNodes.length];
      }
    });
  };
}

/**
 * Remark plugin to convert ==marked text== to spans with marker class
 * Works across text and html nodes (for ruby tags)
 */
function remarkMarkers() {
  return (tree) => {
    let changed = true;
    while (changed) {
      changed = false;
      visit(tree, (parent) => {
        if (!parent.children) return;
        
        const children = parent.children;
        let i = 0;
        
        while (i < children.length) {
          const child = children[i];
          
          if (child.type === 'text') {
            const text = child.value;
            const startIdx = text.indexOf('==');
            
            if (startIdx >= 0) {
              const beforeText = text.slice(0, startIdx);
              const afterStart = text.slice(startIdx + 2);
              const endIdx = afterStart.indexOf('==');
              
              if (endIdx >= 0) {
                // Simple: ==text== in one node
                const marked = afterStart.slice(0, endIdx);
                const afterText = afterStart.slice(endIdx + 2);
                
                const newNodes = [];
                if (beforeText) newNodes.push({ type: 'text', value: beforeText });
                newNodes.push({
                  type: 'emphasis',
                  data: { hName: 'span', hProperties: { className: 'marker' } },
                  children: [{ type: 'text', value: marked }],
                });
                if (afterText) newNodes.push({ type: 'text', value: afterText });
                
                children.splice(i, 1, ...newNodes);
                changed = true;
                i += newNodes.length;
                continue;
              } else {
                // Complex: == starts but ends in later nodes
                const collected = [];
                if (afterStart) collected.push({ type: 'text', value: afterStart });
                
                let found = false;
                for (let j = i + 1; j < children.length; j++) {
                  const next = children[j];
                  if (next.type === 'text') {
                    const endIdx2 = next.value.indexOf('==');
                    if (endIdx2 >= 0) {
                      const before = next.value.slice(0, endIdx2);
                      if (before) collected.push({ type: 'text', value: before });
                      
                      const newNodes = [];
                      if (beforeText) newNodes.push({ type: 'text', value: beforeText });
                      newNodes.push({
                        type: 'emphasis',
                        data: { hName: 'span', hProperties: { className: 'marker' } },
                        children: collected,
                      });
                      
                      const after = next.value.slice(endIdx2 + 2);
                      if (after) newNodes.push({ type: 'text', value: after });
                      
                      children.splice(i, j - i + 1, ...newNodes);
                      changed = true;
                      i += newNodes.length;
                      found = true;
                      break;
                    } else {
                      collected.push(next);
                    }
                  } else {
                    collected.push(next);
                  }
                }
                if (found) continue;
              }
            }
          }
          i++;
        }
      });
    }
  };
}

/**
 * Remark plugin to convert **red text** to red font
 * Works across text and html nodes (for ruby tags)
 */
function remarkRedText() {
  return (tree) => {
    let changed = true;
    while (changed) {
      changed = false;
      visit(tree, (parent) => {
        if (!parent.children) return;
        
        const children = parent.children;
        let i = 0;
        
        while (i < children.length) {
          const child = children[i];
          
          if (child.type === 'text') {
            const text = child.value;
            const startIdx = text.indexOf('**');
            
            if (startIdx >= 0) {
              const beforeText = text.slice(0, startIdx);
              const afterStart = text.slice(startIdx + 2);
              const endIdx = afterStart.indexOf('**');
              
              if (endIdx >= 0) {
                // Simple: **text** in one node
                const redText = afterStart.slice(0, endIdx);
                const afterText = afterStart.slice(endIdx + 2);
                
                const newNodes = [];
                if (beforeText) newNodes.push({ type: 'text', value: beforeText });
                newNodes.push({
                  type: 'emphasis',
                  data: { hName: 'span', hProperties: { className: 'red-text' } },
                  children: [{ type: 'text', value: redText }],
                });
                if (afterText) newNodes.push({ type: 'text', value: afterText });
                
                children.splice(i, 1, ...newNodes);
                changed = true;
                i += newNodes.length;
                continue;
              } else {
                // Complex: ** starts but ends in later nodes
                const collected = [];
                if (afterStart) collected.push({ type: 'text', value: afterStart });
                
                let found = false;
                for (let j = i + 1; j < children.length; j++) {
                  const next = children[j];
                  if (next.type === 'text') {
                    const endIdx2 = next.value.indexOf('**');
                    if (endIdx2 >= 0) {
                      const before = next.value.slice(0, endIdx2);
                      if (before) collected.push({ type: 'text', value: before });
                      
                      const newNodes = [];
                      if (beforeText) newNodes.push({ type: 'text', value: beforeText });
                      newNodes.push({
                        type: 'emphasis',
                        data: { hName: 'span', hProperties: { className: 'red-text' } },
                        children: collected,
                      });
                      
                      const after = next.value.slice(endIdx2 + 2);
                      if (after) newNodes.push({ type: 'text', value: after });
                      
                      children.splice(i, j - i + 1, ...newNodes);
                      changed = true;
                      i += newNodes.length;
                      found = true;
                      break;
                    } else {
                      collected.push(next);
                    }
                  } else {
                    collected.push(next);
                  }
                }
                if (found) continue;
              }
            }
          }
          i++;
        }
      });
    }
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

export {
  remarkRubyEncode,
  remarkRubyDecode,
  remarkCustomDirectives,
  remarkTerms,
  remarkRuby,
  remarkMarkers,
  remarkRedText,
  remarkCustomImages,
  remarkArrows,
  remarkListClasses,
};
