import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'

// https://vite.dev/config/
export default defineConfig({
  base: 'http://localhost:5173/',
  plugins: [
    react(),
    federation({
      name: 'core_frontend',
      filename: 'remoteEntry.js',
      exposes: {
        './Theme': './src/theme.ts',
        './CoreCss': './src/shared-core.css',
        './DataTable': './src/components/DataTable.tsx',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
        '@mui/material': { singleton: true },
        '@emotion/react': { singleton: true },
        '@emotion/styled': { singleton: true },
        'react-router-dom': { singleton: true }
      },
      dts: false,
    })
  ],
  preview: {
    port: 5173,
    strictPort: true,
  },
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  }
})
