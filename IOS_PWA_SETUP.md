# iOS PWA 部署指南

本指南介绍如何将NutriTrack PWA应用部署到iOS设备上。

## 1. 必要条件

### 1.1 服务器要求
- HTTPS连接（iOS要求PWA必须通过HTTPS访问）
- 正确的MIME类型配置
- 支持跨域请求（如果需要访问外部API）

### 1.2 文件结构
```
/
├── index.html          # 主应用文件
├── manifest.json       # Web应用清单
├── service-worker.js   # Service Worker文件
├── icons/              # 图标目录
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   ├── icon-512x512.png
│   ├── apple-touch-icon.png
│   ├── apple-touch-icon-180x180.png
│   ├── apple-touch-icon-152x152.png
│   └── apple-touch-icon-167x167.png
└── generate-icons.sh   # 图标生成脚本
```

## 2. iOS特定配置

### 2.1 HTML头部配置
index.html需要包含以下iOS特定meta标签：

```html
<!-- iOS Meta Tags -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="NutriTrack">

<!-- iOS图标 -->
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<link rel="apple-touch-icon" sizes="180x180" href="icons/apple-touch-icon-180x180.png">
<link rel="apple-touch-icon" sizes="152x152" href="icons/apple-touch-icon-152x152.png">
<link rel="apple-touch-icon" sizes="167x167" href="icons/apple-touch-icon-167x167.png">

<!-- 启动画面（Splash Screen） -->
<!-- iOS 12+ -->
<link rel="apple-touch-startup-image" href="icons/apple-touch-icon.png" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)">
<!-- 更多启动画面配置可以根据需要添加 -->

<!-- PWA Manifest -->
<link rel="manifest" href="manifest.json">

<!-- 主题颜色 -->
<meta name="theme-color" content="#16a34a">
<meta name="msapplication-TileColor" content="#16a34a">
```

### 2.2 iOS启动画面建议
iOS PWA启动画面是自动生成的，基于：
1. 页面的背景色（body背景色）
2. 应用图标
3. 状态栏样式

建议确保：
- body元素有明确的背景色
- 应用有适当的加载状态

## 3. 图标生成

### 3.1 使用脚本生成（推荐）
如果系统安装了ImageMagick：

```bash
# 给脚本添加执行权限
chmod +x generate-icons.sh

# 运行图标生成脚本
./generate-icons.sh
```

### 3.2 手动生成图标
如果没有ImageMagick，可以使用以下方法：

1. **在线图标生成工具**：
   - https://realfavicongenerator.net/
   - https://www.favicon-generator.org/

2. **使用设计工具**：
   - 使用Photoshop、GIMP等工具
   - 导出512x512 PNG作为源文件
   - 使用在线工具生成各种尺寸

### 3.3 图标要求
- **格式**: PNG（推荐）或SVG
- **背景**: 透明或与主题色匹配
- **尺寸**: 至少512x512像素
- **设计**: 简洁明了，适合小尺寸显示

## 4. Service Worker配置

### 4.1 注册Service Worker
确保在页面加载时注册service worker：

```javascript
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/service-worker.js')
      .then(function(registration) {
        console.log('Service Worker 注册成功:', registration.scope);
      })
      .catch(function(error) {
        console.log('Service Worker 注册失败:', error);
      });
  });
}
```

### 4.2 iOS上的Service Worker注意事项
- iOS 11.3+ 支持Service Worker
- iOS上的Service Worker有一些限制：
  - 不支持后台同步（Background Sync）
  - 推送通知有限制
  - 缓存策略可能需要调整

## 5. 部署到服务器

### 5.1 服务器配置
确保服务器正确配置：

```nginx
# Nginx配置示例
server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    root /var/www/nutritrack;
    index index.html;

    # 正确的MIME类型
    location ~* \.(html)$ {
        add_header Content-Type "text/html; charset=UTF-8";
    }

    location ~* \.(json)$ {
        add_header Content-Type "application/json; charset=UTF-8";
    }

    location ~* \.(js)$ {
        add_header Content-Type "application/javascript; charset=UTF-8";
    }

    # Service Worker需要从根目录加载
    location = /service-worker.js {
        add_header Content-Type "application/javascript; charset=UTF-8";
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # 缓存静态资源
    location ~* \.(png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 5.2 本地测试
在部署前可以在本地测试：

```bash
# 使用Python启动本地服务器
python3 -m http.server 8080

# 或使用Node.js
npx serve .
```

## 6. 在iOS上安装

### 6.1 安装步骤
1. 使用Safari浏览器访问应用的HTTPS地址
2. 点击分享按钮（底部的分享图标）
3. 滚动找到"添加到主屏幕"选项
4. 点击"添加"
5. 应用图标将出现在主屏幕上

### 6.2 测试PWA功能
安装后测试以下功能：
- ✅ 离线访问（通过Service Worker）
- ✅ 全屏模式（standalone display）
- ✅ 状态栏样式
- ✅ 启动画面
- ✅ 图标显示

## 7. 故障排除

### 7.1 常见问题

**问题1**: 无法添加到主屏幕
- **原因**: 可能缺少manifest.json或HTTPS
- **解决**: 检查manifest.json是否可访问，确保使用HTTPS

**问题2**: 图标显示不正确
- **原因**: 图标路径错误或尺寸不合适
- **解决**: 检查图标路径，确保有各种尺寸的图标

**问题3**: 无法离线使用
- **原因**: Service Worker未正确注册或缓存失败
- **解决**: 检查浏览器控制台错误，验证service-worker.js文件

**问题4**: 启动画面显示白屏
- **原因**: 页面加载时间过长或资源加载失败
- **解决**: 优化页面加载性能，确保关键资源被缓存

### 7.2 调试工具
- Safari开发者工具（需在macOS上启用）
- Chrome开发者工具（模拟iOS）
- https://www.pwabuilder.com/ （PWA测试工具）

## 8. 高级功能

### 8.1 推送通知（iOS限制）
iOS对Web推送通知支持有限，考虑：
- 使用第三方推送服务
- 或专注于应用内通知

### 8.2 后台同步
iOS不支持后台同步，需要：
- 使用定期同步（Periodic Sync，如果支持）
- 或在前台执行数据同步

### 8.3 文件系统访问
使用File System Access API（注意iOS支持情况）

## 9. 更新策略

### 9.1 应用更新
当更新PWA时：
1. 更新service-worker.js版本号
2. 更新缓存的资源列表
3. 用户下次访问时会自动更新

### 9.2 版本管理
在service-worker.js中使用版本控制：
```javascript
const CACHE_VERSION = 'v2';
const CACHE_NAME = `nutritrack-${CACHE_VERSION}`;
```

## 10. 参考资料

1. [Apple Developer Documentation - Configuring Web Applications](https://developer.apple.com/documentation/webkit/promoting_apps_with_smart_app_banners)
2. [MDN Web Docs - Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
3. [Web.dev - PWA](https://web.dev/progressive-web-apps/)
4. [PWA Builder](https://www.pwabuilder.com/)

## 11. 支持

如有问题，请检查：
1. Safari版本是否支持PWA功能（iOS 11.3+）
2. 是否通过HTTPS访问
3. 控制台是否有错误信息

祝您部署顺利！