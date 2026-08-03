const NAMESPACE = '/yard-page-guard/v1';

export const CONTENT_OWNERS = `${ NAMESPACE }/editor/content-owners`;
export const DEFAULTS = `${ NAMESPACE }/editor/defaults`;

export const reviewStatus = ( postId ) =>
	`${ NAMESPACE }/editor/review-status/${ postId }`;

export const markReviewed = ( postId ) =>
	`${ NAMESPACE }/editor/mark-reviewed/${ postId }`;
