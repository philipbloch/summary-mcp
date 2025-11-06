# Summary MCP Automation Guide

Complete guide to setting up, managing, and troubleshooting automated daily and weekly summary generation.

## 📅 Overview

The Summary MCP includes two automated jobs:

| Job | Schedule | Purpose |
|-----|----------|---------|
| **Daily Summary** | Mon-Fri 8:30 AM PT | End-of-day wrap-up and tomorrow's preview |
| **Weekly Summary** | Mondays 9:00 AM PT | Comprehensive 7-day productivity analysis |

## 🚀 Installation

### Quick Install

Run the installation script:

```bash
cd ~/shopify-projects/summary-mcp
./scripts/install-automation.sh
```

This will:
1. Copy launchd plist files to `~/Library/LaunchAgents`
2. Load both daily and weekly summary jobs
3. Verify installation

### Manual Installation

If you prefer manual setup:

#### 1. Daily Summary Job

```bash
# Copy the plist file
cp ~/shopify-projects/summary-mcp/com.philipbloch.dailysummary.plist \
   ~/Library/LaunchAgents/

# Load the job
launchctl load ~/Library/LaunchAgents/com.philipbloch.dailysummary.plist
```

#### 2. Weekly Summary Job

```bash
# Copy the plist file
cp ~/shopify-projects/summary-mcp/com.philipbloch.weeklysummary.plist \
   ~/Library/LaunchAgents/

# Load the job
launchctl load ~/Library/LaunchAgents/com.philipbloch.weeklysummary.plist
```

## ✅ Verification

### Check Job Status

```bash
# List all loaded jobs
launchctl list | grep philipbloch
```

Expected output:
```
-	0	com.philipbloch.dailysummary
-	0	com.philipbloch.weeklysummary
```

### Check Job Details

```bash
# Daily summary job
launchctl list com.philipbloch.dailysummary

# Weekly summary job
launchctl list com.philipbloch.weeklysummary
```

### View Schedules

```bash
# Daily summary plist
cat ~/Library/LaunchAgents/com.philipbloch.dailysummary.plist

# Weekly summary plist
cat ~/Library/LaunchAgents/com.philipbloch.weeklysummary.plist
```

## 🔄 Management

### Reload Jobs (after config changes)

```bash
# Reload daily summary
launchctl unload ~/Library/LaunchAgents/com.philipbloch.dailysummary.plist
launchctl load ~/Library/LaunchAgents/com.philipbloch.dailysummary.plist

# Reload weekly summary
launchctl unload ~/Library/LaunchAgents/com.philipbloch.weeklysummary.plist
launchctl load ~/Library/LaunchAgents/com.philipbloch.weeklysummary.plist
```

### Stop Jobs Temporarily

```bash
# Stop daily summary
launchctl stop com.philipbloch.dailysummary

# Stop weekly summary
launchctl stop com.philipbloch.weeklysummary
```

### Start Jobs

```bash
# Start daily summary
launchctl start com.philipbloch.dailysummary

# Start weekly summary
launchctl start com.philipbloch.weeklysummary
```

### Uninstall

Run the uninstallation script:

```bash
cd ~/shopify-projects/summary-mcp
./scripts/uninstall-automation.sh
```

Or manually:

```bash
# Unload and remove daily summary
launchctl unload ~/Library/LaunchAgents/com.philipbloch.dailysummary.plist
rm ~/Library/LaunchAgents/com.philipbloch.dailysummary.plist

# Unload and remove weekly summary
launchctl unload ~/Library/LaunchAgents/com.philipbloch.weeklysummary.plist
rm ~/Library/LaunchAgents/com.philipbloch.weeklysummary.plist
```

## 📊 Monitoring

### View Live Logs

```bash
# Daily summary generation log (live)
tail -f ~/shopify-projects/summary-mcp/logs/daily-summary-*.log

# Weekly summary generation log (live)
tail -f ~/shopify-projects/summary-mcp/logs/weekly-summary-*.log

# LaunchD output logs
tail -f ~/shopify-projects/summary-mcp/logs/launchd-daily.out.log
tail -f ~/shopify-projects/summary-mcp/logs/launchd-weekly.out.log
```

