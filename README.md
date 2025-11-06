# Summary MCP

> AI-powered daily and weekly productivity summaries from Slack, Calendar, and Gmail

An MCP (Model Context Protocol) server that provides comprehensive productivity summaries by analyzing your Slack messages, Calendar events, and Gmail activity.

## 🌟 Features

- **📅 Daily Summaries**: Concise end-of-day wrap-ups with tomorrow's preview
- **📊 Weekly Summaries**: Comprehensive 7-day productivity analysis
- **⚡ Quick Stats**: Fast metrics without full summary generation
- **📈 Period Comparison**: Compare productivity across different weeks
- **📁 File Management**: List and retrieve past summaries
- **🤖 Automated Generation**: Scheduled daily (Mon-Fri 8:30 AM) and weekly (Mon 9:00 AM) summaries
- **🚫 Smart Filtering**: Automatically excludes personal conversations (sports, politics, entertainment)

## 🚀 Quick Start

### Installation

1. **Clone and setup**:
```bash
cd ~/shopify-projects
git clone <repo-url> summary-mcp
cd summary-mcp
npm install
```

2. **Configure Cursor MCP**:
Add to `~/.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "summary-mcp": {
      "type": "stdio",
      "command": "node",
      "args": ["/Users/philipbloch/shopify-projects/summary-mcp/src/index.js"],
      "env": {}
    }
  }
}
```

3. **Install Automation** (optional):
```bash
./scripts/install-automation.sh
```

This sets up:
- Daily summaries: Monday-Friday at 8:30 AM PT
- Weekly summaries: Mondays at 9:00 AM PT

## 📖 Available Tools

### 1. `generate_daily_summary`
Generate a concise daily productivity summary.

**Parameters**:
- `date` (optional): Date in YYYY-MM-DD format (default: today)
- `output_format`: `html`, `markdown`, `both`, or `json`
- `save_to_file`: Whether to save to summaries folder (default: true)
- `include_sections`: Array of sections to include

**Example**:
```
Generate my daily summary and save to summaries folder
```

### 2. `generate_weekly_summary`
Generate a comprehensive weekly productivity summary.

**Parameters**:
- `days_back` (optional): Number of days to analyze (default: 7)
- `start_date` / `end_date` (optional): Custom date range
- `output_format`: `html`, `markdown`, `both`, or `json`
- `save_to_file`: Whether to save to summaries folder (default: true)

**Example**:
```
Generate my weekly summary for the last 7 days
```

### 3. `get_quick_stats`
Get quick productivity metrics without generating a full summary.

**Parameters**:
- `days_back` (optional): Number of days to analyze (default: 7)
- `start_date` / `end_date` (optional): Custom date range

**Example**:
```
Show me quick stats for the past week
```

### 4. `list_summaries`
List previously generated summaries.

**Parameters**:
- `limit`: Max results (default: 10)
- `sort`: `newest` or `oldest`
- `format`: Filter by `html`, `markdown`, or `all`

### 5. `get_summary`
Retrieve a specific summary by filename or date range.

**Parameters**:
- `filename`: Specific summary file
- `start_date` / `end_date`: Find by date range
- `format`: Return `html`, `markdown`, or `both`

### 6. `compare_periods`
Compare productivity between two time periods.

**Parameters**:
- `period1`: { start_date, end_date }
- `period2`: { start_date, end_date }
- `metrics`: Array of metrics to compare

## 📁 Project Structure

```
summary-mcp/
├── src/
│   ├── index.js              # MCP server entry point
│   ├── config.js             # Configuration
│   ├── tools/
│   │   ├── index.js          # Tool definitions
│   │   ├── handler.js        # Tool routing
│   │   ├── generate-daily-summary.js
│   │   ├── generate-summary.js
│   │   ├── list-summaries.js
│   │   ├── get-summary.js
│   │   ├── quick-stats.js
│   │   └── compare-periods.js
│   ├── analyzers/
│   │   ├── slack-analyzer.js
│   │   ├── calendar-analyzer.js
│   │   └── gmail-analyzer.js
│   └── utils/
│       ├── date-utils.js
│       └── file-utils.js
├── scripts/
│   ├── generate-daily-summary.sh
│   ├── generate-weekly-summary.sh
│   ├── install-automation.sh
│   └── uninstall-automation.sh
├── summaries/                # Generated summaries
├── logs/                     # Automation logs
├── com.philipbloch.dailysummary.plist
├── com.philipbloch.weeklysummary.plist
└── package.json
```

