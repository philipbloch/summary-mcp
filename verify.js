#!/usr/bin/env node

/**
 * Verification script for Weekly Summary MCP
 * Tests that all components are working correctly
 */

import { toolDefinitions } from './src/tools/index.js';
import { handleToolCall } from './src/tools/handler.js';
import config from './src/config.js';
import { existsSync } from 'fs';

console.log('🧪 Weekly Summary MCP - Verification\n');

let errors = 0;
let warnings = 0;

// Test 1: Configuration
console.log('1️⃣  Checking configuration...');
if (!config.user.name || config.user.name === 'User') {
  console.log('   ⚠️  USER_NAME not configured in .env');
  warnings++;
} else {
  console.log(`   ✅ User: ${config.user.name}`);
}

if (!config.user.email) {
  console.log('   ⚠️  USER_EMAIL not configured in .env');
  warnings++;
} else {
  console.log(`   ✅ Email: ${config.user.email}`);
}

console.log(`   ✅ Output dir: ${config.output.dir}`);
console.log('');

// Test 2: Tool Definitions
console.log('2️⃣  Checking tool definitions...');
if (toolDefinitions.length === 5) {
  console.log(`   ✅ All 5 tools defined`);
  toolDefinitions.forEach(tool => {
    console.log(`      • ${tool.name}`);
  });
} else {
  console.log(`   ❌ Expected 5 tools, found ${toolDefinitions.length}`);
  errors++;
}
console.log('');

// Test 3: Output Directory
console.log('3️⃣  Checking output directory...');
if (existsSync(config.output.dir)) {
  console.log('   ✅ Summaries directory exists');
} else {
  console.log('   ⚠️  Summaries directory does not exist (will be created on first use)');
  warnings++;
}
console.log('');

// Test 4: Tool Handler
console.log('4️⃣  Testing tool handler...');
try {
  await handleToolCall('unknown_tool', {});
  console.log('   ❌ Should have thrown error for unknown tool');
  errors++;
} catch (error) {
  if (error.code === 'UNKNOWN_TOOL') {
    console.log('   ✅ Unknown tool handling works');
  } else {
    console.log(`   ❌ Unexpected error: ${error.message}`);
    errors++;
  }
}
console.log('');

// Test 5: List Summaries (should work even with no summaries)
console.log('5️⃣  Testing list_summaries tool...');
try {
  const result = await handleToolCall('list_summaries', { limit: 1 });
  const parsed = JSON.parse(result);
  if (parsed.success) {
    console.log(`   ✅ list_summaries works (found ${parsed.total_count} summaries)`);
  } else {
    console.log(`   ❌ list_summaries failed: ${parsed.error.message}`);
    errors++;
  }
} catch (error) {
  console.log(`   ❌ list_summaries error: ${error.message}`);
  errors++;
}
console.log('');

// Summary
console.log('📊 Verification Summary');
console.log('======================');
console.log(`Errors: ${errors}`);
console.log(`Warnings: ${warnings}`);
console.log('');

if (errors === 0 && warnings === 0) {
  console.log('✅ All checks passed! MCP server is ready to use.');
  console.log('');
  console.log('Next steps:');
  console.log('1. Add to ~/.cursor/mcp.json (see QUICKSTART.md)');
  console.log('2. Restart Cursor');
  console.log('3. Test: "Generate my weekly summary"');
  process.exit(0);
} else if (errors === 0) {
  console.log('⚠️  Some warnings found. MCP will work but configuration could be improved.');
  console.log('   Edit .env to configure USER_NAME and USER_EMAIL');
  process.exit(0);
} else {
  console.log('❌ Errors found. Please fix before using MCP server.');
  process.exit(1);
}

