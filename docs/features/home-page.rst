Home Page Features (``/``)
==========================

Main Purpose
------------

Central hub with global search functionality and tag cloud navigation.

Key Features
-------------

1. Global Search
~~~~~~~~~~~~~~~~

* **Real-time search** across all content types (articles, snippets, projects, books)
* **Live results** display as users type
* Integration with ``/api/search`` endpoint
* Full-text search capabilities

2. Interactive Tag Cloud
~~~~~~~~~~~~~~~~~~~~~~~

* **Dynamic sizing** based on tag frequency
* **Clickable tags** that trigger searches
* Visual hierarchy showing popular content
* Integration with ``/api/tags`` endpoint

3. Content Grid
~~~~~~~~~~~~~~

* **Unified display** of all content types
* **Mixed content** presentation
* Visual indicators for different content types
* Responsive grid layout

Interactive Elements
--------------------

Search Bar
~~~~~~~~~~~

* **Live search** with debouncing
* **Auto-complete** suggestions
* **Keyboard navigation** support
* **Clear search** functionality

Tag Cloud
~~~~~~~~~~

* **Hover effects** showing tag counts
* **Click-to-search** functionality
* **Color-coded** categories
* **Responsive sizing**

Search Results
~~~~~~~~~~~~~~

* **Content cards** with metadata
* **Direct links** to full content
* **Type indicators** (book, article, snippet, project)
* **Excerpt display**

URL Structure
--------------

* Base URL: ``/``
* Search: ``/?search=query``
* Tag filter: ``/?tag=tagname``

Technical Implementation
-----------------------

Dependencies
~~~~~~~~~~~~~

* SearchBar component
* ContentGrid component
* TagFilter component
* Search API endpoint
* Tags API endpoint

State Management
~~~~~~~~~~~~~~~~

* Search query state
* Search results state
* Tag selection state
* Loading states

Performance Features
~~~~~~~~~~~~~~~~~~~~

* Debounced search input
* Optimized API calls
* Efficient re-rendering
* Minimal bundle impact