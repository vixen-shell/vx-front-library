import { defineConfig } from 'vite'
import { extname, relative, resolve } from 'path'
import react from '@vitejs/plugin-react'
import dtsPlugin from 'vite-plugin-dts'
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import { fileURLToPath } from 'url'
import { glob } from 'glob'
import copy from 'rollup-plugin-copy'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), libInjectCss(), dtsPlugin({ include: ['library'] })],
    build: {
        outDir: 'package/dist',
        copyPublicDir: false,
        lib: {
            entry: resolve(__dirname, 'library/index.ts'),
            formats: ['es'],
        },
        rollupOptions: {
            external: ['react', 'react-dom', 'react/jsx-runtime'],
            input: Object.fromEntries(
                glob
                    .sync('library/**/!(*.d).{ts,tsx}')
                    .map((file) => [
                        relative(
                            'library',
                            file.slice(0, file.length - extname(file).length)
                        ),
                        fileURLToPath(new URL(file, import.meta.url)),
                    ])
            ),
            output: {
                assetFileNames: 'assets/[name][extname]',
                entryFileNames: '[name].js',
            },
            plugins: [
                copy({
                    targets: [
                        { src: 'package.json', dest: 'package' },
                        { src: 'README.md', dest: 'package' },
                    ],
                }),
            ],
        },
    },
})
