/**
 * Rehype plugin to add size classes to images inside gazo directives
 */

import { visit } from 'unist-util-visit';

export function rehypeGazoImages() {
  return (tree) => {
    let divCount = 0;
    let gazoCount = 0;
    visit(tree, 'element', (node) => {
      if (node.tagName === 'div') {
        divCount++;
        const classStr = Array.isArray(node.properties?.className) 
          ? node.properties.className.join(' ') 
          : (node.properties?.className || '');
        
        if (classStr.includes('gazo')) {
          gazoCount++;
          console.log('[rehypeGazoImages] Found gazo div:', classStr);
          
          // Extract size class if present
          const sizeMatch = classStr.match(/size-(half|twice|small|large)/);
          const sizeClass = sizeMatch ? sizeMatch[1] : null;
          
          if (sizeClass) {
            console.log('[rehypeGazoImages] Size class detected:', sizeClass);
          }
          
          // Process all child nodes
          let imgCount = 0;
          visit(node, 'element', (childNode) => {
            if (childNode.tagName === 'img') {
              imgCount++;
              console.log('[rehypeGazoImages] Found img #', imgCount, 'src:', childNode.properties?.src);
              
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
              console.log('[rehypeGazoImages] Updated img className:', childNode.properties.className);
            }
          });
        }
      }
    });
    console.log('[rehypeGazoImages] Summary: Found', divCount, 'divs,', gazoCount, 'gazo divs');
  };
}
