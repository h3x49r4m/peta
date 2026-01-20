Articles Page Features (``/articles``)
====================================

Main Purpose
------------

Browse and read technical articles with advanced content rendering and navigation.

Key Features
-------------

1. Article List View
~~~~~~~~~~~~~~~~~~~

* **Card-based layout** for articles
* **Metadata display** (title, date, author, tags)
* **Excerpt preview** for each article
* **Tag-based filtering**
* **Responsive grid layout**

2. Full Article Reader
~~~~~~~~~~~~~~~~~~~~~~

* **Complete article rendering** with RST parsing
* **Dynamic table of contents** generation
* **Mathematical formula** rendering with KaTeX
* **Code block** syntax highlighting
* **Embedded snippet** integration

3. Table of Contents
~~~~~~~~~~~~~~~~~~~~

* **Automatic generation** from headers
* **Sticky navigation** while scrolling
* **Click-to-scroll** to sections
* **Active section** highlighting
* **Smooth scrolling** behavior

4. Tag Filtering
~~~~~~~~~~~~~~~~

* **Dropdown tag selector**
* **Real-time filtering** of articles
* **Tag count** display
* **Multi-tag support** (single selection)
* **URL parameter** tracking

5. Embedded Snippets
~~~~~~~~~~~~~~~~~~~~~

* **Snippet references** within articles
* **Modal viewing** for full snippet content
* **Syntax highlighting** for code
* **Back-to-article** navigation

Interactive Elements
--------------------

Article Selection
~~~~~~~~~~~~~~~~~

* **Card click** to open article
* **Full article view** with navigation
* **Back to list** functionality
* **URL updates** for sharing

Navigation
~~~~~~~~~~

* **Table of contents** links
* **Back-to-top** button
* **Breadcrumb navigation**
* **Keyboard navigation** support

Content Interaction
~~~~~~~~~~~~~~~~~~

* **Embedded snippet** modals
* **Code block** copying
* **Math formula** rendering
* **External link** handling

URL Structure
--------------

* Article list: ``/articles``
* Specific article: ``/articles?post=slug``
* Tag filter: ``/articles?tag=tagname``

Technical Implementation
-----------------------

Dependencies
~~~~~~~~~~~~~

* ContentList component
* TableOfContents component
* MathRenderer component
* CodeBlock component
* SnippetModal component
* Articles API endpoint

State Management
~~~~~~~~~~~~~~~~

* Selected article state
* Tag filter state
* TOC visibility state
* Loading states

Content Processing
~~~~~~~~~~~~~~~~~~

* **RST parsing** with fallback
* **Header extraction** for TOC
* **Math formula** detection
* **Code block** identification
* **Snippet reference** resolution

Performance Features
~~~~~~~~~~~~~~~~~~~~

* **Server-side rendering** support
* **Optimized parsing** for large articles
* **Lazy loading** for images
* **Efficient re-rendering**

Special Features
----------------

RST Rendering
~~~~~~~~~~~~~

* **Complex table** support
* **List parsing** with nesting
* **Header hierarchy** detection
* **Link processing**
* **Directive handling**

Math Integration
~~~~~~~~~~~~~~~~

* **KaTeX rendering** for formulas
* **Inline and display** math
* **Formula alignment**
* **Error handling** for invalid math

Snippet Integration
~~~~~~~~~~~~~~~~~~~

* **Embedded snippet** references
* **Modal overlay** for viewing
* **Syntax highlighting** preservation
* **Context-aware** display

Responsive Design
-----------------

* **Mobile-optimized** reading experience
* **Adaptive layout** for different screens
* **Touch-friendly** navigation
* **Readable typography** at all sizes