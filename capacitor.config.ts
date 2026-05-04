import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'online.camerasimulator.app',
  appName: 'Camera Simulator',
  webDir: 'out',
  server: { androidScheme: 'https' },
  android: {
    allowMixedContent: true,
    backgroundColor: '#0d0d0d',
  },
};

export default config;
