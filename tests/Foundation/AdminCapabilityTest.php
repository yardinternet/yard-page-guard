<?php

declare(strict_types=1);

namespace Yard\PageGuard\Tests\Foundation;

use Mockery;
use WP_Mock;
use Yard\PageGuard\Foundation\AdminCapability;
use Yard\PageGuard\Tests\TestCase;

final class AdminCapabilityTest extends TestCase
{
	protected function setUp(): void
	{
		parent::setUp();
		AdminCapability::reset();
	}

	protected function tearDown(): void
	{
		AdminCapability::reset();
		parent::tearDown();
	}

	public function testReturnsDefaultCapWhenFilterDoesNotChangeIt(): void
	{
		WP_Mock::onFilter(AdminCapability::FILTER)
			->with(AdminCapability::DEFAULT)
			->reply(AdminCapability::DEFAULT);

		$this->assertSame('yard_manage_page_guard', AdminCapability::name());
	}

	public function testReturnsFilteredCap(): void
	{
		WP_Mock::onFilter(AdminCapability::FILTER)
			->with(AdminCapability::DEFAULT)
			->reply('manage_options');

		$this->assertSame('manage_options', AdminCapability::name());
	}

	public function testCachesResultWithinRequest(): void
	{
		WP_Mock::onFilter(AdminCapability::FILTER)
			->with(AdminCapability::DEFAULT)
			->reply('edit_users');

		$this->assertSame('edit_users', AdminCapability::name());
		$this->assertSame('edit_users', AdminCapability::name());
	}

	public function testRolesDefaultsToConfiguredRoles(): void
	{
		WP_Mock::onFilter(AdminCapability::ROLES_FILTER)
			->with(AdminCapability::DEFAULT_ROLES)
			->reply(AdminCapability::DEFAULT_ROLES);

		foreach (AdminCapability::DEFAULT_ROLES as $roleName) {
			WP_Mock::userFunction('get_role')->with($roleName)->andReturn(Mockery::mock('WP_Role'));
		}

		$this->assertSame(AdminCapability::DEFAULT_ROLES, AdminCapability::roles());
	}

	public function testRolesIsFilterableAndKeepsOnlyStrings(): void
	{
		WP_Mock::onFilter(AdminCapability::ROLES_FILTER)
			->with(AdminCapability::DEFAULT_ROLES)
			->reply(['administrator', 'editor', 5]);

		WP_Mock::userFunction('get_role')->with('administrator')->andReturn(Mockery::mock('WP_Role'));
		WP_Mock::userFunction('get_role')->with('editor')->andReturn(Mockery::mock('WP_Role'));

		$this->assertSame(['administrator', 'editor'], AdminCapability::roles());
	}

	public function testRolesDropsRolesThatDoNotExist(): void
	{
		WP_Mock::onFilter(AdminCapability::ROLES_FILTER)
			->with(AdminCapability::DEFAULT_ROLES)
			->reply(['administrator', 'ghost']);

		WP_Mock::userFunction('get_role')->with('administrator')->andReturn(Mockery::mock('WP_Role'));
		WP_Mock::userFunction('get_role')->with('ghost')->andReturn(null);

		$this->assertSame(['administrator'], AdminCapability::roles());
	}

	public function testAddToRolesGrantsDefaultCapToConfiguredRoles(): void
	{
		WP_Mock::onFilter(AdminCapability::FILTER)
			->with(AdminCapability::DEFAULT)
			->reply(AdminCapability::DEFAULT);
		WP_Mock::onFilter(AdminCapability::ROLES_FILTER)
			->with(AdminCapability::DEFAULT_ROLES)
			->reply(['administrator', 'editor']);

		$administrator = Mockery::mock('WP_Role');
		$administrator->shouldReceive('add_cap')->once()->with(AdminCapability::DEFAULT);
		$editor = Mockery::mock('WP_Role');
		$editor->shouldReceive('add_cap')->once()->with(AdminCapability::DEFAULT);

		WP_Mock::userFunction('get_role')->with('administrator')->andReturn($administrator);
		WP_Mock::userFunction('get_role')->with('editor')->andReturn($editor);

		AdminCapability::addToRoles();

		// The add_cap() expectations above are verified on teardown.
		$this->addToAssertionCount(2);
	}

	public function testAddToRolesSkipsRolesThatDoNotExist(): void
	{
		WP_Mock::onFilter(AdminCapability::FILTER)
			->with(AdminCapability::DEFAULT)
			->reply(AdminCapability::DEFAULT);
		WP_Mock::onFilter(AdminCapability::ROLES_FILTER)
			->with(AdminCapability::DEFAULT_ROLES)
			->reply(['ghost']);

		WP_Mock::userFunction('get_role')->with('ghost')->andReturn(null);

		AdminCapability::addToRoles();

		$this->assertTrue(true);
	}

	public function testAddToRolesIsNoOpWhenCapNameFiltered(): void
	{
		WP_Mock::onFilter(AdminCapability::FILTER)
			->with(AdminCapability::DEFAULT)
			->reply('edit_others_pages');

		// get_role is intentionally not mocked: calling it would fail the test.
		AdminCapability::addToRoles();

		$this->assertTrue(true);
	}

	public function testRemoveFromRolesStripsDefaultCapFromConfiguredRoles(): void
	{
		WP_Mock::onFilter(AdminCapability::FILTER)
			->with(AdminCapability::DEFAULT)
			->reply(AdminCapability::DEFAULT);
		WP_Mock::onFilter(AdminCapability::ROLES_FILTER)
			->with(AdminCapability::DEFAULT_ROLES)
			->reply(['administrator']);

		$administrator = Mockery::mock('WP_Role');
		$administrator->shouldReceive('remove_cap')->once()->with(AdminCapability::DEFAULT);

		WP_Mock::userFunction('get_role')->with('administrator')->andReturn($administrator);

		AdminCapability::removeFromRoles();

		// The remove_cap() expectation above is verified on teardown.
		$this->addToAssertionCount(1);
	}

	public function testRemoveFromRolesIsNoOpWhenCapNameFiltered(): void
	{
		WP_Mock::onFilter(AdminCapability::FILTER)
			->with(AdminCapability::DEFAULT)
			->reply('edit_others_pages');

		AdminCapability::removeFromRoles();

		$this->assertTrue(true);
	}
}
