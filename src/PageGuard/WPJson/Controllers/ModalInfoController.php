<?php

declare(strict_types=1);

namespace Yard\PageGuard\WPJson\Controllers;

use WP_REST_Request;
use WP_REST_Response;
use Yard\PageGuard\Traits\Date;
use Yard\PageGuard\Traits\Text;
use Yard\PageGuard\Traits\Token;

class ModalInfoController
{
	use Date;
	use Text;
	use Token;

	/**
	 * Returns post info (only title for now) for Fusion PDC/Pub connections
	 */
	public function handleRequest(WP_REST_Request $request): WP_REST_Response
	{
		$postId = (int) $request->get_param('post_id');
		$footer = trim(strip_tags(get_option('ypg_modal_footer_content', ''))) !== '' ? wpautop(get_option('ypg_modal_footer_content', '')) : false;

		return new WP_REST_Response([
			'id' => $postId,
			'title' => get_the_title($postId),
			'footer' => $footer,
			'endpoint' => get_rest_url(null, '/yard-page-guard/v1/verify-post'),
		]);
	}
}
