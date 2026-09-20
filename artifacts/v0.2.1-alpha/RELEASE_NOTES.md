# Cosmos v0.2.1-alpha (macOS)

Source: https://github.com/PupppyLoverr/cosmos @ 227b3de70b411f78c14868fa8a59e70c1a26feb0 (tag `v0.2.1-alpha`)

## Assets

| File | SHA-256 |
| --- | --- |
| `cosmos-0.2.79-macos-arm64.dmg` | `ff9ac0bda2a2c6ea55dfdb6c34a55a66f99d5c7e36a7ba6161d79432d44dee38` |
| `cosmos-0.2.79-macos-arm64-app.tar.gz` | `c2efa11a4721736604f34c5252adf7658950b2dc8abae408a04a67898cbe134a` |

## Highlights

- Cosmos-branded app bundle, DMG and archive names (`Cosmos.app`, `cosmos-<version>-macos-arm64.dmg`).
- The inherited Zeron in-app updater is disabled fail-closed: no background check, no update strip, no `update` CLI action. Cosmos builds cannot resolve or download the upstream Zeron release channel.
- Computer Use: real open-source Cua driver (0.28.2) behind the Cosmos computer service, native macOS Accessibility menu dispatch, driver liveness/respawn, sheet retargeting.
- Expo companion app (iOS + Android) with sessions, live watch, remote Computer Use start/stop, pairing and harness marks.
- Linux Computer Use 2.0 X11 fast path ported from PR #6.
- Save panels accept absolute paths (Go to Folder + basename); mobile pair/new-session sheets render on iOS 27; Trust & link label readable in dark mode (PR #8).

## Install (macOS, Apple silicon)

Open the DMG and drag `Cosmos.app` to Applications. The bundle is signed with a local development identity, so the first launch needs right-click → Open (or `xattr -d com.apple.quarantine`).

Accessibility for Computer Use must be enabled once per Mac in System Settings → Privacy & Security → Accessibility.

Windows and Linux builds for this tag are produced by the release workflow in `PupppyLoverr/cosmos` and are not included here.
