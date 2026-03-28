const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'pages');
const layoutDir = path.join(__dirname, 'layouts');

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(filePath));
    } else if (file.endsWith('.jsx')) {
      results.push(filePath);
    }
  });
  return results;
}

const allFiles = [...getFiles(srcDir), ...getFiles(layoutDir)];

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Find all import { ... } from 'react-icons/lu'
  const regex = /import\s+\{([^}]+)\}\s+from\s+['"]react-icons\/lu['"];/g;
  content = content.replace(regex, (match, importsStr) => {
    // Split by comma, trim, filter out empty, then deduplicate using Set
    const items = importsStr.split(',').map(s => s.trim()).filter(Boolean);
    const uniqueItems = Array.from(new Set(items));
    return `import {\n  ${uniqueItems.join(', ')}\n} from 'react-icons/lu';`;
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Deduplicated icons in ${file}`);
  }
});
