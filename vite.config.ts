import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  ssr: {
    // prebuilds ssr.js so we can drop node_modules from the resulting container
    noExternal: true
  },
  plugins: [react(), RubyPlugin(), svgr()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './app/frontend')
    }
  },
  // @ts-expect-error
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setupTests.ts'
  }
})
