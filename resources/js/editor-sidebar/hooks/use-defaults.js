/**
 * Internal dependencies
 */
import { fetchDefaults } from '../api';
import { useAsyncData } from './use-async-data';

/**
 * Site wide review and reminder defaults.
 *
 * @return {{defaults: ?Object, isLoading: boolean, error: ?Object}} Request state.
 */
export const useDefaults = () => {
	const { data, isLoading, error } = useAsyncData( fetchDefaults );

	return { defaults: data, isLoading, error };
};
