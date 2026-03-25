# NutriTrack PWA 部署指南

本指南介绍如何将NutriTrack PWA应用部署到生产环境。

## 1. 文件准备

### 1.1 生成图标文件
运行图标生成脚本（需要ImageMagick）：

```bash
chmod +x generate-icons.sh
./generate-icons.sh
```

如果没有ImageMagick，可以使用以下替代方法：

1. **使用在线工具**：
   - 访问 https://realfavicongenerator.net/
   - 上传512x512像素的图标
   - 下载生成的图标包，解压到`icons/`目录

2. **手动创建**：
   - 创建以下尺寸的PNG图标：
     - 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512
   - 保存到`icons/`目录，命名如`icon-72x72.png`

### 1.2 文件结构
确保项目目录包含以下文件：
```
nutritrack/
├── index.html
├── manifest.json
├── service-worker.js
├── generate-icons.sh
├── IOS_PWA_SETUP.md
├── DEPLOYMENT.md
└── icons/
    ├── icon-72x72.png
    ├── icon-96x96.png
    ├── icon-128x128.png
    ├── icon-144x144.png
    ├── icon-152x152.png
    ├── icon-192x192.png
    ├── icon-384x384.png
    ├── icon-512x512.png
    ├── apple-touch-icon.png
    ├── apple-touch-icon-180x180.png
    ├── apple-touch-icon-152x152.png
    └── apple-touch-icon-167x167.png
```

## 2. 服务器配置

### 2.1 HTTPS要求
**重要**: iOS要求PWA必须通过HTTPS访问。

获取SSL证书的选项：
1. **Let's Encrypt**（免费）: https://letsencrypt.org/
2. **云服务商**: AWS Certificate Manager, Cloudflare SSL等
3. **自签名证书**（仅测试用）

### 2.2 服务器配置示例

