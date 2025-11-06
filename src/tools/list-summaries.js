/**
 * List Summaries Tool
 * Lists previously generated summaries
 */

import { listSummaryFiles } from '../utils/file-utils.js';
import { parseDateRangeFromFilename, formatDisplayDate } from '../utils/date-utils.js';

/**
 * List summaries
 * @param {object} args - Tool arguments
 * @returns {object} Result with list of summaries
 */
export async function listSummaries(args) {
  try {
    const limit = args.limit || 10;
    const sort = args.sort || 'newest';
    const format = args.format || 'all';
    
    // Get file list
    const files = await listSummaryFiles({ format, sort, limit });
    
    // Build summary list with metadata
    const summaries = files.map(file => {
      const dateRange = parseDateRangeFromFilename(file.filename);
      const fileFormat = file.filename.endsWith('.html') ? 'html' : 'markdown';
      
      // Extract preview (would need to read file for actual preview)
      const preview = dateRange 
        ? `Summary for ${formatDisplayDate(dateRange.startDate)} to ${formatDisplayDate(dateRange.endDate)}`
        : 'Weekly summary';
      
      return {
        filename: file.filename,
        path: file.path,
        format: fileFormat,
        period: dateRange ? {
          start: dateRange.startDate,
          end: dateRange.endDate,
          days: Math.ceil((new Date(dateRange.endDate) - new Date(dateRange.startDate)) / (1000 * 60 * 60 * 24)),
        } : null,
        created: file.created.toISOString(),
        size_bytes: file.size,
        preview,
      };
    });
    
    return {
      success: true,
      summaries,
      total_count: summaries.length,
      filters: {
        format,
        sort,
        limit,
      },
    };
    
  } catch (error) {
    throw {
      code: 'LIST_FAILED',
      message: 'Failed to list summaries',
      details: error.message,
    };
  }
}

