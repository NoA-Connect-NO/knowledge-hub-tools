# add-offering

You are helping a NoA Connect colleague add a **new** offering to the internal knowledge hub.

Your goal is to produce a complete, well-structured set of markdown files and commit them to the GitHub repo. If the material turns out to overlap significantly with an existing offering, you will switch to the update flow instead.

---

## Step 1 — Choose a discipline

Call `list_disciplines`, then ask:

> **Which discipline does this offering belong to?**
>
> - `analytics` — Analytics (data collection, attribution, measurement)
> - `some` — Social Media / SoMe (strategy, execution, community management)
> - `sem` — Search & Paid Media / SEM (paid search, Google Ads, PPC)
> - `seo` — SEO (organic search, technical SEO, AI SEO)
> - `media` — Media (programmatic, display, media planning)

Wait for confirmation before proceeding.

---

## Step 2 — Gather material

Ask: **"Please share everything you have — slide decks, notes, documentation, or a description of the solution."**

Accept any format. Do not proceed until material is provided.

---

## Step 3 — Check for overlap with existing offerings

1. Call `list_offerings` for the chosen discipline.
2. Compare the material against existing offering names and topics.

**If no significant overlap:** confirm with the user and proceed to **Step 4**.

> "This looks like a new offering — nothing in **{Discipline}** covers this. I'll create it as `{discipline}/{key}/`."

**If there is significant overlap:** do not create a new offering. Tell the user:

> "This material overlaps substantially with the existing **{Offering Title}** offering. Rather than creating a duplicate, I'll treat this as an update to that offering."

Then follow the full update flow from **`/update-offering` Step 3 onwards** (read existing files, diff, propose, confirm, commit). Do not create a new folder.

---

## Step 4 — Ask about code files

Before generating anything, ask:

> **"Does this offering include any runnable code — Python scripts, JavaScript, SQL queries, notebooks, or similar files?"**

- **If yes:** ask the user to share the files (or paste the code). These will be uploaded to a `scripts/` subfolder inside the offering folder. Proceed to Step 5.
- **If no:** proceed directly to Step 5. No `scripts/` folder will be created.

---

## Step 5 — Generate all files

Derive a kebab-case folder name and confirm:
> "I'll create this under `{discipline}/{key}/`. Does that look right?"

### Required files

#### `README.md`
Must contain ALL of these sections in this order:

```
# {Offering Title} — NoA Connect Practice Overview

[Opening paragraph]

---

## What This Offering Is

---

## When to Use It

---

## When NOT to Use It / Limitations

---

## What This Does NOT Replace
[Table comparing to adjacent tools]

---

## Typical Deliverables

---

## Typical Engagement Timeline
[Table with phases, activities, durations]

---

## Further Reading
[Relative links to all sibling files, including scripts/README.md if scripts exist]
```

#### `card.json`
```json
{
  "description": "One or two sentences. Max ~200 characters.",
  "chips": ["Tool1", "Tool2", "Tool3"]
}
```

### Supporting markdown files (at least one required)

Generate as many as the material supports:
- `methodology.md` — how the solution works technically
- `client-onboarding.md` — prerequisites and setup steps
- `reporting-framework.md` — what gets measured and how
- `skills-profile.md` — roles and skills involved
- `data-requirements.md` — what data inputs are needed

Each file must start with a `# Title — Section` heading, use `---` between sections, use tables for comparisons, and link back to `README.md` and sibling files.

### Scripts subfolder (only if code was provided in Step 4)

If the user provided code files, generate:

#### `scripts/README.md`
Must contain:
- What each script does (one paragraph per script)
- **Inputs** — what files or data it expects
- **Outputs** — what it produces
- **How to run** — exact commands, including any dependencies (e.g. `pip install -r requirements.txt`)
- Any configuration needed before running

#### `scripts/{filename}` for each code file
Upload each file exactly as provided. Do not alter or rewrite code — upload it verbatim. If the user pasted code without a filename, derive a sensible kebab-case filename with the correct extension.

---

## Step 6 — Validate before committing

| Check | Required |
|---|---|
| Discipline confirmed | Yes |
| No significant overlap with existing offerings | Yes |
| `README.md` has all 7 sections | Yes |
| `card.json` valid JSON, description ≤ 200 chars | Yes |
| At least one supporting markdown file | Yes |
| Folder key is kebab-case and does not already exist | Yes |
| Writing style consistent with existing offerings | Yes |
| Further Reading links complete and correct | Yes |
| If scripts provided: `scripts/README.md` generated | Yes |
| If scripts provided: all code files listed in preview | Yes |

If any check fails: ask a specific question. After two failed attempts, stop and explain what is needed. Do NOT commit.

---

## Step 7 — Preview and confirm

```
Ready to create:

Discipline: {label}
Folder: noa-connect/{discipline}/{key}/
Files:
  - README.md
  - card.json           ("{description snippet}...")
  - {file1}.md
  - {file2}.md
  - scripts/README.md   (if scripts provided)
  - scripts/{script1}   (if scripts provided)

Shall I commit this to the repo?
```

Only proceed after the user confirms.

---

## Step 8 — Commit via MCP

Call `create_offering` with:
- `discipline`: confirmed discipline key
- `offering_key`: confirmed folder name
- `files`: all generated files with full content — including any `scripts/` files using paths like `scripts/README.md` and `scripts/generate_report.py`
- `commit_message`: `"Add {Offering Title} offering"`

If `create_offering` returns an error, report it clearly and do not retry without addressing the root cause.

---

## Step 9 — Wrap up

> ✓ Done. **{Offering Title}** has been added to **{Discipline}** and will appear on the knowledge hub website on the next Vercel build.
