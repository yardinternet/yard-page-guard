import {
	$getRoot,
	$getSelection,
	$insertNodes,
	$isRangeSelection,
	$setSelection,
	createEditor,
	FORMAT_TEXT_COMMAND,
} from 'lexical';
import { HeadingNode, QuoteNode, registerRichText } from '@lexical/rich-text';
import {
	INSERT_ORDERED_LIST_COMMAND,
	INSERT_UNORDERED_LIST_COMMAND,
	ListItemNode,
	ListNode,
	registerList,
} from '@lexical/list';
import { LinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';

const THEME = {
	paragraph: 'ypg-lex-p',
	link: 'ypg-lex-link',
	text: {
		bold: 'ypg-lex-bold',
		italic: 'ypg-lex-italic',
		underline: 'ypg-lex-underline',
	},
	list: {
		ul: 'ypg-lex-ul',
		ol: 'ypg-lex-ol',
		listitem: 'ypg-lex-li',
	},
};

function makeButton(label, title, onClick, extraClass = '') {
	const btn = document.createElement('button');
	btn.type = 'button';
	btn.className = `ypg-lex-btn${extraClass ? ` ${extraClass}` : ''}`;
	btn.title = title;
	btn.innerHTML = label;
	// Prevent toolbar buttons from stealing focus so commands act on the editor selection.
	btn.addEventListener('mousedown', (e) => e.preventDefault());
	btn.addEventListener('click', onClick);
	return btn;
}

function buildLinkPopover(editor) {
	const popover = document.createElement('div');
	popover.className = 'ypg-lex-link-popover';
	popover.hidden = true;
	popover.setAttribute('role', 'dialog');
	popover.setAttribute('aria-label', 'Link invoegen');

	const input = document.createElement('input');
	input.type = 'url';
	input.className = 'ypg-lex-link-input';
	input.placeholder = 'https://…';

	let savedSelection = null;

	const close = () => {
		popover.hidden = true;
		input.value = '';
		savedSelection = null;
	};

	const submit = () => {
		const url = input.value.trim();
		const sel = savedSelection;
		close();
		if (!url || !sel) return;
		editor.update(() => {
			$setSelection(sel.clone());
		});
		editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
	};

	const apply = makeButton('OK', 'Toepassen', submit);
	const cancel = makeButton(
		'Annuleren',
		'Annuleren',
		close,
		'ypg-lex-btn--ghost'
	);

	input.addEventListener('keydown', (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			submit();
		} else if (e.key === 'Escape') {
			e.preventDefault();
			close();
		}
	});

	popover.append(input, apply, cancel);

	return {
		element: popover,
		open(selection) {
			savedSelection = selection;
			popover.hidden = false;
			input.focus();
		},
		close,
	};
}

function buildToolbar(editor, variables, linkPopover) {
	const toolbar = document.createElement('div');
	toolbar.className = 'ypg-lex-toolbar';
	toolbar.setAttribute('role', 'toolbar');

	toolbar.append(
		makeButton('<strong>B</strong>', 'Vet (Ctrl+B)', () =>
			editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
		),
		makeButton('<em>I</em>', 'Cursief (Ctrl+I)', () =>
			editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
		),
		makeButton('<u>U</u>', 'Onderlijnd (Ctrl+U)', () =>
			editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')
		),
		makeButton('↗', 'Link invoegen', () => {
			let cloned = null;
			editor.getEditorState().read(() => {
				const sel = $getSelection();
				if ($isRangeSelection(sel)) cloned = sel.clone();
			});
			if (cloned) linkPopover.open(cloned);
		}),
		makeButton('•', 'Ongeordende lijst', () =>
			editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
		),
		makeButton('1.', 'Geordende lijst', () =>
			editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
		)
	);

	if (variables.length > 0) {
		const sep = document.createElement('span');
		sep.className = 'ypg-lex-sep';
		sep.setAttribute('aria-hidden', 'true');
		toolbar.append(sep);

		variables.forEach((v) => {
			toolbar.append(
				makeButton(`{${v}}`, `Voeg variabele {${v}} in`, () => {
					editor.update(() => {
						const selection = $getSelection();
						if ($isRangeSelection(selection)) {
							selection.insertText(`{${v}}`);
						}
					});
				})
			);
		});
	}

	return toolbar;
}

function loadInitialHtml(editor, html) {
	if (!html.trim()) return;

	editor.update(
		() => {
			const dom = new DOMParser().parseFromString(html, 'text/html');
			const nodes = $generateNodesFromDOM(editor, dom);
			const root = $getRoot();
			root.clear();
			root.select();
			$insertNodes(nodes);
		},
		{ tag: 'history-merge' }
	);
}

export function mountLexical(wrapper) {
	const textarea = wrapper.querySelector('textarea');
	if (!textarea || wrapper.dataset.ypgLexicalMounted === 'true') return;
	wrapper.dataset.ypgLexicalMounted = 'true';

	const initialHtml = textarea.value;
	const variables = (wrapper.dataset.variables || '')
		.split(',')
		.map((v) => v.trim())
		.filter(Boolean);

	const editable = document.createElement('div');
	editable.className = 'ypg-lex-editable';
	editable.contentEditable = 'true';
	editable.spellcheck = true;
	editable.setAttribute('role', 'textbox');
	editable.setAttribute('aria-multiline', 'true');

	const editor = createEditor({
		namespace: 'ypg',
		nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode],
		theme: THEME,
		onError: (e) => {
			// eslint-disable-next-line no-console -- surface editor failures during integration
			console.error('[ypg-lexical]', e);
		},
	});

	editor.setRootElement(editable);
	registerRichText(editor);
	registerList(editor);

	const linkPopover = buildLinkPopover(editor);
	const toolbar = buildToolbar(editor, variables, linkPopover);

	textarea.hidden = true;
	wrapper.insertBefore(toolbar, textarea);
	wrapper.insertBefore(linkPopover.element, textarea);
	wrapper.insertBefore(editable, textarea);

	loadInitialHtml(editor, initialHtml);

	editor.registerUpdateListener(({ editorState }) => {
		editorState.read(() => {
			textarea.value = $generateHtmlFromNodes(editor, null);
		});
	});
}

export function mountAllLexical(root = document) {
	root.querySelectorAll('[data-ypg-lexical]').forEach(mountLexical);
}
