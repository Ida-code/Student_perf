import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()], // This allows Vite to handle React components
  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: {
      usePolling: true,
    },
  },
  // --- ADD THIS SECTION ---
  test: {
    globals: true,           // Allows you to use 'describe' and 'it' without importing them
    environment: 'jsdom',    // Simulates a browser for your React components
    setupFiles: './src/setupTests.js', // Optional: for custom test setup
  },
})