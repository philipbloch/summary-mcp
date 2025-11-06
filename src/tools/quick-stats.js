/**
 * Quick Stats Tool
 * Gets quick productivity metrics without full summary generation
 */

import { calculateDateRange } from '../utils/date-utils.js';
import { getSlackDataInstructions } from '../analyzers/slack-analyzer.js';
import { getCalendarDataInstructions } from '../analyzers/calendar-analyzer.js';
import { getGmailDataInstructions } from '../analyzers/gmail-analyzer.js';

/**
 * Get quick stats
 * @param {object} args - Tool arguments
 * @returns {object} Result with quick statistics
 */
export async function getQuickStats(args) {
  const startTime = Date.now();
  
  try {
    // Calculate date range
    const { startDate, endDate, days } = calculateDateRange(args);
    
    // Generate lightweight data collection instructions
    const instructions = `
# Quick Stats Data Collection

Collect basic metrics for **${startDate} to ${endDate}** (${days} days):

## Slack Metrics
Use mcp_playground-slack-mcp_slack_my_messages:
- Count total messages
- List top 5 channels by activity
- Count threads participated in

## Calendar Metrics  
Use mcp_gworkspace-mcp_calendar_events:
- Count total events
- Calculate total meeting hours
- Identify longest meeting

## Gmail Metrics
Use mcp_gworkspace-mcp_read_mail (lightweight - no body):
- Count emails sent (from:me)
- Count emails received
- List top 3 email contacts

Return raw counts and lists only - no deep analysis needed.
`;
    
    const result = {
      success: true,
      message: 'Quick stats collection initiated. Follow instructions to gather lightweight metrics.',
      period: {
        start: startDate,
        end: endDate,
        days,
      },
      instructions,
      note: 'This tool provides a faster alternative to full summary generation. Collect basic metrics only without detailed analysis.',
    };
    
    // If stats data is provided, structure it
    if (args.stats_data) {
      result.stats = processStatsData(args.stats_data);
    }
    
    result.generation_time_ms = Date.now() - startTime;
    
    return result;
    
  } catch (error) {
    throw {
      code: error.code || 'STATS_FAILED',
      message: error.message || 'Failed to get quick stats',
      details: error.details || error.stack,
    };
  }
}

/**
 * Process collected stats data
 */
function processStatsData(data) {
  return {
    slack: {
      total_messages: data.slack?.total_messages || 0,
      top_channels: data.slack?.top_channels || [],
      threads_participated: data.slack?.threads_participated || 0,
      reactions_given: data.slack?.reactions_given || 0,
      reactions_received: data.slack?.reactions_received || 0,
    },
    calendar: {
      total_events: data.calendar?.total_events || 0,
      total_meeting_hours: data.calendar?.total_meeting_hours || 0,
      average_daily_meetings: data.calendar?.average_daily_meetings || 0,
      longest_meeting_hours: data.calendar?.longest_meeting_hours || 0,
      focus_time_hours: data.calendar?.focus_time_hours || 0,
    },
    email: {
      total_emails: data.email?.total_emails || 0,
      emails_sent: data.email?.emails_sent || 0,
      emails_received: data.email?.emails_received || 0,
      top_contacts: data.email?.top_contacts || [],
    },
  };
}

