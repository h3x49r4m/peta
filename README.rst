Peta - High-Performance Static Website Engine
===============================================

A sophisticated static website engine designed for documentation sites, educational platforms, knowledge bases, and content-heavy websites. Built with Next.js, featuring advanced RST content processing, mathematical formula rendering, and a flexible feature management system.

Features
--------

**Core Capabilities**

- **Feature Management**: Dynamic module enabling/disabling via configuration
- **Multi-Content Types**: Articles, Books, Snippets, and Projects with specialized rendering
- **Advanced RST Processing**: Rust WebAssembly parser for 10-20x faster performance
- **Mathematical Rendering**: LaTeX support with KaTeX and pre-rendered SVG
- **Snippet System**: Reusable content chunks with circular reference detection
- **Global Search**: Client-side search with pre-built index across all content types
- **Tag Management**: Unified tagging system with frequency-based visualization
- **Responsive Design**: Mobile-first design with CSS Modules and touch support

**Content Features**

- **Books**: Multi-section documents with toctree support and sequential navigation
- **Articles**: Full-featured blog posts with automatic TOC generation
- **Snippets**: Code gallery with syntax highlighting for 20+ languages
- **Projects**: Portfolio showcases with modal-based detailed views
- **Embedded Content**: Snippet references within articles and books

**Performance & Architecture**

- **Static Generation**: Fast builds with incremental updates (60-90 seconds)
- **Content Chunking**: 1K items per JSON file for handling 10M+ articles
- **Code Splitting**: Lazy loading of syntax highlighters and content
- **WebAssembly**: Rust-based RST parser for optimal performance
- **Caching Strategy**: Math formula caching and efficient data structures

Architecture
------------

**System Architecture**

.. code-block:: text

   Layout --> FeatureContext --> withFeatureCheck --> Pages
       ↓
   Navigation (conditional based on features)
       ↓
   Main Pages --> API Endpoints --> Content Processors --> Data (_build/data)

**Technology Stack**

- **Frontend**: Next.js 14.2.35 with TypeScript, static export capability
- **Content Processing**: Rust WebAssembly (RST parser) + MathJax Node
- **Styling**: CSS Modules + PostCSS with responsive design
- **Math Rendering**: KaTeX (client-side) + pre-rendered SVG (build-time)
- **Search**: Client-side search with pre-built JSON index
- **Deployment**: GitHub Pages with Fastly CDN

**Feature Management System**

The site implements a sophisticated feature flag system:

- **Configuration**: ``/peta/configs/features.json`` for module control
- **Global State**: ``FeatureContext`` for application-wide feature awareness
- **Page Protection**: ``withFeatureCheck`` HOC for route-level feature gating
- **Dynamic Navigation**: Conditional menu items based on enabled features

Getting Started
---------------

Prerequisites
~~~~~~~~~~~~~~

- Node.js 16+ 
- Python 3.9+ (for math rendering)
- Rust and wasm-pack (optional, for rebuilding WASM modules)

**Note**: WebAssembly (WASM) modules are included in the repository for immediate use. Rust and wasm-pack are only needed if you want to rebuild the WASM modules from source.

WebAssembly (WASM) Support
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Peta uses WebAssembly for high-performance RST (reStructuredText) parsing. The WASM modules provide 10-20x faster processing compared to JavaScript alternatives.

**WASM Files Included**

The repository includes pre-compiled WASM files, so you can use Peta immediately without installing Rust or wasm-pack:

- ``peta/processors/wasm-bindings/rst_parser_bg.wasm`` - Main WASM module
- ``peta/processors/wasm-bindings/rst_parser.js`` - JavaScript bindings
- ``peta/processors/wasm-bindings/rst-parser.js`` - High-level parser interface

**Fallback Support**

If WASM files are missing or unavailable, Peta automatically falls back to a JavaScript-based RST parser. This fallback provides full functionality but with reduced performance.

