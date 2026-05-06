const fs = require('fs');

function replaceClasses(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Add imports if not present
    if (!content.includes('import { glassCardStyle')) {
        content = content.replace("import { AuthContext }", "import { AuthContext } from '../context/AuthContext';\nimport { glassCardStyle, glassCardHover, btnPrimaryStyle, btnPrimaryHover, btnSecondaryStyle, btnSecondaryHover, btnGhostStyle, btnGhostHover, applyHover, removeHover } from '../inlineStyles';\n// ");
    }

    // Replace className="glass-card" with style
    content = content.replace(/className="glass-card"\s+style=\{\{(.*?)\}\}/g, 'style={{ ...glassCardStyle, $1 }} onMouseOver={e => applyHover(e, glassCardHover)} onMouseOut={e => removeHover(e, glassCardStyle)}');
    content = content.replace(/className="glass-card"/g, 'style={glassCardStyle} onMouseOver={e => applyHover(e, glassCardHover)} onMouseOut={e => removeHover(e, glassCardStyle)}');
    
    // Replace className="btn-primary"
    content = content.replace(/className="btn-primary"\s+style=\{\{(.*?)\}\}/g, 'style={{ ...btnPrimaryStyle, $1 }} onMouseOver={e => applyHover(e, btnPrimaryHover)} onMouseOut={e => removeHover(e, btnPrimaryStyle)}');
    content = content.replace(/className="btn-primary"/g, 'style={btnPrimaryStyle} onMouseOver={e => applyHover(e, btnPrimaryHover)} onMouseOut={e => removeHover(e, btnPrimaryStyle)}');

    // Replace className="btn-secondary"
    content = content.replace(/className="btn-secondary"\s+style=\{\{(.*?)\}\}/g, 'style={{ ...btnSecondaryStyle, $1 }} onMouseOver={e => applyHover(e, btnSecondaryHover)} onMouseOut={e => removeHover(e, btnSecondaryStyle)}');
    content = content.replace(/className="btn-secondary"/g, 'style={btnSecondaryStyle} onMouseOver={e => applyHover(e, btnSecondaryHover)} onMouseOut={e => removeHover(e, btnSecondaryStyle)}');
    
    // Replace className="btn-ghost"
    content = content.replace(/className="btn-ghost"\s+style=\{\{(.*?)\}\}/g, 'style={{ ...btnGhostStyle, $1 }} onMouseOver={e => applyHover(e, btnGhostHover)} onMouseOut={e => removeHover(e, btnGhostStyle)}');
    content = content.replace(/className="btn-ghost"/g, 'style={btnGhostStyle} onMouseOver={e => applyHover(e, btnGhostHover)} onMouseOut={e => removeHover(e, btnGhostStyle)}');
    
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${filePath}`);
}

replaceClasses('c:\\xampp\\htdocs\\WandereLocal\\src\\pages\\TravelerDashboard.jsx');
replaceClasses('c:\\xampp\\htdocs\\WandereLocal\\src\\pages\\BusinessDashboard.jsx');
