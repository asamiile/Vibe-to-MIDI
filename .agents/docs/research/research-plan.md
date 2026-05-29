# Research Plan

## Goal

Collect enough research to make implementation decisions without turning the repo into a long research archive.

## Research Topics

Prepare concise notes for:

- copyright-safe sound sources
- React Native audio architecture
- Android audio latency and playback constraints
- MIDI export libraries
- local AI audio generation
- compute requirements for local ML
- Google Colab usage for model experiments
- market research before app implementation
- Python-based competitor, keyword, and feature-signal analysis

## Public Repository Policy

Research docs can live in a public GitHub repository if they contain only:

- public URLs
- short summaries
- original notes
- comparison tables
- license names
- implementation conclusions

Do not include:

- full copied articles
- paid documentation
- API keys
- private credentials
- copyrighted audio
- downloaded commercial samples
- private personal information
- full license text unless redistribution is allowed

## Google Colab / MCP

Google Colab can be useful later for:

- prototyping ML audio generation
- benchmarking small open-source models
- exporting model artifacts
- comparing CPU/GPU inference cost

Do not require Colab for the MVP.

Before using Colab or a Colab MCP server, define:

- what data is uploaded
- what model is used
- whether model outputs are license-safe
- whether checkpoints can be redistributed
- how results can be reproduced locally

## Suggested Research Files

When needed, create:

```text
.agents/research/audio-licensing.md
.agents/research/web-audio-stack.md
.agents/research/midi-export.md
.agents/research/local-ai-audio.md
.agents/market-research-python.md
```
