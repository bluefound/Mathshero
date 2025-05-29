
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nexbridge.mathshero', // Matched to google-services.json and existing Java package
  appName: 'Math Hero', // Corrected app name
  webDir: 'public', // Capacitor will use this for static assets if server.url is not used or for initial copy
                  // Ensure this directory exists at your project root.
  // Server configuration is essential for local development with a dynamic Next.js app
  server: {
    url: 'http://localhost:9002', // Points to your Next.js dev server (from package.json)
    cleartext: true // Allows HTTP traffic for local development (needed for Android)
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0 // Optional: Hide splash screen immediately if web content loads fast
    }
  },
  cordova: {}
};

export default config;