### View Error Logs

```bash
# LaunchD errors for daily summary
tail -f ~/shopify-projects/summary-mcp/logs/launchd-daily.err.log

# LaunchD errors for weekly summary
tail -f ~/shopify-projects/summary-mcp/logs/launchd-weekly.err.log
```

### List All Log Files

```bash
ls -lth ~/shopify-projects/summary-mcp/logs/
```

## 🧪 Testing

### Test Daily Summary

Run the daily summary script manually:

```bash
~/shopify-projects/summary-mcp/scripts/generate-daily-summary.sh
```

### Test Weekly Summary

Run the weekly summary script manually:

```bash
~/shopify-projects/summary-mcp/scripts/generate-weekly-summary.sh
```

### Test Automation Trigger

To test if launchd can trigger the jobs, use `RunAtLoad`:

1. Edit the plist file:
```bash
nano ~/Library/LaunchAgents/com.philipbloch.dailysummary.plist
```

2. Change `RunAtLoad` to `true`:
```xml
<key>RunAtLoad</key>
<true/>
```

3. Reload the job:
```bash
launchctl unload ~/Library/LaunchAgents/com.philipbloch.dailysummary.plist
launchctl load ~/Library/LaunchAgents/com.philipbloch.dailysummary.plist
```

4. Check logs immediately:
```bash
tail -f ~/shopify-projects/summary-mcp/logs/launchd-daily.out.log
```

⚠️ **Remember to set `RunAtLoad` back to `false` after testing!**

## 🐛 Troubleshooting

### Issue: Jobs not appearing in list

**Symptoms**: `launchctl list | grep philipbloch` returns nothing

**Solutions**:
1. Check if plist files exist:
   ```bash
   ls -la ~/Library/LaunchAgents/com.philipbloch.*
   ```

2. Verify plist syntax:
   ```bash
   plutil -lint ~/Library/LaunchAgents/com.philipbloch.dailysummary.plist
   ```

3. Check system logs:
   ```bash
   log show --predicate 'subsystem == "com.apple.launchd"' --last 10m
   ```

### Issue: Jobs loaded but not running

**Symptoms**: Jobs appear in list but summaries aren't generated

**Solutions**:

1. **Check Cursor is running**:
   The automation requires Cursor to be running. Start Cursor before the scheduled time.

2. **Verify schedule**:
   ```bash
   defaults read ~/Library/LaunchAgents/com.philipbloch.dailysummary.plist StartCalendarInterval
   ```

3. **Check for errors**:
   ```bash
   tail -20 ~/shopify-projects/summary-mcp/logs/launchd-daily.err.log
   ```

4. **Verify script permissions**:
   ```bash
   ls -l ~/shopify-projects/summary-mcp/scripts/*.sh
   # Should show -rwxr-xr-x (executable)
   ```

   Fix permissions if needed:
   ```bash
   chmod +x ~/shopify-projects/summary-mcp/scripts/*.sh
   ```

### Issue: Script runs but summary not generated

**Symptoms**: Logs show script execution but no summary file created

**Solutions**:

1. **Check summaries directory**:
   ```bash
   mkdir -p ~/shopify-projects/summary-mcp/summaries
   ```

2. **Check MCP configuration**:
   ```bash
   jq '.mcpServers."summary-mcp"' ~/.cursor/mcp.json
   ```

3. **Verify Cursor MCP is working**:
   - Open Cursor
   - Open chat (Cmd+K)
   - Try running a summary manually

4. **Check for AppleScript errors**:
   ```bash
   grep -i "error" ~/shopify-projects/summary-mcp/logs/daily-summary-*.log
   ```

### Issue: Permission denied errors

**Symptoms**: Errors about file permissions or accessibility

**Solutions**:

