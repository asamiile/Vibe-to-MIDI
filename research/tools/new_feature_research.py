#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
from datetime import date
from pathlib import Path


def slugify(value: str) -> str:
    value = value.strip().lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-") or "feature-research"


def markdown_cell(text: str) -> dict:
    return {
        "cell_type": "markdown",
        "metadata": {},
        "source": text.splitlines(True),
    }


def code_cell(text: str) -> dict:
    return {
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": text.splitlines(True),
    }


def create_notebook(feature_name: str, slug: str) -> dict:
    title = feature_name.strip()
    return {
        "cells": [
            markdown_cell(f"# Feature Research: {title}\n\nResearch directory: `research/features/{slug}/`\n"),
            markdown_cell("""## Research Scope\n\nDefine what is included and excluded before collecting sources.\n"""),
            markdown_cell(f"""## Hypothesis\n\n### Idea\n\nResearch `{title}` before implementation.\n\n### Target User\n\nTBD\n\n### Problem\n\nTBD\n\n### MVP Scope\n\nTBD\n\n### Non-Goals\n\nTBD\n"""),
            markdown_cell("""## Research Questions\n\n- What decision should this research support?\n- What alternatives should be compared?\n- What are the implementation risks?\n- What would make this feature Build / Defer / Narrow / Reject?\n"""),
            markdown_cell("""## Source Notes\n\nAdd public source links and concise original notes here.\n"""),
            code_cell("""from pathlib import Path\nimport pandas as pd\nimport matplotlib.pyplot as plt\n\nFEATURE_SLUG = """ + slug + """"\n\ndef find_feature_dir(start: Path) -> Path:\n    for base in [start, *start.parents]:\n        candidate = base / "research" / "features" / FEATURE_SLUG\n        if (candidate / "notebooks" / "analysis.ipynb").exists():\n            return candidate\n        if base.name == FEATURE_SLUG and (base / "notebooks" / "analysis.ipynb").exists():\n            return base\n    return start\n\nFEATURE_DIR = find_feature_dir(Path.cwd().resolve())\nFIGURES_DIR = FEATURE_DIR / "figures"\nFIGURES_DIR.mkdir(exist_ok=True)\nprint(FEATURE_DIR)\n"""),
            markdown_cell("""## Analysis\n\nAdd DataFrames, charts, and interpretation here.\n"""),
            markdown_cell("""## Decision Summary\n\nDecision: Build / Defer / Narrow / Reject\n\n### Why\n\n### Evidence\n\n### MVP Scope\n\n### Risks\n\n### Open Questions\n\n### Next Action\n"""),
        ],
        "metadata": {
            "kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"},
            "language_info": {"name": "python", "pygments_lexer": "ipython3"},
        },
        "nbformat": 4,
        "nbformat_minor": 5,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Create a Vibe-to-MIDI feature research notebook scaffold.")
    parser.add_argument("feature_name", help="Feature name, e.g. 'Android audio preview'")
    parser.add_argument("--date", default=date.today().isoformat(), help="Date prefix in yyyy-mm-dd format")
    parser.add_argument("--root", default=".", help="Repository root")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    feature_slug = slugify(args.feature_name)
    directory_name = f"{args.date}_{feature_slug}"
    feature_dir = root / "research" / "features" / directory_name
    notebook_dir = feature_dir / "notebooks"
    figures_dir = feature_dir / "figures"
    notebook_path = notebook_dir / "analysis.ipynb"

    notebook_dir.mkdir(parents=True, exist_ok=False)
    figures_dir.mkdir(parents=True, exist_ok=True)

    notebook = create_notebook(args.feature_name, directory_name)
    notebook_path.write_text(json.dumps(notebook, indent=2))

    print(notebook_path)


if __name__ == "__main__":
    main()
