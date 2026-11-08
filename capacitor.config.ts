import type { CapacitorConfig } from '@capacitor/cli'

// Capacitor wraps the web app (dist/) into the native iOS app in ios/.
// Name and bundle ID come from docs/PRODUCT.md.
const config: CapacitorConfig = {
  appId: 'com.hannagekker.smartboo',
  appName: 'SmartBoo',
  webDir: 'dist',
}

export default config
