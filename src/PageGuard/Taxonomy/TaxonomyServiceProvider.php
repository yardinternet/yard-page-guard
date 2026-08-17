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
			add_action(ExternalOwnerTaxonomy::TAXONOMY . '_add_form_fields', [$externalOwnerTaxonomy, 'addInsertFormFields']);
			add_action(ExternalOwnerTaxonomy::TAXONOMY . '_edit_form_fields', [$externalOwnerTaxonomy, 'addUpdateFormFields']);
			add_action('created_' . ExternalOwnerTaxonomy::TAXONOMY, [$externalOwnerTaxonomy, 'handleSaveMeta'], 10, 3);
			add_action('edited_' . ExternalOwnerTaxonomy::TAXONOMY, [$externalOwnerTaxonomy, 'handleSaveMeta'], 10, 3);
			add_filter('pre_insert_term', [$externalOwnerTaxonomy, 'preventDuplicateEmailOnInsert'], 10, 2);
			//add_filter('wp_update_term_data', [$externalOwnerTaxonomy, 'preventDuplicateEmailOnUpdate'], 10, 4);

			add_filter('wp_insert_term_data', [$externalOwnerTaxonomy, 'setSlugFromEmailOnInsert'], 10, 3);
			add_filter('wp_update_term_data', [$externalOwnerTaxonomy, 'setSlugFromEmailOnUpdate'], 10, 4);
		});
	}
}
