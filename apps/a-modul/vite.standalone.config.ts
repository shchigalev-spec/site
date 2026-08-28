import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const appRoot = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: resolve(appRoot, 'standalone/app'),
  base: './',
  plugins: [svelte({ configFile: resolve(appRoot, 'svelte.config.js') })],
  resolve: {
    alias: [
      { find: '$lib', replacement: resolve(appRoot, 'src/lib') },
      { find: '$app/state', replacement: resolve(appRoot, 'standalone/app/shims/app-state.ts') },
      { find: '$app/stores', replacement: resolve(appRoot, 'standalone/app/shims/app-stores.ts') },
      { find: '$app/navigation', replacement: resolve(appRoot, 'standalone/app/shims/app-navigation.ts') },
      { find: '$app/environment', replacement: resolve(appRoot, 'standalone/app/shims/app-environment.ts') },
      { find: '$env/dynamic/public', replacement: resolve(appRoot, 'standalone/app/shims/env-public.ts') }
    ]
  },
  build: {
    target: 'es2022',
    outDir: resolve(appRoot, '.standalone-build'),
    emptyOutDir: true,
    assetsInlineLimit: 100_000_000,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        codeSplitting: false
      }
    }
  }
});
