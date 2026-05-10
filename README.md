# Vibe-to-MIDI

Vibe-to-MIDI is a make-first music learning and production assistant.

Turn a vibe, movement, or sound image into DAW-ready musical choices, then learn why those choices work.

Target genres: techno, house, ambient, minimal, melodic techno, experimental electronic.


## Project structure

```
app/
  frontend/         ← React Native / Expo Android app
research/           ← Market research and feature research notebooks
.agents/            ← Agent instructions and product docs
.github/workflows/  ← CI (typecheck + tests)
```


## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | 20+ | `node --version` |
| npm | 10+ | bundled with Node |
| EAS CLI | 7+ | `npm install -g eas-cli` — for cloud builds |
| Android Studio | latest | optional — for local builds and emulator |


## App

### Setup

```bash
cd app/frontend
npm ci --legacy-peer-deps
```

### Run

```bash
npx expo start    # then press 'a' to open on Android
```

> Audio requires a Dev Build — Expo Go will not play sound.

### Tests

```bash
npx jest --no-coverage    # unit tests
npx tsc --noEmit          # type check
```

### Dev Build (required for audio)

First time only:

```bash
npm install -g eas-cli
eas login
eas init
```

**Option A — EAS cloud build** (no local Android SDK needed):

```bash
eas build --profile development --platform android
```

**Option B — local build** (requires Android Studio + SDK API 26+):

```bash
npx expo run:android
```

After the first build, JS changes hot-reload without rebuilding.


## Research

Research notebooks and market analysis live under `research/`.

```bash
source research/.venv/bin/activate
jupyter lab
```

See [research/README.md](research/README.md) for setup, environment, and research rules.


## AI Agents

Run pre-implementation feature research with:

```text
/research-feature
```

Agent docs are in [.agents/](.agents/). Start with [AGENTS.md](AGENTS.md).
