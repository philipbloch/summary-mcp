#!/bin/bash
# Quick commit and push script for summary-mcp
# Usage: ./scripts/quick-commit.sh "commit message"

cd ~/shopify-projects/summary-mcp

# Check if there are changes
if [ -z "$(git status --porcelain)" ]; then
  echo "✅ No changes to commit"
  exit 0
fi

# Show status
echo "📝 Changes to be committed:"
git status --short
echo ""

# Get commit message from argument or prompt
if [ -z "$1" ]; then
  echo -n "💬 Commit message: "
  read COMMIT_MSG
else
  COMMIT_MSG="$1"
fi

# Validate commit message
if [ -z "$COMMIT_MSG" ]; then
  echo "❌ Commit message cannot be empty"
  exit 1
fi

# Commit and push
echo ""
echo "🔄 Committing changes..."
git add .
git commit -m "$COMMIT_MSG"

echo "⬆️  Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Changes successfully pushed to GitHub!"
echo "🔗 View at: https://github.com/philipbloch/summary-mcp"

