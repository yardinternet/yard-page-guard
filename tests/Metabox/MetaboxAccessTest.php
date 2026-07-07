<?php

declare(strict_types=1);

namespace Yard\PageGuard\Tests\Metabox;

use WP_Mock;
use Yard\PageGuard\Enums\ContentOwnerType;
use Yard\PageGuard\Foundation\AdminCapability;
use Yard\PageGuard\Metabox\MetaboxAccess;
use Yard\PageGuard\Tests\TestCase;

final class MetaboxAccessTest extends TestCase
{
	private MetaboxAccess $access;

	protected function setUp(): void
	{
		parent::setUp();
		$this->access = new MetaboxAccess();

		$_POST = [];
		$_REQUEST = [];

		AdminCapability::reset();
		WP_Mock::userFunction('apply_filters')
			->with(AdminCapability::FILTER, AdminCapability::DEFAULT)
			->andReturn(AdminCapability::DEFAULT);
	}

	protected function tearDown(): void
	{
		AdminCapability::reset();
		parent::tearDown();
	}

	public function testCurrentUserHasAccessIsTrueForAdmin(): void
	{
		$postId = 10;
		$post = (object) ['post_name' => 'about', 'post_author' => 99];
		$user = (object) ['ID' => 1, 'roles' => ['administrator']];

		WP_Mock::userFunction('get_post')->with($postId)->andReturn($post);
		WP_Mock::userFunction('get_post_meta')
			->with($postId, 'ypg_post_content_owner_id', true)
			->andReturn('5');
		WP_Mock::userFunction('get_post_meta')
			->with($postId, 'ypg_post_content_owner_type', true)
			->andReturn(ContentOwnerType::USER);
		WP_Mock::userFunction('wp_get_current_user')->andReturn($user);
		WP_Mock::userFunction('current_user_can')
			->with(AdminCapability::DEFAULT)
			->andReturn(true);

		$this->assertTrue($this->access->currentUserHasAccess($postId));
	}

	public function testCurrentUserHasAccessIsTrueForPostAuthor(): void
	{
		$postId = 10;
		$post = (object) ['post_name' => 'about', 'post_author' => 7];
		$user = (object) ['ID' => 7, 'roles' => ['editor']];

		WP_Mock::userFunction('get_post')->with($postId)->andReturn($post);
		WP_Mock::userFunction('get_post_meta')
			->with($postId, 'ypg_post_content_owner_id', true)
			->andReturn('5');
		WP_Mock::userFunction('get_post_meta')
			->with($postId, 'ypg_post_content_owner_type', true)
			->andReturn(ContentOwnerType::USER);
		WP_Mock::userFunction('wp_get_current_user')->andReturn($user);
		WP_Mock::userFunction('current_user_can')
			->with(AdminCapability::DEFAULT)
			->andReturn(false);

		$this->assertTrue($this->access->currentUserHasAccess($postId));
	}

	public function testCurrentUserHasAccessIsTrueWhenAssignedUserMatches(): void
	{
		$postId = 10;
		$post = (object) ['post_name' => 'about', 'post_author' => 99];
		$user = (object) ['ID' => 5, 'roles' => ['editor']];

		WP_Mock::userFunction('get_post')->with($postId)->andReturn($post);
		WP_Mock::userFunction('get_post_meta')
			->with($postId, 'ypg_post_content_owner_id', true)
			->andReturn('5');
		WP_Mock::userFunction('get_post_meta')
			->with($postId, 'ypg_post_content_owner_type', true)
			->andReturn(ContentOwnerType::USER);
		WP_Mock::userFunction('wp_get_current_user')->andReturn($user);
		WP_Mock::userFunction('current_user_can')
			->with(AdminCapability::DEFAULT)
			->andReturn(false);

		$this->assertTrue($this->access->currentUserHasAccess($postId));
	}

	public function testCurrentUserHasAccessIsFalseForExternalOwnerEvenIfIdMatches(): void
	{
		$postId = 10;
		$post = (object) ['post_name' => 'about', 'post_author' => 99];
		$user = (object) ['ID' => 5, 'roles' => ['editor']];

		WP_Mock::userFunction('get_post')->with($postId)->andReturn($post);
		WP_Mock::userFunction('get_post_meta')
			->with($postId, 'ypg_post_content_owner_id', true)
			->andReturn('5');
		WP_Mock::userFunction('get_post_meta')
			->with($postId, 'ypg_post_content_owner_type', true)
			->andReturn(ContentOwnerType::EXTERNAL);
		WP_Mock::userFunction('wp_get_current_user')->andReturn($user);
		WP_Mock::userFunction('current_user_can')
			->with(AdminCapability::DEFAULT)
			->andReturn(false);

		$this->assertFalse($this->access->currentUserHasAccess($postId));
	}

