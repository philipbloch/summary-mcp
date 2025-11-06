#!/bin/bash

# Daily Summary Generator Script
# Runs every weekday at 8:30am PT
# Author: Philip Bloch

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
LOG_DIR="$PROJECT_DIR/logs"
SUMMARIES_DIR="$PROJECT_DIR/summaries"

# Create directories if they don't exist
mkdir -p "$LOG_DIR"
mkdir -p "$SUMMARIES_DIR"

# Set log file with timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
LOG_FILE="$LOG_DIR/daily-summary-$TIMESTAMP.log"

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "=========================================="
log "Daily Summary Generation Started"
log "=========================================="

# Check if Cursor is running
if pgrep -x "Cursor" > /dev/null; then
    log "✓ Cursor is running"
else
    log "⚠️  Cursor is not running - summary generation may fail"
    log "   Please ensure Cursor is running with MCP servers configured"
fi

# Get today's date
TODAY=$(date +"%Y-%m-%d")

log "Date: $TODAY"

# Create AppleScript to run in Cursor
log "Generating daily summary via Cursor..."

osascript <<EOF
tell application "Cursor"
    activate
    delay 1
end tell

tell application "System Events"
    keystroke "k" using {command down}
    delay 1
    keystroke "Generate my daily summary and save to summaries folder"
    delay 0.5
    keystroke return
end tell
EOF

if [ $? -eq 0 ]; then
    log "✓ Daily summary generation command sent to Cursor"
    log "  Check Cursor chat for progress and results"
else
    log "✗ Failed to send command to Cursor"
    exit 1
fi

log "=========================================="
log "Daily Summary Generation Completed"
log "=========================================="
log "Log saved to: $LOG_FILE"

# Optional: Send notification
osascript -e 'display notification "Daily summary generation initiated. Check Cursor for results." with title "Daily Summary Bot"'

exit 0

