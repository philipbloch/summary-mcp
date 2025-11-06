/**
 * Calendar data analyzer
 * Collects and analyzes Calendar data via MCP
 */

/**
 * Get instructions for AI to collect Calendar data
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {string} Instructions for data collection
 */
export function getCalendarDataInstructions(startDate, endDate) {
  return `
# Calendar Data Collection Instructions

Please collect calendar data for period ${startDate} to ${endDate}:

1. **Calendar Events**: Use mcp_gworkspace-mcp_calendar_events
   - Set calendar_id: "primary"
   - Set time_min: "${startDate}T00:00:00Z"
   - Set time_max: "${endDate}T23:59:59Z"
   - Set max_results: 100
   - Set include_attendees: true

Analyze and extract:
- Total number of meetings/events
- Total meeting hours
- Average meeting duration
- Longest meeting
- Meeting distribution by day
- Top meeting attendees/collaborators
- Types of meetings (1:1s, team meetings, client calls, etc.)
- Focus time blocks (gaps between meetings)
`;
}

/**
 * Analyze Calendar data structure
 * @param {object} data - Raw Calendar data from MCP
 * @returns {object} Analyzed Calendar metrics
 */
export function analyzeCalendarData(data) {
  return {
    total_events: data.events?.length || 0,
    total_hours: data.totalHours || 0,
    meetings: data.events || [],
  };
}

