import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'dev-html-transform',
      transformIndexHtml(html, ctx) {
        if (ctx.server) {
          return html
            .replace('<link rel="stylesheet" crossorigin href="./assets/index.css">', '')
            .replace(
              '<script type="module" crossorigin src="./assets/index.js"></script>',
              '<script type="module" src="/src/main.jsx"></script>'
            )
        }
        return html
      }
    }
  ],
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: 'src/main.jsx'
      },
      output: {
        entryFileNames: 'assets/index.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/index.[ext]'
      }
    }
  },
  server: {
    port: 5173,
    open: true
  }
})
