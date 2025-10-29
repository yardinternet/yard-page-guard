<?php

namespace Yard\PageGuard\Taxonomy;

use Yard\PageGuard\Foundation\ServiceProvider;

class TaxonomyServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        add_action('init', function () {
            $externalOwnerTaxonomy = new ExternalOwnerTaxonomy();

            $externalOwnerTaxonomy->register();
            add_action('ypg_external_content_owner_add_form_fields', [$externalOwnerTaxonomy, 'addInsertEmailFormField']);
            add_action('ypg_external_content_owner_edit_form_fields', [$externalOwnerTaxonomy, 'addUpdateEmailFormField']);
            add_action('created_ypg_external_content_owner', [$externalOwnerTaxonomy, 'handleSaveMeta'], 10, 1);
            add_action('edited_ypg_external_content_owner', [$externalOwnerTaxonomy, 'handleSaveMeta'], 10, 1);
        });
    }
}
