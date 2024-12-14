import { defineConfig } from 'vite'
import sass from 'sass'

import react from '@vitejs/plugin-react'
import reactRefresh from '@vitejs/plugin-react-refresh'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    plugins: [
        react(),
        reactRefresh(), 
        tsconfigPaths()
    ],
    css: {
        preprocessorOptions: {
            scss: {
                // @ts-ignore
                implementation: sass,
            },
        },
    },
})
