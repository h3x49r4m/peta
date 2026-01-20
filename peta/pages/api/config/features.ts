import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs-extra';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const configPath = path.join(process.cwd(), 'configs/features.json');
    
    if (await fs.pathExists(configPath)) {
      const configData = await fs.readFile(configPath, 'utf-8');
      const config = JSON.parse(configData);
      res.status(200).json(config);
    } else {
      // Default config if file doesn't exist
      const defaultConfig = {
        modules: {
          books: { enabled: true },
          articles: { enabled: true },
          snippets: { enabled: true },
          projects: { enabled: true }
        }
      };
      res.status(200).json(defaultConfig);
    }
  } catch (error) {
    console.error('Error loading features config:', error);
    // Return default config on error
    const defaultConfig = {
      modules: {
        books: { enabled: true },
        articles: { enabled: true },
        snippets: { enabled: true },
        projects: { enabled: true }
      }
    };
    res.status(200).json(defaultConfig);
  }
}