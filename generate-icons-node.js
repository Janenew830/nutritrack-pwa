#!/usr/bin/env node

/**
 * NutriTrack PWA图标生成脚本 (Node.js版本)
 * 不需要ImageMagick，使用Canvas库
 */

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// 检查canvas是否已安装
try {
  require.resolve('canvas');
} catch (e) {
  console.error('错误: 需要安装canvas库');
  console.error('运行: npm install canvas');
  process.exit(1);
}

console.log('开始生成NutriTrack PWA图标 (Node.js版本)...');

// 创建icons目录
const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// 图标尺寸列表
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

/**
 * 生成单个图标
 */
function generateIcon(size) {
  console.log(`生成 ${size}x${size} 图标...`);

  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // 圆角矩形背景
  const radius = size * 0.22;
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, radius);

  // 渐变填充
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#16a34a');
  gradient.addColorStop(1, '#22c55e');
  ctx.fillStyle = gradient;
  ctx.fill();

  // 计算缩放比例（相对于512x512设计）
  const scale = size / 512;

  // 秤底座
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.beginPath();
  ctx.roundRect(80 * scale, 160 * scale, 96 * scale, 16 * scale, 8 * scale);
  ctx.fill();

  // 秤支柱
  ctx.beginPath();
  ctx.roundRect(124 * scale, 96 * scale, 8 * scale, 64 * scale, 4 * scale);
  ctx.fill();

  ctx.beginPath();
  ctx.roundRect(132 * scale, 96 * scale, 8 * scale, 64 * scale, 4 * scale);
  ctx.fill();

  // 秤盘
  ctx.beginPath();
  ctx.ellipse(128 * scale, 64 * scale, 48 * scale, 16 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  // 苹果
  ctx.save();
  ctx.translate(40 * scale, 40 * scale);
  ctx.scale(0.8 * scale, 0.8 * scale);

  // 苹果主体
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.moveTo(64, 32);
  ctx.bezierCurveTo(56, 16, 40, 8, 24, 8);
  ctx.bezierCurveTo(8, 8, 0, 16, 0, 32);
  ctx.bezierCurveTo(0, 48, 8, 64, 24, 64);
  ctx.bezierCurveTo(40, 64, 56, 56, 64, 40);
  ctx.closePath();
  ctx.fill();

  // 苹果茎
  ctx.fillStyle = '#a85507';
  ctx.beginPath();
  ctx.roundRect(30, 0, 4, 12, 2);
  ctx.fill();

  // 苹果叶
  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.ellipse(38, 6, 8, 4, -Math.PI / 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // 香蕉
  ctx.save();
  ctx.translate(160 * scale, 40 * scale);
  ctx.scale(0.8 * scale, 0.8 * scale);

  // 香蕉主体
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.moveTo(0, 32);
  ctx.bezierCurveTo(8, 16, 24, 8, 40, 8);
  ctx.bezierCurveTo(56, 8, 64, 16, 64, 32);
  ctx.bezierCurveTo(64, 48, 56, 64, 40, 64);
  ctx.bezierCurveTo(24, 64, 8, 56, 0, 40);
  ctx.closePath();
  ctx.fill();

  // 香蕉柄
  ctx.fillStyle = '#a85507';
  ctx.beginPath();
  ctx.roundRect(28, 0, 4, 12, 2);
  ctx.fill();

  ctx.restore();

  // 应用名称缩写
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${48 * scale}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('NT', size / 2, 440 * scale);

  // 保存为PNG
  const buffer = canvas.toBuffer('image/png');
  const filename = path.join(iconsDir, `icon-${size}x${size}.png`);
  fs.writeFileSync(filename, buffer);

  console.log(`  ✓ 已生成 icons/icon-${size}x${size}.png`);
  return buffer;
}

/**
 * 生成iOS专用图标
 */
function generateAppleIcons() {
  console.log('\n生成iOS专用图标...');

  // 读取192x192图标作为源
  const source192 = path.join(iconsDir, 'icon-192x192.png');
  if (!fs.existsSync(source192)) {
    console.error('错误: 需要先生成192x192图标');
    return;
  }

  const sourceBuffer = fs.readFileSync(source192);

  // 生成不同尺寸的苹果图标
  const appleSizes = [
    { size: 180, name: 'apple-touch-icon-180x180.png' },
    { size: 152, name: 'apple-touch-icon-152x152.png' },
    { size: 167, name: 'apple-touch-icon-167x167.png' }
  ];

  for (const { size, name } of appleSizes) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // 创建白色背景
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // 加载源图像
    const img = new (require('canvas').Image)();
    img.onload = () => {
      // 计算居中位置
      const x = (size - img.width) / 2;
      const y = (size - img.height) / 2;
      ctx.drawImage(img, x, y, img.width, img.height);

      // 保存
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(path.join(iconsDir, name), buffer);
      console.log(`  ✓ 已生成 icons/${name}`);
    };
    img.onerror = (err) => {
      console.error(`生成 ${name} 失败:`, err);
    };

    // 调整源图像大小
    const sourceCanvas = createCanvas(size, size);
    const sourceCtx = sourceCanvas.getContext('2d');
    const sourceImg = new (require('canvas').Image)();
    sourceImg.onload = () => {
      sourceCtx.drawImage(sourceImg, 0, 0, size, size);
      img.src = sourceCanvas.toBuffer('image/png');
    };
    sourceImg.src = sourceBuffer;
  }

  // 创建默认apple-touch-icon (180x180)
  const defaultAppleIcon = path.join(iconsDir, 'apple-touch-icon-180x180.png');
  const appleIcon = path.join(iconsDir, 'apple-touch-icon.png');
  if (fs.existsSync(defaultAppleIcon)) {
    fs.copyFileSync(defaultAppleIcon, appleIcon);
    console.log(`  ✓ 已生成 icons/apple-touch-icon.png`);
  }
}

/**
 * 主函数
 */
async function main() {
  try {
    // 生成所有尺寸图标
    for (const size of sizes) {
      generateIcon(size);
    }

    // 生成iOS图标
    generateAppleIcons();

    console.log('\n图标生成完成!');
    console.log('所有图标已保存到 icons/ 目录');
    console.log('\n需要的图标文件:');
    console.log('- icon-72x72.png      (Android)');
    console.log('- icon-96x96.png      (Android)');
    console.log('- icon-128x128.png    (Android)');
    console.log('- icon-144x144.png    (Android)');
    console.log('- icon-152x152.png    (iPad)');
    console.log('- icon-192x192.png    (Android/Chrome)');
    console.log('- icon-384x384.png    (Android)');
    console.log('- icon-512x512.png    (Android/Chrome)');
    console.log('- apple-touch-icon.png (iPhone)');
    console.log('- apple-touch-icon-180x180.png (iPhone retina)');
    console.log('- apple-touch-icon-152x152.png (iPad)');
    console.log('- apple-touch-icon-167x167.png (iPad Pro)');

    console.log('\n注意: 如果图标显示不正常，可以手动调整设计或使用在线工具生成。');

  } catch (error) {
    console.error('生成图标时出错:', error);
    process.exit(1);
  }
}

// 运行主函数
main();