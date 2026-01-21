import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs-extra';
import path from 'path';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const configPath = path.join(process.cwd(), 'configs', 'site.json');
    
    if (await fs.pathExists(configPath)) {
      const config = await fs.readJson(configPath);
      res.status(200).json(config);
    } else {
      // Return default configuration if file doesn't exist
      const defaultConfig = {
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
      res.status(200).json(defaultConfig);
    }
  } catch (error) {
    console.error('Error reading site configuration:', error);
    res.status(500).json({ error: 'Failed to read site configuration' });
  }
}