import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import vitePluginHtmlEnv from 'vite-plugin-html-env'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'build',
  },
  plugins: [
    svgr({
      svgrOptions: {
        icon: true,
      },
    }),
    vitePluginHtmlEnv(),
    react(),
  ],
  resolve: {
    alias: {
      'tailwind.config.js': path.resolve(__dirname, 'tailwind.config.js'),
    },
  },
  optimizeDeps: {
    include: ['tailwind.config.js'],
  },
})
