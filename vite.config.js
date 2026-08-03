import { laravelPackageConfig } from '@yardinternet/vite-config';

export default laravelPackageConfig( {
	entryPoints: {
		frontend: 'resources/js/frontend.js',
		admin: 'resources/js/admin.js',
	},
} );
