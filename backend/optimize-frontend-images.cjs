
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesToOptimize = [
  'home-hero.png',
  'donate-hero.png',
  'about-hero.png',
  'contact-hero.png',
  'achievements-hero.png', // Found in grep results too
  'gallery-hero.jpg' // Might as well
];

const sourceDir = path.resolve(__dirname, '../frontend/src/assets/images');

async function optimize() {
  console.log('Starting image optimization...');
  
  if (!fs.existsSync(sourceDir)) {
    console.error('Source directory not found:', sourceDir);
    return;
  }

  for (const file of imagesToOptimize) {
    const inputPath = path.join(sourceDir, file);
    if (!fs.existsSync(inputPath)) {
      console.log(`Skipping ${file} - not found`);
      continue;
    }

    const outputFilename = file.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    const outputPath = path.join(sourceDir, outputFilename);

    console.log(`Optimizing ${file} -> ${outputFilename}...`);

    try {
      await sharp(inputPath)
        .resize({ width: 1920, withoutEnlargement: true }) // Max width 1920
        .webp({ quality: 80 })
        .toFile(outputPath);
      
      console.log(`Successfully created ${outputFilename}`);
      
      // Get sizes
      const inputStats = fs.statSync(inputPath);
      const outputStats = fs.statSync(outputPath);
      console.log(`Size reduced: ${(inputStats.size / 1024 / 1024).toFixed(2)}MB -> ${(outputStats.size / 1024 / 1024).toFixed(2)}MB`);

    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  }
}

optimize();
