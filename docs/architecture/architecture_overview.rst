Peta Architecture Overview
==================================

This document provides a detailed analysis of the current Peta architecture, including its design decisions, implementation details, and the fundamental issues that prevent it from functioning as a true static site generator.

High-Level Architecture Overview
--------------------------------

::

  ┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
  │   RST Files     │───▶│   Next.js Dev    │───▶│  Browser        │
  │   (_content/)   │    │   Server         │    │  (Client)       │
  └─────────────────┘    └──────────────────┘    └─────────────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │   API Routes     │
                         │ (Server-side)    │
                         └──────────────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │   Static Build   │
                         │  (Broken)        │
                         └──────────────────┘

The current architecture is a hybrid approach that attempts to serve both development and production use cases but fails to achieve true static site generation.

Technology Stack
----------------

Frontend (peta/):
- Next.js 14.2.35 with React 18
- TypeScript components (ContentGrid, Layout, SearchBar, etc.)
- CSS Modules for styling
- Client-side routing with Next.js router

Backend (peta/pages/api/):
- Node.js API routes for dynamic content loading
- Runtime RST processing with WASM bindings
- Content processors in JavaScript
- Search and filtering endpoints

Content Processing (peta/processors/):
- math-renderer.js - LaTeX math processing
- rst-parser/ - Rust WASM for RST parsing
- snippet-resolver.js - Code snippet resolution
- wasm-bindings/ - JavaScript-Rust bridge

Build System (cli/peta):
- Custom bash script that coordinates content processing
- Next.js build command for JavaScript compilation
- Static export with output: 'export'

Current Data Flow (Development Mode)
-------------------------------------

::

  _browser_ → _Next.js pages_ → _API routes_ → _Content processors_ → _File system_

1. /articles/index.tsx loads
2. useEffect(() → fetch('/api/content/articles'))
3. /pages/api/content/articles.ts
4. Content processors read _content/ files
5. Processed JSON returned
6. React components render content

Current Data Flow (Static Build - Broken)
----------------------------------------

::

  _build_process_ → _Next.js static export_ → _Missing API routes_ → _Broken site_

1. cli/peta processes content → _build/data/*.json
2. Next.js builds static HTML → _build/_next/
3. API routes are removed in static export
4. Client fetch() calls fail → "Loading..." states
5. No content displayed

Current File Structure (peta/)
------------------------------

::

  peta/
  ├── components/              # React components
  │   ├── ContentGrid.tsx     # Grid display for content items
  │   ├── Layout.tsx          # Main layout wrapper
  │   ├── SearchBar.tsx       # Search interface
  │   ├── BookTOC.tsx         # Table of contents
  │   ├── ProjectModal.tsx    # Project detail modal
  │   └── SnippetModal.tsx    # Snippet detail modal
  │
  ├── pages/                   # Next.js pages
  │   ├── index.tsx           # Homepage with search
  │   ├── articles/index.tsx  # Articles listing page
  │   ├── books/index.tsx     # Books listing page
  │   ├── projects/index.tsx  # Projects listing page
  │   ├── snippets/index.tsx  # Snippets listing page
  │   └── api/                # API routes (break in static build)
  │       ├── config/         # Configuration endpoints
  │       ├── content/        # Dynamic content endpoints
  │       └── static-data/    # Attempted static data fix
  │
  ├── processors/             # Content processing
  │   ├── math-renderer/      # LaTeX math processing
  │   ├── rst-parser/         # RST parser (Rust WASM)
  │   ├── snippet-resolver/   # Code snippet resolution
  │   └── wasm-bindings/      # JavaScript-Rust bridge
  │
  ├── scripts/                # Build scripts
  │   └── generate-static-data.js  # Attempted static fix
  │
  ├── utils/                  # Utility functions
  │   ├── site-config.ts      # Site configuration
  │   ├── content.ts          # Content utilities
  │   └── static-data.ts      # Static data loader
  │
  ├── styles/                 # CSS Modules
  ├── types/                  # TypeScript definitions
  └── package.json           # Dependencies and scripts

Current API Routes (What Breaks in Static Build)
-------------------------------------------------

::

  /api/config/site          → Returns site configuration
  /api/config/features      → Returns feature flags
  /api/content/articles     → Returns articles data
  /api/content/books        → Returns books data
  /api/content/projects     → Returns projects data
  /api/content/snippets     → Returns snippets data
  /api/content/book         → Returns book sections
  /api/content/snippet      → Returns snippet details
  /api/tags                 → Returns tag data
  /api/search               → Returns search results

Current Problems
----------------

Architecture Issues:
- Hybrid approach: tries to be both dynamic and static
- API routes don't exist in static exports
- Components use fetch() for data loading
- No fallback mechanism for static builds

Build Process Issues:
- Content processing happens separately from Next.js build
- Static export removes API routes
- No unified build system
- Complex dependency chain

Development vs Production Inconsistency:
- Development works with API routes
- Static build breaks without API routes
- Different data loading mechanisms
- Inconsistent user experience

Current State:
- Development mode: Fully functional
- Static build: Broken, shows "Loading..." states
- Deployment: Only works with Node.js server
- Static hosting: Non-functional
