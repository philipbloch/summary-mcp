/**
 * Slack data analyzer
 * Collects and analyzes Slack data via MCP
 * 
 * Note: This is a placeholder that assumes the AI agent will call
 * the Slack MCP tools directly. In practice, the generate_weekly_summary
 * tool will instruct the AI to gather this data.
 */

import { config } from '../config.js';

/**
 * Get instructions for AI to collect Slack data
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {string} Instructions for data collection
 */
export function getSlackDataInstructions(startDate, endDate) {
  const filteringEnabled = config.filtering.enabled;
  const excludeTopics = config.filtering.excludeTopics;
  const excludeKeywords = config.filtering.excludeKeywords;

  let filteringInstructions = '';
  
  if (filteringEnabled) {
    filteringInstructions = `

## 🚫 Content Filtering Rules

**IMPORTANT**: Exclude personal conversations about the following topics:
${excludeTopics.map(topic => `- ${topic}`).join('\n')}

When analyzing conversations, **ignore and exclude** any messages or threads that contain discussions about:
${excludeKeywords.map(keyword => `- "${keyword}"`).join('\n')}

**Focus only on**:
- Work-related discussions
- Client/merchant conversations
- Project updates and technical discussions
- Team collaboration and coordination
- Product feedback and feature requests
- Problem-solving and decision-making
- Professional development

If a conversation thread contains both work and personal content, extract only the work-relevant portions.
`;
  }

  return `
# Slack Data Collection Instructions

Please collect the following Slack data for period ${startDate} to ${endDate}:

1. **Your Messages**: Use mcp_playground-slack-mcp_slack_my_messages
   - Set after: "${startDate}"
   - Set before: "${endDate}"
   - Set count: 200

2. **Search for your activity**: Use mcp_playground-slack-mcp_slack_search
   - Query: "from:@me after:${startDate} before:${endDate}"
   - Count: 100
${filteringInstructions}

Analyze and extract:
- Total messages sent (excluding filtered content)
- Channels participated in (with message counts, work-related only)
- Threads participated in (professional topics only)
- Reactions given/received (on work content)
- Top collaborators (people you messaged most about work)
- Key topics discussed (professional/work topics only)
- Important decisions or action items (work-related)
`;
}

/**
 * Analyze Slack data structure
 * @param {object} data - Raw Slack data from MCP
 * @returns {object} Analyzed Slack metrics
 */
export function analyzeSlackData(data) {
  // This function processes raw data if needed
  // For now, we let the AI do the analysis
  return {
    total_messages: data.messages?.length || 0,
    channels: data.channels || [],
    threads: data.threads || [],
    reactions: data.reactions || {},
  };
}

