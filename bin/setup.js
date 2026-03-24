#!/usr/bin/env node
import { execSync } from 'child_process';
import { createInterface } from 'readline';
import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { homedir } from 'os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = join(__dirname, '..');

const rl = createInterface({ input: process.stdin, output: process.stdout });

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

function askSecret(question) {
  return new Promise((resolve) => {
    process.stdout.write(question);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    let token = '';
    process.stdin.on('data', (char) => {
      char = char.toString();
      if (char === '\n' || char === '\r' || char === '\u0003') {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdout.write('\n');
        resolve(token);
      } else if (char === '\u007f') {
        if (token.length > 0) {
          token = token.slice(0, -1);
          process.stdout.clearLine(0);
          process.stdout.cursorTo(0);
          process.stdout.write(question + '*'.repeat(token.length));
        }
      } else {
        token += char;
        process.stdout.write('*');
      }
    });
  });
}

console.log('\n╔══════════════════════════════════════════════╗');
console.log('║   NoA Connect Knowledge Hub — Setup          ║');
console.log('╚══════════════════════════════════════════════╝\n');
console.log('This will:');
console.log('  1. Register the noa-knowledge MCP server with Claude Code');
console.log('  2. Install the /add-offering skill\n');

// Check claude CLI is available
try {
  execSync('claude --version', { stdio: 'pipe' });
} catch {
  console.error('✗ Claude Code CLI not found. Please install it first:');
  console.error('  https://claude.ai/code\n');
  process.exit(1);
}

const token = await askSecret('Enter your GitHub personal access token (repo scope): ');

if (!token.startsWith('ghp_') && !token.startsWith('github_pat_')) {
  console.error('\n✗ That doesn\'t look like a valid GitHub token (should start with ghp_ or github_pat_)');
  process.exit(1);
}

const mcpServerPath = join(PACKAGE_ROOT, 'mcp', 'index.js');

// Register MCP server globally
console.log('\n→ Registering MCP server...');
try {
  execSync(
    `claude mcp add noa-knowledge --scope user -e GITHUB_TOKEN="${token}" -- node "${mcpServerPath}"`,
    { stdio: 'pipe' }
  );
  console.log('✓ MCP server registered');
} catch (err) {
  const msg = err.stderr?.toString() || err.message;
  if (msg.includes('already exists')) {
    console.log('✓ MCP server already registered (skipped)');
  } else {
    console.error('✗ Failed to register MCP server:', msg);
    process.exit(1);
  }
}

// Install skill
console.log('→ Installing /add-offering skill...');
const skillsDir = join(homedir(), '.claude', 'skills', 'add-offering');
if (!existsSync(skillsDir)) mkdirSync(skillsDir, { recursive: true });

copyFileSync(
  join(PACKAGE_ROOT, 'skills', 'add-offering.md'),
  join(skillsDir, 'SKILL.md')
);
console.log('✓ Skill installed');

rl.close();

console.log('\n╔══════════════════════════════════════════════╗');
console.log('║   Setup complete!                            ║');
console.log('╚══════════════════════════════════════════════╝');
console.log('\nNext steps:');
console.log('  1. Reload your VSCode window (Cmd+Shift+P → Reload Window)');
console.log('  2. In Claude Code, type /add-offering to add a new offering\n');
