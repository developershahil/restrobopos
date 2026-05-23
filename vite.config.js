import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@'         : resolve(__dirname, 'src'),
      '@app'      : resolve(__dirname, 'src/app'),
      '@modules'  : resolve(__dirname, 'src/modules'),
      '@shared'   : resolve(__dirname, 'src/shared'),
      '@routes'   : resolve(__dirname, 'src/routes'),
      '@layouts'  : resolve(__dirname, 'src/layouts'),
      '@styles'   : resolve(__dirname, 'src/styles'),
      '@assets'   : resolve(__dirname, 'src/assets'),
    },
  },
})
