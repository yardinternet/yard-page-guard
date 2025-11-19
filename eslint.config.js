import config from '@yardinternet/eslint-config';
import { globalIgnores } from 'eslint/config';

export default [
	globalIgnores(['build/', 'node_modules/', 'vendor/']),
	...config,
];