**Rebuilding WASM (Optional)**

If you want to rebuild the WASM modules from source:

1. Install Rust using rustup (recommended)::

    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
    source ~/.cargo/env

2. Verify installation::

    rustc --version
    cargo --version

3. Install wasm-pack::

    curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

4. Verify installation::

    wasm-pack --version

5. Navigate to the WASM source directory and rebuild::

    cd peta/processors/rst-parser
    wasm-pack build --target nodejs --out-dir ../wasm-bindings

Installation
~~~~~~~~~~~~

**Option 1: Create a New Site**

Create a new Peta site with all directories and dependencies::

    ./cli/peta init site my-new-site
    cd my-new-site
    ./cli/peta dev

This creates a complete site structure and starts the development server at http://localhost:3000

**Option 2: Clone Existing Repository**

1. Clone the repository::

    git clone https://github.com/h3x49r4m/peta.git
    cd peta

2. Install dependencies::

    npm install

3. Start the development server::

    npm run dev
    # or using the CLI tool
    peta dev

   The server will be available at http://localhost:3000

4. Build for production::

    npm run build && npm run export
    # or using the CLI tool
    peta build

   The static files will be generated in the ``_build/`` directory.

Project Structure
-----------------

::

   peta/
   ├── configs/         # Configuration files
   │   ├── site.json    # Site information and social links
   │   └── features.json # Feature flags
   ├── pages/           # Next.js pages and API routes
   ├── components/      # React components
   ├── styles/          # CSS modules
   ├── utils/           # Utility functions
   └── processors/      # Content processing modules
   
   _content/
   ├── articles/        # Articles and documentation
   ├── snippets/        # Reusable content snippets
   ├── projects/        # Project showcases
   └── books/           # Multi-section books with toctree

Configuration Files
~~~~~~~~~~~~~~~~~~~

- **configs/site.json**: Site metadata, author info, and social media links
- **configs/features.json**: Feature flags to enable/disable site modules

Content Format
~~~~~~~~~~~~~~

Each content file uses RST format with YAML frontmatter::

    ---
    title: "Content Title"
    date: 2023-01-15
    tags: ["tag1", "tag2"]
    author: "Author Name"
    ---

    Content Title
    =============

    Content here with math: $E=mc^2$

    .. snippet:: snippet-id

    More content...

**Books Structure**

Books support multi-section organization with toctree directives::

    ---
    title: "Book Title"
    author: "Author Name"
    ---

    Book Title
    ==========

    .. toctree::
       :maxdepth: 2

       section-1
       section-2
       section-3

Snippet Embedding
~~~~~~~~~~~~~~~~~

Embed snippets in any content using the RST directive::

    .. snippet:: snippet-id

Math Support
~~~~~~~~~~~~

The website engine supports LaTeX math expressions:

- **Inline math**: ``$E=mc^2$``
- **Block math**: ``$$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$``

Math is rendered to SVG during build time for optimal performance.

Configuration
-------------

The site uses configuration files in ``/peta/configs/`` to customize behavior and appearance.

Feature Configuration
~~~~~~~~~~~~~~~~~~~~~

The site's features can be configured via ``/peta/configs/features.json``:

.. code-block:: json

   {
     "modules": {
       "books": { "enabled": true },
       "articles": { "enabled": true },
       "snippets": { "enabled": true },
       "projects": { "enabled": true }
     }
   }

**Available Features**

- **books**: Multi-section book reader with navigation
- **articles**: Article browsing with full-text reading
- **snippets**: Code snippet gallery with syntax highlighting
- **projects**: Portfolio-style project showcase

Site Configuration
~~~~~~~~~~~~~~~~~~~

Site information and social links can be configured via ``/peta/configs/site.json``:

