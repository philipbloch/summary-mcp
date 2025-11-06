#!/usr/bin/env node

/**
 * Summary MCP Server
 * 
 * Provides AI-powered daily and weekly productivity summaries by analyzing
 * Slack, Calendar, and Gmail data through MCP servers.
 * 
 * @author Philip Bloch <philip.bloch@shopify.com>
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import config from './config.js';
import { toolDefinitions } from './tools/index.js';
import { handleToolCall } from './tools/handler.js';

// Create MCP server
const server = new Server(
  {
    name: 'summary-mcp',
    version: '2.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Handle list_tools request
 * Returns all available tools with their schemas
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: toolDefinitions,
  };
});

/**
 * Handle call_tool request
 * Routes tool calls to appropriate handlers
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    // Log tool call if debug mode
    if (config.debug) {
      console.error(`[DEBUG] Tool called: ${name}`, JSON.stringify(args, null, 2));
    }

    // Handle the tool call (returns JSON string)
    const result = await handleToolCall(name, args || {});

    return {
      content: [
        {
          type: 'text',
          text: result,
        },
      ],
    };
  } catch (error) {
    // Return error in consistent format
    const errorResult = {
      success: false,
      error: {
        code: error.code || 'TOOL_ERROR',
        message: error.message || 'An error occurred',
        details: error.details || error.stack,
        tool: name,
      },
    };

    if (config.debug) {
      console.error(`[ERROR] Tool ${name} failed:`, error);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(errorResult, null, 2),
        },
      ],
      isError: true,
    };
  }
});

/**
 * Start the MCP server
 */
async function main() {
  const transport = new StdioServerTransport();
  
  if (config.debug) {
    console.error('[DEBUG] Starting Summary MCP server...');
    console.error('[DEBUG] Configuration:', {
      user: config.user,
      defaults: config.defaults,
      mcpServers: config.mcpServers,
    });
  }

  await server.connect(transport);

  if (config.debug) {
    console.error('[DEBUG] Server started and ready (6 tools available)');
  }
}

// Handle errors
process.on('uncaughtException', (error) => {
  console.error('[FATAL] Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('[FATAL] Unhandled rejection:', error);
  process.exit(1);
});

// Start server
main().catch((error) => {
  console.error('[FATAL] Server failed to start:', error);
  process.exit(1);
});

