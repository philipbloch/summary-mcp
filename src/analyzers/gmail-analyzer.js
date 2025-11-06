/**
 * Gmail data analyzer
 * Collects and analyzes Gmail data via MCP
 */

/**
 * Get instructions for AI to collect Gmail data
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {string} Instructions for data collection
 */
export function getGmailDataInstructions(startDate, endDate) {
  return `
# Gmail Data Collection Instructions

Please collect Gmail data for period ${startDate} to ${endDate}:

1. **Recent Emails**: Use mcp_gworkspace-mcp_read_mail
   - Set query: "after:${startDate.replace(/-/g, '/')} before:${endDate.replace(/-/g, '/')}"
   - Set max_results: 50
   - Set include_body: false (for performance)

2. **Sent Emails**: Use mcp_gworkspace-mcp_read_mail
   - Set query: "from:me after:${startDate.replace(/-/g, '/')} before:${endDate.replace(/-/g, '/')}"
   - Set max_results: 50

Analyze and extract:
- Total emails received
- Total emails sent
- Top senders/recipients
- Important threads (based on labels, stars, importance)
- Action items from emails
- Key topics or subjects
`;
}

/**
 * Analyze Gmail data structure
 * @param {object} data - Raw Gmail data from MCP
 * @returns {object} Analyzed Gmail metrics
 */
export function analyzeGmailData(data) {
  return {
    total_received: data.received?.length || 0,
    total_sent: data.sent?.length || 0,
    important_threads: data.important || [],
  };
}

