#!/usr/bin/env node
/**
 * NoA Connect Knowledge Hub — MCP Server
 *
 * Exposes tools for reading and writing offerings in the GitHub repo
 * NoA-Connect-NO/NoA-Connect-Knowldege via the GitHub Contents API.
 *
 * Required env var: GITHUB_TOKEN — a personal access token with `repo` scope.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod/v4-mini';

const OWNER = 'NoA-Connect-NO';
const REPO = 'NoA-Connect-Knowldege';
const BRANCH = 'main';

const DISCIPLINES = {
  analytics: 'noa-connect/analytics',
  some:      'noa-connect/some',
  sem:       'noa-connect/sem',
  seo:       'noa-connect/seo',
  media:     'noa-connect/media',
};

const DISCIPLINE_LABELS = {
  analytics: 'Analytics',
  some:      'Social Media (SoMe)',
  sem:       'Search & Paid Media (SEM)',
  seo:       'SEO',
  media:     'Media',
};

const disciplineSchema = z.enum(['analytics', 'some', 'sem', 'seo', 'media']);

function githubHeaders() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN environment variable is not set.');
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'noa-knowledge-mcp/1.0',
  };
}

async function githubGet(path) {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`;
  const res = await fetch(url, { headers: githubHeaders() });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub API error ${res.status}: ${body}`);
  }
  return res.json();
}

async function githubPut(path, message, content, sha) {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`;
  const body = { message, content, branch: BRANCH };
  if (sha) body.sha = sha;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { ...githubHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`GitHub API error ${res.status}: ${errBody}`);
  }
  return res.json();
}

function b64encode(str) {
  return Buffer.from(str, 'utf-8').toString('base64');
}

function b64decode(str) {
  return Buffer.from(str, 'base64').toString('utf-8');
}

// ─── Server setup ────────────────────────────────────────────────────────────

const server = new McpServer({
  name: 'noa-knowledge-mcp',
  version: '1.0.0',
});

// ─── Tool: list_disciplines ──────────────────────────────────────────────────

server.registerTool(
  'list_disciplines',
  {
    description: 'List all available discipline areas in the knowledge hub.',
  },
  async () => {
    const list = Object.entries(DISCIPLINE_LABELS).map(
      ([key, label]) => `${key} — ${label}`
    );
    return { content: [{ type: 'text', text: list.join('\n') }] };
  }
);

// ─── Tool: list_offerings ────────────────────────────────────────────────────

server.registerTool(
  'list_offerings',
  {
    description: 'List all current offering folders within a discipline.',
    inputSchema: {
      discipline: disciplineSchema,
    },
  },
  async ({ discipline }) => {
    const basePath = DISCIPLINES[discipline];
    const entries = await githubGet(basePath);
    const folders = entries.filter((e) => e.type === 'dir').map((e) => e.name);
    return { content: [{ type: 'text', text: JSON.stringify(folders, null, 2) }] };
  }
);

// ─── Tool: list_offering_files ───────────────────────────────────────────────

server.registerTool(
  'list_offering_files',
  {
    description: 'List all files in an existing offering folder.',
    inputSchema: {
      discipline: disciplineSchema,
      offering: z.string().check(z.minLength(1)),
    },
  },
  async ({ discipline, offering }) => {
    const basePath = `${DISCIPLINES[discipline]}/${offering}`;
    const entries = await githubGet(basePath);
    const files = entries.filter((e) => e.type === 'file').map((e) => e.name);
    return { content: [{ type: 'text', text: JSON.stringify(files, null, 2) }] };
  }
);

// ─── Tool: read_offering_file ────────────────────────────────────────────────

server.registerTool(
  'read_offering_file',
  {
    description: 'Read a specific file from an offering folder. Use this to understand existing structure and style.',
    inputSchema: {
      discipline: disciplineSchema,
      offering: z.string().check(z.minLength(1)),
      file: z.string().check(z.minLength(1)),
    },
  },
  async ({ discipline, offering, file }) => {
    const path = `${DISCIPLINES[discipline]}/${offering}/${file}`;
    const data = await githubGet(path);
    return { content: [{ type: 'text', text: b64decode(data.content) }] };
  }
);

// ─── Tool: create_offering ───────────────────────────────────────────────────

server.registerTool(
  'create_offering',
  {
    description: 'Create a new offering in the knowledge hub. Required files: README.md, card.json (with description and chips), and at least one supporting .md file.',
    inputSchema: {
      discipline: disciplineSchema,
      offering_key: z.string().check(z.minLength(1)),
      files: z.array(z.object({
        path: z.string().check(z.minLength(1)),
        content: z.string(),
      })),
      commit_message: z.string().check(z.minLength(1)),
    },
  },
  async ({ discipline, offering_key, files, commit_message }) => {
    const paths = files.map((f) => f.path);
    const missing = [];
    if (!paths.includes('README.md')) missing.push('README.md');
    if (!paths.includes('card.json')) missing.push('card.json');
    if (missing.length > 0) {
      return {
        content: [{ type: 'text', text: `Validation failed: missing required files: ${missing.join(', ')}. Offering was NOT committed.` }],
        isError: true,
      };
    }

    const cardFile = files.find((f) => f.path === 'card.json');
    let card;
    try {
      card = JSON.parse(cardFile.content);
    } catch {
      return {
        content: [{ type: 'text', text: 'Validation failed: card.json is not valid JSON. Offering was NOT committed.' }],
        isError: true,
      };
    }
    if (typeof card.description !== 'string' || !card.description.trim()) {
      return {
        content: [{ type: 'text', text: 'Validation failed: card.json must have a non-empty "description" string. Offering was NOT committed.' }],
        isError: true,
      };
    }
    if (!Array.isArray(card.chips) || card.chips.length === 0) {
      return {
        content: [{ type: 'text', text: 'Validation failed: card.json must have a non-empty "chips" array. Offering was NOT committed.' }],
        isError: true,
      };
    }

    const basePath = DISCIPLINES[discipline];
    const committed = [];
    for (const file of files) {
      const repoPath = `${basePath}/${offering_key}/${file.path}`;
      await githubPut(repoPath, `${commit_message} — add ${file.path}`, b64encode(file.content), undefined);
      committed.push(repoPath);
    }

    return {
      content: [{
        type: 'text',
        text: `Offering "${offering_key}" created in ${DISCIPLINE_LABELS[discipline]}.\nFiles committed:\n${committed.map((p) => `  - ${p}`).join('\n')}`,
      }],
    };
  }
);

// ─── Tool: update_file ───────────────────────────────────────────────────────

server.registerTool(
  'update_file',
  {
    description: 'Update an existing file in an offering. Automatically fetches the current SHA before writing.',
    inputSchema: {
      discipline: disciplineSchema,
      offering: z.string().check(z.minLength(1)),
      file: z.string().check(z.minLength(1)),
      content: z.string(),
      commit_message: z.string().check(z.minLength(1)),
    },
  },
  async ({ discipline, offering, file, content, commit_message }) => {
    const repoPath = `${DISCIPLINES[discipline]}/${offering}/${file}`;
    const existing = await githubGet(repoPath);
    await githubPut(repoPath, commit_message, b64encode(content), existing.sha);
    return { content: [{ type: 'text', text: `Updated ${repoPath} successfully.` }] };
  }
);

// ─── Tool: create_file ───────────────────────────────────────────────────────

server.registerTool(
  'create_file',
  {
    description: 'Add a new file to an existing offering. Use this when adding content that does not yet exist in the offering.',
    inputSchema: {
      discipline: disciplineSchema,
      offering: z.string().check(z.minLength(1)),
      file: z.string().check(z.minLength(1)),
      content: z.string(),
      commit_message: z.string().check(z.minLength(1)),
    },
  },
  async ({ discipline, offering, file, content, commit_message }) => {
    const repoPath = `${DISCIPLINES[discipline]}/${offering}/${file}`;
    await githubPut(repoPath, commit_message, b64encode(content), undefined);
    return { content: [{ type: 'text', text: `Created ${repoPath} successfully.` }] };
  }
);

// ─── Start ───────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
