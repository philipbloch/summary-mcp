# Weekly Summary MCP - Tool Interface Design

## Overview
MCP server that generates AI-powered weekly productivity summaries by analyzing Slack, Calendar, and Gmail data.

## Tool Interfaces

### 1. `generate_weekly_summary`
**Purpose:** Generate a comprehensive weekly summary with optional customization

**Parameters:**
```json
{
  "days_back": {
    "type": "integer",
    "description": "Number of days to analyze (default: 7)",
    "default": 7,
    "minimum": 1,
    "maximum": 90
  },
  "start_date": {
    "type": "string",
    "description": "Optional start date in YYYY-MM-DD format (overrides days_back)",
    "format": "date",
    "optional": true
  },
  "end_date": {
    "type": "string", 
    "description": "Optional end date in YYYY-MM-DD format (default: today)",
    "format": "date",
    "optional": true
  },
  "output_format": {
    "type": "string",
    "enum": ["both", "html", "markdown", "json"],
    "description": "Output format(s) to generate (default: both)",
    "default": "both"
  },
  "save_to_file": {
    "type": "boolean",
    "description": "Whether to save output to summaries directory (default: true)",
    "default": true
  },
  "include_sections": {
    "type": "array",
    "items": {
      "type": "string",
      "enum": ["executive", "time", "achievements", "communication", "todos", "insights", "metrics"]
    },
    "description": "Sections to include (default: all)",
    "optional": true
  }
}
```

**Returns:**
```json
{
  "success": true,
  "summary": {
    "period": {
      "start": "2025-10-29",
      "end": "2025-11-05",
      "days": 7
    },
    "executive_summary": "...",
    "sections": {
      "time_allocation": { ... },
      "achievements": [ ... ],
      "communication_patterns": { ... },
      "outstanding_todos": [ ... ],
      "insights": [ ... ],
      "metrics": { ... }
    },
    "html": "...",  // Full HTML if requested
    "markdown": "...",  // Full Markdown if requested
    "files_saved": [
      "summaries/weekly-summary-2025-10-29-to-2025-11-05.html",
      "summaries/weekly-summary-2025-10-29-to-2025-11-05.md"
    ]
  },
  "generation_time_ms": 45230,
  "data_sources": {
    "slack_messages": 156,
    "calendar_events": 23,
    "emails": 89
  }
}
```

---

### 2. `list_summaries`
**Purpose:** List previously generated summaries

**Parameters:**
```json
{
  "limit": {
    "type": "integer",
    "description": "Maximum number of summaries to return (default: 10)",
    "default": 10,
    "minimum": 1,
    "maximum": 100
  },
  "sort": {
    "type": "string",
    "enum": ["newest", "oldest"],
    "description": "Sort order (default: newest)",
    "default": "newest"
  },
  "format": {
    "type": "string",
    "enum": ["all", "html", "markdown"],
    "description": "Filter by format (default: all)",
    "default": "all",
    "optional": true
  }
}
```

**Returns:**
```json
{
  "success": true,
  "summaries": [
    {
      "filename": "weekly-summary-2025-10-29-to-2025-11-05.html",
      "path": "/Users/philipbloch/summaries/weekly-summary-2025-10-29-to-2025-11-05.html",
      "format": "html",
      "period": {
        "start": "2025-10-29",
        "end": "2025-11-05",
        "days": 7
      },
      "created": "2025-11-05T10:30:00Z",
      "size_bytes": 47234,
      "preview": "Productive week with successful Fashionphile engagement..."
    }
  ],
  "total_count": 24
}
```

---

### 3. `get_summary`
**Purpose:** Retrieve a specific summary by filename or date range

**Parameters:**
```json
{
  "filename": {
    "type": "string",
    "description": "Filename of the summary to retrieve",
    "optional": true
  },
  "start_date": {
    "type": "string",
    "description": "Start date to find summary (YYYY-MM-DD)",
    "format": "date",
    "optional": true
  },
  "end_date": {
    "type": "string",
    "description": "End date to find summary (YYYY-MM-DD)",
    "format": "date", 
    "optional": true
  },
  "format": {
    "type": "string",
    "enum": ["html", "markdown", "both"],
    "description": "Format to retrieve (default: both)",
    "default": "both"
  },
  "include_content": {
    "type": "boolean",
    "description": "Include full content or just metadata (default: true)",
    "default": true
  }
}
```

**Returns:**
```json
{
  "success": true,
  "summary": {
    "filename": "weekly-summary-2025-10-29-to-2025-11-05.html",
    "path": "/Users/philipbloch/summaries/weekly-summary-2025-10-29-to-2025-11-05.html",
    "format": "html",
    "period": {
      "start": "2025-10-29",
      "end": "2025-11-05",
      "days": 7
    },
    "created": "2025-11-05T10:30:00Z",
    "size_bytes": 47234,
    "content": "<!DOCTYPE html>...",  // Full content if requested
    "markdown_content": "# Weekly Summary..."  // If both formats requested
  }
}
```

