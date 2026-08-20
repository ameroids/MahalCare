import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite config kept intentionally minimal so this project can later be
// extended with an API proxy (for the future backend / auth / reports
// features) without restructuring the build.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  }
});