1. **Grant Cursor accessibility permissions**:
   - System Preferences → Security & Privacy → Privacy → Accessibility
   - Add Cursor to the list

2. **Check script file permissions**:
   ```bash
   chmod +x ~/shopify-projects/summary-mcp/scripts/*.sh
   ```

3. **Verify log directory permissions**:
   ```bash
   ls -ld ~/shopify-projects/summary-mcp/logs
   # Should be writable by you
   ```

### Issue: Wrong timezone

**Symptoms**: Jobs run at unexpected times

**Solutions**:

launchd uses local system time. Verify your timezone:

```bash
# Check system timezone
date
sudo systemsetup -gettimezone

# If needed, set timezone
sudo systemsetup -settimezone America/Los_Angeles
```

### Issue: Jobs run too frequently

**Symptoms**: Multiple executions in short time

**Solutions**:

Check throttle interval in plist:
```xml
<key>ThrottleInterval</key>
<integer>300</integer>  <!-- 5 minutes minimum between runs -->
```

## 🔧 Configuration

### Change Schedule

Edit the plist file and update the `StartCalendarInterval` section:

**Daily Summary** (`com.philipbloch.dailysummary.plist`):
```xml
<key>StartCalendarInterval</key>
<array>
    <!-- Each weekday entry -->
    <dict>
        <key>Weekday</key>
        <integer>1</integer>  <!-- 0=Sunday, 1=Monday, etc. -->
        <key>Hour</key>
        <integer>8</integer>   <!-- 0-23 -->
        <key>Minute</key>
        <integer>30</integer>  <!-- 0-59 -->
    </dict>
    <!-- ... more days ... -->
</array>
```

**Weekly Summary** (`com.philipbloch.weeklysummary.plist`):
```xml
<key>StartCalendarInterval</key>
<dict>
    <key>Weekday</key>
    <integer>1</integer>  <!-- Monday -->
    <key>Hour</key>
    <integer>9</integer>  <!-- 9 AM -->
    <key>Minute</key>
    <integer>0</integer>
</dict>
```

After editing, reload:
```bash
launchctl unload ~/Library/LaunchAgents/com.philipbloch.dailysummary.plist
launchctl load ~/Library/LaunchAgents/com.philipbloch.dailysummary.plist
```

### Change Log Location

Edit the plist files and update these keys:
```xml
<key>StandardOutPath</key>
<string>/path/to/your/logs/output.log</string>

<key>StandardErrorPath</key>
<string>/path/to/your/logs/error.log</string>
```

### Add Email Notifications

You can extend the scripts to send email notifications:

```bash
# Add to generate-daily-summary.sh
if [ $? -eq 0 ]; then
    echo "Daily summary generated" | mail -s "Daily Summary" your@email.com
fi
```

## 📚 Additional Resources

### launchd Documentation

- [launchd.info](https://www.launchd.info/) - Comprehensive guide
- `man launchd`
- `man launchd.plist`
- `man launchctl`

### Useful Commands

```bash
# View all launchd jobs
launchctl list

# Show job info
launchctl info com.philipbloch.dailysummary

# Debug a plist file
launchctl load -w -F ~/Library/LaunchAgents/com.philipbloch.dailysummary.plist

# Remove a job from memory (temporary)
launchctl remove com.philipbloch.dailysummary
```

## 💡 Tips

1. **Keep Cursor Running**: Automation requires Cursor to be open
2. **Check Logs Regularly**: Monitor logs to catch issues early
3. **Test Before Scheduling**: Run scripts manually before relying on automation
4. **Backup Plists**: Keep copies of your plist files in the project directory
5. **Use Notifications**: macOS notifications alert you when summaries are generated

## 🎯 Best Practices

1. **Regular Monitoring**: Check logs weekly
2. **Update Paths**: If you move the project, update plist files
3. **Version Control**: Keep automation configs in git
4. **Document Changes**: Note any customizations you make
5. **Test After Updates**: Verify automation after macOS or Cursor updates

---

**Questions or Issues?** Check the main [README.md](./README.md) or logs directory.
