// What every story shares: the app's styles, the theme switch and the phone sizes.

import type { Decorator, Preview } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router'
import { ThemeFrame } from './ThemeFrame'
import '../src/styles/base.css'

// Links (Tab bar) need a router; Storybook gets one that stays in memory.
const withTheme: Decorator = (Story, context) => (
  <MemoryRouter>
    <ThemeFrame theme={context.globals.theme as 'light' | 'dark'}>
      <Story />
    </ThemeFrame>
  </MemoryRouter>
)

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: 'Light or dark theme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
    viewport: { value: 'iphone', isRotated: false },
  },
  parameters: {
    layout: 'fullscreen',
    viewport: {
      options: {
        iphone: { name: 'iPhone 17 Pro', styles: { width: '393px', height: '852px' }, type: 'mobile' },
        iphoneSe: { name: 'iPhone SE', styles: { width: '375px', height: '667px' }, type: 'mobile' },
        ipad: { name: 'iPad', styles: { width: '820px', height: '1180px' }, type: 'tablet' },
      },
    },
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    // Accessibility tab: contrast and names. 'todo' shows problems without failing anything.
    a11y: { test: 'todo' },
  },
}

export default preview
