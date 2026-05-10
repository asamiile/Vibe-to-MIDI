# Vibe-to-MIDI

Vibe-to-MIDI is a make-first music learning and production assistant.

Turn a vibe, movement, or sound image into DAW-ready musical choices, then learn why those choices work.

Target genres: techno, house, ambient, minimal, melodic techno, experimental electronic.

---

## Project structure

```
app/
  frontend/         ← React Native / Expo Android app
research/           ← Market research and feature research notebooks
.agents/            ← Agent instructions and product docs
.github/workflows/  ← CI (typecheck + tests)
```

---

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | 20+ | `node --version` |
| npm | 10+ | bundled with Node |
| Android Studio | latest | for Android SDK and emulator |
| Android SDK | API 26+ (Android 8.0) | install via Android Studio SDK Manager |
| ADB | bundled with Android Studio | used for device connection |
| EAS CLI | 7+ | `npm install -g eas-cli` — for cloud builds |

---

## App: quick start

```bash
cd app/frontend
npm install --legacy-peer-deps
npx expo start
```

> `react-native-audio-api` requires a **Dev Build** — Expo Go will not work for audio.
> See [app/frontend/README.md](app/frontend/README.md) for full build instructions.

---

## Tests

```bash
cd app/frontend
npx jest --no-coverage    # unit tests (34 passing)
npx tsc --noEmit          # type check
```

---

## CI

GitHub Actions runs on every PR and push to `main`:
- `npm ci --legacy-peer-deps`
- `npx tsc --noEmit`
- `npx jest --ci --no-coverage`

---

## Research

Research notebooks and market analysis live under `research/`.

```bash
source research/.venv/bin/activate
jupyter lab
```

See [research/README.md](research/README.md) for setup, environment, and research rules.

---

## AI Agents

Run pre-implementation feature research with:

```text
/research-feature
```

Agent docs are in [.agents/](.agents/). Start with [AGENTS.md](AGENTS.md).
