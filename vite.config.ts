import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/logan-and-the-aetherlings/',
  build: {
    target: 'es2022',
    sourcemap: true,
  },
  plugins: [
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['aether-mark.svg'],
      manifest: {
        name: 'Logan and the Aetherlings',
        short_name: 'Aetherlings',
        description: 'An original 3D creature-collecting adventure.',
        theme_color: '#0b1820',
        background_color: '#0b1820',
        display: 'standalone',
        orientation: 'landscape',
        start_url: '/logan-and-the-aetherlings/',
        icons: [
          {
            src: '/logan-and-the-aetherlings/aether-mark.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: '/logan-and-the-aetherlings/aether-mark-maskable.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        navigateFallback: '/logan-and-the-aetherlings/index.html',
        globPatterns: ['**/*.{js,css,html,svg,webmanifest}'],
      },
    }),
  ],
})
