import react from "@vitejs/plugin-react"
import path from "path"
import { fileURLToPath } from "url"
import { defineConfig } from "vite"

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://your-proxy-server.com",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ""),
      },
    },
  },
})
