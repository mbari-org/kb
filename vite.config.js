import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig, loadEnv } from 'vite'
import { versionPlugin } from './vite-plugins/version-plugin.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, dirname, '')
  const localBackendTarget =
    globalThis.process?.env?.VITE_LOCAL_BACKEND_URL || env.VITE_LOCAL_BACKEND_URL || 'https://localhost'

  // Always proxy local quickstart HTTPS services in dev. secure:false skips the
  // self-signed cert that browsers reject when calling https://localhost directly.
  //
  // IMPORTANT: do not use bare '/kb' — Vite path matching is prefix-based, so
  // '/kb' also matches the app base path '/kbeditor' and hijacks the SPA.
  const localBackendProxy = {
    target: localBackendTarget,
    changeOrigin: true,
    secure: false,
    bypass: req => (req.url?.startsWith('/kbeditor') ? req.url : undefined),
  }

  return {
    plugins: [react(), versionPlugin()],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './test/setup.js',
    },
    build: {
      sourcemap: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(dirname, './src'),
      },
    },
    server: {
      allowedHosts: ['kb.localtest.me', '.localtest.me'],
      host: '0.0.0.0',
      strictPort: true,
      port: 5173,
      proxy: {
        '/config': localBackendProxy,
        '/anno': localBackendProxy,
        '/kb/v1': localBackendProxy,
        '/vam': localBackendProxy,
        '/references': localBackendProxy,
        '/panoptes': localBackendProxy,
        '/capture': localBackendProxy,
        '/skimmer': localBackendProxy,
        '/framegrabs': localBackendProxy,
        '/media': localBackendProxy,
      },
    },
    base: '/kbeditor/',
  }
})
