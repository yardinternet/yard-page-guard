import { laravelPackageConfig } from '@yardinternet/vite-config';

export default laravelPackageConfig( {
	entryPoints: {
		frontend: 'resources/js/frontend/index.jsx',
		'editor-sidebar': 'resources/js/editor-sidebar/index.jsx',
	},
} );
