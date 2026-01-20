Peta Website Features Documentation
===================================

This directory contains comprehensive documentation of all features implemented in the Peta website. Each document provides detailed information about the functionality, implementation details, and technical specifications.

Document Structure
-------------------

Core Documentation
~~~~~~~~~~~~~~~~~~~

* **overview.rst** - High-level architecture and shared features
* **feature-management.rst** - Feature flag system implementation

Page-Specific Features
~~~~~~~~~~~~~~~~~~~~~~

* **home-page.rst** - Homepage with search and tag cloud
* **books-page.rst** - Multi-section book reader
* **articles-page.rst** - Article browsing and reading
* **projects-page.rst** - Project showcase with modals
* **snippets-page.rst** - Code snippet gallery

Technical Components
~~~~~~~~~~~~~~~~~~~

* **api-endpoints.rst** - Complete API documentation
* **special-pages.rst** - Error pages and development tools

Quick Reference
---------------

Main Features by Page
~~~~~~~~~~~~~~~~~~~~~

.. list-table:: Main Features by Page
   :header-rows: 1
   :widths: 20 30 50

   * - Page
     - Primary Purpose
     - Key Features
   * - **Home**
     - Content discovery
     - Global search, tag cloud, unified content grid
   * - **Books**
     - Multi-section reading
     - Section navigation, RST parsing, toctree rendering
   * - **Articles**
     - Article browsing
     - TOC generation, math rendering, snippet integration
   * - **Projects**
     - Portfolio showcase
     - Modal views, external links, tag filtering
   * - **Snippets**
     - Code gallery
     - Syntax highlighting, copy functionality, language support

Shared Components
~~~~~~~~~~~~~~~~~

.. list-table:: Shared Components
   :header-rows: 1
   :widths: 25 25 50

   * - Component
     - Purpose
     - Usage
   * - **TagFilter**
     - Tag-based filtering
     - All main pages
   * - **SearchBar**
     - Global search
     - Homepage
   * - **MathRenderer**
     - LaTeX rendering
     - Books, Articles
   * - **CodeBlock**
     - Syntax highlighting
     - All pages with code
   * - **FeatureGuard**
     - Feature gating
     - Layout component

API Endpoints
~~~~~~~~~~~~~

.. list-table:: API Endpoints
   :header-rows: 1
   :widths: 30 30 40

   * - Endpoint
     - Purpose
     - Methods
   * - ``/api/search``
     - Global search
     - GET
   * - ``/api/tags``
     - Tag management
     - GET
   * - ``/api/content/book``
     - Book content
     - GET
   * - ``/api/content/[type]``
     - Dynamic content
     - GET
   * - ``/api/config/features``
     - Feature flags
     - GET

Feature Management
------------------

The site implements a sophisticated feature flag system that allows:

* Dynamic enabling/disabling of content modules
* Configuration via ``/peta/configs/features.json``
* Page-level protection with HOCs
* Conditional navigation based on enabled features

Available Features
~~~~~~~~~~~~~~~~~~

* **books**: Multi-section book reader
* **articles**: Article browsing and reading
* **snippets**: Code snippet gallery
* **projects**: Project showcase

Technical Architecture
----------------------

Content Pipeline
~~~~~~~~~~~~~~~~~

.. code-block:: text

   RST Files → Content Processors → API Endpoints → Frontend Components

Rendering Stack
~~~~~~~~~~~~~~~

* **RST Parser**: WebAssembly with JavaScript fallback
* **Math Rendering**: KaTeX for LaTeX formulas
* **Syntax Highlighting**: Prism.js with 20+ languages
* **Table Parsing**: Complex RST table support

Performance Features
~~~~~~~~~~~~~~~~~~~~~

* Server-side rendering with Next.js
* Incremental loading for large content
* Lazy loading of syntax highlighters
* Optimized API responses

Getting Started
---------------

For Developers
~~~~~~~~~~~~~~~

1. Review the :doc:`overview` for architecture understanding
2. Check specific page documentation for implementation details
3. Refer to :doc:`api-endpoints` for backend integration
4. Understand :doc:`feature-management` for customization

For Content Managers
~~~~~~~~~~~~~~~~~~~~~

1. Use the :doc:`books-page` guide for multi-section content
2. Follow :doc:`articles-page` for blog posts
3. Utilize :doc:`snippets-page` for code examples
4. Configure :doc:`features` as needed

For System Administrators
~~~~~~~~~~~~~~~~~~~~~~~~~

1. Review :doc:`api-endpoints` for integration
2. Understand :doc:`feature-management` for deployment
3. Check :doc:`special-pages` for testing tools
4. Monitor performance via documented endpoints

Contributing
------------

When adding new features:

1. Update the appropriate feature documentation
2. Add API endpoint documentation if applicable
3. Update the overview with architectural changes
4. Consider feature flag integration

Support
-------

For questions about specific features:

* Refer to the relevant page documentation
* Check the API documentation for backend issues
* Review feature management for configuration problems
* Use test pages described in :doc:`special-pages`