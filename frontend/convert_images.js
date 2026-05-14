const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

async function convertImages(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            await convertImages(filePath);
        } else if (file.endsWith('.webp') || file.endsWith('.webp') || file.endsWith('.webp')) {
            const outputFileName = file.replace(/\.(png|jpg|jpeg)$/, '.webp');
            const outputPath = path.join(dir, outputFileName);

            console.log(`Converting: ${file} -> ${outputFileName}`);
            try {
                await sharp(filePath)
                    .webp({ quality: 90 })
                    .toFile(outputPath);
                console.log(`Successfully converted ${file}`);
            } catch (err) {
                console.error(`Error converting ${file}:`, err);
            }
        }
    }
}

convertImages(publicDir).then(() => {
    console.log('Image conversion complete!');
}).catch(err => {
    console.error('Conversion failed:', err);
});
