<?php

namespace Yard\PageGuard\Admin;

class AdminPage
{
    public function init(): void
    {
        add_action('admin_menu', [$this, 'add_settings_subpage']);
        add_action('admin_init', [$this, 'register_settings']);
    }

    public function add_settings_subpage(): void
    {
        add_options_page(
            __('Houdbaarheidsmodule Instellingen', 'yard-page-guard'),
            __('Houdbaarheidsmodule', 'yard-page-guard'),
            'manage_options',
            'page-guard-settings',
            [$this, 'render_settings_page']
        );
    }

    public function register_settings(): void
    {
        register_setting('ypg_settings', 'ypg_time_period');
        register_setting('ypg_settings', 'ypg_time_unit');
        register_setting('ypg_settings', 'ypg_email_from');
        register_setting('ypg_settings', 'ypg_reminder_email_bcc');
        register_setting('ypg_settings', 'ypg_review_email_content');
        register_setting('ypg_settings', 'ypg_reminder_email_content');
    }

    public function render_settings_page(): void
    {
        ?>
        <div class="wrap">
            <h1><?php echo __('Houdbaarheidsmodule Instellingen', 'yard-page-guard') ?></h1>
            <form method="post" action="options.php">
                <?php settings_fields('ypg_settings'); ?>
                <?php do_settings_sections('ypg_settings'); ?>
                <table class="form-table">
                    <tr valign="top">
                        <th scope="row"><?php echo __('Afzend emailadres', 'yard-page-guard') ?></th>
                        <td>
                            <input type="email" name="ypg_email_from" value="<?php echo esc_attr(get_option('ypg_email_from', '')); ?>" />
                        </td>
                    </tr>
                    <tr valign="top">
                        <th scope="row"><?php echo __('Herinneringmail BCC emailadres', 'yard-page-guard') ?></th>
                        <td>
                            <input type="email" name="ypg_reminder_email_bcc" value="<?php echo esc_attr(get_option('ypg_reminder_email_bcc', '')); ?>" />
                        </td>
                    </tr>
                    <tr valign="top">
                        <th scope="row"><?php echo __('Herzienings periode', 'yard-page-guard') ?></th>
                        <td class="d-flex">
                            <input type="number" name="ypg_review_time_period" value="<?php echo esc_attr(get_option('ypg_review_time_period', 2)); ?>" min="1" />
                            <select name="ypg_review_time_unit">
                                <?php
                                $units = ['days' => __('Dagen', 'yard-page-guard'), 'weeks' => __('Weken', 'yard-page-guard'), 'months' => __('Maanden', 'yard-page-guard')];
        $selected_unit = get_option('ypg_review_time_unit', 'weeks');
        foreach ($units as $key => $label) {
            echo '<option value="' . esc_attr($key) . '"' . selected($selected_unit, $key, false) . '>' . esc_html($label) . '</option>';
        }
        ?>
                            </select>
                        </td>
                    </tr>
                    <tr valign="top">
                        <th scope="row"><?php echo __('Herinnerings periode', 'yard-page-guard') ?></th>
                        <td class="d-flex">
                            <input type="number" name="ypg_reminder_time_period" value="<?php echo esc_attr(get_option('ypg_reminder_time_period', 1)); ?>" min="1" />
                            <select name="ypg_reminder_time_unit">
                                <?php
                                $units = ['days' => __('Dagen', 'yard-page-guard'), 'weeks' => __('Weken', 'yard-page-guard'), 'months' => __('Maanden', 'yard-page-guard')];
        $selected_unit = get_option('ypg_reminder_time_unit', 'weeks');
        foreach ($units as $key => $label) {
            echo '<option value="' . esc_attr($key) . '"' . selected($selected_unit, $key, false) . '>' . esc_html($label) . '</option>';
        }
        ?>
                            </select>
                        </td>
                    </tr>
                    <tr valign="top">
                        <th scope="row"><?php echo __('Herzieningsmail inhoud', 'yard-page-guard') ?></th>
                        <td>
                            <?php
                            $notificationContent = get_option('ypg_review_email_content', '');
        wp_editor($notificationContent, 'ypg_review_email_content', [
            'textarea_name' => 'ypg_review_email_content',
            'textarea_rows' => 8,
            'media_buttons' => false,
            'teeny' => true,
        ]);
        ?>
                            <div class="description">
                                <p><?= __('De volgende variabelen zijn invoerbaar door {#} toe te voegen aan de tekst (b.v. {1}):', 'yard-page-guard') ?></p>
                                <ol>
                                    <li><?php echo __('Naam van inhoudseigenaar', 'yard-page-guard') ?></li>
                                    <li><?php echo __('Link (met titel als tekst) van pagina', 'yard-page-guard') ?></li>
                                    <li><?php echo __('Herzieningsdatum', 'yard-page-guard') ?></li>
                                    <li><?php echo __('Herzieningsperiode', 'yard-page-guard') ?></li>
                                    <li><?php echo __('"Ik heb gecontroleerd" knop', 'yard-page-guard') ?></li>
                                </ol>
                            </div>
                        </td>
                    </tr>
                    <tr valign="top">
                        <th scope="row"><?php echo __('Herinneringsmail inhoud', 'yard-page-guard') ?></th>
                        <td>
                            <?php
                            $reminderContent = get_option('ypg_reminder_email_content', '');
        wp_editor($reminderContent, 'ypg_reminder_email_content', [
            'textarea_name' => 'ypg_reminder_email_content',
            'textarea_rows' => 8,
            'media_buttons' => false,
            'teeny' => true,
        ]);
        ?>
                            <div class="description">
                                <p><?= __('De volgende variabelen zijn invoerbaar door {#} toe te voegen aan de tekst (b.v. {1}):', 'yard-page-guard') ?></p>
                                <ol>
                                    <li><?php echo __('Naam van inhoudseigenaar', 'yard-page-guard') ?></li>
                                    <li><?php echo __('Link (met titel als tekst) van pagina', 'yard-page-guard') ?></li>
                                    <li><?php echo __('Achterlopende herzieningsdatum', 'yard-page-guard') ?></li>
                                    <li><?php echo __('Herinneringsperiode', 'yard-page-guard') ?></li>
                                    <li><?php echo __('"Ik heb gecontroleerd" knop', 'yard-page-guard') ?></li>
                                </ol>
                            </div>
                        </td>
                    </tr>
                </table>
                <?php submit_button(); ?>
            </form>
        </div>
        <?php
    }
}
