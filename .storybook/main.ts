// Storybook: every component on its own, outside the app (npm run storybook → http://localhost:6006).
// It reuses the app's vite.config.ts (React + Tailwind), so the components look the same as in the app.

import { fileURLToPath } from 'node:url'
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', 'storybook-addon-pseudo-states'],
  framework: '@storybook/react-vite',
  // Capacitor plugins only work inside the iPhone app: Storybook gets a stand-in that keeps data in memory.
  viteFinal: (config) => ({
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        '@capacitor/filesystem': fileURLToPath(new URL('./mocks/capacitor-filesystem.ts', import.meta.url)),
      },
    },
  }),
}

export default config
