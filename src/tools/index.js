/**
 * Tool definitions for Summary MCP
 * Exports all available tools with their JSON schemas
 * 
 * Output formats by tool:
 * - Daily summaries: .md and .html (default: both)
 * - Weekly summaries: .md and .html (default: both)  
 * - Comparisons: .md and .html only (no JSON option)
 */

export const toolDefinitions = [
  {
    name: 'generate_daily_summary',
    description: 'Generate a concise daily productivity summary from today\'s Slack, Calendar, and Gmail activity. Perfect for end-of-day wrap-ups and next-day planning.',
    inputSchema: {
      type: 'object',
      properties: {
        date: {
          type: 'string',
          description: 'Date to summarize in YYYY-MM-DD format (default: today)',
          pattern: '^\\d{4}-\\d{2}-\\d{2}$',
        },
        output_format: {
          type: 'string',
          enum: ['both', 'html', 'markdown', 'json'],
          description: 'Output format(s) to generate (default: both)',
          default: 'both',
        },
        save_to_file: {
          type: 'boolean',
          description: 'Whether to save output to summaries directory (default: true)',
          default: true,
        },
        include_sections: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['meetings', 'communications', 'accomplishments', 'tomorrow'],
          },
          description: 'Sections to include (default: all)',
        },
      },
    },
  },
  {
    name: 'generate_weekly_summary',
    description: 'Generate a comprehensive weekly productivity summary from Slack, Calendar, and Gmail data. Returns structured summary with optional HTML/Markdown output.',
    inputSchema: {
      type: 'object',
      properties: {
        days_back: {
          type: 'integer',
          description: 'Number of days to analyze (default: 7)',
          default: 7,
          minimum: 1,
          maximum: 90,
        },
        start_date: {
          type: 'string',
          description: 'Optional start date in YYYY-MM-DD format (overrides days_back)',
          pattern: '^\\d{4}-\\d{2}-\\d{2}$',
        },
        end_date: {
          type: 'string',
          description: 'Optional end date in YYYY-MM-DD format (default: today)',
          pattern: '^\\d{4}-\\d{2}-\\d{2}$',
        },
        output_format: {
          type: 'string',
          enum: ['both', 'html', 'markdown', 'json'],
          description: 'Output format(s) to generate (default: both)',
          default: 'both',
        },
        save_to_file: {
          type: 'boolean',
          description: 'Whether to save output to summaries directory (default: true)',
          default: true,
        },
        include_sections: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['executive', 'time', 'achievements', 'communication', 'todos', 'insights', 'metrics'],
          },
          description: 'Sections to include (default: all)',
        },
      },
    },
  },
  {
    name: 'list_summaries',
    description: 'List previously generated weekly summaries from the summaries directory.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'integer',
          description: 'Maximum number of summaries to return (default: 10)',
          default: 10,
          minimum: 1,
          maximum: 100,
        },
        sort: {
          type: 'string',
          enum: ['newest', 'oldest'],
          description: 'Sort order (default: newest)',
          default: 'newest',
        },
        format: {
          type: 'string',
          enum: ['all', 'html', 'markdown'],
          description: 'Filter by format (default: all)',
          default: 'all',
        },
      },
    },
  },
  {
    name: 'get_summary',
    description: 'Retrieve a specific weekly summary by filename or date range.',
    inputSchema: {
      type: 'object',
      properties: {
        filename: {
          type: 'string',
          description: 'Filename of the summary to retrieve',
        },
        start_date: {
          type: 'string',
          description: 'Start date to find summary (YYYY-MM-DD)',
          pattern: '^\\d{4}-\\d{2}-\\d{2}$',
        },
        end_date: {
          type: 'string',
          description: 'End date to find summary (YYYY-MM-DD)',
          pattern: '^\\d{4}-\\d{2}-\\d{2}$',
        },
        format: {
          type: 'string',
          enum: ['html', 'markdown', 'both'],
          description: 'Format to retrieve (default: both)',
          default: 'both',
        },
        include_content: {
          type: 'boolean',
          description: 'Include full content or just metadata (default: true)',
          default: true,
        },
      },
    },
  },
  {
    name: 'get_quick_stats',
    description: 'Get quick productivity metrics (Slack, Calendar, Gmail) without generating a full summary. Fast lightweight query.',
    inputSchema: {
      type: 'object',
      properties: {
        days_back: {
          type: 'integer',
          description: 'Number of days to analyze (default: 7)',
          default: 7,
          minimum: 1,
          maximum: 90,
        },
        start_date: {
          type: 'string',
          description: 'Optional start date in YYYY-MM-DD format',
          pattern: '^\\d{4}-\\d{2}-\\d{2}$',
        },
        end_date: {
          type: 'string',
          description: 'Optional end date in YYYY-MM-DD format',
          pattern: '^\\d{4}-\\d{2}-\\d{2}$',
        },
      },
    },
  },
  {
    name: 'compare_periods',
    description: 'Compare productivity statistics between two time periods. Generates comparison reports in HTML and Markdown formats showing trends and changes.',
    inputSchema: {
      type: 'object',
      properties: {
        period1: {
          type: 'object',
          description: 'First period to compare',
          properties: {
            start_date: {
              type: 'string',
              pattern: '^\\d{4}-\\d{2}-\\d{2}$',
            },
            end_date: {
              type: 'string',
              pattern: '^\\d{4}-\\d{2}-\\d{2}$',
            },
          },
          required: ['start_date', 'end_date'],
        },
        period2: {
          type: 'object',
          description: 'Second period to compare',
          properties: {
            start_date: {
              type: 'string',
              pattern: '^\\d{4}-\\d{2}-\\d{2}$',
            },
            end_date: {
              type: 'string',
              pattern: '^\\d{4}-\\d{2}-\\d{2}$',
            },
          },
          required: ['start_date', 'end_date'],
        },
        metrics: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['meetings', 'slack', 'email', 'focus_time', 'all'],
          },
          description: 'Metrics to compare (default: all)',
          default: ['all'],
        },
        output_format: {
          type: 'string',
          enum: ['both', 'html', 'markdown'],
          description: 'Output format(s) to generate (default: both)',
          default: 'both',
        },
        save_to_file: {
          type: 'boolean',
          description: 'Whether to save comparison to summaries directory (default: true)',
          default: true,
        },
      },
      required: ['period1', 'period2'],
    },
  },
];

