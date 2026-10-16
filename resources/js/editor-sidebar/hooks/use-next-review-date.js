/**
 * Internal dependencies
 */
import { META_REVIEW_DATE } from '../config/meta-keys';
import { formatSiteDate } from '../utils/date';
import { useDefaults } from './use-defaults';
import { usePostMeta } from './use-post-meta';

/**
 * The review date as it will be stored, so the status updates while editing
 * instead of after a save.
 *
 * An empty REVIEW_DATE means the user picked the site default and the backend
 * still has to resolve it, so the endpoint's preview stands in until then.
 *
 * @return {string} Display formatted date, or an empty string while loading.
 */
export const useNextReviewDate = () => {
	const [ meta ] = usePostMeta();
	const { defaults } = useDefaults();

	const date = meta[ META_REVIEW_DATE ] || '';

	return date ? formatSiteDate( date ) : defaults?.review?.formatted ?? '';
};
