// https://nuxt.com/docs/api/configuration/nuxt-config
import {optimizeLodashImports} from '@optimize-lodash/rollup-plugin'
import {config} from 'dotenv'
import {defineNuxtConfig} from 'nuxt/config'

const isDev = process.env.NODE_ENV === 'development'
config({path: isDev ? '.env.dev' : '.env.prod'})

export default defineNuxtConfig({
    typescript: {
        strict: true,
        shim: false,
        typeCheck: false
    },

    hooks: {
        'vite:extendConfig'(viteConfig) {
            viteConfig.plugins = viteConfig.plugins || []
            viteConfig.plugins.push(optimizeLodashImports())
        }
    },

    modules: [
        '@pinia/nuxt',
        '@nuxtjs/apollo',
        '@nuxtjs/strapi',
        process.env.NODE_ENV === 'development' ? '@nuxtjs/eslint-module' : null
    ].filter(Boolean),

    strapi: {
        url: process.env.STRAPI_URL || 'http://localhost:1337'
    },

    apollo: {
        clients: {
            default: {
                httpEndpoint: `${process.env.STRAPI_URL || 'http://localhost:1337'}/graphql`
            }
        }
    },

    components: {
        global: true,
        dirs: ['~/components']
    },

    css: ['~/assets/scss/main.scss'],

    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@use "@/assets/scss/_variables.scss" as *;'
                }
            }
        }
    },

    runtimeConfig: {
        public: {
            API_BASE_URL: process.env.STRAPI_URL || 'http://localhost:1337',
            SERVICE_PATH: process.env.SERVICE_PATH,
            TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
            TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
            TOCHKA_CUSTOMER_CODE: process.env.TOCHKA_CUSTOMER_CODE,
            TOCHKA_MERCHANT_ID: process.env.TOCHKA_MERCHANT_ID,
            TOCHKA_TOKEN: process.env.TOCHKA_TOKEN,
            RETAIL_CRM_API_URL: process.env.RETAIL_CRM_API_URL,
            RETAIL_CRM_API_TOKEN: process.env.RETAIL_CRM_API_TOKEN,
            BACKEND_BASE_ADDRESS: process.env.BACKEND_BASE_ADDRESS,
            YANDEX_API_KEY: process.env.YANDEX_API_KEY
        }
    },

    imports: {
        dirs: ['store'],
        presets: [
            {
                from: 'vue',
                imports: [
                    'ComputedRef',
                    'Ref',
                    'computed',
                    'watch',
                    'reactive'
                ]
            }
        ]
    },

    build: {
        transpile: []
    },

    ssr: {
        noExternal: true
    }
})