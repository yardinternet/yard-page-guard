import config from '@yardinternet/eslint-config';
import { globalIgnores } from 'eslint/config';

/**
 * WP 6.8.6 ships these under their experimental names only; the stable names
 * upstream suggests are `undefined` at runtime. Allowed until core stabilises them.
 */
const allowedExperimentalComponents = [
	'__experimentalDivider',
	'__experimentalHStack',
	'__experimentalHeading',
	'__experimentalNumberControl',
	'__experimentalText',
	'__experimentalVStack',
];

export default [
	globalIgnores( [ 'public/', 'node_modules/', 'vendor/' ] ),
	...config,
	{
		files: [ 'resources/js/editor-sidebar/**/*.{js,jsx}' ],
		rules: {
			'@wordpress/no-unsafe-wp-apis': [
				'error',
				{ '@wordpress/components': allowedExperimentalComponents },
			],
		},
	},
];
