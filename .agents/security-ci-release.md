# Security, CI, and Release Automation

## Security Baseline

The project must avoid:

- committed secrets
- committed private keys
- committed API keys
- copyrighted audio assets without explicit redistribution rights
- personal data collection without design review
- analytics by default
- unreviewed third-party binary assets

Required practices:

- keep `.env` files out of git
- use fake values in example env files
- document licenses for audio assets
- review dependencies before adding
- ignore generated files unless they are required
- update `app/frontend/src/data/licenseNotices.ts` when runtime dependencies or bundled assets change

## CI Automation

Initial GitHub Actions should run on pull requests and main branch pushes.

Baseline checks:

- install dependencies
- lint
- typecheck
- test
- build

Later checks:

- dependency audit
- license report
- bundle size check
- Playwright smoke test
- audio asset license validation
- in-app license screen coverage for runtime notices

## Release Automation

Initial release goal:

- tag-based GitHub Release
- generated changelog
- uploaded Android build artifact when available

Later release goal:

- preview deploy
- production deploy
- Android release automation
- Electron desktop build
- signed and notarized Mac release after Apple Developer strategy is decided

## Versioning

Use semantic versioning after the MVP starts stabilizing:

- `0.x`: prototypes and experiments
- `1.0`: first stable public web release

Do not automate App Store or Mac signing until distribution and privacy strategy are decided.
