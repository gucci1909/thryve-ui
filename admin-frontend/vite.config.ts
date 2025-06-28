import tailwindcss from "@tailwindcss/vite";
import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import flowbiteReact from "flowbite-react/plugin/vite";
import { VitePWA } from "vite-plugin-pwa";
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    {
      name: "generate-version",
      buildEnd() {
        fs.writeFileSync(
          "dist/version.json",
          JSON.stringify({
            version: Date.now(),
          }),
        );
      },
    },
    react(),
    tailwindcss(),
    flowbiteReact(),

    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "My Flowbite React App",
        short_name: "FlowbiteApp",
        description: "A Flowbite React PWA",
        theme_color: "#0029FF",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
