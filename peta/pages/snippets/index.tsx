import { useState, useEffect } from 'react';
import TagFilter from '../../components/TagFilter';
import SnippetGrid from '../../components/SnippetGrid';
import SnippetModal from '../../components/SnippetModal';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../../styles/Snippets.module.css';
import withFeatureCheck from '../../hocs/withFeatureCheck';

interface Snippet {
  id: string;
  title: string;
  description: string;
  tags: string[];
  language: string;
  code: string;
  frontmatter?: {
    title?: string;
    tags?: string[];
    language?: string;
    snippet_id?: string;
  };
}

function SnippetsPage() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadSnippetsContent();
  }, []);

  const loadSnippetsContent = async () => {
    try {
      const [snippetsResponse, tagsResponse] = await Promise.all([
        fetch('/api/content/snippet'),
        fetch('/api/tags?type=snippet')
      ]);
      
      const snippetsData = await snippetsResponse.json();
      const tagsData = await tagsResponse.json();
      
      setSnippets(snippetsData);
      setTags(tagsData);
    } catch (error) {
      console.error('Error loading snippets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSnippets = selectedTag
    ? snippets.filter(snippet => snippet.tags.includes(selectedTag))
    : snippets;

  const handleSnippetClick = (snippet: Snippet) => {
    setSelectedSnippet(snippet);
    // Update URL with snippet parameter
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, snippet: snippet.id },
      },
      undefined,
      { shallow: true }
    );
  };

  const handleCloseModal = () => {
    setSelectedSnippet(null);
    // Remove snippet parameter from URL
    const { snippet, ...restQuery } = router.query;
    router.push(
      {
        pathname: router.pathname,
        query: restQuery,
      },
      undefined,
      { shallow: true }
    );
  };

  // Check for snippet parameter in URL on mount
  useEffect(() => {
    if (router.query.snippet && snippets.length > 0) {
      const snippet = snippets.find(s => s.id === router.query.snippet);
      if (snippet) {
        setSelectedSnippet(snippet);
      }
    }
  }, [router.query.snippet, snippets]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingMessage}>Loading snippets...</div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <Link href="/snippets" className={styles.titleLink}>
          <h1 className={styles.pageTitle}>Code Snippets</h1>
        </Link>
        <p className={styles.pageDescription}>
          Collection of reusable code snippets and examples
        </p>
      </div>

      {tags.length > 0 && (
        <TagFilter
          tags={tags}
          selectedTag={selectedTag}
          onTagSelect={setSelectedTag}
        />
      )}

      <SnippetGrid 
        snippets={filteredSnippets} 
        onSnippetClick={handleSnippetClick} 
      />

      {selectedSnippet && (
        <SnippetModal
          snippet={selectedSnippet}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default withFeatureCheck(SnippetsPage, { featureName: 'snippets' });