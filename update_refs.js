const fs = require('fs');
const path = require('path');

const projectDir = path.join(__dirname, 'frontend');

function updateReferences(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.next') {
                updateReferences(filePath);
            }
        } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.jsx')) {
            let content = fs.readFileSync(filePath, 'utf8');
            const originalContent = content;
            
            // Replace .png, .jpg, .jpeg with .webp in strings
            // We use a regex that looks for quotes around the path to avoid replacing code logic
            content = content.replace(/\.(png|jpg|jpeg)(?=["'`])/g, '.webp');
            
            if (content !== originalContent) {
                console.log(`Updating references in: ${filePath}`);
                fs.writeFileSync(filePath, content, 'utf8');
            }
        }
    }
}

updateReferences(projectDir);
console.log('Code references updated!');
