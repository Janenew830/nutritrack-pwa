#!/bin/bash

# NutriTrack 小花图标生成脚本
# 将所有 SVG 图标更新为绿色小花设计

echo "正在生成绿色小花图标..."

# 图标尺寸列表
sizes=(72 96 128 144 152 192 384 512)

for size in "${sizes[@]}"; do
  echo "生成 ${size}x${size} 图标..."

  # 简化版小花图标（小尺寸）
  if [ $size -le 96 ]; then
    # 小尺寸：只显示花心和花瓣
    cat > "icons/icon-${size}x${size}.svg" << EOF
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#16a34a" rx="112" ry="112"/>
  <g transform="translate(256, 256)">
    <circle cx="0" cy="0" r="60" fill="#fef3c7"/>
    <circle cx="0" cy="0" r="45" fill="#fde68a"/>
    <circle cx="0" cy="-50" rx="30" ry="45" fill="#86efac"/>
    <circle cx="45" cy="20" rx="30" ry="45" fill="#4ade80"/>
    <circle cx="-45" cy="20" rx="30" ry="45" fill="#22c55e"/>
  </g>
</svg>
EOF
  elif [ $size -le 152 ]; then
    # 中等尺寸：5 花瓣
    cat > "icons/icon-${size}x${size}.svg" << EOF
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#16a34a" rx="112" ry="112"/>
  <g transform="translate(256, 240)">
    <ellipse cx="0" cy="-50" rx="35" ry="55" fill="#86efac"/>
    <ellipse cx="47" cy="-20" rx="35" ry="55" fill="#4ade80" transform="rotate(72 47 -20)"/>
    <ellipse cx="29" cy="45" rx="35" ry="55" fill="#22c55e" transform="rotate(144 29 45)"/>
    <ellipse cx="-29" cy="45" rx="35" ry="55" fill="#4ade80" transform="rotate(216 -29 45)"/>
    <ellipse cx="-47" cy="-20" rx="35" ry="55" fill="#86efac" transform="rotate(288 -47 -20)"/>
    <circle cx="0" cy="0" r="40" fill="#fef3c7"/>
    <circle cx="0" cy="0" r="32" fill="#fde68a"/>
  </g>
</svg>
EOF
  else
    # 大尺寸：完整小花设计
    cat > "icons/icon-${size}x${size}.svg" << EOF
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#16a34a" rx="112" ry="112"/>
  <g transform="translate(256, 230)">
    <ellipse cx="0" cy="-50" rx="35" ry="55" fill="#86efac"/>
    <ellipse cx="47" cy="-20" rx="35" ry="55" fill="#4ade80" transform="rotate(72 47 -20)"/>
    <ellipse cx="29" cy="45" rx="35" ry="55" fill="#22c55e" transform="rotate(144 29 45)"/>
    <ellipse cx="-29" cy="45" rx="35" ry="55" fill="#4ade80" transform="rotate(216 -29 45)"/>
    <ellipse cx="-47" cy="-20" rx="35" ry="55" fill="#86efac" transform="rotate(288 -47 -20)"/>
    <circle cx="0" cy="0" r="40" fill="#fef3c7"/>
    <circle cx="0" cy="0" r="32" fill="#fde68a"/>
    <circle cx="-10" cy="-8" r="6" fill="#fbbf24" opacity="0.6"/>
    <circle cx="12" cy="-5" r="5" fill="#fbbf24" opacity="0.6"/>
    <circle cx="0" cy="12" r="5" fill="#fbbf24" opacity="0.6"/>
  </g>
  <g transform="translate(256, 320)">
    <rect x="-4" y="0" width="8" height="80" rx="4" fill="#15803d"/>
    <ellipse cx="-25" cy="30" rx="30" ry="18" fill="#22c55e" transform="rotate(-20 -25 30)"/>
    <ellipse cx="25" cy="30" rx="30" ry="18" fill="#4ade80" transform="rotate(20 25 30)"/>
  </g>
</svg>
EOF
  fi

  echo "  ✓ icons/icon-${size}x${size}.svg"
done

# iOS 图标
echo "生成 iOS 图标..."

cat > "icons/apple-touch-icon.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#16a34a" rx="112" ry="112"/>
  <g transform="translate(256, 240)">
    <ellipse cx="0" cy="-50" rx="35" ry="55" fill="#86efac"/>
    <ellipse cx="47" cy="-20" rx="35" ry="55" fill="#4ade80" transform="rotate(72 47 -20)"/>
    <ellipse cx="29" cy="45" rx="35" ry="55" fill="#22c55e" transform="rotate(144 29 45)"/>
    <ellipse cx="-29" cy="45" rx="35" ry="55" fill="#4ade80" transform="rotate(216 -29 45)"/>
    <ellipse cx="-47" cy="-20" rx="35" ry="55" fill="#86efac" transform="rotate(288 -47 -20)"/>
    <circle cx="0" cy="0" r="40" fill="#fef3c7"/>
    <circle cx="0" cy="0" r="32" fill="#fde68a"/>
  </g>
</svg>
EOF
cp icons/apple-touch-icon.svg icons/apple-touch-icon-180x180.svg

cat > "icons/apple-touch-icon-152x152.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="152" height="152" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#16a34a" rx="112" ry="112"/>
  <g transform="translate(256, 240)">
    <ellipse cx="0" cy="-50" rx="35" ry="55" fill="#86efac"/>
    <ellipse cx="47" cy="-20" rx="35" ry="55" fill="#4ade80" transform="rotate(72 47 -20)"/>
    <ellipse cx="29" cy="45" rx="35" ry="55" fill="#22c55e" transform="rotate(144 29 45)"/>
    <ellipse cx="-29" cy="45" rx="35" ry="55" fill="#4ade80" transform="rotate(216 -29 45)"/>
    <ellipse cx="-47" cy="-20" rx="35" ry="55" fill="#86efac" transform="rotate(288 -47 -20)"/>
    <circle cx="0" cy="0" r="40" fill="#fef3c7"/>
    <circle cx="0" cy="0" r="32" fill="#fde68a"/>
  </g>
</svg>
EOF

cat > "icons/apple-touch-icon-167x167.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="167" height="167" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#16a34a" rx="112" ry="112"/>
  <g transform="translate(256, 240)">
    <ellipse cx="0" cy="-50" rx="35" ry="55" fill="#86efac"/>
    <ellipse cx="47" cy="-20" rx="35" ry="55" fill="#4ade80" transform="rotate(72 47 -20)"/>
    <ellipse cx="29" cy="45" rx="35" ry="55" fill="#22c55e" transform="rotate(144 29 45)"/>
    <ellipse cx="-29" cy="45" rx="35" ry="55" fill="#4ade80" transform="rotate(216 -29 45)"/>
    <ellipse cx="-47" cy="-20" rx="35" ry="55" fill="#86efac" transform="rotate(288 -47 -20)"/>
    <circle cx="0" cy="0" r="40" fill="#fef3c7"/>
    <circle cx="0" cy="0" r="32" fill="#fde68a"/>
  </g>
</svg>
EOF

echo ""
echo "✅ 绿色小花图标生成完成！"
echo ""
echo "图标文件已保存到 icons/ 目录"
echo "包含：72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512"
echo "iOS: apple-touch-icon, apple-touch-icon-180x180, apple-touch-icon-152x152, apple-touch-icon-167x167"