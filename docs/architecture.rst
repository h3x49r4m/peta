Static Website Engine Architecture
====================================================================

This is a high-performance static website engine capable of handling 10M+ articles, designed for various content-heavy websites including documentation, educational sites, and knowledge bases.

Tech Stack
----------

- **Frontend:** Next.js (Static Export + Client-side Rendering)
- **Content:** RST files with YAML frontmatter + LaTeX math
- **Styling:** CSS Modules + PostCSS
- **Math Rendering:** KaTeX (client-side) + Pre-rendered SVG (build-time)
- **Search:** Client-side search with pre-built index
- **Processing:** Rust + WebAssembly + MathJax Node
- **Hosting:** GitHub Pages with Fastly CDN
- **Feature Control:** Dynamic feature configuration system

Architecture Overview
---------------------

1. Project Structure
~~~~~~~~~~~~~~~~~~~~~

::

  peta/
  ├── _content/ (RST files with LaTeX and snippet refs)
  │   ├── articles/ (RST files with LaTeX and snippet refs)
  │   ├── snippets/ (RST files with LaTeX)
  │   ├── projects/ (RST files with LaTeX)
  │   └── books/ (Multi-section RST files with toctree)
  ├── _build/ (Generated data and cache)
  │   └── data/
  │       ├── content-chunks/ (1K items per JSON file)
  │       ├── math-cache/ (Cached SVGs)
  │       ├── articles-index.json
  │       ├── projects-index.json
  │       ├── snippets-index.json
  │       ├── books-index.json
  │       ├── search-index.json
  │       └── tags.json
  ├── configs/ (Feature configuration)
  │   └── features.json
  ├── processors/
  │   ├── rst-parser/ (Rust crate)
  │   ├── math-renderer/ (MathJax Node integration)
  │   ├── snippet-resolver/ (Snippet embedding logic)
  │   └── wasm-bindings/ (JS-WASM bridge)
  ├── scripts/
  │   ├── copy-data.js (Copy processed data to out directory)
  │   ├── process-content.js (Main processing script)
  │   └── render-math.js (Math rendering pipeline)
  ├── pages/ (Next.js pages)
  │   ├── index.tsx (Home with search)
  │   ├── articles/ (Article listing with sidebar)
  │   ├── snippets/ (Card grid layout)
  │   ├── projects/ (Project showcase)
  │   ├── books/ (Multi-section book reader)
  │   ├── api/ (API routes for content)
  │   └── posts/ (Dynamic routes for individual posts)
  ├── components/ (React components)
  │   ├── Layout.tsx (Main layout component)
  │   ├── ContentGrid.tsx (Grid layout for content)
  │   ├── ContentList.tsx (List layout for content)
  │   ├── MathRenderer.tsx (Math formula rendering)
  │   ├── ProjectGrid.tsx (Project card grid)
  │   ├── ProjectModal.tsx (Project detail modal)
  │   ├── SearchBar.tsx (Search functionality)
  │   ├── SnippetGrid.tsx (Snippet card grid)
  │   ├── SnippetModal.tsx (Snippet detail modal)
  │   ├── TableOfContents.tsx (TOC for articles)
  │   ├── BookTOC.tsx (Interactive table of contents for books)
  │   ├── BookGrid.tsx (Book card grid)
  │   ├── BookTableOfContents.tsx (Book navigation)
  │   ├── TagFilter.tsx (Tag filtering)
  │   └── CodeBlock.tsx (Syntax highlighted code blocks)
  ├── contexts/ (React contexts)
  │   └── FeatureContext.tsx (Global feature management)
  ├── hocs/ (Higher-order components)
  │   └── withFeatureCheck.tsx (Feature-based route protection)
  ├── styles/ (CSS Modules)
  └── utils/ (Client-side JS + KaTeX fallback)

2. Feature Configuration System
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The engine includes a flexible feature configuration system that allows users to enable/disable different content modules:

Configuration Structure
~~~~~~~~~~~~~~~~~~~~~~

::

  {
    "modules": {
      "books": { "enabled": true },
      "articles": { "enabled": true },
      "snippets": { "enabled": true },
      "projects": { "enabled": true }
    }
  }

Feature Control Flow
~~~~~~~~~~~~~~~~~~~~

