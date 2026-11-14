import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import config from './vitest.config.ts';

export default defineConfig({
  ...config,
  define: { 'import.meta.env.CHOICE_TOUCH': true },
  test: {
    ...config.test,
    include: ['tests/music-player.browser.test.ts', 'tests/choice-geometry.browser.test.ts', 'tests/control-scale.browser.test.ts', 'tests/bottom-drawer.browser.test.ts', 'tests/responsive-dialog.browser.test.ts'],
    browser: {
      ...config.test!.browser,
      provider: playwright({ contextOptions: { hasTouch: true } }),
    },
  },
});
