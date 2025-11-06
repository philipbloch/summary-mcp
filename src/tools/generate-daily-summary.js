/**
 * Generate Daily Summary Tool
 * Tool for generating concise daily productivity summaries
 */

import { calculateDateRange, formatDisplayDate } from '../utils/date-utils.js';
import { saveSummary, generateFilename } from '../utils/file-utils.js';
import { getSlackDataInstructions } from '../analyzers/slack-analyzer.js';
import { getCalendarDataInstructions } from '../analyzers/calendar-analyzer.js';
import { getGmailDataInstructions } from '../analyzers/gmail-analyzer.js';
import config from '../config.js';

/**
 * Generate daily summary
 * @param {object} args - Tool arguments
 * @returns {object} Result with summary data
 */
export async function generateDailySummary(args) {
  const startTime = Date.now();
  
  try {
    // Get the date (default to today)
    const targetDate = args.date || new Date().toISOString().split('T')[0];
    const startDate = targetDate;
    const endDate = targetDate;
    
    const outputFormat = args.output_format || config.defaults.outputFormat;
    const saveToFile = args.save_to_file !== false;
    const includeSections = args.include_sections || ['meetings', 'communications', 'accomplishments', 'tomorrow'];
    
    // Generate data collection instructions for the AI
    const instructions = generateDailyDataCollectionInstructions(targetDate);
    
    // Generate summary template
    const summaryTemplate = generateDailySummaryTemplate(targetDate, includeSections);
    
    // Prepare response structure
    const result = {
      success: true,
      message: 'Daily summary generation initiated. Please follow the data collection instructions below.',
      date: targetDate,
      instructions,
      template: summaryTemplate,
      output_format: outputFormat,
      save_to_file: saveToFile,
      note: 'This tool provides instructions for the AI agent to collect today\'s data and generate a concise daily summary.',
    };
    
    // If the AI has already collected data (passed in args), process it
    if (args.collected_data) {
      result.summary = await processDailySummaryData(args.collected_data, targetDate, includeSections);
      
      // Save to file if requested
      if (saveToFile) {
        const files = [];
        
        if (outputFormat === 'both' || outputFormat === 'html') {
          const htmlFilename = `daily-summary-${targetDate}.html`;
          const htmlPath = await saveSummary(result.summary.html, htmlFilename);
          files.push(htmlPath);
        }
        
        if (outputFormat === 'both' || outputFormat === 'markdown') {
          const mdFilename = `daily-summary-${targetDate}.md`;
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
      message: error.message || 'Failed to generate daily summary',
      details: error.details || error.stack,
    };
  }
}

/**
 * Generate data collection instructions for daily summary
 */
function generateDailyDataCollectionInstructions(date) {
  return `
# Daily Summary Data Collection

To generate a daily productivity summary for **${formatDisplayDate(date)}**, please collect data from the following sources:

${getSlackDataInstructions(date, date)}

${getCalendarDataInstructions(date, date)}

${getGmailDataInstructions(date, date)}

## Daily Summary Focus

For daily summaries, focus on:
- **Today's key meetings** and outcomes
- **Important Slack conversations** and decisions
- **Email highlights** - critical communications
- **Accomplishments** - what got done today
- **Tomorrow's prep** - what's coming up

## Analysis Guidelines

- Keep it concise (1-2 minutes to read)
- Focus on actionable items and decisions
- Highlight what needs follow-up
- Note any blockers or concerns
- Preview tomorrow's calendar
`;
}

/**
 * Generate daily summary template structure
 */
function generateDailySummaryTemplate(date, sections) {
  const template = {
    date: date,
    display: formatDisplayDate(date),
    sections: {},
  };
  
  if (sections.includes('meetings')) {
    template.sections.meetings = {
      total: 0,
      hours: 0,
      key_meetings: [],
      outcomes: [],
    };
  }
  
  if (sections.includes('communications')) {
    template.sections.communications = {
      slack_messages: 0,
      important_threads: [],
      emails: 0,
      key_contacts: [],
    };
  }
  
  if (sections.includes('accomplishments')) {
    template.sections.accomplishments = [
      'Key accomplishments and completed tasks',
    ];
  }
  
  if (sections.includes('tomorrow')) {
    template.sections.tomorrow = {
      upcoming_meetings: [],
      action_items: [],
      prep_needed: [],
    };
  }
  
  return template;
}

/**
 * Process collected data into final daily summary
 */
async function processDailySummaryData(data, date, sections) {
  // This would process the collected data
  // For now, return a structure that the AI will populate
  return {
    date: date,
    sections: data.sections || {},
    html: data.html || '',
    markdown: data.markdown || '',
  };
}

