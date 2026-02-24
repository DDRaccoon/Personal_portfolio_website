# SiCheng Chen - Technical Artist Portfolio

> 现代技术美术师作品集网站，展示技术美术、环境艺术和程序化工具开发的专业能力

## 🎯 项目定位

一个专为技术美术师设计的现代化作品集网站，采用数据驱动架构，通过配置即可管理作品内容，无需修改UI代码。

**Live Demo**: [https://chenta-portfolio.vercel.app](https://chenta-portfolio.vercel.app) *(部署后更新链接)*

## ✨ 核心亮点

### 🎨 技术美术专业展示
- **实时渲染技术**: 基于Three.js和React Three Fiber的3D交互背景
- **着色器开发**: 自定义GLSL着色器实现动态视觉效果
- **性能优化**: 智能降级策略，确保移动端流畅体验

### 🚀 现代技术栈
- **Next.js 16.1.6**: 支持App Router和服务器端渲染
- **React 19.2.3**: 最新React特性，优化渲染性能
- **TypeScript**: 完整的类型安全保证
- **Tailwind CSS**: 原子化CSS框架，响应式设计

### 🎵 交互体验
- **音乐律动系统**: 背景元素随音乐节奏动态变化
- **流畅动画**: GSAP驱动的平滑过渡效果
- **无障碍访问**: 完整的键盘导航和屏幕阅读器支持

## 📁 作品结构说明

### 数据驱动架构
```
src/content/works/
├── work-schema.ts          # 作品数据模型定义
├── index.ts               # 作品数据加载器
└── *.json                 # 单个作品数据文件
```

### 作品数据字段
```typescript
interface WorkData {
  id: string;              // 唯一标识
  slug: string;            // URL友好标识
  title: string;           // 作品标题
  summary: string;         // 简短描述
  cover: string;           // 封面图片路径
  featured: boolean;       // 是否在首页展示
  order: number;           // 展示顺序
  tags: string[];          // 技术标签
  year: number;            // 完成年份
  layout: 'single' | 'twoColumn' | 'masonry';  // 布局模式
  blocks: WorkBlock[];     // 内容块数组
}
```

## 🛠️ 如何新增作品

### 步骤1：创建作品数据文件
在 `src/content/works/` 目录下创建新的JSON文件：

```json
{
  "id": "work-001",
  "slug": "my-awesome-project",
  "title": "我的优秀项目",
  "summary": "项目简短描述...",
  "cover": "/images/works/my-project-cover.jpg",
  "featured": true,
  "order": 1,
  "tags": ["Unreal Engine", "Houdini", "Python"],
  "year": 2024,
  "layout": "twoColumn",
  "blocks": [
    {
      "type": "RichText",
      "id": "intro",
      "content": "## 项目概述..."
    }
  ]
}
```

### 步骤2：添加资源文件
将相关资源（图片、视频）放置在 `public/` 目录下对应位置。

### 步骤3：自动展示
作品将自动出现在首页和作品列表中，无需修改任何React组件代码。

## 🏃 本地运行

### 环境要求
- Node.js 18+ 
- npm 或 yarn

### 安装依赖
```bash
npm install
# 或
yarn install
```

### 开发模式
```bash
npm run dev
# 或
yarn dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看效果。

### 生产构建
```bash
npm run build
npm run start
```

## 🚀 Vercel部署指南

### 步骤1：准备GitHub仓库
1. 将代码推送到GitHub仓库
2. 确保仓库包含完整的项目文件

### 步骤2：连接Vercel
1. 访问 [Vercel官网](https://vercel.com)
2. 使用GitHub账号登录
3. 点击"New Project"

### 步骤3：导入项目
1. 选择你的GitHub仓库 `DDRaccoon/Personal_portfolio_website`
2. 配置项目设置：
   - **Framework Preset**: Next.js
   - **Root Directory**: 保持默认
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### 步骤4：环境变量（可选）
如果项目需要环境变量，在Vercel控制台添加：
- 进入项目设置 → Environment Variables
- 添加必要的环境变量

### 步骤5：部署
1. 点击"Deploy"按钮
2. Vercel将自动构建并部署
3. 获得可分享的URL（如：`https://chenta-portfolio.vercel.app`）

### 自动部署
- 每次推送到 `main` 分支时自动重新部署
- 支持预览部署（Pull Request自动部署）
- 自定义域名支持

## 📊 性能策略

### 资源优化
- **图片懒加载**: 封面图片优先加载，详情图片延迟加载
- **视频动态导入**: 视频资源仅在打开详情时加载
- **代码分割**: 自动代码分割，按需加载

### 构建优化
- **Tree Shaking**: 自动移除未使用代码
- **Bundle分析**: 支持构建包大小分析
- **压缩优化**: 自动资源压缩和优化

## 🎨 自定义布局

### 支持布局模式
1. **single**: 单列布局，适合叙事性内容
2. **twoColumn**: 双列布局，左侧可设置sticky元素
3. **masonry**: 瀑布流布局，适合图片展示

### Block类型支持
- **RichText**: Markdown格式文本内容
- **Image**: 单张图片展示
- **Gallery**: 图片画廊（支持2/3/4列）
- **Video**: 视频播放器（mp4格式）
- **Meta**: 项目信息卡片（角色、工具、职责等）
- **Spacer/Divider**: 间距和分隔线

## 🔧 开发指南

### 项目结构
```
src/
├── app/                 # Next.js App Router
├── components/          # React组件
│   ├── ui/             # 基础UI组件
│   └── works/          # 作品相关组件
├── content/            # 内容数据
├── contexts/           # React Context
└── hooks/              # 自定义Hooks
```

### 代码规范
- **TypeScript**: 所有文件使用TypeScript
- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化
- **Husky**: Git提交前检查

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进这个项目。

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

**技术栈**: Next.js • React • TypeScript • Three.js • Tailwind CSS • GSAP  
**作者**: SiCheng Chen  
**联系**: chensicheng0608@outlook.com