<?php

declare(strict_types=1);

namespace Yard\PageGuard\Taxonomy;

use Yard\PageGuard\Foundation\ServiceProvider;

class TaxonomyServiceProvider extends ServiceProvider
{
	public function register(): void
	{
		add_action('init', function () {
			$externalOwnerTaxonomy = new ExternalOwnerTaxonomy();

			$externalOwnerTaxonomy->register();
			add_action(ExternalOwnerTaxonomy::TAXONOMY . '_add_form_fields', [$externalOwnerTaxonomy, 'addInsertEmailFormField']);
			add_action(ExternalOwnerTaxonomy::TAXONOMY . '_edit_form_fields', [$externalOwnerTaxonomy, 'addUpdateEmailFormField']);
			add_action(ExternalOwnerTaxonomy::TAXONOMY . '_add_form_fields', [$externalOwnerTaxonomy, 'addInsertPhoneNumberFormField']);
			add_action(ExternalOwnerTaxonomy::TAXONOMY . '_edit_form_fields', [$externalOwnerTaxonomy, 'addUpdatePhoneNumberFormField']);
			add_action('created_' . ExternalOwnerTaxonomy::TAXONOMY, [$externalOwnerTaxonomy, 'handleSaveMeta'], 10, 1);
			add_action('edited_' . ExternalOwnerTaxonomy::TAXONOMY, [$externalOwnerTaxonomy, 'handleSaveMeta'], 10, 1);
			add_filter('pre_insert_term', [$externalOwnerTaxonomy, 'preventDuplicateEmailOnInsert'], 10, 2);
			add_filter('wp_update_term_data', [$externalOwnerTaxonomy, 'preventDuplicateEmailOnUpdate'], 10, 4);
		});
	}
}
