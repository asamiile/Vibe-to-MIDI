# Security, CI, and Release

Use installed Expo CI/CD and deployment skills for generic workflow and store guidance. This file keeps repo-specific guardrails.

## Security Baseline

Never commit:

- secrets, private keys, API keys, or real service credentials
- `.env` files with real values
- `google-services.json` or store signing material
- copyrighted audio, loops, stems, samples, presets, or reference media without explicit redistribution rights
- unreviewed third-party binary assets

## License Surface

When adding or changing runtime dependencies or bundled assets, update:

```text
app/frontend/src/data/licenseNotices.ts
```

For audio or media assets, record source URL, creator, license, attribution requirement, redistribution permission, and date checked.

If rights are unclear, do not commit the asset. Prefer generated synthesis.

## CI Expectations

The repo should keep these checks passing:

```bash
cd app/frontend
npx tsc --noEmit
npx jest --runInBand --no-coverage --watchman=false
```

Use Expo/EAS skills when editing `.eas/workflows/**`, `eas.json`, store metadata, or deployment automation.

## Release Boundary

Do not add analytics, Firebase, Play Store submission automation, or signing setup until the user explicitly starts release/privacy work.
