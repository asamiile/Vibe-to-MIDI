# Python Market Research Plan

## Goal

Run market research before app implementation to validate whether Vibe-to-MIDI should be built, who it should serve first, and which Android MVP features matter most.

The research should focus on public, reproducible data and concise conclusions.

## Research Questions

Answer these before implementation starts:

- Who is actively looking for help translating mood or sound image into DAW choices?
- Which adjacent apps already solve parts of this problem?
- Are users searching for vibe-based music production, MIDI generation, chord helpers, scale helpers, or AI music tools?
- Which Android music production workflows are common enough to support first?
- Which languages should launch first, given English is primary and Japanese is secondary?
- Which features are must-have for the MVP: vibe tags, playable examples, MIDI export, rhythm generation, sound design hints, or local AI?

## Data Sources

Use public sources first:

- Google Trends exported CSV files
- app store search result notes collected manually
- GitHub repository metadata for related open-source tools
- Reddit or forum links summarized manually, with care around terms of service
- YouTube search result metadata collected manually or via approved APIs
- public product pages for competitors
- npm package metadata for React Native audio, MIDI, and music libraries

Do not scrape sites that disallow automated access. Prefer official APIs, exported CSVs, or manually collected URLs.

## Competitor Categories

Track competitors and adjacent tools by category:

- chord progression helpers
- scale and theory learning apps
- MIDI generators
- AI music generators
- DAW companion tools
- ear training apps
- synth learning apps
- Android music production apps
- sample and loop discovery apps

For each competitor, capture:

- name
- URL
- platform
- target user
- pricing
- core promise
- strengths
- gaps
- whether it supports Android
- whether it helps with DAW-ready output
- whether it maps vibe or mood to musical choices

## Python Workflow

Use Python for repeatable collection and analysis. Keep scripts small and source-specific.

Suggested structure for each research run:

```text
research/features/<yyyy-mm-dd>_<feature-slug>/
  notebooks/analysis.ipynb
  figures/
```

Use a unique folder name for every feature research run. Keep raw data small. Do not commit large datasets.


## Unique Naming Rules

Every feature research run must use a unique directory name:

```text
research/features/<yyyy-mm-dd>_<feature-slug>/
```

Rules:

- Use the date when the research starts.
- Use lowercase kebab-case for the feature slug.
- Keep the slug specific enough to avoid collisions.
- Do not reuse an old research folder for a new decision.
- If repeating research for the same feature, add a suffix such as `_v2` or a new date.

Examples:

```text
research/features/2026-05-10_android-mvp-market/
research/features/2026-05-18_midi-export-mvp/
research/features/2026-06-02_local-ai-texture-generation/
```

The notebook and figures should live inside the same feature folder so future agents can inspect one decision at a time.

## Python Analysis Steps

1. Define research questions and hypotheses.
2. Create a competitor CSV schema.
3. Manually collect initial competitor/product URLs.
4. Normalize competitor data with Python.
5. Import keyword CSV exports, such as Google Trends.
6. Analyze keyword clusters and search intent.
7. Analyze app review exports only if obtained through permitted methods.
8. Summarize gaps by product category.
9. Produce a short market summary for implementation decisions.

## Data Storage Policy

Prefer storing small one-off research tables inside `notebooks/analysis.ipynb`.

Use separate CSV files only when:

- the data is large enough to make the notebook hard to review
- the data is reused by multiple notebooks
- the data needs script or CI processing
- the data is exported from an external tool and should remain unchanged

For the first Android MVP market research, the competitor and keyword tables are small enough to live inside the notebook.

## Suggested CSV Schemas

`competitor-matrix.csv`:

```csv
name,category,url,platform,pricing,target_user,core_promise,strengths,gaps,android_support,daw_output,vibe_mapping,notes
```

`keyword-summary.csv`:

```csv
keyword,language,region,source,relative_interest,trend_direction,intent,notes
```

`feature-signals.csv`:

```csv
source,product_or_thread,feature,signal_type,positive_count,negative_count,example_url,notes
```

## Outputs

Research should produce:

- a short market summary
- a competitor matrix
- keyword and search-intent summary
- MVP feature recommendation
- major risks and unknowns
- data source list

