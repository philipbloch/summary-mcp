# 🚀 Quick Start Guide

Get up and running with Weekly Summary MCP in 5 minutes.

## Prerequisites

✅ Node.js 18+ installed  
✅ Cursor with MCP support  
✅ Slack MCP configured (`playground-slack-mcp`)  
✅ Google Workspace MCP configured (`gworkspace-mcp`)

## Installation Steps

### 1. Clone & Install (2 minutes)

```bash
cd ~/shopify-projects
git clone https://github.com/philipbloch/weekly-summary-mcp.git
cd weekly-summary-mcp
npm install
```

### 2. Configure (1 minute)

```bash
cp .env.example .env
```

Edit `.env`:
```bash
USER_NAME=Philip Bloch
USER_EMAIL=philip.bloch@shopify.com
USER_SLACK_ID=@philly
```

### 3. Add to Cursor (1 minute)

Edit `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "weekly-summary-mcp": {
      "command": "node",
      "args": ["/Users/philipbloch/shopify-projects/weekly-summary-mcp/src/index.js"]
    },
    "playground-slack-mcp": { ... },
    "gworkspace-mcp": { ... }
  }
}
```

### 4. Restart Cursor (1 minute)

Completely quit and reopen Cursor.

### 5. Test It! (30 seconds)

Open Cursor chat and type:

```
"List my available weekly summary tools"
```

You should see 5 tools available:
- generate_weekly_summary
- list_summaries
- get_summary
- get_quick_stats
- compare_periods

## First Summary

Try generating your first summary:

```
"Generate my weekly summary for the last 7 days"
```

The AI will:
1. Collect data from Slack, Calendar, Gmail
2. Analyze your activity
3. Generate HTML + Markdown summaries
4. Save to `summaries/` directory

## View Your Summary

```bash
open summaries/weekly-summary-*.html
```

Or in Cursor:

```
"Show me my most recent summaries"
```

## Common Commands

**Weekly summary:**
```
"Generate my weekly summary"
```

**Custom time range:**
```
"Generate summary from Oct 1 to Oct 7"
```

**Quick metrics only:**
```
"Get quick stats for last 2 weeks"
```

**Compare periods:**
```
"Compare my last two weeks"
```

**View past summaries:**
```
"List my recent summaries"
"Show me the summary from last week"
```

## Troubleshooting

### Tools not showing up?
- Verify `~/.cursor/mcp.json` path is correct
- Restart Cursor completely (quit, not just reload)
- Check terminal for errors: `DEBUG=true npm start`

### No Slack data?
- Verify `playground-slack-mcp` is working
- Test: "Search my slack messages from last week"

### No Calendar data?
- Verify `gworkspace-mcp` is authenticated
- Test: "List my calendar events today"

### Need help?
- Read full docs: `README.md`
- Tool design: `TOOL_DESIGN.md`
- Slack: @philly

## Next Steps

✅ Generate your first summary  
✅ Explore different time ranges  
✅ Try the compare tool  
✅ Customize `.env` settings  
✅ Share with your team

---

**You're all set!** 🎉

The MCP server runs automatically when Cursor needs it. Just ask for summaries in natural language.

