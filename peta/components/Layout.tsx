import Link from 'next/link';
import { ReactNode } from 'react';
import styles from '../styles/Layout.module.css';
import { useFeature } from '../contexts/FeatureContext';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isFeatureEnabled, loading } = useFeature();

  // Don't render navigation until features are loaded
  if (loading) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <nav className={styles.nav}>
            <div className={styles.navBrand}>
              <Link href="/" className={styles.brandLink}>
                Peta
              </Link>
            </div>
          </nav>
        </header>
        <main className={styles.main}>
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <div className={styles.navBrand}>
            <Link href="/" className={styles.brandLink}>
              Peta
            </Link>
          </div>
          
          <ul className={styles.navList}>
            {isFeatureEnabled('books') && (
              <li className={styles.navItem}>
                <Link href="/books" className={styles.navLink}>
                  Books
                </Link>
              </li>
            )}
            {isFeatureEnabled('articles') && (
              <li className={styles.navItem}>
                <Link href="/articles" className={styles.navLink}>
                  Articles
                </Link>
              </li>
            )}
            {isFeatureEnabled('snippets') && (
              <li className={styles.navItem}>
                <Link href="/snippets" className={styles.navLink}>
                  Snippets
                </Link>
              </li>
            )}
            {isFeatureEnabled('projects') && (
              <li className={styles.navItem}>
                <Link href="/projects" className={styles.navLink}>
                  Projects
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </header>

      <main className={styles.main}>
        {children}
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>&copy; 2026 Peta. Built with Next.js and RST.</p>
        </div>
      </footer>
    </div>
  );
}