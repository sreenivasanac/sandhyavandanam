import type { CapacitorConfig } from '@capacitor/cli'

// One config for every native platform. iOS is set up today; for Android: pnpm add @capacitor/android && pnpm cap add android.
const config: CapacitorConfig = {
  appId: 'com.pragnyalabs.sandhya',
  appName: 'Sandhyavandanam',
  webDir: 'dist',
  backgroundColor: '#f4ecdc', // paper, shown behind the web view while it loads
  ios: { contentInset: 'never' },
  plugins: { LocalNotifications: { iconColor: '#7c2018' } },
}

export default config
