/**
 * Rich editing for the settings-page email/footer fields, built on the
 * TinyMCE instance WordPress already ships (`wp.editor` API) rather than a
 * bundled editor. Each `[data-ypg-editor]` wrapper holds a <textarea> that we
 * upgrade in place; the textarea stays the source of truth for the surrounding
 * `options.php` form submit.
 *
 * Two plugin-specific affordances live on the toolbar:
 *  - variable chips (from `data-variables`) that insert `{name}` / `{item_list}`
 *    placeholders at the cursor;
 *  - a "Knop" button (when `data-features` includes `button`) that wraps the
 *    selection in `<a class="ypg-button">`, rendered as a real CTA inside the
 *    editor via `content_style` so it matches the frontend instead of the old
 *    bold-text-with-a-link hack.
 */

const BUTTON_CLASS = 'ypg-button';

// Styles injected into the TinyMCE iframe so the CTA button and links read the
// same as they do on the public review page. Kept in sync with the frontend
// `.ypg-button` rule in resources/css/frontend.css.
const CONTENT_STYLE = `
	body {
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
		font-size: 14px;
		line-height: 1.55;
		color: #1d2327;
		margin: 12px;
	}
	a { color: #2271b1; }
	a.${BUTTON_CLASS} {
		display: inline-block;
		padding: 10px 28px;
		border-radius: 10px;
		background-color: #294587;
		color: #fff;
		text-decoration: none;
		font-weight: 400;
	}
`;

// Schema restriction mirroring the old editor's trimmed StarterKit: only the
// formatting the toolbar exposes survives, so pasted content can't smuggle in
// headings, tables or inline styles the plugin doesn't manage.
const VALID_ELEMENTS = 'p,br,strong/b,em/i,u,a[href|class|target|rel],ul,ol,li';

const parseList = (value) =>
	(value || '')
		.split(',')
		.map((item) => item.trim())
		.filter(Boolean);

const escapeHtml = (value) =>
	value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');

/**
 * Register the plugin's custom toolbar buttons on a TinyMCE instance and build
 * the toolbar string that references them. TinyMCE 4 (bundled with WordPress)
 * uses `editor.addButton` + `editor.windowManager`, not the 5+ `ui.registry`.
 */
function setupEditor(editor, variables, features) {
	// Keep the underlying textarea current so a form submit without an explicit
	// blur still posts the latest content (mirrors the old onUpdate sync).
	editor.on('change keyup input undo redo SetContent', () => editor.save());

	if (features.includes('button')) {
		editor.addButton('ypgbutton', {
			text: 'Knop',
			tooltip: 'Knop invoegen',
			onclick: () => openButtonDialog(editor),
		});
	}

	variables.forEach((name) => {
		editor.addButton(`ypgvar_${name}`, {
			text: `{${name}}`,
			tooltip: `Voeg variabele {${name}} in`,
			onclick: () => editor.insertContent(`{${name}}`),
		});
	});
}

/**
 * Prompt for a URL and wrap the current selection (or a default label) in a
 * `ypg-button` anchor. Reuses the existing button's href when the cursor sits
 * inside one, so editing retargets in place instead of nesting.
 */
function openButtonDialog(editor) {
	const existing = editor.dom.getParent(
		editor.selection.getNode(),
		`a.${BUTTON_CLASS}`
	);

	editor.windowManager.open({
		title: 'Knop invoegen',
		body: [
			{
				type: 'textbox',
				name: 'href',
				label: 'URL',
				value: existing ? existing.getAttribute('href') || '' : '',
			},
		],
		onsubmit: (event) => {
			const href = (event.data.href || '').trim();
			if (!href) return;

			if (existing) {
				editor.dom.setAttrib(existing, 'href', href);
				return;
			}

			const label =
				editor.selection.getContent({ format: 'text' }) || 'Knop';
			editor.insertContent(
				`<a class="${BUTTON_CLASS}" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`
			);
		},
	});
}

function buildToolbar(variables, features) {
	const groups = ['bold italic underline', 'bullist numlist', 'link'];

	if (features.includes('button')) {
		groups.push('ypgbutton');
	}

	if (variables.length > 0) {
		groups.push(variables.map((name) => `ypgvar_${name}`).join(' '));
	}

	return groups.join(' | ');
}

export function mountEditor(wrapper) {
	const textarea = wrapper.querySelector('textarea');
	if (!textarea || wrapper.dataset.ypgEditorMounted === 'true') return;
	if (!window.wp || !window.wp.editor) return;
	wrapper.dataset.ypgEditorMounted = 'true';

	const variables = parseList(wrapper.dataset.variables);
	const features = parseList(wrapper.dataset.features);

	window.wp.editor.initialize(textarea.id, {
		mediaButtons: false,
		quicktags: false,
		tinymce: {
			menubar: false,
			statusbar: false,
			branding: false,
			toolbar1: buildToolbar(variables, features),
			plugins: 'lists link',
			valid_elements: VALID_ELEMENTS,
			content_style: CONTENT_STYLE,
			setup: (editor) => setupEditor(editor, variables, features),
		},
	});
}

export function mountAllEditors(root = document) {
	root.querySelectorAll('[data-ypg-editor]').forEach(mountEditor);
}
