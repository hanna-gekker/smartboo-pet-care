import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Boo's server function runs locally with `npm run functions` (wrangler, port 8788)
    proxy: { '/api': 'http://localhost:8788' },
  },
})
