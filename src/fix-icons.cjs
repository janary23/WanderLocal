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

const finalIconMap = {
  FaUser: 'LuUser',
  FaEyeSlash: 'LuEyeOff',
  FaStore: 'LuStore',
  FaTag: 'LuTag',
  FaCommentAlt: 'LuMessageSquare',
  FaPhone: 'LuPhone',
  FaArrowLeft: 'LuArrowLeft',
  FaClock: 'LuClock',
  FaRegBookmark: 'LuBookmarkMinus',
  FaShare: 'LuShare',
  FaSpinner: 'LuLoader2',
  FaRobot: 'LuCpu',
  FaMagic: 'LuWand2',
  FaExternalLinkAlt: 'LuExternalLink',
  FaBullhorn: 'LuMegaphone',
  FaBars: 'LuMenu'
};

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace FaXyz tags
  for (const [fa, lu] of Object.entries(finalIconMap)) {
    content = content.replace(new RegExp(`\\b${fa}\\b`, 'g'), lu);
  }

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated icons in ${file}`);
  }
});