.. code-block:: json

   {
     "site": {
       "name": "My Blog",
       "description": "A high-performance static website",
       "url": "https://myblog.com"
     },
     "author": {
       "name": "John Doe",
       "email": "john@example.com"
     },
     "social": {
       "github": "https://github.com/username",
       "x": "https://x.com/username",
       "linkedin": "https://linkedin.com/in/username"
     },
     "footer": {
       "copyright": "© 2024 My Blog. All rights reserved.",
       "customText": "Built with ❤️ and Next.js"
     }
   }

**Configuration Options**

- **site.name**: Site name displayed in navigation and header
- **site.description**: Site description shown on the homepage
- **site.url**: Base URL for the site (used for SEO and social sharing)
- **author.name**: Author name for attribution
- **author.email**: Contact email (linked in footer)
- **social.github**: GitHub profile URL
- **social.x**: X (formerly Twitter) profile URL
- **social.linkedin**: LinkedIn profile URL
- **footer.copyright**: Copyright text in footer
- **footer.customText**: Additional custom text in footer

The configuration is automatically applied throughout the site:
- Navigation bar shows the configured site name
- Footer displays configured social links and copyright
- Homepage shows welcome message with site description
- SEO meta tags use site information for better search engine visibility

CLI Tools
---------

The Peta CLI provides convenient commands for managing content and creating new sites. For detailed documentation, see ``cli/README.rst``.

Creating a New Site
~~~~~~~~~~~~~~~~~~~

Initialize a new Peta site with all directories and dependencies::

    ./cli/peta init site my-new-site
    cd my-new-site
    ./cli/peta dev

This creates a complete site structure and starts the development server at http://localhost:3000

**What's Included**

When creating a new site, the following is automatically set up:

- WebAssembly files for RST parsing (copied from source)
- All necessary dependencies installed via npm
- Content directories with example articles, snippets, projects, and books
- Configuration files ready for customization

**WASM Setup**

The initialization process automatically:

1. Copies WASM files from the source project
2. Verifies WASM module integrity
3. Falls back to JavaScript parser if WASM files are missing

This ensures your new site works immediately without requiring additional setup.

Creating Content
~~~~~~~~~~~~~~~~

Create new content files with templates::

    ./cli/peta init article "Article Title"
    ./cli/peta init snippet "Snippet Title"
    ./cli/peta init project "Project Title"

Content files are automatically created in the appropriate ``_content/`` directory with:
- Proper RST formatting
- YAML frontmatter
- Example content and math formulas
- Helpful comments

Development Commands
~~~~~~~~~~~~~~~~~~~

- ``peta init site <path>``: Initialize a new Peta site
- ``peta init <type> "Title"``: Create new content (article, snippet, project)
- ``peta dev``: Start development server (automatically processes content)
- ``peta build``: Build for production
- ``peta test``: Run all tests
- ``peta help``: Show help information

Configuration Management
~~~~~~~~~~~~~~~~~~~~~~~~~

After creating a new site, you can customize it by editing:

- ``peta/configs/site.json`` - Site information, author details, and social links
- ``peta/configs/features.json`` - Enable/disable site modules

The site automatically reloads configuration changes in development mode.

Build Commands
~~~~~~~~~~~~~~

- ``npm run dev``: Start development server
- ``npm run build``: Build for production
- ``npm run start``: Start production server
- ``npm run export``: Build and export static files

Data Generation
~~~~~~~~~~~~~~~

The ``_build`` directory contains processed data and is generated automatically:

1. **During Development**: When you run ``npm run dev``, content from ``_content/`` is processed and stored in ``_build/data/``

2. **During Build**: When you run ``npm run build``, all content is processed, math formulas are rendered to SVG, and data is chunked for performance

3. **Manual Processing**: To manually process content without starting the dev server::

    cd peta
    node scripts/process-content.js

The ``_build/data`` directory contains:

- ``content-chunks/`` - JSON files with 1K items each for efficient loading
- ``math-cache/`` - Pre-rendered SVG versions of math formulas
- ``*-index.json`` - Index files for articles, snippets, projects, and books
- ``search-index.json`` - Search index for client-side search
- ``tags.json`` - Tag information with counts

