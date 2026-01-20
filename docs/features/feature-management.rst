Feature Management System
=========================

Overview
--------

Peta implements a sophisticated feature flag system that allows dynamic enabling/disabling of content modules. This system provides flexibility for different deployment scenarios and user preferences.

Architecture
-----------

Core Components
~~~~~~~~~~~~~~~~

.. code-block:: text

   FeatureContext (Global State)
       ↓
   withFeatureCheck HOC (Page Protection)
       ↓
   FeatureGuard (UI Components)
       ↓
   Layout (Conditional Navigation)

Configuration Flow
~~~~~~~~~~~~~~~~~~~

1. **Config File** → ``features.json``
2. **API Endpoint** → ``/api/config/features``
3. **Context Provider** → ``FeatureProvider``
4. **HOC Protection** → ``withFeatureCheck``
5. **UI Updates** → Conditional rendering

Configuration File
-------------------

Location: ``/peta/configs/features.json``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: json

   {
     "modules": {
       "books": { "enabled": true },
       "articles": { "enabled": true },
       "snippets": { "enabled": true },
       "projects": { "enabled": true }
     }
   }

Structure
~~~~~~~~~

* **modules**: Top-level object containing all features
* **feature name**: Key identifying the feature
* **enabled**: Boolean flag controlling feature visibility

Feature Context
----------------

FeatureProvider Component
~~~~~~~~~~~~~~~~~~~~~~~~

**Purpose**: Global state management for feature flags

**Features**:

* **Context provision** for entire app
* **API integration** for dynamic loading
* **Fallback configuration** for errors
* **Loading state** management

**State Management**:

.. code-block:: typescript

   {
     features: FeatureConfig | null,
     loading: boolean,
     error: string | null
   }

useFeature Hook
~~~~~~~~~~~~~~~

**Purpose**: Access feature state in components

**Returns**:

.. code-block:: typescript

   {
     isFeatureEnabled: (feature: string) => boolean,
     features: FeatureConfig | null,
     loading: boolean
   }

Higher-Order Component (HOC)
----------------------------

withFeatureCheck
~~~~~~~~~~~~~~~~

**Purpose**: Page-level feature gating and protection

**Usage**:

.. code-block:: typescript

   export default withFeatureCheck(MyPage, { 
     featureName: 'books',
     fallbackPath: '/'
   });

**Features**:

* **Route protection** based on features
* **Automatic redirection** when disabled
* **Loading state** handling
* **Custom fallback** paths

**Parameters**:

* ``featureName``: String identifier for the feature
* ``fallbackPath``: Redirect path when feature is disabled (default: ``/``)

Feature Guard Component
----------------------

FeatureGuard UI
~~~~~~~~~~~~~~~

**Purpose**: User-friendly disabled feature messages

**Features**:

* **Consistent styling** with site theme
* **Clear messaging** about disabled features
* **Navigation options** to enabled features
* **Responsive design**

**Usage**:

.. code-block:: typescript

   <FeatureGuard featureName="books">
     <BooksPage />
   </FeatureGuard>

Layout Integration
------------------

Conditional Navigation
~~~~~~~~~~~~~~~~~~~~~

**Purpose**: Update navigation based on enabled features

**Implementation**:

* **Dynamic menu items** based on features
* **Active state** management
* **Responsive layout** adaptation
* **SEO-friendly** markup

**Navigation Logic**:

.. code-block:: typescript

   const navigationItems = [
     { href: '/books', label: 'Books', feature: 'books' },
     { href: '/articles', label: 'Articles', feature: 'articles' },
     { href: '/snippets', label: 'Snippets', feature: 'snippets' },
     { href: '/projects', label: 'Projects', feature: 'projects' }
   ].filter(item => isFeatureEnabled(item.feature));

API Integration
---------------

Features API Endpoint
~~~~~~~~~~~~~~~~~~~~~

**Path**: ``/api/config/features``

**Features**:

* **JSON configuration** serving
* **Error handling** with defaults
* **CORS support** for development
* **Caching headers** for performance

**Error Handling**:

* **File not found**: Returns default configuration
* **Invalid JSON**: Returns default configuration
* **Network errors**: Client-side fallback

Implementation Details
-----------------------

Page Protection
~~~~~~~~~~~~~~~~

Each main page is wrapped with ``withFeatureCheck``:

.. code-block:: typescript

   // books/index.tsx
   export default withFeatureCheck(BooksPage, { featureName: 'books' });

   // articles/index.tsx
   export default withFeatureCheck(ArticlesPage, { featureName: 'articles' });

   // snippets/index.tsx
   export default withFeatureCheck(SnippetsPage, { featureName: 'snippets' });

   // projects/index.tsx
   export default withFeatureCheck(ProjectsPage, { featureName: 'projects' });

Loading States
~~~~~~~~~~~~~~

* **Initial load**: Shows loading indicator
* **Feature check**: Brief loading during validation
* **Error state**: Graceful fallback to defaults

Error Handling
~~~~~~~~~~~~~~

* **Config file missing**: Uses default all-enabled configuration
* **Invalid JSON**: Logs error and uses defaults
* **Network errors**: Client-side retry mechanism

Use Cases
---------

Deployment Scenarios
~~~~~~~~~~~~~~~~~~~~

1. **Full Feature Site**: All modules enabled
2. **Blog-Only Site**: Only articles enabled
3. **Documentation Site**: Books and snippets enabled
4. **Portfolio Site**: Projects and snippets enabled

Development Scenarios
~~~~~~~~~~~~~~~~~~~~~

1. **Feature Development**: Disable other features for focus
2. **A/B Testing**: Enable features for specific users
3. **Gradual Rollout**: Enable features incrementally
4. **Maintenance Mode**: Disable features during updates

Performance Considerations
---------------------------

Optimization Features
~~~~~~~~~~~~~~~~~~~~~

* **Single API call** for feature configuration
* **Context caching** to prevent re-fetches
* **Minimal re-renders** with memoization
* **Lazy loading** of feature-dependent components

Bundle Impact
~~~~~~~~~~~~~

* **Tree shaking** for unused features
* **Code splitting** by feature
* **Dynamic imports** for optional components
* **Minimal runtime** overhead

Security Considerations
-----------------------

Access Control
~~~~~~~~~~~~~~

* **Server-side configuration** (not client-controllable)
* **Build-time validation** of feature config
* **Sanitization** of feature names
* **Rate limiting** on features API

Data Validation
~~~~~~~~~~~~~~

* **Schema validation** for configuration
* **Type checking** at runtime
* **Default fallbacks** for safety
* **Error logging** for debugging

Future Enhancements
-------------------

Planned Features
~~~~~~~~~~~~~~~~

1. **User-specific features** based on authentication
2. **A/B testing** framework integration
3. **Feature analytics** and usage tracking
4. **Dynamic feature** toggling without restart

Potential Improvements
~~~~~~~~~~~~~~~~~~~~~~

1. **Granular permissions** within features
2. **Feature dependencies** management
3. **Time-based** feature activation
4. **Geographic** feature distribution