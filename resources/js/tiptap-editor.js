import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { ButtonMark } from './button-mark.js';

function makeButton(label, title, onClick, { extraClass = '', isActive } = {}) {
	const btn = document.createElement('button');
	btn.type = 'button';
	btn.className = `ypg-rte-btn${extraClass ? ` ${extraClass}` : ''}`;
	btn.title = title;
	btn.innerHTML = label;
	// Prevent toolbar buttons from stealing focus so commands act on the editor selection.
	btn.addEventListener('mousedown', (e) => e.preventDefault());
	btn.addEventListener('click', onClick);
	return { element: btn, isActive };
}

function buildUrlPopover(editor) {
	const popover = document.createElement('div');
	popover.className = 'ypg-rte-link-popover';
	popover.hidden = true;
	popover.setAttribute('role', 'dialog');

	const input = document.createElement('input');
	input.type = 'url';
	input.className = 'ypg-rte-link-input';

	let savedRange = null;
	let mode = 'link';

	const close = () => {
		popover.hidden = true;
		input.value = '';
		savedRange = null;
	};

	const applyLink = (from, to, url) => {
		if (from === to) {
			// Cursor sits inside an existing link — retarget it in place.
			if (editor.isActive('link')) {
				editor
					.chain()
					.focus()
					.extendMarkRange('link')
					.setLink({ href: url })
					.run();
				return;
			}

			// Nothing was selected — drop the URL in as its own linked text,
			// otherwise an empty link is unreachable in the output.
			editor
				.chain()
				.focus()
				.insertContentAt(from, url)
				.setTextSelection({ from, to: from + url.length })
				.unsetMark('ypgButton')
				.setLink({ href: url })
				.run();
			return;
		}

		editor
			.chain()
			.focus()
			.setTextSelection({ from, to })
			.unsetMark('ypgButton')
			.extendMarkRange('link')
			.setLink({ href: url })
			.run();
	};

	const applyButton = (from, to, url) => {
		if (from === to) {
			// Cursor sits inside an existing button — update its URL in place
			// instead of inserting a second button next to it.
			if (editor.isActive('ypgButton')) {
				editor
					.chain()
					.focus()
					.extendMarkRange('ypgButton')
					.setButton({ href: url })
					.run();
				return;
			}

			const label = 'Knop';
			editor
				.chain()
				.focus()
				.insertContentAt(from, label)
				.setTextSelection({ from, to: from + label.length })
				.setButton({ href: url })
				.run();
			return;
		}

		editor
			.chain()
			.focus()
			.setTextSelection({ from, to })
			.setButton({ href: url })
			.run();
	};

	const submit = () => {
		const url = input.value.trim();
		const range = savedRange;
		const submitMode = mode;
		close();
		if (!url || !range) return;

		if (submitMode === 'button') {
			applyButton(range.from, range.to, url);
		} else {
			applyLink(range.from, range.to, url);
		}
	};

	const apply = makeButton('OK', 'Toepassen', submit);
	const cancel = makeButton('Annuleren', 'Annuleren', close, {
		extraClass: 'ypg-rte-btn--ghost',
	});

	input.addEventListener('keydown', (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			submit();
		} else if (e.key === 'Escape') {
			e.preventDefault();
			close();
		}
	});

	popover.append(input, apply.element, cancel.element);

	return {
		element: popover,
		open(nextMode) {
			mode = nextMode;
			// ProseMirror keeps the selection when focus moves to the input, but
			// capture the range so the command can restore it explicitly.
			const { from, to } = editor.state.selection;
			savedRange = { from, to };
			// Seed the field with the current target so an existing button/link
			// shows its URL and can be edited in place instead of duplicated.
			const markName = nextMode === 'button' ? 'ypgButton' : 'link';
			input.value = editor.getAttributes(markName).href || '';
			popover.setAttribute(
				'aria-label',
				nextMode === 'button' ? 'Knop invoegen' : 'Link invoegen'
			);
			input.placeholder =
				nextMode === 'button' ? 'URL voor knop' : 'https://…';
			popover.hidden = false;
			input.focus();
			input.select();
		},
		close,
	};
}

