API Endpoints Features
======================

Overview
--------

Peta provides a comprehensive set of API endpoints for content management, search, and configuration. All endpoints are built with Next.js API routes and support JSON responses.

Content APIs
-------------

1. Book API (``/api/content/book``)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**Purpose**: Serve book content with section parsing and toctree support

**Features**:

* **Section-based content** delivery
* **Toctree parsing** from RST files
* **Ordered sections** based on toctree directives
* **Index.rst inclusion** as first section
* **Metadata extraction** (title, author, tags, date)

**Response Structure**:

.. code-block:: json

   [
     {
       "id": "book-id",
       "title": "Book Title",
       "author": "Author Name",
       "description": "Book Description",
       "date": "2024-01-01",
       "tags": ["tag1", "tag2"],
       "sections": [
         {
           "id": "section-id",
           "title": "Section Title",
           "content": [...]
         }
       ]
     }
   ]

2. Generic Content API (``/api/content/[type]``)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**Purpose**: Dynamic content serving for different content types

**Supported Types**:

* ``article`` - Blog posts and articles
* ``project`` - Portfolio projects
* ``snippet`` - Code snippets
* ``book`` - Books (also available via dedicated endpoint)

**Features**:

* **Dynamic routing** based on type
* **Unified content** structure
* **Metadata extraction**
* **Content processing** with RST parsing

3. Snippet API (``/api/content/snippet``)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**Purpose**: Dedicated endpoint for code snippets

**Features**:

* **Syntax highlighting** preparation
* **Language detection**
* **Code block parsing**
* **Tag association**

4. Recent Content API (``/api/content/recent``)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**Purpose**: Serve recently updated content across all types

**Features**:

* **Cross-type aggregation**
* **Date-based sorting**
* **Configurable limits**
* **Metadata-only responses**

Search and Discovery APIs
-------------------------

1. Search API (``/api/search``)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**Purpose**: Global full-text search across all content

**Features**:

* **Full-text search** across titles, descriptions, and content
* **Multi-type search** (articles, books, snippets, projects)
* **Query parameter** support (``?q=search-term``)
* **Relevance scoring**
* **Result limiting**

**Request Parameters**:

* ``q`` - Search query string
* ``type`` - Optional content type filter
* ``limit`` - Maximum results (default: 20)

**Response Structure**:

.. code-block:: json

   {
     "results": [
       {
         "type": "article|book|snippet|project",
         "id": "content-id",
         "title": "Content Title",
         "description": "Match Description",
         "relevance": 0.95
       }
     ],
     "total": 42
   }

2. Tags API (``/api/tags``)
~~~~~~~~~~~~~~~~~~~~~~~~~~

**Purpose**: Tag management and counting

**Features**:

* **Tag aggregation** across all content
* **Type-specific filtering** (``?type=book|article|snippet|project``)
* **Usage counting**
* **Alphabetical sorting**
* **Frequency-based weighting**

**Request Parameters**:

* ``type`` - Optional content type filter

**Response Structure**:

.. code-block:: json

   [
     {
       "name": "tag-name",
       "count": 15,
       "type": "content-type"
     }
   ]

Configuration APIs
-------------------

1. Features API (``/api/config/features``)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**Purpose**: Feature flag management and configuration

**Features**:

* **Dynamic feature enabling/disabling**
* **Default configuration** fallback
* **JSON configuration** serving
* **Runtime feature** toggling

**Response Structure**:

.. code-block:: json

   {
     "modules": {
       "books": { "enabled": true },
       "articles": { "enabled": true },
       "snippets": { "enabled": true },
       "projects": { "enabled": true }
     }
   }

Special Endpoints
------------------

1. Legacy Redirects
~~~~~~~~~~~~~~~~~~~

* ``/posts/[slug]`` - Redirects to articles with query parameters
* ``/books/[slug]`` - Redirects to books with query parameters

2. Development Endpoints
~~~~~~~~~~~~~~~~~~~~~~~

* ``/api/test`` - Development testing endpoint
* ``/api/tags-old`` - Legacy tags endpoint
* ``/api/search-old`` - Legacy search endpoint

Technical Implementation
-----------------------

Data Processing
~~~~~~~~~~~~~~~~

* **RST parsing** with WebAssembly fallback
* **Content extraction** from structured files
* **Metadata parsing** from frontmatter
* **Toctree directive** processing

Performance Features
~~~~~~~~~~~~~~~~~~~~~

* **Response caching** where appropriate
* **Optimized parsing** for large content
* **Error handling** with proper status codes
* **JSON validation** and sanitization

Error Handling
~~~~~~~~~~~~~~

* **400 Bad Request** for invalid parameters
* **404 Not Found** for missing content
* **500 Internal Server** for processing errors
* **Consistent error** response format

Integration Points
------------------

Frontend Integration
~~~~~~~~~~~~~~~~~~~

* **React hooks** for data fetching
* **State management** integration
* **Error boundary** handling
* **Loading state** management

Content Pipeline
~~~~~~~~~~~~~~~~

* **Build-time processing** for static content
* **Runtime processing** for dynamic content
* **File system** integration
* **Content transformation** pipeline

Security Considerations
-----------------------

Input Validation
~~~~~~~~~~~~~~~~

* **Parameter sanitization**
* **SQL injection** prevention
* **XSS protection** in responses
* **Rate limiting** considerations

Access Control
~~~~~~~~~~~~~~

* **Public endpoints** for content
* **Feature-based** access control
* **CORS configuration**
* **Content security** policies