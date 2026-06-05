import { Mark, mergeAttributes } from '@tiptap/core';

export const BUTTON_CLASS = 'ypg-button';

/**
 * A link rendered as a call-to-action button:
 * `<a class="ypg-button" href target="_blank" rel="noopener noreferrer">`.
 *
 * Kept as a mark distinct from the regular Link so the two produce different
 * output and can be toggled independently. The high priority makes its parse
 * rule outrank Link's generic `a[href]` rule, so stored button anchors come
 * back as buttons rather than plain links. `excludes: '_'` clears any other
 * mark inside a button, keeping the label a clean, self-contained CTA.
 */
export const ButtonMark = Mark.create({
	name: 'ypgButton',

	priority: 1100,

	excludes: '_',

	addOptions() {
		return { HTMLAttributes: {} };
	},

	addAttributes() {
		return {
			href: {
				default: null,
				parseHTML: (element) => element.getAttribute('href'),
				renderHTML: (attributes) =>
					attributes.href ? { href: attributes.href } : {},
			},
		};
	},

	parseHTML() {
		return [{ tag: `a.${BUTTON_CLASS}[href]` }];
	},

	renderHTML({ HTMLAttributes }) {
		return [
			'a',
			mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
				class: BUTTON_CLASS,
				target: '_blank',
				rel: 'noopener noreferrer',
			}),
			0,
		];
	},

	addCommands() {
		return {
			setButton:
				(attributes) =>
				({ commands }) =>
					commands.setMark(this.name, attributes),
			unsetButton:
				() =>
				({ commands }) =>
					commands.unsetMark(this.name),
		};
	},
});
