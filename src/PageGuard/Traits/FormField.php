<?php

declare(strict_types=1);

namespace Yard\PageGuard\Traits;

trait FormField
{
	protected function renderInput(array $args, bool $table = false): string
	{
		$args = wp_parse_args($args, [
			'type' => 'text',
			'name' => '',
			'value' => '',
			'label' => '',
			'description' => '',
			'options' => [],
			'min' => null,
			'max' => null,
			'step' => null,
			'disabled' => null,
			'readonly' => null,
		]);

		$attributes = wp_array_slice_assoc($args, ['min', 'max', 'step', 'disabled', 'readonly', 'required']);
		$attributeString = '';
		foreach ($attributes as $key => $value) {
			if (null === $value) {
				continue;
			}
			if (is_bool($value)) {
				if (true === $value) {
					$value = $attributeString .= sprintf(' %s', esc_attr($key));
				}
			} else {
				$attributeString .= sprintf(' %s="%s"', esc_attr($key), esc_attr($value));
			}
		}

		switch ($args['type']) {
			case 'text':
			case 'email':
			case 'phone':
			case 'number':
			case 'date':
				$label = sprintf('<label for="%1$s">%2$s</label>', esc_attr($args['name']), esc_html($args['label']));
				$input = sprintf(
					'<input id="%1$s" type="%5$s" name="%1$s" value="%3$s" %6$s/>',
					esc_attr($args['name']),
					esc_html($args['label']),
					esc_attr($args['value']),
					esc_html($args['description']),
					esc_attr($args['type']),
					$attributeString
				);

				break;
			case 'select':
				$label = sprintf('<label for="%1$s">%2$s</label>', esc_attr($args['name']), esc_html($args['label']));
				$input = sprintf('<select id="%1$s" name="%1$s">', esc_attr($args['name']));
				foreach ($args['options'] as $optionValue => $optionLabel) {
					$selected = selected($args['value'], $optionValue, false);
					$input .= sprintf('<option value="%s" %s>%s</option>', esc_attr($optionValue), $selected, esc_html($optionLabel));
				}
				$input .= '</select>';

				break;
			case 'radio':
				$label = '';
				$input = '<fieldset>';
				$input .= sprintf('<legend>%s</legend>', esc_html($args['label']));
				foreach ($args['options'] as $optionValue => $optionLabel) {
					$input .= sprintf(
						'<label><input type="radio" name="%1$s" value="%2$s" %3$s/>%4$s</label>',
						esc_attr($args['name']),
						esc_attr($optionValue),
						checked($args['value'], $optionValue, false),
						wp_kses_post($optionLabel)
					);
				}
				$input .= '</fieldset>';

				break;
			default:
				return '';
		}

		if ($table) {
			return sprintf(
				'<tr class="form-field"><th scope="row">%1$s</th><td>%2$s<span class="description">%3$s</span></td></tr>',
				$label,
				$input,
				esc_html($args['description'])
			);
		}

		return sprintf(
			'<div class="form-field">%1$s%2$s%3$s</div>',
			$label,
			$input,
			esc_html($args['description'])
		);
	}
}
