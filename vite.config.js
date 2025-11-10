import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-scroll-parallax': path.resolve(__dirname, 'src/lib/react-scroll-parallax.jsx')
    }
  },
  base: '/'
  /*,server: {
    port: 5173,
    open: true
  }*/
});
