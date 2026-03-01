import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'bevy-meta-404',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url?.endsWith('.meta')) {
            res.statusCode = 404;
            res.end('Not Found');
          } else {
            next();
          }
        });
      }
    }
  ],
  assetsInclude: ['**/*.wasm'],
})
