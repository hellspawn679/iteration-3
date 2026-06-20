import { defineConfig } from 'vite'
import shopify from 'vite-plugin-shopify'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    shopify({
      sourceCodeDir: 'frontend',
      entrypointsDir: 'frontend/entrypoints'
    }),
    react()
  ],
  build: {
    emptyOutDir: false
  }
})
