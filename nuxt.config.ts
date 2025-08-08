// https://nuxt.com/docs/api/configuration/nuxt-config
import { optimizeLodashImports } from '@optimize-lodash/rollup-plugin'
import { config } from 'dotenv'

const isDev: boolean = process.env.NODE_ENV === 'development'
const envFilename: string = isDev ? '.env.dev' : '.env.prod'
config({ path: envFilename })
export default defineNuxtConfig({
    hooks: {
        'vite:extendConfig': (config) => {
            config?.plugins?.push(optimizeLodashImports())
        }
    },
    modules: [
        [
            '@pinia/nuxt',
            {
                autoImports: ['defineStore']
            }
        ],
        '@nuxtjs/apollo',
        '@nuxtjs/strapi',
        '@nuxtjs/eslint-module'
    ],
    strapi: {
        // Options
        url: process.env.STRAPI_URL || 'http://localhost:1337'
    },
    apollo: {
        clients: {
            default: {
                httpEndpoint:
                    process.env.STRAPI_URL + '/graphql' ||
                    'http://localhost:1337/graphql'
            }
        }
    },
    components: [
        {
            path: '~/components', // will get any components nested in let's say /components/test too
            pathPrefix: false
        }
    ],
    eslint: {
        lintOnStart: false
    },
    css: ['~/assets/scss/main.scss'],
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@use "@/assets/scss/_variables.scss" as *;'
                }
            },
            modules: {
                generateScopedName: '[hash:base64:8]'
            }
        },
        plugins: []
    },
    runtimeConfig: {
        public: {
            API_BASE_URL: process.env.STRAPI_URL || 'http://localhost:1337',
            SERVICE_PATH: process.env.SERVICE_PATH,
            BACKEND_BASE_ADDRESS: process.env.BACKEND_BASE_ADDRESS,
            YANDEX_API_KEY: process.env.YANDEX_API_KEY
        }
    },
    imports: {
        dirs: ['store']
    },
    build: {
        // transpile: ['nuxt-vue-select']
    },
    experimental: {
        inlineSSRStyles: false
    }
})
