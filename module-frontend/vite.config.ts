import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  loadEnv(mode, process.cwd(), '')

  return {
    base: 'http://localhost:5174/',
    plugins: [
      federation({
        name: 'module_frontend',
        filename: 'remoteEntry.js',
        exposes: {
          './POS': './src/pages/POS.tsx',
          './Products': './src/pages/Products.tsx',
          './moduleMetadata': './src/moduleMetadata.ts',
        },
        remotes: {
          core_frontend: {
            type: 'module',
            name: 'core_frontend',
            entry: 'http://localhost:5173/remoteEntry.js',
          },
        },
        shared: {
          react: { singleton: true, requiredVersion: '^19.2.0' },
          'react-dom': { singleton: true, requiredVersion: '^19.2.0' },
          '@mui/material': { singleton: true },
          '@emotion/react': { singleton: true },
          '@emotion/styled': { singleton: true },
          'react-router-dom': { singleton: true }
        },
        dts: false,
      }),
      react(),
    ],
    server: {
      port: 5174,
      strictPort: true,
    },
    preview: {
      port: 5174,
      strictPort: true,
      cors: true,
    },
    build: {
      modulePreload: false,
      target: 'esnext',
      minify: false,
      cssCodeSplit: false,
    }
  }
})
