import { defineConfig } from 'vite';
import { resolve } from 'path';
import glsl from 'vite-plugin-glsl';
import autoprefixer from 'autoprefixer';

export default defineConfig(({ mode }) => ({
  base: '/random-walker/',
  plugins: [glsl()],
  css: {
    postcss: {
      // npx autoprefixer --info
      plugins: [autoprefixer],
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
}));