## 🤖 Automation

### Schedules

- **Daily Summary**: Monday-Friday at 8:30 AM PT
- **Weekly Summary**: Mondays at 9:00 AM PT

### Managing Automation

**Install**:
```bash
./scripts/install-automation.sh
```

**Uninstall**:
```bash
./scripts/uninstall-automation.sh
```

**Check Status**:
```bash
launchctl list | grep philipbloch
```

**View Logs**:
```bash
# Daily summary logs
tail -f logs/daily-summary-*.log

# Weekly summary logs
tail -f logs/weekly-summary-*.log

# LaunchD logs
tail -f logs/launchd-daily.out.log
tail -f logs/launchd-weekly.out.log
```

### Manual Trigger

**Daily Summary**:
```bash
./scripts/generate-daily-summary.sh
```

**Weekly Summary**:
```bash
./scripts/generate-weekly-summary.sh
```

## 🛠️ Development

### Running the Server

```bash
# Start the server
npm start

# Development mode with auto-reload
npm run dev
```

### Testing

```bash
npm test
```

### Debug Mode

Set `DEBUG=true` in your environment to enable detailed logging:

```json
{
  "mcpServers": {
    "summary-mcp": {
      "type": "stdio",
      "command": "node",
      "args": ["/Users/philipbloch/shopify-projects/summary-mcp/src/index.js"],
      "env": {
        "DEBUG": "true"
      }
    }
  }
}
```

## 📊 Data Sources

The MCP server integrates with:

1. **Slack MCP**: Messages, threads, reactions
2. **Google Calendar**: Events, attendees, meeting duration
3. **Gmail**: Emails, threads, important contacts

## 🚫 Content Filtering

By default, Summary MCP filters out personal conversations about sports, politics, and entertainment to keep your summaries focused on work.

- **Enabled by default** - Only work-related content in summaries
- **Easily toggle** - Set `CONTENT_FILTERING_ENABLED=false` in `.env` to disable
- **Customizable** - Add your own keywords and topics to filter

See [FILTERING.md](./FILTERING.md) for complete documentation.

## 🎨 Output Formats

### Format Generation Rules

**Daily & Weekly Summaries**: Generate both `.html` and `.md` by default
- Can optionally generate JSON for programmatic access
- Default: `output_format: 'both'`

**Period Comparisons**: Generate both `.html` and `.md` only (no JSON)
- Optimized for human-readable trend analysis
- Default: `output_format: 'both'`

### HTML
Professional, Shopify-branded styling with:
- Syntax highlighting
- Interactive sections
- Visual metrics
- Print-friendly layout
- Perfect for sharing and presentations

### Markdown
Clean, portable text format:
- Easy to edit
- Version control friendly
- Great for notes and documentation
- Plain text searchable

### JSON (Daily/Weekly only)
Structured data for:
- Programmatic access
- Custom processing
- Integration with other tools
- Not available for comparisons

## 🔒 Privacy

All data processing happens locally. The MCP server:
- ✅ Reads data from your connected services
- ✅ Processes summaries locally
- ✅ Saves to your local filesystem
- ❌ Never sends data to external services
- ❌ No cloud processing or storage

## 🐛 Troubleshooting

### Automation not running?

1. Check if jobs are loaded:
```bash
launchctl list | grep philipbloch
```

2. Check logs:
```bash
tail -f logs/launchd-daily.err.log
tail -f logs/launchd-weekly.err.log
```

3. Verify Cursor is running (required for automation)

### Summaries not saving?

Ensure the `summaries` directory exists:
```bash
mkdir -p ~/shopify-projects/summary-mcp/summaries
```

### MCP server not responding?

1. Restart Cursor
2. Check MCP config in `~/.cursor/mcp.json`
3. Verify Node.js is installed: `node --version`

## 📝 License

MIT

## 👤 Author

Philip Bloch <philip.bloch@shopify.com>

---

**Need Help?** Check the [AUTOMATION.md](./AUTOMATION.md) for detailed automation setup and troubleshooting.
