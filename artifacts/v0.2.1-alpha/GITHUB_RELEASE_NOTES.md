# Cosmos 0.2.91 — alpha

Cosmos is a native desktop app for running coding agents — Claude Code, Codex, Cursor, opencode, Devin — on your own machine or on a cloud computer, in one window. This build is from cosmos `0bc89e45` and covers everything since the last alpha: macOS Apple silicon, Windows x86_64, and Linux x86_64.

## Highlights

- **Cloud mode** — run an agent on a cloud computer straight from the desktop: a free Railway trial or a Boat token, your GitHub repo checked out on the seat, chat/diffs/files/terminal/live desktop in one window, and Take control when you want the keyboard.
- **Cloud transcripts look exactly like local ones** — streamed markdown, expandable tool-call chips, reasoning and error blocks.
- **Live model catalogs** — model lists stream in real time from the installed agents; the same picker drives local and cloud seats.

## Cloud mode

- Agent / Cloud toggle in the sidebar; Cloud chats are synced chats that survive a desktop restart — reconnect, live progress, harness status in the transcript and the composer.
- **Railway free trial**: one click starts a seat. If Railway needs an account, "Continue with Railway" walks the signup and the seat chip reads "Railway trial — finish on Railway" while it waits. Claim-required and refusal states surface instead of sitting on "starting…" forever.
- **Real failure messages**: port 22 blocked by your network/VPN, no IPv4 route (the trial is IPv4-only), or Railway busy/refused — each with a concrete next step.
- **Boat seats**: paste a token, lifecycle managed, clear validation.
- **GitHub**: sign in with the Cosmos GitHub App over Device Flow — no token field. Pick any of your repos with search; each chat gets its own checkout on the seat and remembers it.
- **Computer pane**: shows the actual Linux seat — its desktop, or on headless seats a live console with OS, CPU/memory/disk and top processes refreshing every 4s. Take control types and clicks on the seat.
- **Workspaces**: every chat gets its own cloud workspace with checkpoints and local backups; Railway workspaces snapshot after every turn so a trial expiring never loses work. Your existing CLI logins — including a Claude subscription — are staged onto the seat automatically.
- **Transcripts**: cloud runs render through the same pipeline as local runs — tool calls are expandable chips with their inputs, reply text is streamed markdown, reasoning and errors are their own blocks. Reattaching to a run keeps everything it already streamed.
- **Right pane**: Computer, Files, Changes, Shell, Progress, Context, Tasks, Pull requests and Side chat share one tab strip — no separate panel.
- Cloud settings are three things: Railway trial, Boat token, GitHub. Sends are blocked with a clear reason when no seat is running.

## Also in this build

- Right-pane tabs: "+" stays pinned when tabs overflow, and the active tab scrolls into view.
- Archived chats offer Unarchive; archiving is faster.
- Sessions are scoped by mode — Agent and Cloud sidebars don't mix.
- Saved seat/repo/harness picks persist and resolve correctly across restarts.
- macOS sign-in callback falls back to `[::1]`; engine worker stacks raised (fixes diff-pane crashes); the sidebar scrollbar stays visible.
- Reduce-motion setting and animations paused in the background; command palette no longer lists child chats; provider policy editable in expanded details; terminal scroll keeps fractional movement; lower idle memory on Linux; a parked session's live subagents are no longer reaped.

## Install

- **macOS** (Apple silicon, macOS 12+): open the DMG, drag `Cosmos.app` to Applications. Ad-hoc signed — right-click → Open on first launch.
- **Windows** (x86_64, Windows 10/11): `Cosmos-Setup-x86_64.exe` installs per-user with a Start Menu entry and uninstaller; `cosmos-0.2.91-windows-x86_64.zip` is the portable build (`install.cmd` copies to `%LOCALAPPDATA%\Cosmos\bin` and adds it to PATH). Not code-signed — SmartScreen: More info → Run anyway.
- **Linux** (x86_64, glibc 2.35+, e.g. Ubuntu 22.04+ / Debian 12+): `sudo apt install ./Cosmos-linux-x86_64.deb`, or the AppImage (`chmod +x`, needs `libfuse2`), or the tar.gz. No aarch64 build.

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
