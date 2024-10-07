import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { join, extname, relative, resolve } from 'path'
import { readdirSync, statSync, mkdirSync, copyFileSync } from 'fs'

import { libInjectCss } from 'vite-plugin-lib-inject-css'
import dts from 'vite-plugin-dts'

import { fileURLToPath } from 'url'

function getFiles(dir: string, files: string[] = []) {
    const items = readdirSync(dir)
    for (const item of items) {
        const fullPath = join(dir, item)
        if (statSync(fullPath).isDirectory()) {
            getFiles(fullPath, files)
        } else if (
            (extname(item) === '.ts' || extname(item) === '.tsx') &&
            !item.endsWith('.d.ts')
        ) {
            files.push(fullPath)
        }
    }
    return files
}

function copyPackageFiles() {
    const destDir = 'package'
    mkdirSync(destDir, { recursive: true })
    const filesToCopy = ['package.json', 'README.md']

    filesToCopy.forEach((file) => {
        const srcPath = resolve(file)
        const destPath = resolve(destDir, file)
        copyFileSync(srcPath, destPath)
        console.log(`Copied ${file} to ${destDir}`)
    })
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        libInjectCss(),
        dts({
            include: ['library'],
            tsconfigPath: './tsconfig.app.json',
        }),
        {
            name: 'copy-package-files',
            buildEnd() {
                copyPackageFiles()
            },
        },
    ],
    build: {
        outDir: 'package/dist',
        copyPublicDir: false,
        lib: {
            entry: resolve(__dirname, 'library/index.ts'),
            formats: ['es'],
        },
        rollupOptions: {
            external: [
                'react',
                'react-dom',
                'react/jsx-runtime',
                '@mantine/core',
                '@mantine/hooks',
            ],
            input: Object.fromEntries(
                getFiles('library').map((file) => [
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
        },
    },
})
