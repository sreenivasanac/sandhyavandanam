# Mobile app and store listing

The mobile apps are the same code as the website (`app/`), wrapped with [Capacitor](https://capacitorjs.com). All text, pictures and chant clips are inside the app, so it works offline. iOS is set up; Android uses the same config and code (see the end).

## Build (iOS)

```bash
cd app
pnpm ios                     # web build without the service worker, copied into ios/
open ios/App/App.xcodeproj   # run on a simulator or phone
```

Upload to TestFlight from the command line (team 4D2A8N9MM7; the archive is unsigned because the team has no registered devices, and the export step signs it for distribution):

```bash
cd app/ios/App
xcodebuild -project App.xcodeproj -scheme App -configuration Release -destination 'generic/platform=iOS' -archivePath ../build/Sandhya.xcarchive CODE_SIGNING_ALLOWED=NO archive
cd .. && xcodebuild -exportArchive -archivePath build/Sandhya.xcarchive -exportOptionsPlist ExportOptions.plist -exportPath build/upload -allowProvisioningUpdates
```

- Bundle ID `com.pragnyalabs.sandhya`, iPhone only, portrait, iOS 15 or later. All of this is in `app/capacitor.config.ts` and the Xcode project.
- Before each upload raise `CURRENT_PROJECT_VERSION` (build number); raise `MARKETING_VERSION` for a new release.
- Icon source: `docs/store/icon.svg` (1024 px render in `ios/App/App/Assets.xcassets/AppIcon.appiconset`).
- Native-only behaviour is behind `NATIVE` in `app/src/lib/reminders.ts`: reminders (local notifications), no analytics, no settings export/import by file.

## App Store Connect: what to enter

| Field | Value |
|---|---|
| Name (30) | Sandhyavandanam Guide (plain "Sandhyavandanam" is taken on the App Store) |
| Subtitle (30) | Guided daily sandhyā ritual |
| Primary category | Lifestyle |
| Secondary category | Reference |
| Price | Free |
| Age rating | 4+ (answer "None" to every content question) |
| Privacy policy URL | https://sandhya.pragnyalabs.com/privacy |
| Support URL | https://sandhya.pragnyalabs.com/support |
| Marketing URL | https://sandhya.pragnyalabs.com |
| Copyright | 2026, followed by your name as on the Apple account |
| Export compliance | No non-exempt encryption (already set in Info.plist) |
| Sign-in required | No |

**Keywords (100):**
`sandhya,sandhyavandanam,gayatri,japa,mantra,yajur,veda,smarta,vaishnava,sanskrit,ritual,upanayanam`

**Promotional text (170):**
Every step of the morning, noon and evening sandhyā, with the mantra in your script, its meaning, pictures of each posture and a chant button. Free, no account, offline.

**Description:**

Sandhyavandanam takes you through the daily sandhyā one step at a time, as a teacher would: what to do, what to say, and what it means.

It follows Kṛṣṇa Yajur Veda (Āpastamba) in two traditions, Smārta and Śrī Vaiṣṇava, for all three times of day: prātaḥ (morning), mādhyāhnika (noon) and sāyaṃ (evening).

WHAT YOU GET
• One step per screen, with numbered instructions and the purpose of the step
• Pictures of the postures and hand positions, drawn for each tradition
• Every mantra in the script you read: Devanāgarī, Tamil, Kannada, Telugu, Malayalam or Roman (IAST)
• Roman transliteration and the English meaning under each line
• A chant button on almost every mantra, and a link to a recorded chant for every step
• Your own name, gotra and pravara filled into the abhivādanam
• A Gāyatrī japa counter: the full count for each time of day, or 28 or 10
• Which way to face at each step
• Today's tithi, nakṣatra and month worked out for your place, and an optional detailed saṅkalpam
• Daily reminders for each sandhyā, at times you choose
• The screen stays on while you perform
• Parts that only some families do stay hidden until you switch them on
• Larger text, and light and dark themes

PRIVATE AND OFFLINE
No account, no advertising, no data collected. Everything you enter stays on your phone, and the app works without a network connection.

PLEASE NOTE
The chant buttons use a synthesised voice (Vāgdhenu, from the Vāgbodhinī project of Prof. Prathosh A P, Indian Institute of Science). It says each syllable clearly, but Vedic mantras are in a flat tone without svaras, so use it as a help with pronunciation and learn the chant from a teacher. The text is compiled from printed procedure books and is still being reviewed; where your teacher or family practice differs, follow them.

**What's new (first version):** First release.

## App privacy answers

- "Do you or your third-party partners collect data from this app?" → **No**. The label reads "Data Not Collected".
- The app uses location (optional, on the device only, never sent) and local notifications. Neither counts as collection because nothing leaves the phone.
- No tracking, no advertising identifier, no third-party SDK other than Capacitor.

## Notes for App Review

> The app is a complete offline guide to a daily Hindu ritual; all content is in the app bundle. No account is needed. To see the whole flow: choose a tradition and script on first launch, then tap "Begin" on the home screen and move through the steps with the arrows. Reminders are local notifications set in Settings > Reminders. Location is optional (Settings > Place) and is used on the device only, for sunrise and sunset times.

## Screenshots

Captured at 1320 × 2868 (`docs/store/screenshots/`). The App Store Connect slot used ("iPhone with Dynamic Island, medium display") takes 1206 × 2622, so the uploaded copies are the resized ones in `docs/store/screenshots/6.3in/`.

## State of the listing (25 November 2026)

App record "Sandhyavandanam Guide", Apple ID 6839481751, team 4D2A8N9MM7. Entered: subtitle, categories, description, keywords, promotional text, URLs, copyright, review notes, six screenshots, build 1.0.0 (1), age rating 4+, price free, availability United States and India only, privacy answer "Data Not Collected" (saved, not published), manual release. Still to do by the account holder: Content Rights answer, App Review contact name/phone/email, Publish on the App Privacy page, then Add for Review.

## Android, later

Nothing in the code is iOS-only. To add it:

```bash
cd app
pnpm add @capacitor/android
pnpm cap add android
pnpm ios && pnpm cap sync android   # or add an "android" script like "ios"
```

Then set the icon, add the `POST_NOTIFICATIONS` and `SCHEDULE_EXACT_ALARM` permissions if exact reminder times are wanted, and create the Play listing from the text above (short description 80 characters: "Step-by-step sandhyā guide: mantras in your script, meanings, pictures, chant."). Google Play needs a developer account ($25 once).
