import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
export default defineConfig({
  plugins: [dts()],
  build: {
    lib: { entry: path.resolve(__dirname, 'src/index.ts'), name: 'SerumPlugins', formats: ['es'], fileName: 'index' },
    rollupOptions: { external: ['@strudel/core', '@strudel/web'] },
    target: 'esnext',
    outDir: 'dist',
    emptyOutDir: true
  }
})
