# Local AI Strategy

## Goal

The product may later include AI-powered sound or MIDI generation without relying on external AI APIs.

This is not part of the first MVP.

## Why Local AI

Benefits:

- no external AI API dependency
- better privacy story
- possible offline workflow
- better fit for creative tooling

Tradeoffs:

- higher compute requirements
- larger app size
- model licensing complexity
- slower inference on weak machines
- harder cross-platform support

## Strategy

Evaluate generation methods in this order:

1. Rule-based and probabilistic generation
2. Small local models for MIDI/rhythm
3. Local model-assisted synth parameter generation
4. Local audio generation
5. External GPU notebooks for research only

Do not make AI required for the core user flow.

## Candidate Features

Start with lower-compute outputs:

- MIDI variations
- rhythm variations
- bassline variations
- synth parameter suggestions
- pattern mutation

Avoid early:

- full track generation
- artist-style imitation
- copyrighted dataset dependency
- heavy real-time audio generation

## Compute Planning

Research must compare:

- Android on-device inference
- React Native integration options
- desktop inference in Electron
- CPU-only inference
- Apple Silicon acceleration options
- model download size
- startup latency
- offline feasibility

## Licensing

Only use models and datasets compatible with app distribution.

Record:

- model name
- model license
- dataset license
- commercial-use permission
- redistribution permission
- attribution requirement

## Architecture

AI must be optional.

The app must work without:

- model downloads
- GPU
- network
- external API keys
