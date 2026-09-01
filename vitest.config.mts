import { defineConfig } from 'vitest/config';

export default defineConfig({
	oxc: {
		decorator: {
			legacy: true,
			emitDecoratorMetadata: true
		},
		assumptions: {
			setPublicClassFields: true
		},
		typescript: {
			removeClassFieldsWithoutInitializer: true
		}
	},
	test: {
		globals: true,
		environment: 'node',
		include: ['test/**/*.spec.ts'],
		setupFiles: ['reflect-metadata'],
		passWithNoTests: true,
		coverage: {
			provider: 'v8',
			reportsDirectory: './coverage',
			reporter: ['text', 'json', 'clover', 'lcov'],
			reportOnFailure: true,
			include: ['src/**/*.ts']
		}
	}
});
