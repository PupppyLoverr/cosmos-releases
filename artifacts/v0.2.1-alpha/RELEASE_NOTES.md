# Cosmos v0.2.1-alpha (macOS)

Source: https://github.com/PupppyLoverr/cosmos @ bf358de5 (main; includes PRs #8–#16 plus the edge migration — both apps now default to the Cosmos-owned relay `cosmos-edge.cosmos-edge.workers.dev`, which runs Woozlit auth: `/health` → `{"ok":true,"auth":"woozlit"}`. Upstream `edge.zeron.sh` still runs the WorkOS-only build and 401s every Woozlit token — pairing could never complete against it). Rebuilt 2026-09-21; supersedes all earlier builds (7bca97cc through 1b3cb8ec — none of them reach a working edge). The mobile IPA was repacked on 2026-09-20 (Payload/ layout fix — the earlier zip lacked the Payload wrapper and Sideloadly refused it; hash changed, code unchanged). Rebuilt again 2026-09-20 from main @ e858d67f (PRs #14+#15): PR #14 fixes real-device pairing 'signed out' — the Woozlit session now persists its access token so relay dials, account device listing and QR/code pairing all authenticate. PR #15 bounds every edge fetch (15s) and fails fast with a real message when the desktop isn't checked into the relay, instead of an indefinite spinner. Desktop 'Show code' is now gated on sign-in.

## Assets

| File | SHA-256 |
| --- | --- |
| `cosmos-0.2.79-macos-arm64.dmg` | `0417591ac7378b418cd65b5cd5d5f7169bc0f0fb443bb556c640f8402b88242b` |
| `cosmos-0.2.79-macos-arm64-app.tar.gz` | `0634692174f6fd3b7ee5e3814b32b9d8059b3f5917b05eb29f9ae1f681d817f2` |
| `mobile/Cosmos-0.2.79-ios-unsigned.ipa` | `3175ac847710f95827c05a5cee283b85ccc7a226b20514e4f84a51cb4840f0f5` |

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
- IPA rebuilt @ `bf358de5` with the sign-in token fix: the Woozlit callback's *custom* token is a JWT and was wrongly stored as the relay bearer (the desktop engine always exchanges it; the phone now does too) — that mismatch is what produced the "relay rejected this sign-in" 401 on-device. **Required once on the phone: Settings → Sign Out → sign back in** so the session stores the real Firebase id token + refresh token.

## Install (macOS, Apple silicon)

Open the DMG and drag `Cosmos.app` to Applications. The bundle is signed with a local development identity, so the first launch needs right-click → Open (or `xattr -d com.apple.quarantine`).

Accessibility for Computer Use must be enabled once per Mac in System Settings → Privacy & Security → Accessibility.

Windows and Linux builds for this tag are produced by the release workflow in `PupppyLoverr/cosmos` and are not included here.
