Special Pages Features
======================

Overview
--------

Peta includes several special pages for error handling, testing, and development purposes. These pages provide essential functionality for maintaining and testing the application.

Error Pages
-----------

1. 404 Page (``/404``)
~~~~~~~~~~~~~~~~~~~~~~~

**Purpose**: User-friendly not found page

**Features**:

* **Clean, minimal design**
* **Clear error message**
* **Home page link** for navigation
* **Consistent styling** with site theme
* **No double header** (fixed issue)

**Content**:

* "404 - Page Not Found" heading
* Helpful error message
* Return to home link
* Centered layout with padding

2. 500 Page (``/500``)
~~~~~~~~~~~~~~~~~~~~~~~

**Purpose**: Server error page for unexpected issues

**Features**:

* **User-friendly error** presentation
* **Reassurance message**
* **Home page navigation**
* **Consistent styling** with site theme
* **No double header** (fixed issue)

**Content**:

* "500 - Server Error" heading
* Apology and explanation
* Return to home link
* Centered layout with padding

Development & Test Pages
------------------------

1. API Test Page (``/api-test``)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**Purpose**: Development tool for testing API endpoints

**Features**:

* **API endpoint testing** interface
* **Request/response** display
* **Multiple endpoint** testing
* **Real-time results**
* **Development debugging**

**Testable Endpoints**:

* Search API
* Tags API
* Content APIs (books, articles, snippets, projects)
* Config API

2. Math Test Page (``/math-test``)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**Purpose**: KaTeX mathematical rendering testing

**Features**:

* **Math formula** rendering tests
* **Inline and display** math testing
* **Complex formula** validation
* **Error handling** for invalid math
* **Performance testing**

**Test Cases**:

* Simple inline math: ``$x = y + z$``
* Display math: ``$$\frac{a}{b}$$``
* Complex matrices
* Greek letters
* Special symbols

3. Code Blocks Test Page (``/test-code-blocks``)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**Purpose**: Syntax highlighting testing across languages

**Features**:

* **Multi-language** syntax testing
* **Prism.js integration** validation
* **Theme consistency** checking
* **Language detection** testing
* **Copy functionality** testing

**Supported Languages**:

* JavaScript/TypeScript
* Python
* Go
* Rust
* C++
* SQL
* YAML
* Docker
* Nginx
* Bash

Legacy Redirect Pages
---------------------

1. Posts Redirect (``/posts/[slug]``)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**Purpose**: Legacy URL support for article posts

**Features**:

* **Static generation** with ``getStaticPaths``
* **Automatic redirect** to new URL structure
* **Query parameter** preservation
* **SEO-friendly** redirects

**Redirect Logic**:

* From: ``/posts/post-slug``
* To: ``/articles?post=post-slug``

2. Books Redirect (``/books/[slug]``)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**Purpose**: Legacy URL support for books

**Features**:

* **Static generation** with ``getStaticPaths``
* **Automatic redirect** to new URL structure
* **Section parameter** preservation
* **SEO-friendly** redirects

**Redirect Logic**:

* From: ``/books/book-slug``
* To: ``/books?book=book-slug``

Technical Implementation
-----------------------

Error Page Architecture
~~~~~~~~~~~~~~~~~~~~~~

* **No Layout wrapper** (prevents double headers)
* **Simple HTML structure**
* **CSS-in-JS styling** for simplicity
* **Consistent with site theme**

Test Page Architecture
~~~~~~~~~~~~~~~~~~~~~

* **Component-based** structure
* **API integration** testing
* **State management** for test results
* **Error boundary** integration

Redirect Implementation
~~~~~~~~~~~~~~~~~~~~~~

* **Next.js redirects** in ``getStaticProps``
* **Client-side navigation**
* **URL parameter** handling
* **Browser history** management

Development Workflow
---------------------

Testing Process
~~~~~~~~~~~~~~~

1. **API testing** via api-test page
2. **Math rendering** validation via math-test
3. **Syntax highlighting** checks via code-blocks test
4. **Error handling** verification via 404/500 pages

Debugging Features
~~~~~~~~~~~~~~~~~

* **Console logging** in test pages
* **Error display** in API tests
* **Performance metrics** in math tests
* **Language detection** in code tests

Maintenance Considerations
-------------------------

Regular Updates
~~~~~~~~~~~~~~~~

* **Test cases** for new languages
* **Math examples** for new formulas
* **API endpoints** for new features
* **Error messages** for better UX

Performance Monitoring
~~~~~~~~~~~~~~~~~~~~~~

* **Load time** tracking for error pages
* **API response** time monitoring
* **Math rendering** performance
* **Code highlighting** efficiency

Future Enhancements
-------------------

Planned Features
~~~~~~~~~~~~~~~~

* **Custom error pages** per feature
* **Advanced testing** interface
* **Performance metrics** dashboard
* **Automated testing** integration

Potential Improvements
~~~~~~~~~~~~~~~~~~~~~~

* **Animated error pages**
* **Interactive API documentation**
* **Real-time collaboration** testing
* **Mobile-specific** test pages