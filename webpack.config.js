const defaultConfig = require( '@wordpress/scripts/config/webpack.config' ); // Original config from the @wordpress/scripts package.

module.exports = {
	...defaultConfig,
	entry: {
		editor: [ './resources/scss/editor/style.scss' ],
	},
};
