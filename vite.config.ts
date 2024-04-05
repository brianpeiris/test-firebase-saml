import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from '@vitejs/plugin-basic-ssl'

const FIREBASE_PROJECT_URL = "https://test-saml-9038e.firebaseapp.com";

export default defineConfig({
  plugins: [basicSsl(), react()],
  server: {
    proxy: {
      "/__/auth": {
        target: FIREBASE_PROJECT_URL,
        secure: false,
        changeOrigin: false,
      },
    },
  },
});
