#!/bin/bash

# Installation script for Summary MCP automation
# Installs both daily and weekly summary jobs
# Author: Philip Bloch

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
LAUNCH_AGENTS_DIR="$HOME/Library/LaunchAgents"

echo "=========================================="
echo "Summary MCP Automation Installation"
echo "=========================================="
echo ""

# Create LaunchAgents directory if it doesn't exist
mkdir -p "$LAUNCH_AGENTS_DIR"

# Unload existing jobs if they exist
echo "Checking for existing jobs..."
if launchctl list | grep -q "com.philipbloch.dailysummary"; then
    echo "  Unloading existing daily summary job..."
    launchctl unload "$LAUNCH_AGENTS_DIR/com.philipbloch.dailysummary.plist" 2>/dev/null || true
fi

if launchctl list | grep -q "com.philipbloch.weeklysummary"; then
    echo "  Unloading existing weekly summary job..."
    launchctl unload "$LAUNCH_AGENTS_DIR/com.philipbloch.weeklysummary.plist" 2>/dev/null || true
fi

# Copy plist files
echo ""
echo "Installing automation files..."
cp "$PROJECT_DIR/com.philipbloch.dailysummary.plist" "$LAUNCH_AGENTS_DIR/"
cp "$PROJECT_DIR/com.philipbloch.weeklysummary.plist" "$LAUNCH_AGENTS_DIR/"
echo "  ✓ Daily summary plist copied"
echo "  ✓ Weekly summary plist copied"

# Load the jobs
echo ""
echo "Loading automation jobs..."
launchctl load "$LAUNCH_AGENTS_DIR/com.philipbloch.dailysummary.plist"
echo "  ✓ Daily summary job loaded"

launchctl load "$LAUNCH_AGENTS_DIR/com.philipbloch.weeklysummary.plist"
echo "  ✓ Weekly summary job loaded"

echo ""
echo "=========================================="
echo "✅ Installation Complete!"
echo "=========================================="
echo ""
echo "Automation Schedule:"
echo "  📅 Daily Summary:  Mon-Fri at 8:30 AM PT"
echo "  📅 Weekly Summary: Mondays at 9:00 AM PT"
echo ""
echo "Verify installation:"
echo "  launchctl list | grep philipbloch"
echo ""
echo "View logs:"
echo "  tail -f $PROJECT_DIR/logs/daily-summary-*.log"
echo "  tail -f $PROJECT_DIR/logs/weekly-summary-*.log"
echo ""

exit 0
