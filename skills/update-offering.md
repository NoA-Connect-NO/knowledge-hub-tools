# update-offering

You are helping a NoA Connect colleague update an existing offering in the internal knowledge hub.

Your goal is to read what already exists, compare it against the new material, and commit only meaningful additions or changes — skipping anything already well covered.

---

## Step 1 — Choose a discipline

Call `list_disciplines`, then ask:

> **Which discipline is the offering in?**
>
> - `analytics` — Analytics
> - `some` — Social Media / SoMe
> - `sem` — Search & Paid Media / SEM
> - `seo` — SEO
> - `media` — Media

Wait for confirmation before proceeding.

---

## Step 2 — Choose the offering

Call `list_offerings` for the chosen discipline and present the results:

> **Which offering do you want to update?**
> {list of offering names}

Wait for the user to select one before proceeding.

---

## Step 3 — Gather material

Ask: **"Please share everything you have — notes, slide decks, documentation, or a description of what you want to add or change. The more you provide, the better I can assess what's new."**

Accept any format. Do not proceed until material is provided.

---

## Step 4 — Read existing content and diff

1. Call `list_offering_files` to see every file currently in the offering.
2. Call `read_offering_file` on each file to understand what is already documented.
3. Compare every piece of the user's material against what exists:

   - **Already covered** — content is substantially present. Skip it.
   - **Fills a gap** — content adds meaningful depth to an existing file. Propose an update.
   - **Genuinely new** — content covers something not present at all. Propose a new file.
   - **Contradicts existing content** — flag explicitly and ask the user how to resolve before proceeding.

4. Present a proposal before generating anything:

```
After reading the existing offering, here is what I propose:

UPDATE (improves existing files):
  - {file} — {reason}

ADD (new files not yet present):
  - {file} — {reason}

SKIP (already well covered):
  - {file} — {reason}

NEEDS YOUR INPUT (contradicts existing content):
  - {file} — {description of conflict}

Shall I proceed with this plan?
```

Wait for the user to confirm or adjust. Resolve all conflicts before continuing.

---

## Step 5 — Generate content

Generate only the proposed files:
- For updates: produce the full updated file content (not just the changed section)
- For new files: follow the same style rules as existing files in this offering — `# Title — Section` heading, `---` between sections, tables for comparisons, links to sibling files
- If a new file is being added, check whether `README.md`'s **Further Reading** section needs updating and include that as an update if so

Do not commit yet.

---

## Step 6 — Validate before committing

| Check | Required |
|---|---|
| Discipline and offering confirmed by user | Yes |
| All conflicts resolved | Yes |
| No file duplicates content already present | Yes |
| Full file content generated (not partial diffs) | Yes |
| Writing style consistent with existing offering | Yes |
| Further Reading links updated if new files added | Yes |

If any check fails: ask a specific question. Do NOT commit incomplete work.

---

## Step 7 — Preview and confirm

```
Ready to commit the following changes to {Offering Title}:

  UPDATE  {file}   {reason}
  ADD     {file}   {reason}
  SKIP    {file}   (already covered)

Shall I commit?
```

Only proceed after the user confirms.

---

## Step 8 — Commit via MCP

For each file in the plan:
- File already exists in the offering → call `update_file` (SHA is fetched automatically)
- File does not yet exist → call `create_file`

Use a descriptive commit message per file:
- `"Update {file} in {Offering Title} — {reason}"`
- `"Add {file} to {Offering Title}"`

If any MCP call returns an error, report it clearly and do not retry without addressing the root cause.

---

## Step 9 — Wrap up

> ✓ Done. Changes to **{Offering Title}** have been committed and will appear on the knowledge hub website on the next Vercel build.
