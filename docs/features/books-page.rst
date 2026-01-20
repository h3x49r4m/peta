Books Page Features (``/books``)
=================================

Main Purpose
------------

Multi-section book reader with advanced navigation and content rendering capabilities.

Key Features
-------------

1. Book Grid View
~~~~~~~~~~~~~~~~~

* **Visual book cards** with cover images
* **Metadata display** (title, author, date, tags)
* **Tag-based filtering**
* **Responsive grid layout**
* **Click-to-open** functionality

2. Section-Based Navigation
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

* **BookTOC component** for section navigation
* **Hierarchical structure** display
* **Current section** highlighting
* **Smooth scrolling** to sections
* **Collapsible/expandable** TOC

3. Single-Section View
~~~~~~~~~~~~~~~~~~~~~

* **One section at a time** display
* **Previous/Next navigation** between sections
* **URL-based section tracking** (``?section=id``)
* **Section history** support
* **Breadcrumb navigation**

4. Advanced Content Rendering
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

* **RST parsing** with complex table support
* **Mathematical formulas** with KaTeX
* **Code blocks** with syntax highlighting
* **Toctree rendering** as table of contents
* **Embedded snippet** integration

5. Incremental Loading
~~~~~~~~~~~~~~~~~~~~~~

* **IntersectionObserver** for lazy loading
* **Sections load** as they come into view
* **Performance optimization** for large books
* **Loading indicators** for sections

Interactive Elements
--------------------

Book Selection
~~~~~~~~~~~~~~

* **Card click** to open book
* **Tag filtering** to narrow selection
* **URL updates** on selection
* **Back button** support

Section Navigation
~~~~~~~~~~~~~~~~~~

* **TOC links** for direct navigation
* **Previous/Next buttons** for sequential navigation
* **URL parameter** updates
* **Scroll position** memory

Content Interaction
~~~~~~~~~~~~~~~~~~~

* **Embedded snippets** with modal views
* **Expandable sections**
* **Math formula** rendering
* **Code block** copying

URL Structure
--------------

* Book list: ``/books``
* Specific book: ``/books?book=id``
* Specific section: ``/books?book=id&section=id``
* Tag filter: ``/books?tag=tagname``

Technical Implementation
-----------------------

Dependencies
~~~~~~~~~~~~~

* BookGrid component
* BookTOC component
* MathRenderer component
* CodeBlock component
* Book API endpoint

State Management
~~~~~~~~~~~~~~~~

* Selected book state
* Current section state
* Loaded sections tracking
* TOC expansion state

Performance Features
~~~~~~~~~~~~~~~~~~~~

* Server-side rendering with ``getServerSideProps``
* Incremental section loading
* Optimized RST parsing
* Efficient memory management

Advanced Parsing
~~~~~~~~~~~~~~~~

* **RST table parsing** (grid, simple, complex)
* **List parsing** with nesting
* **Header extraction** for TOC
* **Toctree directive** processing
* **Math formula** preservation

Special Features
----------------

Toctree Support
~~~~~~~~~~~~~~~

* Renders RST toctree directives
* Displays as formatted table of contents
* Maintains document structure
* No clickable links (display only)

Snippet Integration
~~~~~~~~~~~~~~~~~~~

* Embedded snippet references
* Modal viewing for snippets
* Syntax highlighting
* Multiple snippet support

Responsive Design
~~~~~~~~~~~~~~~~~

* Mobile-optimized reading
* Adaptive TOC layout
* Touch-friendly navigation
* Screen reader support