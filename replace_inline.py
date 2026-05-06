import re
import sys

def replace_classes(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Add imports if not present
    if "import { glassCardStyle" not in content:
        content = content.replace("import { AuthContext }", "import { AuthContext } from '../context/AuthContext';\nimport { glassCardStyle, glassCardHover, btnPrimaryStyle, btnPrimaryHover, btnGhostStyle, btnGhostHover, applyHover, removeHover } from '../inlineStyles';\n// ")

    # Replace className="glass-card"
    content = re.sub(r'className="glass-card"\s+style=\{\{(.*?)\}\}', r'style={{ ...glassCardStyle, \1 }} onMouseOver={e => applyHover(e, glassCardHover)} onMouseOut={e => removeHover(e, glassCardStyle)}', content)
    content = re.sub(r'className="glass-card"', r'style={glassCardStyle} onMouseOver={e => applyHover(e, glassCardHover)} onMouseOut={e => removeHover(e, glassCardStyle)}', content)
    
    # Replace className="btn-primary"
    content = re.sub(r'className="btn-primary"\s+style=\{\{(.*?)\}\}', r'style={{ ...btnPrimaryStyle, \1 }} onMouseOver={e => applyHover(e, btnPrimaryHover)} onMouseOut={e => removeHover(e, btnPrimaryStyle)}', content)
    content = re.sub(r'className="btn-primary"', r'style={btnPrimaryStyle} onMouseOver={e => applyHover(e, btnPrimaryHover)} onMouseOut={e => removeHover(e, btnPrimaryStyle)}', content)

    # Replace className="btn-secondary"
    content = re.sub(r'className="btn-secondary"\s+style=\{\{(.*?)\}\}', r'style={{ ...btnSecondaryStyle, \1 }} onMouseOver={e => applyHover(e, btnSecondaryHover)} onMouseOut={e => removeHover(e, btnSecondaryStyle)}', content)
    content = re.sub(r'className="btn-secondary"', r'style={btnSecondaryStyle} onMouseOver={e => applyHover(e, btnSecondaryHover)} onMouseOut={e => removeHover(e, btnSecondaryStyle)}', content)
    
    # Replace className="btn-ghost"
    content = re.sub(r'className="btn-ghost"\s+style=\{\{(.*?)\}\}', r'style={{ ...btnGhostStyle, \1 }} onMouseOver={e => applyHover(e, btnGhostHover)} onMouseOut={e => removeHover(e, btnGhostStyle)}', content)
    content = re.sub(r'className="btn-ghost"', r'style={btnGhostStyle} onMouseOver={e => applyHover(e, btnGhostHover)} onMouseOut={e => removeHover(e, btnGhostStyle)}', content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Updated {file_path}")

replace_classes('c:\\xampp\\htdocs\\WandereLocal\\src\\pages\\TravelerDashboard.jsx')
replace_classes('c:\\xampp\\htdocs\\WandereLocal\\src\\pages\\BusinessDashboard.jsx')
