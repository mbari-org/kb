import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // "/config/endpoints": {
      //   target: "http://localhost:8400",
      //   changeOrigin: true,
      //   rewrite: path =>
      //     path.replace(/^\/config\/endpoints/, "/config/endpoints"),
      // },
      "/v1/auth/login": {
        target: "http://localhost:8083",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/v1\/auth\/login/, "/v1/auth/login"),
      },
      "/v1/names": {
        target: "http://localhost:8083",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/v1\/names/, "/v1/names"),
      },
    },
    cors: true,
  },
})
