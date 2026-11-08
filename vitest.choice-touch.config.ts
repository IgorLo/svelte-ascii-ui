import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import config from './vitest.config.ts';

export default defineConfig({
  ...config,
  define: { 'import.meta.env.CHOICE_TOUCH': true },
  test: {
    ...config.test,
    include: ['tests/choice-geometry.browser.test.ts', 'tests/control-scale.browser.test.ts'],
    browser: {
      ...config.test!.browser,
      provider: playwright({ contextOptions: { hasTouch: true } }),
    },
  },
});
