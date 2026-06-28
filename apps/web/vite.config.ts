import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  // Base de despliegue. En GitHub Pages el workflow pone VITE_BASE=/<repo>/.
  // En local/dev y en Vercel queda en "/".
  base: process.env.VITE_BASE || "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    // Una sola copia de three (react-globe.gl + three-globe + three).
    dedupe: ["three"],
  },
  server: { port: 5173 },
});
