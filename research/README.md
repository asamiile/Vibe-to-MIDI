# Research Environment

Research is kept separate from app runtime dependencies. Use this environment for notebooks, charts, and market analysis.

## Setup

From the repository root:

```bash
uv venv research/.venv
source research/.venv/bin/activate
uv pip install -r research/requirements.txt
```

## Run Jupyter

Use research-local Jupyter directories so the command does not write to `~/.jupyter`:

```bash
JUPYTER_CONFIG_DIR=research/.jupyter \
JUPYTER_DATA_DIR=research/.jupyter-data \
JUPYTER_RUNTIME_DIR=research/.jupyter-runtime \
IPYTHONDIR=research/.ipython \
jupyter lab research/features/2026-05-10_android-mvp-market/notebooks/analysis.ipynb
```

## Execute Notebook From CLI

```bash
JUPYTER_CONFIG_DIR=research/.jupyter \
JUPYTER_DATA_DIR=research/.jupyter-data \
JUPYTER_RUNTIME_DIR=research/.jupyter-runtime \
IPYTHONDIR=research/.ipython \
jupyter nbconvert --to notebook --execute --inplace research/features/2026-05-10_android-mvp-market/notebooks/analysis.ipynb
```

## Rules

- Do not commit `research/.venv/`.
- Keep raw datasets small.
- Commit concise summaries, notebooks, CSVs, and generated figures when useful for decisions.
- Do not commit API keys, private data, copyrighted audio, or paid report contents.
