import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import { copyFile } from './vite.build.js'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
    plugins: [
        tailwindcss(),
        vue({
            template: {
                compilerOptions: {
                    isCustomElement: (tag) => tag.startsWith('youloge-'),
                }
            }
        }),
        Components({
            dts: 'types/auto-components.d.ts',
            dirs: ['src/components', 'src/directives'],
            directives: true,
            resolvers: [
                {
                    type: 'directive',
                    resolve: name => {
                        return {
                            importName: 'default',
                            path: `@directives/v${name}`

                        }
                    }
                }
            ]
        }),
        AutoImport({
            imports: ['vue', 'pinia', 'vue-router', {
                'tinymce': [['default', 'tinymce']],
                'pako': [['default', 'pako']],
                'youloge.plus': [['default', 'YouPlus']]
            }],
            dirs: ['src/composables', 'src/stores'],
            dts: 'types/auto-imports.d.ts',
            vueTemplate: true,
            eslintrc: {
                enabled: true,
                files: 'src/**/*.vue',
                injectAutoImports: true,
                globalsPropValue: true,
                filepath: 'types/.eslintrc-auto-import.json',
            }
        }),
        copyFile({
            targets: [
                {
                    src: 'dist/index.html',
                    dest: 'dist/404.html'
                }
            ]
        })
    ],
    build: {
        sourcemap: false,
        cssCodeSplit: false,
        modulePreload: { polyfill: false },
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('tinymce')) return 'tinymce'
                        if (/[\\/]node_modules[\\/](vue|vue-router|@vue)[\\/]/.test(id)) return 'vue'
                    }
                }
            }
        }
    },
    resolve: {
        alias: {
            '@': resolve(import.meta.dirname, './src/'),
            '@src': resolve(import.meta.dirname, './src/'),
            '@setup': resolve(import.meta.dirname, './src/setup'),
            '@views': resolve(import.meta.dirname, './src/views'),
            '@pages': resolve(import.meta.dirname, './src/pages'),
            '@stores': resolve(import.meta.dirname, './src/stores'),
            '@directives': resolve(import.meta.dirname, './src/directives'),
            '@components': resolve(import.meta.dirname, './src/components'),
            '@composables': resolve(import.meta.dirname, './src/composables'),
        }
    },
    define:{
        __VERSION__: `"${process.env.npm_package_version || '1.0.0'}"`,
        __UPDATED__: `"${Math.floor(Date.now() / 1000).toString(16).toLocaleUpperCase()}"`,
    }
})