#### Nginx配置
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL配置
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # 根目录
    root /var/www/nutritrack;
    index index.html;

    # Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # 安全头
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";

    # MIME类型
    location ~* \.(html)$ {
        add_header Content-Type "text/html; charset=UTF-8";
        try_files $uri $uri/ =404;
    }

    location ~* \.(json)$ {
        add_header Content-Type "application/json; charset=UTF-8";
        try_files $uri $uri/ =404;
    }

    location ~* \.(js)$ {
        add_header Content-Type "application/javascript; charset=UTF-8";
        try_files $uri $uri/ =404;
    }

    # Service Worker特殊处理
    location = /service-worker.js {
        add_header Content-Type "application/javascript; charset=UTF-8";
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
        try_files $uri =404;
    }

    # 静态资源缓存
    location ~* \.(png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # 单页应用路由
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Apache配置
```apache
<VirtualHost *:80>
    ServerName your-domain.com
    Redirect permanent / https://your-domain.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName your-domain.com

    SSLEngine on
    SSLCertificateFile /path/to/certificate.crt
    SSLCertificateKeyFile /path/to/private.key

    DocumentRoot /var/www/nutritrack

    <Directory /var/www/nutritrack>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    # MIME类型
    AddType application/javascript .js
    AddType application/manifest+json .json

    # 缓存控制
    <FilesMatch "\.(ico|png|jpg|jpeg|gif|svg|woff|woff2)$">
        Header set Cache-Control "max-age=31536000, public, immutable"
    </FilesMatch>

    <Files "service-worker.js">
        Header set Cache-Control "no-cache, no-store, must-revalidate"
        Header set Pragma "no-cache"
        Header set Expires "0"
    </Files>

    # 单页应用路由
    FallbackResource /index.html
</VirtualHost>
```

## 3. 部署步骤

### 3.1 上传文件
将项目文件上传到服务器：

```bash
# 使用SCP上传
scp -r nutritrack/* user@your-server:/var/www/nutritrack/

# 或使用SFTP/FTP客户端
```

### 3.2 设置权限
```bash
ssh user@your-server

# 进入项目目录
cd /var/www/nutritrack

# 设置文件权限
chmod -R 755 .
chown -R www-data:www-data .  # 对于Apache
# 或
chown -R nginx:nginx .        # 对于Nginx
```

### 3.3 重启服务器
```bash
# Nginx
sudo systemctl restart nginx

# Apache
sudo systemctl restart apache2
```

## 4. 域名配置

### 4.1 购买域名
推荐域名注册商：
- Namecheap
- GoDaddy
- Google Domains

### 4.2 DNS配置
添加A记录指向服务器IP：
```
your-domain.com  A  192.0.2.1
www.your-domain.com  CNAME  your-domain.com
```

## 5. 测试部署

### 5.1 基本测试
1. 访问 https://your-domain.com
2. 检查控制台是否有错误
3. 使用浏览器开发者工具检查：
   - Service Worker是否注册
   - Manifest是否加载
   - 图标是否显示

### 5.2 PWA测试工具
1. **Lighthouse**（Chrome开发者工具）
   - 打开Chrome开发者工具 → Lighthouse
   - 运行PWA审计

2. **在线测试工具**：
   - https://www.pwabuilder.com/
   - https://web.dev/measure/

### 5.3 跨设备测试
测试不同设备和浏览器：
- iPhone/iPad Safari
- Android Chrome
- 桌面浏览器

## 6. 持续维护

### 6.1 更新应用
更新步骤：
1. 上传新版本文件
2. 更新service-worker.js中的缓存版本
3. 用户访问时会自动更新

### 6.2 监控
监控建议：
1. **服务器监控**: CPU、内存、磁盘使用率
2. **应用监控**: 错误率、加载时间
3. **用户分析**: 使用Google Analytics或类似工具

### 6.3 备份
定期备份：
```bash
# 备份整个应用目录
tar -czf nutritrack-backup-$(date +%Y%m%d).tar.gz /var/www/nutritrack

# 备份数据库（如果有）
mysqldump -u username -p database_name > backup-$(date +%Y%m%d).sql
```

## 7. 故障排除

### 7.1 常见问题

**问题**: Service Worker不注册
- **检查**: 控制台错误，HTTPS，MIME类型
- **解决**: 确保service-worker.js可通过HTTPS访问，MIME类型正确

**问题**: 图标不显示
- **检查**: 图标文件路径，文件权限
- **解决**: 检查manifest.json中的图标路径，确保文件存在

**问题**: 无法添加到主屏幕
- **检查**: Manifest配置，HTTPS
- **解决**: 使用PWA测试工具检查manifest

**问题**: 离线功能不工作
- **检查**: Service Worker缓存，网络请求
- **解决**: 检查Service Worker是否缓存了必要资源

### 7.2 调试工具
- Chrome开发者工具 → Application → Service Workers
- Chrome开发者工具 → Application → Manifest
- Safari开发者工具（需在macOS上启用）

## 8. 性能优化

### 8.1 图片优化
- 使用WebP格式（如果浏览器支持）
- 压缩PNG/JPG图片
- 使用适当尺寸的图标

### 8.2 代码优化
- 压缩HTML/CSS/JS
- 使用代码分割（如果应用复杂）
- 减少第三方依赖

### 8.3 缓存策略
- Service Worker缓存关键资源
- HTTP缓存静态资源
- 使用CDN加速

## 9. 安全建议

### 9.1 基本安全
- 始终使用HTTPS
- 设置安全HTTP头
- 定期更新服务器软件

### 9.2 数据安全
- 本地存储敏感数据要加密
- 避免在URL中暴露敏感信息
- 验证用户输入

## 10. 扩展功能

### 10.1 添加后端API
如果需要服务器端功能：
1. 创建REST API
2. 在PWA中调用API
3. 处理离线数据同步

### 10.2 推送通知
- 实现Web Push API
- 处理用户权限
- 发送相关通知

### 10.3 高级PWA功能
- 后台同步
- 定期同步
- 文件系统访问

## 11. 支持与社区

### 11.1 资源
- [MDN Web Docs - PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web.dev - PWA](https://web.dev/progressive-web-apps/)
- [PWA Builder](https://www.pwabuilder.com/)

### 11.2 社区
- Stack Overflow (#pwa标签)
- Reddit r/PWA
- Twitter @PWABuilder

## 12. 下一步

部署完成后：
1. 测试所有功能
2. 收集用户反馈
3. 根据反馈迭代改进
4. 考虑发布到应用商店（使用PWABuilder或类似工具）

祝您部署顺利！