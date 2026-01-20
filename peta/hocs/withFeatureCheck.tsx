import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useFeature } from '../contexts/FeatureContext';
import styles from '../styles/FeatureGuard.module.css';

interface WithFeatureCheckProps {
  featureName: string;
  fallbackPath?: string;
}

const withFeatureCheck = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  { featureName, fallbackPath = '/' }: WithFeatureCheckProps
) => {
  const ComponentWithFeatureCheck = (props: P) => {
    const { isFeatureEnabled, loading } = useFeature();
    const router = useRouter();

    useEffect(() => {
      if (loading) return; // Don't redirect while loading

      if (!isFeatureEnabled(featureName)) {
        router.push(fallbackPath);
      }
    }, [isFeatureEnabled, loading, router]);

    if (loading) {
      return (
        <div className={styles.featureGuard}>
          <div className={styles.loadingMessage}>Loading...</div>
        </div>
      );
    }

    if (!isFeatureEnabled(featureName)) {
      return (
        <div className={styles.featureGuard}>
          <div className={styles.errorMessage}>
            <h2>Feature Not Available</h2>
            <p>This feature is not enabled.</p>
            <button onClick={() => router.push(fallbackPath)}>
              Go Home
            </button>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  ComponentWithFeatureCheck.displayName = `withFeatureCheck(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return ComponentWithFeatureCheck;
};

export default withFeatureCheck;