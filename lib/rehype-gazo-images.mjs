/**
 * Rehype plugin to add size classes to images inside gazo directives
 */

import { visit } from 'unist-util-visit';

export function rehypeGazoImages() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      // Find all div.gazo elements (including text-center gazo)
      if (node.tagName === 'div' && node.properties && node.properties.className) {
        const classStr = Array.isArray(node.properties.className) 
          ? node.properties.className.join(' ') 
          : node.properties.className;
        
        // Check if this is a gazo div
        if (classStr.includes('gazo')) {
          // Extract size class if present (e.g., "gazo size-half" -> "half")
          const sizeMatch = classStr.match(/size-(half|twice|small|large)/);
          const sizeClass = sizeMatch ? sizeMatch[1] : null;
          
          // Process all child nodes
          visit(node, 'element', (childNode) => {
            if (childNode.tagName === 'img') {
              // Get existing classes
              const existingClassName = childNode.properties.className || '';
              const classArray = existingClassName 
                ? (Array.isArray(existingClassName) ? existingClassName : existingClassName.split(' '))
                : [];
              
              // Add lazyload and popup-img if not present
              if (!classArray.includes('lazyload')) {
                classArray.push('lazyload');
              }
              if (!classArray.includes('popup-img')) {
                classArray.push('popup-img');
              }
              
              // Add size class if present
              if (sizeClass && !classArray.includes(sizeClass)) {
                classArray.push(sizeClass);
              }
              
              // Update className
              childNode.properties.className = classArray.join(' ');
            }
          });
        }
      }
    });
  };
}
