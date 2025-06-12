module.exports = {
    root: true,
    env: {
        browser: true,
        node: true
    },
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: '@typescript-eslint/parser'
    },
    extends: [
        '@nuxtjs/eslint-config-typescript',
        'plugin:prettier/recommended'
    ],
    plugins: [],
    rules: {
        quotes: ['error', 'single', { avoidEscape: true }],
        'vue/multi-word-component-names': 'off',
        'vue/no-v-html': 'off',
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'prettier/prettier': ['error', { endOfLine: 'auto' }]
    }
}
