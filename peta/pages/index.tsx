import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SearchBar from '../components/SearchBar';
import ContentGrid from '../components/ContentGrid';
import styles from '../styles/Home.module.css';

interface SiteConfig {
  site: {
    name: string;
    description: string;
    url: string;
    logo?: string;
    favicon?: string;
  };
  author: {
    name: string;
    email: string;
    url?: string;
  };
  social: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    x?: string;
  };
  footer: {
    copyright: string;
    customText?: string;
  };
}

interface ContentItem {
  id: string;
  title: string;
  excerpt?: string;
  date: string;
  tags: string[];
  type: 'post' | 'snippet' | 'project';
}

interface TagData {
  name: string;
  count: number;
}

export default function Home() {
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<ContentItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [articlesTags, setArticlesTags] = useState<TagData[]>([]);
  const [snippetsTags, setSnippetsTags] = useState<TagData[]>([]);
  const [projectsTags, setProjectsTags] = useState<TagData[]>([]);
  const [booksTags, setBooksTags] = useState<TagData[]>([]);
  const [tagsLoading, setTagsLoading] = useState(true);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [configLoading, setConfigLoading] = useState(true);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/api/config/site');
        const config = await response.json();
        setSiteConfig(config);
      } catch (error) {
        console.error('Error loading site configuration:', error);
      } finally {
        setConfigLoading(false);
      }
    };

    const loadTags = async () => {
      try {
        const [articlesResponse, snippetsResponse, projectsResponse, booksResponse] = await Promise.all([
          fetch('/api/tags?type=post'),
          fetch('/api/tags?type=snippet'),
          fetch('/api/tags?type=project'),
          fetch('/api/tags?type=book')
        ]);
        
        const articlesData = await articlesResponse.json();
        const snippetsData = await snippetsResponse.json();
        const projectsData = await projectsResponse.json();
        const booksData = await booksResponse.json();
        
        // Sort tags by count (descending)
        const sortTags = (tags: TagData[]) => 
          tags.sort((a, b) => b.count - a.count);
        
        setArticlesTags(sortTags(articlesData));
        setSnippetsTags(sortTags(snippetsData));
        setProjectsTags(sortTags(projectsData));
        setBooksTags(sortTags(booksData));
      } catch (error) {
        console.error('Error loading tags:', error);
      } finally {
        setTagsLoading(false);
      }
    };

    loadConfig();
    loadTags();
  }, []);

  // Reset search state when navigating to the home page
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (url === '/') {
        setSearchQuery('');
        setSearchResults([]);
        setIsSearching(false);
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (!query) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const results = await response.json();
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    handleSearch(tag);
  };

  const renderTagCloud = () => {
    // Combine all tags from different content types
    const allTags = new Map<string, number>();
    
    articlesTags.forEach(tag => {
      allTags.set(tag.name, (allTags.get(tag.name) || 0) + tag.count);
    });
    
    snippetsTags.forEach(tag => {
      allTags.set(tag.name, (allTags.get(tag.name) || 0) + tag.count);
    });
    
    projectsTags.forEach(tag => {
      allTags.set(tag.name, (allTags.get(tag.name) || 0) + tag.count);
    });
    
    booksTags.forEach(tag => {
      allTags.set(tag.name, (allTags.get(tag.name) || 0) + tag.count);
    });
    
    // Convert to array and sort by count (descending)
    const sortedTags = Array.from(allTags.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
    
    if (sortedTags.length === 0) return null;
    
    return (
      <div className={styles.tagCloud}>
        {sortedTags.map((tag) => {
          const fontSize = Math.max(0.7, Math.min(1.2, 0.7 + (tag.count / 20) * 0.5));
          return (
            <button
              key={tag.name}
              onClick={() => handleTagClick(tag.name)}
              className={styles.tag}
              style={{ fontSize: `${fontSize}rem` }}
              aria-label={`Search for ${tag.name}`}
            >
              {tag.name} ({tag.count})
            </button>
          );
        })}
      </div>
    );
  };

  if (configLoading || !siteConfig) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <section className={styles.heroSection}>
        <h1 className={styles.heroTitle}>
          Welcome to {siteConfig.site.name}
        </h1>
        <p className={styles.heroDescription}>
          {siteConfig.site.description}
        </p>
      </section>

      <section className={styles.searchSection}>
        <SearchBar 
          value={searchQuery}
          onSearch={handleSearch} 
        />
      </section>

      {tagsLoading ? (
        <div className={styles.loading}>
          <p>Loading tags...</p>
        </div>
      ) : (
        <section className={styles.tagsSection}>
          {renderTagCloud()}
        </section>
      )}

      {isSearching && (
        <section className={styles.searchResults}>
          <h2 className={styles.sectionTitle}>Search Results</h2>
          <ContentGrid items={searchResults} />
        </section>
      )}
    </div>
  );
}