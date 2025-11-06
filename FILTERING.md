# Content Filtering

Summary MCP includes intelligent content filtering to focus your summaries on work-related activities and exclude personal conversations.

## 🎯 What Gets Filtered?

The filtering system automatically excludes conversations about:

### Personal Topics
- **Sports**: Football, basketball, baseball, hockey, game scores, sports teams
- **Politics**: Elections, political discussions, partisan topics, government
- **Cultural/Social**: Personal beliefs, cultural debates, social issues
- **Entertainment**: Movies, TV shows, gaming, Netflix
- **Religion**: Religious discussions and personal beliefs

## 🔧 Configuration

### Enable/Disable Filtering

Content filtering is **enabled by default**. To disable it:

1. **Via Environment Variable**:
   ```bash
   # In your .env file
   CONTENT_FILTERING_ENABLED=false
   ```

2. **Temporary Disable** (for one summary):
   Set the env variable before running:
   ```bash
   CONTENT_FILTERING_ENABLED=false npm start
   ```

### Customize Filter Keywords

Edit the filter lists in `src/config.js`:

```javascript
filtering: {
  excludeTopics: [
    'sports',
    'political discussions',
    'politics',
    // Add your own topics...
  ],
  excludeKeywords: [
    'democrat',
    'republican',
    'election',
    // Add your own keywords...
  ],
}
```

## 📊 What This Means for Your Summaries

### With Filtering (Default)
Your summaries will focus on:
- ✅ Work-related Slack discussions
- ✅ Client/merchant conversations
- ✅ Project updates
- ✅ Technical discussions
- ✅ Team collaboration
- ✅ Professional development
- ❌ Personal chit-chat
- ❌ Political debates
- ❌ Sports talk
- ❌ Entertainment discussions

### Without Filtering
Summaries include everything (all messages, all topics).

## 🎛️ How It Works

1. **Keyword Detection**: The AI scans Slack conversations for keywords that indicate personal topics
2. **Topic Classification**: Entire conversation threads are classified as work or personal
3. **Smart Extraction**: For mixed threads (work + personal), only work-relevant portions are extracted
4. **Metric Adjustment**: Message counts and metrics exclude filtered content

## 💡 Examples

### Filtered Out ❌
```
Mac: Did you see the game last night?
You: Yeah, incredible finish! Can't believe they won.
```

```
Javier: What do you think about the election?
You: I think the candidate's policies on...
```

### Kept In ✅
```
James: Can you review the ACME project deck?
You: Sure, I'll take a look this afternoon.
```

```
Gavin: How accurate is your daily summary script?
You: Pretty accurate, I haven't seen any real issues.
```

### Mixed Thread (Partial Extract) ⚠️
```
Thread:
You: "Let me send you the project timeline..."  ← Kept
Mac: "Thanks! By the way, did you watch the game?" ← Filtered
You: "Yeah it was great. Back to the project..." ← Filtered + Kept
```

**Result**: Only the project-related portions appear in your summary.

## 🧪 Testing the Filter

Generate a summary and compare:

```bash
# With filtering (default)
npm start

# Without filtering
CONTENT_FILTERING_ENABLED=false npm start
```

Review the difference in:
- Message counts
- Conversation topics
- Top collaborators
- Time spent on different channels

## 🎓 Best Practices

1. **Default Setting**: Keep filtering enabled for professional summaries
2. **Disable Occasionally**: Turn off filtering if you need a complete activity log
3. **Customize Keywords**: Add company-specific terms to filter (e.g., fantasy leagues, office games)
4. **Review Regularly**: Check filtered summaries to ensure important work discussions aren't excluded

## ⚙️ Advanced Configuration

### Add Custom Topics to Filter

```javascript
// src/config.js
excludeTopics: [
  'sports',
  'politics',
  'your-custom-topic',  // Add here
],
```

### Add Custom Keywords

```javascript
// src/config.js
excludeKeywords: [
  'election',
  'football',
  'your-keyword',  // Add here
],
```

### Case Sensitivity

All keyword matching is **case-insensitive**:
- "Politics" = "politics" = "POLITICS"

### Partial Matching

Keywords match partial words:
- "election" matches "election", "elections", "pre-election"

## 🔍 Troubleshooting

### Important work conversations are being filtered

1. Check if your work discussions use filtered keywords
2. Temporarily disable filtering to see full data
3. Consider removing or adjusting specific keywords in `config.js`

### Personal conversations still appearing

1. Verify `CONTENT_FILTERING_ENABLED=true` in your `.env`
2. Add additional keywords to `excludeKeywords` array
3. The AI may be correctly keeping mixed work/personal threads

### Want to see what was filtered

1. Run a summary without filtering
2. Compare message counts and topics
3. Review the difference in conversation coverage

## 📋 Summary

Content filtering helps you:
- 📊 Get accurate work metrics
- ⏱️ Track actual productive time
- 🎯 Focus on professional accomplishments
- 📝 Create clean summaries for status reports
- 🚫 Exclude personal distractions

Toggle it on/off based on your needs!

---

**Related Documentation**:
- [README.md](./README.md) - Main documentation
- [AUTOMATION.md](./AUTOMATION.md) - Automated summary generation
- [OUTPUT_FORMATS.md](./OUTPUT_FORMATS.md) - Output format details

