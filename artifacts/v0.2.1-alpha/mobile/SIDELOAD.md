# Sideloading Cosmos onto an iPhone

The release artifacts under `cosmos-releases/artifacts/v0.2.1-alpha/mobile/` are **unsigned**:

- `Cosmos-0.2.79-ios-unsigned.ipa` — device build (arm64, iOS 15.1+), no code signature.
- `Cosmos-0.2.79-ios-unsigned.xcarchive.zip` — the same build as an Xcode archive.
- `SHA256SUMS`

The build Mac has no Apple Developer certificate, provisioning profile, or Team ID
(verified: zero codesigning identities), so it cannot produce a signed IPA. Sign locally
with one of the two paths below.

## What you need

- An iPhone (tested target: iPhone 14) with its cable — iPhone 14 is Lightning/USB-A or
  USB-C depending on the cable — and **Trust This Computer** tapped on the phone.
- A free Apple ID. No paid Developer Program membership.
- The phone's **UDID** only for path C (a paid-account ad-hoc profile). Sideloadly and
  Xcode Personal Team register the device automatically — you never type it.
  To grab it anyway: connect the phone → Finder → select it in the sidebar → click the
  line of text under the phone's name until it shows **UDID** → right-click → Copy UDID.

The IPA's icon is the same artwork as the macOS Cosmos.app icon
(`apps/mobile/assets/icon.png` ↔ `dist/macos/icon-1024.png`).

## A. Sideloadly / AltStore (fastest, free Apple ID)

1. Install [Sideloadly](https://sideloadly.io) (macOS/Windows) or [AltStore](https://altstore.io).
2. Connect the iPhone by USB and trust the computer.
3. Drag `Cosmos-0.2.79-ios-unsigned.ipa` into Sideloadly, enter your Apple ID, click **Start**.
   Sideloadly re-signs the IPA with a free personal certificate and installs it.
4. On the phone: Settings → General → VPN & Device Management → trust the developer
   certificate for your Apple ID.

Free-account signatures expire after 7 days; re-run the sideload (or let AltStore refresh).
Push notifications are unavailable with a free account.

## B. Xcode Personal Team (build from source)

Requires Xcode 26+ and a free Apple ID added under Xcode → Settings → Accounts.

```sh
cd apps/mobile
npm ci
npx expo prebuild --platform ios
open ios/Cosmos.xcworkspace
```

In Xcode: select the `Cosmos` target → Signing & Capabilities → check
**Automatically manage signing**, pick your Personal Team, and change the bundle identifier
to something unique (e.g. `com.<yourname>.cosmos`; free teams cannot use `sh.zeron.mobile`).
Remove the *Push Notifications* capability if Xcode flags it. Select the iPhone as the
destination and press Run.

Or from the shell, replacing `TEAMID`:

```sh
xcodebuild -workspace ios/Cosmos.xcworkspace -scheme Cosmos -configuration Release \
  -destination 'generic/platform=iOS' -archivePath build/Cosmos.xcarchive \
  -allowProvisioningUpdates DEVELOPMENT_TEAM=TEAMID \
  PRODUCT_BUNDLE_IDENTIFIER=com.yourname.cosmos archive
xcodebuild -exportArchive -archivePath build/Cosmos.xcarchive \
  -exportOptionsPlist ios/ExportOptions-development.plist -exportPath build/ipa
```

## C. Signed IPA via a paid Apple account (CI / ad hoc)

Provide, via secrets (never committed):

- Apple Developer **Team ID**
- an *Apple Development* or *Apple Distribution* certificate (`.p12` + password)
- an Ad Hoc provisioning profile for `sh.zeron.mobile` that includes the target
  iPhone's **UDID** (Finder → select the phone → click the model line to reveal UDID)
