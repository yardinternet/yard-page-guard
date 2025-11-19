import config from '@yardinternet/prettier-config';

export default {
	...config,

	overrides: [
		{
			files: '*.yml',
			options: {
				tabWidth: 2,
			},
		},
	],
};
