Peta Website Engine Architecture
====================================================================

A hybrid static/dynamic website engine built with Next.js, designed for content-heavy sites including documentation, educational platforms, and knowledge bases. Currently functional in development mode but has architectural limitations in static builds.

Current Tech Stack
------------------

- **Frontend:** Next.js 14.2.35 with React 18
- **Language:** TypeScript for components, JavaScript for processors
- **Content:** RST (reStructuredText) files with LaTeX math
- **Styling:** CSS Modules with custom styling
- **Math Rendering:** KaTeX (client-side) + MathJax Node integration
- **Processing:** Rust WebAssembly + JavaScript processors
- **Build Tool:** Custom CLI script + Next.js build system
- **Package Manager:** npm
- **Deployment:** GitHub Actions (attempts static deployment)

Architecture Overview
---------------------

The current architecture is a hybrid approach that works in development but has fundamental issues in static builds.

1. Current Project Structure
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

::

  peta/
  ├── _content/                     # Source RST files
  │   ├── articles/                # Article RST files
  │   ├── snippets/                # Snippet RST files  
  │   ├── projects/                # Project RST files
  │   └── books/                   # Book RST files with toctree
  ├── _build/                      # Generated build artifacts
  │   └── data/                    # Processed JSON data
  ├── cli/                         # Command line interface
  │   └── peta                     # Main build script
  ├── peta/                        # Next.js application
  │   ├── components/              # React components
  │   ├── pages/                   # Next.js pages and API routes
  │   ├── processors/              # Content processing tools
  │   ├── scripts/                 # Build scripts
  │   ├── utils/                   # Utility functions
  │   ├── styles/                  # CSS Modules
  │   └── types/                   # TypeScript definitions
  ├── docs/                        # Documentation
  └── tests/                       # Test files

2. Component Architecture
~~~~~~~~~~~~~~~~~~~~~~~~~

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

3. API Routes (Development Only)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The application relies heavily on API routes that don't exist in static builds:

::

  /api/config/site              # Site configuration
  /api/config/features          # Feature flags
  /api/content/articles         # Articles data
  /api/content/books            # Books data
  /api/content/projects         # Projects data
  /api/content/snippets         # Snippets data
  /api/content/book             # Book sections
  /api/content/snippet          # Snippet details
  /api/tags                     # Tag data
  /api/search                   # Search results

4. Content Processing Pipeline
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

::

  RST Files → JavaScript/WASM Parser → JSON Data → Next.js Build → Static Export (Broken)

**Processing Components:**
- rst-parser/ - Rust WASM for RST parsing
- math-renderer/ - MathJax Node integration
- snippet-resolver/ - Code snippet resolution
- wasm-bindings/ - JavaScript-Rust bridge

5. Current Data Flow
~~~~~~~~~~~~~~~~~~~~

**Development Mode (Working):**
::

  Browser → Next.js Page → fetch() API → Content Processors → File System → JSON Response

**Static Build (Broken):**
::

  Static Export → API Routes Removed → fetch() Fails → "Loading..." States

6. Build Process
~~~~~~~~~~~~~~~~

Current build process in cli/peta:

::

  1. Process RST files with JavaScript processors
  2. Generate JSON data in _build/data/
  3. Run Next.js build command
  4. Attempt static export (removes API routes)
  5. Copy static data (attempted fix)

Current Issues
--------------

1. **Hybrid Architecture Problem:**
   - Tries to be both dynamic and static
   - API routes don't exist in static exports
   - Components use fetch() for data loading
   - No fallback mechanism for static builds

2. **Build System Issues:**
   - Content processing separate from Next.js build
   - Static export removes API routes
   - Complex dependency chain
   - No unified build system

3. **Development vs Production Inconsistency:**
   - Development works with API routes
   - Static build breaks without API routes
   - Different data loading mechanisms
   - Inconsistent user experience

4. **Performance Issues:**
   - Runtime API calls for content loading
   - Multiple fetch requests per page load
   - Client-side processing of large content
   - No caching strategy for static data

5. **Maintenance Complexity:**
   - Dual code paths (dev vs production)
   - Multiple build systems to maintain
   - Complex dependency management
   - Difficult to debug static vs dynamic issues

Feature Configuration System
---------------------------

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