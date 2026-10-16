/**
 * Internal dependencies
 */
import { fetchContentOwners } from '../api';
import { useAsyncData } from './use-async-data';

const EMPTY_OWNERS = [];

/**
 * @return {{owners: Array<Object>, isLoading: boolean, error: ?Object}} Assignable content owners.
 */
export const useContentOwners = () => {
	const { data, isLoading, error } = useAsyncData( fetchContentOwners );

	return {
		owners: Array.isArray( data ) ? data : EMPTY_OWNERS,
		isLoading,
		error,
	};
};
