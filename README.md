# apex-parent

The **parent** mobile app for Apex — React Native (bare CLI), iOS + Android from one
codebase. It talks to the **single shared backend** (see the root
[`README.md`](../README.md)) and imports everything UI/networking from
[`@apex/shared`](../shared/README.md). See [`CONVENTIONS.md`](../CONVENTIONS.md)
for the cross-stream contract.

## Stack
- **React Native (bare @react-native-community/cli)**, TypeScript.
- React Navigation (native-stack + bottom-tabs).
- Bilingual **EN/AR with RTL** via `@apex/shared` i18n.
- All UI built from **`AP_` components** in `@apex/shared` — no raw styled
  `View`/`Text` in screens.
- All networking through the shared **`clientProxy`** (single entry point);
  screens never call axios directly.

## Layout
```
App.tsx                 bootstrap: init i18n, init clientProxy, AuthProvider, nav
src/
  config.ts             API_BASE_URL (RN_API_URL ?? localhost:3000/api)
  api/                  typed endpoint wrappers over clientProxy + dev mocks
  navigation/           RootNavigator, AuthContext wiring, route types
  i18n/strings.ts       EN/AR dictionary for this app
  screens/              Home, Login, Register, Timeline, Approvals, Meetings,
                        Messages, Notifications, Records, Calendar, Settings
```

## Networking
One backend serves both apps. `initClientProxy({ baseURL: API_BASE_URL })` runs
at bootstrap. The shared axios interceptor injects the JWT and toggles the
global loader; `clientProxy` unwraps `{success,data}` and surfaces
`error.message`/`error.messageAr` as one global alert on failure. The app ships
with an offline **mock adapter** enabled; point `RN_API_URL` at the
live backend and disable mocks to go live — no screen changes needed.

## Run
```bash
npm install
npm run typecheck     # tsc --noEmit (also typechecks @apex/shared)
npm start             # react-native start (Metro)
npm run android       # build + install on a connected device/emulator
```
