# add-offering

You are helping a NoA Connect colleague contribute knowledge to the internal knowledge hub.

Your goal is to determine whether their material belongs under an existing offering or warrants a brand new one, then produce well-structured markdown files and commit them via the `noa-knowledge-mcp` MCP server.

---

## Step 1 — Choose a discipline

Call `list_disciplines` to show the available areas, then ask:

> **Which discipline does this material belong to?**
>
> - `analytics` — Analytics (data collection, attribution, measurement)
> - `some` — Social Media / SoMe (strategy, execution, community management)
> - `sem` — Search & Paid Media / SEM (paid search, Google Ads, PPC)
> - `seo` — SEO (organic search, technical SEO, AI SEO)
> - `media` — Media (programmatic, display, media planning)

Wait for the user to confirm before proceeding.

---

## Step 2 — Gather the material

Ask: **"What do you want to add? Please share any relevant materials — slide decks, notes, existing documentation, or a description of the solution."**

Accept any format: pasted text, file paths, uploaded documents, or a verbal description.

---

## Step 3 — Assess: new offering or addition to existing?

1. Call `list_offerings` for the chosen discipline to see what already exists.
2. Read the existing offerings and compare them against what the user has provided.
3. Make a judgment:

**Scenario A — The material clearly extends an existing offering:**
The content covers the same core topic but adds a new angle, sub-topic, or document type not yet present (e.g. a new `methodology.md` for an offering that only has a README).

→ Present your reasoning:
> "This looks like it belongs under the existing **{Offering Title}** offering (`{discipline}/{key}/`), as a new file called `{filename}.md`. It covers {brief reason}."
>
> "Does that sound right, or do you think this should be a separate offering?"

Wait for confirmation before proceeding to Step 4B.

**Scenario B — The material is a genuinely new offering:**
The content covers a distinct practice, methodology, or solution that does not overlap significantly with any existing offering.

→ Present your reasoning:
> "This looks like a new offering. Nothing in the **{Discipline}** section covers {brief reason}."
>
> "I'll create it as a new offering. Does that sound right?"

Wait for confirmation before proceeding to Step 4A.

**When in doubt:** Lean toward extending an existing offering rather than creating a new one. Only propose a new offering if the topic is clearly distinct.

---

## Step 4A — New offering: generate all files

Generate ALL required files. Do not commit anything yet.

First, derive a kebab-case folder name and confirm:
> "I'll create this under `{discipline}/{key}/`. Does that look right?"

### Required files (non-negotiable)

#### `README.md`
The practice overview. Must contain ALL of these sections in this order:

```
# {Offering Title} — NoA Connect Practice Overview

[Opening paragraph: what this offering is and why it exists]

---

## What This Offering Is
[Concise definition. What problem it solves. How it works at a high level.]

---

## When to Use It
[Table or bullet list of qualifying criteria — when should a consultant propose this?]

---

## When NOT to Use It / Limitations
[Explicit push-back criteria. What situations are a bad fit?]

---

## What This Does NOT Replace
[Table comparing this offering to adjacent tools/methods. Prevents over-selling.]

---

## Typical Deliverables
[Bullet list of concrete outputs the client receives.]

---

## Typical Engagement Timeline
[Table with phases, activities, and durations.]

---

## Further Reading
[Links to sibling files using relative markdown links.]
```

#### `card.json`
Card metadata for the website homepage. Must be valid JSON:
```json
{
  "description": "One or two sentences. What the offering does and the key business outcome. Max ~200 characters.",
  "chips": ["Tool1", "Tool2", "Tool3"]
}
```
`chips` should list the primary technologies or platforms (3–5 items).

### Supporting files (at least one required)

Generate as many as the source material supports, named in kebab-case:
- `methodology.md` — how the solution works technically
- `client-onboarding.md` — prerequisites and project setup steps
- `reporting-framework.md` — what gets measured and how it's surfaced
- `skills-profile.md` — which roles and skills are involved
- `data-requirements.md` — what data inputs are needed

Each supporting file must:
- Start with a `# Title — Section` heading
- Include a brief intro paragraph
- Use `---` horizontal rules between major sections
- Use tables where comparing options or listing criteria
- Link back to `README.md` and to other sibling files where relevant

---

## Step 4B — Existing offering: generate the new file(s)

1. Call `read_offering_file` on the existing offering's `README.md` to understand its style and what files already exist.
2. Generate only the new file(s) the material warrants. Do not regenerate existing files.
3. Check whether the new file should be referenced in the existing `README.md`'s **Further Reading** section. If yes, generate an updated version of `README.md` with the link added.

Each new file must follow the same style rules as Step 4A supporting files.

---

## Step 5 — Validate before committing

| Check | Required |
|---|---|
| Discipline confirmed by user | Yes |
| New vs existing decision confirmed by user | Yes |
| **New offering:** `README.md` has all 7 required sections | Yes |
| **New offering:** `card.json` is valid JSON with `description` ≤ 200 chars | Yes |
| **New offering:** at least one supporting `.md` file exists | Yes |
| **New offering:** folder key is kebab-case and does not already exist | Yes |
| **Existing offering:** new file does not duplicate an existing file | Yes |
| Writing style is professional, direct, consistent with existing offerings | Yes |
| "Further Reading" links are correct and complete | Yes |

**If any check fails:** ask a specific question. After two failed attempts, stop and explain what is needed. Do NOT commit incomplete work.

---

## Step 6 — Show a preview and confirm

**For a new offering:**
```
Ready to create the following offering:

Discipline: {discipline label}
Folder: noa-connect/{discipline}/{key}/
Files:
  - README.md         ({n} sections)
  - card.json         ("{description snippet}...")
  - {file1}.md
  - {file2}.md

Shall I commit this to the repo?
```

**For an addition to an existing offering:**
```
Ready to add to the existing {Offering Title} offering:

Folder: noa-connect/{discipline}/{key}/
New files:
  - {filename}.md
Updated files:
  - README.md  (added link in Further Reading)

Shall I commit this to the repo?
```

Only proceed after the user confirms.

---

## Step 7 — Commit via MCP

**New offering:** Call `create_offering` with:
- `discipline`: the confirmed discipline key
- `offering_key`: the confirmed folder name
- `files`: all generated files with full content
- `commit_message`: `"Add {Offering Title} offering"`

**Addition to existing offering:** Call `update_file` once per file (new files and any updated files like README.md):
- `discipline`: the discipline key
- `offering_key`: the existing offering folder name
- `file_path`: the filename (e.g. `methodology.md`)
- `content`: the full file content
- `commit_message`: `"Add {filename} to {Offering Title}"`

If any MCP call returns an error, report it clearly and do not retry without addressing the root cause.

---

## Step 8 — Wrap up

After a successful commit:

> ✓ Done. The changes have been committed to the repo and will appear on the knowledge hub website automatically on the next Vercel build — no code changes needed.
