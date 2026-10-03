# Cosmos 0.2.91 rebuild — source `5eb9c9e1` (PR #36 branch)

All desktop builds below come from cosmos `5eb9c9e16acab011f1109039cf76f956be4fe131` (main + PR #36). The iOS IPA is unchanged: no iOS source changed since the previous build.

| File | SHA-256 |
| --- | --- |
| `cosmos-0.2.91-macos-arm64.dmg` | `5c22a228c84f3c57a371112a0080d3b5097b54e47a39764ee4d762ea83dff4ca` |
| `windows/Cosmos-Setup-x86_64.exe` | `67affd67969a460e68154c2669f13540c22c03fbe4fc3ddef31b5fa3d288708c` |
| `windows/cosmos-0.2.91-windows-x86_64.zip` | `de1a9f2a023028fcdbf0784bac451ddba90e1d9668e1b6f4726d4b2e5592f3d2` |
| `linux/Cosmos-linux-x86_64.deb` | `f3777be51a3358573e7247b1ce7fc0a793c3f05042d0bbbfaf4fd71f905867ad` |
| `linux/Cosmos-linux-x86_64.AppImage` | `5956b58d25a9fcf36bd7a1f5f84f0da50dd13fd14dc7dddaf8e7eb281f6049e0` |
| `linux/Cosmos-linux-x86_64.tar.gz` | `b7c52dd5baf83d3725c5c677cef9d3bb19428c2b65e9a6a8f3b2a783cb4008e9` |
| `linux/cosmos-0.2.91-linux-x86_64.tar.gz` | `f3b3d6ce996e4f3a06ceb706f080e7f84f9dfcb0d8e78b996a1c39bc92ab06c9` |

What's new:
- Right-pane tabs: "+" stays pinned and visible when tabs overflow (including Glass themes), and the active tab scrolls into view.
- Archived chats offer Unarchive.
- Side chats opened from a Cloud chat stay in Cloud mode on the same seat.
- Includes the Cloud rail lifecycle / monochrome Cloud UI from PR #34.

macOS DMG is ad-hoc signed (right-click → Open on first launch). Windows builds are not code-signed (SmartScreen: More info → Run anyway).

# Cosmos 0.2.91 rebuild — source `63588940` (PR #34)

| File | SHA-256 |
| --- | --- |
| `cosmos-0.2.91-macos-arm64.dmg` | `e94e6429c8fe06d7dc01ae2cb8a2050158ae32d8e5917a238d853d7cbcf40a7c` |
| `ios/Cosmos-0.2.91-ios-unsigned.ipa` | `cd46eb3e175a6bde9a0acbff99808a027e66f744a987debd9715891202993bba` |

What's new:
- Diffs tab no longer crashes; macOS sign-in callback falls back to `[::1]`.
- Cloud rail lifecycle + monochrome Cloud UI.

IPA unsigned, re-sign before installing.

# iOS voice composer preview — source `d2d59873` (cosmos PR #31)

| File | SHA-256 |
| --- | --- |
| `ios/Cosmos-0.2.91-ios-voice-composer-unsigned.ipa` | `9e582f3fcbb86f1bf8e36dd8b66bf2b6f696610a7b335939c9fd1ec99d7ee80c` |

- Native Cosmos iOS app (`sh.cosmos.ios`, iOS 26+), unsigned — sideload as in `mobile/SIDELOAD.md`.
- Chat screen: a Changes pill (+/− per file) and a Model pill above the input; switch the harness model mid-task (applies on the next turn).
- Input bar: plain +, on-device mic dictation, and a voice call mode that listens, sends, and reads the reply aloud with the phone's built-in voice. No paid services.
- Live microphone dictation and spoken replies were not exercised in testing (the build Mac has no audio input).

# Cosmos 0.2.91 — source `268bbd1b`

Built from Cosmos `main` at `268bbd1b` (PRs #27–#29).

| File | SHA-256 |
| --- | --- |
| `cosmos-0.2.91-macos-arm64.dmg` | `4437f64a0e28ebf0457193c06368e68142e3a0d6e18cfd3b902e2d8077a52078` |
| `ios/Cosmos-0.2.91-ios-unsigned.ipa` | `096b09f2d66072d44c220fc63eb936e0053bb0a1391a2e213daf6dbb946f4bbe` |
| `windows/Cosmos-Setup-x86_64.exe` | `5a70fc685cf5f6ad2c09f046bb59d56497c71fdc20c46f63188f9b941982cb6d` |
| `windows/cosmos-0.2.91-windows-x86_64.zip` | `202f32a955c77d2325bd42caedd160a687f953cb88bccb06c1c6c40c0265f19e` |
| `linux/Cosmos-linux-x86_64.deb` | `5eaa0ab43383d299c6589c363d34b397e2a9a26fa0a1c54b6edea49b5815e4db` |
| `linux/Cosmos-linux-x86_64.AppImage` | `c11005b23aab16085cb15d29a42f2620c894f53df3e63b2f52f7de3d6305bd7d` |
| `linux/Cosmos-linux-x86_64.tar.gz` | `e2a878f4800c39ea3e380e53e362601c2d5ecdb196697a791ea179a6190c4f96` |
| `linux/cosmos-0.2.91-linux-x86_64.tar.gz` | `dc4e12efb5507db4227fe6253ddf7586f820f92c9942b58361ee0eb73c13ae03` |

- **macOS DMG** (24 MB, was 36 MB): LZMA (`ULMO`) image, macOS 12+, Apple silicon, ad-hoc signed — first launch needs right-click → Open.
- **iOS IPA** (18 MB): the native Cosmos iOS app (`sh.cosmos.ios`, iOS 26+), unsigned — sideload with Sideloadly/AltStore as in `mobile/SIDELOAD.md`. Woozlit account sign-in, compact transcript mode (More → Settings), and the new model picker with search, favorites and a provider rail. The older Expo companion IPA stays under `mobile/`.
- **Cloud mode:** the chosen cloud seat, GitHub repository and branch are remembered across restarts.
- **Windows** (x86_64, Windows 10/11): `windows/Cosmos-Setup-x86_64.exe` (24 MB) installs per-user with a Start Menu entry and uninstaller; `windows/cosmos-0.2.91-windows-x86_64.zip` (35 MB) is the portable build (`install.cmd` copies it to `%LOCALAPPDATA%\Cosmos\bin` and adds it to PATH). Not code-signed, so Windows SmartScreen may warn on first run (More info → Run anyway).
- **Linux** (x86_64, glibc 2.35+, e.g. Ubuntu 22.04+ / Debian 12+): `linux/Cosmos-linux-x86_64.deb` (`sudo apt install ./Cosmos-linux-x86_64.deb`), `linux/Cosmos-linux-x86_64.AppImage` (`chmod +x`, needs `libfuse2`), or the `.tar.gz`. aarch64 Linux builds are not included.

# Cosmos v0.2.1-alpha refresh — source `1e732c74`

This refresh is built from Cosmos `main` at `1e732c74`.

## Cloud mode and GitHub

- Cloud mode uses the shared right-side pane with Linux-aware Computer, Files,
  Changes, Shell, Progress, Context, Tasks, pull requests, and Side Chat views.
- The Cosmos GitHub App (`cosmos-ade`) uses Device Flow without a client secret.
- Cloud mode's repository picker lists the authenticated user's GitHub
  repositories, supports search and selection, and binds the selected checkout
  to the cloud seat.
- Cloud Computer reports the actual Linux/cloud environment instead of
  presenting a local desktop as the remote machine.
- The Devices page no longer crashes when opening phone pairing, and its
  account copy is Cosmos-neutral.

## iOS polish pass

- Quieter, denser native iOS chrome with centered session headers, compact Home rows, aligned separators, simplified New Session suggestions, and updated onboarding copy.
- The final mobile screenshots are staged under `evidence/ios-v3/`, including the v3 and v4 simulator captures.

## Computer-use reliability

- Terminal OpenCode provider errors now settle active turns as terminal errors, including the five-minute silence watchdog when no tool is running.
- `computer_observe` supports PID/window targeting and CoreGraphics frontmost selection.
- `launch_app` skips redundant open/readiness work when a visible window is already available.

## CLI portability and conventions

- Shared flag aliases, `--continue`, `--add-dir`, and `--system-prompt` / append-system-prompt behavior across zcli, zdev, and zagy.
- Full `/cost` reporting, direct `/init` scaffolding, `.mcp.json` discovery, shell-specific completions, and macOS/Linux portability improvements.

## Mobile Home information architecture

- Home organizes work by device, folder/project, and session.
- The All view aggregates sessions across linked devices; selecting a device narrows the view to that desktop.
- Session rows keep the status, harness, and recency metadata compact and tonal, with a docked composer.
- Release screenshots cover Home All, a single-device Home filter, and a session view on the iPhone 17 simulator.

## Computer Use fast input

When the target app is frontmost, pixel-based click and keyboard actions use a desktop-scoped route; pointer actions retain exact window identity, while keyboard actions accept any frontmost sibling window from the target app. The original window route remains the safe fallback.

- Frontmost click benchmark: approximately **256 ms**
- Frontmost type benchmark: approximately **105 ms**
- Window route benchmark: approximately **1.1 s**
- Recorded live-run medians: approximately **1,754 ms** for the window route versus **1,048 ms** for the fast-desktop route

The daemon benchmark and live-run artifacts are included under `evidence/computer-use-opencode/`.

## OpenCode recorded run

The recorded computer-use run used OpenCode free models, starting with `opencode/nemotron-3.5-lightning-free` and switching to `opencode/big-pickle`. The run searched Safari for an exchange rate, calculated the conversion, created and saved a TextEdit note, and verified the saved file and final desktop state.

Issues found during the run:

- Safari's address-bar suggestions created a same-process popup that initially caused `same_pid_keyboard_ambiguity` for Return; relaunching Safari recovered the task.
- Some window observations resolved to service-owned window names, so `computer_find` and desktop-scoped captures were used for verification.
- `type_text` strips control characters; multiline content was pasted through the clipboard path instead.
- Windows desktop needs a rebuild before this release's desktop behavior is available there.

## Release history

Source: https://github.com/PupppyLoverr/cosmos @ 9fa5da85 (main; includes PRs #8–#16 plus the edge migration — both apps now default to the Cosmos-owned relay `cosmos-edge.cosmos-edge.workers.dev`, which runs Woozlit auth: `/health` → `{"ok":true,"auth":"woozlit"}`. Upstream `edge.zeron.sh` still runs the WorkOS-only build and 401s every Woozlit token — pairing could never complete against it). Rebuilt 2026-09-21; supersedes all earlier builds (7bca97cc through 1b3cb8ec — none of them reach a working edge). The mobile IPA was repacked on 2026-09-20 (Payload/ layout fix — the earlier zip lacked the Payload wrapper and Sideloadly refused it; hash changed, code unchanged). Rebuilt again 2026-09-20 from main @ e858d67f (PRs #14+#15): PR #14 fixes real-device pairing 'signed out' — the Woozlit session now persists its access token so relay dials, account device listing and QR/code pairing all authenticate. PR #15 bounds every edge fetch (15s) and fails fast with a real message when the desktop isn't checked into the relay, instead of an indefinite spinner. Desktop 'Show code' is now gated on sign-in.

## Assets

| File | SHA-256 |
| --- | --- |
| `cosmos-0.2.79-macos-arm64.dmg` | `0417591ac7378b418cd65b5cd5d5f7169bc0f0fb443bb556c640f8402b88242b` |
| `cosmos-0.2.79-macos-arm64-app.tar.gz` | `0634692174f6fd3b7ee5e3814b32b9d8059b3f5917b05eb29f9ae1f681d817f2` |
| `mobile/Cosmos-0.2.79-ios-unsigned.ipa` | `2963097ebf601f7cc1b62737fbdc912c1f239a4778c12abce63253d81481a77b` |

The earlier `mobile/Cosmos-0.2.79-ios-unsigned.xcarchive.zip` predates this build and was removed; sideload the IPA per `mobile/SIDELOAD.md`.

## Highlights

- Cosmos-branded app bundle, DMG and archive names (`Cosmos.app`, `cosmos-<version>-macos-arm64.dmg`).
- The inherited Zeron in-app updater is disabled fail-closed: no background check, no update strip, no `update` CLI action. Cosmos builds cannot resolve or download the upstream Zeron release channel.
- Computer Use: real open-source Cua driver (0.28.2) behind the Cosmos computer service, native macOS Accessibility menu dispatch, driver liveness/respawn, sheet retargeting.
- Expo companion app (iOS + Android) with sessions, live watch, remote Computer Use start/stop, pairing and harness marks.
- Linux Computer Use 2.0 X11 fast path ported from PR #6.
- Save panels accept absolute paths (Go to Folder + basename); mobile pair/new-session sheets render on iOS 27; Trust & link label readable in dark mode (PR #8).
- First-run chooser: "Use locally" (no account, LAN phone pairing) or "Log in" (Woozlit → synced workspace) — one-time card, device-local (PR #12).
- Mobile de-slop: title-only Sessions rows, neutral harness marks, empty New Session composer canvas, real desktop names everywhere (PR #12).
- WAN phone pairing (PR #13): Settings → Devices "Pair phone" shows a single-use QR + 6-char code (5-min TTL) bound to the signed-in account + deviceId; the phone scans/types it under the same Woozlit login and reaches the desktop over the Cosmos-owned edge relay from cellular/another city — sessions, steer/stop, Watch Live. Per-phone Revoke on the desktop. Same-network pairing stays as an advanced fallback.
- Mobile visual redesign (PR #13): the iOS app now renders the desktop's actual Solar Linear icon set — 127 SVG assets shared verbatim from `crates/ui/assets/icons/` via a generated `solar-icons.ts` (Solar Icons CC BY 4.0), plus 20 new glyphs drawn in that style and embedded in the desktop too. Neutral ink-on-fill icon tiles (no candy tints), hairline-border composer plate, pixel-asterisk Cosmos mark, "desktop"/"This Desktop" copy (Windows/macOS/Linux neutral).
- Pairing hardening (PR #16): the phone fails fast instead of spinning — relay `host_offline`/`host_closed` frames now surface as "the desktop is offline"/"went offline" and force a clean reconnect that re-authorizes; the typed-code path can no longer swallow errors silently; a failed re-auth after reconnect shows "unpaired — pair again"; the edge URL is overridable via `EXPO_PUBLIC_EDGE_URL`; and the desktop's pair offer distinguishes signed-out vs non-synced profiles. Verified end-to-end: `crates/engine/tests/pairing_edge_live.rs` exercises the real edge worker (owner gate 403s, code issue→redeem→grant, second-conn authorize, host_closed broadcast), and the shipped `rpc.ts` was driven live under Node — RPC, streams and both relay bounces all pass.

## Edge status

- Live relay: `https://cosmos-edge.cosmos-edge.workers.dev` (`{"ok":true,"auth":"woozlit"}`).
- Deployed end-to-end verified: `pairing_edge_live` (the real Rust engine + real device-room flow) ran green against production workerd — owner gate, code redeem→grant, second-conn authorize, gated surface, `host_closed` broadcast.
- R2 buckets are not yet bound: R2 enablement is a one-time dashboard toggle on the Cloudflare account (free tier), then re-run `wrangler r2 bucket create cosmos-edge-blobs` / `cosmos-edge-releases` + `wrangler deploy -c wrangler.cosmos.jsonc`. Pairing and remote control never touch R2 — it only serves blob offload, nightly backups, and edge-hosted release assets.
- Windows installer: not buildable on this macOS VM — run `scripts/package-windows.ps1` on Windows; the pairing path is platform-neutral and needs no port forwarding.
- IPA rebuilt @ `9fa5da85` — UI/UX overhaul: markdown transcript (inline code, code blocks, quotes, lists, tables, links), tool-group accent edge + Running/Done status pills, mono command paths, full onboarding rewrite (aurora backdrop, staggered entrances, stage transitions, spring-press CTAs), and the "Show the welcome again" settings row now replays onboarding instantly. Remote-control internals unchanged; also pins `react-native-gesture-handler@3.3.0` (previously transitive — got pruned from node_modules).
- IPA rebuilt @ `bf358de5` with the sign-in token fix: the Woozlit callback's *custom* token is a JWT and was wrongly stored as the relay bearer (the desktop engine always exchanges it; the phone now does too) — that mismatch is what produced the "relay rejected this sign-in" 401 on-device. **Required once on the phone: Settings → Sign Out → sign back in** so the session stores the real Firebase id token + refresh token.

## Install (macOS, Apple silicon)

Open the DMG and drag `Cosmos.app` to Applications. The bundle uses an ad-hoc signature, so the first launch may require right-click → Open (or `xattr -d com.apple.quarantine`).

Accessibility for Computer Use must be enabled once per Mac in System Settings → Privacy & Security → Accessibility.

Windows and Linux builds for this tag are produced by the release workflow in `PupppyLoverr/cosmos` and are not included here.

- Rebuild @ 77cb30e4 — session transcript fix (FlatList), PR #24
- Rebuild @ afc3d072 — drawer nav / custom chrome / floating composer
- Fix blank Pair sheet, main d13c70df
- Rebuild @ 7eaf25e5 — Live Activity + Home-list fix
- Rebuild @ 342e8c63 — Cursor-style minimal iOS reskin; computer-use adaptive polling

### iOS build from cosmos `08db4953`

- Stays paired through desktop sleep / lid close / restart: the phone shows "asleep or closed" and reconnects on its own when the desktop returns (LAN and relay).
- Pairing grants expire six months after pairing; the phone then asks to pair again.
- Faster Home and transcript lists; stale-safe transcript streams.
- Includes selected upstream Zeron fixes (#508, #524, #548) on the desktop side.
- Live Activity extension, Cosmos icon and `cosmos-edge.cosmos-edge.workers.dev` relay verified in the bundle; no `edge.zeron.sh`.

## Desktop 0.2.90 (cosmos main 8ae405cc)

- Cloud Computer pane shows the seat's Linux desktop (X display capture) or, on headless Railway/Boat/SSH seats, a live Linux console: OS, CPU/memory/disk and top processes, refreshing every 4s.
- GitHub connects through the Woozlit GitHub App (device flow) in Settings → Cloud computer; no token field by default.
- Right-pane picker and pane headers aligned for Agent and Cloud modes.
