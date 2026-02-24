# SiCheng Chen | Technical Artist Portfolio

A professional portfolio website designed for Technical Artists, featuring strong visual expression, technical credibility, and excellent reading experience.

## Live Demo

[View Live Portfolio](https://your-portfolio-url.com)

## Highlights

- **Work-Focused Design**: Quick access to categorized portfolio works without traditional landing page clutter
- **Professional Aesthetics**: Minimalist black (#000) + orange (#FF7A18) color scheme with restrained visual effects
- **Content Management System**: Built-in Notion-like editor for creating and managing portfolio works
- **Local Storage**: Works persist in browser localStorage - no database required
- **Responsive Design**: Optimized for all devices with excellent reading experience
- **Performance Optimized**: Lazy loading for media, efficient rendering

## Project Structure

### Core Pages
- **`/`** - Home with 4 category tabs + work grid
- **`/editor/new`** - Create new portfolio work
- **`/works/:slug`** - Work detail page

### Work Categories
1. **Full Game Project Experience** - Complete game projects
2. **Game Demos** - Technical demos and prototypes
3. **Tools / Features** - Custom tools and features
4. **Shader / VFX** - Shader programming and visual effects

### Technical Stack
- **Framework**: Next.js 16.1.6 (App Router)
- **UI Library**: React 19.2.3
- **Styling**: Tailwind CSS 4.0
- **TypeScript**: Full type safety
- **Content**: Markdown + Block-based editor

## Work Structure

Each work contains:

### Basic Information
- **Title** (English) - Required
- **Summary** (English) - Required  
- **Cover Image** - Required
- **Category** - One of 4 fixed categories
- **Tags** - Optional
- **Year** - Optional

### Content Blocks
- **Text** - Markdown content
- **Image** - Single image with caption
- **Gallery** - Multi-image grid (2-4 columns)
- **Video** - Video player (muted + loop by default)
- **Meta** - Structured information (role/engine/tools/responsibilities/links)
- **Divider** - Horizontal separator
- **Spacer** - Vertical spacing control

## How to Add New Works

### Method 1: Using Built-in Editor
1. Navigate to `/editor/new?cat=<category>`
2. Fill in basic information (Title, Summary, Cover, Category)
3. Add content blocks using the editor
4. Click "Save" to persist to localStorage
5. Work appears in the corresponding category tab

### Method 2: Manual Data Entry (Advanced)
1. Open browser DevTools → Application → Local Storage
2. Find `works-storage` key
3. Add new work object following the schema
4. Refresh page to see changes

### Work Data Schema
```javascript
{
  id: "work-unique-id",
  slug: "work-slug-for-url",
  category: "full-game", // | "demos" | "tools" | "shader"
  title_en: "Work Title",
  summary_en: "Brief description",
  cover: "/images/cover.jpg",
  tags: ["Unreal Engine 5", "Blueprints", "C++"],
  year: 2024,
  blocks: [
    {
      id: "block-id",
      type: "RichText", // | "Image" | "Gallery" | "Video" | "Meta" | "Divider" | "Spacer"
      content: "Markdown content..."
    }
  ],
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

## Deployment

### Vercel (Recommended)
1. Push code to GitHub repository
2. Import project in [Vercel Dashboard](https://vercel.com/dashboard)
3. Vercel automatically detects Next.js and deploys
4. Custom domain can be configured in project settings

### Manual Deployment
```bash
# Build project
npm run build

# Start production server
npm start
```

### Environment Variables
No environment variables required for basic functionality.

## Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Project Architecture
```
src/
├── app/                    # Next.js App Router
│   ├── page.js            # Home page
│   ├── layout.js          # Root layout
│   ├── globals.css        # Global styles + Design Tokens
│   ├── editor/           # Editor pages
│   └── work/             # Work detail pages
├── components/            # React components
│   ├── home/             # Home page components
│   ├── works/            # Work-related components
│   ├── editor/           # Editor components
│   └── ui/               # Reusable UI components
├── lib/                  # Utility libraries
│   └── worksStore.js     # localStorage management
└── content/              # Content schemas
    └── works/            # Work data models
```

## Design System

### Color Palette
- **Background**: #000000 (Pure black)
- **Text Strong**: rgba(255, 255, 255, 0.92)
- **Text**: rgba(255, 255, 255, 0.78)
- **Text Muted**: rgba(255, 255, 255, 0.55)
- **Border**: rgba(255, 255, 255, 0.08)
- **Accent Orange**: #FF7A18

### Typography
- **Font Family**: Inter (system fonts fallback)
- **Font Weights**: 400, 500, 600, 700
- **Line Heights**: 1.25, 1.5, 1.75

### Spacing System
- **Base Unit**: 8px
- **Scale**: 8px, 12px, 16px, 24px, 32px, 48px

### Icon Sizes
- **Small**: 16px
- **Medium**: 20px (default)
- **Large**: 24px

## Features

### Current Features (P0)
- ✅ Work-focused home page with 4 category tabs
- ✅ Work cards with cover/title/summary
- ✅ Empty state with "+" for creating works
- ✅ Notion-like block editor
- ✅ Local storage for work persistence
- ✅ Work detail pages with block rendering
- ✅ Unified design tokens system
- ✅ Responsive design
- ✅ Background music with autoplay attempt
- ✅ Single background component

### Planned Features (P1)
- Export/Import JSON for backup
- Media lazy loading optimization
- Enhanced music control
- Performance monitoring

### Future Enhancements (P2)
- Detail page overlay
- FPS-based background degradation
- Gallery lightbox
- Multi-language support (EN/CN)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Lighthouse Score**: 90+

## License

This project is private and proprietary.

## Contact

For technical questions or collaboration opportunities, please contact through the portfolio website.

---

**Built with ❤️ for Technical Artists by Technical Artists**