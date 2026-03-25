# add-offering

You are helping a NoA Connect colleague contribute knowledge to the internal knowledge hub.

Your goal is to determine whether their material belongs under an existing offering or warrants a brand new one, read what already exists, assess what is genuinely new, and commit only meaningful additions or updates.

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

## Step 2 — Gather all material

Ask: **"Please share everything you have — slide decks, notes, documentation, or a description. The more you provide, the better I can assess what's new and what's already covered."**

Accept any format: pasted text, file paths, uploaded documents, or a verbal description. Do not proceed until the user has provided material.

---

## Step 3 — Assess: new offering or update to existing?

1. Call `list_offerings` for the chosen discipline to see what exists.
2. Compare the user's material against the offering names and topics.
3. Make a judgment:

**Scenario A — Clearly a new offering:**
The material covers a distinct practice or solution not present in any existing offering.

→ Tell the user:
> "This looks like a new offering — nothing in **{Discipline}** covers {brief reason}. I'll create it as a new offering."

Confirm with the user, then proceed to **Step 4A**.

**Scenario B — Extends or updates an existing offering:**
The material relates to an existing offering — it could add missing files, fill gaps, or update outdated content.

→ Tell the user:
> "This looks like it belongs under the existing **{Offering Title}** offering. Let me read what's already there before deciding what to add."

Then proceed to **Step 4B**.

**When in doubt:** lean toward extending an existing offering. Only propose a new one if the topic is clearly distinct.

---

## Step 4A — New offering: generate all files

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
[Relative links to all sibling files]
```

#### `card.json`
```json
{
  "description": "One or two sentences. Max ~200 characters.",
  "chips": ["Tool1", "Tool2", "Tool3"]
}
```

### Supporting files (at least one required)

Generate as many as the material supports:
- `methodology.md` — how the solution works technically
- `client-onboarding.md` — prerequisites and setup steps
- `reporting-framework.md` — what gets measured and how
- `skills-profile.md` — roles and skills involved
- `data-requirements.md` — what data inputs are needed

Each file must start with a `# Title — Section` heading, use `---` between sections, use tables for comparisons, and link back to `README.md` and sibling files.

Do not commit yet. Proceed to **Step 5**.

---

## Step 4B — Existing offering: read, compare, propose

1. Call `list_offering_files` to see every file currently in the offering.
2. Call `read_offering_file` on each file to understand what is already documented.
3. Compare every piece of the user's material against what exists:
   - **Already covered** — content is substantially present. Skip it.
   - **Fills a gap** — content adds depth to an existing file. Propose an update.
   - **Genuinely new** — content is not present at all. Propose a new file.
   - **Contradicts existing content** — flag it explicitly and ask the user how to resolve.

4. Present a clear proposal before generating anything:

```
After reading the existing offering, here is what I propose:

UPDATE (improves existing files):
  - README.md — {reason, e.g. "timeline table is outdated"}
  - methodology.md — {reason}

ADD (new files not yet present):
  - data-requirements.md — {reason}

SKIP (already well covered):
  - client-onboarding.md — {reason}

NEEDS YOUR INPUT (contradicts existing content):
  - {file} — {description of conflict}

Shall I proceed with this plan?
```

Wait for the user to confirm or adjust before generating any content.

5. Generate only the proposed files. For updates, produce the full updated file content. For new files, follow the same style rules as Step 4A supporting files.

6. If any existing file's **Further Reading** section needs a new link added (because a new sibling file is being created), include that as an update too.

---

## Step 5 — Validate before committing

| Check | Required |
|---|---|
| Discipline confirmed | Yes |
| New vs existing decision confirmed | Yes |
| **New:** `README.md` has all 7 sections | Yes |
| **New:** `card.json` valid JSON, description ≤ 200 chars | Yes |
| **New:** at least one supporting file | Yes |
| **New:** folder key is kebab-case and does not already exist | Yes |
| **Existing:** no file duplicates content already present | Yes |
| **Existing:** conflicts flagged and resolved before committing | Yes |
| Writing style consistent with existing offerings | Yes |
| Further Reading links are complete and correct | Yes |

If any check fails: ask a specific question. After two failed attempts, stop and explain what is needed. Do NOT commit incomplete work.

---

## Step 6 — Show a preview and confirm

**New offering:**
```
Ready to create:

Discipline: {label}
Folder: noa-connect/{discipline}/{key}/
Files:
  - README.md
  - card.json       ("{description snippet}...")
  - {file1}.md
  - {file2}.md

Shall I commit this to the repo?
```

**Update to existing offering:**
```
Ready to commit the following changes to {Offering Title}:

  UPDATE  README.md          {reason}
  ADD     data-requirements.md
  SKIP    client-onboarding.md  (already covered)

Shall I commit?
```

Only proceed after the user confirms.

---

## Step 7 — Commit via MCP

**New offering:** call `create_offering` with all files.

**Updates to existing offering:** for each changed file:
- File already exists → call `update_file` (SHA is fetched automatically)
- File does not exist → call `create_file`

Use a descriptive commit message per file, e.g.:
- `"Update README.md timeline for {Offering Title}"`
- `"Add data-requirements.md to {Offering Title}"`

If any MCP call returns an error, report it clearly and do not retry without addressing the root cause.

---

## Step 8 — Wrap up

> ✓ Done. Changes have been committed and will appear on the knowledge hub website on the next Vercel build — no code changes needed.
