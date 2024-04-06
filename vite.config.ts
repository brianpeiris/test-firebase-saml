import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from '@vitejs/plugin-basic-ssl'

const FIREBASE_PROJECT_URL = "https://testsaml-7d26f.firebaseapp.com";

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
