# Cosmos v0.2.1-alpha (macOS)

Source: https://github.com/PupppyLoverr/cosmos @ 1b3cb8ec (main; includes PRs #8–#14 — the mobile IPA carries the PR #14 auth fix; the macOS artifacts are unchanged from the 1f3b8c02 build). Rebuilt 2026-09-20; supersedes the earlier builds at 7bca97cc, f7836d9e, 4964024f and 227b3de7. The mobile IPA was repacked on 2026-09-20 (Payload/ layout fix — the earlier zip lacked the Payload wrapper and Sideloadly refused it; hash changed, code unchanged). Rebuilt again 2026-09-20 from main @ e858d67f (PRs #14+#15): PR #14 fixes real-device pairing 'signed out' — the Woozlit session now persists its access token so relay dials, account device listing and QR/code pairing all authenticate. PR #15 bounds every edge fetch (15s) and fails fast with a real message when the desktop isn't checked into the relay, instead of an indefinite spinner. Desktop 'Show code' is now gated on sign-in.

## Assets

| File | SHA-256 |
| --- | --- |
| `cosmos-0.2.79-macos-arm64.dmg` | `64167e84b0248a1d4bbd6643715470c02ec2504367c74b785dd5d81bb4291725` |
| `cosmos-0.2.79-macos-arm64-app.tar.gz` | `0634692174f6fd3b7ee5e3814b32b9d8059b3f5917b05eb29f9ae1f681d817f2` |
| `mobile/Cosmos-0.2.79-ios-unsigned.ipa` | `ecd56c56d2c47e92a5e60328464fe47d8b63df8f0dd34d150340c596194d5fe7` |

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
- WAN phone pairing (PR #13): Settings → Devices "Pair phone" shows a single-use QR + 6-char code (5-min TTL) bound to the signed-in account + deviceId; the phone scans/types it under the same Woozlit login and reaches the desktop over `edge.zeron.sh` from cellular/another city — sessions, steer/stop, Watch Live. Per-phone Revoke on the desktop. Same-network pairing stays as an advanced fallback.
- Mobile visual redesign (PR #13): the iOS app now renders the desktop's actual Solar Linear icon set — 127 SVG assets shared verbatim from `crates/ui/assets/icons/` via a generated `solar-icons.ts` (Solar Icons CC BY 4.0), plus 20 new glyphs drawn in that style and embedded in the desktop too. Neutral ink-on-fill icon tiles (no candy tints), hairline-border composer plate, pixel-asterisk Cosmos mark, "desktop"/"This Desktop" copy (Windows/macOS/Linux neutral).

## Install (macOS, Apple silicon)

Open the DMG and drag `Cosmos.app` to Applications. The bundle is signed with a local development identity, so the first launch needs right-click → Open (or `xattr -d com.apple.quarantine`).

Accessibility for Computer Use must be enabled once per Mac in System Settings → Privacy & Security → Accessibility.

Windows and Linux builds for this tag are produced by the release workflow in `PupppyLoverr/cosmos` and are not included here.
