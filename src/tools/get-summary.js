/**
 * Get Summary Tool
 * Retrieves a specific summary by filename or date range
 */

import { readSummary, fileExists, getFileSize, generateFilename } from '../utils/file-utils.js';
import { parseDateRangeFromFilename, formatDisplayDate } from '../utils/date-utils.js';

/**
 * Get summary
 * @param {object} args - Tool arguments
 * @returns {object} Result with summary content
 */
export async function getSummary(args) {
  try {
    let filename = args.filename;
    const format = args.format || 'both';
    const includeContent = args.include_content !== false;
    
    // If no filename provided, try to construct from date range
    if (!filename && args.start_date && args.end_date) {
      // Try HTML first, then markdown
      const htmlFilename = generateFilename(args.start_date, args.end_date, 'html');
      const mdFilename = generateFilename(args.start_date, args.end_date, 'markdown');
      
      if (fileExists(htmlFilename)) {
        filename = htmlFilename;
      } else if (fileExists(mdFilename)) {
        filename = mdFilename;
      } else {
        throw {
          code: 'FILE_NOT_FOUND',
          message: 'No summary found for the specified date range',
          details: `Looked for: ${htmlFilename} and ${mdFilename}`,
        };
      }
    }
    
    if (!filename) {
      throw {
        code: 'MISSING_PARAMETER',
        message: 'Either filename or start_date/end_date must be provided',
      };
    }
    
    // Check if file exists
    if (!fileExists(filename)) {
      throw {
        code: 'FILE_NOT_FOUND',
        message: `Summary not found: ${filename}`,
        details: 'Use list_summaries to see available summaries',
      };
    }
    
    // Parse metadata from filename
    const dateRange = parseDateRangeFromFilename(filename);
    const fileFormat = filename.endsWith('.html') ? 'html' : 'markdown';
    const size = await getFileSize(filename);
    
    const result = {
      success: true,
      summary: {
        filename,
        format: fileFormat,
        period: dateRange ? {
          start: dateRange.startDate,
          end: dateRange.endDate,
          display: `${formatDisplayDate(dateRange.startDate)} to ${formatDisplayDate(dateRange.endDate)}`,
        } : null,
        size_bytes: size,
      },
    };
    
    // Include content if requested
    if (includeContent) {
      const content = await readSummary(filename);
      
      if (format === 'both') {
        // Try to read both formats
        if (fileFormat === 'html') {
          result.summary.html_content = content;
          
          // Try to find markdown version
          const mdFilename = filename.replace('.html', '.md');
          if (fileExists(mdFilename)) {
            result.summary.markdown_content = await readSummary(mdFilename);
          }
        } else {
          result.summary.markdown_content = content;
          
          // Try to find HTML version
          const htmlFilename = filename.replace('.md', '.html');
          if (fileExists(htmlFilename)) {
            result.summary.html_content = await readSummary(htmlFilename);
          }
        }
      } else if (format === fileFormat) {
        result.summary.content = content;
      } else {
        throw {
          code: 'FORMAT_MISMATCH',
          message: `Requested format '${format}' but file is '${fileFormat}'`,
          details: `Try requesting format: '${fileFormat}' or 'both'`,
        };
      }
    }
    
    return result;
    
  } catch (error) {
    if (error.code) {
      throw error;
    }
    throw {
      code: 'GET_FAILED',
      message: 'Failed to retrieve summary',
      details: error.message,
    };
  }
}

