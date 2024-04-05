# test-firebase-saml

A barebones app to test Firebase's SAML auth.

1. `npm ci`
2. Setup a Firebase project with a SAML provider
3. Update `SAML_PROVIDER_ID` and `FIREBASE_CONFIG` in `src/App.tsx`
4. Update `FIREBASE_PROJECT_URL` in `vite.config.ts`
5. `npm run dev`

The app will be available at https://localhost:5173
