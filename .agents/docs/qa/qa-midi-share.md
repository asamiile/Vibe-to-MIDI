# QA: MIDI File Save / Share

Manual test checklist for the Pro-gated MIDI export and Android share sheet.
Run on a physical Android device using a development build.

## Prerequisites

- Development build installed (not Expo Go)
- Dev Pro Preview enabled via Pro screen toggle

---

## 1. Pro Gate

| # | Condition | Steps | Expected |
|---|-----------|-------|----------|
| 1-1 | Free user sees upsell | Launch app with `hasProAccess = false` | Export bar shows `Export MIDI · Pro` label and `Unlock .mid export for DAW editing.` subtitle |
| 1-2 | Free user tap routes to Pro screen | Tap the export bar in free state | Navigates to `/pro` screen |
| 1-3 | Pro user sees export CTA | Enable Dev Pro Preview | Export bar shows `Export .mid` label and `Share the current loop as a DAW-ready MIDI file.` subtitle |

---

## 2. Export Happy Path

| # | Condition | Steps | Expected |
|---|-----------|-------|----------|
| 2-1 | Tap triggers busy state | Tap `Export .mid` | Button label changes to `Exporting .mid` while share sheet is opening |
| 2-2 | Share sheet opens | Tap `Export .mid` | Android share sheet appears with a `.mid` file listed |
| 2-3 | Filename reflects current idea | Generate an idea, then export | Shared filename matches `vibe-to-midi-<vibe>-<scale>-<chord>.mid` |
| 2-4 | Success message shown | Complete or dismiss the share sheet | Export bar shows `<filename> ready to share` below the button |
| 2-5 | Busy state clears after share | Observe after share sheet is dismissed | Button label returns to `Export .mid`; tap is re-enabled |

---

## 3. File Integrity

| # | Condition | Steps | Expected |
|---|-----------|-------|----------|
| 3-1 | File opens in a DAW | Share to Google Drive, download on desktop, open in a DAW | File opens as a valid MIDI with the expected BPM and tracks |
| 3-2 | File opens in a MIDI player | Share via Bluetooth or Gmail to a device with a MIDI app | File plays back without errors |
| 3-3 | MIDI header is correct | Inspect raw bytes of exported file | First 4 bytes are `4D 54 68 64` (MThd) |

---

## 4. Error States

| # | Condition | Steps | Expected |
|---|-----------|-------|----------|
| 4-1 | Double-tap does not double-export | Tap `Export .mid` twice rapidly | Share sheet opens only once; second tap is ignored while busy |
| 4-2 | Failure message shown on error | Simulate failure (e.g. revoke storage permission, test in Expo Go) | Export bar shows `MIDI export failed. Try again from a development build.` |
| 4-3 | Recovery after failure | After a failure, tap `Export .mid` again in a valid build | Export succeeds normally; failure message is cleared |

---

## 5. Tab and Navigation State

| # | Condition | Steps | Expected |
|---|-----------|-------|----------|
| 5-1 | Export bar visible on Pattern tab | Open MIDI tab, select Pattern | Export bar is visible at the bottom of the pattern area |
| 5-2 | Export bar visible on Notes tab | Switch to Notes tab | Export bar remains visible |
| 5-3 | Export bar visible on Sound tab | Switch to Sound tab | Export bar remains visible |
| 5-4 | Message persists across tabs | Export, then switch tabs | Success/failure message remains until next export attempt |
| 5-5 | Navigate away and back | Export, navigate to another screen, return | Message has reset; export bar is back to default state |

---

## 6. Share Sheet Destinations

Spot-check at least two destinations from the share sheet.

| # | Destination | Expected |
|---|-------------|----------|
| 6-1 | Google Drive | File saved to Drive as `.mid` with correct name |
| 6-2 | Gmail | File attached to new compose window |
| 6-3 | Bluetooth | File transfer initiated |
| 6-4 | Cancel / dismiss | Share sheet closes; success message still shown; app is functional |

---

## Pass Criteria

- All items in sections 1–5 pass.
- At least two share destinations in section 6 work end-to-end.
- No crashes or ANRs during any scenario.
