# NutriTrack - 营养体重管理PWA应用

一个现代化的渐进式Web应用（PWA），用于追踪营养摄入、体重变化和身体围度，提供AI营养建议。

## 功能特性

### 核心功能
1. **饮食记录** - 记录每日三餐和零食
2. **营养分析** - 自动计算卡路里、蛋白质、碳水、脂肪摄入
3. **体重追踪** - 记录体重变化趋势
4. **身体围度** - 记录胸围、腰围、臀围等身体测量数据
5. **AI营养助手** - 获取个性化饮食建议（需要配置API密钥）

### 新增功能
- ✅ **自定义食物库** - 添加标准食物库中没有的食物
- ✅ **完整iOS PWA支持** - 支持添加到iOS主屏幕
- ✅ **离线功能** - Service Worker提供离线访问
- ✅ **响应式设计** - 适配手机、平板和桌面

## 快速开始

### 1. 本地运行
```bash
# 克隆或下载项目文件
# 进入项目目录
cd nutritrack

# 使用Python启动本地服务器
python3 -m http.server 8080

# 或使用Node.js
npx serve .
```

然后在浏览器中访问：http://localhost:8080

### 2. 生成图标

#### 选项1: 使用ImageMagick脚本 (推荐)
```bash
# 安装ImageMagick（如果尚未安装）
# macOS: brew install imagemagick
# Ubuntu: sudo apt-get install imagemagick

# 运行图标生成脚本
chmod +x generate-icons.sh
./generate-icons.sh
```

#### 选项2: 使用Node.js脚本
```bash
# 安装Node.js依赖
npm install

# 生成图标
npm run generate-icons
# 或直接运行
node generate-icons-node.js
```

#### 选项3: 使用在线工具
如果没有ImageMagick或Node.js，可以使用在线工具：
1. 访问 https://realfavicongenerator.net/
2. 上传512x512图标
3. 下载生成的图标包到`icons/`目录

#### 选项4: 手动创建
手动创建以下尺寸的PNG图标：
- 72x72, 96x96, 128x128, 144x144
- 152x152, 192x192, 384x384, 512x512
- apple-touch-icon.png (180x180)
- apple-touch-icon-180x180.png
- apple-touch-icon-152x152.png
- apple-touch-icon-167x167.png

保存到`icons/`目录，使用对应的文件名。

### 3. 部署到服务器
详细部署指南请参阅：[DEPLOYMENT.md](DEPLOYMENT.md)

## iOS PWA安装

### 在iOS设备上安装：
1. 使用Safari访问应用的HTTPS地址
2. 点击分享按钮（底部分享图标）
3. 滚动找到"添加到主屏幕"
4. 点击"添加"

### iOS特定配置：
详细iOS配置指南请参阅：[IOS_PWA_SETUP.md](IOS_PWA_SETUP.md)

## 文件结构

```
nutritrack/
├── index.html              # 主应用文件
├── manifest.json           # PWA清单文件
├── service-worker.js       # Service Worker
├── generate-icons.sh       # 图标生成脚本
├── icons/                  # 图标目录
│   ├── icon-72x72.png     # Android小图标
│   ├── icon-192x192.png   # Android/Chrome图标
│   ├── icon-512x512.png   # 大图标
│   └── apple-touch-icon*.png # iOS图标
├── IOS_PWA_SETUP.md       # iOS配置指南
├── DEPLOYMENT.md          # 部署指南
└── README.md              # 本文件
```

## 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **图表**: Chart.js 4.4.0
- **字体**: Google Fonts (Nunito)
- **PWA**: Manifest, Service Worker
- **存储**: localStorage (IndexedDB备用)
- **AI集成**: 支持DeepSeek和AI Gateway API

## 配置AI助手

应用支持两种AI提供商：

### 1. AI Gateway (默认)
1. 获取API密钥
2. 在应用设置中配置

### 2. DeepSeek API
1. 获取DeepSeek API密钥
2. 在应用设置中配置

## 自定义食物功能

### 添加自定义食物：
1. 点击任意餐食的"+"按钮
2. 在食物搜索界面点击"添加自定义食物"
3. 填写食物信息：
   - 名称（必填）
   - 表情符号
   - 类别
   - 营养信息（每100克）

### 使用自定义食物：
- 自定义食物会出现在搜索结果中
- 标记为"(自定义)"以便识别
- 与标准食物使用相同的添加流程

## 浏览器支持

### 完全支持：
- Chrome 54+
- Firefox 63+
- Safari 11.3+ (iOS 11.3+)
- Edge 79+

### 部分支持：
- 旧版Safari (PWA功能有限)

## 开发指南

### 修改应用
1. 编辑`index.html` - 主应用逻辑
2. 更新`manifest.json` - PWA配置
3. 修改`service-worker.js` - 缓存策略

### 添加新功能
1. 在`index.html`中添加相应HTML/CSS/JS
2. 更新Service Worker缓存（如果需要）
3. 测试跨浏览器兼容性

## 故障排除

### 常见问题：

1. **Service Worker不注册**
   - 检查是否通过HTTPS访问
   - 检查控制台错误
   - 验证service-worker.js文件权限

2. **iOS上无法添加到主屏幕**
   - 确保使用HTTPS
   - 检查manifest.json是否正确
   - 验证iOS版本是否支持PWA (iOS 11.3+)

3. **自定义食物不保存**
   - 检查浏览器是否支持localStorage
   - 检查控制台是否有错误
   - 验证食物名称是否填写

### 调试工具：
- Chrome开发者工具 → Application面板
- Safari开发者工具（需在macOS上启用）
- PWA测试工具：https://www.pwabuilder.com/

## 性能优化

### 已实现的优化：
- ✅ Service Worker缓存
- ✅ 响应式图片
- ✅ 代码压缩（通过CDN）
- ✅ 字体预加载

### 建议的进一步优化：
- 添加WebP格式图片支持
- 实现代码分割
- 添加更多离线功能

## 安全考虑

### 已实施：
- localStorage数据存储
- 输入验证
- HTTPS要求（生产环境）

### 建议：
- 添加数据加密选项
- 实施更严格的身份验证（如果需要）
- 定期安全审计

## 许可证

本项目仅供学习和个人使用。如需商业使用，请确保遵守相关法律法规。

## 贡献

欢迎提交Issue和Pull Request：
1. Fork项目
2. 创建功能分支
3. 提交更改
4. 创建Pull Request

## 支持

如有问题：
1. 查看文档
2. 检查控制台错误
3. 提交Issue

## 更新日志

### v1.0.0 (当前)
- 初始发布
- 基本营养追踪功能
- 自定义食物支持
- iOS PWA优化
- 离线功能

---

**注意**: 本应用为PWA（渐进式Web应用），不是原生iOS应用。在iOS上通过Safari添加到主屏幕使用。