::

  Config File → FeatureContext → Layout Navigation → Route Protection → Component Rendering

3. Content Processing Pipeline
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

::

  RST Files → Rust WASM → Extract LaTeX → MathJax Node → SVG Generation → Snippet Resolution → JSON Chunks → Next.js Build → Static Export

4. Output Structure
~~~~~~~~~~~~~~~~~~~

::

  out/
  ├── index.html (Home with search)
  ├── articles/ (Article listing with sidebar)
  ├── snippets/ (Card grid layout)
  ├── projects/ (Project showcase)
  ├── books/ (Multi-section book reader)
  ├── data/
  │   ├── content-chunks/
  │   │   ├── posts-chunk-1.json (1K posts each with embedded snippets)
  │   │   ├── posts-chunk-2.json
  │   │   └── ...
  │   ├── snippets-chunks/
  │   ├── projects-chunks/
  │   ├── books-chunks/
  │   ├── math-cache/
  │   │   ├── formula-abc123.svg (cached SVGs)
  │   │   └── ...
  │   ├── tags.json
  │   └── search-index.json
  ├── assets/
  │   └── katex/ (KaTeX for fallback)
  └── api/ (Next.js API routes)

5. Page Structure
~~~~~~~~~~~~~~~~~

- **Index:** Search bar + all tags categorized by content type
- **Articles:** Left sidebar (table of contents, tags) + right content area
- **Snippets:** Card grid with filtering and modal view
- **Projects:** Tag filtering + project cards with modal view
- **Books:** Multi-section reader with navigation and table of contents
- **Contact:** Removed (contact links moved to footer)

Book System
------------

Book Structure
~~~~~~~~~~~~~~

Books are multi-section documents with hierarchical organization:

::

  book/
  ├── index.rst (Main book file with toctree directive)
  ├── chapter1.rst
  ├── chapter2.rst
  └── ...

toctree Directive
~~~~~~~~~~~~~~~~

::

  .. toctree::
     :maxdepth: 2
     :caption: Contents:

     introduction
     chapter1
     chapter2
     ...

Book Navigation Features
~~~~~~~~~~~~~~~~~~~~~~~

- **Section Navigation:** Previous/Next buttons for sequential reading
- **Table of Contents:** Interactive TOC with current section highlighting
- **Section Toggle:** Expand/collapse sections for focused reading
- **URL State:** Maintains current section in URL parameters
- **Hierarchical Display:** Shows headers and snippets within sections

Snippet Embedding System
------------------------

Reference Format
~~~~~~~~~~~~~~~~

- **RST Directive:** ``.. snippet:: snippet-id`` in RST files
- **Resolution:** Build-time embedding of snippets into posts
- **Dependency Tracking:** Track snippet-to-post relationships
- **Circular Reference Detection:** Prevent infinite loops
- **Version Control:** Handle snippet version compatibility

Content Structure with Embedded Snippets
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

::

  {
    "post": {
      "id": "post-123",
      "title": "Complex Topic",
      "content": [
        {
          "type": "text",
          "content": "Introduction to topic"
        },
        {
          "type": "embedded-snippet",
          "id": "snippet-456",
          "title": "Key Concept",
          "content": [
            {"type": "text", "content": "Explanation"},
            {"type": "math", "latex": "E=mc^2", "svg": "/data/math-cache/formula-xyz.svg"}
          ],
          "tags": ["physics", "basics"]
        },
        {
          "type": "text",
          "content": "Continuing discussion"
        }
      ],
      "tags": ["science", "physics"],
      "embeddedSnippets": ["snippet-456"]
    }
  }

Math Processing
---------------

Math Rendering Flow
~~~~~~~~~~~~~~~~~~~

::

  LaTeX Detection → Cache Check → MathJax Node → SVG Generation → HTML Embed → KaTeX Fallback

Math Support Features
~~~~~~~~~~~~~~~~~~~~~

- **Inline Math:** ``$E=mc^2$`` in RST
- **Block Math:** ``$$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$``
- **Cross-references:** Equation numbering and referencing
- **Math Environments:** Align, gather, multline, etc.
- **Special Symbols:** Greek letters, operators, accents

Client-Side Architecture
------------------------

