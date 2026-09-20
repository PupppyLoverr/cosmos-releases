# Cosmos v0.2.1-alpha (macOS)

Source: https://github.com/PupppyLoverr/cosmos @ 4964024f (main, merge of PR #12 — includes PRs #8/#10/#11/#12). Rebuilt 2026-09-20; supersedes the earlier build at 227b3de7.

## Assets

| File | SHA-256 |
| --- | --- |
| `cosmos-0.2.79-macos-arm64.dmg` | `0965047d604308293940703d3dc49666aeeab252ef68a25825d7e1e1e908a2b3` |
| `cosmos-0.2.79-macos-arm64-app.tar.gz` | `22d185bf5f8a4d6588eb91f9c43cc99914bf5915bf38b1fed67ae685699cf833` |

## Highlights

- Cosmos-branded app bundle, DMG and archive names (`Cosmos.app`, `cosmos-<version>-macos-arm64.dmg`).
- The inherited Zeron in-app updater is disabled fail-closed: no background check, no update strip, no `update` CLI action. Cosmos builds cannot resolve or download the upstream Zeron release channel.
- Computer Use: real open-source Cua driver (0.28.2) behind the Cosmos computer service, native macOS Accessibility menu dispatch, driver liveness/respawn, sheet retargeting.
- Expo companion app (iOS + Android) with sessions, live watch, remote Computer Use start/stop, pairing and harness marks.
- Linux Computer Use 2.0 X11 fast path ported from PR #6.
- Save panels accept absolute paths (Go to Folder + basename); mobile pair/new-session sheets render on iOS 27; Trust & link label readable in dark mode (PR #8).
- First-run chooser: "Use locally" (no account, LAN phone pairing) or "Log in" (Woozlit → synced workspace) — one-time card, device-local (PR #12).
- Mobile de-slop: title-only Sessions rows, neutral harness marks, empty New Session composer canvas, real desktop names everywhere (PR #12).

## Install (macOS, Apple silicon)

Open the DMG and drag `Cosmos.app` to Applications. The bundle is signed with a local development identity, so the first launch needs right-click → Open (or `xattr -d com.apple.quarantine`).

Accessibility for Computer Use must be enabled once per Mac in System Settings → Privacy & Security → Accessibility.

Windows and Linux builds for this tag are produced by the release workflow in `PupppyLoverr/cosmos` and are not included here.
