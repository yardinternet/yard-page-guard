<?php

declare(strict_types=1);

namespace Yard\PageGuard\Tests;

use PHPUnit\Framework\TestCase as PHPUnit;
use WP_Mock;

class TestCase extends PHPUnit
{
	protected function setUp(): void
	{
		parent::setUp();
		WP_Mock::setUp();
	}

	protected function tearDown(): void
	{
		WP_Mock::tearDown();
		parent::tearDown();
	}

	/**
	 * Call protected/private method of a class.
	 *
	 * @param object &$object    Instantiated object that we will run method on.
	 * @param string $methodName Method name to call
	 * @param array  $parameters Array of parameters to pass into method.
	 *
	 * @return mixed Method return.
	 */
	public function invokeMethod(&$object, $methodName, array $parameters = [])
	{
		$reflection = new \ReflectionClass(get_class($object));
		$method = $reflection->getMethod($methodName);

		// setAccessible() is required on PHP < 8.1 and a no-op (with a deprecation
		// warning on 8.5+) afterwards, so skip it on modern PHP.
		if (\PHP_VERSION_ID < 80100) {
			$method->setAccessible(true);
		}

		return $method->invokeArgs($object, $parameters);
	}
}
