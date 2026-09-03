import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiUrl = env.VITE_API_URL || "http://127.0.0.1:4500";

  const isTest = process.env.NODE_ENV === "test" || mode === "test";

  return {
    plugins: [react(), !isTest && tailwindcss()].filter(Boolean),
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: "./src/setupTests.js",
    },
    server: {
      proxy: {
        "/api": {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom", "react-router-dom"],
            charts: ["recharts"],
            motion: ["framer-motion"],
          },
        },
      },
    },
  };
});
