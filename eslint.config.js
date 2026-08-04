import config from '@yardinternet/eslint-config';
import { globalIgnores } from 'eslint/config';

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
