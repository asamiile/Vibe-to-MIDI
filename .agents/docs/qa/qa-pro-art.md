# QA: Pro Generative Art

Manual test checklist for Pro-gated artwork selection and video playback performance.
Run on a physical Android device using a development build.

## Prerequisites

- Development build installed (not Expo Go)
- Dev Pro Preview toggle available via Pro screen

---

## 1. Pro Gate

| # | Condition | Steps | Expected |
|---|-----------|-------|----------|
| 1-1 | Free user sees ART · PRO button | Launch app with `hasProAccess = false`, generate a vibe | PlayerBar shows `ART · PRO` text button |
| 1-2 | Free user tap routes to Pro screen | Tap `ART · PRO` | Navigates to Pro screen |
| 1-3 | Pro user sees ART selector | Enable Dev Pro Preview | PlayerBar shows `ART: <shortLabel>` button |
| 1-4 | Pro user can open picker | Tap `ART: <shortLabel>` | Artwork thumbnail picker modal opens |

---

## 2. Artwork Picker Modal

| # | Condition | Steps | Expected |
|---|-----------|-------|----------|
| 2-1 | Thumbnails display | Open picker as Pro user | Horizontal row of video thumbnail cards appears |
| 2-2 | Videos play in thumbnails | Observe picker after open | Each thumbnail card shows a looping muted video preview |
| 2-3 | Free artwork is included | Inspect picker | Free artwork (`Bioluminescent Network`) appears alongside Pro artworks |
| 2-4 | Selected state visible | Open picker with an active artwork | Selected card has accent border; others have hairline border |
| 2-5 | Selection updates PlayerBar | Tap a different artwork | Modal closes and `ART: <shortLabel>` updates to the selected artwork |
| 2-6 | Dismiss without selecting | Tap outside the modal | Modal closes; active artwork unchanged |

---

## 3. Pro Artwork Playback

| # | Condition | Steps | Expected |
|---|-----------|-------|----------|
| 3-1 | Pro artwork plays on start | Select a Pro artwork, tap play | Pro artwork video starts playing as background visual |
| 3-2 | Free artwork plays on start | Select free artwork, tap play | Free artwork video plays as expected |
| 3-3 | Artwork switches while playing | Tap play, open picker, select different artwork | Background visual switches to the new artwork without audio interruption |
| 3-4 | Video pauses on stop | Tap stop | Background video dims and pauses |

---

## 4. Android Performance (audio + video simultaneous)

| # | Condition | Steps | Expected |
|---|-----------|-------|----------|
| 4-1 | No audio dropout during video | Play audio, select Pro artwork, observe for 30 seconds | Kick, bass, noise, and STAB layers play without stuttering or dropout |
| 4-2 | No frame drops during playback | Play audio + Pro artwork video | Video plays smoothly (no visible frame drop or freeze) |
| 4-3 | No dropout when switching artwork | While audio is playing, open picker and switch artwork | Audio continues uninterrupted during artwork switch |
| 4-4 | No ANR or crash during extended play | Run audio + video for 5 minutes | App remains responsive; no ANR dialog or crash |
| 4-5 | Thumbnail picker does not affect audio | While audio is playing, open picker | Audio continues while thumbnail videos load in the picker |

---

## 5. Free User Restriction

| # | Condition | Steps | Expected |
|---|-----------|-------|----------|
| 5-1 | Pro artworks not selectable by free user | Disable Dev Pro Preview | Artwork picker is not accessible; only `ART · PRO` button shown |
| 5-2 | Free user retains free artwork | Disable Dev Pro Preview while Pro artwork is active | Background visual falls back to the default free artwork |

---

## Pass Criteria

- All items in sections 1–3 and 5 pass.
- All items in section 4 pass with no audio dropout or ANR on the target device.
