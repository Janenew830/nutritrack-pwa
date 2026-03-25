# GitHub Pages 部署指南

GitHub Pages 是一个免费的静态网站托管服务，支持HTTPS，非常适合部署PWA应用。

## 📦 文件准备

您已经获得了完整的NutriTrack PWA文件包：

### 必需文件：
```
nutritrack-pwa/
├── index.html              # 主应用文件
├── manifest.json           # PWA清单
├── service-worker.js       # Service Worker
├── icons/                  # 图标目录（SVG格式）
├── README.md              # 项目说明
└── 其他辅助文件
```

## 🚀 部署步骤

### 步骤1：创建GitHub仓库

1. 登录GitHub账号
2. 点击右上角"+" → "New repository"
3. 填写仓库信息：
   - **Repository name**: `nutritrack-pwa` (或其他名称)
   - **Description**: 可填写"营养体重管理PWA应用"
   - **Public** (公共仓库，免费)
   - **不要**勾选"Initialize this repository with a README"
4. 点击"Create repository"

### 步骤2：上传文件到仓库

#### 方法A：使用Git命令行
```bash
# 克隆仓库
git clone https://github.com/你的用户名/nutritrack-pwa.git
cd nutritrack-pwa

# 复制所有文件到仓库目录
# （将nutritrack-pwa.tar.gz解压后的文件复制到这里）

# 添加所有文件
git add .

# 提交更改
git commit -m "初始提交：NutriTrack PWA应用"

# 推送到GitHub
git push -u origin main
```

#### 方法B：使用GitHub网页上传
1. 在仓库页面点击"Add file" → "Upload files"
2. 拖放所有文件到上传区域
3. 填写提交信息
4. 点击"Commit changes"

### 步骤3：启用GitHub Pages

1. 进入仓库页面
2. 点击"Settings"标签
3. 左侧菜单找到"Pages"
4. 在"Source"部分：
   - 选择"Deploy from a branch"
   - 分支选择`main` (或`master`)
   - 文件夹选择`/(root)`
5. 点击"Save"

### 步骤4：等待部署完成

GitHub Pages通常需要1-2分钟部署。刷新页面后会出现：
```
Your site is live at https://你的用户名.github.io/nutritrack-pwa/
```

## 🔧 重要配置

### 1. 修改manifest.json（如果需要）
GitHub Pages的URL格式为：`https://用户名.github.io/仓库名/`

如果应用无法正确加载，可能需要修改`manifest.json`：
```json
{
  "start_url": "/nutritrack-pwa/",
  // 或使用相对路径
  "start_url": "./",
  // ... 其他配置
}
```

### 2. 验证Service Worker
Service Worker需要从根目录加载，GitHub Pages支持这一点。

### 3. HTTPS自动启用
GitHub Pages自动提供HTTPS证书，符合PWA要求。

## 📱 在iOS上安装

1. 使用Safari访问：
   ```
   https://你的用户名.github.io/nutritrack-pwa/
   ```

2. 点击分享按钮（底部分享图标）

3. 选择"**添加到主屏幕**"

4. 点击"添加"，应用图标将出现在主屏幕

## ⚙️ 自定义域名（可选）

如果需要自定义域名：

1. 在仓库Settings → Pages中：
   - 在"Custom domain"输入您的域名
   - 点击"Save"

2. 在域名DNS设置中添加CNAME记录：
   ```
   您的域名. CNAME 您的用户名.github.io
   ```

3. 等待DNS传播（最多24小时）

## 🔍 测试部署

### 1. 基础测试
- 访问您的GitHub Pages URL
- 检查控制台是否有错误
- 验证Service Worker是否注册

### 2. PWA测试
使用Chrome开发者工具：
1. 打开开发者工具 → Application
2. 检查Manifest和Service Worker
3. 运行Lighthouse审计

### 3. 跨设备测试
- iPhone/iPad Safari
- Android Chrome
- 桌面浏览器

## 🛠️ 故障排除

### 问题1：404错误
- 检查文件是否上传到正确分支
- 确保`index.html`在根目录
- 检查GitHub Pages设置

### 问题2：Service Worker不注册
- 确保通过HTTPS访问
- 检查控制台错误
- 验证`service-worker.js`文件路径正确

### 问题3：图标不显示
- 检查图标文件路径
- 验证`manifest.json`中的图标配置
- 确保图标文件已上传

### 问题4：无法添加到iOS主屏幕
- 确保使用HTTPS
- 检查Manifest是否可访问
- 验证iOS版本 ≥ 11.3

## 📝 更新应用

### 更新步骤：
1. 修改本地文件
2. 推送到GitHub仓库：
   ```bash
   git add .
   git commit -m "更新描述"
   git push
   ```
3. GitHub Pages会自动重新部署
4. 用户下次访问时会看到更新

### 注意：
Service Worker可能需要更新版本号才能触发更新：
```javascript
// 在service-worker.js中
const CACHE_VERSION = 'v2';
const CACHE_NAME = `nutritrack-${CACHE_VERSION}`;
```

## 🌐 GitHub Pages限制

1. **存储空间**：每个仓库1GB
2. **带宽限制**：每月100GB
3. **构建限制**：每小时10次构建
4. **文件大小**：单个文件 ≤ 100MB
5. **Jekyll处理**：默认启用，可能会忽略某些文件

### 禁用Jekyll处理：
在根目录创建`.nojekyll`空文件：
```bash
touch .nojekyll
git add .nojekyll
git commit -m "禁用Jekyll处理"
git push
```

## 📊 监控和统计

### GitHub内置：
- 仓库Settings → Insights → Traffic
- 查看页面访问量

### 第三方统计：
- 添加Google Analytics
- 使用其他网站统计工具

## 🔒 安全注意事项

### 优点：
- GitHub Pages自动提供HTTPS
- 内容公开透明
- 自动备份和版本控制

### 注意：
- 仓库内容公开（除非使用付费私有仓库）
- API密钥不要硬编码在代码中
- 敏感数据不要提交到GitHub

## 📞 支持资源

1. **GitHub Pages文档**：https://docs.github.com/pages
2. **PWA文档**：https://web.dev/progressive-web-apps/
3. **问题反馈**：在GitHub仓库创建Issue

## 🎯 最佳实践

1. **保持简单**：GitHub Pages适合静态内容
2. **定期更新**：保持应用最新
3. **测试充分**：在不同设备上测试
4. **备份数据**：用户数据保存在localStorage中

## ✅ 部署检查清单

- [ ] 所有文件上传到GitHub
- [ ] GitHub Pages已启用
- [ ] 通过HTTPS访问正常
- [ ] Service Worker注册成功
- [ ] Manifest加载正常
- [ ] 图标显示正确
- [ ] 在iOS上可以添加到主屏幕
- [ ] 离线功能正常工作

---

**恭喜！** 您的NutriTrack PWA应用现已通过GitHub Pages部署，可以通过HTTPS访问，并支持安装到iOS主屏幕。