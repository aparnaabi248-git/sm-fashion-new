const fs = require('fs');
const path = require('path');

const publicDir = 'c:/Users/Bomathi/Documents/pre-final sm/SM Fashion/SM Fashion/public';

const newBrandStyle = 'background: linear-gradient(135deg, #0a4d33 0%, #148057 50%, #063121 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 0px 5px 15px rgba(20, 128, 87, 0.4);';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            results.push(file);
        }
    });
    return results;
}

const allFiles = walk(publicDir);

allFiles.forEach(file => {
    if (file.endsWith('.html')) {
        let content = fs.readFileSync(file, 'utf8');
        let updated = false;
        if (content.includes('color: var(--color-gold);">SM FASHION</span>')) {
            content = content.replace(/color:\s*var\(--color-gold\);/g, newBrandStyle);
            updated = true;
        }
        if (updated) {
            fs.writeFileSync(file, content, 'utf8');
            console.log('Updated HTML:', file);
        }
    }
});

const adminCssPath = path.join(publicDir, 'css', 'admin.css');
if (fs.existsSync(adminCssPath)) {
    let css = fs.readFileSync(adminCssPath, 'utf8');
    css = css.replace(
        '.admin-sidebar .brand {\n  font-family: var(--font-heading);\n  font-size: 1.5rem;\n  color: var(--color-gold);',
        '.admin-sidebar .brand {\n  font-family: var(--font-heading);\n  font-size: 1.5rem;\n  ' + newBrandStyle
    );
    fs.writeFileSync(adminCssPath, css, 'utf8');
    console.log('Updated CSS:', adminCssPath);
}
