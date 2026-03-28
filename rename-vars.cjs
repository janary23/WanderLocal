const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function getFiles(dir) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        results = results.concat(getFiles(filePath));
      } else if (file.endsWith('.jsx') || file.endsWith('.css')) {
        results.push(filePath);
      }
    });
  } catch (e) {}
  return results;
}

const allFiles = getFiles(srcDir);

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Rename occurrences of var(--blue...) to var(--primary...)
  content = content.replace(/--blue/g, '--primary');
  
  // Rename occurrences of var(--forest...) to var(--secondary...)
  content = content.replace(/--forest/g, '--secondary');
  
  // Rename occurrences of var(--gold...) to var(--accent...)
  content = content.replace(/--gold/g, '--accent');

  // Rename leaf context (leaf -> primary-alt)
  content = content.replace(/--leaf/g, '--primary-alt');
  
  // Rename sage context (sage -> secondary-alt)
  content = content.replace(/--sage/g, '--secondary-alt');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated vars in ${path.basename(file)}`);
  }
});
