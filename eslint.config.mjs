import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const nextConfigRequire = createRequire(require.resolve('eslint-config-next/package.json'));

const tsParser = nextConfigRequire('@typescript-eslint/parser');
const tsPlugin = nextConfigRequire('@typescript-eslint/eslint-plugin');
const nextPlugin = nextConfigRequire('@next/eslint-plugin-next');
const reactPlugin = nextConfigRequire('eslint-plugin-react');
const reactHooksPlugin = nextConfigRequire('eslint-plugin-react-hooks');

const browserGlobals = {
    Blob: 'readonly',
    File: 'readonly',
    FileReader: 'readonly',
    HTMLInputElement: 'readonly',
    MediaDeviceInfo: 'readonly',
    MediaRecorder: 'readonly',
    MediaStream: 'readonly',
    React: 'readonly',
    URL: 'readonly',
    alert: 'readonly',
    atob: 'readonly',
    btoa: 'readonly',
    document: 'readonly',
    fetch: 'readonly',
    localStorage: 'readonly',
    navigator: 'readonly',
    window: 'readonly',
};

const nodeGlobals = {
    Buffer: 'readonly',
    console: 'readonly',
    process: 'readonly',
};

export default [
    {
        linterOptions: {
            reportUnusedDisableDirectives: 'off',
        },
    },
    {
        ignores: [
            '.next/**',
            '**/.next/**',
            'node_modules/**',
            '**/node_modules/**',
            'out/**',
            'next-env.d.ts',
            'tsconfig.tsbuildinfo',
        ],
    },
    {
        files: ['**/*.{js,mjs,cjs,ts,tsx}'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaFeatures: { jsx: true },
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
            globals: {
                ...browserGlobals,
                ...nodeGlobals,
            },
        },
        plugins: {
            '@next/next': nextPlugin,
            '@typescript-eslint': tsPlugin,
            react: reactPlugin,
            'react-hooks': reactHooksPlugin,
        },
        settings: {
            next: {
                rootDir: ['./'],
            },
        },
        rules: {
            ...nextPlugin.configs.recommended.rules,
            ...reactHooksPlugin.configs.recommended.rules,
            '@next/next/no-img-element': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            'no-unused-vars': 'off',
            'react-hooks/exhaustive-deps': 'off',
            'react-hooks/set-state-in-effect': 'off',
            'react-hooks/purity': 'off',
        },
    },
];
