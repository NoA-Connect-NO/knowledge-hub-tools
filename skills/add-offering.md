# add-offering

You are helping a NoA Connect colleague add a new offering to the internal knowledge hub.

Your goal is to produce a complete, well-structured set of markdown files that match the established style of existing offerings, then commit them to the GitHub repo via the `noa-knowledge-mcp` MCP server.

---

## Step 1 — Choose a discipline

Call `list_disciplines` to show the available areas, then ask:

> **Which discipline does this offering belong to?**
>
> - `analytics` — Analytics (data collection, attribution, measurement)
> - `some` — Social Media / SoMe (strategy, execution, community management)
> - `sem` — Search & Paid Media / SEM (paid search, Google Ads, PPC)
> - `seo` — SEO (organic search, technical SEO, AI SEO)
> - `media` — Media (programmatic, display, media planning)

Wait for the user to confirm before proceeding.

---

## Step 2 — Gather context

1. Call `list_offerings` for the chosen discipline to see what already exists.
2. For **analytics** offerings: call `read_offering_file` on `attribution/README.md` — this is the reference for tone and structure.
   For **other disciplines**: call `read_offering_file` on any existing offering's README if one exists, otherwise note that this will be the first offering in this discipline.
3. Ask: **"What offering do you want to add? Please share any relevant materials — slide decks, notes, existing documentation, or a description of the solution."**

Accept any format: pasted text, file paths, uploaded documents, or a verbal description.

---

## Step 3 — Determine the offering key

Derive a kebab-case folder name, e.g.:
- "Technical SEO Audit" → `technical-seo-audit`
- "Meta Ads Strategy" → `meta-ads-strategy`

Confirm with the user: **"I'll create this offering under `{discipline}/{key}`. Does that look right?"**

---

## Step 4 — Generate the files

Generate ALL required files. Do not commit anything yet.

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

Generate as many as the source material supports, named in kebab-case.

Common patterns from existing offerings:
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

## Step 5 — Validate before committing

| Check | Required |
|---|---|
| Discipline confirmed by user | Yes |
| `README.md` has all 7 required sections | Yes |
| `card.json` is valid JSON with `description` and `chips` | Yes |
| `description` is ≤ 200 characters | Yes |
| At least one supporting `.md` file exists | Yes |
| Folder key is kebab-case and does not already exist in the discipline | Yes |
| Writing style is professional, direct, and consistent with existing offerings | Yes |
| "Further Reading" in README links to all generated supporting files | Yes |

**If any check fails:**
- If information is missing: ask the user a specific question.
- After two failed attempts to gather the missing information: stop and explain clearly what is needed. Do NOT commit incomplete work.

---

## Step 6 — Show a preview and confirm

Present a summary:

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

Only proceed after the user confirms.

---

## Step 7 — Commit via MCP

Call `create_offering` with:
- `discipline`: the confirmed discipline key
- `offering_key`: the confirmed folder name
- `files`: all generated files with full content
- `commit_message`: `"Add {Offering Title} offering"`

If `create_offering` returns an error, report it clearly and do not retry without addressing the root cause.

---

## Step 8 — Wrap up

After a successful commit:

> The offering **{Offering Title}** has been added to the **{Discipline}** section of the repo. It will appear on the knowledge hub website automatically on the next Vercel build — no code changes needed.
>
> To update any file later, use `/update-doc`.
