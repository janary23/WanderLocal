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

// Regex to capture Emojis without grabbing standard text elements like numbers # or *.
const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

allFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    content = content.replace(emojiRegex, '');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Removed emojis from ${path.basename(file)}`);
    }
});
