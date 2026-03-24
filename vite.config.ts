import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },

  build: {
    sourcemap: false,
    cssCodeSplit: true,
    target: 'es2020',

    rollupOptions: {
      output: {
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',

        // ← Function signature fix kiya
        manualChunks(id: string) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('react-router-dom')) {
            return 'vendor-react'
          }
          if (id.includes('@tanstack')) {
            return 'vendor-query'
          }
          if (id.includes('lucide-react') || id.includes('react-hot-toast')) {
            return 'vendor-ui'
          }
        },
      },
    },
  },
})