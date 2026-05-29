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

## Release Operations Plan

Source research:

```text
research/features/2026-05-23_release-operations-observability/
```

Recommendation:

```text
Narrow / Build first layer
```

Use a small operations stack for the first public Android release. Do not add a
full analytics platform before the privacy policy, event schema, and release
process are explicit.

### Implemented Prep

- Settings menu shows selectable runtime diagnostics:
  - app version
  - native build version
  - Android package name
  - EAS project id
  - execution environment
- Keep these values privacy-safe. They are intended for support reports and
  crash triage, not user tracking.

### Before Public Release

Required:

- Add Sentry for React Native / Expo crash and JS error reporting.
- Configure release and source map upload for EAS Build.
- If EAS Update is enabled, configure source map upload for `eas update` output.
- Add privacy policy language for crash diagnostics and device/app metadata.
- Add a release smoke-test checklist covering:
  - Android install from release build
  - playback audio
  - playback video
  - Pro Preview disabled in production
  - Settings diagnostics visible
  - licenses screen
  - privacy policy link
- Monitor Google Play Android vitals after release.

Do not commit:

- Sentry auth tokens
- service credentials
- `google-services.json`
- Play signing material
- private support exports

### If Using EAS Update

Add and document:

- staging update channel
- production update channel
- rollout percentage strategy
- `runtimeVersion` policy
- `eas update:republish` rollback procedure
- fix-forward procedure for unsafe rollback cases

Never use OTA updates for changes that require native modules or native config,
including adding/removing packages such as `expo-video`,
`react-native-audio-api`, billing SDKs, or Firebase SDKs.

### After Public Release

Daily/weekly checks:

- Sentry new issues and regressions.
- Google Play Android vitals crash and ANR clusters.
- Store pre-launch report failures.
- User support messages with app version/build/package metadata.

Prioritize fixes by:

1. launch crashes
2. foreground user-perceived crashes
3. ANRs
4. audio/video playback failures
5. purchase/entitlement failures
6. UI defects

### Deferred Integrations

- Firebase Crashlytics: consider only if Firebase is adopted or Sentry is not
  sufficient for Android crash/ANR workflow.
- Firebase Remote Config: add only when there is a concrete kill switch or
  remotely controlled feature.
- Firebase Analytics or another analytics SDK: add only after a privacy plan and
  event schema are approved.
- EAS Observe: revisit when the project SDK/access level fits and startup/TTI
  metrics become a release priority.
- RevenueCat webhooks: add only when real Pro billing is implemented and a
  secure backend endpoint exists.
