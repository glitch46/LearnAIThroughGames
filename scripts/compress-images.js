#!/usr/bin/env node
/**
 * Image Compression Script for Prompt Escape Room
 * Converts PNG images to WebP and generates thumbnails
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '../apps/prompt-escape-rooms/assets');

const CONFIG = {
  rooms: {
    inputDir: path.join(ASSETS_DIR, 'rooms'),
    outputDir: path.join(ASSETS_DIR, 'rooms'),
    thumbDir: path.join(ASSETS_DIR, 'rooms/thumbs'),
    fullWidth: 1200,
    thumbWidth: 400,
    quality: 80,
    thumbQuality: 75
  },
  badges: {
    inputDir: path.join(ASSETS_DIR, 'badges'),
    outputDir: path.join(ASSETS_DIR, 'badges'),
    fullWidth: 400,
    quality: 80
  },
  hub: {
    inputDir: path.join(ASSETS_DIR, 'hub'),
    outputDir: path.join(ASSETS_DIR, 'hub'),
    fullWidth: 1200,
    quality: 80
  }
};

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
}

async function compressImage(inputPath, outputPath, width, quality) {
  try {
    const stats = fs.statSync(inputPath);
    const originalSize = stats.size;
    
    await sharp(inputPath)
      .resize(width, null, { withoutEnlargement: true })
      .webp({ quality })
      .toFile(outputPath);
    
    const newStats = fs.statSync(outputPath);
    const newSize = newStats.size;
    const reduction = ((1 - newSize / originalSize) * 100).toFixed(1);
    
    console.log(`  ${path.basename(inputPath)} -> ${path.basename(outputPath)}`);
    console.log(`    ${(originalSize / 1024 / 1024).toFixed(2)}MB -> ${(newSize / 1024).toFixed(0)}KB (${reduction}% smaller)`);
    
    return { original: originalSize, compressed: newSize };
  } catch (err) {
    console.error(`  Error processing ${inputPath}: ${err.message}`);
    return null;
  }
}

async function processRooms() {
  console.log('\n=== Processing Room Images ===');
  const { inputDir, outputDir, thumbDir, fullWidth, thumbWidth, quality, thumbQuality } = CONFIG.rooms;
  
  await ensureDir(thumbDir);
  
  const files = fs.readdirSync(inputDir).filter(f => 
    f.toLowerCase().endsWith('.png') && !f.includes('thumb')
  );
  
  let totalOriginal = 0;
  let totalCompressed = 0;
  
  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const baseName = path.basename(file, '.png').toLowerCase();
    const webpPath = path.join(outputDir, `${baseName}.webp`);
    const thumbPath = path.join(thumbDir, `${baseName}.webp`);
    
    // Full size WebP
    console.log(`\nProcessing: ${file}`);
    const fullResult = await compressImage(inputPath, webpPath, fullWidth, quality);
    if (fullResult) {
      totalOriginal += fullResult.original;
      totalCompressed += fullResult.compressed;
    }
    
    // Thumbnail
    const thumbResult = await compressImage(inputPath, thumbPath, thumbWidth, thumbQuality);
    if (thumbResult) {
      totalCompressed += thumbResult.compressed;
    }
  }
  
  return { totalOriginal, totalCompressed };
}

async function processBadges() {
  console.log('\n=== Processing Badge Images ===');
  const { inputDir, outputDir, fullWidth, quality } = CONFIG.badges;
  
  const files = fs.readdirSync(inputDir).filter(f => 
    f.toLowerCase().endsWith('.png')
  );
  
  let totalOriginal = 0;
  let totalCompressed = 0;
  
  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const baseName = path.basename(file, '.png').toLowerCase();
    const webpPath = path.join(outputDir, `${baseName}.webp`);
    
    console.log(`\nProcessing: ${file}`);
    const result = await compressImage(inputPath, webpPath, fullWidth, quality);
    if (result) {
      totalOriginal += result.original;
      totalCompressed += result.compressed;
    }
  }
  
  return { totalOriginal, totalCompressed };
}

async function processHub() {
  console.log('\n=== Processing Hub Images ===');
  const { inputDir, outputDir, fullWidth, quality } = CONFIG.hub;
  
  const files = fs.readdirSync(inputDir).filter(f => 
    f.toLowerCase().endsWith('.png')
  );
  
  let totalOriginal = 0;
  let totalCompressed = 0;
  
  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const baseName = path.basename(file, '.png').toLowerCase();
    const webpPath = path.join(outputDir, `${baseName}.webp`);
    
    console.log(`\nProcessing: ${file}`);
    const result = await compressImage(inputPath, webpPath, fullWidth, quality);
    if (result) {
      totalOriginal += result.original;
      totalCompressed += result.compressed;
    }
  }
  
  return { totalOriginal, totalCompressed };
}

async function main() {
  console.log('Starting image compression...\n');
  
  const roomsResult = await processRooms();
  const badgesResult = await processBadges();
  const hubResult = await processHub();
  
  const totalOriginal = roomsResult.totalOriginal + badgesResult.totalOriginal + hubResult.totalOriginal;
  const totalCompressed = roomsResult.totalCompressed + badgesResult.totalCompressed + hubResult.totalCompressed;
  
  console.log('\n=== SUMMARY ===');
  console.log(`Original total: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Compressed total: ${(totalCompressed / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total reduction: ${((1 - totalCompressed / totalOriginal) * 100).toFixed(1)}%`);
  console.log('\nDone! WebP images created alongside originals.');
}

main().catch(console.error);
