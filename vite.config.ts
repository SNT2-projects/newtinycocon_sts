import { svelteTesting } from '@testing-library/svelte/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import type { Warning } from 'svelte/compiler';

export default defineConfig({
	plugins: [
		sveltekit()
	],
	// Ignorer les avertissements d'accessibilité
	build: {
		rollupOptions: {
			// Svelte ne générera pas d'erreur pour les problèmes d'accessibilité
			onwarn(warning, warn) {
				if (warning.code?.startsWith('a11y-')) return;
				warn(warning);
			}
		}
	},
	test: {
		workspace: [
			{
				extends: './vite.config.ts',
				plugins: [svelteTesting()],
				test: {
					name: 'client',
					environment: 'jsdom',
					clearMocks: true,
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**'],
					setupFiles: ['./vitest-setup-client.ts']
				}
			},
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
