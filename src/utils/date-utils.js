/**
 * Date utility functions
 */

/**
 * Calculate date range from parameters
 * @param {object} params - Parameters with days_back, start_date, end_date
 * @returns {object} { startDate, endDate, days }
 */
export function calculateDateRange(params = {}) {
  const { days_back, start_date, end_date } = params;
  
  let startDate, endDate;
  
  // Use provided dates if available
  if (start_date && end_date) {
    startDate = new Date(start_date);
    endDate = new Date(end_date);
  } else if (start_date) {
    startDate = new Date(start_date);
    endDate = new Date();
  } else if (end_date) {
    endDate = new Date(end_date);
    const daysBack = days_back || 7;
    startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - daysBack);
  } else {
    // Default: use days_back from today
    const daysBack = days_back || 7;
    endDate = new Date();
    startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);
  }
  
  // Validate dates
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw {
      code: 'INVALID_DATE_RANGE',
      message: 'Invalid date format',
      details: 'Dates must be in YYYY-MM-DD format',
    };
  }
  
  if (startDate >= endDate) {
    throw {
      code: 'INVALID_DATE_RANGE',
      message: 'Start date must be before end date',
      details: `start: ${formatDate(startDate)}, end: ${formatDate(endDate)}`,
    };
  }
  
  const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  
  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    days,
  };
}

/**
 * Format date as YYYY-MM-DD
 * @param {Date} date - Date object
 * @returns {string} Formatted date
 */
export function formatDate(date) {
  return date.toISOString().split('T')[0];
}

/**
 * Format date for display
 * @param {string} dateStr - Date string (YYYY-MM-DD)
 * @returns {string} Formatted date (e.g., "Nov 5, 2025")
 */
export function formatDisplayDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format datetime for ISO string
 * @param {Date} date - Date object
 * @returns {string} ISO string
 */
export function formatDateTime(date) {
  return date.toISOString();
}

/**
 * Parse filename to extract date range
 * @param {string} filename - Filename like "weekly-summary-2025-10-29-to-2025-11-05.html"
 * @returns {object|null} { startDate, endDate } or null if not parseable
 */
export function parseDateRangeFromFilename(filename) {
  const match = filename.match(/weekly-summary-(\d{4}-\d{2}-\d{2})-to-(\d{4}-\d{2}-\d{2})/);
  if (!match) return null;
  
  return {
    startDate: match[1],
    endDate: match[2],
  };
}

