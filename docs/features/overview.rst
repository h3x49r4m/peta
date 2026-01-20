Peta Website Features Overview
===============================

Peta is a high-performance static content management system designed for technical documentation, articles, books, projects, and code snippets. It provides advanced features for rendering reStructuredText (RST) content, mathematical formulas, and syntax-highlighted code.

Core Architecture
-----------------

.. code-block:: text

   Layout --> FeatureContext --> withFeatureCheck --> Pages
      ↓
   Navigation (conditional based on features)
      ↓
   Main Pages --> API Endpoints --> Content Processors --> Data (_build/data)

Feature Management System
------------------------

The application implements a sophisticated feature flag system:

* **FeatureContext**: Global feature state management
* **withFeatureCheck HOC**: Page-level feature gating
* **Dynamic navigation** based on enabled features
* **Configuration file**: ``/peta/configs/features.json``

Available Features
~~~~~~~~~~~~~~~~~~

* **Books**: Multi-section book reader with navigation
* **Articles**: Article browsing with full-text reading
* **Snippets**: Code snippet gallery with syntax highlighting
* **Projects**: Portfolio-style project showcase

Shared Components
-----------------

All main pages utilize these shared components:

* ``TagFilter``: Tag-based filtering
* ``ContentGrid``/``BookGrid``/``ProjectGrid``/``SnippetGrid``: Content display grids
* ``SearchBar``: Global search functionality
* ``MathRenderer``: LaTeX mathematical formula rendering
* ``CodeBlock``: Syntax-highlighted code display
* ``TableOfContents``/``BookTOC``: Navigation helpers
* Modal components for detailed views

Content Processing
-------------------

* **RST Parser**: Advanced reStructuredText parsing with WebAssembly fallback
* **Math Rendering**: KaTeX integration for mathematical formulas
* **Syntax Highlighting**: Prism.js with support for multiple languages
* **Table Parsing**: Complex RST table rendering
* **Toctree Support**: Table of contents generation from RST directives

API Architecture
----------------

* **Search API**: Global full-text search
* **Tags API**: Tag management and counting
* **Content APIs**: Dynamic content serving for different types
* **Config API**: Feature flag management

Responsive Design
-----------------

All pages feature responsive design with:

* Mobile-optimized layouts
* Touch-friendly interactions
* Adaptive grid systems
* Optimized loading states

Performance Features
--------------------

* **Incremental Loading**: Sections load as they come into view
* **Server-Side Rendering**: Initial page loads are server-rendered
* **Static Generation**: Where applicable for better performance
* **Lazy Loading**: Images and content load on demand