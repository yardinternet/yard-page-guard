import { laravelPackageConfig } from '@yardinternet/vite-config';

export default laravelPackageConfig( {
	entryPoints: {
		frontend: 'resources/js/frontend.js',
		admin: 'resources/js/admin.js',
		'editor-sidebar': 'resources/js/editor-sidebar/index.jsx',
	},
} );
