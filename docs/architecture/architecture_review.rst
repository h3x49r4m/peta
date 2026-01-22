Peta Architecture Design
=================================

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

Component Architecture
-----------------------

**React Components:**
- Layout.tsx - Main layout wrapper with navigation
- ContentGrid.tsx - Grid display for content items
- SearchBar.tsx - Search interface component
- BookTOC.tsx - Table of contents for books
- ProjectModal.tsx - Modal for project details
- SnippetModal.tsx - Modal for snippet display
- TagFilter.tsx - Tag filtering component
- CodeBlock.tsx - Syntax highlighted code blocks
- MathRenderer.tsx - Math formula rendering
- TableOfContents.tsx - TOC for articles

**Pages Structure:**
- index.tsx - Homepage with search functionality
- articles/index.tsx - Articles listing page
- books/index.tsx - Books listing page
- projects/index.tsx - Projects listing page
- snippets/index.tsx - Snippets listing page
- books/[slug].tsx - Dynamic book pages
- projects/[slug].tsx - Dynamic project pages
- snippets/[slug].tsx - Dynamic snippet pages

Data Loading Patterns
---------------------

**Development Mode (Working):**
- Components use useEffect with fetch() calls
- API routes process RST files at runtime
- Content is loaded dynamically from the server
- Real-time updates and hot reload available

**Static Build (Broken):**
- API routes are removed during static export
- fetch() calls fail with network errors
- Components show "Loading..." states indefinitely
- No content is displayed to users

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

Content Processing Pipeline
---------------------------

::

  RST Files → JavaScript/WASM Parser → JSON Data → Next.js Build → Static Export (Broken)

**Processing Components:**
- rst-parser/ - Rust WASM for RST parsing
- math-renderer/ - MathJax Node integration
- snippet-resolver/ - Code snippet resolution
- wasm-bindings/ - JavaScript-Rust bridge

Build Process Details
---------------------

Current build process in cli/peta:

::

  1. Process RST files with JavaScript processors
  2. Generate JSON data in _build/data/
  3. Run Next.js build command
  4. Attempt static export (removes API routes)
  5. Copy static data (attempted fix)

Feature Configuration System
----------------------------

The engine includes a basic feature configuration system:

::

  {
    "modules": {
      "books": { "enabled": true },
      "articles": { "enabled": true },
      "snippets": { "enabled": true },
      "projects": { "enabled": true }
    }
  }

Feature Flow: Config File → FeatureContext → Layout Navigation → Component Rendering

Content Types
-------------

1. **Articles:** Long-form content with LaTeX math and snippet references
2. **Snippets:** Reusable code/explanation blocks with tags
3. **Projects:** Showcase items with descriptions and modal views
4. **Books:** Multi-section documents with hierarchical organization

Math Processing
---------------

Math Rendering Flow (Current):
::

  LaTeX Detection → MathJax Node → Client-side KaTeX → Display

Math Support:
- Inline math: $E=mc^2$
- Block math: $$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$
- Cross-references and equation numbering
- Various math environments (align, gather, multline)

Search System
-------------

Current search implementation:
- Client-side search with pre-built index (in development)
- Content search across articles and snippets
- Tag-based filtering
- Broken in static builds due to missing API routes

Styling System
--------------

- CSS Modules for component-scoped styling
- Custom CSS with responsive design
- Component-based design tokens
- Mobile-first approach

Deployment Workflow
-------------------

Current deployment process:
::

  Git Push → GitHub Actions → Content Process → Next.js Build → Static Export → Broken Site

The deployment attempts to create a static site but fails due to architecture issues.

Performance Metrics
-------------------

Current performance (development mode):
- First load: 2-3 seconds (development server)
- Content load: 1-2 seconds (API calls)
- Search results: 500ms-1s (client-side)
- Navigation: Fast (client-side routing)

Static build performance:
- Pages load but show "Loading..." states
- No content displayed due to missing API routes
- Broken functionality

Limitations
-----------

1. **Static Export Limitations:**
   - API routes are removed in static builds
   - Server-side functionality lost
   - Dynamic content loading fails

2. **Scalability Issues:**
   - Runtime processing limits concurrent users
   - Content updates require full rebuilds
   - No incremental build capability
   - Memory usage grows with content size

3. **User Experience Problems:**
   - Inconsistent behavior between dev and production
   - Build time delays for content updates
   - Complex debugging across multiple systems
   - No hot reload for static content changes

4. **Technical Debt:**
   - Mixed architecture creates maintenance burden
   - Duplicate logic between processors and components
   - Complex dependency management
   - Difficult testing across environments

Root Cause Analysis
-------------------

The fundamental issue is that the current architecture was designed as a traditional Next.js application with server-side API routes, but the goal is to create a static site generator. This creates an architectural mismatch:

1. **Design Intent vs Implementation:**
   - Intended: Static site generator
   - Implemented: Dynamic Next.js application

2. **Data Loading Strategy:**
   - Current: Runtime API calls
   - Needed: Build-time data embedding

3. **Build Process:**
   - Current: Separate content processing + Next.js build
   - Needed: Unified build that generates static files

4. **Component Design:**
   - Current: Assumes API availability
   - Needed: Assumes static data availability

Recommended Solutions
---------------------

1. **Option 1: Pure Static Approach**
   - Pre-generate all HTML at build time
   - Remove API dependencies
   - Use template engine for content rendering
   - Implement client-side search with static data

2. **Option 2: Full Rust Rewrite**
   - Replace Next.js with Rust-based static generator
   - Use template engines like Tera or handlebars
   - Implement all processing in Rust
   - Generate pure static HTML/CSS/JS

3. **Option 3: Hybrid Fix**
   - Keep Next.js but fix static generation
   - Use getStaticProps for all data loading
   - Pre-generate static data files
   - Implement client-side fallbacks

The current architecture needs fundamental changes to achieve true static site generation while maintaining the rich feature set and user experience.
