# HM Intel — Isolation Distance Tool (mobile)

A single-codebase React Native (Expo) prototype for the HM Intel developer trial with Commercial Transport Solutions. One codebase runs on **both iOS and Android**. Built by Kalyan.

A first responder places an incident on a Google Map, selects a dangerous good, and the app draws the isolation zone around the incident with a dangerous-goods information panel.

## Scope (as confirmed with Chris on June 1)
This is a deliberately simple trial prototype, not a production feature:
- Device GPS location, shown on a Google Map
- Tap to set the incident location, or use current location
- Select a dangerous good from sample data
- A single circular isolation zone around the incident
- Information panel: UN number, name, hazard class, ERG guide, isolation/protective distance, emergency contact
- Controls: Use current location · Set incident · Show/Hide zone · Metres/Kilometres · Reset
- Graceful handling when GPS is denied or unavailable (you can still tap to set the incident)

Out of scope for the trial (future): downwind protective-action zones, wind direction, day/night and spill-size calculations, real ERG/TDG data. **The sample distances here are placeholders only.**

## Stack
- Expo SDK 51, React Native 0.74, TypeScript
- `react-native-maps` (Google provider), `expo-location`

## Structure
```
App.tsx                     entry (SafeArea + screen)
app.json                    Expo config (iOS + Android)
src/
  theme.ts                  HM Intel design tokens
  types.ts                  shared types
  data/dangerousGoods.ts    sample DG data (placeholders)
  hooks/useLocation.ts      expo-location with friendly error handling
  components/
    AppHeader.tsx
    ProductSelector.tsx     searchable bottom-sheet picker
    InfoPanel.tsx           DG information panel
    MapControls.tsx         the four controls + units toggle
  screens/IsolationToolScreen.tsx   map, markers, isolation circle, wiring
```

## Run
```bash
npm install
npx expo start          # press i for iOS, a for Android, or scan with Expo Go
```

### Google Maps key (Android)
Android needs a Google Maps API key. In `app.json` replace
`android.config.googleMaps.apiKey` ("REPLACE_WITH_ANDROID_GOOGLE_MAPS_API_KEY") with a key.
iOS renders via the Google provider as well; for a no-key local demo you can switch the
`provider` prop in `IsolationToolScreen.tsx` to the platform default.

## Notes
This prototype is meant to show development approach, structure, UI/UX thinking and clear
documentation rather than production readiness, per the trial brief.
