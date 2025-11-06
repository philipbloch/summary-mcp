/**
 * Configuration module for Weekly Summary MCP
 * Loads environment variables and provides default values
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');

export const config = {
  // User information
  user: {
    name: process.env.USER_NAME || 'User',
    email: process.env.USER_EMAIL || '',
    slackId: process.env.USER_SLACK_ID || '',
  },

  // Default settings
  defaults: {
    daysBack: parseInt(process.env.DEFAULT_DAYS_BACK || '7', 10),
    timezone: process.env.TIMEZONE || 'America/Toronto',
    outputFormat: 'both', // html, markdown, both
  },

  // Output configuration
  output: {
    dir: process.env.OUTPUT_DIR || join(PROJECT_ROOT, 'summaries'),
    autoSave: process.env.AUTO_SAVE !== 'false',
  },

  // MCP server names (must match mcp.json configuration)
  mcpServers: {
    slack: process.env.SLACK_MCP_SERVER || 'playground-slack-mcp',
    calendar: process.env.CALENDAR_MCP_SERVER || 'gworkspace-mcp',
    gmail: process.env.GMAIL_MCP_SERVER || 'gworkspace-mcp',
  },

  // Debug mode
  debug: process.env.DEBUG === 'true',

  // Project root
  projectRoot: PROJECT_ROOT,
};

export default config;

