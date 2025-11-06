/**
 * Compare Periods Tool
 * Compares statistics between two time periods
 */

import { calculateDateRange } from '../utils/date-utils.js';
import { saveSummary } from '../utils/file-utils.js';
import config from '../config.js';

/**
 * Compare periods
 * @param {object} args - Tool arguments with period1 and period2
 * @returns {object} Result with comparison data
 */
export async function comparePeriods(args) {
  try {
    if (!args.period1 || !args.period2) {
      throw {
        code: 'MISSING_PARAMETER',
        message: 'Both period1 and period2 must be provided',
        details: 'Each period should have start_date and end_date',
      };
    }
    
    // Calculate date ranges for both periods
    const period1Range = calculateDateRange({
      start_date: args.period1.start_date,
      end_date: args.period1.end_date,
    });
    
    const period2Range = calculateDateRange({
      start_date: args.period2.start_date,
      end_date: args.period2.end_date,
    });
    
    const metrics = args.metrics || ['all'];
    const outputFormat = args.output_format || config.defaults.outputFormat || 'both';
    const saveToFile = args.save_to_file !== false;
    
    // Generate comparison instructions
    const instructions = generateComparisonInstructions(period1Range, period2Range, metrics);
    
    const result = {
      success: true,
      message: 'Period comparison initiated. Follow instructions to collect data for both periods.',
      period1: period1Range,
      period2: period2Range,
      metrics_to_compare: metrics,
      output_format: outputFormat,
      save_to_file: saveToFile,
      instructions,
      note: 'This tool helps identify trends by comparing two time periods. Collect the same metrics for both periods, then calculate differences.',
    };
    
    // If comparison data is provided, process it
    if (args.comparison_data) {
      result.comparison = processComparisonData(
        args.comparison_data,
        period1Range,
        period2Range,
        metrics
      );
      
      // Save comparison files if requested
      if (saveToFile && args.comparison_data.html && args.comparison_data.markdown) {
        const files = [];
        const filenameBase = `period-comparison-${period1Range.startDate}-vs-${period2Range.startDate}`;
        
        if (outputFormat === 'both' || outputFormat === 'html') {
          const htmlPath = await saveSummary(
            args.comparison_data.html,
            `${filenameBase}.html`
          );
          files.push(htmlPath);
        }
        
        if (outputFormat === 'both' || outputFormat === 'markdown') {
          const mdPath = await saveSummary(
            args.comparison_data.markdown,
            `${filenameBase}.md`
          );
          files.push(mdPath);
        }
        
        result.files_saved = files;
        result.message = `Period comparison completed and saved to ${files.length} file(s).`;
      }
    }
    
    return result;
    
  } catch (error) {
    if (error.code) {
      throw error;
    }
    throw {
      code: 'COMPARISON_FAILED',
      message: 'Failed to compare periods',
      details: error.message,
    };
  }
}

/**
 * Generate comparison instructions
 */
function generateComparisonInstructions(period1, period2, metrics) {
  const includeAll = metrics.includes('all');
  
  return `
# Period Comparison Instructions

Compare these two periods:
- **Period 1**: ${period1.startDate} to ${period1.endDate} (${period1.days} days)
- **Period 2**: ${period2.startDate} to ${period2.endDate} (${period2.days} days)

## Data to Collect

For each period, gather:

${includeAll || metrics.includes('meetings') ? `
### Meeting Metrics
- Total meeting hours
- Number of meetings
- Average meeting duration
- Meeting hours per day
` : ''}

${includeAll || metrics.includes('slack') ? `
### Slack Metrics
- Total messages sent
- Threads participated in
- Channels active in
- Reactions given/received
` : ''}

${includeAll || metrics.includes('email') ? `
### Email Metrics
- Emails sent
- Emails received
- Response rate
- Top contacts
` : ''}

${includeAll || metrics.includes('focus_time') ? `
### Focus Time Metrics
- Hours of uninterrupted focus time
- Longest focus block
- Focus time percentage
` : ''}

## Analysis

For each metric, calculate:
1. **Absolute change**: Period2 - Period1
2. **Percentage change**: ((Period2 - Period1) / Period1) × 100%
3. **Direction**: increase, decrease, or no change
4. **Normalized values**: Adjust for different period lengths if needed

Identify:
- Significant improvements (>20% positive change)
- Concerning trends (>20% negative change)
- Patterns and insights from the comparison
`;
}

/**
 * Process comparison data
 */
function processComparisonData(data, period1, period2, metrics) {
  const comparison = {
    period1: {
      ...period1,
      stats: data.period1_stats || {},
    },
    period2: {
      ...period2,
      stats: data.period2_stats || {},
    },
    changes: {},
  };
  
  // Calculate changes for each metric
  if (data.period1_stats && data.period2_stats) {
    comparison.changes = calculateChanges(data.period1_stats, data.period2_stats);
  }
  
  return comparison;
}

/**
 * Calculate changes between two stat objects
 */
function calculateChanges(stats1, stats2) {
  const changes = {};
  
  // Helper to calculate change
  const calcChange = (val1, val2, unit = '') => {
    const diff = val2 - val1;
    const percentage = val1 !== 0 ? ((diff / val1) * 100).toFixed(1) : 0;
    const direction = diff > 0 ? 'increase' : diff < 0 ? 'decrease' : 'no change';
    
    return {
      value: `${diff > 0 ? '+' : ''}${diff}${unit}`,
      percentage: `${percentage > 0 ? '+' : ''}${percentage}%`,
      direction,
    };
  };
  
  // Meeting hours
  if (stats1.meeting_hours !== undefined && stats2.meeting_hours !== undefined) {
    changes.meeting_hours = calcChange(stats1.meeting_hours, stats2.meeting_hours, ' hours');
  }
  
  // Slack messages
  if (stats1.slack_messages !== undefined && stats2.slack_messages !== undefined) {
    changes.slack_messages = calcChange(stats1.slack_messages, stats2.slack_messages, ' messages');
  }
  
  // Emails
  if (stats1.emails_sent !== undefined && stats2.emails_sent !== undefined) {
    changes.emails_sent = calcChange(stats1.emails_sent, stats2.emails_sent, ' emails');
  }
  
  // Focus time
  if (stats1.focus_time_hours !== undefined && stats2.focus_time_hours !== undefined) {
    changes.focus_time_hours = calcChange(stats1.focus_time_hours, stats2.focus_time_hours, ' hours');
  }
  
  return changes;
}

