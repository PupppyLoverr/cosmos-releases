# Cosmos mobile — native iOS Simulator E2E (run7)

## What ran

- **Repo**: `15222de6` on `devin/1789889944-mobile-polish-e2e` (item-1 mobile redesign changes in the working tree).
- **Desktop engine**: packaged `target/package/Cosmos.app` v0.2.79 (ad-hoc signed), launched via `Contents/MacOS/zeron` with `ZERON_MOCK_QUESTION=1 ZERON_MOCK_DELAY_MS=500`; embedded engine on `ws://127.0.0.1:27654`, data dir `~/.zeron`, device_id `31543e43-019d-4b66-b7cc-5da3d164aa77`, registered name "Apple Virtual Machine 1".
- **Mobile**: `apps/mobile` native dev-client build (`npx expo run:ios`) on iPhone 17 Simulator `D0B64A8A-D5F1-4668-8FFC-A86B400AF527` running **iOS 26.5**, JS served by Metro. NOT Expo Go.

## Build/infra notes

- xcodebuild initially saw zero eligible destinations ("iOS 26.5 is not installed"). Fixed with `sudo xcodebuild -downloadPlatform iOS` (8.5 GB component). The originally specified booted sim `8E780854` is an iPhone 17 on **iOS 27.0**; after the platform install it became eligible too, but the already-booted iOS-26.5 iPhone 17 `D0B64A8A` was used (same device model).
- `pod install` earlier needed `LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8` (CocoaPods 1.17 + Ruby 4 unicode-normalization crash).

## Seeded state (engine IPC, ws+JSON unauthenticated localhost)

- 3 idle chats for Sessions-list density: claude-code / opencode / codex, staggered timestamps.
- 1 mock-harness chat `14d2e83d-f387-4835-9e3d-c4102fb5b635` ("Describe what you see"), run queued → parks at `awaitingInput` (persistent until interrupted). Used for Watch Live → Stop.
- No agent CLI/API keys on this Mac → phone-created session runs error after landing in transcript (expected, captured).

## Flow coverage (all verified in `recording.mp4` + screenshots)

| # | Step | Result |
|---|------|--------|
| 01 | Pair: 127.0.0.1:27654 → Check Connection → Trust & Link | ✅ probe "Cosmos found at 127.0.0.1 · Engine reachable" → hero |
| 02 | Desktops hero resolved name | ✅ "Apple Virtual Machine 1" (placeholder `This Mac` replaced via adoptRegistryName), Online · Cosmos 0.2.79, facts row |
| 03 | Sessions redesign | ✅ small neutral-cornered harness-mark tiles + one-line titles + status dots + rel times; no letter avatars / status pills / gear badges |
| 04 | New Session | ✅ empty composer canvas (no mark/title block), single setup chip "OpenCode · Medium · Desktop", sheet = Agent marks + Model + Project + Effort + Permissions segmented |
| 05 | Send first message | ✅ lands on transcript with user bubble; turn failed (no agent CLI — expected, banner "The last turn failed — check the desktop for details") |
| 06 | Watch Live → Stop | ✅ watch sheet renders: LIVE pill, stage with `permissions_pending` error text, Pause, enabled destructive Stop → confirm dialog → session `awaitingInput→idle` (IPC-verified), controls card "Nothing running", Stop disables |
| 07 | Settings → Appearance | ✅ three separate rows Theme/Material/Backdrop each w/ value + chevron → opens Appearance editor (wallpaper/material pickers) |

## Known limitation — Watch Live frames

Real screen frames are **blocked by macOS Accessibility permission for CuaDriver** (auth_value 0 = denied in system TCC.db). Screen Recording IS granted (2). The driver's daemon-side permission gate requires both, so `ComputerObserve` returns `permissions_pending` — the watch stage correctly shows this error text instead of frames. The Accessibility grant was intentionally NOT applied (task constraint: no Accessibility password prompts). Stop/interrupt is independent of frames and worked end-to-end.

Side finding: `~/.zeron/computer/cua-driver/manifest-observe.yaml` (written by Cosmos) uses `schema_version: 1`, rejected by cua-driver 0.28.2 (`unknown field schema_version, expected version`) — schema drift between Cosmos's generator and the pinned driver; worth checking.

## Files

`01-pair.png` `02-sessions.png` `03-setup-sheet.png` `04-new-session.png` `05-transcript.png` `06-watch-live.png` `07-watch-stopped.png` `08-appearance.png` `09-sessions-pill.png` `recording.mp4`
