---
name: sync-memory
description: Sync project state to memory files — update CLAUDE.md, HANDOFF.md, and memory index with current project status, architecture, and decisions
disable-model-invocation: true
argument-hint: [all | claude-md | handoff | memory]
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash
---

# Sync Memory — Update all project documentation

Synchronize project knowledge files with the current state of the codebase.

## What to sync (based on $ARGUMENTS, default "all"):

### `claude-md` — Update CLAUDE.md
1. Read the current `CLAUDE.md`
2. Scan the codebase for the actual current state:
   - `src/components/` — list all components
   - `src/hooks/` — list all hooks
   - `src/lib/` — list all lib modules
   - `src/pages/` — list all pages/routes
   - `api/` — list serverless functions
   - `package.json` — check dependencies
   - `src/index.css` — check current color tokens
3. Update CLAUDE.md to reflect:
   - Accurate component structure with descriptions
   - Current color token values
   - Current routes
   - Any new constraints or patterns discovered
4. Do NOT change design rules or animation rules unless the code contradicts them

### `handoff` — Update HANDOFF.md
1. Read the current `HANDOFF.md`
2. Check git log for recent changes: `git log --oneline -20`
3. Update:
   - Tech stack if dependencies changed
   - Architecture diagram if new routes/components added
   - Key files table
   - Design decisions
   - Known issues
4. Update the version number if significant changes were made

### `memory` — Update memory files
1. Read `~/.claude/projects/C--dama-project-nutriq/memory/MEMORY.md`
2. Read each linked memory file
3. Update `project_nutriq.md` with:
   - Current date and project state
   - New features since last sync
   - Any architecture changes
4. Update `reference_deploy.md` if deployment details changed
5. Add new memory files if needed (new feedback, new references)
6. Keep `MEMORY.md` index in sync with actual files

### `all` — Run all three syncs above in order

## Rules
- Read actual files before updating — never guess at current state
- Preserve existing content that is still accurate
- Only add/change what has actually changed
- Keep descriptions concise
- Update dates to today's date where applicable
