# 英语教育家长端 H5 应用

基于 Next.js 14 + Tailwind CSS 构建的移动端家长查询系统。

## 🚀 技术栈

- **框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS + 自定义移动端组件
- **状态管理**: Zustand + TanStack Query
- **类型检查**: TypeScript
- **图标**: Lucide React
- **动画**: Framer Motion

## 📱 功能特性

### 核心功能

- 🔍 **学生查询** - 根据姓名查询孩子学习情况
- 📊 **学习进度** - 查看当前级别和完成进度
- ⏰ **课时余额** - 实时显示剩余课时
- 📚 **课程体系** - Pre-A 到 D 级完整课程展示
- 📖 **故事内容** - 每个故事的学习大纲和内容

### 移动端优化

- 📱 响应式设计，完美适配各种屏幕
- 👆 触摸友好的交互设计
- ⚡ 优化的加载性能和缓存策略
- 🎨 现代化的 UI 设计语言
- 🔄 智能的错误处理和重试机制

### 微信生态支持

- 🌐 微信浏览器兼容性优化
- 📲 支持微信公众号集成
- 🔗 可转换为微信小程序

## 🛠️ 开发环境

### 环境要求

- Node.js 18+
- pnpm 8+

### 安装依赖

```bash
cd english-education-h5
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:3001

### 构建生产版本

```bash
pnpm build
pnpm start
```

## 📁 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   └── providers.tsx      # 状态管理提供者
├── components/            # 组件库
│   ├── ui/               # 基础UI组件
│   │   ├── Button.tsx    # 按钮组件
│   │   ├── Card.tsx      # 卡片组件
│   │   ├── Input.tsx     # 输入框组件
│   │   └── LoadingSpinner.tsx # 加载组件
│   ├── layout/           # 布局组件
│   │   └── Header.tsx    # 头部组件
│   ├── student/          # 学生相关组件
│   │   └── StudentSearch.tsx # 学生搜索
│   └── course/           # 课程相关组件
│       └── CourseOverview.tsx # 课程概览
└── lib/                  # 工具库
    ├── api.ts           # API客户端
    └── utils.ts         # 工具函数
```

## 🎨 设计系统

### 颜色规范

- **主色调**: Blue (primary-500: #3b82f6)
- **成功色**: Green (success-500: #10b981)
- **警告色**: Yellow (warning-500: #f59e0b)
- **错误色**: Red (error-500: #ef4444)

### 组件规范

- **按钮**: 最小触摸区域 44px
- **卡片**: 圆角 16px，柔和阴影
- **间距**: 基于 4px 网格系统
- **字体**: 系统字体栈，优化中文显示

## 🔧 配置说明

### 环境变量

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://english-education-api.test/api
NEXT_PUBLIC_APP_NAME=英语教育家长端
```

### API 集成

项目已配置好与后端 Laravel API 的集成：

- 自动错误处理和重试
- 移动端网络优化
- 智能缓存策略

## 📱 移动端优化

### 性能优化

- **代码分割**: 自动按路由分割
- **图片优化**: WebP/AVIF 格式支持
- **缓存策略**: 多层缓存机制
- **预加载**: 关键资源预加载

### 用户体验

- **触摸反馈**: 所有交互元素都有触摸反馈
- **加载状态**: 完善的加载和错误状态
- **离线支持**: 基础离线功能（可扩展）
- **安全区域**: 适配刘海屏和底部指示器

## 🌐 微信集成

### 公众号集成

1. 配置微信 JS-SDK
2. 设置菜单跳转到 H5 页面
3. 优化微信浏览器兼容性

### 小程序转换

可使用 Taro 等工具转换为原生小程序，或在小程序中通过 webview 组件加载。

## 🚀 部署建议

### Vercel (推荐)

```bash
pnpm build
# 部署到 Vercel
```

### 自建服务器

```bash
pnpm build
pnpm start
```

### Docker 部署

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
EXPOSE 3001
CMD ["pnpm", "start"]
```

## 📈 性能监控

建议集成以下监控工具：

- **Core Web Vitals**: 监控页面性能
- **错误追踪**: Sentry 等错误监控
- **用户行为**: 用户行为分析

## 🤝 开发规范

### 代码风格

- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 组件使用 PascalCase 命名
- 文件使用 kebab-case 命名

### Git 提交规范

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建过程或辅助工具的变动
```

## 📞 技术支持

如有问题，请联系开发团队或查看相关文档。
