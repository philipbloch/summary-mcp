#!/bin/bash

# Weekly Summary MCP - Setup Script
# Automates initial setup and configuration

set -e

echo "📊 Weekly Summary MCP - Setup"
echo "=============================="
echo ""

# Check Node.js version
echo "Checking Node.js version..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ required. Found: $(node -v)"
    exit 1
fi
echo "✅ Node.js $(node -v) found"
echo ""

# Install dependencies
echo "Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "✅ .env created - please edit with your details"
    echo ""
    echo "⚠️  ACTION REQUIRED: Edit .env file with your information:"
    echo "   nano .env"
    echo ""
else
    echo "✅ .env file already exists"
    echo ""
fi

# Create summaries directory
mkdir -p summaries
echo "✅ Summaries directory created"
echo ""

# Get absolute path for MCP config
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
INDEX_PATH="${SCRIPT_DIR}/src/index.js"

echo "🔧 MCP Configuration"
echo "===================="
echo ""
echo "Add this to your ~/.cursor/mcp.json:"
echo ""
echo "{"
echo "  \"mcpServers\": {"
echo "    \"weekly-summary-mcp\": {"
echo "      \"command\": \"node\","
echo "      \"args\": [\"${INDEX_PATH}\"]"
echo "    }"
echo "  }"
echo "}"
echo ""

# Check if .env needs editing
if [ -f .env ]; then
    if grep -q "Your Name" .env; then
        echo "⚠️  REMINDER: Edit .env file with your details!"
        echo ""
    fi
fi

echo "📚 Next Steps:"
echo "============="
echo "1. Edit .env with your information (if not done)"
echo "2. Add MCP config to ~/.cursor/mcp.json (shown above)"
echo "3. Restart Cursor"
echo "4. Test: 'Generate my weekly summary' in Cursor chat"
echo ""
echo "✅ Setup complete!"
echo ""
echo "For detailed instructions, see:"
echo "  • QUICKSTART.md"
echo "  • README.md"
echo ""

