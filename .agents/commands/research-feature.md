# research-feature command spec

## Purpose

Run pre-implementation feature research for Vibe-to-MIDI and produce a notebook-based recommendation.

## When to use

Use this command for any decision that affects:
- platform support or implementation cost
- audio / MIDI behavior
- core user workflow
- product positioning
- AI or ML scope

Skip for bug fixes, styling, internal refactors, and test additions.

## Steps

1. Read `.agents/market-research-python.md` for research conventions.
2. Derive a unique feature slug: `<yyyy-mm-dd>_<kebab-case-slug>`.
3. Create and switch to a new git branch: `research/<slug>`.
   ```bash
   git checkout -b research/<slug>
   ```
4. Create `research/features/<slug>/notebooks/analysis.ipynb`.
5. Create `research/features/<slug>/figures/` (empty, for generated charts).
6. Write the Feature Hypothesis section inside the notebook.
7. Gather information from public sources (official docs, npm, GitHub, web search).
8. Add findings as inline DataFrames or markdown cells in the notebook.
9. Generate comparison charts when they aid the decision; save to `figures/`.
10. Write the Decision Summary section inside the notebook.
11. State the recommendation: **Build / Defer / Narrow / Reject**.
12. Commit the notebook and figures on the research branch.

## Output requirements

The notebook must contain, in order:

| Section | Required content |
|---------|-----------------|
| Feature Hypothesis | Idea, target user, problem, MVP scope, non-goals, research questions |
| Source Notes | One bullet per source checked, with URL and one-line summary |
| Data / Analysis | Tables, charts, or code cells with findings |
| Decision Summary | Recommendation + evidence + risks + next step |
| Open Questions | Unresolved items that the spike or implementation must answer |

## Directory convention

```text
research/features/<yyyy-mm-dd>_<feature-slug>/
  notebooks/analysis.ipynb   ← primary artifact
  figures/                   ← PNG/SVG charts referenced from notebook
```

Date is the day research starts. Never reuse an existing slug.

## Notebook execution status

After writing the notebook, attempt to execute it:

```bash
cd <repo-root>
source research/.venv/bin/activate
jupyter nbconvert --to notebook --execute \
  research/features/<slug>/notebooks/analysis.ipynb \
  --output research/features/<slug>/notebooks/analysis.ipynb
```

If execution fails due to missing data or imports, leave cells unexecuted and note the reason in the Decision Summary.

## Branch naming

```
research/<yyyy-mm-dd>_<kebab-case-slug>
```

Example: `research/2026-05-11_mood-sound-types`

The branch name must match the research directory slug exactly so the two can be cross-referenced.

## Commit message

```
research: <short description of finding>
```

Example: `research: React Native audio latency on Android — recommend Web-first MVP`