	public function testCurrentUserHasAccessIsTrueForNewlyCreatedPost(): void
	{
		$postId = 10;
		$post = (object) ['post_name' => '', 'post_author' => 99];
		$user = (object) ['ID' => 1, 'roles' => ['editor']];

		WP_Mock::userFunction('get_post')->with($postId)->andReturn($post);
		WP_Mock::userFunction('get_post_meta')
			->with($postId, 'ypg_post_content_owner_id', true)
			->andReturn('5');
		WP_Mock::userFunction('get_post_meta')
			->with($postId, 'ypg_post_content_owner_type', true)
			->andReturn(ContentOwnerType::USER);
		WP_Mock::userFunction('wp_get_current_user')->andReturn($user);

		$this->assertTrue($this->access->currentUserHasAccess($postId));
	}

	public function testCurrentUserHasAccessIsTrueWhenNoOwnerAssigned(): void
	{
		$postId = 10;
		$post = (object) ['post_name' => 'about', 'post_author' => 99];
		$user = (object) ['ID' => 1, 'roles' => ['editor']];

		WP_Mock::userFunction('get_post')->with($postId)->andReturn($post);
		WP_Mock::userFunction('get_post_meta')
			->with($postId, 'ypg_post_content_owner_id', true)
			->andReturn('');
		WP_Mock::userFunction('get_post_meta')
			->with($postId, 'ypg_post_content_owner_type', true)
			->andReturn('');
		WP_Mock::userFunction('wp_get_current_user')->andReturn($user);
		WP_Mock::userFunction('current_user_can')
			->with(AdminCapability::DEFAULT)
			->andReturn(false);

		$this->assertTrue($this->access->currentUserHasAccess($postId));
	}

	public function testShouldSaveReturnsFalseWhenNoNoncePresent(): void
	{
		$this->assertFalse($this->access->shouldSave(1));
	}

	public function testShouldSaveReturnsFalseOnFailedNonce(): void
	{
		$_POST['ypg_metaboxes_nonce'] = 'bad';

		WP_Mock::userFunction('wp_verify_nonce')
			->with('bad', MetaboxAccess::NONCE_ACTION)
			->andReturn(false);

		$this->assertFalse($this->access->shouldSave(1));
	}

	public function testShouldSaveReturnsTrueOnHappyPath(): void
	{
		$_POST = [
			'ypg_metaboxes_nonce' => 'ok',
			'post_type' => 'page',
		];

		WP_Mock::userFunction('wp_verify_nonce')
			->with('ok', MetaboxAccess::NONCE_ACTION)
			->andReturn(true);
		WP_Mock::userFunction('apply_filters')
			->andReturnUsing(static function ($_filter, $value) {
				return $value;
			});
		WP_Mock::userFunction('current_user_can')
			->with('edit_pages', 1)
			->andReturn(true);
		WP_Mock::userFunction('current_user_can')
			->with(AdminCapability::DEFAULT)
			->andReturn(true);

		// currentUserHasAccess path: admin cap short-circuits to true.
		$post = (object) ['post_name' => 'about', 'post_author' => 99];
		$user = (object) ['ID' => 1, 'roles' => ['administrator']];
		WP_Mock::userFunction('get_post')->with(1)->andReturn($post);
		WP_Mock::userFunction('get_post_meta')
			->with(1, 'ypg_post_content_owner_id', true)
			->andReturn('');
		WP_Mock::userFunction('get_post_meta')
			->with(1, 'ypg_post_content_owner_type', true)
			->andReturn('');
		WP_Mock::userFunction('wp_get_current_user')->andReturn($user);

		$this->assertTrue($this->access->shouldSave(1));
	}

	public function testShouldSaveRejectsUnsupportedPostType(): void
	{
		$_POST = [
			'ypg_metaboxes_nonce' => 'ok',
			'post_type' => 'attachment',
		];

		WP_Mock::userFunction('wp_verify_nonce')
			->with('ok', MetaboxAccess::NONCE_ACTION)
			->andReturn(true);
		WP_Mock::userFunction('apply_filters')
			->andReturnUsing(static function ($_filter, $value) {
				return $value;
			});

		$this->assertFalse($this->access->shouldSave(1));
	}
}
