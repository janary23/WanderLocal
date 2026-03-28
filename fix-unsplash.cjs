const fs = require('fs');
const path = require('path');

function getFiles(dir) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        results = results.concat(getFiles(filePath));
      } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
        results.push(filePath);
      }
    });
  } catch (e) {}
  return results;
}

const allFiles = getFiles(path.join(__dirname, 'src'));

allFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    content = content.replace(/https:\/\/images\.unsplash\.com\/photo-([a-zA-Z0-9-]+)[^'"]*/g, (match, id) => {
        const seed = id.substring(0, 8);
        return `https://picsum.photos/seed/${seed}/800/600`;
    });

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated images in ${path.basename(file)}`);
    }
});
