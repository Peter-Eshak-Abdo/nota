const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const publicDir = path.join(__dirname, '..', 'public');

// Elegant Church / Spiritual Notebook Icon SVG:
// Warm amber background (#D97706 to #B45309 gradient), Christian golden cross & sacred rays, book/note pages
const createSvg = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B"/>
      <stop offset="50%" stop-color="#D97706"/>
      <stop offset="100%" stop-color="#92400E"/>
    </linearGradient>
    <linearGradient id="goldCross" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FEF3C7"/>
      <stop offset="50%" stop-color="#FDE68A"/>
      <stop offset="100%" stop-color="#F59E0B"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="${size * 0.02}" stdDeviation="${size * 0.03}" flood-color="#000" flood-opacity="0.25"/>
    </filter>
  </defs>

  <!-- Squircle rounded background for native app look -->
  <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="url(#bgGrad)"/>

  <!-- Inner subtle border glow -->
  <rect x="${size * 0.03}" y="${size * 0.03}" width="${size * 0.94}" height="${size * 0.94}" rx="${size * 0.2}" stroke="#FDE68A" stroke-width="${size * 0.015}" stroke-opacity="0.4" fill="none"/>

  <!-- Holy Light Rays / Arch in Background -->
  <circle cx="${size * 0.5}" cy="${size * 0.45}" r="${size * 0.32}" stroke="#FEF3C7" stroke-width="${size * 0.01}" stroke-dasharray="${size * 0.02} ${size * 0.02}" opacity="0.4"/>

  <!-- Holy Bible / Open Notebook Silhouette -->
  <g filter="url(#shadow)">
    <!-- Book Left Page -->
    <path d="
      M ${size * 0.5} ${size * 0.76}
      C ${size * 0.42} ${size * 0.72} ${size * 0.26} ${size * 0.73} ${size * 0.2} ${size * 0.77}
      L ${size * 0.2} ${size * 0.46}
      C ${size * 0.26} ${size * 0.42} ${size * 0.42} ${size * 0.41} ${size * 0.5} ${size * 0.45}
      Z
    " fill="#FFFBEB" opacity="0.95"/>

    <!-- Book Right Page -->
    <path d="
      M ${size * 0.5} ${size * 0.76}
      C ${size * 0.58} ${size * 0.72} ${size * 0.74} ${size * 0.73} ${size * 0.8} ${size * 0.77}
      L ${size * 0.8} ${size * 0.46}
      C ${size * 0.74} ${size * 0.42} ${size * 0.58} ${size * 0.41} ${size * 0.5} ${size * 0.45}
      Z
    " fill="#FEF3C7" opacity="0.95"/>

    <!-- Book Spine Center Fold -->
    <path d="M ${size * 0.5} ${size * 0.45} L ${size * 0.5} ${size * 0.76}" stroke="#D97706" stroke-width="${size * 0.015}" stroke-linecap="round"/>
  </g>

  <!-- Sacred Orthodox Christian Cross Shining Above the Book -->
  <g filter="url(#shadow)">
    <!-- Vertical Cross Beam -->
    <rect x="${size * 0.46}" y="${size * 0.18}" width="${size * 0.08}" height="${size * 0.32}" rx="${size * 0.02}" fill="url(#goldCross)"/>
    <!-- Horizontal Cross Beam -->
    <rect x="${size * 0.34}" y="${size * 0.26}" width="${size * 0.32}" height="${size * 0.08}" rx="${size * 0.02}" fill="url(#goldCross)"/>
    
    <!-- Central Cross Diamond Gem -->
    <polygon points="
      ${size * 0.5},${size * 0.27}
      ${size * 0.53},${size * 0.30}
      ${size * 0.5},${size * 0.33}
      ${size * 0.47},${size * 0.30}
    " fill="#B45309"/>
  </g>

  <!-- App Title Arabic "Nota" Stylized text at bottom -->
  <text x="${size * 0.5}" y="${size * 0.90}" font-family="Arial, sans-serif" font-size="${size * 0.09}" font-weight="900" fill="#FEF3C7" text-anchor="middle" letter-spacing="${size * 0.01}">NOTA</text>
</svg>
`;

async function generateIcons() {
  const sizes = [
    { size: 192, filename: 'icon-192.png' },
    { size: 512, filename: 'icon-512.png' },
    { size: 180, filename: 'apple-touch-icon.png' },
  ];

  for (const { size, filename } of sizes) {
    const svgBuffer = Buffer.from(createSvg(size));
    const outputPath = path.join(publicDir, filename);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`Generated: ${filename} (${size}x${size})`);
  }

  // Also save icon.svg for modern browsers
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), createSvg(512));
  console.log('Generated: icon.svg');
}

generateIcons().catch(console.error);
