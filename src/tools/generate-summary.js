/**
 * Generate Weekly Summary Tool
 * Main tool for generating comprehensive weekly summaries
 */

import { calculateDateRange, formatDisplayDate } from '../utils/date-utils.js';
import { saveSummary, generateFilename } from '../utils/file-utils.js';
import { getSlackDataInstructions } from '../analyzers/slack-analyzer.js';
import { getCalendarDataInstructions } from '../analyzers/calendar-analyzer.js';
import { getGmailDataInstructions } from '../analyzers/gmail-analyzer.js';
import config from '../config.js';

/**
 * Generate weekly summary
 * @param {object} args - Tool arguments
 * @returns {object} Result with summary data
 */
export async function generateWeeklySummary(args) {
  const startTime = Date.now();
  
  try {
    // Calculate date range
    const { startDate, endDate, days } = calculateDateRange(args);
    
    const outputFormat = args.output_format || config.defaults.outputFormat;
    const saveToFile = args.save_to_file !== false;
    const includeSections = args.include_sections || ['executive', 'time', 'achievements', 'communication', 'todos', 'insights', 'metrics'];
    
    // Generate data collection instructions for the AI
    const instructions = generateDataCollectionInstructions(startDate, endDate);
    
    // Generate summary template
    const summaryTemplate = generateSummaryTemplate(startDate, endDate, days, includeSections);
    
    // Prepare response structure
    const result = {
      success: true,
      message: 'Weekly summary generation initiated. Please follow the data collection instructions below.',
      period: {
        start: startDate,
        end: endDate,
        days,
      },
      instructions,
      template: summaryTemplate,
      output_format: outputFormat,
      save_to_file: saveToFile,
      note: 'This tool provides instructions for the AI agent to collect data and generate the summary. The AI will make multiple MCP calls to gather Slack, Calendar, and Gmail data, then synthesize it into a comprehensive summary.',
    };
    
    // If the AI has already collected data (passed in args), process it
    if (args.collected_data) {
      result.summary = await processSummaryData(args.collected_data, startDate, endDate, days, includeSections);
      
      // Save to file if requested
      if (saveToFile) {
        const files = [];
        
        if (outputFormat === 'both' || outputFormat === 'html') {
          const htmlFilename = generateFilename(startDate, endDate, 'html');
          const htmlPath = await saveSummary(result.summary.html, htmlFilename);
          files.push(htmlPath);
        }
        
        if (outputFormat === 'both' || outputFormat === 'markdown') {
          const mdFilename = generateFilename(startDate, endDate, 'markdown');
          const mdPath = await saveSummary(result.summary.markdown, mdFilename);
          files.push(mdPath);
        }
        
        result.files_saved = files;
      }
    }
    
    result.generation_time_ms = Date.now() - startTime;
    
    return result;
    
  } catch (error) {
    throw {
      code: error.code || 'GENERATION_FAILED',
      message: error.message || 'Failed to generate summary',
      details: error.details || error.stack,
    };
  }
}

/**
 * Generate data collection instructions
 */
function generateDataCollectionInstructions(startDate, endDate) {
  return `
# Weekly Summary Data Collection

To generate a comprehensive weekly summary for **${formatDisplayDate(startDate)} to ${formatDisplayDate(endDate)}**, please collect data from the following sources:

${getSlackDataInstructions(startDate, endDate)}

${getCalendarDataInstructions(startDate, endDate)}

${getGmailDataInstructions(startDate, endDate)}

## Next Steps

1. Make the necessary MCP tool calls to collect data from each source
2. Analyze the data to identify:
   - Key achievements and wins
   - Time allocation patterns
   - Communication trends
   - Outstanding action items
   - Insights and learnings
3. Synthesize the findings into the summary template provided
4. Generate both HTML and Markdown output formats

## Important Notes

- Focus on **actionable insights** and **meaningful patterns**
- Highlight **achievements** and **accomplishments**
- Identify **blockers** and **challenges** that need attention
- Extract **concrete action items** from messages and emails
- Provide **context** for metrics and statistics
`;
}

/**
 * Generate summary template structure
 */
function generateSummaryTemplate(startDate, endDate, days, sections) {
  const template = {
    period: {
      start: startDate,
      end: endDate,
      days,
      display: `${formatDisplayDate(startDate)} to ${formatDisplayDate(endDate)}`,
    },
    sections: {},
  };
  
  if (sections.includes('executive')) {
    template.sections.executive_summary = 'High-level overview of the week in 2-3 sentences';
  }
  
  if (sections.includes('time')) {
    template.sections.time_allocation = {
      total_meeting_hours: 0,
      total_events: 0,
      average_daily_meetings: 0,
      focus_time_hours: 0,
      meeting_breakdown: [],
    };
  }
  
  if (sections.includes('achievements')) {
    template.sections.achievements = [
      'List of key wins and accomplishments',
    ];
  }
  
  if (sections.includes('communication')) {
    template.sections.communication_patterns = {
      slack: {
        total_messages: 0,
        top_channels: [],
        threads_participated: 0,
      },
      email: {
        total_sent: 0,
        total_received: 0,
        top_contacts: [],
      },
    };
  }
  
  if (sections.includes('todos')) {
    template.sections.outstanding_todos = [
      'Action items that need follow-up',
    ];
  }
  
  if (sections.includes('insights')) {
    template.sections.insights = [
      'Key learnings and observations',
    ];
  }
  
  if (sections.includes('metrics')) {
    template.sections.metrics = {
      productivity_score: 0,
      collaboration_score: 0,
      focus_time_percentage: 0,
    };
  }
  
  return template;
}

/**
 * Process collected data into final summary
 */
async function processSummaryData(data, startDate, endDate, days, sections) {
  // This would process the collected data
  // For now, return a structure that the AI will populate
  return {
    executive_summary: data.executive_summary || '',
    sections: data.sections || {},
    html: data.html || '',
    markdown: data.markdown || '',
  };
}

