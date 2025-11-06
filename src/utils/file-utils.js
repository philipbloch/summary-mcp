/**
 * File utility functions
 */

import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import config from '../config.js';

/**
 * Ensure summaries directory exists
 */
export async function ensureSummariesDir() {
  if (!existsSync(config.output.dir)) {
    await fs.mkdir(config.output.dir, { recursive: true });
  }
}

/**
 * Generate filename for summary
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @param {string} format - Format (html or markdown)
 * @returns {string} Filename
 */
export function generateFilename(startDate, endDate, format) {
  const ext = format === 'html' ? 'html' : 'md';
  return `weekly-summary-${startDate}-to-${endDate}.${ext}`;
}

/**
 * Save summary to file
 * @param {string} content - File content
 * @param {string} filename - Filename
 * @returns {string} Full file path
 */
export async function saveSummary(content, filename) {
  await ensureSummariesDir();
  const filePath = path.join(config.output.dir, filename);
  await fs.writeFile(filePath, content, 'utf-8');
  return filePath;
}

/**
 * Read summary from file
 * @param {string} filename - Filename
 * @returns {string} File content
 */
export async function readSummary(filename) {
  const filePath = path.join(config.output.dir, filename);
  return await fs.readFile(filePath, 'utf-8');
}

/**
 * List summary files
 * @param {object} options - { format, sort, limit }
 * @returns {Array} List of file info objects
 */
export async function listSummaryFiles(options = {}) {
  const { format = 'all', sort = 'newest', limit = 10 } = options;
  
  await ensureSummariesDir();
  
  let files = await fs.readdir(config.output.dir);
  
  // Filter by format
  if (format !== 'all') {
    const ext = format === 'html' ? '.html' : '.md';
    files = files.filter(f => f.endsWith(ext));
  } else {
    files = files.filter(f => f.endsWith('.html') || f.endsWith('.md'));
  }
  
  // Filter weekly summary files only
  files = files.filter(f => f.startsWith('weekly-summary-'));
  
  // Get file stats
  const fileInfos = await Promise.all(
    files.map(async (filename) => {
      const filePath = path.join(config.output.dir, filename);
      const stats = await fs.stat(filePath);
      return {
        filename,
        path: filePath,
        created: stats.birthtime,
        modified: stats.mtime,
        size: stats.size,
      };
    })
  );
  
  // Sort
  fileInfos.sort((a, b) => {
    if (sort === 'newest') {
      return b.created - a.created;
    } else {
      return a.created - b.created;
    }
  });
  
  // Limit
  return fileInfos.slice(0, limit);
}

/**
 * Check if file exists
 * @param {string} filename - Filename
 * @returns {boolean} True if exists
 */
export function fileExists(filename) {
  const filePath = path.join(config.output.dir, filename);
  return existsSync(filePath);
}

/**
 * Get file size in bytes
 * @param {string} filename - Filename
 * @returns {number} Size in bytes
 */
export async function getFileSize(filename) {
  const filePath = path.join(config.output.dir, filename);
  const stats = await fs.stat(filePath);
  return stats.size;
}

