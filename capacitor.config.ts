import type { CapacitorConfig } from '@capacitor/cli'

// Capacitor wraps the web app (dist/) into the native iOS app in ios/.
// Name and bundle ID come from docs/PRODUCT.md.
const config: CapacitorConfig = {
  appId: 'com.hannagekker.smartboo',
  appName: 'SmartBoo',
  webDir: 'dist',
  plugins: {
    // The launch screen stays until Boo's intro is ready to take over (Intro.tsx hides it), so nothing flashes
    SplashScreen: { launchAutoHide: false, launchFadeOutDuration: 0 },
    // A reminder that comes while SmartBoo is open still shows as a banner (iOS hides them by default)
    LocalNotifications: { presentationOptions: ['banner', 'list', 'sound'] },
  },
}

export default config