The key output is not the raw data. The key output is a decision:

```text
Build / do not build / narrow the MVP / change target user
```

## Public Repository Rules

It is acceptable to commit original research notes and small CSV summaries to a public repository.

Allowed:

- original summaries
- public URLs
- manually written competitor notes
- small CSV files created by this project, only when the data should be reused outside the notebook
- charts generated from permitted data

Avoid committing:

- scraped content that violates terms
- full app reviews copied in bulk
- paid reports
- private datasets
- API keys
- user personal data
- large raw exports

## Tooling

Prefer lightweight Python tools:

- `pandas` for tables
- `matplotlib` or `plotly` for charts
- `requests` only for APIs that permit access
- `beautifulsoup4` only for pages that allow scraping
- `jupyter` or plain scripts for analysis

Do not add these to the app runtime dependencies. Research dependencies should be isolated from product code.

## Research Done Criteria

Market research is ready when it answers:

- the first target segment
- the most important unsolved user pain
- the top 5 adjacent competitors
- the first Android MVP feature set
- whether English-only launch is acceptable
- whether Japanese support is needed in the MVP
- whether MIDI export should be phase 1 or phase 2
- which assumptions remain unverified


## Notebook-First Policy

For feature research, prefer putting analysis code inside `notebooks/analysis.ipynb` instead of separate scripts. This keeps exploratory code, tables, charts, and interpretation together.

Only add a `scripts/` directory when logic is reused across multiple research runs or must be automated in CI.

## Notebook vs Markdown

Use both. They serve different purposes.

Use Jupyter notebooks for:

- exploratory analysis
- charts and visual inspection
- quick grouping, filtering, and comparison
- market signal notebooks that may change often

Use Markdown only when a lightweight exported summary is explicitly needed. By default, keep final decisions, MVP recommendations, assumptions, risks, and source notes inside `notebooks/analysis.ipynb`.

Recommended pattern:

```text
research/features/<yyyy-mm-dd>_<feature-slug>/notebooks/analysis.ipynb
research/features/<yyyy-mm-dd>_<feature-slug>/figures/
```

The notebook is the primary research artifact. It should include hypothesis, source notes, analysis, charts, and final decision sections.

If a chart is important for a decision, export it as PNG/SVG into `research/features/<yyyy-mm-dd>_<feature-slug>/figures/` and reference it from the notebook decision section.

## Feature Research Loop

For each major feature, run this loop before implementation:

```text
feature idea
-> MVP hypothesis
-> research
-> analysis
-> decision
-> implementation plan
```

Do this for substantial product features, not every small refactor.

Use the loop when a feature affects:

- product positioning
- core user workflow
- monetization
- platform support
- audio/MIDI behavior
- AI or ML scope
- data collection or privacy
- release strategy

Skip or shorten the loop for:

- bug fixes
- styling cleanup
- internal refactors
- test additions
- documentation edits

## Agent Command Pattern

A user should be able to ask an agent:

```text
Run feature research for <feature name>.
Use the Vibe-to-MIDI research loop.
Produce a notebook, summary, and MVP recommendation.
```

The agent should then:

1. Create a feature research directory.
2. Write the feature hypothesis inside `notebooks/analysis.ipynb`.
3. Gather allowed public sources.
4. Add small tables directly to `notebooks/analysis.ipynb`, or add CSV files only when needed.
5. Run Python analysis.
6. Generate charts where useful.
7. Write the decision summary inside `notebooks/analysis.ipynb`.
8. Recommend build, defer, narrow, or reject.

Suggested output structure:

```text
research/features/<yyyy-mm-dd>_<feature-slug>/
  notebooks/analysis.ipynb
  figures/
```

## Feature Hypothesis Template

```md
# Feature Hypothesis: <Feature Name>

## Idea

## Target User

## Problem

## MVP Scope

## Non-Goals

## Research Questions

## Success Criteria

## Decision Needed

Build / Defer / Narrow / Reject
```

## Decision Summary Template

```md
# Research Summary: <Feature Name>

## Decision

Build / Defer / Narrow / Reject

## Why

## Evidence

## MVP Scope

## Risks

## Open Questions

## Next Implementation Step
```
