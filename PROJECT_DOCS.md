# Chenta Portfolio — 项目技术文档

> **作者**: SiCheng Chen  
> **技术栈**: Next.js 16 + React 19 + Tailwind CSS 4 + Three.js  
> **最后更新**: 2026-02-25

---

## 目录

1. [项目概述](#1-项目概述)
2. [技术栈与依赖](#2-技术栈与依赖)
3. [目录结构](#3-目录结构)
4. [页面路由](#4-页面路由)
5. [核心系统详解](#5-核心系统详解)
   - 5.1 [视觉背景系统 (Visual Shell)](#51-视觉背景系统-visual-shell)
   - 5.2 [音乐系统 (Music System)](#52-音乐系统-music-system)
   - 5.3 [作品集管理系统 (Works System)](#53-作品集管理系统-works-system)
   - 5.4 [作品编辑器 (Work Editor)](#54-作品编辑器-work-editor)
   - 5.5 [作品渲染器 (Work Renderer)](#55-作品渲染器-work-renderer)
6. [组件清单](#6-组件清单)
7. [数据模型](#7-数据模型)
8. [设计系统 (Design Tokens)](#8-设计系统-design-tokens)
9. [开发命令](#9-开发命令)
10. [部署说明](#10-部署说明)

---

## 1. 项目概述

这是一个 **技术美术师 (Technical Artist)** 的个人作品集网站，主打：

- **沉浸式视觉体验**：全屏 2D Canvas 几何背景动画（极光渐变、粒子、山脉、流星、音乐反应圆环）
- **背景音乐系统**：自动播放 + 音频分析驱动视觉
- **作品集 CMS**：基于 localStorage 的完整 CRUD，支持分类标签筛选
- **Block 编辑器**：拖拽排序、内联编辑、自动保存、版本历史
- **高对比暗色主题**：橙色 (#FF7A18) 为强调色，纯黑背景

**目标受众**：游戏行业招聘方、同行技术美术师  
**核心定位**：展示 UE5、Houdini、Shader、工具管线等技术美术作品

---

## 2. 技术栈与依赖

### 核心框架

| 技术 | 版本 | 用途 |
|------|------|------|
| **Next.js** | 16.1.6 | App Router, SSR/SSG, Turbopack |
| **React** | 19.2.3 | UI 组件 |
| **Tailwind CSS** | 4.x | 样式系统 |

### 运行时依赖

| 包名 | 用途 |
|------|------|
| `@hello-pangea/dnd` | 编辑器拖拽排序 |
| `@react-three/fiber` + `@react-three/drei` | Three.js React 绑定 (部分旧组件使用) |
| `three` | 3D 渲染引擎 |
| `gsap` | 动画库 |
| `@react-spring/web` | 弹性动画 |
| `react-markdown` | Markdown 渲染 (作品文字块) |

### 开发依赖

| 包名 | 用途 |
|------|------|
| `@tailwindcss/postcss` | Tailwind PostCSS 插件 |
| `eslint` + `eslint-config-next` | 代码检查 |

---

## 3. 目录结构

```
chenta-portfolio/
├── public/                     # 静态资源 (图片、音频、视频)
│   ├── images/
│   └── audio/
├── src/
│   ├── app/                    # Next.js App Router 页面
│   │   ├── layout.js           # 根布局 (VisualShell 包裹)
│   │   ├── page.js             # 首页
│   │   ├── globals.css         # 全局样式 + CSS 变量
│   │   ├── editor/
│   │   │   ├── new/page.js     # 新建作品页
│   │   │   └── [id]/page.js    # 编辑作品页
│   │   ├── works/
│   │   │   └── [slug]/page.js  # 作品详情页
│   │   └── work/
│   │       └── [slug]/page.js  # 旧路由重定向 → /works/[slug]
│   │
│   ├── components/
│   │   ├── visual/             # 🎨 视觉背景系统
│   │   │   ├── VisualShell.jsx
│   │   │   ├── VisualBackground.jsx
│   │   │   ├── VisualMusicProvider.jsx
│   │   │   ├── GeometryBackgroundCanvas.jsx
│   │   │   ├── GeometryRenderer.js
│   │   │   ├── geometryConfig.js
│   │   │   ├── ParallaxController.js
│   │   │   ├── AudioAnalyser.js
│   │   │   └── PerformanceGuard.js
│   │   │
│   │   ├── product/            # 📄 首页各区域组件
│   │   │   ├── HeaderMiniPlayer.jsx
│   │   │   ├── IntroSection.jsx
│   │   │   └── WorksSection.jsx
│   │   │
│   │   ├── editor/             # ✏️ 编辑器
│   │   │   ├── WorkEditor.jsx  # 主编辑器 (当前使用)
│   │   │   └── Editor.jsx      # 旧编辑器 (废弃)
│   │   │
│   │   ├── works/              # 🖼️ 作品展示组件
│   │   │   ├── WorkRenderer.jsx
│   │   │   ├── WorkDetailLayout.jsx
│   │   │   ├── WorkCard.jsx
│   │   │   ├── WorkOverlay.jsx
│   │   │   ├── WorksGrid.jsx
│   │   │   ├── WorksSection.jsx
│   │   │   ├── WorksTabs.jsx
│   │   │   ├── WorksTabs.css
│   │   │   └── blocks/         # Block 渲染组件
│   │   │       ├── BlockRenderer.jsx   # 统一渲染调度
│   │   │       ├── RichTextBlock.jsx
│   │   │       ├── ImageBlock.jsx
│   │   │       ├── VideoBlock.jsx
│   │   │       ├── GalleryBlock.jsx
│   │   │       ├── MetaBlock.jsx
│   │   │       ├── DividerBlock.jsx
│   │   │       ├── SpacerBlock.jsx
│   │   │       ├── TwoColumnBlock.jsx
│   │   │       ├── GridBlock.jsx
│   │   │       └── CalloutBlock.jsx
│   │   │
│   │   ├── ui/                 # 🧩 通用 UI 组件
│   │   │   ├── GlobalBackground.jsx
│   │   │   ├── Icon.jsx
│   │   │   ├── icons.jsx
│   │   │   ├── IconDemo.jsx
│   │   │   ├── MusicControl.jsx
│   │   │   └── Tabs.jsx
│   │   │
│   │   └── home/               # 🏠 首页子组件
│   │       ├── Header.jsx
│   │       └── Intro.jsx
│   │
│   ├── constants/
│   │   └── workCategories.js   # 作品分类定义
│   │
│   ├── content/
│   │   ├── copy/en.js          # 站点文案 (英文)
│   │   └── works/
│   │       ├── work-schema.ts  # 作品数据类型定义 (TypeScript)
│   │       └── index.ts        # 作品数据兼容层
│   │
│   └── lib/
│       └── worksStore.js       # localStorage CRUD 引擎
│
├── package.json
├── next.config.mjs
├── eslint.config.mjs
├── postcss.config.mjs
└── jsconfig.json
```

---

## 4. 页面路由

| 路由 | 类型 | 说明 |
|------|------|------|
| `/` | 静态 | 首页 = Header + 个人介绍 + 作品集网格 |
| `/editor/new?cat=xxx` | 静态 | 新建作品编辑器 |
| `/editor/[id]` | 动态 | 编辑已有作品 |
| `/works/[slug]` | 动态 | 作品详情展示页 |
| `/work/[slug]` | 动态 | 旧路由，自动 301 → `/works/[slug]` |

### 页面流程

```
首页 (/)
  ├─ 点击作品卡片 → /works/[slug] (查看详情)
  ├─ 点击「+」按钮 → /editor/new?cat=xxx (新建)
  └─ 作品详情页点击「Edit」→ /editor/[id] (编辑)
```

---

## 5. 核心系统详解

### 5.1 视觉背景系统 (Visual Shell)

**架构**：全局 fixed 2D Canvas，所有页面共享同一背景

```
layout.js
  └── VisualShell
        ├── VisualMusicProvider   (Context: 音乐状态)
        ├── VisualBackground
        │     └── GeometryBackgroundCanvas
        │           └── GeometryRenderer   (核心渲染循环)
        │                 ├── ParallaxController  (鼠标视差)
        │                 ├── AudioAnalyser       (音频频谱)
        │                 └── PerformanceGuard    (FPS 监测)
        └── {children}          (页面内容, z-index: 10)
```

**GeometryRenderer 绘制层级**（从底到顶）：

1. **极光渐变场** — 大面积柔和色彩
2. **山脉轮廓** — 远景低 alpha 线条
3. **粒子点 + 连线** — 几何网格
4. **流星** — 随机发射
5. **音乐反应圆环** — 外环 + 内部几何线
6. **暗角遮罩** — 保护内容区可读性

**关键配置文件**：`geometryConfig.js`，控制所有视觉参数（粒子数量、颜色、半径、音乐反应强度等）

### 5.2 音乐系统 (Music System)

| 组件 | 文件 | 功能 |
|------|------|------|
| `VisualMusicProvider` | `visual/VisualMusicProvider.jsx` | Context Provider，管理 `<audio>` 元素 |
| `AudioAnalyser` | `visual/AudioAnalyser.js` | Web Audio API 分析器，提供频谱数据 |
| `HeaderMiniPlayer` | `product/HeaderMiniPlayer.jsx` | 顶部 sticky 音乐控制条 |

**流程**：
1. `VisualMusicProvider` 渲染 `<audio>` 元素
2. `GeometryBackgroundCanvas` 通过 DOM 查询找到 `<audio>` 并连接 `AudioAnalyser`
3. `GeometryRenderer` 每帧读取频谱数据驱动圆环动画

### 5.3 作品集管理系统 (Works System)

**数据存储**：`localStorage` 键 `"technical-artist-works"`

**核心模块**：`lib/worksStore.js`

| 函数 | 说明 |
|------|------|
| `getAllWorks()` | 获取所有作品 |
| `getWorkById(id)` | 按 ID 查询 |
| `getWorkBySlug(slug)` | 按 slug 查询 |
| `getWorksByCategory(cat)` | 按分类筛选 |
| `createWork(data)` | 创建新作品，自动生成 id/slug |
| `updateWork(id, updates)` | 更新作品 |
| `deleteWork(id)` | 删除作品 |
| `exportWorks()` / `importWorks()` | 导入导出 JSON |

**作品分类** (`constants/workCategories.js`)：

| ID | 标签 |
|----|------|
| `full-game` | Full Game Project Experience |
| `demos` | Game Demos |
| `tools` | Tools / Features |
| `shader` | Shader / VFX |

**首页展示流程**：

```
WorksSection (product/)
  ├── WorksTabs        ← 几何风格分类标签
  └── WorksGrid        ← 作品卡片网格
        └── WorkCard   ← 单个作品卡片 (封面 + 标题 + 标签)
```

### 5.4 作品编辑器 (Work Editor)

**文件**：`components/editor/WorkEditor.jsx`（~770 行）

**5 种 Block 类型**：

| 类型 | 说明 | 编辑方式 |
|------|------|----------|
| **Title** | 作品标题 | 内联输入，28px 字号 |
| **Description** | 描述文字 | 自动扩展 textarea，16px |
| **Text** | 正文 (Markdown) | 自动扩展 textarea，支持左/中/右对齐 |
| **Image** | 图片 | 文件上传 (PNG/JPG/GIF) 或粘贴 URL，可加 caption |
| **Video** | 视频 | 文件上传或粘贴 URL (YouTube/Vimeo)，可加 caption |

**核心功能**：

- **拖拽排序**：基于 `@hello-pangea/dnd`，拖拽手柄在 hover 时显示
- **Block 宽度**：每个 block 可选 100% 或 50% 宽度
- **文本对齐**：Text block 支持左/中/右对齐
- **自动保存**：编辑模式下 3 秒 debounce 自动写入 localStorage
- **离开警告**：`beforeunload` 事件阻止未保存离开
- **版本历史**：每次自动保存创建 snapshot，最多 20 个版本，可一键恢复
- **Block 工具栏**：hover 显示 — 拖拽手柄 + 宽度切换 + 删除

**编辑器架构**：

```
WorkEditor
  ├── Project Info section (title, summary, cover, category, year, tags)
  ├── Content Blocks section
  │     ├── DragDropContext → Droppable → Draggable[]
  │     │     └── 每个 block:
  │     │           ├── Hover Toolbar (DragHandle + WidthSelector + Delete)
  │     │           └── BlockEditor (按类型分派)
  │     │                 ├── TitleBlockEditor
  │     │                 ├── DescriptionBlockEditor
  │     │                 ├── TextBlockEditor (+ AlignSelector)
  │     │                 ├── ImageBlockEditor (file upload + URL)
  │     │                 └── VideoBlockEditor (file upload + URL + embed)
  │     └── AddBlockPicker (弹出式 block 选择器)
  ├── VersionPanel (版本历史面板)
  └── Actions (Cancel + Save)
```

### 5.5 作品渲染器 (Work Renderer)

**渲染链**：

```
WorkRenderer.jsx
  └── renderBlock() (from BlockRenderer.jsx)
        ├── TitleBlock        → <h1> 28px
        ├── DescriptionBlock  → <p> 16px
        ├── TextRendererBlock → RichTextBlock (Markdown) + 对齐
        ├── ImageBlock        → <img> 圆角 + caption
        ├── VideoRendererBlock→ <video> 或 YouTube/Vimeo <iframe>
        ├── (旧类型向后兼容)
        │   ├── GalleryBlock
        │   ├── MetaBlock
        │   ├── SpacerBlock
        │   ├── DividerBlock
        │   ├── TwoColumnBlock (递归渲染)
        │   ├── GridBlock (递归渲染)
        │   └── CalloutBlock (递归渲染)
        └── 未知类型 → 红色错误提示
```

**Block 宽度控制**：`width: "full" | "half"` → 通过 CSS `max-w-[50%]` 实现

**Markdown 渲染** (`RichTextBlock.jsx`)：
- 使用 `react-markdown`
- 自定义渲染：h1-h3、p、ul/li、strong、code
- 配色：白色标题、白色/80 正文、橙色强调

---

## 6. 组件清单

### 页面组件 (app/)

| 文件 | 组件名 | 说明 |
|------|--------|------|
| `app/page.js` | `HomePage` | 首页 |
| `app/layout.js` | `RootLayout` | 根布局 |
| `app/editor/new/page.js` | `NewWorkPage` | 新建作品 |
| `app/editor/[id]/page.js` | `EditWorkPage` | 编辑作品 |
| `app/works/[slug]/page.js` | `WorkDetailPage` | 作品详情 |
| `app/work/[slug]/page.js` | `LegacyWorkDetailRedirect` | 旧路由重定向 |

### 视觉系统 (visual/)

| 文件 | 说明 |
|------|------|
| `VisualShell.jsx` | 根包装器 (Music Provider + Background) |
| `VisualBackground.jsx` | 背景容器 (渲染 Canvas) |
| `VisualMusicProvider.jsx` | 音乐 Context (autoplay/mute/toggle) |
| `GeometryBackgroundCanvas.jsx` | Canvas 挂载 + 子系统初始化 |
| `GeometryRenderer.js` | 主渲染循环 (~600 行) |
| `geometryConfig.js` | 所有视觉参数配置 |
| `ParallaxController.js` | 鼠标/滚动视差控制 |
| `AudioAnalyser.js` | Web Audio API 频谱分析 |
| `PerformanceGuard.js` | FPS 监测，低性能自动降级 |

### 产品组件 (product/)

| 文件 | 说明 |
|------|------|
| `HeaderMiniPlayer.jsx` | Sticky 顶部栏 (音乐控制 + 导航) |
| `IntroSection.jsx` | 个人介绍区 (头像 + 姓名 + 简介 + 技能 + 社交链接) |
| `WorksSection.jsx` | 作品集区 (标签 + 网格 + 新建按钮) |

### 作品组件 (works/)

| 文件 | 说明 |
|------|------|
| `WorkRenderer.jsx` | 作品内容渲染入口 |
| `WorkDetailLayout.jsx` | 作品页布局 (single/twoColumn/masonry) |
| `WorkCard.jsx` | 作品卡片 (封面 + 标题) |
| `WorkOverlay.jsx` | 作品弹出层 |
| `WorksGrid.jsx` | 作品网格布局 |
| `WorksSection.jsx` | 作品区域封装 |
| `WorksTabs.jsx` + `.css` | 几何风格分类标签 |

### Block 渲染组件 (works/blocks/)

| 文件 | 渲染 Block 类型 |
|------|----------------|
| `BlockRenderer.jsx` | 统一调度 (含宽度控制) |
| `RichTextBlock.jsx` | Text / RichText (Markdown) |
| `ImageBlock.jsx` | Image |
| `VideoBlock.jsx` | Video (本地文件) |
| `GalleryBlock.jsx` | Gallery (多图网格) |
| `MetaBlock.jsx` | Meta (项目信息) |
| `DividerBlock.jsx` | Divider (分割线) |
| `SpacerBlock.jsx` | Spacer (空白间距) |
| `TwoColumnBlock.jsx` | TwoColumn (双列布局) |
| `GridBlock.jsx` | Grid (多列网格) |
| `CalloutBlock.jsx` | Callout (高亮块) |

### UI 组件 (ui/)

| 文件 | 说明 |
|------|------|
| `Icon.jsx` | 图标组件 |
| `icons.jsx` | SVG 图标集 |
| `Tabs.jsx` | 通用标签组件 (旧) |
| `MusicControl.jsx` | 音乐控制 UI |
| `GlobalBackground.jsx` | 全局背景封装 |

---

## 7. 数据模型

### Work (作品)

```javascript
{
  id: "work-1740000000000",       // 唯一 ID
  slug: "my-cool-project",        // URL 友好标识
  category: "full-game",          // 分类 ID
  title_en: "My Cool Project",    // 英文标题
  summary_en: "A brief summary",  // 英文简介
  cover: "/images/works/cover.jpg", // 封面图
  tags: ["UE5", "Houdini"],       // 技术标签
  year: 2026,                     // 年份
  blocks: [ ... ],                // 内容块数组
  title_zh: "",                   // 中文标题 (预留)
  summary_zh: "",                 // 中文简介 (预留)
  createdAt: "2026-01-01T...",    // 创建时间
  updatedAt: "2026-02-25T...",    // 更新时间
}
```

### Block (内容块)

**编辑器当前支持的 5 种 Block**：

```javascript
// Title Block
{ id: "b-xxx", type: "Title", content: "标题文本", width: "full" }

// Description Block
{ id: "b-xxx", type: "Description", content: "描述文本", width: "full" }

// Text Block
{ id: "b-xxx", type: "Text", content: "Markdown 内容", align: "left", width: "full" }

// Image Block
{ id: "b-xxx", type: "Image", src: "/images/xxx.jpg", alt: "描述", caption: "图片说明", width: "full" }

// Video Block
{ id: "b-xxx", type: "Video", src: "https://youtube.com/...", poster: "", caption: "说明", width: "full" }
```

**渲染器向后兼容的旧 Block 类型**：
- `RichText` — 等同于 Text
- `Gallery` — 多图网格 `{ images: [], columns: 3 }`
- `Meta` — 项目信息 `{ role, engine, tools[], responsibilities[], links[] }`
- `Divider` — 分割线
- `Spacer` — 空白 `{ height: 32 }`
- `TwoColumn` — 双列 `{ leftBlocks[], rightBlocks[], ratio }`
- `Grid` — 多列网格 `{ items[], columnsDesktop }`
- `Callout` — 高亮块 `{ contentBlocks[], style, icon }`

### 版本历史

存储在 localStorage 键 `"work-versions-{workId}"`：

```javascript
[
  {
    ts: 1740000000000,           // 时间戳
    data: { /* 完整 form 快照 */ }
  },
  // ... 最多 20 个版本
]
```

---

## 8. 设计系统 (Design Tokens)

定义在 `globals.css` 的 CSS 变量：

| Token | 值 | 说明 |
|-------|----|------|
| `--background` | `#000000` | 页面背景 |
| `--foreground` | `#ededed` | 默认文字色 |
| `--bg-0` | `#000000` | 主背景 |
| `--bg-1` | `#0a0a0a` | 次级背景 |
| `--text-strong` | `rgba(255,255,255,0.92)` | 强调文字 |
| `--text` | `rgba(255,255,255,0.78)` | 正常文字 |
| `--text-muted` | `rgba(255,255,255,0.55)` | 弱化文字 |
| `--border` | `rgba(255,255,255,0.08)` | 边框 |
| `--accent-orange` | `#FF7A18` | 强调色 (橙色) |
| `--radius-card` | `16px` | 卡片圆角 |
| `--radius-button` | `12px` | 按钮圆角 |

### 常用颜色

| 用途 | 颜色 |
|------|------|
| 主强调 | `#FF7A18` (橙色) |
| 强调文字 | `#FFB58C` (浅橙) |
| 边框 hover | `#FF7A18/50` |
| 背景 hover | `white/5` |
| 错误/删除 | `red-400` |
| 成功 | `green-300/500` |

---

## 9. 开发命令

```bash
# 安装依赖
npm install

# 开发服务器 (Turbopack)
npm run dev          # → http://localhost:3000

# 生产构建
npm run build

# 启动生产服务
npm start

# 代码检查
npm run lint
```

---

## 10. 部署说明

### 静态导出

Next.js 16 App Router 支持静态导出，但本项目使用了动态路由 (`[slug]`, `[id]`)，需要服务端渲染。

### 推荐部署平台

- **Vercel** — Next.js 原生支持，零配置
- **Netlify** — 使用 `@netlify/plugin-nextjs`

### 注意事项

1. **数据持久化**：当前使用 localStorage，数据仅存在于用户浏览器。如需跨设备同步，需要接入后端 API 或数据库。
2. **图片存储**：编辑器支持 base64 上传，但 localStorage 有 5-10MB 限制。大量图片建议使用外部图床 URL。
3. **音频文件**：背景音乐文件需要放在 `public/audio/` 目录下。
4. **背景渲染性能**：`PerformanceGuard` 会自动监测 FPS，低性能设备会降级渲染。

---

## 附录：文件大小参考

| 文件 | 大小 | 说明 |
|------|------|------|
| `GeometryRenderer.js` | 21KB | 最大的单文件，核心渲染逻辑 |
| `WorkEditor.jsx` | 27KB | 编辑器主组件 |
| `Editor.jsx` | 14KB | 旧编辑器 (可清理) |
| `WorksSection.jsx` (product) | 6KB | 首页作品集区域 |
| `WorksTabs.css` | 6KB | 几何标签样式 |

---

> **文档到此结束。** 如需了解某个系统的更多细节，可以直接查看对应的源文件。
