import tailwindcss from "@tailwindcss/vite";
import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import flowbiteReact from "flowbite-react/plugin/vite";
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
    flowbiteReact()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
