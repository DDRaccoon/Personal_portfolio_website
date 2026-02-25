# SiCheng Chen — Technical Artist Portfolio

> [中文文档 / Chinese README](./README.zh-CN.md)

A personal portfolio website for **Technical Artist / Environment Art**, featuring music-reactive geometry backgrounds, bilingual (EN/ZH) support, and a built-in block editor.

## Highlights

- **Music-Reactive Geometry Background** — Two asymmetric line-based spheres that breathe, rotate, and glow in response to background audio (Web Audio API + 2D Canvas).
- **Bilingual (EN / ZH)** — One-click language toggle; all UI text, intro, skills, and tab labels are localized.
- **Block-Based Work Editor** — Notion-style editor with RichText, Image, Gallery, Video, Meta, Callout, Grid, TwoColumn, Divider, and Spacer blocks.
- **Work Categories** — Full Game Project Experience · Game Demos · Tools / Features · Shader / VFX / Model.
- **Zero-Backend** — Works are persisted in `localStorage`; no database or API key required.
- **Responsive & Performant** — Tailwind CSS 4, lazy media loading, FPS-aware visual degradation.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Styling | Tailwind CSS 4 |
| Visual FX | 2D Canvas, Web Audio API |
| Content | Markdown (`react-markdown`) + Block editor |
| Storage | Browser `localStorage` |

## Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** (or yarn / pnpm)

### Install & Run

```bash
# Clone the repo
git clone https://github.com/DDRaccoon/Personal_portfolio_website.git
cd Personal_portfolio_website

# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Production build
npm run build
npm start
```

No environment variables are required.

## Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── page.js                 # Home — intro + work grid
│   ├── layout.js               # Root layout (LanguageProvider)
│   ├── works/[slug]/page.js    # Work detail page
│   ├── editor/new/page.js      # Create work
│   └── editor/[id]/page.js     # Edit work
├── components/
│   ├── i18n/                   # LanguageProvider (EN/ZH toggle)
│   ├── product/                # IntroSection, WorksSection, HeaderMiniPlayer
│   ├── visual/                 # GeometryRenderer, AudioAnalyser, ParallaxController
│   └── works/                  # WorkRenderer, WorksTabs, block components
├── content/
│   ├── copy/siteCopy.js        # Bilingual UI copy
│   └── works/work-schema.ts    # Work data type definitions
├── constants/
│   └── workCategories.js       # Category IDs & labels
└── lib/
    └── worksStore.js           # localStorage CRUD
```

## Adding Works

### Via Built-in Editor

1. Click the **"+"** card in any category tab.
2. Fill in title, summary, cover, category, tags, and year.
3. Add content blocks (Text, Image, Gallery, Video, Meta, etc.).
4. Save — the work appears instantly.

### Work Data Schema

```jsonc
{
  "id": "unique-id",
  "slug": "url-slug",
  "category": "full-game",       // "demos" | "tools" | "shader"
  "title_en": "English Title",
  "title_zh": "中文标题",          // optional
  "summary_en": "Brief description",
  "summary_zh": "简要描述",        // optional
  "cover": "/images/cover.jpg",
  "tags": ["UE5", "Blueprints"],
  "year": 2025,
  "blocks": [
    { "id": "b1", "type": "RichText", "content": "Markdown..." },
    { "id": "b2", "type": "Image", "src": "/images/shot.jpg", "alt": "Screenshot" },
    { "id": "b3", "type": "Meta", "role": "Tech Artist", "engine": "UE5", "tools": ["Houdini"], "responsibilities": ["..."] }
  ]
}
```

## Visual System

| Feature | Details |
|---|---|
| **Geometry Spheres** | Two asymmetric spheres with per-sphere point count, line count, and center-line config |
| **Music Reactivity** | Bass energy drives breathing amplitude, ring glow, and rotation boost |
| **Parallax** | Mouse + scroll parallax with clamped mid-layer movement |
| **Performance Guard** | Auto-degrades on low FPS or mobile devices |

## Design Tokens

| Token | Value |
|---|---|
| Background | `#000000` |
| Accent | `#FF7A18` |
| Text | `rgba(255,255,255,0.78)` |
| Border | `rgba(255,255,255,0.08)` |
| Font | Inter / system fallback |

## Deployment

### Vercel (Recommended)

1. Push to GitHub.
2. Import the repo in [Vercel](https://vercel.com).
3. Vercel auto-detects Next.js — done.

### Static Export / Self-Hosted

```bash
npm run build
npm start        # Starts Node server on port 3000
```

## Browser Support

Chrome 90+ · Firefox 88+ · Safari 14+ · Edge 90+

## License

This project is private and proprietary.

## Contact

**SiCheng Chen** — chensicheng0608@outlook.com

---

*Built for Technical Artists, by a Technical Artist.*