This structure enables the site to handle 10M+ articles efficiently through content chunking and caching.

Viewing Static Build
~~~~~~~~~~~~~~~~~~~

To view the static build directly::

    cd _build
    npx serve .
    # or
    python3 -m http.server 8000

   The static site will be available at http://localhost:8000

API Endpoints
-------------

The site provides comprehensive API endpoints for content management:

**Content APIs**
- ``/api/content/book`` - Book content with section parsing and toctree
- ``/api/content/[type]`` - Dynamic content serving (articles, snippets, projects)
- ``/api/content/snippet`` - Dedicated snippet endpoint
- ``/api/content/recent`` - Recently updated content aggregation

**Search & Discovery**
- ``/api/search`` - Global full-text search across all content types
- ``/api/tags`` - Tag management and counting

**Configuration**
- ``/api/config/features`` - Feature flag management

For detailed API documentation, see ``docs/features/api-endpoints.rst``.

Deployment
----------

Deployment
----------

The site is designed for GitHub Pages deployment with automated CI/CD.

GitHub Pages Deployment
~~~~~~~~~~~~~~~~~~~~~~~

Step-by-Step Deployment Guide
-----------------------------

**Step 1: Fork or Create Repository**

1. Fork the Peta repository to your GitHub account, or
2. Create a new repository and push your Peta site code

**Step 2: Configure GitHub Actions Workflow**

1. Ensure the workflow file exists at ``peta/.github/workflows/build.yml``:

.. code-block:: yaml

    name: Build and Deploy to GitHub Pages
    
    on:
      push:
        branches: [ main ]
      pull_request:
        branches: [ main ]
    
    jobs:
      build-and-deploy:
        runs-on: ubuntu-latest
        
        steps:
        - name: Checkout
          uses: actions/checkout@v3
          
        - name: Setup Node.js
          uses: actions/setup-node@v3
          with:
            node-version: '18'
            cache: 'npm'
            cache-dependency-path: peta/package-lock.json
            
        - name: Install Rust
          uses: actions-rs/toolchain@v1
          with:
            toolchain: stable
            
        - name: Install wasm-pack
          run: curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
        
        - name: Build site
          run: |
            cd peta
            npm install
            npm run build
            npm run export
            
        - name: Deploy to GitHub Pages
          uses: peaceiris/actions-gh-pages@v3
          if: github.ref == 'refs/heads/main'
          with:
            github_token: ${{ secrets.GITHUB_TOKEN }}
            publish_dir: ./_build
            cname: your-site.github.io  # Optional: remove if not using custom domain

**Step 3: Enable GitHub Pages**

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under **Build and deployment**, set **Source** to **GitHub Actions**
5. GitHub will now use the workflow to build and deploy your site

**Step 4: Configure Custom Domain (Optional)**

1. In your repository, go to **Settings** → **Pages**
2. Under **Custom domain**, enter your domain (e.g., ``yourblog.com``)
3. Update the ``cname`` field in the workflow file if needed
4. Configure DNS settings as instructed by GitHub

**Step 5: Verify Deployment**

1. Push changes to the main branch:

.. code-block:: bash

    git add .
    git commit -m "Deploy site to GitHub Pages"
    git push origin main

2. Check the **Actions** tab to see the build progress
3. Once complete, your site will be available at:
   - ``https://yourusername.github.io/your-repo`` (default)
   - ``https://your-custom-domain.com`` (if configured)

**Step 6: Troubleshooting Common Issues**

- **Build fails**: Check the Actions tab for error logs
- **404 errors**: Ensure the workflow is using the correct ``publish_dir`` (``./_build``)
- **Custom domain not working**: Verify DNS configuration and CNAME file
- **Math formulas not rendering**: Check that WASM files are included in the build

Automatic Deployment
-------------------

