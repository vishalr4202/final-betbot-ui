import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
    host: '127.0.0.2',   // Bind specifically to the alternate loopback
    port: 5173,          // Your chosen dev port
    strictPort: true,    // Prevent auto-shifting to a random port if busy
  },
})
