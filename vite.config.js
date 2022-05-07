import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  resolve: {
    alias: {
      '/@': path.resolve(__dirname, './src'),
      '/@api': path.resolve(__dirname, './src/api'),
      '/@store': path.resolve(__dirname, './src/store'),
      '/@views': path.resolve(__dirname, './src/views'),
    }
  },
  plugins: [vue()]
})
