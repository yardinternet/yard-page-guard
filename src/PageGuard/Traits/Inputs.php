<?php

declare(strict_types=1);

namespace Yard\PageGuard\Traits;

trait Inputs
{
	public function select(array $options_data, $select_name = '', $selected_val = '', array $attributes = [])
	{
		$attr_string = '';
		foreach ($attributes as $key => $value) {
			$attr_string .= ' ' . esc_attr($key) . '="' . esc_attr($value) . '"';
		}

		$output = '<select name="' . esc_attr($select_name) . '"' . $attr_string . '>';
		$output .= sprintf(
			'<option value="">%s</option>',
			esc_html__('Select an option...', 'yard-page-guard')
		);

		// Loop through the data to build options
		foreach ($options_data as $value => $label) {
			$output .= sprintf(
				'<option value="%s" %s>%s</option>',
				esc_attr($value),
				selected($selected_val, $value, false),
				esc_html($label)
			);
		}

		$output .= '</select>';

		return $output;
	}

	public function input(string $type, string $name, string $value = '', array $attributes = []): string
	{
		$attr_string = '';
		foreach ($attributes as $key => $attr_value) {
			$attr_string .= ' ' . esc_attr($key) . '="' . esc_attr($attr_value) . '"';
		}

		return sprintf(
			'<input type="%s" name="%s" value="%s"%s>',
			esc_attr($type),
			esc_attr($name),
			esc_attr($value),
			$attr_string
		);
	}

	public function checkbox(string $name, bool $checked = false, array $attributes = []): string
	{
		$attr_string = '';
		foreach ($attributes as $key => $value) {
			$attr_string .= ' ' . esc_attr($key) . '="' . esc_attr($value) . '"';
		}

		return sprintf(
			'<input type="checkbox" name="%s" value="1"%s%s>',
			esc_attr($name),
			checked($checked, true, false),
			$attr_string
		);
	}

	public function radio(string $name, array $options, string $selected_value = '', array $attributes = []): string
	{
		$attr_string = '';
		foreach ($attributes as $key => $value) {
			$attr_string .= ' ' . esc_attr($key) . '="' . esc_attr($value) . '"';
		}

		$output = '';
		foreach ($options as $value => $label) {
			$output .= sprintf(
				'<label><input type="radio" name="%s" value="%s"%s%s> %s</label><br>',
				esc_attr($name),
				esc_attr($value),
				checked($selected_value, $value, false),
				$attr_string,
				esc_html($label)
			);
		}

		return $output;
	}
}
