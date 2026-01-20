import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface FeatureConfig {
  modules: {
    [key: string]: {
      enabled: boolean;
    };
  };
}

interface FeatureContextValue {
  features: FeatureConfig | null;
  isFeatureEnabled: (featureName: string) => boolean;
  loading: boolean;
}

const FeatureContext = createContext<FeatureContextValue | undefined>(undefined);

export const useFeature = () => {
  const context = useContext(FeatureContext);
  if (!context) {
    throw new Error('useFeature must be used within a FeatureProvider');
  }
  return context;
};

interface FeatureProviderProps {
  children: ReactNode;
}

export const FeatureProvider: React.FC<FeatureProviderProps> = ({ children }) => {
  const [features, setFeatures] = useState<FeatureConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeatures = async () => {
      try {
        // In production, the config will be bundled and available at import time
        // In development, we can fetch from the API
        if (process.env.NODE_ENV === 'development') {
          const response = await fetch('/api/config/features');
          if (response.ok) {
            const configData = await response.json();
            setFeatures(configData);
          } else {
            // Default config if fetch fails
            setFeatures({
              modules: {
                books: { enabled: true },
                articles: { enabled: true },
                snippets: { enabled: true },
                projects: { enabled: true }
              }
            });
          }
        } else {
          // In production, try to import the config
          try {
            // This will be replaced by the actual build process
            const config = {
              modules: {
                books: { enabled: true },
                articles: { enabled: true },
                snippets: { enabled: true },
                projects: { enabled: true }
              }
            };
            setFeatures(config);
          } catch (error) {
            console.error('Failed to load features config:', error);
            // Fallback to all enabled
            setFeatures({
              modules: {
                books: { enabled: true },
                articles: { enabled: true },
                snippets: { enabled: true },
                projects: { enabled: true }
              }
            });
          }
        }
      } catch (error) {
        console.error('Failed to load features config:', error);
        // Fallback to all enabled
        setFeatures({
          modules: {
            books: { enabled: true },
            articles: { enabled: true },
            snippets: { enabled: true },
            projects: { enabled: true }
          }
        });
      } finally {
        setLoading(false);
      }
    };

    loadFeatures();
  }, []);

  const isFeatureEnabled = (featureName: string): boolean => {
    if (!features) return true; // Default to enabled if not loaded yet
    return features.modules[featureName]?.enabled !== false;
  };

  return (
    <FeatureContext.Provider value={{ features, isFeatureEnabled, loading }}>
      {children}
    </FeatureContext.Provider>
  );
};