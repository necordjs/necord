import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import perfectionist from 'eslint-plugin-perfectionist';

export default tseslint.config(
	{
		ignores: ['node_modules', '**/node_modules/**', '**/*.js', '**/*.d.ts']
	},
	eslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	eslintPluginPrettierRecommended,
	perfectionist.configs['recommended-alphabetical'],
	{
		languageOptions: {
			globals: {
				...globals.node,
				...globals.jest
			},
			ecmaVersion: 5,
			sourceType: 'module',
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname
			}
		}
	},
	{
		rules: {
			'perfectionist/sort-imports': [
				'error',
				{
					type: 'line-length',
					order: 'desc',
					ignoreCase: true,
					specialCharacters: 'keep',
					internalPattern: ['^~/.+'],
					partitionByComment: false,
					partitionByNewLine: false,
					newlinesBetween: 1,
					maxLineLength: undefined,
					tsconfig: {
						rootDir: import.meta.dirname
					},

					groups: [
						'type-import',
						['builtin', 'value-external'],
						'type-internal',
						'value-internal',
						{ newlinesBetween: 0 },
						['type-parent', 'type-sibling', 'type-index'],
						'ts-equals-import',
						'unknown'
					],

					environment: 'node'
				}
			],

			'perfectionist/sort-objects': ['off'],
			'perfectionist/sort-classes': ['off'],
			'perfectionist/sort-switch-case': ['off'],
			'perfectionist/sort-object-types': ['off'],
			'perfectionist/sort-interfaces': ['off'],
			'perfectionist/sort-union-types': ['off'],
			'perfectionist/sort-named-imports': ['off'],
			'perfectionist/sort-modules': ['off'],
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/no-unsafe-function-type': 'off',
			'@typescript-eslint/no-unsafe-argument': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
			'@typescript-eslint/no-unused-expressions': 'off',
			'@typescript-eslint/no-require-imports': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
			'@typescript-eslint/no-misused-promises': [
				'error',
				{
					checksVoidReturn: false,
					checksConditionals: false
				}
			],
			'@typescript-eslint/require-await': 'off',
			'@typescript-eslint/prefer-promise-reject-errors': 'off',
			'@typescript-eslint/no-base-to-string': 'off',
			'@typescript-eslint/unbound-method': 'off',
			'@typescript-eslint/only-throw-error': 'off'
		}
	}
);
