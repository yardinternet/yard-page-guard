module.exports = {
	...require('@yardinternet/prettier-config'),

	overrides: [
		{
			files: '*.yml',
			options: {
				tabWidth: 2,
			},
		},
	],
};
