const { resolve } = require( 'node:path' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

module.exports = {
	...defaultConfig,
	entry: {
		frontend: './resources/js/frontend/index.jsx',
		'editor-sidebar': './resources/js/editor-sidebar/index.jsx',
	},
	output: {
		...defaultConfig.output,
		path: resolve( __dirname, 'public' ),
	},
	plugins: defaultConfig.plugins.filter(
		( plugin ) => plugin.constructor.name !== 'RtlCssPlugin' // Remove Rtl stylesheets
	),
};
