#!/bin/bash

# Uninstallation script for Summary MCP automation
# Removes both daily and weekly summary jobs
# Author: Philip Bloch

set -e

LAUNCH_AGENTS_DIR="$HOME/Library/LaunchAgents"

echo "=========================================="
echo "Summary MCP Automation Uninstallation"
echo "=========================================="
echo ""

# Unload and remove daily summary job
if [ -f "$LAUNCH_AGENTS_DIR/com.philipbloch.dailysummary.plist" ]; then
    echo "Removing daily summary job..."
    launchctl unload "$LAUNCH_AGENTS_DIR/com.philipbloch.dailysummary.plist" 2>/dev/null || true
    rm "$LAUNCH_AGENTS_DIR/com.philipbloch.dailysummary.plist"
    echo "  ✓ Daily summary job removed"
else
    echo "  ℹ️  Daily summary job not found"
fi

# Unload and remove weekly summary job
if [ -f "$LAUNCH_AGENTS_DIR/com.philipbloch.weeklysummary.plist" ]; then
    echo "Removing weekly summary job..."
    launchctl unload "$LAUNCH_AGENTS_DIR/com.philipbloch.weeklysummary.plist" 2>/dev/null || true
    rm "$LAUNCH_AGENTS_DIR/com.philipbloch.weeklysummary.plist"
    echo "  ✓ Weekly summary job removed"
else
    echo "  ℹ️  Weekly summary job not found"
fi

echo ""
echo "=========================================="
echo "✅ Uninstallation Complete!"
echo "=========================================="
echo ""
echo "Verify removal:"
echo "  launchctl list | grep philipbloch"
echo ""

exit 0
