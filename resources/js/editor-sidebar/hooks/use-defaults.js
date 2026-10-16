/**
 * Internal dependencies
 */
import { fetchDefaults } from '../api';
import { useAsyncData } from './use-async-data';

export const useDefaults = () => {
	const { data, isLoading, error } = useAsyncData( fetchDefaults );

	return { defaults: data, isLoading, error };
};
