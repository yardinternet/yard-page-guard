import { LinkNode } from '@lexical/link';

export const BUTTON_CLASS = 'ypg-button';

export class ButtonNode extends LinkNode {
	static getType() {
		return 'ypg-button';
	}

	static clone(node) {
		return new ButtonNode(
			node.__url,
			{
				rel: node.__rel,
				target: node.__target,
				title: node.__title,
			},
			node.__key
		);
	}

	createDOM(config) {
		const dom = super.createDOM(config);
		dom.classList.add(BUTTON_CLASS);
		return dom;
	}

	updateDOM(prevNode, dom, config) {
		const result = super.updateDOM(prevNode, dom, config);
		dom.classList.add(BUTTON_CLASS);
		return result;
	}

	exportDOM() {
		const result = super.exportDOM();
		if (result?.element instanceof HTMLAnchorElement) {
			result.element.classList.add(BUTTON_CLASS);
		}
		return result;
	}

	static importDOM() {
		return {
			a: (node) => {
				if (node.classList?.contains(BUTTON_CLASS)) {
					return {
						conversion: (el) => ({
							node: $createButtonNode(
								el.getAttribute('href') || ''
							),
						}),
						// Outrank the default LinkNode handler so anchors with
						// the button class become ButtonNodes, not plain LinkNodes.
						priority: 1,
					};
				}
				return null;
			},
		};
	}

	static importJSON(serialized) {
		return $createButtonNode(serialized.url || '');
	}

	exportJSON() {
		return {
			...super.exportJSON(),
			type: 'ypg-button',
			version: 1,
		};
	}
}

export function $createButtonNode(url) {
	return new ButtonNode(url);
}

export function $isButtonNode(node) {
	return node instanceof ButtonNode;
}
