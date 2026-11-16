import eslintPluginAstro from 'eslint-plugin-astro';
import eslintConfigPrettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default [
    { ignores: ['dist/', '.astro/', 'env.d.ts'] },
    ...tseslint.configs.recommended,
    ...eslintPluginAstro.configs.recommended,
    jsxA11y.flatConfigs.recommended,
    {
        files: ['**/*.{js,jsx,ts,tsx,astro}'],
        plugins: {
            react: reactPlugin,
            'react-hooks': reactHooks,
        },
        rules: {
            ...reactPlugin.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,
            'react/react-in-jsx-scope': 'off',
            // Astro components use standard HTML classes, so this rule is often too noisy or irrelevant
            'react/no-unknown-property': 'off',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/no-explicit-any': 'warn',
            'react-hooks/set-state-in-effect': 'off',
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
    {
        files: ['**/*.astro'],
        languageOptions: {
            parserOptions: {
                parser: tseslint.parser,
            },
        },
        rules: {
            'react/jsx-key': 'off',
            'react/no-unknown-property': 'off',
            'react/jsx-no-target-blank': 'off',
            'prefer-rest-params': 'off',
            // Astro templates emit native HTML, so string handlers (e.g. <img onerror="...">)
            // are not React interaction handlers.
            'jsx-a11y/no-noninteractive-element-interactions': 'off',
            // role="list" on <ul> restores list semantics in Safari/VoiceOver
            // when list-style is none.
            'jsx-a11y/no-redundant-roles': 'off',
        }
    },
    eslintConfigPrettier,
];
