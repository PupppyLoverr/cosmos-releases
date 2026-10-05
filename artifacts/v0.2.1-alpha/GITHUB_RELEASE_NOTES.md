# Cosmos 0.2.91 — alpha

Desktop builds are all from cosmos `0bc89e45` (main, everything through PR #43). macOS Apple silicon, Windows x86_64, Linux x86_64, plus the native iOS app (unsigned IPA) and the older Expo companion under `mobile/`.

Everything since the last alpha refresh — ~120 commits — is in this build.

## Highlights

- **Cloud mode** — run a coding agent on a cloud computer straight from the desktop: Railway free trial or a Boat token, your GitHub repo checked out on the seat, chat/diffs/files/terminal/live desktop in one window, Take control when you want the keyboard.
- **Cloud transcripts look exactly like local ones** — streamed markdown, expandable tool-call chips, reasoning and error blocks. No more raw JSON or escape codes.
- **Native iOS app** — ported to a real UIKit app (`sh.cosmos.ios`): Woozlit sign-in, model + changes pills, on-device dictation, a voice call mode that talks back.
- **Cosmos TUI** — the `cosmos` CLI is now a full themable agent terminal: skins with live reload, `/customise` restyles it with any model, session tree, cost ledger, sandboxed shell.
- **Live model catalogs** — model lists stream in real time from Devin and Cursor agents over ACP; the same picker works on cloud seats.

## Cloud mode

- Agent / Cloud toggle in the sidebar; Cloud chats are runner-hosted synced chats with profile-scoped continuity and attachment recovery.
- **Railway free trial**: one click starts a seat. If Railway needs an account, "Continue with Railway" walks the signup and the seat chip reads "Railway trial — finish on Railway" while it waits. Claim-required and refusal states surface instead of sitting on "starting…" forever.
- **Real failure messages**: port 22 blocked by your network/VPN, no IPv4 route (the trial is IPv4-only), or Railway busy/refused — each with a concrete next step (another Wi-Fi or hotspot, or a Boat token).
- **Boat seats**: paste a token, lifecycle managed; clearer validation ("Sign in to add a Boat token", "Paste your Boat token first").
- **GitHub**: sign in with the Cosmos GitHub App (`cosmos-ade`) over Device Flow — no token field. The folder picker lists your repos with search, each chat gets its own checkout on the seat, and the pick survives restarts.
- **Computer pane**: shows the actual Linux seat — X desktop capture, or on headless seats a live console with OS, CPU/memory/disk and top processes refreshing every 4s. Take control types and clicks on the seat.
- **Workspaces**: per-chat cloud workspaces with checkpoints and local backups; Railway workspaces snapshot after every turn so a trial expiring never loses work. Seat bindings persist across restarts, and a provisioned trial seat is never lost to dedupe.
- **Credentials**: existing CLI logins — including a Claude subscription — stage onto the seat automatically.
- **Runs**: survive a desktop restart (reconnect, live progress, harness status in the transcript and the composer pill); sends are blocked with a clear reason if no seat is running.
- **Transcripts**: remote runs fold through the same pipeline as local runs — tool calls are expandable chips with their inputs, reply text is streamed markdown, reasoning and errors are their own blocks. Log tails are framed and ANSI-stripped, harness banners dropped, and unknown harnesses fall back to clean line-broken text. Works the same on Boat seats, and reattaching to a run keeps everything it already streamed.
- **Right pane**: Computer, Files, Changes, Shell, Progress, Context, Tasks, Pull requests and Side chat share one tab strip with Agent mode — no separate panel. Monochrome status everywhere; the Railway claim banner is redacted out of Shell output.
- Side chats opened from a cloud chat stay in Cloud mode on the same seat.
- Onboarding offers Boat or the free trial; Kanban and Automations views were rebuilt around seats.
- Cloud settings are trimmed to what you need: Railway trial, Boat token, GitHub — and a single "Sign in to use a cloud computer" card when signed out.

## Desktop

- Right-pane tabs: "+" stays pinned when tabs overflow (including Glass themes) and the active tab scrolls into view.
- Archived chats offer Unarchive; archiving is faster.
- Sessions are scoped by mode — Agent and Cloud sidebars don't mix.
- The Cloud pane reopens only on a chat's first visit, and saved seat/repo/harness picks persist and resolve correctly across restarts.
- macOS sign-in callback falls back to `[::1]`; engine worker stacks raised to 8 MiB (fixes diff RPC crashes); the sidebar scrollbar stays visible.

## iOS app (native, unsigned IPA)

- Full port of the Zeron iOS app (`apps/ios`, `sh.cosmos.ios`, iOS 26+), signed in with the Woozlit account.
- Composer: a Model pill and a Changes pill (+/− per file) above the input — switch the model mid-task (applies on the next turn) — plus a plain +, on-device mic dictation, and a voice call mode (dot-sphere orb; shows title, model, status; speaks the reply).
- Model picker: search, a favorites rail, per-harness lists, a provider rail, opaque headers.
- Compact transcript mode (Settings toggle) folds a turn's work into one step.
- The Changes bar tracks every file edit; a session's header updates live when its model changes.
- Dictation and voice call explain themselves instead of crashing when there's no usable mic.

## Cosmos TUI (`cosmos` CLI)

- Hardened base: compaction, provider and exit-code correctness; 5.7 MiB binary; native memory handling.
- Sandboxed shell including Windows, plus background jobs.
- Subscription plugins over ACP with allowlists everywhere.
- Self-improve loop, local slash commands, and a fence around self-mutation.
- Status-line cost ledger; branch-aware session tree with `/tree`.
- **Skins**: `ui.toml` themes with live reload — thinking orb, Cosmos verbs, shimmer and fade-in, richer tool calls and groups, a `ctrl+o` pager, real diffs, buddy + notifications.
- **`/customise`**: any model restyles the TUI while you work — verified live with ChatGPT and Cursor ACP.

## Harnesses and models

- Model lists stream in real time from Devin and Cursor agents over ACP.
- The Cursor harness loads your MCP servers and plugins.
- The same harness + model picker drives local sessions and cloud seats (picked from the seat's own catalog).

## Fixes picked from upstream Zeron

- Appearance: reduce-motion setting and pause animations in the background (#642).
- Transcript selection no longer leaks through popups (#556).
- OpenCode 2.x context usage attributed and cleared correctly (#634).
- Queue attachment filenames hidden, hover overflow fixed (#650).
- glibc malloc arenas trimmed on Linux — lower idle memory (#635).
- Ctrl+N jump hints stay on one line in compact sidebar rows (#641).
- Command palette no longer lists child chats (#651).
- Provider policy editable in expanded details; stable chevron (#596).
- Idle reaper no longer kills a parked session's live subagents (#637).
- Diff-sync ignores file reads — it was re-kicking on every checkout (#605).
- Run loop no longer spins on empty subagent events (#604).
- Terminal scroll keeps fractional movement (#615).
- Archiving chats is faster (#602).

## Install

- **macOS** (Apple silicon, macOS 12+): open the DMG, drag `Cosmos.app` to Applications. Ad-hoc signed — right-click → Open on first launch.
- **Windows** (x86_64, Windows 10/11): `Cosmos-Setup-x86_64.exe` installs per-user with a Start Menu entry and uninstaller; `cosmos-0.2.91-windows-x86_64.zip` is the portable build (`install.cmd` copies to `%LOCALAPPDATA%\Cosmos\bin` and adds it to PATH). Not code-signed — SmartScreen: More info → Run anyway.
- **Linux** (x86_64, glibc 2.35+, e.g. Ubuntu 22.04+ / Debian 12+): `sudo apt install ./Cosmos-linux-x86_64.deb`, or the AppImage (`chmod +x`, needs `libfuse2`), or the tar.gz. No aarch64 build.
- **iOS** (iOS 26+): unsigned IPA — sideload per `mobile/SIDELOAD.md` (Sideloadly/AltStore). Live mic dictation and spoken replies were not exercised on-device in this test pass.

## Assets

| File | SHA-256 |
| --- | --- |
| `cosmos-0.2.91-macos-arm64.dmg` | `c57af28ca4cc8f5be828d565f95fcb178098a3a9963d894d3e115bd4d72de08d` |
| `windows/Cosmos-Setup-x86_64.exe` | `aeaec29c91c9e73be13313cccc92f1857979dd7f01d827da85a72d4d7ff979a9` |
| `windows/cosmos-0.2.91-windows-x86_64.zip` | `07b1a6c99478f4358b845d716d3411f8c0f52f9cfa210ebdf997a2e1d69d47d6` |
| `linux/Cosmos-linux-x86_64.deb` | `8507a40186b75d0e57bbdd4671e4ecb696497308374a9549350edbb9d4c17243` |
| `linux/Cosmos-linux-x86_64.AppImage` | `d2263a5a15e4c7990dbfe601a716cda9b26876bf4a25693773817f3d6b11b1b9` |
| `linux/Cosmos-linux-x86_64.tar.gz` | `aefdfbc113b9ac41c3cc31ac4049113f1aa9d8a1e14bf1a1a205ca89b9710b5a` |
| `linux/cosmos-0.2.91-linux-x86_64.tar.gz` | `1b82b3933d79ff0cd42ecabc71b483715f3342e0bba6b755f1b47852f881de52` |
| `ios/Cosmos-0.2.91-ios-unsigned.ipa` | `cd46eb3e175a6bde9a0acbff99808a027e66f744a987debd9715891202993bba` |
| `ios/Cosmos-0.2.91-ios-voice-composer-unsigned.ipa` | `9e582f3fcbb86f1bf8e36dd8b66bf2b6f696610a7b335939c9fd1ec99d7ee80c` |
| `mobile/Cosmos-0.2.79-ios-unsigned.ipa` | `e36f8baa99de8bedf464d939b30b0e1f2f3eb285f2417ac30777d7af427cdd5b` |
