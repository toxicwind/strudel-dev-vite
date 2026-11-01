import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
export default defineConfig({
  plugins: [react()],
  root: __dirname,
  resolve: { alias: { '@toxicwind/strudel-serum': path.resolve(__dirname, '../../packages/serum/src') } },
  build: { target: 'esnext', outDir: '../../dist' },
  server: { port: 8088, host: '0.0.0.0', strictPort: false }
})
