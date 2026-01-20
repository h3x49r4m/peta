import { useState, useEffect } from 'react';
import TagFilter from '../../components/TagFilter';
import BookGrid from '../../components/BookGrid';
import BookTOC from '../../components/BookTOC';
import CodeBlock from '../../components/CodeBlock';
import styles from '../../styles/Books.module.css'; // Use Books-specific styles
import MathRenderer from '../../components/MathRenderer';
import Link from 'next/link';
import { useRouter } from 'next/router';
import withFeatureCheck from '../../hocs/withFeatureCheck';

export async function getServerSideProps(context: any) {
  const { query } = context;
  return {
    props: {
      initialBookId: query.book || null,
    },
  };
}

interface BookSection {
  id: string;
  title: string;
  content: any[];
}

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  date: string;
  tags: string[];
  coverImage?: string;
  sections?: BookSection[];
  content?: any[];
}

function BooksPage({ initialBookId }: { initialBookId?: string }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [renderedContent, setRenderedContent] = useState<string>('');
    const [showTOC, setShowTOC] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [loadedSections, setLoadedSections] = useState<Set<string>>(new Set());
  const [snippets, setSnippets] = useState<any[]>([]);
  const [snippetsLoading, setSnippetsLoading] = useState(true);
  const [currentSectionId, setCurrentSectionId] = useState<string>('');

  const router = useRouter();
  
  // Get the book ID from router query (works on both server and client)
  const bookId = (router.query.book as string) || initialBookId;
  useEffect(() => {
    // Always load books content on initial page load
    loadBooksContent();
  }, []);

  useEffect(() => {
    // Check for book parameter in URL after component mounts and books are loaded
    if (books.length > 0 && bookId) {
      console.log('Found book ID in URL:', bookId);
      const book = books.find((b: any) => b.id === bookId);
      console.log('Found matching book:', book);
      if (book) {
        console.log('Setting selected book:', book.title);
        setSelectedBook(book);
        setShowTOC(true);
      } else {
        console.log('Book not found with ID:', bookId);
      }
    }
  }, [books, bookId]);

  useEffect(() => {
    if (selectedBook) {
      console.log('Selected book changed:', selectedBook.title);
      // Reset current section when book changes
      setCurrentSectionId('');
      
      // Set initial section from URL if provided
      if (router.query.section) {
        const sectionId = router.query.section as string;
        if (selectedBook.sections?.find(s => s.id === sectionId)) {
          setCurrentSectionId(sectionId);
        }
      } else {
        // Default to first section if no section specified
        if (selectedBook.sections && selectedBook.sections.length > 0) {
          setCurrentSectionId(selectedBook.sections[0].id);
        }
      }
    }
  }, [selectedBook, router.query.section]);

  useEffect(() => {
    // Handle scroll events for back to top button
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadBooksContent = async () => {
    try {
      const [booksResponse, tagsResponse, snippetsResponse] = await Promise.all([
        fetch('/api/content/book'),
        fetch('/api/tags?type=book'),
        fetch('/api/content/snippet')
      ]);
      
      const booksData = await booksResponse.json();
      const tagsData = await tagsResponse.json();
      const snippetsData = await snippetsResponse.json();
      
      setBooks(booksData);
      setTags(tagsData);
      setSnippets(snippetsData);
      setSnippetsLoading(false);
      return booksData; // Return books for immediate use
    } catch (error) {
      console.error('Error loading books:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = selectedTag
    ? books.filter(book => book.tags.includes(selectedTag))
    : books;

  const handleBackToGrid = () => {
    // Clear the book parameter from URL
    const { book, ...restQuery } = router.query;
    router.push(
      {
        pathname: router.pathname,
        query: restQuery,
      },
      undefined,
      { shallow: true }
    );
    setSelectedBook(null);
    setShowTOC(false);
    setCurrentSectionId('');
  };

  const handleSectionSelect = (sectionId: string) => {
    setCurrentSectionId(sectionId);
    // Update URL with section parameter
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, section: sectionId },
      },
      undefined,
      { shallow: true }
    );
  };

  // Parse RST content (simplified version for now)
  const parseRST = (content: string, sectionId?: string) => {
    // For now, just convert basic RST to HTML
    // This is a placeholder - you might want to use a proper RST parser
    return content
      .replace(/^=+$/gm, (match) => {
        const level = match.length;
        return `<h${Math.min(level, 6)}>`;
      })
      .replace(/^-+$/gm, '<h3>')
      .replace(/^~+$/gm, '<h4>')
      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(.+)$/gm, '<p>$1</p>')
      .replace(/<p><h/g, '<h')
      .replace(/<\/h(\d)><\/p>/g, '</h$1>')
      .replace(/<p><pre>/g, '<pre>')
      .replace(/<\/pre><\/p>/g, '</pre>');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      const offset = 100; // Adjust this value based on your header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollToSnippet = (snippetId: string) => {
    const element = document.getElementById(`snippet-${snippetId}`);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingMessage}>Loading books...</div>
      </div>
    );
  }

  if (selectedBook) {
    // Find the current section
    const sectionIndex = selectedBook.sections?.findIndex(s => s.id === currentSectionId);
    const section = sectionIndex !== -1 && sectionIndex !== undefined 
      ? selectedBook.sections[sectionIndex] 
      : selectedBook.sections?.[0];

    return (
      <div className={styles.pageContainer}>
        <button onClick={handleBackToGrid} className={styles.backButton}>
          ← Back to Books
        </button>
        
        <div className={styles.bookContainer}>
          <div className={styles.bookContent}>
            <h1 className={styles.bookTitle}>{selectedBook.title}</h1>
            <div className={styles.bookMeta}>
              <span className={styles.bookAuthor}>By {selectedBook.author}</span>
              <span className={styles.bookDate}>{selectedBook.date}</span>
              <div className={styles.bookTags}>
                {selectedBook.tags.map(tag => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Render only the current section */}
                                {selectedBook && selectedBook.sections && selectedBook.sections.length > 0 && (() => {

                                  const sectionIndex = selectedBook.sections.findIndex(s => s.id === currentSectionId);
const section = sectionIndex !== -1 ? selectedBook.sections[sectionIndex] : selectedBook.sections[0];

                                  

                                  return (

                                    <section 

                                      key={section.id} 

                                      id={`section-${section.id}`}

                                      className={styles.bookSection}

                                    >
                      <h2>{section.title}</h2>
                      {section.content ? (
                        section.content.map((item, index) => {
                          if (item.type === 'text') {
                            const htmlContent = parseRST(item.content, undefined, section.id);
                            
                            return (
                              <MathRenderer 
                                key={index} 
                                content={htmlContent} 
                                sectionId={section.id}
                              />
                            );
                          } else if (item.type === 'code-block') {
                            return (
                              <CodeBlock
                                key={index}
                                code={item.content}
                                language={item.language || 'text'}
                              />
                            );
                          } else if (item.type === 'snippet-card-ref') {
                            // Find the snippet from loaded snippets
                            const snippetId = item.content;
                            const snippetTitle = snippetId.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
                            
                            // Try to find the snippet in the loaded snippets
                            const snippet = snippets.find((s: any) => {
                              // Check by id
                              if (s.id === snippetId) return true;
                              
                              // Check by snippet_id
                              if (s.frontmatter?.snippet_id === snippetId) return true;
                              
                              // Check by title (exact match)
                              if (s.frontmatter?.title === snippetId) return true;
                              if (s.title === snippetId) return true;
                              
                              // Check by slugified title
                              const snippetSlug = (s.frontmatter?.title || s.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
                              if (snippetSlug === snippetId) return true;
                              
                              // Check partial match
                              const title = (s.frontmatter?.title || s.title || '').toLowerCase();
                              const searchTerm = snippetId.toLowerCase().replace(/-/g, ' ');
                              if (title.includes(searchTerm) || searchTerm.includes(title)) return true;
                              
                              return false;
                            });
                            
                            if (snippet) {
                              return (
                                <div key={index} className={styles.snippetCard}>
                                  <div className={styles.snippetHeader}>
                                    <h3>{snippet.frontmatter?.title || snippet.title || snippetTitle}</h3>
                                    <span className={styles.snippetType}>Snippet</span>
                                  </div>
                                  <div className={styles.snippetContent}>
                                    {snippet.content ? (
                                      snippet.content.map((snippetItem: any, snippetIndex: number) => {
                                        if (snippetItem.type === 'text') {
                                          const snippetHtmlContent = parseRST(snippetItem.content, undefined, snippet.id);
                                          return (
                                            <MathRenderer 
                                              key={snippetIndex} 
                                              content={snippetHtmlContent} 
                                              sectionId={snippet.id}
                                            />
                                          );
                                        } else if (snippetItem.type === 'code-block') {
                                          return (
                                            <CodeBlock
                                              key={snippetIndex}
                                              code={snippetItem.content}
                                              language={snippetItem.language || 'text'}
                                            />
                                          );
                                        }
                                        return null;
                                      }) || <em>No content available</em>
                                    ) : (
                                      <em>No content available</em>
                                    )}
                                  </div>
                                </div>
                              );
                            } else {
                              // Show not found message if snippet is still loading or not found
                              if (snippetsLoading) {
                                return (
                                  <div key={index} className={styles.snippetCard}>
                                    <div className={styles.snippetHeader}>
                                      <h3>Snippet: {snippetTitle}</h3>
                                      <span className={styles.snippetType}>Snippet</span>
                                    </div>
                                    <div className={styles.snippetContent}>
                                      <em>Loading {snippetId}...</em>
                                    </div>
                                  </div>
                                );
                              } else {
                                return (
                                  <div key={index} className={styles.snippetCard}>
                                    <div className={styles.snippetHeader}>
                                      <h3>Snippet not found</h3>
                                      <span className={styles.snippetType}>Error</span>
                                    </div>
                                    <div className={styles.snippetContent}>
                                      <em>Snippet not found: {snippetId}</em>
                                    </div>
                                  </div>
                                );
                              }
                            }
                          } else if (item.type === 'toctree') {
                            // Render table of contents
                            return (
                              <div key={index} className={styles.tocContainer}>
                                <h3>{item.caption}</h3>
                                <ol className={styles.tocList}>
                                  {item.entries.map((entry: any, entryIndex: number) => (
                                    <li key={entryIndex} className={styles.tocItem}>
                                      {entryIndex + 1}. {entry.title}
                                    </li>
                                  ))}
                                </ol>
                              </div>
                            );
                          } else if (item.type === 'embedded-snippet') {
                            // Render the embedded snippet directly
                            const snippetTitle = item.title || item.id;
                            const formattedTitle = snippetTitle.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
                            
                            const snippetId = item.id || `snippet-${index}`;
                            
                            return (
                              <div key={index} className={styles.embeddedSnippet}>
                                <div className={styles.embeddedSnippetHeader}>
                                  <h4>{formattedTitle}</h4>
                                </div>
                                <div className={styles.embeddedSnippetContent}>
                                  {item.content ? (
                                    <pre>
                                      <code>{item.content}</code>
                                    </pre>
                                  ) : (
                                    <em>No content available</em>
                                  )}
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })
                      ) : (
                        <p>No content available for this section.</p>
                      )}
                    </section>
                                  );
                                })()}
          </div>
          
          <BookTOC 
            book={selectedBook}
            snippets={snippets}
            snippetsLoading={snippetsLoading}
            currentSectionId={currentSectionId}
            onSectionSelect={handleSectionSelect}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Books</h1>
        <p className={styles.pageDescription}>
          Collection of books covering various topics in computer science and mathematics
        </p>
      </div>

      {tags.length > 0 && (
        <TagFilter
          tags={tags}
          selectedTag={selectedTag}
          onTagSelect={setSelectedTag}
        />
      )}

      <BookGrid books={filteredBooks} onBookSelect={setSelectedBook} />

      {showBackToTop && (
        <button onClick={scrollToTop} className={styles.backToTop}>
          ↑
        </button>
      )}
    </div>
  );
}

export default withFeatureCheck(BooksPage, { featureName: 'books' });