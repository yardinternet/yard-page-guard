import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
	root: 'resources',
	build: {
		outDir: '../build',
		emptyOutDir: true,
		rollupOptions: {
			input: {
				frontend: resolve(__dirname, 'resources/js/frontend.js'),
				admin: resolve(__dirname, 'resources/js/admin.js'),
			},
			output: {
				entryFileNames: '[name].js',
				chunkFileNames: '[name].js',
				assetFileNames: '[name].[ext]',
			},
		},
	},
});
