const fs = require('fs');
const path = require('path');

// Read the actual file
const filePath = path.join(process.cwd(), 'content/jh/lessons/1.md');
const content = fs.readFileSync(filePath, 'utf-8');

// Find all gazo directives
const gazoRegex = /:::gazo(\{[^}]+\})?[\s\S]*?:::/g;
const matches = content.match(gazoRegex);

console.log('=== Found gazo directives in 1.md ===\n');
if (matches) {
  matches.forEach((match, index) => {
    console.log(`Match ${index + 1}:`);
    console.log(match);
    console.log('---\n');
  });
} else {
  console.log('No gazo directives found');
}
