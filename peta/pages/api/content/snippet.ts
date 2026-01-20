import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs-extra';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Correct path - data is in _build/data
    const dataDir = path.join(process.cwd(), '../_build/data');
    const snippetsIndexPath = path.join(dataDir, 'snippets-index.json');
    
    if (!await fs.pathExists(snippetsIndexPath)) {
      return res.status(404).json({ error: 'Snippets not found' });
    }
    
    const snippetsIndex = await fs.readJson(snippetsIndexPath);
    res.status(200).json(snippetsIndex.items);
  } catch (error) {
    console.error('Error loading snippets:', error);
    res.status(500).json({ error: 'Failed to load snippets' });
  }
}