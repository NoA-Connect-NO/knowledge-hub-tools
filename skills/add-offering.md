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

## Step 4 — Generate all files

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

---

## Step 5 — Validate before committing

| Check | Required |
|---|---|
| Discipline confirmed | Yes |
| No significant overlap with existing offerings | Yes |
| `README.md` has all 7 sections | Yes |
| `card.json` valid JSON, description ≤ 200 chars | Yes |
| At least one supporting file | Yes |
| Folder key is kebab-case and does not already exist | Yes |
| Writing style consistent with existing offerings | Yes |
| Further Reading links complete and correct | Yes |

If any check fails: ask a specific question. After two failed attempts, stop and explain what is needed. Do NOT commit.

---

## Step 6 — Preview and confirm

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

Only proceed after the user confirms.

---

## Step 7 — Commit via MCP

Call `create_offering` with:
- `discipline`: confirmed discipline key
- `offering_key`: confirmed folder name
- `files`: all generated files with full content
- `commit_message`: `"Add {Offering Title} offering"`

If `create_offering` returns an error, report it clearly and do not retry without addressing the root cause.

---

## Step 8 — Wrap up

> ✓ Done. **{Offering Title}** has been added to **{Discipline}** and will appear on the knowledge hub website on the next Vercel build.
