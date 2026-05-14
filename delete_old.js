const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'frontend', 'public');

function deleteOldImages(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            deleteOldImages(filePath);
        } else if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
            const webpVersion = file.replace(/\.(png|jpg|jpeg)$/, '.webp');
            const webpPath = path.join(dir, webpVersion);

            if (fs.existsSync(webpPath)) {
                console.log(`Deleting old image: ${file}`);
                fs.unlinkSync(filePath);
            }
        }
    }
}

deleteOldImages(publicDir);
console.log('Old images deleted!');