---

### 4. `get_quick_stats`
**Purpose:** Get quick productivity metrics without generating full summary

**Parameters:**
```json
{
  "days_back": {
    "type": "integer",
    "description": "Number of days to analyze (default: 7)",
    "default": 7,
    "minimum": 1,
    "maximum": 90
  },
  "start_date": {
    "type": "string",
    "description": "Optional start date in YYYY-MM-DD format",
    "format": "date",
    "optional": true
  },
  "end_date": {
    "type": "string",
    "description": "Optional end date in YYYY-MM-DD format",
    "format": "date",
    "optional": true
  }
}
```

**Returns:**
```json
{
  "success": true,
  "period": {
    "start": "2025-10-29",
    "end": "2025-11-05",
    "days": 7
  },
  "stats": {
    "slack": {
      "total_messages": 156,
      "threads_participated": 34,
      "reactions_given": 45,
      "reactions_received": 67,
      "top_channels": ["#sa-team", "#client-fashionphile", "#ai-tools"]
    },
    "calendar": {
      "total_events": 23,
      "total_meeting_hours": 15.5,
      "average_daily_meetings": 2.2,
      "longest_meeting_hours": 2.0,
      "focus_time_hours": 8.5
    },
    "email": {
      "total_emails": 89,
      "emails_sent": 34,
      "emails_received": 55,
      "top_contacts": ["client@example.com", "teammate@shopify.com"]
    }
  },
  "generation_time_ms": 8500
}
```

---

### 5. `compare_periods`
**Purpose:** Compare statistics across different time periods

**Parameters:**
```json
{
  "period1": {
    "type": "object",
    "properties": {
      "start_date": { "type": "string", "format": "date" },
      "end_date": { "type": "string", "format": "date" }
    },
    "description": "First period to compare"
  },
  "period2": {
    "type": "object",
    "properties": {
      "start_date": { "type": "string", "format": "date" },
      "end_date": { "type": "string", "format": "date" }
    },
    "description": "Second period to compare"
  },
  "metrics": {
    "type": "array",
    "items": {
      "type": "string",
      "enum": ["meetings", "slack", "email", "focus_time", "all"]
    },
    "description": "Metrics to compare (default: all)",
    "default": ["all"]
  }
}
```

**Returns:**
```json
{
  "success": true,
  "comparison": {
    "period1": {
      "start": "2025-10-22",
      "end": "2025-10-28",
      "days": 7,
      "stats": { ... }
    },
    "period2": {
      "start": "2025-10-29",
      "end": "2025-11-05",
      "days": 7,
      "stats": { ... }
    },
    "changes": {
      "meeting_hours": {
        "value": "+3.5 hours",
        "percentage": "+29%",
        "direction": "increase"
      },
      "slack_messages": {
        "value": "-23 messages",
        "percentage": "-13%",
        "direction": "decrease"
      }
    }
  }
}
```

---

## Configuration

The MCP server reads configuration from environment variables or `.env` file:

```bash
# User Information
USER_NAME=Your Name
USER_EMAIL=your.email@example.com
USER_SLACK_ID=@yourslackid

# Defaults
DEFAULT_DAYS_BACK=7
TIMEZONE=America/Toronto

# Output
OUTPUT_DIR=./summaries
AUTO_SAVE=true

# MCP Dependencies
SLACK_MCP_SERVER=playground-slack-mcp
CALENDAR_MCP_SERVER=gworkspace-mcp
```

## Error Handling

All tools return consistent error format:
```json
{
  "success": false,
  "error": {
    "code": "MISSING_DATA_SOURCE",
    "message": "Could not connect to Slack MCP server",
    "details": "Ensure 'playground-slack-mcp' is configured in mcp.json",
    "tool": "generate_weekly_summary"
  }
}
```

Common error codes:
- `MISSING_DATA_SOURCE` - Required MCP server not available
- `INVALID_DATE_RANGE` - Invalid date parameters
- `NO_DATA_FOUND` - No data available for period
- `GENERATION_FAILED` - AI summary generation failed
- `FILE_NOT_FOUND` - Requested summary doesn't exist
- `INVALID_FORMAT` - Invalid format parameter

## Usage Examples

### In Cursor Chat:
```
"Generate my weekly summary for the last 7 days"
"Show me my past summaries"
"Get quick stats for last month"
"Compare my last two weeks"
"Generate a summary from Oct 1 to Oct 7 in markdown only"
```

### Tool Call Examples:
```javascript
// Generate default weekly summary
mcp_weekly_summary_generate_weekly_summary({ days_back: 7 })

// Custom date range
mcp_weekly_summary_generate_weekly_summary({ 
  start_date: "2025-10-01", 
  end_date: "2025-10-07",
  output_format: "markdown"
})

// Get quick stats only
mcp_weekly_summary_get_quick_stats({ days_back: 30 })

// List recent summaries
mcp_weekly_summary_list_summaries({ limit: 5, sort: "newest" })
```

