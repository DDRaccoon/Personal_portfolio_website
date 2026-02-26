# 陈思成 — 技术美术作品集

> [English README](./README.md)

技术美术 / 场景方向的个人作品集网站，具备音乐律动几何背景、中英双语支持，以及内置的块编辑器。

## 亮点

- **音乐律动几何背景** — 两个非对称线条球体随背景音乐呼吸、旋转、发光（Web Audio API + 2D Canvas）。
- **中英双语** — 一键切换语言；所有界面文字、自我介绍、技能标签、分栏标签均已本地化。
- **块编辑器** — 类 Notion 编辑器，支持 RichText、Image、Gallery、Video、Meta、Callout、Grid、TwoColumn、Divider、Spacer 等块类型。
- **作品分类** — 完整游戏项目经验 · 游戏 Demo · 工具 / 功能 · 着色器 / 特效 / 模型。
- **零后端** — 作品数据存储在浏览器 `localStorage`，无需数据库或 API Key。
- **响应式 & 高性能** — Tailwind CSS 4、媒体懒加载、FPS 感知自动降级。

## 技术栈

| 层级 | 技术 |
|---|---|
| 框架 | Next.js 16（App Router） |
| UI | React 19 |
| 样式 | Tailwind CSS 4 |
| 视觉特效 | 2D Canvas、Web Audio API |
| 内容 | Markdown（`react-markdown`）+ 块编辑器 |
| 存储 | 浏览器 `localStorage` |

## 快速开始

### 前置要求

- **Node.js** 18+
- **npm**（或 yarn / pnpm）

### 安装 & 运行

```bash
# 克隆仓库
git clone https://github.com/DDRaccoon/Personal_portfolio_website.git
cd Personal_portfolio_website

# 安装依赖
npm install

# 启动开发服务器（http://localhost:3000）
npm run dev

# 生产构建
npm run build
npm start
```

## CMS 配置（Supabase）

项目现已使用 **Supabase 作为真实 CMS 后端** 存储作品数据。

### 1）创建 Supabase 项目

在 Supabase 控制台创建项目，并打开 **SQL Editor**。

### 2）创建 `works` 数据表

执行以下 SQL：

```sql
create table if not exists public.works (
  id text primary key,
  slug text unique not null,
  category text not null,
  title_en text not null,
  title_zh text default '',
  summary_en text not null,
  summary_zh text default '',
  cover text not null,
  tags jsonb not null default '[]'::jsonb,
  year integer not null,
  blocks jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists works_category_idx on public.works (category);
create index if not exists works_updated_at_idx on public.works (updated_at desc);
```

### 3）配置环境变量

复制 `.env.example` 为 `.env.local`，并填写：

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CMS_ADMIN_PASSWORD`
- `SUPABASE_WORKS_TABLE`（可选，默认 `works`）

> `SUPABASE_SERVICE_ROLE_KEY` 必须保密，不能暴露到前端。

### 4）编辑权限机制

- 访客可公开读取作品。
- 顶部锁按钮会把密码提交到 `/api/admin/session`。
- 服务端校验成功后会写入 HTTP-only 的 `cms_admin` Cookie。
- 只有携带该 Cookie 时，`/api/works*` 写接口才允许创建/更新/删除。

## 项目结构

```
src/
├── app/                        # Next.js App Router 页面
│   ├── page.js                 # 首页 — 自我介绍 + 作品列表
│   ├── layout.js               # 根布局（LanguageProvider）
│   ├── works/[slug]/page.js    # 作品详情页
│   ├── editor/new/page.js      # 创建作品
│   └── editor/[id]/page.js     # 编辑作品
├── components/
│   ├── i18n/                   # 语言提供器（中/英切换）
│   ├── product/                # IntroSection、WorksSection、HeaderMiniPlayer
│   ├── visual/                 # GeometryRenderer、AudioAnalyser、ParallaxController
│   └── works/                  # WorkRenderer、WorksTabs、块组件
├── content/
│   ├── copy/siteCopy.js        # 中英双语文案
│   └── works/work-schema.ts    # 作品数据类型定义
├── constants/
│   └── workCategories.js       # 分类 ID 和标签
└── lib/
    └── worksStore.js           # localStorage 增删改查
```

## 添加作品

### 通过内置编辑器

1. 点击任意分类下的 **"+"** 卡片。
2. 填写标题、摘要、封面、分类、标签和年份。
3. 添加内容块（Text、Image、Gallery、Video、Meta 等）。
4. 保存 — 作品立即显示。

### 作品数据结构

```jsonc
{
  "id": "唯一ID",
  "slug": "url-slug",
  "category": "full-game",       // "demos" | "tools" | "shader"
  "title_en": "English Title",
  "title_zh": "中文标题",          // 可选
  "summary_en": "Brief description",
  "summary_zh": "简要描述",        // 可选
  "cover": "/images/cover.jpg",
  "tags": ["UE5", "Blueprints"],
  "year": 2025,
  "blocks": [
    { "id": "b1", "type": "RichText", "content": "Markdown..." },
    { "id": "b2", "type": "Image", "src": "/images/shot.jpg", "alt": "截图" },
    { "id": "b3", "type": "Meta", "role": "技术美术", "engine": "UE5", "tools": ["Houdini"], "responsibilities": ["..."] }
  ]
}
```

## 视觉系统

| 功能 | 说明 |
|---|---|
| **几何球体** | 两个非对称球体，各自独立配置点数、线数、中心线 |
| **音乐律动** | 低频能量驱动呼吸幅度、光环亮度和旋转加速 |
| **视差效果** | 鼠标 + 滚动视差，中层运动幅度受限防止出画 |
| **性能守卫** | 低 FPS 或移动端自动降级 |

## 设计令牌

| 令牌 | 值 |
|---|---|
| 背景色 | `#000000` |
| 强调色 | `#FF7A18` |
| 文字色 | `rgba(255,255,255,0.78)` |
| 边框色 | `rgba(255,255,255,0.08)` |
| 字体 | Inter / 系统回退字体 |

## 部署

### Vercel（推荐）

1. 推送代码到 GitHub。
2. 在 [Vercel](https://vercel.com) 中导入仓库。
3. 在 Vercel 项目设置里配置环境变量。
4. Vercel 自动识别 Next.js 并完成部署。

### 自托管

```bash
npm run build
npm start        # 在端口 3000 启动 Node 服务器
```

## 浏览器支持

Chrome 90+ · Firefox 88+ · Safari 14+ · Edge 90+

## 许可证

本项目为私有项目，保留所有权利。

## 联系方式

**陈思成** — chensicheng0608@outlook.com

---

*为技术美术师打造，由技术美术师构建。*
