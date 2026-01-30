import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root, Paragraph, Text } from 'mdast';

/**
 * Remark plugin to convert custom directives like :::lead, ::top, etc.
 * to HTML divs with appropriate classes
 */
export const remarkCustomDirectives: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, (node: any, index, parent) => {
      // Handle container directives (:::)
      if (node.type === 'containerDirective') {
        const data = node.data || (node.data = {});
        const tagName = 'div';
        
        data.hName = tagName;
        data.hProperties = {
          className: node.name, // lead, etc.
        };
      }
      
      // Handle leaf directives (::)
      if (node.type === 'leafDirective') {
        const data = node.data || (node.data = {});
        const tagName = 'div';
        
        data.hName = tagName;
        data.hProperties = {
          className: node.name, // top, middle, last, sup, gazo, etc.
        };
      }
    });
  };
};

/**
 * Remark plugin to convert [[term]] to clickable spans
 */
export const remarkTerms: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'text', (node: Text, index, parent) => {
      if (!parent || index === null) return;
      
      const text = node.value;
      const regex = /\[\[([^\]]+)\]\]/g;
      
      if (!regex.test(text)) return;
      
      const newNodes: any[] = [];
      let lastIndex = 0;
      const matches = text.matchAll(/\[\[([^\]]+)\]\]/g);
      
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
        
        lastIndex = match.index! + match[0].length;
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
};

/**
 * Remark plugin to convert ==marked text== to spans with marker class
 */
export const remarkMarkers: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'text', (node: Text, index, parent) => {
      if (!parent || index === null) return;
      
      const text = node.value;
      const regex = /==([^=]+)==/g;
      
      if (!regex.test(text)) return;
      
      const newNodes: any[] = [];
      let lastIndex = 0;
      const matches = text.matchAll(/==([^=]+)==/g);
      
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
        
        lastIndex = match.index! + match[0].length;
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
};

/**
 * Remark plugin to convert **red text** to red font
 */
export const remarkRedText: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'strong', (node: any, index, parent) => {
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
};

/**
 * Remark plugin to handle custom image syntax with classes
 * ![](img/2/1.svg){.twice}
 */
export const remarkCustomImages: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'image', (node: any, index, parent) => {
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
};

/**
 * Remark plugin to handle ---arrow--- dividers
 */
export const remarkArrows: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'thematicBreak', (node: any, index, parent) => {
      if (!parent || index === null) return;
      
      // Check if previous or next node contains "arrow"
      const prevNode = parent.children[index - 1];
      const nextNode = parent.children[index + 1];
      
      // Look for ---arrow--- pattern
      if (
        (prevNode && prevNode.type === 'paragraph' && 
         prevNode.children[0]?.type === 'text' && 
         prevNode.children[0].value.includes('arrow')) ||
        (nextNode && nextNode.type === 'paragraph' && 
         nextNode.children[0]?.type === 'text' && 
         nextNode.children[0].value.includes('arrow'))
      ) {
        const newNode = {
          type: 'html',
          value: '<div class="arrow"></div>',
        };
        
        parent.children[index] = newNode;
        
        // Remove the text node containing "arrow"
        if (prevNode && prevNode.type === 'paragraph' && 
            prevNode.children[0]?.type === 'text' && 
            prevNode.children[0].value.includes('arrow')) {
          parent.children.splice(index - 1, 1);
        }
        if (nextNode && nextNode.type === 'paragraph' && 
            nextNode.children[0]?.type === 'text' && 
            nextNode.children[0].value.includes('arrow')) {
          parent.children.splice(index + 1, 1);
        }
      }
    });
  };
};
