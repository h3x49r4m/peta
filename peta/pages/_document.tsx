import { Html, Head, Main, NextScript } from 'next/document';
import { getSiteConfig } from '../utils/site-config';

export default function Document() {
  // Note: We can't use async functions in _document.tsx
  // This will use static values that should match the defaults in site-config.ts
  const siteName = "Peta";
  const siteDescription = "High-Performance Static Website Engine";
  const siteUrl = "https://localhost:3000";

  return (
    <Html lang="en">
      <Head>
        <meta name="title" content={siteName} />
        <meta name="description" content={siteDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content={siteName} />
        <meta property="og:description" content={siteDescription} />
        <meta property="og:image" content={`${siteUrl}/images/og-image.png`} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={siteUrl} />
        <meta property="twitter:title" content={siteName} />
        <meta property="twitter:description" content={siteDescription} />
        <meta property="twitter:image" content={`${siteUrl}/images/og-image.png`} />
        
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css" />
        <script dangerouslySetInnerHTML={{
          __html: `
            window.katexAutoRender = false;
          `
        }} />
      </Head>
      <body>
        <Main />
        <NextScript />
        <script src="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/contrib/auto-render.min.js"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener("DOMContentLoaded", function() {
              renderMathInElement(document.body, {
                delimiters: [
                  {left: '$$', right: '$$', display: true},
                  {left: '$', right: '$', display: false},
                  {left: '\\\\[', right: '\\\\]', display: true},
                  {left: '\\\\(', right: '\\\\)', display: false}
                ],
                throwOnError: false
              });
            });
          `
        }} />
      </body>
    </Html>
  );
}