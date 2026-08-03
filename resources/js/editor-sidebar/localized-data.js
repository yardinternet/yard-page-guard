/**
 * Data localized by AdminServiceProvider::enqueueEditorSidebarAssets().
 *
 * @return {Object} Localized data, or an empty object when unavailable.
 */
export const getEditorSidebarData = () => window.ypgEditorSidebar ?? {};

/**
 * Content owners (WP users + external content owner terms) as SelectControl options.
 *
 * @return {Array<{label: string, value: string}>} Content owner options.
 */
export const getContentOwnerOptions = () => {
	const { contentOwners } = getEditorSidebarData();

	return Array.isArray( contentOwners ) ? contentOwners : [];
};
