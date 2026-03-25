#!/bin/bash

# 简单图标复制脚本
# 如果没有ImageMagick或Node.js，使用此脚本复制SVG作为占位符

echo "创建图标占位符..."

# 创建icons目录
mkdir -p icons

# 尺寸列表
sizes=(72 96 128 144 152 192 384 512)

# 复制SVG到各个尺寸
for size in "${sizes[@]}"; do
  # 创建简单SVG图标
  cat > "icons/icon-${size}x${size}.svg" << EOF
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#16a34a" rx="112" ry="112"/>
  <text x="256" y="256" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif" font-size="180" font-weight="bold" fill="white">NT</text>
</svg>
EOF
  echo "创建 icons/icon-${size}x${size}.svg"
done

# 创建iOS图标链接
cp icons/icon-192x192.svg icons/apple-touch-icon.svg
cp icons/icon-180x180.svg icons/apple-touch-icon-180x180.svg 2>/dev/null || cp icons/icon-192x192.svg icons/apple-touch-icon-180x180.svg
cp icons/icon-152x152.svg icons/apple-touch-icon-152x152.svg
cp icons/icon-167x167.svg icons/apple-touch-icon-167x167.svg 2>/dev/null || cp icons/icon-192x192.svg icons/apple-touch-icon-167x167.svg

echo ""
echo "注意: 这些是SVG格式的占位符图标。"
echo "对于生产环境，建议使用PNG格式图标。"
echo "运行 generate-icons.sh 或 generate-icons-node.js 生成PNG图标。"