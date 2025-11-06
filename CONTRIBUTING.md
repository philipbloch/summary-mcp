# Contributing to Summary MCP

## Keeping the Repository Updated

This guide helps you maintain and update the summary-mcp repository.

## Quick Update Workflow

### 1. Check Status
```bash
cd ~/shopify-projects/summary-mcp
git status
```

### 2. Stage Changes
```bash
# Stage all changes
git add .

# Or stage specific files
git add src/index.js README.md
```

### 3. Commit Changes
```bash
git commit -m "Description of changes"
```

### 4. Push to GitHub
```bash
git push origin main
```

## Common Update Scenarios

### Adding New Features

```bash
# Create a feature branch (optional but recommended)
git checkout -b feature/new-analyzer

# Make your changes...

# Stage and commit
git add .
git commit -m "feat: Add new Gmail analyzer"

# Push to GitHub
git push origin feature/new-analyzer

# Merge back to main (or create PR on GitHub)
git checkout main
git merge feature/new-analyzer
git push origin main
```

### Fixing Bugs

```bash
git checkout -b fix/timezone-issue
# Make fixes...
git add .
git commit -m "fix: Correct timezone handling in daily summary"
git push origin fix/timezone-issue
```

### Updating Documentation

```bash
git add README.md AUTOMATION.md
git commit -m "docs: Update installation instructions"
git push origin main
```

## Commit Message Conventions

Use conventional commit format:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

**Examples**:
```bash
git commit -m "feat: Add period comparison tool"
git commit -m "fix: Handle empty Slack responses"
git commit -m "docs: Update README with troubleshooting section"
git commit -m "refactor: Simplify date utilities"
```

## Automated Update Script

You can use this helper script to quickly commit and push changes:

```bash
#!/bin/bash
# Save as: scripts/quick-commit.sh

cd ~/shopify-projects/summary-mcp

# Check if there are changes
if [ -z "$(git status --porcelain)" ]; then
  echo "No changes to commit"
  exit 0
fi

# Show status
echo "Changes to be committed:"
git status --short

# Get commit message from argument or prompt
if [ -z "$1" ]; then
  echo -n "Commit message: "
  read COMMIT_MSG
else
  COMMIT_MSG="$1"
fi

# Commit and push
git add .
git commit -m "$COMMIT_MSG"
git push origin main

echo "✅ Changes pushed to GitHub!"
```

**Usage**:
```bash
chmod +x scripts/quick-commit.sh
./scripts/quick-commit.sh "feat: Add new feature"
```

## Syncing with Remote

### Pull Latest Changes
```bash
git pull origin main
```

### Fetch and Check Differences
```bash
git fetch origin
git diff main origin/main
```

## Undoing Changes

### Undo Last Commit (keep changes)
```bash
git reset --soft HEAD~1
```

### Discard Local Changes
```bash
git checkout -- filename.js
# Or discard all changes
git checkout -- .
```

### Revert a Commit
```bash
git revert <commit-hash>
git push origin main
```

## Branch Management

### List Branches
```bash
git branch -a
```

### Delete Local Branch
```bash
git branch -d feature/old-feature
```

### Delete Remote Branch
```bash
git push origin --delete feature/old-feature
```

## Best Practices

1. **Commit Often**: Make small, focused commits
2. **Write Clear Messages**: Describe what and why, not how
3. **Test Before Pushing**: Ensure code works locally
4. **Pull Before Push**: Sync with remote before pushing
5. **Use Branches**: For significant changes, use feature branches
6. **Review Changes**: Use `git diff` before committing

## Troubleshooting

### Push Rejected
```bash
# Pull and merge first
git pull origin main
# Resolve conflicts if any
git push origin main
```

### Merge Conflicts
```bash
# View conflicted files
git status

# Edit files to resolve conflicts
# Look for <<<<<<< HEAD markers

# Mark as resolved
git add resolved-file.js
git commit
```

### Need Help?
```bash
# View commit history
git log --oneline

# View changes in a commit
git show <commit-hash>

# View remote repository
git remote show origin
```

## Repository Information

- **Repository**: https://github.com/philipbloch/summary-mcp
- **Main Branch**: `main`
- **Remote**: `origin`

## Maintenance Checklist

- [ ] Update version in `package.json` for releases
- [ ] Update CHANGELOG.md for significant changes
- [ ] Test automation after major changes
- [ ] Update documentation to reflect new features
- [ ] Tag releases: `git tag v2.1.0 && git push --tags`

---

For more Git help, see: https://git-scm.com/docs