Components
~~~~~~~~~~

- **Static Shell:** Instant loading of navigation/layout
- **Feature Context:** Global feature state management
- **Content Router:** Client-side routing for content
- **Chunk Loader:** Lazy loading of content chunks
- **Search Engine:** Client-side search with pre-built index
- **Cache Manager:** Service Worker for offline support
- **Snippet Viewer:** Interactive snippet viewing and embedding
- **Book Reader:** Multi-section document navigation

User Experience Flow
~~~~~~~~~~~~~~~~~~~~

::

  User Visit → Feature Config Load → Static Shell (instant) → Content Load (1-2s) → Full Functionality

Content Features
----------------

- **Feature Control:** Enable/disable content modules via configuration
- **Global Search:** Instant search across all content including snippets
- **Tag Filtering:** Client-side filtering by tags
- **Snippet Embedding:** Reusable snippet cards in articles
- **Math Display:** High-quality math rendering
- **Table of Contents:** Auto-generated TOC for articles and books
- **Modal Views:** Detailed view for snippets and projects
- **Book Reading:** Sequential navigation with section management
- **Responsive Design:** Mobile-first approach
- **Content Types:** Support for articles, snippets, projects, and books

Build Pipeline
--------------

Build Process (60-90 seconds)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

1. **WASM Compilation:** 5-10 seconds (cached)
2. **RST Processing:** 10-20 seconds (parallel Rust WASM)
3. **Math Rendering:** 20-30 seconds (parallel MathJax Node)
4. **Snippet Resolution:** 5-10 seconds (embed snippets in posts)
5. **JSON Generation:** 5-10 seconds (with rendered math)
6. **Search Index:** 5-10 seconds (incremental)
7. **Static Build:** 5-10 seconds (Next.js)

Incremental Build Strategy
~~~~~~~~~~~~~~~~~~~~~~~~~~

- **Change Detection:** Only process modified content
- **Dependency Tracking:** Rebuild posts when snippets change
- **Math Caching:** Reuse rendered formulas
- **Snippet Cache:** Cache processed snippets between builds

Performance Optimizations
-------------------------

- **Code Splitting:** Separate bundles for shell and content
- **Lazy Loading:** Images and content chunks
- **Compression:** Gzipped JSON chunks
- **CDN Caching:** GitHub Pages Fastly CDN
- **Service Worker:** Cache static assets and content
- **Snippet Caching:** Avoid duplicate snippet processing
- **Feature-Based Loading:** Only load enabled features

Search System
-------------

Search Features
~~~~~~~~~~~~~~~

- **Content Search:** Search within articles and snippets
- **Snippet Discovery:** Find snippets by content or tags
- **Math Search:** Search within LaTeX expressions
- **Cross-reference Search:** Find posts using specific snippets

Styling System
--------------

- **CSS Modules:** Scoped CSS for components
- **PostCSS:** Modern CSS processing
- **Custom Properties:** Theme variables
- **Responsive Design:** Mobile-first approach
- **Component Tokens:** Consistent design language

Deployment Workflow
-------------------

::

  Git Push → GitHub Actions → WASM Compile → Content Process → Math Render → Snippet Resolution → Static Export → GitHub Pages

Key Benefits
------------

- **Flexible Configuration:** Enable/disable features without code changes
- **Fast Builds:** 60-90 seconds (incremental: 15-20 seconds)
- **Scalable:** Handles 10M+ articles efficiently
- **Reusable Content:** Snippets can be embedded in multiple posts
- **Math Support:** High-quality math rendering
- **SEO Friendly:** Static shell with proper meta tags
- **Progressive Enhancement:** Works without JavaScript
- **Content Modularity:** Snippets enable content reuse and organization
- **Book Support:** Multi-section document organization
- **Feature Modularity:** Users can choose which content types to include
- **Flexible Architecture:** Suitable for various static website types beyond blogs

Performance Metrics
-------------------

- **First Load:** <2 seconds (static shell)
- **Content Load:** 1-2 seconds (first chunk)
- **Search Results:** <500ms (client-side)
- **Navigation:** Instant (client-side routing)
- **Snippet Embedding:** Seamless integration with posts
- **Book Navigation:** Instant section switching