# Cosmos v0.2.1-alpha (macOS)

Source: https://github.com/PupppyLoverr/cosmos @ f7836d9e (branch `devin/1789949808-wan-pairing`, PR #13 — includes PRs #8/#10/#11/#12). Rebuilt 2026-09-20; supersedes the earlier builds at 4964024f and 227b3de7.

## Assets

| File | SHA-256 |
| --- | --- |
| `cosmos-0.2.79-macos-arm64.dmg` | `47bd547467769199bb90021da64f1ea7f134e80d38a4fae261fec1145b12b67e` |
| `cosmos-0.2.79-macos-arm64-app.tar.gz` | `e0beb4546521ccc2b9b637ec436ea2049e07053de6f373369ed53f79a4ead05b` |

## Highlights

- Cosmos-branded app bundle, DMG and archive names (`Cosmos.app`, `cosmos-<version>-macos-arm64.dmg`).
- The inherited Zeron in-app updater is disabled fail-closed: no background check, no update strip, no `update` CLI action. Cosmos builds cannot resolve or download the upstream Zeron release channel.
- Computer Use: real open-source Cua driver (0.28.2) behind the Cosmos computer service, native macOS Accessibility menu dispatch, driver liveness/respawn, sheet retargeting.
- Expo companion app (iOS + Android) with sessions, live watch, remote Computer Use start/stop, pairing and harness marks.
- Linux Computer Use 2.0 X11 fast path ported from PR #6.
- Save panels accept absolute paths (Go to Folder + basename); mobile pair/new-session sheets render on iOS 27; Trust & link label readable in dark mode (PR #8).
- First-run chooser: "Use locally" (no account, LAN phone pairing) or "Log in" (Woozlit → synced workspace) — one-time card, device-local (PR #12).
- Mobile de-slop: title-only Sessions rows, neutral harness marks, empty New Session composer canvas, real desktop names everywhere (PR #12).
- WAN phone pairing (PR #13): Settings → Devices "Pair phone" shows a single-use QR + 6-char code (5-min TTL) bound to the signed-in account + deviceId; the phone scans/types it under the same Woozlit login and reaches the desktop over `edge.zeron.sh` from cellular/another city — sessions, steer/stop, Watch Live. Per-phone Revoke on the desktop. Same-network pairing stays as an advanced fallback.

## Install (macOS, Apple silicon)

Open the DMG and drag `Cosmos.app` to Applications. The bundle is signed with a local development identity, so the first launch needs right-click → Open (or `xattr -d com.apple.quarantine`).

Accessibility for Computer Use must be enabled once per Mac in System Settings → Privacy & Security → Accessibility.

Windows and Linux builds for this tag are produced by the release workflow in `PupppyLoverr/cosmos` and are not included here.
