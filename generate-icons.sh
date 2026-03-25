#!/bin/bash

# NutriTrack PWA图标生成脚本
# 需要安装: ImageMagick (convert命令)

echo "开始生成NutriTrack PWA图标..."

# 创建icons目录
mkdir -p icons

# 图标尺寸列表
sizes=(72 96 128 144 152 192 384 512)

# 检查是否安装了ImageMagick
if ! command -v convert &> /dev/null; then
    echo "错误: 需要安装ImageMagick"
    echo "macOS: brew install imagemagick"
    echo "Ubuntu/Debian: sudo apt-get install imagemagick"
    echo "Windows: 下载 https://imagemagick.org/script/download.php"
    exit 1
fi

# 为每个尺寸生成图标
for size in "${sizes[@]}"; do
    echo "生成 ${size}x${size} 图标..."

    # 创建临时SVG文件
    cat > "temp_icon_${size}.svg" << EOF
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <!-- 圆角矩形背景 -->
  <rect x="0" y="0" width="512" height="512" rx="112" ry="112" fill="url(#gradient)"/>

  <!-- 渐变定义 -->
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#16a34a"/>
      <stop offset="100%" stop-color="#22c55e"/>
    </linearGradient>
  </defs>

  <!-- 秤图标 -->
  <g transform="translate(128, 128) scale(1.5)">
    <!-- 秤底座 -->
    <rect x="80" y="160" width="96" height="16" rx="8" fill="#ffffff" opacity="0.9"/>

    <!-- 秤支柱 -->
    <rect x="124" y="96" width="8" height="64" rx="4" fill="#ffffff" opacity="0.9"/>
    <rect x="132" y="96" width="8" height="64" rx="4" fill="#ffffff" opacity="0.9"/>

    <!-- 秤盘 -->
    <ellipse cx="128" cy="64" rx="48" ry="16" fill="#ffffff" opacity="0.9"/>

    <!-- 苹果 -->
    <g transform="translate(40, 40) scale(0.8)">
      <!-- 苹果主体 -->
      <path d="M 64,32 C 56,16 40,8 24,8 8,8 0,16 0,32 0,48 8,64 24,64 40,64 56,56 64,40 Z" fill="#ef4444"/>
      <!-- 苹果茎 -->
      <rect x="30" y="0" width="4" height="12" rx="2" fill="#a85507"/>
      <!-- 苹果叶 -->
      <ellipse cx="38" cy="6" rx="8" ry="4" fill="#22c55e" transform="rotate(-30 38 6)"/>
    </g>

    <!-- 香蕉 -->
    <g transform="translate(160, 40) scale(0.8)">
      <!-- 香蕉主体 -->
      <path d="M 0,32 C 8,16 24,8 40,8 56,8 64,16 64,32 64,48 56,64 40,64 24,64 8,56 0,40 Z" fill="#fbbf24"/>
      <!-- 香蕉柄 -->
      <rect x="28" y="0" width="4" height="12" rx="2" fill="#a85507"/>
    </g>
  </g>

  <!-- 应用名称缩写 -->
  <text x="256" y="440" text-anchor="middle" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="#ffffff">NT</text>
</svg>
EOF

    # 将SVG转换为PNG
    convert "temp_icon_${size}.svg" -resize "${size}x${size}" "icons/icon-${size}x${size}.png"

    # 删除临时SVG文件
    rm "temp_icon_${size}.svg"

    echo "  ✓ 已生成 icons/icon-${size}x${size}.png"
done

# 创建iOS专用的apple-touch-icon
echo "生成iOS专用图标..."

# 生成180x180图标 (iPhone)
convert icons/icon-192x192.png -resize 180x180 icons/apple-touch-icon.png

# 生成180x180图标 (iPhone) 带白色背景
convert icons/icon-192x192.png -resize 180x180 -background white -gravity center -extent 180x180 icons/apple-touch-icon-180x180.png

# 生成152x152图标 (iPad)
convert icons/icon-152x152.png icons/apple-touch-icon-152x152.png

# 生成167x167图标 (iPad Pro)
convert icons/icon-192x192.png -resize 167x167 icons/apple-touch-icon-167x167.png

echo ""
echo "图标生成完成!"
echo "所有图标已保存到 icons/ 目录"
echo ""
echo "需要的图标文件:"
echo "- icon-72x72.png      (Android)"
echo "- icon-96x96.png      (Android)"
echo "- icon-128x128.png    (Android)"
echo "- icon-144x144.png    (Android)"
echo "- icon-152x152.png    (iPad)"
echo "- icon-192x192.png    (Android/Chrome)"
echo "- icon-384x384.png    (Android)"
echo "- icon-512x512.png    (Android/Chrome)"
echo "- apple-touch-icon.png (iPhone)"
echo "- apple-touch-icon-180x180.png (iPhone retina)"
echo "- apple-touch-icon-152x152.png (iPad)"
echo "- apple-touch-icon-167x167.png (iPad Pro)"