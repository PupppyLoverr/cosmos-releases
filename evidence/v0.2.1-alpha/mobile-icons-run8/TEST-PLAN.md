# Test plan — Cosmos mobile Solar-icon/visual-redesign verification (run8)

Build under test: `sh.zeron.mobile` 0.2.79 **Release build** on iPhone 17 sim `8E780854-5816-4435-AD8F-8098DF847EB5` (iOS 27.0), installed 19:23 — jsbundle verified to contain the new code (`SOLAR_ICONS`, `zeron-logo`, "This Desktop", "Trust & Link", "Same network").
Delta = uncommitted working-tree changes on `devin/1789949808-wan-pairing` (9 modified app files + `src/lib/solar-icons.ts` + 15 SVGs in `crates/ui/assets/icons/`).

Engine: `target/package/Cosmos.app` (pid 28475) at `ws://127.0.0.1:27654`, device `31543e43-…`; seeded chats persist: `claude-code`/`codex`/`opencode` idle + `mock` "Describe what you see" idle + "Say hi back" errored.

## Delta under test (from diff)
1. `Icon` (bits.tsx:23) → `SOLAR_ICONS[solarFor(name) ?? name]` → `SvgXml` tinted currentColor. Unmapped → SF Symbol fallback (visibly distinct: SF glyphs are filled/thicker; Solar = 1.5px hairline strokes).
2. `IconTile`/`EmptyState`/sign-in perk tiles: ink glyph on flat `t.fill` — `iconTint` removed from all non-destructive rows (wifi, globe, bell #FF3B30, photo.on.rectangle tints deleted).
3. Composer `Glass radius 26→radii.xl (14)`, border `t.glassStroke→t.separator` — rounded-rect plate w/ hairline.
4. `NeutralMark` → `zeron-logo` pixel-asterisk SVG (HarnessMark fallback for mock/unset harness; sign-in hero at 64px).
5. Tab bar Sessions → `bubble.left.and.bubble.right` (native SF — NativeTabs requires SF; expected).
6. Copy sweep "Mac"/"MacBook"→"desktop"/"This Desktop" (src/ grep: zero leftovers).

## Environment facts (verified)
- CU: enabled + driver installed + Screen Recording granted, Accessibility denied → `computer` truthy → Watch Live affordances render; frames blocked (`permissions_pending`) — error text on stage is EXPECTED.
- No `ZERON_MOCK_*` env on engine pid 28475 → no session can be parked at awaitingInput; "Stop if running" is conditional — a real-harness run errors within ~1–3s; I'll attempt to catch the working banner once, else mark untested.
- App state: unsigned/unpaired fresh install.

## Assertions (in order)

1. **Pair sheet (unsigned)**: Desktops → "Link a desktop on this network". Sheet shows: "Sign in to Woozlit" row (neutral user-circle tile), QR scan section (camera area / "Scan the desktop QR" + code field + Pair button), "Same network (advanced)" → host Field + Name Field ("Uses the computer's name"). Every content icon = thin Solar line style; no filled-SF glyph, no blank glyph, no tinted tiles.
2. **Sign-in sheet** (tap the Woozlit row): 64px `zeron-logo` pixel-asterisk (scattered rounded-square pattern — NOT the old circle+dot), "Welcome to Cosmos", copy says "reach your desktops" (no "Macs"), 3 perk rows with NEUTRAL tiles (monitor, shield, monitor Solar glyphs), "Continue with Woozlit" (user-circle icon), "Not Now" ghost. Then leave via Not Now → back to pair.
3. **Local pair**: scroll to "Same network (advanced)", host `127.0.0.1:27654`, name empty → "Check Connection" → green "Cosmos found at 127.0.0.1" → "Trust & Link" (Solar link icon on the button) → returns to Desktops. (Possible camera-permission prompt on pair sheet — deny/ignore if it appears.)
4. **Desktops hero**: hero card shows resolved name "Apple Virtual Machine 1" + Online · Cosmos 0.2.79 + facts row; paired-row/desktop icons Solar+neutral; NO leftover "Mac" copy anywhere on screen.
5. **Sessions list**: desktop pill header resolved name; rows = neutral-cornered HarnessMark tiles (claude-code asterisk, codex ring, opencode squares, **mock row = zeron-logo pixel-asterisk**) + title + status dot + rel time; "+ New session" row (plus glyph) + search field (magnifer) Solar; no letter avatars/pills/gear.
6. **Session transcript + composer**: open "Say hi back" — header icons (back chevron, monitor watch-live, ellipsis) Solar line; transcript shows user bubble + error banner (danger-triangle icon); composer = hairline-bordered rounded-rect plate (radius ~14 — visibly NOT a pill); attach + send buttons Solar glyphs. Type "Check the icons" → send → lands in transcript. (Turn errors — no CLI on host — expected.)
   - **Conditional**: if any session enters `working` (I'll queue a real-harness run via IPC first), the banner shows Watch(monitor)+Stop buttons; press Stop → interrupt. If the window can't be caught → untested.
7. **New Session**: "+ New session" → empty canvas; chip = HarnessMark + summary + alt-arrow-up chevron; setup sheet: agent rows w/ marks, Model/Project rows, Effort + Permissions segmented controls with Solar icons (eye/folder/shield); Done dismisses.
8. **Watch Live presence**: session action menu (ellipsis icon) → "Watch Live" item exists (CU enabled → `computer` truthy). Open it: sheet shows LIVE pill, monitor stage icon, Pause pill (Solar pause), controls card, Stop button; stage shows `permissions_pending` error text (AX-denied — documented). 
9. **Settings + Appearance**: Settings → desktop row (laptop Solar, neutral), Session Alerts bell = NEUTRAL tile (previously red #FF3B30 — must NOT be red), Appearance rows Theme/Material/Backdrop each w/ Solar icon + value + chevron; open Appearance → wallpaper row 'photo' neutral + preview card reads "Working · Studio Desktop".
10. **Copy sweep spot-check**: across all screens visited — zero visible "Mac"/"MacBook" strings; "This Desktop" wording where placeholder names apply.
11. **Evidence**: simctl full-res screenshots per screen + annotated recording.

**Global FAIL conditions**: any content icon rendering as a filled SF-Symbol-style glyph or blank/missing square; any non-destructive IconTile with colored (link/success/red) tint; composer drawn as a borderless/pill glass bubble; NeutralMark rendering the old circle+dot instead of the pixel-asterisk; any visible "Mac" copy.
