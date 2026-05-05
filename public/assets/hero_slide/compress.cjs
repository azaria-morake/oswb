const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = __dirname;
const outputDir = path.join(__dirname, 'optimized');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(inputDir).filter(f =>
  f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg')
);

async function compressImages() {
  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file.replace(/\.(png|jpg|jpeg)$/, '.jpg'));

    try {
      await sharp(inputPath)
        .resize({ width: 1920, withoutEnlargement: true })
        .jpeg({ quality: 75, mozjpeg: true })
        .toFile(outputPath);

      const sizeMB = fs.statSync(outputPath).size / (1024 * 1024);
      console.log(`${file} → ${sizeMB.toFixed(2)} MB`);
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  }
}

compressImages();
