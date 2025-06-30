import tailwindcss from "@tailwindcss/vite";
import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import flowbiteReact from "flowbite-react/plugin/vite";
import fs from "fs";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    {
      name: "generate-version",
      // Use closeBundle to make sure dist is available
      closeBundle() {
        const distDir = resolve(__dirname, "dist");
        if (!fs.existsSync(distDir)) {
          fs.mkdirSync(distDir, { recursive: true });
        }

        fs.writeFileSync(
          resolve(distDir, "version.json"),
          JSON.stringify({
            version: Date.now(),
          }),
        );
      },
    },
    react(),
    tailwindcss(),
    flowbiteReact(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
