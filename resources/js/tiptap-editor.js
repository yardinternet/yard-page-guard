import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { TextSelection } from '@tiptap/pm/state';
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

	let mode = 'link';

	const close = () => {
		popover.hidden = true;
		input.value = '';
	};

	// Insert fresh text that already carries the mark, so an empty selection
	// still produces a reachable link/button without computing positions.
	const insertMarkedText = (text, markName, href) =>
		editor
			.chain()
			.focus()
			.insertContent({
				type: 'text',
				text,
				marks: [{ type: markName, attrs: { href } }],
			})
			.run();

	const applyLink = (url) => {
		if (editor.state.selection.empty) {
			// Cursor inside a link → retarget it; otherwise drop the URL in as
			// its own linked text.
			if (editor.isActive('link')) {
				editor
					.chain()
					.focus()
					.extendMarkRange('link')
					.setLink({ href: url })
					.run();
			} else {
				insertMarkedText(url, 'link', url);
			}
			return;
		}

		editor
			.chain()
			.focus()
			.unsetMark('ypgButton')
			.extendMarkRange('link')
			.setLink({ href: url })
			.run();
	};

	const applyButton = (url) => {
		if (editor.state.selection.empty) {
			// Cursor inside a button → update its URL in place; otherwise insert
			// a labelled button at the cursor.
			if (editor.isActive('ypgButton')) {
				editor
					.chain()
					.focus()
					.extendMarkRange('ypgButton')
					.setButton({ href: url })
					.run();
			} else {
				insertMarkedText('Knop', 'ypgButton', url);
			}
			return;
		}

		editor.chain().focus().setButton({ href: url }).run();
	};

	const submit = () => {
		const url = input.value.trim();
		const submitMode = mode;
		close();
		if (!url) return;

		if (submitMode === 'button') {
			applyButton(url);
		} else {
			applyLink(url);
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
			// Commands read the live editor selection at submit time. ProseMirror
			// keeps that selection valid even while focus sits in this input, so
			// there is no position to capture or restore by hand.
			const markName = nextMode === 'button' ? 'ypgButton' : 'link';
			// Seed the field with the current target so an existing button/link
			// shows its URL and can be edited in place instead of duplicated.
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
	const parseList = (value) =>
		(value || '')
			.split(',')
			.map((item) => item.trim())
			.filter(Boolean);
	const variables = parseList(wrapper.dataset.variables);
	const features = parseList(wrapper.dataset.features);

	const editable = document.createElement('div');
	editable.className = 'ypg-rte-editor';

	// Attach the editor node to the document *before* constructing the editor.
	// ProseMirror tracks its selection against the mount node; building the view
	// on a detached node and reparenting it afterwards desyncs that tracking, and
	// the next keypress throws "Position N out of range" while the editor freezes.
	textarea.hidden = true;
	wrapper.insertBefore(editable, textarea);

	const editor = new Editor({
		element: editable,
		content: initialHtml,
		editorProps: {
			attributes: {
				class: 'ypg-rte-content notranslate',
				role: 'textbox',
				'aria-multiline': 'true',
				// Opt out of tools that rewrite the contenteditable DOM behind
				// ProseMirror's back — Grammarly, Google Translate, autofill. Their
				// edits desync the rendered DOM from the editor state, leaving the
				// stored selection pointing past the end of the document; the next
				// keypress then throws "Position N out of range" and freezes.
				translate: 'no',
				autocomplete: 'off',
				autocorrect: 'off',
				autocapitalize: 'off',
				'data-gramm': 'false',
				'data-gramm_editor': 'false',
				'data-enable-grammarly': 'false',
			},
			// Safety net: should the selection still drift out of range, clamp it
			// back into the document before the keypress runs a command, turning a
			// fatal RangeError into a harmless no-op. In a healthy editor the
			// guard never fires.
			handleKeyDown: (view) => {
				const { selection, doc } = view.state;
				const size = doc.content.size;
				if (selection.from > size || selection.to > size) {
					const $pos = doc.resolve(Math.min(selection.from, size));
					view.dispatch(
						view.state.tr.setSelection(TextSelection.near($pos))
					);
				}
				return false;
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

	// Keep the visual order toolbar → popover → editor by inserting both above
	// the already-mounted editable element.
	wrapper.insertBefore(toolbar, editable);
	wrapper.insertBefore(urlPopover.element, editable);

	// Seed the textarea so a submit without edits still saves normalised markup.
	textarea.value = editor.isEmpty ? '' : editor.getHTML();
}

export function mountAllEditors(root = document) {
	root.querySelectorAll('[data-ypg-editor]').forEach(mountTiptap);
}
