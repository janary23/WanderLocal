const fs = require('fs');
const path = require('path');
const lu = require('react-icons/lu');
const exportedLu = new Set(Object.keys(lu));

const srcDir = path.join(__dirname, 'pages');
const layoutDir = path.join(__dirname, 'layouts');

function getFiles(dir) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        results = results.concat(getFiles(filePath));
      } else if (file.endsWith('.jsx')) {
        results.push(filePath);
      }
    });
  } catch (e) {}
  return results;
}

const allFiles = [...getFiles(srcDir), ...getFiles(layoutDir)];

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  const textRegex = /\bLu[A-Za-z0-9]+\b/g;
  content = content.replace(textRegex, (match) => {
    if (!exportedLu.has(match)) {
      console.log(`Replaced missing ${match} in ${path.basename(file)}`);
      if(match === 'LuHome') return 'LuHouse';
      if(match === 'LuEdit') return 'LuPen';
      if(match === 'LuMapPin') return 'LuMapPin'; 
      if(match === 'LuClock') return 'LuClock4'; 
      if(match === 'LuArrowLeft') return 'LuArrowLeft'; 
      return 'LuCircle';
    }
    return match;
  });

  // Deduplicate imports
  const regex = /import\s+\{([^}]+)\}\s+from\s+['"]react-icons\/lu['"]/g;
  content = content.replace(regex, (match, importsStr) => {
    const items = importsStr.split(',').map(s => s.trim()).filter(Boolean);
    const uniqueItems = Array.from(new Set(items));
    return `import {\n  ${uniqueItems.join(', ')}\n} from 'react-icons/lu'`;
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
  }
});
