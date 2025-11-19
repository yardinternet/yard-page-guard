<?php

declare(strict_types=1);

use PhpCsFixer\Finder;
use Yard\PhpCsFixerRules\Config;

# PHP CS Fixer can be run using the VSCode extension on save
# or by using the command line `composer run-scripts format`
# Our current setup only formats PHP files, not blade.php files.
# However, you can install Laravel Blade Formatter (shufo.vscode-blade-formatter)
# which, if installed globally, also supports the command line `blade-formatter --write **/*.blade.php.`

$finder = Finder::create()
	->in(__DIR__)
	->append(['.php-cs-fixer.php'])
	->name('*.php')
	->name('_ide_helper')
	->notName('*.blade.php')
	->ignoreDotFiles(true)
	->ignoreVCS(true)

	->exclude('node_modules')
	->exclude('vendor');

return Config::create($finder);
