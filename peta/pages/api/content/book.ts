import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';
import { parseRstFallback } from '../../../processors/wasm-bindings/rst-parser';

function parseToctree(content: string): string[] {
  const toctreeRegex = /\.\.\s+toctree::([\s\S]*?)(?=\n\S|\n$|$)/g;
  const matches = content.match(toctreeRegex);
  
  if (!matches) return [];
  
  const sections: string[] = [];
  
  for (const match of matches) {
    // Remove the leading ".. toctree::" part
    const toctreeContent = match.replace(/^\.\.\s+toctree::\s*/, '');
    const lines = toctreeContent.split('\n');
    
    let skipNext = false;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip empty lines and options
      if (!trimmedLine || trimmedLine.startsWith(':')) {
        continue;
      }
      
      // Skip lines that don't look like section names
      if (trimmedLine.includes(' ') || trimmedLine.includes('"') || trimmedLine.includes("'")) {
        continue;
      }
      
      sections.push(trimmedLine);
    }
  }
  
  return sections;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const contentDir = path.join(process.cwd(), '../_content/books');
    
    // Check if books directory exists
    if (!(await fs.pathExists(contentDir))) {
      return res.status(200).json([]);
    }
    
    const bookFolders = await fs.readdir(contentDir);
    const books = [];
    
    for (const folder of bookFolders) {
      const folderPath = path.join(contentDir, folder);
      const stat = await fs.stat(folderPath);
      
      if (stat.isDirectory()) {
        const indexPath = path.join(folderPath, 'index.rst');
        
        if (await fs.pathExists(indexPath)) {
          const content = await fs.readFile(indexPath, 'utf-8');
          const parsed = await parseRstFallback(content);
          
          // Parse toctree to get section order
          const toctreeSections = parseToctree(content);
          
          // Read all section files
          const sectionFiles = await glob(`${folderPath}/*.rst`);
          const sectionMap = new Map();
          
          // First, add index.rst as a section
          sectionMap.set('index', {
            id: 'index',
            title: parsed.frontmatter.title || 'Introduction',
            content: parsed.content
          });
          
          // Read all other section files into a map
          for (const sectionFile of sectionFiles) {
            if (!sectionFile.endsWith('index.rst')) {
              const sectionContent = await fs.readFile(sectionFile, 'utf-8');
              const sectionParsed = await parseRstFallback(sectionContent);
              const sectionName = path.basename(sectionFile, '.rst');
              sectionMap.set(sectionName, {
                id: sectionName,
                title: sectionParsed.frontmatter.title || sectionName,
                content: sectionParsed.content
              });
            }
          }
          
          // Build sections array in toctree order
          const sections = [];
          
          // Add index.rst first
          if (sectionMap.has('index')) {
            sections.push(sectionMap.get('index'));
          }
          
          // Then add sections in toctree order
          for (const sectionName of toctreeSections) {
            if (sectionMap.has(sectionName)) {
              sections.push(sectionMap.get(sectionName));
            }
          }
          
          // Add any remaining sections not in toctree
          Array.from(sectionMap.entries()).forEach(([sectionName, section]) => {
            if (sectionName !== 'index' && !toctreeSections.includes(sectionName)) {
              sections.push(section);
            }
          });
          
          books.push({
            id: folder,
            title: parsed.frontmatter.title || 'Untitled',
            author: parsed.frontmatter.author || 'Unknown Author',
            description: parsed.frontmatter.description || '',
            date: parsed.frontmatter.date || new Date().toISOString().split('T')[0],
            tags: parsed.frontmatter.tags || [],
            coverImage: parsed.frontmatter.cover_image || null,
            content: parsed.content,
            sections
          });
        }
      }
    }
    
    res.status(200).json(books);
  } catch (error) {
    console.error('Error loading books:', error);
    res.status(500).json({ error: 'Failed to load books' });
  }
}