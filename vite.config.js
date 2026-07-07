import { defineConfig } from 'vite';
import { resolve } from 'path';

const entries = {
	admin: resolve(__dirname, 'resources/js/admin.js'),
	frontend: resolve(__dirname, 'resources/js/frontend.js'),
};

// Emit isolated IIFE bundles. WordPress enqueues these as classic scripts, so
// Vite's default ESM output would leak the bundle's minified top-level names
// (e.g. `mergeAttributes` → `_`) into the global scope, colliding with
// WordPress globals like `window._` (Underscore) and corrupting the editor.
// IIFE can't code-split across inputs, so each entry is built on its own
// (`--mode admin` / `--mode frontend`; see the build script).
export default defineConfig(({ mode }) => {
	const target = mode === 'frontend' ? 'frontend' : 'admin';
	return {
		root: 'resources',
		build: {
			outDir: '../build',
			// Only the first build of the pair clears the output directory.
			emptyOutDir: target === 'admin',
			sourcemap: true,
			// IIFE bundles otherwise inline CSS as a runtime <style> injection;
			// keep it extracted to a file so WordPress can enqueue it directly.
			cssCodeSplit: false,
			rollupOptions: {
				input: { [target]: entries[target] },
				output: {
					format: 'iife',
					entryFileNames: '[name].js',
					// The extracted CSS is named `style.css` by default; name it
					// after the entry so it stays `admin.css` / `frontend.css`.
					assetFileNames: (asset) => {
						const name = asset.names?.[0] ?? asset.name ?? '';
						return name.endsWith('.css')
							? `${target}.[ext]`
							: '[name].[ext]';
					},
				},
			},
		},
	};
});
