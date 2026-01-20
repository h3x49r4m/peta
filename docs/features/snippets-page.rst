Snippets Page Features (``/snippets``)
======================================

Main Purpose
------------

Code snippet gallery with syntax highlighting and modal-based detailed views.

Key Features
-------------

1. Snippet Grid Display
~~~~~~~~~~~~~~~~~~~~~~

* **Card-based layout** for code snippets
* **Language-specific** visual indicators
* **Syntax-highlighted** previews
* **Responsive grid** system
* **Tag-based filtering**

2. Snippet Metadata
~~~~~~~~~~~~~~~~~~~

* **Title and description** display
* **Programming language** identification
* **Date information** with formatting
* **Tag list** for categorization
* **Code preview** snippets

3. Modal Detail View
~~~~~~~~~~~~~~~~~~~~

* **Full code display** with syntax highlighting
* **Copy to clipboard** functionality
* **Line numbers** for reference
* **Language-specific** highlighting
* **Scrollable code** areas

4. Syntax Highlighting
~~~~~~~~~~~~~~~~~~~~~

* **Multi-language** support (20+ languages)
* **Prism.js** integration
* **Theme-aware** highlighting
* **Line wrapping** options
* **Copy-friendly** formatting

5. Tag Filtering
~~~~~~~~~~~~~~~~

* **Dropdown tag selector**
* **Real-time filtering** of snippets
* **Language-specific** tags
* **URL parameter** tracking
* **Clear filter** option

Interactive Elements
--------------------

Snippet Cards
~~~~~~~~~~~~~~

* **Click to open** modal view
* **Hover effects** showing language
* **Code preview** on hover
* **Visual feedback** on selection
* **Keyboard navigation** support

Modal Interaction
~~~~~~~~~~~~~~~~~

* **Full code viewing** in modal
* **Copy to clipboard** button
* **Click outside** to close
* **Escape key** to close
* **Smooth transitions**

Code Interaction
~~~~~~~~~~~~~~~~

* **One-click copy** functionality
* **Line number** toggling
* **Word wrap** toggle
* **Tab size** adjustment
* **Fullscreen** option

URL Structure
--------------

* Snippet list: ``/snippets``
* Specific snippet: ``/snippets?snippet=id``
* Tag filter: ``/snippets?tag=tagname``

Technical Implementation
-----------------------

Dependencies
~~~~~~~~~~~~~

* SnippetGrid component
* SnippetModal component
* TagFilter component
* CodeBlock component
* Snippets API endpoint

State Management
~~~~~~~~~~~~~~~~

* Selected snippet state
* Modal visibility state
* Tag filter state
* Copy feedback state

Syntax Highlighting
~~~~~~~~~~~~~~~~~~

* **Prism.js** core library
* **Language modules** for 20+ languages
* **Dynamic loading** of language support
* **Theme integration** with site styles
* **Performance optimization**

Supported Languages
~~~~~~~~~~~~~~~~~~~

* **Web**: JavaScript, TypeScript, JSX, TSX, CSS, HTML
* **Backend**: Python, Go, Rust, C++, Bash
* **Data**: JSON, YAML, SQL
* **DevOps**: Docker, Nginx
* **Config**: Various configuration formats

Special Features
----------------

Code Display Features
~~~~~~~~~~~~~~~~~~~~

* **Line numbers** for reference
* **Syntax highlighting** with accuracy
* **Copy with** or without line numbers
* **Word wrapping** for long lines
* **Fullscreen mode** for large snippets

Responsive Design
~~~~~~~~~~~~~~~~~

* **Mobile-optimized** code viewing
* **Touch-friendly** modals
* **Adaptive text** sizing
* **Horizontal scrolling** for long lines
* **Readable fonts** at all sizes

Accessibility
~~~~~~~~~~~~~

* **Screen reader** support for code
* **Keyboard navigation** in modals
* **High contrast** themes
* **Focus management** in code blocks
* **ARIA labels** on interactive elements

Content Types Supported
-----------------------

Code Snippets
~~~~~~~~~~~~~~

* **Function definitions**
* **Class implementations**
* **Configuration examples**
* **Algorithm implementations**
* **API usage examples**

Metadata Fields
~~~~~~~~~~~~~~

* **Snippet title** and description
* **Programming language**
* **Creation/update** dates
* **Technology tags**
* **Usage context**

Performance Features
--------------------

Loading Optimization
~~~~~~~~~~~~~~~~~~~~

* **Lazy loading** of syntax highlighters
* **Code splitting** for language modules
* **Efficient rendering** for large snippets
* **Minimal bundle** impact

User Experience
~~~~~~~~~~~~~~

* **Instant feedback** on copy action
* **Smooth transitions** between views
* **Persistent scroll** position
* **Efficient filtering** mechanism