import type { CapacitorConfig } from '@capacitor/cli'

// One config for every native platform (iOS and Android).
const config: CapacitorConfig = {
  appId: 'com.pragnyalabs.sandhya',
  appName: 'Sandhyavandanam',
  webDir: 'dist',
  backgroundColor: '#f4ecdc', // paper, shown behind the web view while it loads
  ios: { contentInset: 'never' },
  plugins: { LocalNotifications: { smallIcon: 'ic_stat_sandhya', iconColor: '#7c2018' } }, // smallIcon is an Android drawable
}

export default config
