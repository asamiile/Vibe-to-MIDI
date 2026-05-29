# QA: Saved Ideas (Persistence)

Manual test checklist for the Saved Ideas feature.
Run on a physical Android device using a development build.

## Prerequisites

- Development build installed (not Expo Go)
- Fresh install or cleared app data to start from empty saved list

---

## 1. Save

| # | Condition | Steps | Expected |
|---|-----------|-------|----------|
| 1-1 | Bookmark button hidden before generation | Launch app, do not tap play | Bookmark button not visible in PlayerBar |
| 1-2 | Bookmark button appears after generation | Tap the play button to generate a track | Bookmark button (`bookmark-border`, faint) appears at right of track name row |
| 1-3 | Save current idea | Tap the bookmark button | Icon changes to filled `bookmark` in accent color; button becomes disabled |
| 1-4 | Duplicate save prevented | Tap the bookmark button again on the same track | No action, no duplicate added |
| 1-5 | Flag resets on new track | Tap play again to generate a new track | Bookmark button returns to `bookmark-border` (faint) |

---

## 2. List

| # | Condition | Steps | Expected |
|---|-----------|-------|----------|
| 2-1 | Empty state | Open Saved Ideas modal with no saves | Shows `NO SAVED IDEAS` message |
| 2-2 | Saved item appears | Save a track, open Saved Ideas modal | List shows chord label, BPM, sound combination label, and saved date |
| 2-3 | Multiple items ordered | Save 2–3 tracks, open modal | Items ordered newest first |

---

## 3. Load

| # | Condition | Steps | Expected |
|---|-----------|-------|----------|
| 3-1 | Load restores playback | Tap a saved item in the modal | Modal closes, track starts playing with the saved sound |
| 3-2 | MIDI tab reflects loaded track | Load a saved track, open MIDI tab | DAW steps and notes match the saved pattern |
| 3-3 | Learn tab reflects loaded track | Load a saved track, open LEARN tab | Theory explanation matches the saved track |
| 3-4 | Bookmark shows saved state after load | Load a saved track | Bookmark button shows filled accent icon |

---

## 4. Delete

| # | Condition | Steps | Expected |
|---|-----------|-------|----------|
| 4-1 | Delete removes item | Tap delete icon on a saved item | Item removed from list immediately |
| 4-2 | Delete persists across restart | Delete an item, force-close and reopen app | Deleted item does not reappear |

---

## 5. Persistence across restart

| # | Condition | Steps | Expected |
|---|-----------|-------|----------|
| 5-1 | Saved ideas survive app restart | Save a track, force-close app, reopen | Saved item still present in list |
| 5-2 | Load works after restart | Save a track, restart app, load from list | Track plays correctly |
