# Cosmos mobile (Expo Go, iPhone 17 sim) E2E test plan

Target: apps/mobile @ a4c2b3d5, Metro running (`npx expo start --ios`), Expo Go on sim 8E780854.
Backend: Cosmos.app engine 127.0.0.1:27654 (PID 40299). Do not restart Cosmos.app.

Code evidence:
- Pairing: src/app/pair.tsx L92-139 (host:port field, Check connection → "Cosmos desktop found · vX", Trust & link enabled only after probe ok).
- Desktops tab: src/app/(tabs)/(desktops)/index.tsx L14-35 (long-press row → Rename/Unlink), L104-118 ("This desktop" group, Computer Use row).
- Sessions list: src/app/(tabs)/(sessions)/index.tsx L180 renders `<HarnessMark harness={chat.config?.harness}>`; harness-mark.tsx L140-166 renders SVG logo paths (devin/claude-code/opencode/…) inside tinted rounded square; NeutralMark ring for unknown.
- New session: src/app/new-session.tsx L43-52 lists models via listModels(harness); L91-96 pickList uses Alert; L161 "Start session" button.
- Session screen: src/app/session/[id].tsx L158-166 header "Watch live" display icon when cuActive || computer; Composer send.
- Watch Live: src/app/watch/[chatId].tsx L88 status line "<status> · frame Ns ago · <control>", L92-95 LIVE/IDLE chip, L119 Stop session button (disabled unless running), L62 Alert "Stop this session?".
- Settings: src/app/(tabs)/(settings)/index.tsx L27-52 Account group (Avatar+name+email or "Sign in with Woozlit"), L72-85 Appearance Segmented System/Light/Dark.

## T1 Sign-in state
- Tap Settings tab. PASS: Account group shows a signed-in row (name + email). If "Sign in with Woozlit" is shown instead, tap it → "Sign in with Woozlit" → document exact Google blocker; do not guess credentials.

## T2 Pair this Mac via LOCAL NETWORK
- Desktops tab → long-press existing "217b21a0 · 127.0.0.1:27654" row → Unlink → confirm. PASS: row disappears; Online indicator gone / Sessions tab shows "Link a desktop".
- Tap "Link a desktop on this network". Enter host `127.0.0.1:27654`, name `This Mac`. Tap "Check connection". PASS: green "Cosmos desktop found · v0.2.79" (FAIL: red "No Cosmos engine…").
- Tap "Trust & link". PASS: returns to Desktops; "This Mac · Local · 127.0.0.1:27654 · v0.2.79" with green "Online"; "This desktop" group shows "Apple Virtual Machine 1", "Computer Use Available — ready".

## T3 Sessions list harness icons
- Sessions tab. PASS: every row's 40pt leading avatar shows a logo mark SVG (Devin hexagon-ish mark / OpenCode squares / Claude asterisk) — NOT a letter. Zoom screenshot for evidence. Repeat in Light mode (Settings → Appearance → Light), then return to Dark.

## T4 New session + real reply
- Sessions → "+" → Harness → pick `devin`; Model → pick `swe-2-high` (PASS: Model alert lists ≥1 model; FAIL if the list is empty/only Cancel). Space: "Desktop (no project)". Prompt: "Reply with the single word PONG and nothing else." → "Start session".
- PASS: session screen opens, user bubble shown, status Working, then an assistant entry containing "PONG" appears within ~90s and the composer returns to idle (no spinner stuck). FAIL: red alert / spinner forever / no assistant entry.

## T5 Watch Live + Stop
- Send a second message that engages the computer: "Use the computer tool to take a screenshot, then wait 60 seconds doing nothing, then reply DONE." While Working, tap the header "display" (Watch live) icon.
- PASS: Watch Live screen shows LIVE chip, status line "working · frame Ns ago · …" with N resetting (changing) on ~2.5s cadence (take two screenshots ≥3s apart; FAIL if the age label is frozen), and a screenshot frame image (not a spinner/error).
- Tap "Stop session" → alert "Stop this session?" → Stop. PASS: within a few seconds chip flips to IDLE, status line shows idle/errored (not working), Stop button dimmed (opacity 0.4). Tap Done → session screen composer no longer in running state.

## T6 Dark-mode account/Settings
- Settings tab in Dark mode: PASS: Account row (avatar + name/email), Connection "This Mac · Local · connected · Direct", Appearance segmented with Dark selected, all legible (no black-on-black text).

Report any crash / red toast / blank Models list / stuck spinner / frozen frame-age label.