function buildToolbar(editor, variables, features, urlPopover) {
	const toolbar = document.createElement('div');
	toolbar.className = 'ypg-rte-toolbar';
	toolbar.setAttribute('role', 'toolbar');

	const controls = [
		makeButton(
			'<strong>B</strong>',
			'Vet (Ctrl+B)',
			() => editor.chain().focus().toggleBold().run(),
			{ isActive: () => editor.isActive('bold') }
		),
		makeButton(
			'<em>I</em>',
			'Cursief (Ctrl+I)',
			() => editor.chain().focus().toggleItalic().run(),
			{ isActive: () => editor.isActive('italic') }
		),
		makeButton(
			'<u>U</u>',
			'Onderlijnd (Ctrl+U)',
			() => editor.chain().focus().toggleUnderline().run(),
			{ isActive: () => editor.isActive('underline') }
		),
		makeButton('↗', 'Link invoegen', () => urlPopover.open('link'), {
			isActive: () => editor.isActive('link'),
		}),
		makeButton(
			'•',
			'Ongeordende lijst',
			() => editor.chain().focus().toggleBulletList().run(),
			{ isActive: () => editor.isActive('bulletList') }
		),
		makeButton(
			'1.',
			'Geordende lijst',
			() => editor.chain().focus().toggleOrderedList().run(),
			{ isActive: () => editor.isActive('orderedList') }
		),
	];

	if (features.includes('button')) {
		controls.push(
			makeButton(
				'▢ Knop',
				'Knop invoegen',
				() => urlPopover.open('button'),
				{
					isActive: () => editor.isActive('ypgButton'),
				}
			)
		);
	}

	controls.forEach((control) => toolbar.append(control.element));

	if (variables.length > 0) {
		const sep = document.createElement('span');
		sep.className = 'ypg-rte-sep';
		sep.setAttribute('aria-hidden', 'true');
		toolbar.append(sep);

		variables.forEach((v) => {
			const chip = makeButton(`{${v}}`, `Voeg variabele {${v}} in`, () =>
				editor.chain().focus().insertContent(`{${v}}`).run()
			);
			toolbar.append(chip.element);
		});
	}

	// Reflect the active formatting at the cursor on the toolbar buttons.
	const refresh = () => {
		controls.forEach(({ element, isActive }) => {
			if (isActive) element.classList.toggle('is-active', isActive());
		});
	};
	editor.on('transaction', refresh);
	refresh();

	return toolbar;
}

export function mountTiptap(wrapper) {
	const textarea = wrapper.querySelector('textarea');
	if (!textarea || wrapper.dataset.ypgEditorMounted === 'true') return;
	wrapper.dataset.ypgEditorMounted = 'true';

	const initialHtml = textarea.value;
	const variables = (wrapper.dataset.variables || '')
		.split(',')
		.map((v) => v.trim())
		.filter(Boolean);
	const features = (wrapper.dataset.features || '')
		.split(',')
		.map((v) => v.trim())
		.filter(Boolean);

	const editable = document.createElement('div');
	editable.className = 'ypg-rte-editor';

	const editor = new Editor({
		element: editable,
		content: initialHtml,
		editorProps: {
			attributes: {
				class: 'ypg-rte-content',
				role: 'textbox',
				'aria-multiline': 'true',
			},
		},
		extensions: [
			StarterKit.configure({
				// Trim the schema to the formatting the email/footer fields offer,
				// so pasted content can't introduce tags the toolbar can't manage.
				heading: false,
				blockquote: false,
				codeBlock: false,
				code: false,
				strike: false,
				horizontalRule: false,
				link: {
					openOnClick: false,
					autolink: false,
					linkOnPaste: false,
					defaultProtocol: 'https',
					// Keep the output a plain `<a href>`; WordPress/email clients add
					// their own handling and the legacy content carries no rel/target.
					HTMLAttributes: { rel: null, target: null, class: null },
				},
			}),
			ButtonMark,
		],
		onUpdate: ({ editor: instance }) => {
			textarea.value = instance.isEmpty ? '' : instance.getHTML();
		},
	});

	const urlPopover = buildUrlPopover(editor);
	const toolbar = buildToolbar(editor, variables, features, urlPopover);

	textarea.hidden = true;
	wrapper.insertBefore(toolbar, textarea);
	wrapper.insertBefore(urlPopover.element, textarea);
	wrapper.insertBefore(editable, textarea);

	// Seed the textarea so a submit without edits still saves normalised markup.
	textarea.value = editor.isEmpty ? '' : editor.getHTML();
}

export function mountAllEditors(root = document) {
	root.querySelectorAll('[data-ypg-editor]').forEach(mountTiptap);
}
