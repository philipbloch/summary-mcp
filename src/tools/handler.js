/**
 * Tool call handler
 * Routes tool calls to appropriate implementation
 */

import { generateDailySummary } from './generate-daily-summary.js';
import { generateWeeklySummary } from './generate-summary.js';
import { listSummaries } from './list-summaries.js';
import { getSummary } from './get-summary.js';
import { getQuickStats } from './quick-stats.js';
import { comparePeriods } from './compare-periods.js';

/**
 * Handle a tool call by routing to the appropriate handler
 * @param {string} name - Tool name
 * @param {object} args - Tool arguments
 * @returns {Promise<string>} Tool result as JSON string
 */
export async function handleToolCall(name, args) {
  let result;
  
  switch (name) {
    case 'generate_daily_summary':
      result = await generateDailySummary(args);
      break;
    
    case 'generate_weekly_summary':
      result = await generateWeeklySummary(args);
      break;
    
    case 'list_summaries':
      result = await listSummaries(args);
      break;
    
    case 'get_summary':
      result = await getSummary(args);
      break;
    
    case 'get_quick_stats':
      result = await getQuickStats(args);
      break;
    
    case 'compare_periods':
      result = await comparePeriods(args);
      break;
    
    default:
      throw {
        code: 'UNKNOWN_TOOL',
        message: `Unknown tool: ${name}`,
        details: `Available tools: generate_daily_summary, generate_weekly_summary, list_summaries, get_summary, get_quick_stats, compare_periods`,
      };
  }
  
  // Return JSON string for MCP protocol
  return JSON.stringify(result, null, 2);
}

