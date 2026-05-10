# AI Memory — How to Use This Folder
> Created: 2026-05-09

## Purpose
This folder stores all analysis, specs, and implementation context so that future AI sessions can immediately pick up where we left off **without re-analyzing videos, re-reading code, or wasting tokens**.

## Files

| File | What's Inside | When to Read |
|------|---------------|--------------|
| `README.md` | This file — how to use memory | Start of every session |
| `PROJECT_OVERVIEW.md` | Tech stack, design system, folder structure, routes | Start of every session |
| `MODULE_STATUS.md` | Which modules are done/in-progress/planned | Start of every session |
| `OFFER_MODULE_VIDEO_ANALYSIS.md` | Detailed breakdown of every screen, field, section from reference videos | When working on Offers module |
| `OFFER_MODULE_IMPLEMENTATION_PLAN.md` | Exact code changes needed, form state shape, checklist | When working on Offers module |

## Rules for AI
1. **ALWAYS read `README.md` first** at the start of a new conversation
2. **Read `PROJECT_OVERVIEW.md`** to understand the project without re-scanning files
3. **Read `MODULE_STATUS.md`** to know what's done and what's next
4. **Read module-specific files** only when working on that module
5. **Update these files** after completing significant work
6. **Never re-analyze videos** — all findings are documented here
7. **Add new files** for new modules as they're built

## Naming Convention
- `PROJECT_OVERVIEW.md` — Global project context
- `MODULE_STATUS.md` — Central status tracker
- `{MODULE_NAME}_VIDEO_ANALYSIS.md` — Video reference analysis
- `{MODULE_NAME}_IMPLEMENTATION_PLAN.md` — Implementation details
- `{MODULE_NAME}_NOTES.md` — Ad-hoc notes during development
