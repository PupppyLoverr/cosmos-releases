# run8 — Solar Linear icon redesign + neutral tiles verification

**What ran:** the visual-redesign delta (Solar Linear SVG icons via `react-native-svg`, neutral IconTile/EmptyState/perk tiles, rounded-rect composer plate, `zeron-logo` pixel-asterisk neutral mark, "Mac"→"desktop" copy sweep) — uncommitted working tree on `devin/1789949808-wan-pairing` (HEAD `7bca97cc`), bundled into a Release `main.jsbundle`.

**Builds & sims:**
- `sh.zeron.mobile` 0.2.79 **Release** (xcodebuild `-configuration Release -sdk iphonesimulator`, ad-hoc "Sign to Run Locally") on:
  - iPhone 17 `8E780854-5816-4435-AD8F-8098DF847EB5` — **iOS 27.0** (the requested target)
  - iPhone 17 `D0B64A8A-D5F1-4668-8FFC-A86B400AF527` — iOS 26.5 (cross-check)
- Engine: `target/package/Cosmos.app` pid 28475 at `ws://127.0.0.1:27654`, device `31543e43`. 5 seeded chats persisted in `~/.zeron` (claude-code, codex, 2×opencode incl. errored "Say hi back", mock "Describe what you see" idle).
- Recording: `recording.mp4` (this dir) — full annotated pass.

## Build defect found (fixed by rebuilding with signing enabled)

The Release binary installed at 19:23 had **no code signature / entitlements section at all** (`codesign -d --entitlements` → nothing). On iOS 27.0, `expo-secure-store` (which stores `cosmos.desktops`, `cosmos.activeDesktop`, theme prefs, auth session — all unguarded `setItemAsync`/`getItemAsync` in `client.tsx`/`theme.ts`/`auth.ts`) threw `KeyChainException: A required entitlement is not present` → **Trust & Link always failed** ("Couldn't link" alert). Pairing UI, engine probe, everything else worked — only persistence died.

Not fixable by re-signing: iOS 27's launchd refuses to spawn ad-hoc-signed binaries carrying `keychain-access-groups`/`application-identifier` (they're device provisioning entitlements), and Xcode strips those keys for simulator builds anyway (`.xcent` = `<dict/>`). An empty-but-DER-encoded entitlements blob is what the keychain actually needs — iOS 26.5 tolerated none at all.

**Resolution:** rebuilt via `xcodebuild -workspace ios/Cosmos.xcworkspace -scheme Cosmos -configuration Release` (which signs "Sign to Run Locally" + embeds the DER entitlements blob) → pairing then worked on iOS 27. So: **the shipped sim build must come from an Xcode-signed pipeline** (default `xcodebuild`/`expo run:ios`), not `CODE_SIGNING_ALLOWED=NO`. No repo source change needed; `expo-secure-store` is already in `app.json` plugins.

## Flow coverage (all on the recorded pass)

| Screen | Result | Notes |
|---|---|---|
| Desktops unsigned | pass | Solar laptop/monitor EmptyState tile, "desktop" copy, neutral wifi/globe Add rows |
| Pair sheet (unsigned) | pass | user-circle sign-in row, "Same network (advanced)" host/name fields, "Cosmos found" success tile (semantic green — allowed), Trust & Link w/ Solar link glyph |
| Sign-in sheet | pass | **zeron-logo pixel-asterisk** hero (64px), 3 neutral perk tiles (monitor/shield/monitor), "desktops" copy — zero "Macs" |
| Pair → hero | pass | "Apple Virtual Machine 1 · Online · Cosmos 0.2.79", facts row (Local network · 127.0.0.1 · Sessions · Computer Use error) |
| Sessions list | pass | title-only rows, neutral-cornered mark tiles; **mock row renders zeron-logo asterisk**; brand marks (claude/codex/opencode) keep brand fill; dots + rel times; no avatars/pills/gear |
| Transcript | pass | Solar header icons (chevron/monitor=Watch Live/ellipsis), user bubbles, error Notice w/ Solar danger-triangle, ↓Latest jump pill w/ Solar arrow |
| Composer | pass | rounded-rect plate w/ hairline border (radius ~14 — not floating pill), Solar + attach + send glyph |
| Send message | pass | bubbles land; turn errors (no agent CLI on host — expected); a "Session failed" local-notification banner also fired |
| Watch Live | pass | opens via header icon + menu item; IDLE pill, monitor stage icon, Solar pause pill, red Stop; stage shows `[driver_unavailable]` — CU daemon didn't answer initialize (env; run7 showed permissions_pending) — icon renders fine either way |
| Session menu | pass | native action sheet — Model / Effort · medium / Sandbox · workspace-write / **Watch Live** / Archive(red) |
| New Session | pass | empty canvas, 3 suggestions w/ thin glyphs, chip "OpenCode · Medium · Desktop" w/ mark+Solar chevron |
| Setup sheet | pass | all 11 agent marks render; Model/Project rows; Effort + Permissions segmented w/ Solar eye/folder/shield |
| Settings | pass | desktop row Solar laptop + Connected badge; bell tile now **neutral** (was #FF3B30); Appearance = 3 separate rows |
| Appearance | pass | neutral photo tile; segmented icons Solar (circle-half/sun/moon); preview copy "Working · Studio Desktop"; Reset Appearance stays red |

**Icon audit:** every visible content glyph renders Solar Linear 1.5px line style — nothing blank, nothing fell back to SF Symbols (checked: chevrons, wifi, globe, laptop, monitor, magnifier, ellipsis, plus, send, danger-triangle, pause, hand, user-circle, photo, eye, folder, shield, circle-half, sun, moon). Tab bar Sessions = `bubble.left.and.bubble.right` SF glyph (native — required by NativeTabs).

**Copy sweep:** zero visible "Mac"/"MacBook" on any screen; "This Desktop"/"your desktop"/"Studio Desktop" everywhere. `src/` grep clean.

## Not fully covered / caveats

- **"stop if running"**: untested live — engine has no `ZERON_MOCK_*` env → no parkable session; real-harness turns error in ~1s (too fast to catch the working banner). Stop/Pause affordances verified visually on the Watch sheet; run7 already proved interrupt end-to-end (`awaitingInput→idle` over IPC).
- **Signed-in pair-sheet QR section** (camera + code entry): unreachable without Woozlit auth. Its "Scan the desktop QR" row still has `iconTint={t.link}` (pair.tsx ~187) — the only surviving tinted IconTile; probably intentional as a permission CTA, flagging for completeness.
- **Manifest schema drift** (carried from run7): cua-driver 0.28.2 rejects Cosmos's `manifest-observe.yaml` (`expected version`, gets `schema_version`) → contributes to CU `driver_unavailable`/`error` state.
- Pair-sheet Address field retains a stale `192.168.1.20` value — cosmetic (state field, not persisted).

## Evidence

`recording.mp4` + screenshots: `01-unsigned-sessions` `02-desktops-unsigned` `03-signin` `04-settings` `05-appearance` (iOS 27, unsigned build) · `06-hero-paired-265` `07-sessions-list` `08-transcript-composer` `09-watch-live` `10-new-session` `11-setup-sheet` `12-session-menu` `13-settings-paired` (iOS 26.5, rebuilt Release) · `14-hero-paired-27` `15-sessions-27` `16-transcript-27` `17-watch-27` `18-new-session-27` (iOS 27, rebuilt Release — pairing working).
