<?php

declare(strict_types=1);

namespace Yard\PageGuard\Tests\Foundation;

use WP_Mock;
use WP_User;
use Yard\PageGuard\Foundation\AdminCapability;
use Yard\PageGuard\Tests\TestCase;

final class AdminCapabilityTest extends TestCase
{
	public function testGrantsCapToUserWithAdminRole(): void
	{
		WP_Mock::userFunction('apply_filters')
			->with('yard::page-guard/admin-roles', AdminCapability::DEFAULT_ADMIN_ROLES)
			->andReturnUsing(static fn ($_filter, $value) => $value);

		$user = new WP_User();
		$user->roles = ['administrator'];

		$result = AdminCapability::grantToAdminRoles([], [], [], $user);

		$this->assertTrue($result[AdminCapability::NAME] ?? false);
	}

	public function testDoesNotGrantCapToUserWithoutAdminRole(): void
	{
		WP_Mock::userFunction('apply_filters')
			->with('yard::page-guard/admin-roles', AdminCapability::DEFAULT_ADMIN_ROLES)
			->andReturnUsing(static fn ($_filter, $value) => $value);

		$user = new WP_User();
		$user->roles = ['editor'];

		$result = AdminCapability::grantToAdminRoles([], [], [], $user);

		$this->assertArrayNotHasKey(AdminCapability::NAME, $result);
	}

	public function testRespectsFilteredAdminRoles(): void
	{
		WP_Mock::onFilter('yard::page-guard/admin-roles')
			->with(AdminCapability::DEFAULT_ADMIN_ROLES)
			->reply(['editor']);

		$user = new WP_User();
		$user->roles = ['editor'];

		$result = AdminCapability::grantToAdminRoles([], [], [], $user);

		$this->assertTrue($result[AdminCapability::NAME] ?? false);
	}
}