The GitHub Actions workflow automatically:

1. **Triggers** on pushes to the main branch
2. **Builds** the entire site with all content processing
3. **Deploys** to GitHub Pages with each update

Deployment Workflow
------------------

The deployment process includes:

1. **Rust/WASM Build**: Compile RST parser to WebAssembly
2. **Content Processing**: Convert RST files to JSON with chunking
3. **Math Rendering**: Convert LaTeX formulas to SVG
4. **Snippet Resolution**: Process snippet references and embeddings
5. **Next.js Build**: Generate static site with optimized chunks
6. **Static Export**: Export to ``_build/`` directory
7. **GitHub Pages**: Deploy to GitHub Pages with Fastly CDN

**Manual Deployment (Alternative)**

If you prefer not to use GitHub Actions:

.. code-block:: bash

    # Build the site locally
    cd peta
    npm install
    npm run build
    npm run export
    
    # Deploy to gh-pages branch
    npx gh-pages -d ../_build --dotfiles --repo "git@github.com:username/username.github.io.git"

Performance
-----------

The architecture is optimized for handling 10M+ articles:

**Build Metrics**
- **Full Build**: 60-90 seconds
- **Incremental Build**: 15-20 seconds
- **Content Capacity**: Designed for 10M+ articles
- **First Load**: <2 seconds (static shell)
- **Content Load**: 1-2 seconds (first chunk)
- **Search Results**: <500ms (client-side)

**WASM Performance**
- **RST Parsing**: 10-20x faster than JavaScript alternatives
- **Large Documents**: Handles multi-MB RST files efficiently
- **Memory Usage**: Low memory footprint with streaming parser
- **Fallback Performance**: JavaScript fallback provides full functionality with reduced speed

**Optimizations**
- Content chunking for efficient loading
- Math formula caching (SVG generation)
- Parallel RST processing with Rust WASM
- Code splitting and lazy loading
- Service worker caching support
- Feature-based code splitting
- Automatic WASM fallback for compatibility

Documentation
-------------

For comprehensive documentation, see:

- **Architecture**: ``docs/architecture.rst`` - Detailed system architecture
- **Features**: ``docs/features/`` - Complete feature documentation
  - ``docs/features/overview.rst`` - Core architecture and shared features
  - ``docs/features/feature-management.rst`` - Feature flag system
  - ``docs/features/home-page.rst`` - Homepage features
  - ``docs/features/books-page.rst`` - Book reader features
  - ``docs/features/articles-page.rst`` - Article features
  - ``docs/features/projects-page.rst`` - Project showcase features
  - ``docs/features/snippets-page.rst`` - Snippet gallery features
  - ``docs/features/api-endpoints.rst`` - API documentation
  - ``docs/features/special-pages.rst`` - Error pages and testing tools
- **CLI Tools**: ``cli/README.rst`` - Command-line interface documentation

Troubleshooting
---------------

Common issues:

- **404 errors**: Ensure the ``basePath`` in ``next.config.js`` matches your repository name
- **Math not rendering**: Check that the math cache is properly generated during build
- **Content not loading**: Verify that API routes are correctly exported in the static build
- **Feature flags not working**: Check ``/api/config/features`` endpoint and configuration file
- **RST parsing errors**: 
  - Verify WASM files exist in ``peta/processors/wasm-bindings/``
  - If WASM is missing, the system will automatically use JavaScript fallback
  - Check browser console for WASM loading errors
- **"Cannot find module '../processors/wasm-bindings/rst-parser'"**: 
  - This occurs when WASM files are missing from a new site
  - Run ``./cli/peta init site`` again or manually copy WASM files
  - The fallback parser will be used automatically in newer versions

Contributing
------------

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes with ``npm run dev``
5. Submit a pull request

When contributing:

- Follow the existing code style and patterns
- Update documentation for new features
- Test with different feature configurations
- Ensure responsive design is maintained

License
-------

Apache 2.0
