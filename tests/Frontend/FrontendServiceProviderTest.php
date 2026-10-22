<?php

declare(strict_types=1);

namespace Yard\PageGuard\Tests\Frontend;

use Mockery;
use WP_Mock;
use Yard\PageGuard\Foundation\Plugin;
use Yard\PageGuard\Frontend\FrontendServiceProvider;
use Yard\PageGuard\Tests\TestCase;

class FrontendServiceProviderTest extends TestCase
{
	protected function setUp(): void
	{
		WP_Mock::setUp();

		$_GET = [
			FrontendServiceProvider::QUERY_PARAM_REVIEW_TOKEN => 'abc',
			FrontendServiceProvider::QUERY_PARAM_POST_ID => '44768',
			FrontendServiceProvider::QUERY_PARAM_MODAL_INFO_ENDPOINT => 'https://openpdc.example/wp-json/yard/page-guard/v2/modal-info',
		];

		WP_Mock::userFunction('is_user_logged_in', ['return' => false]);
		WP_Mock::userFunction('get_post', ['return' => null]);
		WP_Mock::passthruFunction('sanitize_text_field');
		WP_Mock::passthruFunction('sanitize_user');
		WP_Mock::userFunction('wp_parse_url', ['return' => fn ($url, $component) => parse_url($url, $component)]);
		WP_Mock::userFunction('add_query_arg', ['return' => fn ($args, $url) => $url . '?' . http_build_query($args)]);
		WP_Mock::userFunction('user_can', ['return' => false]);

		$user = new \WP_User();
		$user->ID = 7;
		WP_Mock::userFunction('get_user_by', ['return' => $user]);
	}

	protected function tearDown(): void
	{
		WP_Mock::tearDown();
		$_GET = [];
	}

	private function provider(): FrontendServiceProvider
	{
		return new FrontendServiceProvider(Mockery::mock(Plugin::class));
	}

	public function testLogsInWhenTrustedOriginVerifiesTheToken(): void
	{
		WP_Mock::onFilter('yard::page-guard/trusted-review-origins')->with([])->reply(['openpdc.example']);
		WP_Mock::userFunction('wp_remote_get', [
			'times' => 1,
			'args' => ['https://openpdc.example/wp-json/yard/page-guard/v2/modal-info?post_id=44768&token=abc', Mockery::any()],
			'return' => ['response' => ['code' => 200]],
		]);
		WP_Mock::userFunction('wp_remote_retrieve_response_code', ['return' => 200]);
		WP_Mock::userFunction('wp_set_current_user', ['times' => 1, 'args' => [7]]);

		$this->provider()->loginReviewUser();

		$this->addToAssertionCount(Mockery::getContainer()->mockery_getExpectationCount());
		Mockery::getContainer()->mockery_verify();
	}

	public function testIgnoresEndpointOnUntrustedOrigin(): void
	{
		WP_Mock::onFilter('yard::page-guard/trusted-review-origins')->with([])->reply(['openpdc.example']);
		$_GET[FrontendServiceProvider::QUERY_PARAM_MODAL_INFO_ENDPOINT] = 'https://evil.example/wp-json/yard/page-guard/v2/modal-info';
		WP_Mock::userFunction('wp_remote_get', ['times' => 0]);
		WP_Mock::userFunction('wp_set_current_user', ['times' => 0]);

		$this->provider()->loginReviewUser();

		$this->addToAssertionCount(Mockery::getContainer()->mockery_getExpectationCount());
		Mockery::getContainer()->mockery_verify();
	}
}
