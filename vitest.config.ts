import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  plugins: [svelte()],
  server: { host: '127.0.0.1' },
  test: {
    include: ['tests/**/*.browser.test.ts'],
    browser: {
      enabled: true,
      // Render native parts so scrollbar tests can count the visible arrows.
      provider: playwright({ launchOptions: { ignoreDefaultArgs: ['--hide-scrollbars'] } }),
      headless: true,
      instances: [{ browser: 'chromium' }],
    },
  },
});
