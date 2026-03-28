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

// Lucide React icon mappings (approximate from Fa to Lu)
const iconMap = {
  FaChartLine: 'LuLineChart', FaCheckCircle: 'LuCheckCircle', FaExclamationTriangle: 'LuAlertTriangle',
  FaUsers: 'LuUsers', FaBoxOpen: 'LuPackage', FaCheck: 'LuCheck', FaTimes: 'LuX', FaUndo: 'LuUndo',
  FaEye: 'LuEye', FaSearch: 'LuSearch', FaFilter: 'LuFilter', FaDownload: 'LuDownload', FaRegClock: 'LuClock',
  FaMapMarkerAlt: 'LuMapPin', FaCog: 'LuSettings', FaBell: 'LuBell', FaShieldAlt: 'LuShield',
  FaDatabase: 'LuDatabase', FaUserShield: 'LuUserCheck', FaChevronRight: 'LuChevronRight', FaPlus: 'LuPlus',
  FaEdit: 'LuEdit', FaTrash: 'LuTrash2', FaToggleOn: 'LuToggleRight', FaToggleOff: 'LuToggleLeft',
  FaStar: 'LuStar', FaExclamationCircle: 'LuAlertCircle', FaMap: 'LuMap', FaBookmark: 'LuBookmark',
  FaHistory: 'LuHistory', FaShareAlt: 'LuShare2', FaLock: 'LuLock', FaGlobe: 'LuGlobe', FaCompass: 'LuCompass',
  FaCopy: 'LuCopy', FaRegBell: 'LuBell', FaInfoCircle: 'LuInfo', FaFire: 'LuFlame', FaCamera: 'LuCamera',
  FaUserCircle: 'LuUserCircle', FaSignOutAlt: 'LuLogOut', FaEnvelope: 'LuMail', FaCaretDown: 'LuChevronDown',
  FaHome: 'LuHome', FaRoute: 'LuRoute', FaUtensils: 'LuUtensils', FaTree: 'LuTreePine',
  FaHeart: 'LuHeart', FaRegHeart: 'LuHeart', FaArrowRight: 'LuArrowRight', FaPlayCircle: 'LuPlayCircle',
  FaChevronLeft: 'LuChevronLeft', FaQuoteLeft: 'LuQuote', FaCalendarAlt: 'LuCalendar'
};

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Colors
  const colors = {
    '#1C1917': 'var(--ink)',
    '#A8A29E': 'var(--stone-light)',
    '#78716C': 'var(--stone)',
    '#44403C': 'var(--stone-light)',
    '#2D5016': 'var(--forest)',
    '#C4622D': 'var(--terracotta)',
    '#C9964A': 'var(--gold)',
    '#7C4DCC': 'var(--blue)',
    '#2563EB': 'var(--blue)',
    '#3B82F6': 'var(--blue-mid)',
    '#1558B0': 'var(--blue-dark)',
    '#F7F8FA': 'var(--bg-sand)',
    '#F3F8EF': 'var(--leaf-pale)',
    '#EBF5E3': 'var(--leaf-pale)',
    '#FAFAF9': 'var(--bg-surface)',
    '#E7E5E4': 'var(--border)',
    '#E2E8F0': 'var(--border)',
    '#22C55E': 'var(--forest-light)',
    '#EF4444': 'var(--terracotta)',
    '#BBF7D0': 'var(--leaf-border)',
    '#FECDD3': 'var(--terra-border)',
    '#F0FDF4': 'var(--leaf-pale)',
    '#FFF1F2': 'var(--terra-pale)',
    '#EFF6FF': 'var(--blue-pale)'
  };

  for (const [hex, cssVar] of Object.entries(colors)) {
    // replace case-insensitive
    const re = new RegExp(`['"]${hex}['"]`, 'gi');
    content = content.replace(re, `'${cssVar}'`);
  }

  // Fonts
  content = content.replace(/fontFamily:\s*['"]Fraunces[^'"]*['"]/g, "fontFamily: 'var(--ff-display)'");

  // Icon imports
  content = content.replace(/from\s+['"]react-icons\/fa['"]/g, "from 'react-icons/lu'");
  content = content.replace(/from\s+['"]react-icons\/fi['"]/g, "from 'react-icons/lu'");

  // Replace Fa* tags
  for (const [fa, lu] of Object.entries(iconMap)) {
    content = content.replace(new RegExp(`\\b${fa}\\b`, 'g'), lu);
  }

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
