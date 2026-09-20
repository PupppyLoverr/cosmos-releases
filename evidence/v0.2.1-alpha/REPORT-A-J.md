# Cosmos v0.2.1-alpha — A–J report

## A. Exact Cosmos commit running
- `PupppyLoverr/cosmos` `origin/main` = `227b3de70b411f78c14868fa8a59e70c1a26feb0` (merge of PR #8 on top of `c62c5b4d`).
- Tag `v0.2.1-alpha` moved to `227b3de7` and pushed (source repo) — https://github.com/PupppyLoverr/cosmos/releases/tag/v0.2.1-alpha
- Running process: `/Users/devin/repos/cosmos/target/package/Cosmos.app/Contents/MacOS/zeron` (PID 73494), engine on `127.0.0.1:27654`, built from `227b3de7` after the merge.

## B. App bundle / version
- `Cosmos.app`, `CFBundleName=Cosmos`, `CFBundleShortVersionString=0.2.79`, signed with the stable local identity `Cosmos Local Signing` (bundle id `sh.zeron.app` kept so the existing Accessibility grant still matches).

## C. Updater
- Fail-closed: `zeron_update::updates_enabled()` returns `false`; UI update strip and `update` CLI action gated on it.
- `scripts/audit-updater.sh` on `227b3de7`:
  ```
  ok: crates/ui/src/shell.rs gates on zeron_update::updates_enabled()
  ok: apps/zeron/src/update_cli.rs gates on zeron_update::ensure_updates_enabled()
  PASS: no user-facing updater path can reach zeron.sh or zeronsh/zeron
  ```
- `strings Cosmos.app/Contents/MacOS/zeron | grep -c 'zeron\.sh/releases\|github.com/zeronsh/zeron/releases'` → `0`.
- Full output: `evidence/v0.2.1-alpha/updater-audit.txt`.

## D. Repository / PR status
- PR #8 merged (merge commit, no force-push): https://github.com/PupppyLoverr/cosmos/pull/8
  - save-panel absolute paths via Go to Folder + basename (`crates/computer/src/cua.rs`, tests in `crates/computer/src/tests.rs`)
  - mobile: expo lint config + react-hooks fixes; `pair` / `new-session` presented as `modal` (formSheet rendered blank on iOS 27 in Expo Go); `Trust & link` label uses `accentContrast` (was white-on-white in dark mode).
- PRs #5, #7 merged earlier; PR #6 closed with disposition (see H).
- CI on #8: same 6-job failure set (`tests`, `ui-tests`, `ios-tests`, `linux-browser`, `macos-frame-recovery`, `session-sync-regressions`) as merged #2/#5/#7; hosted logs return `BlobNotFound` so the cause could not be read. Local: `cargo fmt --check`, `cargo check --workspace`, `cargo test -p zeron-computer` (50 pass), `git diff --check`, mobile `tsc --noEmit`, `expo lint` all green.

## E. Computer Use MCP path proven
Devin CLI (`swe-2-high`) → Cosmos MCP (`cosmos-computer`) → Cosmos computer service → Cua MCP client → `cua-driver serve` 0.28.2 → native macOS AX/GUI.
- Fresh session, `status=completed`, **54 Cosmos MCP calls**, no shell/AppleScript/direct-Cua bypass (journal + `mcp-calls.jsonl`).
- Target file `/Users/devin/artifacts_raw/sheetfallback.txt` written through TextEdit's native Save sheet; independent verification: 57 bytes, sha256 `46f49ebb0ab2cba4b40cfc50126fa45dd78280411cced938a4fc49e52ca22b1b`.
- Evidence: `evidence/v0.2.1-alpha/cu-devin-sheetfallback/` (`journal.jsonl`, `mcp-calls.jsonl`, `run-output.txt`, `file-verification.txt`, `final-desktop.png`, `prompt.txt`).

## F. Mobile E2E (iOS Simulator, recorded)
Flow on the new build: signed-in state (`Aarav A / secretintelof2100@gmail.com`) → pair This Mac (`127.0.0.1:27654`, Online, v0.2.79, Computer Use ready) → Sessions → New Session (Devin / swe-2-high) → real prompt → streamed `PONG` → Watch Live (real frames) → Stop (session idle). No crash / red toast.
- Recording: `evidence/v0.2.1-alpha/mobile-e2e/recording.mp4`
- Screenshots `01`–`13` in the same folder; `02-FAIL-pair-formsheet-blank.png` is the pre-fix regression capture.
- Sign-in was not re-run: the account was already persisted from the earlier sign-in; Google 2FA on a fresh sign-in requires the account owner.

## G. Sessions icons
- Before: letter avatars (fixed earlier in the overnight pass). After: harness SVG marks (Devin, OpenCode, …) in dark and light — `05-sessions-harness-icons-dark.png`, `07-sessions-harness-icons-light.png`.

## H. PR #6 disposition
- https://github.com/PupppyLoverr/cosmos/pull/6 — closed without merge. Kept: Linux Computer Use 2.0 (X11 fast path) ported to `main`; Android folded into the existing Expo app; second Kotlin Android client dropped.
- Comments: https://github.com/PupppyLoverr/cosmos/pull/6#issuecomment-5741902501 and https://github.com/PupppyLoverr/cosmos/pull/6#issuecomment-5747159115

## I. DMG / artifacts (cosmos-releases `main` @ `ee80644`, tag `v0.2.1-alpha` → `91ad7e7`)
- https://github.com/PupppyLoverr/cosmos-releases/tree/main/artifacts/v0.2.1-alpha
- `cosmos-0.2.79-macos-arm64.dmg` — sha256 `ff9ac0bda2a2c6ea55dfdb6c34a55a66f99d5c7e36a7ba6161d79432d44dee38`
- `cosmos-0.2.79-macos-arm64-app.tar.gz` — sha256 `c2efa11a4721736604f34c5252adf7658950b2dc8abae408a04a67898cbe134a`
- `SHA256SUMS`, `RELEASE_NOTES.md` (release body, updated to `227b3de7`).
- Local build path: `/Users/devin/repos/cosmos/target/package/`.

## J. Known limitations (honest)
- Hosted CI logs for the 6 failing jobs are unreadable (`BlobNotFound`); match to #2/#5/#7 is by job set only.
- Accessibility for a freshly installed `Cosmos.app` must be enabled once per Mac in System Settings → Privacy & Security → Accessibility (cloud Devin VMs cannot complete that sheet without Cognition's login password; on this VM the grant was re-recorded against the stable signing identity).
- Bundle is signed with a local identity, not notarized → right-click → Open on first launch.
- Mobile: remote (Woozlit relay) path shows "No other devices online" — E2E covered the local-network pairing path only; fresh Google sign-in requires the owner's 2FA. `formSheet` presentation replaced by `modal` (formSheet rendered blank under Expo Go / iOS 27). Pairing probe string sometimes omits the version even though Desktops shows `v0.2.79`; Sessions header can briefly keep the old desktop label after unlinking.
- Windows/Linux builds for this tag are not included in cosmos-releases.
- Cloud execution remains roadmap-only; nothing added.

## Create release
https://github.com/PupppyLoverr/cosmos-releases/releases/new?tag=v0.2.1-alpha&title=Cosmos+v0.2.1+Alpha&prerelease=1
Attach `cosmos-0.2.79-macos-arm64.dmg` (+ tarball, SHA256SUMS) from `artifacts/v0.2.1-alpha/`; paste `RELEASE_NOTES.md` as the body.
