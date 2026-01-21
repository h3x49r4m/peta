import fs from 'fs-extra';
import path from 'path';

export interface SiteConfig {
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
    linkedin?: string;
    x?: string;
  };
  footer: {
    copyright: string;
    customText?: string;
  };
}

export async function getSiteConfig(): Promise<SiteConfig> {
  try {
    const configPath = path.join(process.cwd(), 'configs', 'site.json');
    
    if (await fs.pathExists(configPath)) {
      const config = await fs.readJson(configPath);
      return config;
    } else {
      // Return default configuration if file doesn't exist
      return {
        site: {
          name: "Peta",
          description: "High-Performance Static Website Engine",
          url: "https://localhost:3000",
          logo: null,
          favicon: null
        },
        author: {
          name: "Peta Team",
          email: "contact@example.com",
          url: null
        },
        social: {
          github: null,
          linkedin: null,
          x: null
        },
        footer: {
          copyright: "© 2024 Peta. All rights reserved.",
          customText: null
        }
      };
    }
  } catch (error) {
    console.error('Error reading site configuration:', error);
    // Return default configuration on error
    return {
      site: {
        name: "Peta",
        description: "High-Performance Static Website Engine",
        url: "https://localhost:3000",
        logo: null,
        favicon: null
      },
      author: {
        name: "Peta Team",
        email: "contact@example.com",
        url: null
      },
      social: {
        github: null,
        linkedin: null,
        x: null
      },
      footer: {
        copyright: "© 2024 Peta. All rights reserved.",
        customText: null
      }
    };
  }
}