//#region resources/js/editor-sidebar/config/constants.js
var SIDEBAR_NAME = "ypg-editor-sidebar";
var SIDEBAR_ICON = "shield";
/**
* Mirrored from Yard\PageGuard\Meta\MetaFields.
*/
var DATE_TYPE_DEFAULT = "default";
var DATE_TYPE_CUSTOM = "custom";
var OWNER_TYPES = ["user", "external"];
//#endregion
//#region resources/js/editor-sidebar/components/sidebar-toggle-button.jsx
/**
* Internal dependencies
*/
/**
* WordPress dependencies
*/
var Button$1 = wp.components.Button;
var useDispatch$1 = wp.data.useDispatch;
var __$7 = wp.i18n.__;
var SidebarToggleButton = ({ className }) => {
	const { openGeneralSidebar } = useDispatch$1("core/edit-post");
	return /* @__PURE__ */ wp.element.createElement(Button$1, {
		className: `ypg-editor-sidebar-toggle-button ${className}`,
		variant: "secondary",
		icon: SIDEBAR_ICON,
		onClick: () => openGeneralSidebar(`ypg-editor-sidebar/${SIDEBAR_NAME}`)
	}, __$7("Inhoudscontrole openen", "yard-page-guard"));
};
//#endregion
//#region resources/js/editor-sidebar/components/section.jsx
/**
* WordPress dependencies
*/
var VStack$1 = wp.components.__experimentalVStack;
var Heading = wp.components.__experimentalHeading;
var Section = ({ title, children }) => /* @__PURE__ */ wp.element.createElement(VStack$1, {
	className: "ypg-section",
	spacing: 3
}, title && /* @__PURE__ */ wp.element.createElement(Heading, {
	className: "ypg-section-heading",
	level: 3,
	size: 13,
	weight: 500
}, title), children);
//#endregion
//#region resources/js/editor-sidebar/api/endpoints.js
var NAMESPACE = "/yard/page-guard/v2";
var CONTENT_OWNERS = `${NAMESPACE}/editor/content-owners`;
var DEFAULTS = `${NAMESPACE}/editor/defaults`;
var reviewStatus = (postId) => `${NAMESPACE}/editor/review-status/${postId}`;
var markReviewed$1 = (postId) => `${NAMESPACE}/editor/mark-reviewed/${postId}`;
//#endregion
//#region resources/js/editor-sidebar/api/index.js
/**
* Internal dependencies
*/
/**
* WordPress dependencies
*/
var apiFetch = wp.apiFetch;
var cache = /* @__PURE__ */ new Map();
var fetchOnce = (path) => {
	if (!cache.has(path)) cache.set(path, apiFetch({ path }).catch((error) => {
		cache.delete(path);
		throw error;
	}));
	return cache.get(path);
};
var fetchContentOwners = () => fetchOnce(CONTENT_OWNERS);
var fetchDefaults = () => fetchOnce(DEFAULTS);
var fetchReviewStatus = (postId) => apiFetch({ path: reviewStatus(postId) });
var markReviewed = (postId) => apiFetch({
	path: markReviewed$1(postId),
	method: "POST"
});
//#endregion
//#region resources/js/editor-sidebar/hooks/use-async-data.js
/**
* WordPress dependencies
*/
var useEffect = wp.element.useEffect;
var useState$2 = wp.element.useState;
/**
* Resolves fetcher into render state, ignoring stale results after unmount.
*
* @param {Function} fetcher Returns a promise with the data. Must be a stable reference.
* @return {{data: *, isLoading: boolean, error: ?Object}} Request state.
*/
var useAsyncData = (fetcher) => {
	const [state, setState] = useState$2({
		data: null,
		isLoading: true,
		error: null
	});
	useEffect(() => {
		let isCurrent = true;
		setState({
			data: null,
			isLoading: true,
			error: null
		});
		fetcher().then((data) => {
			if (isCurrent) setState({
				data,
				isLoading: false,
				error: null
			});
		}).catch((error) => {
			if (isCurrent) setState({
				data: null,
				isLoading: false,
				error
			});
		});
		return () => {
			isCurrent = false;
		};
	}, [fetcher]);
	return state;
};
//#endregion
//#region resources/js/editor-sidebar/hooks/use-content-owners.js
/**
* Internal dependencies
*/
var EMPTY_OWNERS = [];
/**
* @return {{owners: Array<Object>, isLoading: boolean, error: ?Object}} Assignable content owners.
*/
var useContentOwners = () => {
	const { data, isLoading, error } = useAsyncData(fetchContentOwners);
	return {
		owners: Array.isArray(data) ? data : EMPTY_OWNERS,
		isLoading,
		error
	};
};
//#endregion
//#region resources/js/editor-sidebar/hooks/use-post-meta.js
/**
* WordPress dependencies
*/
var useEntityProp = wp.coreData.useEntityProp;
var useSelect$2 = wp.data.useSelect;
var editorStore$2 = wp.editor.store;
/**
* Reads/writes current post's meta, writes merge into existing meta.
*
* @return {[Object, Function]} The post meta and a setter taking partial meta.
*/
var usePostMeta = () => {
	const [meta, setMeta] = useEntityProp("postType", useSelect$2((select) => select(editorStore$2).getCurrentPostType(), []), "meta");
	const updateMeta = (changes) => setMeta({
		...meta,
		...changes
	});
	return [meta ?? {}, updateMeta];
};
//#endregion
//#region resources/js/editor-sidebar/config/meta-keys.js
/**
* Post meta keys, mirrored from Yard\PageGuard\Enums\PostMeta.
*/
var META_CONTENT_OWNER_ID = "ypg_post_content_owner_id";
var META_CONTENT_OWNER_TYPE = "ypg_post_content_owner_type";
var META_REVIEW_DATE_TYPE = "ypg_review_date_type";
var META_REVIEW_DATE = "ypg_review_date";
var META_REMINDER_TIME_TYPE = "ypg_reminder_time_type";
var META_REMINDER_TIME_PERIOD = "ypg_reminder_time_period";
var META_REMINDER_TIME_UNIT = "ypg_reminder_time_unit";
//#endregion
//#region resources/js/editor-sidebar/utils/owner-value.js
/**
* Internal dependencies
*/
/**
* Composite id+type value for the owner select; split back into separate
* meta fields before storage. Kept in sync with MetaFields::encodeOwnerValue()
* / ::decodeOwnerValue().
*/
var SEPARATOR = ":";
var NONE = {
	id: 0,
	type: ""
};
/**
* @param {number} id   Owner id.
* @param {string} type Owner type: 'user' or 'external'.
* @return {string} Composite select value, empty when there is no owner.
*/
var encodeOwnerValue = (id, type) => {
	const numericId = Number.parseInt(id, 10);
	if (!numericId || numericId < 1 || !OWNER_TYPES.includes(type)) return "";
	return `${type}${SEPARATOR}${numericId}`;
};
/**
* @param {string} value Composite select value.
* @return {{id: number, type: string}} Owner id and type, zeroed when empty.
*/
var decodeOwnerValue = (value) => {
	const [type, id] = String(value ?? "").split(SEPARATOR);
	const numericId = Number.parseInt(id, 10);
	if (!numericId || numericId < 1 || !OWNER_TYPES.includes(type)) return NONE;
	return {
		id: numericId,
		type
	};
};
//#endregion
//#region resources/js/editor-sidebar/sections/content-owner-section.jsx
/**
* Internal dependencies
*/
/**
* WordPress dependencies
*/
var Notice$1 = wp.components.Notice;
var SelectControl$1 = wp.components.SelectControl;
var Spinner$3 = wp.components.Spinner;
var __$6 = wp.i18n.__;
var ContentOwnerSection = () => {
	const { owners, isLoading, error } = useContentOwners();
	const [meta, updateMeta] = usePostMeta();
	const value = encodeOwnerValue(meta[META_CONTENT_OWNER_ID], meta[META_CONTENT_OWNER_TYPE]);
	const onChange = (nextValue) => {
		const { id, type } = decodeOwnerValue(nextValue);
		if (!id) {
			updateMeta({
				[META_CONTENT_OWNER_ID]: 0,
				[META_CONTENT_OWNER_TYPE]: "",
				[META_REVIEW_DATE_TYPE]: DATE_TYPE_DEFAULT,
				[META_REVIEW_DATE]: "",
				[META_REMINDER_TIME_TYPE]: DATE_TYPE_DEFAULT,
				[META_REMINDER_TIME_PERIOD]: 0,
				[META_REMINDER_TIME_UNIT]: ""
			});
			return;
		}
		updateMeta({
			[META_CONTENT_OWNER_ID]: id,
			[META_CONTENT_OWNER_TYPE]: type
		});
	};
	const options = [{
		label: __$6("Geen inhoudseigenaar", "yard-page-guard"),
		value: ""
	}, ...owners.map((owner) => ({
		label: owner.label,
		value: owner.value
	}))];
	return /* @__PURE__ */ wp.element.createElement(Section, null, isLoading && /* @__PURE__ */ wp.element.createElement(Spinner$3, null), error && /* @__PURE__ */ wp.element.createElement(Notice$1, {
		status: "error",
		isDismissible: false
	}, __$6("De inhoudseigenaren konden niet worden geladen.", "yard-page-guard")), !isLoading && !error && /* @__PURE__ */ wp.element.createElement(SelectControl$1, {
		__nextHasNoMarginBottom: true,
		label: __$6("Inhoudseigenaar", "yard-page-guard"),
		help: __$6("Inhoudseigenaren krijgen een herinnering op de ingestelde datum om de inhoud van deze pagina te verifiëren.", "yard-page-guard"),
		value,
		options,
		onChange
	}));
};
//#endregion
//#region resources/js/editor-sidebar/hooks/use-defaults.js
/**
* Internal dependencies
*/
var useDefaults = () => {
	const { data, isLoading, error } = useAsyncData(fetchDefaults);
	return {
		defaults: data,
		isLoading,
		error
	};
};
//#endregion
//#region resources/js/editor-sidebar/utils/date.js
/**
* WordPress dependencies
*/
var dateI18n = wp.date.dateI18n;
var getSettings = wp.date.getSettings;
/**
* Local getters on purpose: `toISOString()` shifts to UTC, off by a day part of every day.
*
* @param {Date|string} value
* @return {string} Y-m-d, or an empty string when the value is not a date.
*/
var toYmd = (value) => {
	const date = value instanceof Date ? value : new Date(value);
	if (Number.isNaN(date.getTime())) return "";
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${date.getFullYear()}-${month}-${day}`;
};
/**
* @return {string} Today in Y-m-d
*/
var todayYmd = () => toYmd(/* @__PURE__ */ new Date());
/**
* @param {string} ymd A Y-m-d date.
* @return {string} The date in the site's display format, or an empty string.
*/
var formatSiteDate = (ymd) => ymd ? dateI18n(getSettings().formats.date, ymd) : "";
//#endregion
//#region resources/js/editor-sidebar/utils/default-label.js
/**
* WordPress dependencies
*/
var __$5 = wp.i18n.__;
var sprintf = wp.i18n.sprintf;
/**
* Label for a "volgens de standaardinstelling" radio option.
*
* @param {?Object} periodDefaults `review` or `reminder` from the defaults endpoint.
* @return {string} Translated label, falling back to bare text while loading.
*/
var defaultSettingLabel = (periodDefaults) => {
	if (!periodDefaults?.label) return __$5("Volgens de standaardinstelling", "yard-page-guard");
	return sprintf(__$5("Volgens de standaardinstelling (%s)", "yard-page-guard"), periodDefaults.label);
};
//#endregion
//#region resources/js/editor-sidebar/sections/review-date-section.jsx
/**
* Internal dependencies
*/
/**
* WordPress dependencies
*/
var DatePicker = wp.components.DatePicker;
var RadioControl$1 = wp.components.RadioControl;
var Spinner$2 = wp.components.Spinner;
var __$4 = wp.i18n.__;
var ReviewDateSection = () => {
	const { defaults, isLoading } = useDefaults();
	const [meta, updateMeta] = usePostMeta();
	const type = meta["ypg_review_date_type"] || "default";
	const date = meta["ypg_review_date"] || "";
	const onChangeType = (nextType) => {
		updateMeta("custom" === nextType ? { [META_REVIEW_DATE_TYPE]: nextType } : {
			[META_REVIEW_DATE_TYPE]: nextType,
			[META_REVIEW_DATE]: ""
		});
	};
	const defaultLabel = defaultSettingLabel(defaults?.review);
	return /* @__PURE__ */ wp.element.createElement(Section, null, isLoading && /* @__PURE__ */ wp.element.createElement(Spinner$2, null), /* @__PURE__ */ wp.element.createElement(RadioControl$1, {
		label: __$4("Herzieningsdatum", "yard-page-guard"),
		help: __$4("Datum waarop de inhoudseigenaar de eerste controlemail ontvangt.", "yard-page-guard"),
		selected: type,
		options: [{
			label: defaultLabel,
			value: DATE_TYPE_DEFAULT
		}, {
			label: __$4("Kies eenmalig een afwijkende datum", "yard-page-guard"),
			value: DATE_TYPE_CUSTOM
		}],
		onChange: onChangeType
	}), "custom" === type && /* @__PURE__ */ wp.element.createElement(DatePicker, {
		currentDate: date || defaults?.review?.date || null,
		onChange: (nextDate) => updateMeta({ ["ypg_review_date"]: toYmd(nextDate) }),
		isInvalidDate: (candidate) => toYmd(candidate) < todayYmd()
	}));
};
//#endregion
//#region resources/js/editor-sidebar/sections/reminder-period-section.jsx
/**
* Internal dependencies
*/
/**
* WordPress dependencies
*/
var RadioControl = wp.components.RadioControl;
var SelectControl = wp.components.SelectControl;
var Spinner$1 = wp.components.Spinner;
var HStack = wp.components.__experimentalHStack;
var NumberControl = wp.components.__experimentalNumberControl;
var __$3 = wp.i18n.__;
var UNIT_OPTIONS = [
	{
		label: __$3("Dagen", "yard-page-guard"),
		value: "days"
	},
	{
		label: __$3("Weken", "yard-page-guard"),
		value: "weeks"
	},
	{
		label: __$3("Maanden", "yard-page-guard"),
		value: "months"
	}
];
var ReminderPeriodSection = () => {
	const { defaults, isLoading } = useDefaults();
	const [meta, updateMeta] = usePostMeta();
	const type = meta["ypg_reminder_time_type"] || "default";
	const period = meta["ypg_reminder_time_period"] || 0;
	const unit = meta["ypg_reminder_time_unit"] || "";
	const onChangeType = (nextType) => {
		if ("custom" !== nextType) {
			updateMeta({
				[META_REMINDER_TIME_TYPE]: nextType,
				[META_REMINDER_TIME_PERIOD]: 0,
				[META_REMINDER_TIME_UNIT]: ""
			});
			return;
		}
		updateMeta({
			[META_REMINDER_TIME_TYPE]: nextType,
			[META_REMINDER_TIME_PERIOD]: period || defaults?.reminder?.period || 1,
			[META_REMINDER_TIME_UNIT]: unit || defaults?.reminder?.unit || "weeks"
		});
	};
	const defaultLabel = defaultSettingLabel(defaults?.reminder);
	return /* @__PURE__ */ wp.element.createElement(Section, null, isLoading && /* @__PURE__ */ wp.element.createElement(Spinner$1, null), /* @__PURE__ */ wp.element.createElement(RadioControl, {
		label: __$3("Herinneringsperiode", "yard-page-guard"),
		help: __$3("Periode waarna een herinnering volgt als de controle nog niet is afgerond.", "yard-page-guard"),
		selected: type,
		options: [{
			label: defaultLabel,
			value: DATE_TYPE_DEFAULT
		}, {
			label: __$3("Kies een afwijkende periode", "yard-page-guard"),
			value: DATE_TYPE_CUSTOM
		}],
		onChange: onChangeType
	}), "custom" === type && /* @__PURE__ */ wp.element.createElement(HStack, {
		alignment: "bottom",
		spacing: 2
	}, /* @__PURE__ */ wp.element.createElement(NumberControl, {
		__next40pxDefaultSize: true,
		label: __$3("Aantal", "yard-page-guard"),
		min: 1,
		step: 1,
		value: period,
		onChange: (nextValue) => updateMeta({ ["ypg_reminder_time_period"]: Number.parseInt(nextValue, 10) || 0 })
	}), /* @__PURE__ */ wp.element.createElement(SelectControl, {
		__next40pxDefaultSize: true,
		__nextHasNoMarginBottom: true,
		className: "ypg-reminder-unit-select",
		label: __$3("Eenheid", "yard-page-guard"),
		value: unit,
		options: UNIT_OPTIONS,
		onChange: (nextUnit) => updateMeta({ ["ypg_reminder_time_unit"]: nextUnit })
	})));
};
//#endregion
//#region resources/js/editor-sidebar/hooks/use-editor-post.js
/**
* WordPress dependencies
*/
var useSelect$1 = wp.data.useSelect;
var editorStore$1 = wp.editor.store;
/**
* Editor state needed to tell if writing straight to the DB is safe.
*
* @return {{postId: number, isNew: boolean, isDirty: boolean, isSaving: boolean}} Editor state.
*/
var useEditorPost = () => useSelect$1((select) => {
	const editor = select(editorStore$1);
	return {
		postId: editor.getCurrentPostId(),
		isNew: editor.isEditedPostNew(),
		isDirty: editor.isEditedPostDirty(),
		isSaving: editor.isSavingPost()
	};
}, []);
//#endregion
//#region resources/js/editor-sidebar/hooks/use-mark-reviewed.js
/**
* Internal dependencies
*/
/**
* WordPress dependencies
*/
var coreStore = wp.coreData.store;
var useDispatch = wp.data.useDispatch;
var useSelect = wp.data.useSelect;
var editorStore = wp.editor.store;
var useCallback$1 = wp.element.useCallback;
var useState$1 = wp.element.useState;
var __$2 = wp.i18n.__;
var IDLE = {
	isSaving: false,
	error: null,
	isSuccess: false
};
/**
* Posts the "reviewed" action and exposes its result for a notice.
*
* @param {?number}  postId
* @param {Function} onSuccess Called after a successful write, to refresh derived state.
* @return {{markReviewed: Function, isSaving: boolean, error: ?string, isSuccess: boolean}} Request state.
*/
var useMarkReviewed = (postId, onSuccess) => {
	const [state, setState] = useState$1(IDLE);
	const postType = useSelect((select) => select(editorStore).getCurrentPostType(), []);
	const { invalidateResolution } = useDispatch(coreStore);
	return {
		markReviewed: useCallback$1(async () => {
			if (!postId) return;
			setState({
				isSaving: true,
				error: null,
				isSuccess: false
			});
			try {
				await markReviewed(postId);
				invalidateResolution("getEntityRecord", [
					"postType",
					postType,
					postId
				]);
				setState({
					isSaving: false,
					error: null,
					isSuccess: true
				});
				onSuccess?.();
			} catch (error) {
				setState({
					isSaving: false,
					error: error?.message || __$2("De pagina kon niet als gecontroleerd worden gemarkeerd.", "yard-page-guard"),
					isSuccess: false
				});
			}
		}, [
			postId,
			postType,
			invalidateResolution,
			onSuccess
		]),
		...state
	};
};
//#endregion
//#region resources/js/editor-sidebar/hooks/use-next-review-date.js
/**
* Internal dependencies
*/
/**
* The review date as it will be stored, so the status updates while editing
* instead of after a save.
*
* An empty REVIEW_DATE means the user picked the site default and the backend
* still has to resolve it, so the endpoint's preview stands in until then.
*
* @return {string} Display formatted date, or an empty string while loading.
*/
var useNextReviewDate = () => {
	const [meta] = usePostMeta();
	const { defaults } = useDefaults();
	const date = meta["ypg_review_date"] || "";
	return date ? formatSiteDate(date) : defaults?.review?.formatted ?? "";
};
//#endregion
//#region resources/js/editor-sidebar/hooks/use-review-status.js
/**
* Internal dependencies
*/
/**
* WordPress dependencies
*/
var useCallback = wp.element.useCallback;
var useState = wp.element.useState;
/**
* Derived review state of a post
*
* @param {?number} postId Post to read, or a falsy value while the post is not persisted.
* @return {{status: ?Object, isLoading: boolean, error: ?Object, refresh: Function}} Request state.
*/
var useReviewStatus = (postId) => {
	const [token, setToken] = useState(0);
	const { data, isLoading, error } = useAsyncData(useCallback(() => postId ? fetchReviewStatus(postId) : Promise.resolve(null), [postId, token]));
	return {
		status: data,
		isLoading,
		error,
		refresh: useCallback(() => setToken((value) => value + 1), [])
	};
};
//#endregion
//#region resources/js/editor-sidebar/sections/status-section.jsx
/**
* Internal dependencies
*/
/**
* WordPress dependencies
*/
var Button = wp.components.Button;
var Notice = wp.components.Notice;
var Spinner = wp.components.Spinner;
var Text = wp.components.__experimentalText;
var VStack = wp.components.__experimentalVStack;
var __$1 = wp.i18n.__;
var StatusSection = () => {
	const { postId, isNew, isDirty, isSaving } = useEditorPost();
	const { status, isLoading, refresh } = useReviewStatus(isNew ? null : postId);
	const { markReviewed, isSaving: isMarking, error, isSuccess } = useMarkReviewed(postId, refresh);
	const isBlocked = isNew || isDirty || isSaving;
	const lastReviewed = status?.lastReviewDate?.formatted;
	const nextReview = useNextReviewDate();
	const blockedHelp = isNew ? __$1("Publiceer of sla deze pagina eerst op.", "yard-page-guard") : __$1("Sla je wijzigingen eerst op.", "yard-page-guard");
	const buttonHelp = isBlocked ? blockedHelp : __$1("Bevestigt dat je de inhoud van deze pagina opnieuw hebt gecontroleerd.", "yard-page-guard");
	return /* @__PURE__ */ wp.element.createElement(Section, { title: __$1("Status", "yard-page-guard") }, isLoading && /* @__PURE__ */ wp.element.createElement(Spinner, null), !isLoading && /* @__PURE__ */ wp.element.createElement(VStack, { spacing: 3 }, /* @__PURE__ */ wp.element.createElement(VStack, { spacing: 0 }, /* @__PURE__ */ wp.element.createElement(Text, { variant: "muted" }, __$1("Laatst gecontroleerd", "yard-page-guard")), /* @__PURE__ */ wp.element.createElement(Text, null, lastReviewed || __$1("Nog niet gecontroleerd", "yard-page-guard"))), /* @__PURE__ */ wp.element.createElement(VStack, { spacing: 0 }, /* @__PURE__ */ wp.element.createElement(Text, { variant: "muted" }, __$1("Volgende herzieningsdatum", "yard-page-guard")), /* @__PURE__ */ wp.element.createElement(Text, null, nextReview || __$1("Nog niet ingesteld", "yard-page-guard")))), /* @__PURE__ */ wp.element.createElement(Button, {
		__next40pxDefaultSize: true,
		variant: "secondary",
		icon: "yes",
		disabled: isBlocked || isMarking,
		accessibleWhenDisabled: true,
		isBusy: isMarking,
		onClick: markReviewed
	}, __$1("Markeer als gecontroleerd", "yard-page-guard")), /* @__PURE__ */ wp.element.createElement(Text, { variant: "muted" }, buttonHelp), isSuccess && /* @__PURE__ */ wp.element.createElement(Notice, {
		status: "success",
		isDismissible: false
	}, __$1("Bedankt, de pagina is gemarkeerd als gecontroleerd.", "yard-page-guard")), error && /* @__PURE__ */ wp.element.createElement(Notice, {
		status: "error",
		isDismissible: false
	}, error));
};
//#endregion
//#region resources/js/editor-sidebar/index.jsx
/**
* Internal dependencies
*/
/**
* WordPress dependencies
*/
var Divider = wp.components.__experimentalDivider;
var PluginSidebar = wp.editor.PluginSidebar;
var PluginSidebarMoreMenuItem = wp.editor.PluginSidebarMoreMenuItem;
var PluginDocumentSettingPanel = wp.editor.PluginDocumentSettingPanel;
var PluginPostStatusInfo = wp.editor.PluginPostStatusInfo;
var registerPlugin = wp.plugins.registerPlugin;
var __ = wp.i18n.__;
var EditorSidebar = () => {
	const title = __("Inhoudscontrole", "yard-page-guard");
	return /* @__PURE__ */ wp.element.createElement(wp.element.Fragment, null, /* @__PURE__ */ wp.element.createElement(PluginSidebarMoreMenuItem, {
		target: SIDEBAR_NAME,
		icon: SIDEBAR_ICON
	}, title), /* @__PURE__ */ wp.element.createElement(PluginSidebar, {
		name: SIDEBAR_NAME,
		title,
		icon: SIDEBAR_ICON
	}, /* @__PURE__ */ wp.element.createElement(SidebarBody, null)), /* @__PURE__ */ wp.element.createElement(PluginDocumentSettingPanel, { title }, /* @__PURE__ */ wp.element.createElement(SidebarToggleButton, null)), /* @__PURE__ */ wp.element.createElement(PluginPostStatusInfo, null, /* @__PURE__ */ wp.element.createElement(SidebarToggleButton, null)));
};
var SidebarBody = () => {
	const [meta] = usePostMeta();
	const hasOwner = Number.parseInt(meta[META_CONTENT_OWNER_ID], 10) > 0;
	return /* @__PURE__ */ wp.element.createElement("div", { className: "ypg-editor-sidebar" }, /* @__PURE__ */ wp.element.createElement(ContentOwnerSection, null), hasOwner && /* @__PURE__ */ wp.element.createElement(wp.element.Fragment, null, /* @__PURE__ */ wp.element.createElement(Divider, { margin: 4 }), /* @__PURE__ */ wp.element.createElement(ReviewDateSection, null), /* @__PURE__ */ wp.element.createElement(Divider, { margin: 4 }), /* @__PURE__ */ wp.element.createElement(ReminderPeriodSection, null), /* @__PURE__ */ wp.element.createElement(Divider, { margin: 4 }), /* @__PURE__ */ wp.element.createElement(StatusSection, null)));
};
registerPlugin("ypg-editor-sidebar", { render: EditorSidebar });
//#endregion

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdG9yLXNpZGViYXIuanMiLCJuYW1lcyI6WyJtYXJrUmV2aWV3ZWQiLCJlbmRwb2ludHMuQ09OVEVOVF9PV05FUlMiLCJlbmRwb2ludHMuREVGQVVMVFMiLCJlbmRwb2ludHMucmV2aWV3U3RhdHVzIiwiZW5kcG9pbnRzLm1hcmtSZXZpZXdlZCIsInVzZVN0YXRlIiwidXNlU2VsZWN0IiwiZWRpdG9yU3RvcmUiLCJfXyIsInVzZVNlbGVjdCIsImVkaXRvclN0b3JlIiwidXNlQ2FsbGJhY2siLCJ1c2VTdGF0ZSIsIl9fIiwibWFya1Jldmlld2VkUmVxdWVzdCJdLCJzb3VyY2VzIjpbIi4uL3Jlc291cmNlcy9qcy9lZGl0b3Itc2lkZWJhci9jb25maWcvY29uc3RhbnRzLmpzIiwiLi4vcmVzb3VyY2VzL2pzL2VkaXRvci1zaWRlYmFyL2NvbXBvbmVudHMvc2lkZWJhci10b2dnbGUtYnV0dG9uLmpzeCIsIi4uL3Jlc291cmNlcy9qcy9lZGl0b3Itc2lkZWJhci9jb21wb25lbnRzL3NlY3Rpb24uanN4IiwiLi4vcmVzb3VyY2VzL2pzL2VkaXRvci1zaWRlYmFyL2FwaS9lbmRwb2ludHMuanMiLCIuLi9yZXNvdXJjZXMvanMvZWRpdG9yLXNpZGViYXIvYXBpL2luZGV4LmpzIiwiLi4vcmVzb3VyY2VzL2pzL2VkaXRvci1zaWRlYmFyL2hvb2tzL3VzZS1hc3luYy1kYXRhLmpzIiwiLi4vcmVzb3VyY2VzL2pzL2VkaXRvci1zaWRlYmFyL2hvb2tzL3VzZS1jb250ZW50LW93bmVycy5qcyIsIi4uL3Jlc291cmNlcy9qcy9lZGl0b3Itc2lkZWJhci9ob29rcy91c2UtcG9zdC1tZXRhLmpzIiwiLi4vcmVzb3VyY2VzL2pzL2VkaXRvci1zaWRlYmFyL2NvbmZpZy9tZXRhLWtleXMuanMiLCIuLi9yZXNvdXJjZXMvanMvZWRpdG9yLXNpZGViYXIvdXRpbHMvb3duZXItdmFsdWUuanMiLCIuLi9yZXNvdXJjZXMvanMvZWRpdG9yLXNpZGViYXIvc2VjdGlvbnMvY29udGVudC1vd25lci1zZWN0aW9uLmpzeCIsIi4uL3Jlc291cmNlcy9qcy9lZGl0b3Itc2lkZWJhci9ob29rcy91c2UtZGVmYXVsdHMuanMiLCIuLi9yZXNvdXJjZXMvanMvZWRpdG9yLXNpZGViYXIvdXRpbHMvZGF0ZS5qcyIsIi4uL3Jlc291cmNlcy9qcy9lZGl0b3Itc2lkZWJhci91dGlscy9kZWZhdWx0LWxhYmVsLmpzIiwiLi4vcmVzb3VyY2VzL2pzL2VkaXRvci1zaWRlYmFyL3NlY3Rpb25zL3Jldmlldy1kYXRlLXNlY3Rpb24uanN4IiwiLi4vcmVzb3VyY2VzL2pzL2VkaXRvci1zaWRlYmFyL3NlY3Rpb25zL3JlbWluZGVyLXBlcmlvZC1zZWN0aW9uLmpzeCIsIi4uL3Jlc291cmNlcy9qcy9lZGl0b3Itc2lkZWJhci9ob29rcy91c2UtZWRpdG9yLXBvc3QuanMiLCIuLi9yZXNvdXJjZXMvanMvZWRpdG9yLXNpZGViYXIvaG9va3MvdXNlLW1hcmstcmV2aWV3ZWQuanMiLCIuLi9yZXNvdXJjZXMvanMvZWRpdG9yLXNpZGViYXIvaG9va3MvdXNlLW5leHQtcmV2aWV3LWRhdGUuanMiLCIuLi9yZXNvdXJjZXMvanMvZWRpdG9yLXNpZGViYXIvaG9va3MvdXNlLXJldmlldy1zdGF0dXMuanMiLCIuLi9yZXNvdXJjZXMvanMvZWRpdG9yLXNpZGViYXIvc2VjdGlvbnMvc3RhdHVzLXNlY3Rpb24uanN4IiwiLi4vcmVzb3VyY2VzL2pzL2VkaXRvci1zaWRlYmFyL2luZGV4LmpzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgU0lERUJBUl9OQU1FID0gJ3lwZy1lZGl0b3Itc2lkZWJhcic7XG5leHBvcnQgY29uc3QgU0lERUJBUl9JQ09OID0gJ3NoaWVsZCc7XG5cbi8qKlxuICogTWlycm9yZWQgZnJvbSBZYXJkXFxQYWdlR3VhcmRcXE1ldGFcXE1ldGFGaWVsZHMuXG4gKi9cbmV4cG9ydCBjb25zdCBEQVRFX1RZUEVfREVGQVVMVCA9ICdkZWZhdWx0JztcbmV4cG9ydCBjb25zdCBEQVRFX1RZUEVfQ1VTVE9NID0gJ2N1c3RvbSc7XG5cbmV4cG9ydCBjb25zdCBUSU1FX1VOSVRTID0gWyAnZGF5cycsICd3ZWVrcycsICdtb250aHMnIF07XG5cbmV4cG9ydCBjb25zdCBPV05FUl9UWVBFUyA9IFsgJ3VzZXInLCAnZXh0ZXJuYWwnIF07XG4iLCIvKipcbiAqIFdvcmRQcmVzcyBkZXBlbmRlbmNpZXNcbiAqL1xuY29uc3QgQnV0dG9uID0gd3AuY29tcG9uZW50cy5CdXR0b247XG5jb25zdCB1c2VEaXNwYXRjaCA9IHdwLmRhdGEudXNlRGlzcGF0Y2g7XG5jb25zdCBfXyA9IHdwLmkxOG4uX187XG5cbi8qKlxuICogSW50ZXJuYWwgZGVwZW5kZW5jaWVzXG4gKi9cbmltcG9ydCB7IFNJREVCQVJfTkFNRSwgU0lERUJBUl9JQ09OIH0gZnJvbSAnLi4vY29uZmlnL2NvbnN0YW50cyc7XG5cbmNvbnN0IFNpZGViYXJUb2dnbGVCdXR0b24gPSAoIHsgY2xhc3NOYW1lIH0gKSA9PiB7XG5cdGNvbnN0IHsgb3BlbkdlbmVyYWxTaWRlYmFyIH0gPSB1c2VEaXNwYXRjaCggJ2NvcmUvZWRpdC1wb3N0JyApO1xuXG5cdHJldHVybiAoXG5cdFx0PEJ1dHRvblxuXHRcdFx0Y2xhc3NOYW1lPXsgYHlwZy1lZGl0b3Itc2lkZWJhci10b2dnbGUtYnV0dG9uICR7IGNsYXNzTmFtZSB9YCB9XG5cdFx0XHR2YXJpYW50PVwic2Vjb25kYXJ5XCJcblx0XHRcdGljb249eyBTSURFQkFSX0lDT04gfVxuXHRcdFx0b25DbGljaz17ICgpID0+XG5cdFx0XHRcdG9wZW5HZW5lcmFsU2lkZWJhciggYHlwZy1lZGl0b3Itc2lkZWJhci8keyBTSURFQkFSX05BTUUgfWAgKVxuXHRcdFx0fVxuXHRcdD5cblx0XHRcdHsgX18oICdJbmhvdWRzY29udHJvbGUgb3BlbmVuJywgJ3lhcmQtcGFnZS1ndWFyZCcgKSB9XG5cdFx0PC9CdXR0b24+XG5cdCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBTaWRlYmFyVG9nZ2xlQnV0dG9uO1xuXG5cbmlmIChpbXBvcnQubWV0YS5ob3QpIHtcbiAgICBpbXBvcnQubWV0YS5ob3Qub24oJ3ZpdGU6YmVmb3JlVXBkYXRlJywgKHsgdXBkYXRlcyB9KSA9PiB7XG4gICAgICAgIGNvbnN0IGVkaXRvcklmcmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lmcmFtZVtuYW1lPVwiZWRpdG9yLWNhbnZhc1wiXScpO1xuICAgICAgICBjb25zdCBlZGl0b3IgPSBlZGl0b3JJZnJhbWU/LmNvbnRlbnREb2N1bWVudDtcblxuICAgICAgICBpZiAoIWVkaXRvcikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlcy5mb3JFYWNoKCh7IHBhdGgsIHR5cGUgfSkgPT4ge1xuICAgICAgICAgICAgaWYgKHR5cGUgIT09ICdjc3MtdXBkYXRlJykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3Qga2V5ID0gcGF0aC5zcGxpdCgnPycpWzBdO1xuXG4gICAgICAgICAgICBlZGl0b3IucXVlcnlTZWxlY3RvckFsbCgnbGlua1tyZWw9XCJzdHlsZXNoZWV0XCJdJykuZm9yRWFjaChsaW5rID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIWxpbmsuaHJlZi5pbmNsdWRlcyhrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCB1cGRhdGVkID0gbGluay5ocmVmLnNwbGl0KCc/JylbMF0gKyAnP2RpcmVjdCZ0PScgKyBEYXRlLm5vdygpO1xuXG4gICAgICAgICAgICAgICAgbGluay5ocmVmID0gdXBkYXRlZDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBlZGl0b3IucXVlcnlTZWxlY3RvckFsbCgnc3R5bGUnKS5mb3JFYWNoKHN0eWxlID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXN0eWxlLnRleHRDb250ZW50LmluY2x1ZGVzKGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IGltcG9ydFJlZ2V4ID0gbmV3IFJlZ0V4cChgKEBpbXBvcnRcXFxccyooPzp1cmxcXFxcKFsnXCJdP3xbJ1wiXSkpKC4qPyR7a2V5fVteJ1wiXFxcXCldKj8pKD86XFxcXD9bXidcIlxcXFwpXSopPyhbJ1wiXT9cXFxcKSlgLCAnZycpO1xuXG4gICAgICAgICAgICAgICAgc3R5bGUudGV4dENvbnRlbnQgPSBzdHlsZS50ZXh0Q29udGVudC5yZXBsYWNlKGltcG9ydFJlZ2V4LCAoXywgcHJlZml4LCBpbXBvcnRQYXRoLCBzdWZmaXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdXBkYXRlZCA9IGltcG9ydFBhdGguc3BsaXQoJz8nKVswXTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJlZml4ICsgdXBkYXRlZCArICc/ZGlyZWN0JnQ9JyArIERhdGUubm93KCkgKyBzdWZmaXg7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59IiwiLyoqXG4gKiBXb3JkUHJlc3MgZGVwZW5kZW5jaWVzXG4gKi9cbmNvbnN0IFZTdGFjayA9IHdwLmNvbXBvbmVudHMuX19leHBlcmltZW50YWxWU3RhY2s7XG5jb25zdCBIZWFkaW5nID0gd3AuY29tcG9uZW50cy5fX2V4cGVyaW1lbnRhbEhlYWRpbmc7XG5cbmNvbnN0IFNlY3Rpb24gPSAoIHsgdGl0bGUsIGNoaWxkcmVuIH0gKSA9PiAoXG5cdDxWU3RhY2sgY2xhc3NOYW1lPVwieXBnLXNlY3Rpb25cIiBzcGFjaW5nPXsgMyB9PlxuXHRcdHsgdGl0bGUgJiYgKFxuXHRcdFx0PEhlYWRpbmdcblx0XHRcdFx0Y2xhc3NOYW1lPVwieXBnLXNlY3Rpb24taGVhZGluZ1wiXG5cdFx0XHRcdGxldmVsPXsgMyB9XG5cdFx0XHRcdHNpemU9eyAxMyB9XG5cdFx0XHRcdHdlaWdodD17IDUwMCB9XG5cdFx0XHQ+XG5cdFx0XHRcdHsgdGl0bGUgfVxuXHRcdFx0PC9IZWFkaW5nPlxuXHRcdCkgfVxuXHRcdHsgY2hpbGRyZW4gfVxuXHQ8L1ZTdGFjaz5cbik7XG5cbmV4cG9ydCBkZWZhdWx0IFNlY3Rpb247XG5cblxuaWYgKGltcG9ydC5tZXRhLmhvdCkge1xuICAgIGltcG9ydC5tZXRhLmhvdC5vbigndml0ZTpiZWZvcmVVcGRhdGUnLCAoeyB1cGRhdGVzIH0pID0+IHtcbiAgICAgICAgY29uc3QgZWRpdG9ySWZyYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaWZyYW1lW25hbWU9XCJlZGl0b3ItY2FudmFzXCJdJyk7XG4gICAgICAgIGNvbnN0IGVkaXRvciA9IGVkaXRvcklmcmFtZT8uY29udGVudERvY3VtZW50O1xuXG4gICAgICAgIGlmICghZWRpdG9yKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGVzLmZvckVhY2goKHsgcGF0aCwgdHlwZSB9KSA9PiB7XG4gICAgICAgICAgICBpZiAodHlwZSAhPT0gJ2Nzcy11cGRhdGUnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBrZXkgPSBwYXRoLnNwbGl0KCc/JylbMF07XG5cbiAgICAgICAgICAgIGVkaXRvci5xdWVyeVNlbGVjdG9yQWxsKCdsaW5rW3JlbD1cInN0eWxlc2hlZXRcIl0nKS5mb3JFYWNoKGxpbmsgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghbGluay5ocmVmLmluY2x1ZGVzKGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IHVwZGF0ZWQgPSBsaW5rLmhyZWYuc3BsaXQoJz8nKVswXSArICc/ZGlyZWN0JnQ9JyArIERhdGUubm93KCk7XG5cbiAgICAgICAgICAgICAgICBsaW5rLmhyZWYgPSB1cGRhdGVkO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGVkaXRvci5xdWVyeVNlbGVjdG9yQWxsKCdzdHlsZScpLmZvckVhY2goc3R5bGUgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghc3R5bGUudGV4dENvbnRlbnQuaW5jbHVkZXMoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgaW1wb3J0UmVnZXggPSBuZXcgUmVnRXhwKGAoQGltcG9ydFxcXFxzKig/OnVybFxcXFwoWydcIl0/fFsnXCJdKSkoLio/JHtrZXl9W14nXCJcXFxcKV0qPykoPzpcXFxcP1teJ1wiXFxcXCldKik/KFsnXCJdP1xcXFwpKWAsICdnJyk7XG5cbiAgICAgICAgICAgICAgICBzdHlsZS50ZXh0Q29udGVudCA9IHN0eWxlLnRleHRDb250ZW50LnJlcGxhY2UoaW1wb3J0UmVnZXgsIChfLCBwcmVmaXgsIGltcG9ydFBhdGgsIHN1ZmZpeCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB1cGRhdGVkID0gaW1wb3J0UGF0aC5zcGxpdCgnPycpWzBdO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmVmaXggKyB1cGRhdGVkICsgJz9kaXJlY3QmdD0nICsgRGF0ZS5ub3coKSArIHN1ZmZpeDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0iLCJjb25zdCBOQU1FU1BBQ0UgPSAnL3lhcmQvcGFnZS1ndWFyZC92Mic7XG5cbmV4cG9ydCBjb25zdCBDT05URU5UX09XTkVSUyA9IGAkeyBOQU1FU1BBQ0UgfS9lZGl0b3IvY29udGVudC1vd25lcnNgO1xuZXhwb3J0IGNvbnN0IERFRkFVTFRTID0gYCR7IE5BTUVTUEFDRSB9L2VkaXRvci9kZWZhdWx0c2A7XG5cbmV4cG9ydCBjb25zdCByZXZpZXdTdGF0dXMgPSAoIHBvc3RJZCApID0+XG5cdGAkeyBOQU1FU1BBQ0UgfS9lZGl0b3IvcmV2aWV3LXN0YXR1cy8keyBwb3N0SWQgfWA7XG5cbmV4cG9ydCBjb25zdCBtYXJrUmV2aWV3ZWQgPSAoIHBvc3RJZCApID0+XG5cdGAkeyBOQU1FU1BBQ0UgfS9lZGl0b3IvbWFyay1yZXZpZXdlZC8keyBwb3N0SWQgfWA7XG4iLCIvKipcbiAqIFdvcmRQcmVzcyBkZXBlbmRlbmNpZXNcbiAqL1xuaW1wb3J0IGFwaUZldGNoIGZyb20gJ0B3b3JkcHJlc3MvYXBpLWZldGNoJztcblxuLyoqXG4gKiBJbnRlcm5hbCBkZXBlbmRlbmNpZXNcbiAqL1xuaW1wb3J0ICogYXMgZW5kcG9pbnRzIGZyb20gJy4vZW5kcG9pbnRzJztcblxuY29uc3QgY2FjaGUgPSBuZXcgTWFwKCk7XG5cbmNvbnN0IGZldGNoT25jZSA9ICggcGF0aCApID0+IHtcblx0aWYgKCAhIGNhY2hlLmhhcyggcGF0aCApICkge1xuXHRcdGNhY2hlLnNldChcblx0XHRcdHBhdGgsXG5cdFx0XHRhcGlGZXRjaCggeyBwYXRoIH0gKS5jYXRjaCggKCBlcnJvciApID0+IHtcblx0XHRcdFx0Y2FjaGUuZGVsZXRlKCBwYXRoICk7XG5cdFx0XHRcdHRocm93IGVycm9yO1xuXHRcdFx0fSApXG5cdFx0KTtcblx0fVxuXG5cdHJldHVybiBjYWNoZS5nZXQoIHBhdGggKTtcbn07XG5cbmV4cG9ydCBjb25zdCBmZXRjaENvbnRlbnRPd25lcnMgPSAoKSA9PiBmZXRjaE9uY2UoIGVuZHBvaW50cy5DT05URU5UX09XTkVSUyApO1xuXG5leHBvcnQgY29uc3QgZmV0Y2hEZWZhdWx0cyA9ICgpID0+IGZldGNoT25jZSggZW5kcG9pbnRzLkRFRkFVTFRTICk7XG5cbmV4cG9ydCBjb25zdCBmZXRjaFJldmlld1N0YXR1cyA9ICggcG9zdElkICkgPT5cblx0YXBpRmV0Y2goIHsgcGF0aDogZW5kcG9pbnRzLnJldmlld1N0YXR1cyggcG9zdElkICkgfSApO1xuXG5leHBvcnQgY29uc3QgbWFya1Jldmlld2VkID0gKCBwb3N0SWQgKSA9PlxuXHRhcGlGZXRjaCggeyBwYXRoOiBlbmRwb2ludHMubWFya1Jldmlld2VkKCBwb3N0SWQgKSwgbWV0aG9kOiAnUE9TVCcgfSApO1xuIiwiLyoqXG4gKiBXb3JkUHJlc3MgZGVwZW5kZW5jaWVzXG4gKi9cbmltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdAd29yZHByZXNzL2VsZW1lbnQnO1xuXG4vKipcbiAqIFJlc29sdmVzIGZldGNoZXIgaW50byByZW5kZXIgc3RhdGUsIGlnbm9yaW5nIHN0YWxlIHJlc3VsdHMgYWZ0ZXIgdW5tb3VudC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmZXRjaGVyIFJldHVybnMgYSBwcm9taXNlIHdpdGggdGhlIGRhdGEuIE11c3QgYmUgYSBzdGFibGUgcmVmZXJlbmNlLlxuICogQHJldHVybiB7e2RhdGE6ICosIGlzTG9hZGluZzogYm9vbGVhbiwgZXJyb3I6ID9PYmplY3R9fSBSZXF1ZXN0IHN0YXRlLlxuICovXG5leHBvcnQgY29uc3QgdXNlQXN5bmNEYXRhID0gKCBmZXRjaGVyICkgPT4ge1xuXHRjb25zdCBbIHN0YXRlLCBzZXRTdGF0ZSBdID0gdXNlU3RhdGUoIHtcblx0XHRkYXRhOiBudWxsLFxuXHRcdGlzTG9hZGluZzogdHJ1ZSxcblx0XHRlcnJvcjogbnVsbCxcblx0fSApO1xuXG5cdHVzZUVmZmVjdCggKCkgPT4ge1xuXHRcdGxldCBpc0N1cnJlbnQgPSB0cnVlO1xuXG5cdFx0c2V0U3RhdGUoIHsgZGF0YTogbnVsbCwgaXNMb2FkaW5nOiB0cnVlLCBlcnJvcjogbnVsbCB9ICk7XG5cblx0XHRmZXRjaGVyKClcblx0XHRcdC50aGVuKCAoIGRhdGEgKSA9PiB7XG5cdFx0XHRcdGlmICggaXNDdXJyZW50ICkge1xuXHRcdFx0XHRcdHNldFN0YXRlKCB7IGRhdGEsIGlzTG9hZGluZzogZmFsc2UsIGVycm9yOiBudWxsIH0gKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApXG5cdFx0XHQuY2F0Y2goICggZXJyb3IgKSA9PiB7XG5cdFx0XHRcdGlmICggaXNDdXJyZW50ICkge1xuXHRcdFx0XHRcdHNldFN0YXRlKCB7IGRhdGE6IG51bGwsIGlzTG9hZGluZzogZmFsc2UsIGVycm9yIH0gKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXG5cdFx0cmV0dXJuICgpID0+IHtcblx0XHRcdGlzQ3VycmVudCA9IGZhbHNlO1xuXHRcdH07XG5cdH0sIFsgZmV0Y2hlciBdICk7XG5cblx0cmV0dXJuIHN0YXRlO1xufTtcbiIsIi8qKlxuICogSW50ZXJuYWwgZGVwZW5kZW5jaWVzXG4gKi9cbmltcG9ydCB7IGZldGNoQ29udGVudE93bmVycyB9IGZyb20gJy4uL2FwaSc7XG5pbXBvcnQgeyB1c2VBc3luY0RhdGEgfSBmcm9tICcuL3VzZS1hc3luYy1kYXRhJztcblxuY29uc3QgRU1QVFlfT1dORVJTID0gW107XG5cbi8qKlxuICogQHJldHVybiB7e293bmVyczogQXJyYXk8T2JqZWN0PiwgaXNMb2FkaW5nOiBib29sZWFuLCBlcnJvcjogP09iamVjdH19IEFzc2lnbmFibGUgY29udGVudCBvd25lcnMuXG4gKi9cbmV4cG9ydCBjb25zdCB1c2VDb250ZW50T3duZXJzID0gKCkgPT4ge1xuXHRjb25zdCB7IGRhdGEsIGlzTG9hZGluZywgZXJyb3IgfSA9IHVzZUFzeW5jRGF0YSggZmV0Y2hDb250ZW50T3duZXJzICk7XG5cblx0cmV0dXJuIHtcblx0XHRvd25lcnM6IEFycmF5LmlzQXJyYXkoIGRhdGEgKSA/IGRhdGEgOiBFTVBUWV9PV05FUlMsXG5cdFx0aXNMb2FkaW5nLFxuXHRcdGVycm9yLFxuXHR9O1xufTtcbiIsIi8qKlxuICogV29yZFByZXNzIGRlcGVuZGVuY2llc1xuICovXG5pbXBvcnQgeyB1c2VFbnRpdHlQcm9wIH0gZnJvbSAnQHdvcmRwcmVzcy9jb3JlLWRhdGEnO1xuaW1wb3J0IHsgdXNlU2VsZWN0IH0gZnJvbSAnQHdvcmRwcmVzcy9kYXRhJztcbmltcG9ydCB7IHN0b3JlIGFzIGVkaXRvclN0b3JlIH0gZnJvbSAnQHdvcmRwcmVzcy9lZGl0b3InO1xuXG4vKipcbiAqIFJlYWRzL3dyaXRlcyBjdXJyZW50IHBvc3QncyBtZXRhLCB3cml0ZXMgbWVyZ2UgaW50byBleGlzdGluZyBtZXRhLlxuICpcbiAqIEByZXR1cm4ge1tPYmplY3QsIEZ1bmN0aW9uXX0gVGhlIHBvc3QgbWV0YSBhbmQgYSBzZXR0ZXIgdGFraW5nIHBhcnRpYWwgbWV0YS5cbiAqL1xuZXhwb3J0IGNvbnN0IHVzZVBvc3RNZXRhID0gKCkgPT4ge1xuXHRjb25zdCBwb3N0VHlwZSA9IHVzZVNlbGVjdChcblx0XHQoIHNlbGVjdCApID0+IHNlbGVjdCggZWRpdG9yU3RvcmUgKS5nZXRDdXJyZW50UG9zdFR5cGUoKSxcblx0XHRbXVxuXHQpO1xuXHRjb25zdCBbIG1ldGEsIHNldE1ldGEgXSA9IHVzZUVudGl0eVByb3AoICdwb3N0VHlwZScsIHBvc3RUeXBlLCAnbWV0YScgKTtcblxuXHRjb25zdCB1cGRhdGVNZXRhID0gKCBjaGFuZ2VzICkgPT4gc2V0TWV0YSggeyAuLi5tZXRhLCAuLi5jaGFuZ2VzIH0gKTtcblxuXHRyZXR1cm4gWyBtZXRhID8/IHt9LCB1cGRhdGVNZXRhIF07XG59O1xuIiwiLyoqXG4gKiBQb3N0IG1ldGEga2V5cywgbWlycm9yZWQgZnJvbSBZYXJkXFxQYWdlR3VhcmRcXEVudW1zXFxQb3N0TWV0YS5cbiAqL1xuZXhwb3J0IGNvbnN0IE1FVEFfQ09OVEVOVF9PV05FUl9JRCA9ICd5cGdfcG9zdF9jb250ZW50X293bmVyX2lkJztcbmV4cG9ydCBjb25zdCBNRVRBX0NPTlRFTlRfT1dORVJfVFlQRSA9ICd5cGdfcG9zdF9jb250ZW50X293bmVyX3R5cGUnO1xuZXhwb3J0IGNvbnN0IE1FVEFfUkVWSUVXX0RBVEVfVFlQRSA9ICd5cGdfcmV2aWV3X2RhdGVfdHlwZSc7XG5leHBvcnQgY29uc3QgTUVUQV9SRVZJRVdfREFURSA9ICd5cGdfcmV2aWV3X2RhdGUnO1xuZXhwb3J0IGNvbnN0IE1FVEFfUkVNSU5ERVJfVElNRV9UWVBFID0gJ3lwZ19yZW1pbmRlcl90aW1lX3R5cGUnO1xuZXhwb3J0IGNvbnN0IE1FVEFfUkVNSU5ERVJfVElNRV9QRVJJT0QgPSAneXBnX3JlbWluZGVyX3RpbWVfcGVyaW9kJztcbmV4cG9ydCBjb25zdCBNRVRBX1JFTUlOREVSX1RJTUVfVU5JVCA9ICd5cGdfcmVtaW5kZXJfdGltZV91bml0JztcbmV4cG9ydCBjb25zdCBNRVRBX0xBU1RfUkVWSUVXX0RBVEUgPSAneXBnX2xhc3RfcmV2aWV3X2RhdGUnO1xuIiwiLyoqXG4gKiBJbnRlcm5hbCBkZXBlbmRlbmNpZXNcbiAqL1xuaW1wb3J0IHsgT1dORVJfVFlQRVMgfSBmcm9tICcuLi9jb25maWcvY29uc3RhbnRzJztcblxuLyoqXG4gKiBDb21wb3NpdGUgaWQrdHlwZSB2YWx1ZSBmb3IgdGhlIG93bmVyIHNlbGVjdDsgc3BsaXQgYmFjayBpbnRvIHNlcGFyYXRlXG4gKiBtZXRhIGZpZWxkcyBiZWZvcmUgc3RvcmFnZS4gS2VwdCBpbiBzeW5jIHdpdGggTWV0YUZpZWxkczo6ZW5jb2RlT3duZXJWYWx1ZSgpXG4gKiAvIDo6ZGVjb2RlT3duZXJWYWx1ZSgpLlxuICovXG5jb25zdCBTRVBBUkFUT1IgPSAnOic7XG5cbmV4cG9ydCBjb25zdCBOT19PV05FUiA9ICcnO1xuXG5jb25zdCBOT05FID0geyBpZDogMCwgdHlwZTogJycgfTtcblxuLyoqXG4gKiBAcGFyYW0ge251bWJlcn0gaWQgICBPd25lciBpZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIE93bmVyIHR5cGU6ICd1c2VyJyBvciAnZXh0ZXJuYWwnLlxuICogQHJldHVybiB7c3RyaW5nfSBDb21wb3NpdGUgc2VsZWN0IHZhbHVlLCBlbXB0eSB3aGVuIHRoZXJlIGlzIG5vIG93bmVyLlxuICovXG5leHBvcnQgY29uc3QgZW5jb2RlT3duZXJWYWx1ZSA9ICggaWQsIHR5cGUgKSA9PiB7XG5cdGNvbnN0IG51bWVyaWNJZCA9IE51bWJlci5wYXJzZUludCggaWQsIDEwICk7XG5cblx0aWYgKCAhIG51bWVyaWNJZCB8fCBudW1lcmljSWQgPCAxIHx8ICEgT1dORVJfVFlQRVMuaW5jbHVkZXMoIHR5cGUgKSApIHtcblx0XHRyZXR1cm4gTk9fT1dORVI7XG5cdH1cblxuXHRyZXR1cm4gYCR7IHR5cGUgfSR7IFNFUEFSQVRPUiB9JHsgbnVtZXJpY0lkIH1gO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgQ29tcG9zaXRlIHNlbGVjdCB2YWx1ZS5cbiAqIEByZXR1cm4ge3tpZDogbnVtYmVyLCB0eXBlOiBzdHJpbmd9fSBPd25lciBpZCBhbmQgdHlwZSwgemVyb2VkIHdoZW4gZW1wdHkuXG4gKi9cbmV4cG9ydCBjb25zdCBkZWNvZGVPd25lclZhbHVlID0gKCB2YWx1ZSApID0+IHtcblx0Y29uc3QgWyB0eXBlLCBpZCBdID0gU3RyaW5nKCB2YWx1ZSA/PyAnJyApLnNwbGl0KCBTRVBBUkFUT1IgKTtcblx0Y29uc3QgbnVtZXJpY0lkID0gTnVtYmVyLnBhcnNlSW50KCBpZCwgMTAgKTtcblxuXHRpZiAoICEgbnVtZXJpY0lkIHx8IG51bWVyaWNJZCA8IDEgfHwgISBPV05FUl9UWVBFUy5pbmNsdWRlcyggdHlwZSApICkge1xuXHRcdHJldHVybiBOT05FO1xuXHR9XG5cblx0cmV0dXJuIHsgaWQ6IG51bWVyaWNJZCwgdHlwZSB9O1xufTtcbiIsIi8qKlxuICogV29yZFByZXNzIGRlcGVuZGVuY2llc1xuICovXG5jb25zdCBOb3RpY2UgPSB3cC5jb21wb25lbnRzLk5vdGljZTtcbmNvbnN0IFNlbGVjdENvbnRyb2wgPSB3cC5jb21wb25lbnRzLlNlbGVjdENvbnRyb2w7XG5jb25zdCBTcGlubmVyID0gd3AuY29tcG9uZW50cy5TcGlubmVyO1xuY29uc3QgX18gPSB3cC5pMThuLl9fO1xuXG4vKipcbiAqIEludGVybmFsIGRlcGVuZGVuY2llc1xuICovXG5pbXBvcnQgU2VjdGlvbiBmcm9tICcuLi9jb21wb25lbnRzL3NlY3Rpb24uanN4JztcbmltcG9ydCB7IHVzZUNvbnRlbnRPd25lcnMgfSBmcm9tICcuLi9ob29rcy91c2UtY29udGVudC1vd25lcnMnO1xuaW1wb3J0IHsgdXNlUG9zdE1ldGEgfSBmcm9tICcuLi9ob29rcy91c2UtcG9zdC1tZXRhJztcbmltcG9ydCB7XG5cdE1FVEFfQ09OVEVOVF9PV05FUl9JRCxcblx0TUVUQV9DT05URU5UX09XTkVSX1RZUEUsXG5cdE1FVEFfUkVWSUVXX0RBVEUsXG5cdE1FVEFfUkVWSUVXX0RBVEVfVFlQRSxcblx0TUVUQV9SRU1JTkRFUl9USU1FX1BFUklPRCxcblx0TUVUQV9SRU1JTkRFUl9USU1FX1RZUEUsXG5cdE1FVEFfUkVNSU5ERVJfVElNRV9VTklULFxufSBmcm9tICcuLi9jb25maWcvbWV0YS1rZXlzJztcbmltcG9ydCB7IERBVEVfVFlQRV9ERUZBVUxUIH0gZnJvbSAnLi4vY29uZmlnL2NvbnN0YW50cyc7XG5pbXBvcnQge1xuXHROT19PV05FUixcblx0ZGVjb2RlT3duZXJWYWx1ZSxcblx0ZW5jb2RlT3duZXJWYWx1ZSxcbn0gZnJvbSAnLi4vdXRpbHMvb3duZXItdmFsdWUnO1xuXG5jb25zdCBDb250ZW50T3duZXJTZWN0aW9uID0gKCkgPT4ge1xuXHRjb25zdCB7IG93bmVycywgaXNMb2FkaW5nLCBlcnJvciB9ID0gdXNlQ29udGVudE93bmVycygpO1xuXHRjb25zdCBbIG1ldGEsIHVwZGF0ZU1ldGEgXSA9IHVzZVBvc3RNZXRhKCk7XG5cblx0Y29uc3QgdmFsdWUgPSBlbmNvZGVPd25lclZhbHVlKFxuXHRcdG1ldGFbIE1FVEFfQ09OVEVOVF9PV05FUl9JRCBdLFxuXHRcdG1ldGFbIE1FVEFfQ09OVEVOVF9PV05FUl9UWVBFIF1cblx0KTtcblxuXHRjb25zdCBvbkNoYW5nZSA9ICggbmV4dFZhbHVlICkgPT4ge1xuXHRcdGNvbnN0IHsgaWQsIHR5cGUgfSA9IGRlY29kZU93bmVyVmFsdWUoIG5leHRWYWx1ZSApO1xuXG5cdFx0aWYgKCAhIGlkICkge1xuXHRcdFx0dXBkYXRlTWV0YSgge1xuXHRcdFx0XHRbIE1FVEFfQ09OVEVOVF9PV05FUl9JRCBdOiAwLFxuXHRcdFx0XHRbIE1FVEFfQ09OVEVOVF9PV05FUl9UWVBFIF06ICcnLFxuXHRcdFx0XHRbIE1FVEFfUkVWSUVXX0RBVEVfVFlQRSBdOiBEQVRFX1RZUEVfREVGQVVMVCxcblx0XHRcdFx0WyBNRVRBX1JFVklFV19EQVRFIF06ICcnLFxuXHRcdFx0XHRbIE1FVEFfUkVNSU5ERVJfVElNRV9UWVBFIF06IERBVEVfVFlQRV9ERUZBVUxULFxuXHRcdFx0XHRbIE1FVEFfUkVNSU5ERVJfVElNRV9QRVJJT0QgXTogMCxcblx0XHRcdFx0WyBNRVRBX1JFTUlOREVSX1RJTUVfVU5JVCBdOiAnJyxcblx0XHRcdH0gKTtcblxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHVwZGF0ZU1ldGEoIHtcblx0XHRcdFsgTUVUQV9DT05URU5UX09XTkVSX0lEIF06IGlkLFxuXHRcdFx0WyBNRVRBX0NPTlRFTlRfT1dORVJfVFlQRSBdOiB0eXBlLFxuXHRcdH0gKTtcblx0fTtcblxuXHRjb25zdCBvcHRpb25zID0gW1xuXHRcdHtcblx0XHRcdGxhYmVsOiBfXyggJ0dlZW4gaW5ob3Vkc2VpZ2VuYWFyJywgJ3lhcmQtcGFnZS1ndWFyZCcgKSxcblx0XHRcdHZhbHVlOiBOT19PV05FUixcblx0XHR9LFxuXHRcdC4uLm93bmVycy5tYXAoICggb3duZXIgKSA9PiAoIHtcblx0XHRcdGxhYmVsOiBvd25lci5sYWJlbCxcblx0XHRcdHZhbHVlOiBvd25lci52YWx1ZSxcblx0XHR9ICkgKSxcblx0XTtcblxuXHRyZXR1cm4gKFxuXHRcdDxTZWN0aW9uPlxuXHRcdFx0eyBpc0xvYWRpbmcgJiYgPFNwaW5uZXIgLz4gfVxuXG5cdFx0XHR7IGVycm9yICYmIChcblx0XHRcdFx0PE5vdGljZSBzdGF0dXM9XCJlcnJvclwiIGlzRGlzbWlzc2libGU9eyBmYWxzZSB9PlxuXHRcdFx0XHRcdHsgX18oXG5cdFx0XHRcdFx0XHQnRGUgaW5ob3Vkc2VpZ2VuYXJlbiBrb25kZW4gbmlldCB3b3JkZW4gZ2VsYWRlbi4nLFxuXHRcdFx0XHRcdFx0J3lhcmQtcGFnZS1ndWFyZCdcblx0XHRcdFx0XHQpIH1cblx0XHRcdFx0PC9Ob3RpY2U+XG5cdFx0XHQpIH1cblxuXHRcdFx0eyAhIGlzTG9hZGluZyAmJiAhIGVycm9yICYmIChcblx0XHRcdFx0PFNlbGVjdENvbnRyb2xcblx0XHRcdFx0XHRfX25leHRIYXNOb01hcmdpbkJvdHRvbVxuXHRcdFx0XHRcdGxhYmVsPXsgX18oICdJbmhvdWRzZWlnZW5hYXInLCAneWFyZC1wYWdlLWd1YXJkJyApIH1cblx0XHRcdFx0XHRoZWxwPXsgX18oXG5cdFx0XHRcdFx0XHQnSW5ob3Vkc2VpZ2VuYXJlbiBrcmlqZ2VuIGVlbiBoZXJpbm5lcmluZyBvcCBkZSBpbmdlc3RlbGRlIGRhdHVtIG9tIGRlIGluaG91ZCB2YW4gZGV6ZSBwYWdpbmEgdGUgdmVyaWZpw6tyZW4uJyxcblx0XHRcdFx0XHRcdCd5YXJkLXBhZ2UtZ3VhcmQnXG5cdFx0XHRcdFx0KSB9XG5cdFx0XHRcdFx0dmFsdWU9eyB2YWx1ZSB9XG5cdFx0XHRcdFx0b3B0aW9ucz17IG9wdGlvbnMgfVxuXHRcdFx0XHRcdG9uQ2hhbmdlPXsgb25DaGFuZ2UgfVxuXHRcdFx0XHQvPlxuXHRcdFx0KSB9XG5cdFx0PC9TZWN0aW9uPlxuXHQpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQ29udGVudE93bmVyU2VjdGlvbjtcblxuXG5pZiAoaW1wb3J0Lm1ldGEuaG90KSB7XG4gICAgaW1wb3J0Lm1ldGEuaG90Lm9uKCd2aXRlOmJlZm9yZVVwZGF0ZScsICh7IHVwZGF0ZXMgfSkgPT4ge1xuICAgICAgICBjb25zdCBlZGl0b3JJZnJhbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdpZnJhbWVbbmFtZT1cImVkaXRvci1jYW52YXNcIl0nKTtcbiAgICAgICAgY29uc3QgZWRpdG9yID0gZWRpdG9ySWZyYW1lPy5jb250ZW50RG9jdW1lbnQ7XG5cbiAgICAgICAgaWYgKCFlZGl0b3IpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZXMuZm9yRWFjaCgoeyBwYXRoLCB0eXBlIH0pID0+IHtcbiAgICAgICAgICAgIGlmICh0eXBlICE9PSAnY3NzLXVwZGF0ZScpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGtleSA9IHBhdGguc3BsaXQoJz8nKVswXTtcblxuICAgICAgICAgICAgZWRpdG9yLnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpbmtbcmVsPVwic3R5bGVzaGVldFwiXScpLmZvckVhY2gobGluayA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFsaW5rLmhyZWYuaW5jbHVkZXMoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgdXBkYXRlZCA9IGxpbmsuaHJlZi5zcGxpdCgnPycpWzBdICsgJz9kaXJlY3QmdD0nICsgRGF0ZS5ub3coKTtcblxuICAgICAgICAgICAgICAgIGxpbmsuaHJlZiA9IHVwZGF0ZWQ7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZWRpdG9yLnF1ZXJ5U2VsZWN0b3JBbGwoJ3N0eWxlJykuZm9yRWFjaChzdHlsZSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFzdHlsZS50ZXh0Q29udGVudC5pbmNsdWRlcyhrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBpbXBvcnRSZWdleCA9IG5ldyBSZWdFeHAoYChAaW1wb3J0XFxcXHMqKD86dXJsXFxcXChbJ1wiXT98WydcIl0pKSguKj8ke2tleX1bXidcIlxcXFwpXSo/KSg/OlxcXFw/W14nXCJcXFxcKV0qKT8oWydcIl0/XFxcXCkpYCwgJ2cnKTtcblxuICAgICAgICAgICAgICAgIHN0eWxlLnRleHRDb250ZW50ID0gc3R5bGUudGV4dENvbnRlbnQucmVwbGFjZShpbXBvcnRSZWdleCwgKF8sIHByZWZpeCwgaW1wb3J0UGF0aCwgc3VmZml4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHVwZGF0ZWQgPSBpbXBvcnRQYXRoLnNwbGl0KCc/JylbMF07XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByZWZpeCArIHVwZGF0ZWQgKyAnP2RpcmVjdCZ0PScgKyBEYXRlLm5vdygpICsgc3VmZml4O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSIsIi8qKlxuICogSW50ZXJuYWwgZGVwZW5kZW5jaWVzXG4gKi9cbmltcG9ydCB7IGZldGNoRGVmYXVsdHMgfSBmcm9tICcuLi9hcGknO1xuaW1wb3J0IHsgdXNlQXN5bmNEYXRhIH0gZnJvbSAnLi91c2UtYXN5bmMtZGF0YSc7XG5cbmV4cG9ydCBjb25zdCB1c2VEZWZhdWx0cyA9ICgpID0+IHtcblx0Y29uc3QgeyBkYXRhLCBpc0xvYWRpbmcsIGVycm9yIH0gPSB1c2VBc3luY0RhdGEoIGZldGNoRGVmYXVsdHMgKTtcblxuXHRyZXR1cm4geyBkZWZhdWx0czogZGF0YSwgaXNMb2FkaW5nLCBlcnJvciB9O1xufTtcbiIsIi8qKlxuICogV29yZFByZXNzIGRlcGVuZGVuY2llc1xuICovXG5pbXBvcnQgeyBkYXRlSTE4biwgZ2V0U2V0dGluZ3MgfSBmcm9tICdAd29yZHByZXNzL2RhdGUnO1xuXG4vKipcbiAqIExvY2FsIGdldHRlcnMgb24gcHVycG9zZTogYHRvSVNPU3RyaW5nKClgIHNoaWZ0cyB0byBVVEMsIG9mZiBieSBhIGRheSBwYXJ0IG9mIGV2ZXJ5IGRheS5cbiAqXG4gKiBAcGFyYW0ge0RhdGV8c3RyaW5nfSB2YWx1ZVxuICogQHJldHVybiB7c3RyaW5nfSBZLW0tZCwgb3IgYW4gZW1wdHkgc3RyaW5nIHdoZW4gdGhlIHZhbHVlIGlzIG5vdCBhIGRhdGUuXG4gKi9cbmV4cG9ydCBjb25zdCB0b1ltZCA9ICggdmFsdWUgKSA9PiB7XG5cdGNvbnN0IGRhdGUgPSB2YWx1ZSBpbnN0YW5jZW9mIERhdGUgPyB2YWx1ZSA6IG5ldyBEYXRlKCB2YWx1ZSApO1xuXG5cdGlmICggTnVtYmVyLmlzTmFOKCBkYXRlLmdldFRpbWUoKSApICkge1xuXHRcdHJldHVybiAnJztcblx0fVxuXG5cdGNvbnN0IG1vbnRoID0gU3RyaW5nKCBkYXRlLmdldE1vbnRoKCkgKyAxICkucGFkU3RhcnQoIDIsICcwJyApO1xuXHRjb25zdCBkYXkgPSBTdHJpbmcoIGRhdGUuZ2V0RGF0ZSgpICkucGFkU3RhcnQoIDIsICcwJyApO1xuXG5cdHJldHVybiBgJHsgZGF0ZS5nZXRGdWxsWWVhcigpIH0tJHsgbW9udGggfS0keyBkYXkgfWA7XG59O1xuXG4vKipcbiAqIEByZXR1cm4ge3N0cmluZ30gVG9kYXkgaW4gWS1tLWRcbiAqL1xuZXhwb3J0IGNvbnN0IHRvZGF5WW1kID0gKCkgPT4gdG9ZbWQoIG5ldyBEYXRlKCkgKTtcblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30geW1kIEEgWS1tLWQgZGF0ZS5cbiAqIEByZXR1cm4ge3N0cmluZ30gVGhlIGRhdGUgaW4gdGhlIHNpdGUncyBkaXNwbGF5IGZvcm1hdCwgb3IgYW4gZW1wdHkgc3RyaW5nLlxuICovXG5leHBvcnQgY29uc3QgZm9ybWF0U2l0ZURhdGUgPSAoIHltZCApID0+XG5cdHltZCA/IGRhdGVJMThuKCBnZXRTZXR0aW5ncygpLmZvcm1hdHMuZGF0ZSwgeW1kICkgOiAnJztcbiIsIi8qKlxuICogV29yZFByZXNzIGRlcGVuZGVuY2llc1xuICovXG5pbXBvcnQgeyBfXywgc3ByaW50ZiB9IGZyb20gJ0B3b3JkcHJlc3MvaTE4bic7XG5cbi8qKlxuICogTGFiZWwgZm9yIGEgXCJ2b2xnZW5zIGRlIHN0YW5kYWFyZGluc3RlbGxpbmdcIiByYWRpbyBvcHRpb24uXG4gKlxuICogQHBhcmFtIHs/T2JqZWN0fSBwZXJpb2REZWZhdWx0cyBgcmV2aWV3YCBvciBgcmVtaW5kZXJgIGZyb20gdGhlIGRlZmF1bHRzIGVuZHBvaW50LlxuICogQHJldHVybiB7c3RyaW5nfSBUcmFuc2xhdGVkIGxhYmVsLCBmYWxsaW5nIGJhY2sgdG8gYmFyZSB0ZXh0IHdoaWxlIGxvYWRpbmcuXG4gKi9cbmV4cG9ydCBjb25zdCBkZWZhdWx0U2V0dGluZ0xhYmVsID0gKCBwZXJpb2REZWZhdWx0cyApID0+IHtcblx0aWYgKCAhIHBlcmlvZERlZmF1bHRzPy5sYWJlbCApIHtcblx0XHRyZXR1cm4gX18oICdWb2xnZW5zIGRlIHN0YW5kYWFyZGluc3RlbGxpbmcnLCAneWFyZC1wYWdlLWd1YXJkJyApO1xuXHR9XG5cblx0cmV0dXJuIHNwcmludGYoXG5cdFx0LyogdHJhbnNsYXRvcnM6ICVzOiByZXNvbHZlZCBkZWZhdWx0IHBlcmlvZCwgZS5nLiBcIjEgd2Vla1wiLiAqL1xuXHRcdF9fKCAnVm9sZ2VucyBkZSBzdGFuZGFhcmRpbnN0ZWxsaW5nICglcyknLCAneWFyZC1wYWdlLWd1YXJkJyApLFxuXHRcdHBlcmlvZERlZmF1bHRzLmxhYmVsXG5cdCk7XG59O1xuIiwiLyoqXG4gKiBXb3JkUHJlc3MgZGVwZW5kZW5jaWVzXG4gKi9cbmNvbnN0IERhdGVQaWNrZXIgPSB3cC5jb21wb25lbnRzLkRhdGVQaWNrZXI7XG5jb25zdCBSYWRpb0NvbnRyb2wgPSB3cC5jb21wb25lbnRzLlJhZGlvQ29udHJvbDtcbmNvbnN0IFNwaW5uZXIgPSB3cC5jb21wb25lbnRzLlNwaW5uZXI7XG5jb25zdCBfXyA9IHdwLmkxOG4uX187XG5cbi8qKlxuICogSW50ZXJuYWwgZGVwZW5kZW5jaWVzXG4gKi9cbmltcG9ydCBTZWN0aW9uIGZyb20gJy4uL2NvbXBvbmVudHMvc2VjdGlvbi5qc3gnO1xuaW1wb3J0IHsgdXNlRGVmYXVsdHMgfSBmcm9tICcuLi9ob29rcy91c2UtZGVmYXVsdHMnO1xuaW1wb3J0IHsgdXNlUG9zdE1ldGEgfSBmcm9tICcuLi9ob29rcy91c2UtcG9zdC1tZXRhJztcbmltcG9ydCB7IE1FVEFfUkVWSUVXX0RBVEUsIE1FVEFfUkVWSUVXX0RBVEVfVFlQRSB9IGZyb20gJy4uL2NvbmZpZy9tZXRhLWtleXMnO1xuaW1wb3J0IHsgREFURV9UWVBFX0NVU1RPTSwgREFURV9UWVBFX0RFRkFVTFQgfSBmcm9tICcuLi9jb25maWcvY29uc3RhbnRzJztcbmltcG9ydCB7IHRvZGF5WW1kLCB0b1ltZCB9IGZyb20gJy4uL3V0aWxzL2RhdGUnO1xuaW1wb3J0IHsgZGVmYXVsdFNldHRpbmdMYWJlbCB9IGZyb20gJy4uL3V0aWxzL2RlZmF1bHQtbGFiZWwnO1xuXG5jb25zdCBSZXZpZXdEYXRlU2VjdGlvbiA9ICgpID0+IHtcblx0Y29uc3QgeyBkZWZhdWx0cywgaXNMb2FkaW5nIH0gPSB1c2VEZWZhdWx0cygpO1xuXHRjb25zdCBbIG1ldGEsIHVwZGF0ZU1ldGEgXSA9IHVzZVBvc3RNZXRhKCk7XG5cblx0Y29uc3QgdHlwZSA9IG1ldGFbIE1FVEFfUkVWSUVXX0RBVEVfVFlQRSBdIHx8IERBVEVfVFlQRV9ERUZBVUxUO1xuXHRjb25zdCBkYXRlID0gbWV0YVsgTUVUQV9SRVZJRVdfREFURSBdIHx8ICcnO1xuXG5cdGNvbnN0IG9uQ2hhbmdlVHlwZSA9ICggbmV4dFR5cGUgKSA9PiB7XG5cdFx0Ly8gQ2xlYXJpbmcgdGhlIGRhdGUgaXMgd2hhdCBtYWtlcyB0aGUgYmFja2VuZCByZXNvbHZlIHRoZSBzaXRlIGRlZmF1bHQgb24gc2F2ZS5cblx0XHR1cGRhdGVNZXRhKFxuXHRcdFx0REFURV9UWVBFX0NVU1RPTSA9PT0gbmV4dFR5cGVcblx0XHRcdFx0PyB7IFsgTUVUQV9SRVZJRVdfREFURV9UWVBFIF06IG5leHRUeXBlIH1cblx0XHRcdFx0OiB7XG5cdFx0XHRcdFx0XHRbIE1FVEFfUkVWSUVXX0RBVEVfVFlQRSBdOiBuZXh0VHlwZSxcblx0XHRcdFx0XHRcdFsgTUVUQV9SRVZJRVdfREFURSBdOiAnJyxcblx0XHRcdFx0ICB9XG5cdFx0KTtcblx0fTtcblxuXHRjb25zdCBkZWZhdWx0TGFiZWwgPSBkZWZhdWx0U2V0dGluZ0xhYmVsKCBkZWZhdWx0cz8ucmV2aWV3ICk7XG5cblx0cmV0dXJuIChcblx0XHQ8U2VjdGlvbj5cblx0XHRcdHsgaXNMb2FkaW5nICYmIDxTcGlubmVyIC8+IH1cblxuXHRcdFx0PFJhZGlvQ29udHJvbFxuXHRcdFx0XHRsYWJlbD17IF9fKCAnSGVyemllbmluZ3NkYXR1bScsICd5YXJkLXBhZ2UtZ3VhcmQnICkgfVxuXHRcdFx0XHRoZWxwPXsgX18oXG5cdFx0XHRcdFx0J0RhdHVtIHdhYXJvcCBkZSBpbmhvdWRzZWlnZW5hYXIgZGUgZWVyc3RlIGNvbnRyb2xlbWFpbCBvbnR2YW5ndC4nLFxuXHRcdFx0XHRcdCd5YXJkLXBhZ2UtZ3VhcmQnXG5cdFx0XHRcdCkgfVxuXHRcdFx0XHRzZWxlY3RlZD17IHR5cGUgfVxuXHRcdFx0XHRvcHRpb25zPXsgW1xuXHRcdFx0XHRcdHsgbGFiZWw6IGRlZmF1bHRMYWJlbCwgdmFsdWU6IERBVEVfVFlQRV9ERUZBVUxUIH0sXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0bGFiZWw6IF9fKFxuXHRcdFx0XHRcdFx0XHQnS2llcyBlZW5tYWxpZyBlZW4gYWZ3aWprZW5kZSBkYXR1bScsXG5cdFx0XHRcdFx0XHRcdCd5YXJkLXBhZ2UtZ3VhcmQnXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0dmFsdWU6IERBVEVfVFlQRV9DVVNUT00sXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XSB9XG5cdFx0XHRcdG9uQ2hhbmdlPXsgb25DaGFuZ2VUeXBlIH1cblx0XHRcdC8+XG5cblx0XHRcdHsgREFURV9UWVBFX0NVU1RPTSA9PT0gdHlwZSAmJiAoXG5cdFx0XHRcdDxEYXRlUGlja2VyXG5cdFx0XHRcdFx0Y3VycmVudERhdGU9eyBkYXRlIHx8IGRlZmF1bHRzPy5yZXZpZXc/LmRhdGUgfHwgbnVsbCB9XG5cdFx0XHRcdFx0b25DaGFuZ2U9eyAoIG5leHREYXRlICkgPT5cblx0XHRcdFx0XHRcdHVwZGF0ZU1ldGEoIHtcblx0XHRcdFx0XHRcdFx0WyBNRVRBX1JFVklFV19EQVRFIF06IHRvWW1kKCBuZXh0RGF0ZSApLFxuXHRcdFx0XHRcdFx0fSApXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlzSW52YWxpZERhdGU9eyAoIGNhbmRpZGF0ZSApID0+XG5cdFx0XHRcdFx0XHR0b1ltZCggY2FuZGlkYXRlICkgPCB0b2RheVltZCgpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQvPlxuXHRcdFx0KSB9XG5cdFx0PC9TZWN0aW9uPlxuXHQpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgUmV2aWV3RGF0ZVNlY3Rpb247XG5cblxuaWYgKGltcG9ydC5tZXRhLmhvdCkge1xuICAgIGltcG9ydC5tZXRhLmhvdC5vbigndml0ZTpiZWZvcmVVcGRhdGUnLCAoeyB1cGRhdGVzIH0pID0+IHtcbiAgICAgICAgY29uc3QgZWRpdG9ySWZyYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaWZyYW1lW25hbWU9XCJlZGl0b3ItY2FudmFzXCJdJyk7XG4gICAgICAgIGNvbnN0IGVkaXRvciA9IGVkaXRvcklmcmFtZT8uY29udGVudERvY3VtZW50O1xuXG4gICAgICAgIGlmICghZWRpdG9yKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGVzLmZvckVhY2goKHsgcGF0aCwgdHlwZSB9KSA9PiB7XG4gICAgICAgICAgICBpZiAodHlwZSAhPT0gJ2Nzcy11cGRhdGUnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBrZXkgPSBwYXRoLnNwbGl0KCc/JylbMF07XG5cbiAgICAgICAgICAgIGVkaXRvci5xdWVyeVNlbGVjdG9yQWxsKCdsaW5rW3JlbD1cInN0eWxlc2hlZXRcIl0nKS5mb3JFYWNoKGxpbmsgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghbGluay5ocmVmLmluY2x1ZGVzKGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IHVwZGF0ZWQgPSBsaW5rLmhyZWYuc3BsaXQoJz8nKVswXSArICc/ZGlyZWN0JnQ9JyArIERhdGUubm93KCk7XG5cbiAgICAgICAgICAgICAgICBsaW5rLmhyZWYgPSB1cGRhdGVkO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGVkaXRvci5xdWVyeVNlbGVjdG9yQWxsKCdzdHlsZScpLmZvckVhY2goc3R5bGUgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghc3R5bGUudGV4dENvbnRlbnQuaW5jbHVkZXMoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgaW1wb3J0UmVnZXggPSBuZXcgUmVnRXhwKGAoQGltcG9ydFxcXFxzKig/OnVybFxcXFwoWydcIl0/fFsnXCJdKSkoLio/JHtrZXl9W14nXCJcXFxcKV0qPykoPzpcXFxcP1teJ1wiXFxcXCldKik/KFsnXCJdP1xcXFwpKWAsICdnJyk7XG5cbiAgICAgICAgICAgICAgICBzdHlsZS50ZXh0Q29udGVudCA9IHN0eWxlLnRleHRDb250ZW50LnJlcGxhY2UoaW1wb3J0UmVnZXgsIChfLCBwcmVmaXgsIGltcG9ydFBhdGgsIHN1ZmZpeCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB1cGRhdGVkID0gaW1wb3J0UGF0aC5zcGxpdCgnPycpWzBdO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmVmaXggKyB1cGRhdGVkICsgJz9kaXJlY3QmdD0nICsgRGF0ZS5ub3coKSArIHN1ZmZpeDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0iLCIvKipcbiAqIFdvcmRQcmVzcyBkZXBlbmRlbmNpZXNcbiAqL1xuY29uc3QgUmFkaW9Db250cm9sID0gd3AuY29tcG9uZW50cy5SYWRpb0NvbnRyb2w7XG5jb25zdCBTZWxlY3RDb250cm9sID0gd3AuY29tcG9uZW50cy5TZWxlY3RDb250cm9sO1xuY29uc3QgU3Bpbm5lciA9IHdwLmNvbXBvbmVudHMuU3Bpbm5lcjtcbmNvbnN0IEhTdGFjayA9IHdwLmNvbXBvbmVudHMuX19leHBlcmltZW50YWxIU3RhY2s7XG5jb25zdCBOdW1iZXJDb250cm9sID0gd3AuY29tcG9uZW50cy5fX2V4cGVyaW1lbnRhbE51bWJlckNvbnRyb2w7XG5jb25zdCBfXyA9IHdwLmkxOG4uX187XG5cbi8qKlxuICogSW50ZXJuYWwgZGVwZW5kZW5jaWVzXG4gKi9cbmltcG9ydCBTZWN0aW9uIGZyb20gJy4uL2NvbXBvbmVudHMvc2VjdGlvbi5qc3gnO1xuaW1wb3J0IHsgdXNlRGVmYXVsdHMgfSBmcm9tICcuLi9ob29rcy91c2UtZGVmYXVsdHMnO1xuaW1wb3J0IHsgdXNlUG9zdE1ldGEgfSBmcm9tICcuLi9ob29rcy91c2UtcG9zdC1tZXRhJztcbmltcG9ydCB7IGRlZmF1bHRTZXR0aW5nTGFiZWwgfSBmcm9tICcuLi91dGlscy9kZWZhdWx0LWxhYmVsJztcbmltcG9ydCB7XG5cdE1FVEFfUkVNSU5ERVJfVElNRV9QRVJJT0QsXG5cdE1FVEFfUkVNSU5ERVJfVElNRV9UWVBFLFxuXHRNRVRBX1JFTUlOREVSX1RJTUVfVU5JVCxcbn0gZnJvbSAnLi4vY29uZmlnL21ldGEta2V5cyc7XG5pbXBvcnQgeyBEQVRFX1RZUEVfQ1VTVE9NLCBEQVRFX1RZUEVfREVGQVVMVCB9IGZyb20gJy4uL2NvbmZpZy9jb25zdGFudHMnO1xuXG5jb25zdCBVTklUX09QVElPTlMgPSBbXG5cdHsgbGFiZWw6IF9fKCAnRGFnZW4nLCAneWFyZC1wYWdlLWd1YXJkJyApLCB2YWx1ZTogJ2RheXMnIH0sXG5cdHsgbGFiZWw6IF9fKCAnV2VrZW4nLCAneWFyZC1wYWdlLWd1YXJkJyApLCB2YWx1ZTogJ3dlZWtzJyB9LFxuXHR7IGxhYmVsOiBfXyggJ01hYW5kZW4nLCAneWFyZC1wYWdlLWd1YXJkJyApLCB2YWx1ZTogJ21vbnRocycgfSxcbl07XG5cbmNvbnN0IFJlbWluZGVyUGVyaW9kU2VjdGlvbiA9ICgpID0+IHtcblx0Y29uc3QgeyBkZWZhdWx0cywgaXNMb2FkaW5nIH0gPSB1c2VEZWZhdWx0cygpO1xuXHRjb25zdCBbIG1ldGEsIHVwZGF0ZU1ldGEgXSA9IHVzZVBvc3RNZXRhKCk7XG5cblx0Y29uc3QgdHlwZSA9IG1ldGFbIE1FVEFfUkVNSU5ERVJfVElNRV9UWVBFIF0gfHwgREFURV9UWVBFX0RFRkFVTFQ7XG5cdGNvbnN0IHBlcmlvZCA9IG1ldGFbIE1FVEFfUkVNSU5ERVJfVElNRV9QRVJJT0QgXSB8fCAwO1xuXHRjb25zdCB1bml0ID0gbWV0YVsgTUVUQV9SRU1JTkRFUl9USU1FX1VOSVQgXSB8fCAnJztcblxuXHRjb25zdCBvbkNoYW5nZVR5cGUgPSAoIG5leHRUeXBlICkgPT4ge1xuXHRcdGlmICggREFURV9UWVBFX0NVU1RPTSAhPT0gbmV4dFR5cGUgKSB7XG5cdFx0XHR1cGRhdGVNZXRhKCB7XG5cdFx0XHRcdFsgTUVUQV9SRU1JTkRFUl9USU1FX1RZUEUgXTogbmV4dFR5cGUsXG5cdFx0XHRcdFsgTUVUQV9SRU1JTkRFUl9USU1FX1BFUklPRCBdOiAwLFxuXHRcdFx0XHRbIE1FVEFfUkVNSU5ERVJfVElNRV9VTklUIF06ICcnLFxuXHRcdFx0fSApO1xuXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gQW4gaW5jb21wbGV0ZSBvdmVycmlkZSBmYWxscyBiYWNrIHRvIHRoZSBzaXRlIGRlZmF1bHQsIHNvIHNlZWQgYm90aCBmaWVsZHMuXG5cdFx0dXBkYXRlTWV0YSgge1xuXHRcdFx0WyBNRVRBX1JFTUlOREVSX1RJTUVfVFlQRSBdOiBuZXh0VHlwZSxcblx0XHRcdFsgTUVUQV9SRU1JTkRFUl9USU1FX1BFUklPRCBdOlxuXHRcdFx0XHRwZXJpb2QgfHwgZGVmYXVsdHM/LnJlbWluZGVyPy5wZXJpb2QgfHwgMSxcblx0XHRcdFsgTUVUQV9SRU1JTkRFUl9USU1FX1VOSVQgXTpcblx0XHRcdFx0dW5pdCB8fCBkZWZhdWx0cz8ucmVtaW5kZXI/LnVuaXQgfHwgJ3dlZWtzJyxcblx0XHR9ICk7XG5cdH07XG5cblx0Y29uc3QgZGVmYXVsdExhYmVsID0gZGVmYXVsdFNldHRpbmdMYWJlbCggZGVmYXVsdHM/LnJlbWluZGVyICk7XG5cblx0cmV0dXJuIChcblx0XHQ8U2VjdGlvbj5cblx0XHRcdHsgaXNMb2FkaW5nICYmIDxTcGlubmVyIC8+IH1cblxuXHRcdFx0PFJhZGlvQ29udHJvbFxuXHRcdFx0XHRsYWJlbD17IF9fKCAnSGVyaW5uZXJpbmdzcGVyaW9kZScsICd5YXJkLXBhZ2UtZ3VhcmQnICkgfVxuXHRcdFx0XHRoZWxwPXsgX18oXG5cdFx0XHRcdFx0J1BlcmlvZGUgd2Fhcm5hIGVlbiBoZXJpbm5lcmluZyB2b2xndCBhbHMgZGUgY29udHJvbGUgbm9nIG5pZXQgaXMgYWZnZXJvbmQuJyxcblx0XHRcdFx0XHQneWFyZC1wYWdlLWd1YXJkJ1xuXHRcdFx0XHQpIH1cblx0XHRcdFx0c2VsZWN0ZWQ9eyB0eXBlIH1cblx0XHRcdFx0b3B0aW9ucz17IFtcblx0XHRcdFx0XHR7IGxhYmVsOiBkZWZhdWx0TGFiZWwsIHZhbHVlOiBEQVRFX1RZUEVfREVGQVVMVCB9LFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGxhYmVsOiBfXyhcblx0XHRcdFx0XHRcdFx0J0tpZXMgZWVuIGFmd2lqa2VuZGUgcGVyaW9kZScsXG5cdFx0XHRcdFx0XHRcdCd5YXJkLXBhZ2UtZ3VhcmQnXG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0dmFsdWU6IERBVEVfVFlQRV9DVVNUT00sXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XSB9XG5cdFx0XHRcdG9uQ2hhbmdlPXsgb25DaGFuZ2VUeXBlIH1cblx0XHRcdC8+XG5cblx0XHRcdHsgREFURV9UWVBFX0NVU1RPTSA9PT0gdHlwZSAmJiAoXG5cdFx0XHRcdDxIU3RhY2sgYWxpZ25tZW50PVwiYm90dG9tXCIgc3BhY2luZz17IDIgfT5cblx0XHRcdFx0XHQ8TnVtYmVyQ29udHJvbFxuXHRcdFx0XHRcdFx0X19uZXh0NDBweERlZmF1bHRTaXplXG5cdFx0XHRcdFx0XHRsYWJlbD17IF9fKCAnQWFudGFsJywgJ3lhcmQtcGFnZS1ndWFyZCcgKSB9XG5cdFx0XHRcdFx0XHRtaW49eyAxIH1cblx0XHRcdFx0XHRcdHN0ZXA9eyAxIH1cblx0XHRcdFx0XHRcdHZhbHVlPXsgcGVyaW9kIH1cblx0XHRcdFx0XHRcdG9uQ2hhbmdlPXsgKCBuZXh0VmFsdWUgKSA9PlxuXHRcdFx0XHRcdFx0XHR1cGRhdGVNZXRhKCB7XG5cdFx0XHRcdFx0XHRcdFx0WyBNRVRBX1JFTUlOREVSX1RJTUVfUEVSSU9EIF06XG5cdFx0XHRcdFx0XHRcdFx0XHROdW1iZXIucGFyc2VJbnQoIG5leHRWYWx1ZSwgMTAgKSB8fCAwLFxuXHRcdFx0XHRcdFx0XHR9IClcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvPlxuXHRcdFx0XHRcdDxTZWxlY3RDb250cm9sXG5cdFx0XHRcdFx0XHRfX25leHQ0MHB4RGVmYXVsdFNpemVcblx0XHRcdFx0XHRcdF9fbmV4dEhhc05vTWFyZ2luQm90dG9tXG5cdFx0XHRcdFx0XHRjbGFzc05hbWU9XCJ5cGctcmVtaW5kZXItdW5pdC1zZWxlY3RcIlxuXHRcdFx0XHRcdFx0bGFiZWw9eyBfXyggJ0VlbmhlaWQnLCAneWFyZC1wYWdlLWd1YXJkJyApIH1cblx0XHRcdFx0XHRcdHZhbHVlPXsgdW5pdCB9XG5cdFx0XHRcdFx0XHRvcHRpb25zPXsgVU5JVF9PUFRJT05TIH1cblx0XHRcdFx0XHRcdG9uQ2hhbmdlPXsgKCBuZXh0VW5pdCApID0+XG5cdFx0XHRcdFx0XHRcdHVwZGF0ZU1ldGEoIHtcblx0XHRcdFx0XHRcdFx0XHRbIE1FVEFfUkVNSU5ERVJfVElNRV9VTklUIF06IG5leHRVbml0LFxuXHRcdFx0XHRcdFx0XHR9IClcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvPlxuXHRcdFx0XHQ8L0hTdGFjaz5cblx0XHRcdCkgfVxuXHRcdDwvU2VjdGlvbj5cblx0KTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFJlbWluZGVyUGVyaW9kU2VjdGlvbjtcblxuXG5pZiAoaW1wb3J0Lm1ldGEuaG90KSB7XG4gICAgaW1wb3J0Lm1ldGEuaG90Lm9uKCd2aXRlOmJlZm9yZVVwZGF0ZScsICh7IHVwZGF0ZXMgfSkgPT4ge1xuICAgICAgICBjb25zdCBlZGl0b3JJZnJhbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdpZnJhbWVbbmFtZT1cImVkaXRvci1jYW52YXNcIl0nKTtcbiAgICAgICAgY29uc3QgZWRpdG9yID0gZWRpdG9ySWZyYW1lPy5jb250ZW50RG9jdW1lbnQ7XG5cbiAgICAgICAgaWYgKCFlZGl0b3IpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZXMuZm9yRWFjaCgoeyBwYXRoLCB0eXBlIH0pID0+IHtcbiAgICAgICAgICAgIGlmICh0eXBlICE9PSAnY3NzLXVwZGF0ZScpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGtleSA9IHBhdGguc3BsaXQoJz8nKVswXTtcblxuICAgICAgICAgICAgZWRpdG9yLnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpbmtbcmVsPVwic3R5bGVzaGVldFwiXScpLmZvckVhY2gobGluayA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFsaW5rLmhyZWYuaW5jbHVkZXMoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgdXBkYXRlZCA9IGxpbmsuaHJlZi5zcGxpdCgnPycpWzBdICsgJz9kaXJlY3QmdD0nICsgRGF0ZS5ub3coKTtcblxuICAgICAgICAgICAgICAgIGxpbmsuaHJlZiA9IHVwZGF0ZWQ7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZWRpdG9yLnF1ZXJ5U2VsZWN0b3JBbGwoJ3N0eWxlJykuZm9yRWFjaChzdHlsZSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFzdHlsZS50ZXh0Q29udGVudC5pbmNsdWRlcyhrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBpbXBvcnRSZWdleCA9IG5ldyBSZWdFeHAoYChAaW1wb3J0XFxcXHMqKD86dXJsXFxcXChbJ1wiXT98WydcIl0pKSguKj8ke2tleX1bXidcIlxcXFwpXSo/KSg/OlxcXFw/W14nXCJcXFxcKV0qKT8oWydcIl0/XFxcXCkpYCwgJ2cnKTtcblxuICAgICAgICAgICAgICAgIHN0eWxlLnRleHRDb250ZW50ID0gc3R5bGUudGV4dENvbnRlbnQucmVwbGFjZShpbXBvcnRSZWdleCwgKF8sIHByZWZpeCwgaW1wb3J0UGF0aCwgc3VmZml4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHVwZGF0ZWQgPSBpbXBvcnRQYXRoLnNwbGl0KCc/JylbMF07XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByZWZpeCArIHVwZGF0ZWQgKyAnP2RpcmVjdCZ0PScgKyBEYXRlLm5vdygpICsgc3VmZml4O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSIsIi8qKlxuICogV29yZFByZXNzIGRlcGVuZGVuY2llc1xuICovXG5pbXBvcnQgeyB1c2VTZWxlY3QgfSBmcm9tICdAd29yZHByZXNzL2RhdGEnO1xuaW1wb3J0IHsgc3RvcmUgYXMgZWRpdG9yU3RvcmUgfSBmcm9tICdAd29yZHByZXNzL2VkaXRvcic7XG5cbi8qKlxuICogRWRpdG9yIHN0YXRlIG5lZWRlZCB0byB0ZWxsIGlmIHdyaXRpbmcgc3RyYWlnaHQgdG8gdGhlIERCIGlzIHNhZmUuXG4gKlxuICogQHJldHVybiB7e3Bvc3RJZDogbnVtYmVyLCBpc05ldzogYm9vbGVhbiwgaXNEaXJ0eTogYm9vbGVhbiwgaXNTYXZpbmc6IGJvb2xlYW59fSBFZGl0b3Igc3RhdGUuXG4gKi9cbmV4cG9ydCBjb25zdCB1c2VFZGl0b3JQb3N0ID0gKCkgPT5cblx0dXNlU2VsZWN0KCAoIHNlbGVjdCApID0+IHtcblx0XHRjb25zdCBlZGl0b3IgPSBzZWxlY3QoIGVkaXRvclN0b3JlICk7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cG9zdElkOiBlZGl0b3IuZ2V0Q3VycmVudFBvc3RJZCgpLFxuXHRcdFx0aXNOZXc6IGVkaXRvci5pc0VkaXRlZFBvc3ROZXcoKSxcblx0XHRcdGlzRGlydHk6IGVkaXRvci5pc0VkaXRlZFBvc3REaXJ0eSgpLFxuXHRcdFx0aXNTYXZpbmc6IGVkaXRvci5pc1NhdmluZ1Bvc3QoKSxcblx0XHR9O1xuXHR9LCBbXSApO1xuIiwiLyoqXG4gKiBXb3JkUHJlc3MgZGVwZW5kZW5jaWVzXG4gKi9cbmltcG9ydCB7IHN0b3JlIGFzIGNvcmVTdG9yZSB9IGZyb20gJ0B3b3JkcHJlc3MvY29yZS1kYXRhJztcbmltcG9ydCB7IHVzZURpc3BhdGNoLCB1c2VTZWxlY3QgfSBmcm9tICdAd29yZHByZXNzL2RhdGEnO1xuaW1wb3J0IHsgc3RvcmUgYXMgZWRpdG9yU3RvcmUgfSBmcm9tICdAd29yZHByZXNzL2VkaXRvcic7XG5pbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlU3RhdGUgfSBmcm9tICdAd29yZHByZXNzL2VsZW1lbnQnO1xuaW1wb3J0IHsgX18gfSBmcm9tICdAd29yZHByZXNzL2kxOG4nO1xuXG4vKipcbiAqIEludGVybmFsIGRlcGVuZGVuY2llc1xuICovXG5pbXBvcnQgeyBtYXJrUmV2aWV3ZWQgYXMgbWFya1Jldmlld2VkUmVxdWVzdCB9IGZyb20gJy4uL2FwaSc7XG5cbmNvbnN0IElETEUgPSB7IGlzU2F2aW5nOiBmYWxzZSwgZXJyb3I6IG51bGwsIGlzU3VjY2VzczogZmFsc2UgfTtcblxuLyoqXG4gKiBQb3N0cyB0aGUgXCJyZXZpZXdlZFwiIGFjdGlvbiBhbmQgZXhwb3NlcyBpdHMgcmVzdWx0IGZvciBhIG5vdGljZS5cbiAqXG4gKiBAcGFyYW0gez9udW1iZXJ9ICBwb3N0SWRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IG9uU3VjY2VzcyBDYWxsZWQgYWZ0ZXIgYSBzdWNjZXNzZnVsIHdyaXRlLCB0byByZWZyZXNoIGRlcml2ZWQgc3RhdGUuXG4gKiBAcmV0dXJuIHt7bWFya1Jldmlld2VkOiBGdW5jdGlvbiwgaXNTYXZpbmc6IGJvb2xlYW4sIGVycm9yOiA/c3RyaW5nLCBpc1N1Y2Nlc3M6IGJvb2xlYW59fSBSZXF1ZXN0IHN0YXRlLlxuICovXG5leHBvcnQgY29uc3QgdXNlTWFya1Jldmlld2VkID0gKCBwb3N0SWQsIG9uU3VjY2VzcyApID0+IHtcblx0Y29uc3QgWyBzdGF0ZSwgc2V0U3RhdGUgXSA9IHVzZVN0YXRlKCBJRExFICk7XG5cdGNvbnN0IHBvc3RUeXBlID0gdXNlU2VsZWN0KFxuXHRcdCggc2VsZWN0ICkgPT4gc2VsZWN0KCBlZGl0b3JTdG9yZSApLmdldEN1cnJlbnRQb3N0VHlwZSgpLFxuXHRcdFtdXG5cdCk7XG5cdGNvbnN0IHsgaW52YWxpZGF0ZVJlc29sdXRpb24gfSA9IHVzZURpc3BhdGNoKCBjb3JlU3RvcmUgKTtcblxuXHRjb25zdCBtYXJrUmV2aWV3ZWQgPSB1c2VDYWxsYmFjayggYXN5bmMgKCkgPT4ge1xuXHRcdGlmICggISBwb3N0SWQgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0c2V0U3RhdGUoIHsgaXNTYXZpbmc6IHRydWUsIGVycm9yOiBudWxsLCBpc1N1Y2Nlc3M6IGZhbHNlIH0gKTtcblxuXHRcdHRyeSB7XG5cdFx0XHRhd2FpdCBtYXJrUmV2aWV3ZWRSZXF1ZXN0KCBwb3N0SWQgKTtcblxuXHRcdFx0Ly8gRW5kcG9pbnQgcmVzZXRzIFJFVklFV19EQVRFX1RZUEUvUkVWSUVXX0RBVEUgc2VydmVyIHNpZGU7IGRyb3AgY2FjaGUgb3Igc3RhbGUgdmFsdWVzIGdldCBQQVRDSGVkIGJhY2suXG5cdFx0XHRpbnZhbGlkYXRlUmVzb2x1dGlvbiggJ2dldEVudGl0eVJlY29yZCcsIFtcblx0XHRcdFx0J3Bvc3RUeXBlJyxcblx0XHRcdFx0cG9zdFR5cGUsXG5cdFx0XHRcdHBvc3RJZCxcblx0XHRcdF0gKTtcblxuXHRcdFx0c2V0U3RhdGUoIHsgaXNTYXZpbmc6IGZhbHNlLCBlcnJvcjogbnVsbCwgaXNTdWNjZXNzOiB0cnVlIH0gKTtcblx0XHRcdG9uU3VjY2Vzcz8uKCk7XG5cdFx0fSBjYXRjaCAoIGVycm9yICkge1xuXHRcdFx0c2V0U3RhdGUoIHtcblx0XHRcdFx0aXNTYXZpbmc6IGZhbHNlLFxuXHRcdFx0XHRlcnJvcjpcblx0XHRcdFx0XHRlcnJvcj8ubWVzc2FnZSB8fFxuXHRcdFx0XHRcdF9fKFxuXHRcdFx0XHRcdFx0J0RlIHBhZ2luYSBrb24gbmlldCBhbHMgZ2Vjb250cm9sZWVyZCB3b3JkZW4gZ2VtYXJrZWVyZC4nLFxuXHRcdFx0XHRcdFx0J3lhcmQtcGFnZS1ndWFyZCdcblx0XHRcdFx0XHQpLFxuXHRcdFx0XHRpc1N1Y2Nlc3M6IGZhbHNlLFxuXHRcdFx0fSApO1xuXHRcdH1cblx0fSwgWyBwb3N0SWQsIHBvc3RUeXBlLCBpbnZhbGlkYXRlUmVzb2x1dGlvbiwgb25TdWNjZXNzIF0gKTtcblxuXHRyZXR1cm4geyBtYXJrUmV2aWV3ZWQsIC4uLnN0YXRlIH07XG59O1xuIiwiLyoqXG4gKiBJbnRlcm5hbCBkZXBlbmRlbmNpZXNcbiAqL1xuaW1wb3J0IHsgTUVUQV9SRVZJRVdfREFURSB9IGZyb20gJy4uL2NvbmZpZy9tZXRhLWtleXMnO1xuaW1wb3J0IHsgZm9ybWF0U2l0ZURhdGUgfSBmcm9tICcuLi91dGlscy9kYXRlJztcbmltcG9ydCB7IHVzZURlZmF1bHRzIH0gZnJvbSAnLi91c2UtZGVmYXVsdHMnO1xuaW1wb3J0IHsgdXNlUG9zdE1ldGEgfSBmcm9tICcuL3VzZS1wb3N0LW1ldGEnO1xuXG4vKipcbiAqIFRoZSByZXZpZXcgZGF0ZSBhcyBpdCB3aWxsIGJlIHN0b3JlZCwgc28gdGhlIHN0YXR1cyB1cGRhdGVzIHdoaWxlIGVkaXRpbmdcbiAqIGluc3RlYWQgb2YgYWZ0ZXIgYSBzYXZlLlxuICpcbiAqIEFuIGVtcHR5IFJFVklFV19EQVRFIG1lYW5zIHRoZSB1c2VyIHBpY2tlZCB0aGUgc2l0ZSBkZWZhdWx0IGFuZCB0aGUgYmFja2VuZFxuICogc3RpbGwgaGFzIHRvIHJlc29sdmUgaXQsIHNvIHRoZSBlbmRwb2ludCdzIHByZXZpZXcgc3RhbmRzIGluIHVudGlsIHRoZW4uXG4gKlxuICogQHJldHVybiB7c3RyaW5nfSBEaXNwbGF5IGZvcm1hdHRlZCBkYXRlLCBvciBhbiBlbXB0eSBzdHJpbmcgd2hpbGUgbG9hZGluZy5cbiAqL1xuZXhwb3J0IGNvbnN0IHVzZU5leHRSZXZpZXdEYXRlID0gKCkgPT4ge1xuXHRjb25zdCBbIG1ldGEgXSA9IHVzZVBvc3RNZXRhKCk7XG5cdGNvbnN0IHsgZGVmYXVsdHMgfSA9IHVzZURlZmF1bHRzKCk7XG5cblx0Y29uc3QgZGF0ZSA9IG1ldGFbIE1FVEFfUkVWSUVXX0RBVEUgXSB8fCAnJztcblxuXHRyZXR1cm4gZGF0ZSA/IGZvcm1hdFNpdGVEYXRlKCBkYXRlICkgOiBkZWZhdWx0cz8ucmV2aWV3Py5mb3JtYXR0ZWQgPz8gJyc7XG59O1xuIiwiLyoqXG4gKiBXb3JkUHJlc3MgZGVwZW5kZW5jaWVzXG4gKi9cbmltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VTdGF0ZSB9IGZyb20gJ0B3b3JkcHJlc3MvZWxlbWVudCc7XG5cbi8qKlxuICogSW50ZXJuYWwgZGVwZW5kZW5jaWVzXG4gKi9cbmltcG9ydCB7IGZldGNoUmV2aWV3U3RhdHVzIH0gZnJvbSAnLi4vYXBpJztcbmltcG9ydCB7IHVzZUFzeW5jRGF0YSB9IGZyb20gJy4vdXNlLWFzeW5jLWRhdGEnO1xuXG4vKipcbiAqIERlcml2ZWQgcmV2aWV3IHN0YXRlIG9mIGEgcG9zdFxuICpcbiAqIEBwYXJhbSB7P251bWJlcn0gcG9zdElkIFBvc3QgdG8gcmVhZCwgb3IgYSBmYWxzeSB2YWx1ZSB3aGlsZSB0aGUgcG9zdCBpcyBub3QgcGVyc2lzdGVkLlxuICogQHJldHVybiB7e3N0YXR1czogP09iamVjdCwgaXNMb2FkaW5nOiBib29sZWFuLCBlcnJvcjogP09iamVjdCwgcmVmcmVzaDogRnVuY3Rpb259fSBSZXF1ZXN0IHN0YXRlLlxuICovXG5leHBvcnQgY29uc3QgdXNlUmV2aWV3U3RhdHVzID0gKCBwb3N0SWQgKSA9PiB7XG5cdGNvbnN0IFsgdG9rZW4sIHNldFRva2VuIF0gPSB1c2VTdGF0ZSggMCApO1xuXG5cdGNvbnN0IGZldGNoZXIgPSB1c2VDYWxsYmFjayhcblx0XHQoKSA9PlxuXHRcdFx0cG9zdElkID8gZmV0Y2hSZXZpZXdTdGF0dXMoIHBvc3RJZCApIDogUHJvbWlzZS5yZXNvbHZlKCBudWxsICksXG5cdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0LWhvb2tzL2V4aGF1c3RpdmUtZGVwc1xuXHRcdFsgcG9zdElkLCB0b2tlbiBdXG5cdCk7XG5cblx0Y29uc3QgeyBkYXRhLCBpc0xvYWRpbmcsIGVycm9yIH0gPSB1c2VBc3luY0RhdGEoIGZldGNoZXIgKTtcblxuXHRyZXR1cm4ge1xuXHRcdHN0YXR1czogZGF0YSxcblx0XHRpc0xvYWRpbmcsXG5cdFx0ZXJyb3IsXG5cdFx0cmVmcmVzaDogdXNlQ2FsbGJhY2soICgpID0+IHNldFRva2VuKCAoIHZhbHVlICkgPT4gdmFsdWUgKyAxICksIFtdICksXG5cdH07XG59O1xuIiwiLyoqXG4gKiBXb3JkUHJlc3MgZGVwZW5kZW5jaWVzXG4gKi9cbmNvbnN0IEJ1dHRvbiA9IHdwLmNvbXBvbmVudHMuQnV0dG9uO1xuY29uc3QgTm90aWNlID0gd3AuY29tcG9uZW50cy5Ob3RpY2U7XG5jb25zdCBTcGlubmVyID0gd3AuY29tcG9uZW50cy5TcGlubmVyO1xuY29uc3QgVGV4dCA9IHdwLmNvbXBvbmVudHMuX19leHBlcmltZW50YWxUZXh0O1xuY29uc3QgVlN0YWNrID0gd3AuY29tcG9uZW50cy5fX2V4cGVyaW1lbnRhbFZTdGFjaztcbmNvbnN0IF9fID0gd3AuaTE4bi5fXztcblxuLyoqXG4gKiBJbnRlcm5hbCBkZXBlbmRlbmNpZXNcbiAqL1xuaW1wb3J0IFNlY3Rpb24gZnJvbSAnLi4vY29tcG9uZW50cy9zZWN0aW9uLmpzeCc7XG5pbXBvcnQgeyB1c2VFZGl0b3JQb3N0IH0gZnJvbSAnLi4vaG9va3MvdXNlLWVkaXRvci1wb3N0JztcbmltcG9ydCB7IHVzZU1hcmtSZXZpZXdlZCB9IGZyb20gJy4uL2hvb2tzL3VzZS1tYXJrLXJldmlld2VkJztcbmltcG9ydCB7IHVzZU5leHRSZXZpZXdEYXRlIH0gZnJvbSAnLi4vaG9va3MvdXNlLW5leHQtcmV2aWV3LWRhdGUnO1xuaW1wb3J0IHsgdXNlUmV2aWV3U3RhdHVzIH0gZnJvbSAnLi4vaG9va3MvdXNlLXJldmlldy1zdGF0dXMnO1xuXG5jb25zdCBTdGF0dXNTZWN0aW9uID0gKCkgPT4ge1xuXHRjb25zdCB7IHBvc3RJZCwgaXNOZXcsIGlzRGlydHksIGlzU2F2aW5nIH0gPSB1c2VFZGl0b3JQb3N0KCk7XG5cdGNvbnN0IHsgc3RhdHVzLCBpc0xvYWRpbmcsIHJlZnJlc2ggfSA9IHVzZVJldmlld1N0YXR1cyhcblx0XHRpc05ldyA/IG51bGwgOiBwb3N0SWRcblx0KTtcblx0Y29uc3Qge1xuXHRcdG1hcmtSZXZpZXdlZCxcblx0XHRpc1NhdmluZzogaXNNYXJraW5nLFxuXHRcdGVycm9yLFxuXHRcdGlzU3VjY2Vzcyxcblx0fSA9IHVzZU1hcmtSZXZpZXdlZCggcG9zdElkLCByZWZyZXNoICk7XG5cblx0Y29uc3QgaXNCbG9ja2VkID0gaXNOZXcgfHwgaXNEaXJ0eSB8fCBpc1NhdmluZztcblxuXHRjb25zdCBsYXN0UmV2aWV3ZWQgPSBzdGF0dXM/Lmxhc3RSZXZpZXdEYXRlPy5mb3JtYXR0ZWQ7XG5cdGNvbnN0IG5leHRSZXZpZXcgPSB1c2VOZXh0UmV2aWV3RGF0ZSgpO1xuXG5cdGNvbnN0IGJsb2NrZWRIZWxwID0gaXNOZXdcblx0XHQ/IF9fKCAnUHVibGljZWVyIG9mIHNsYSBkZXplIHBhZ2luYSBlZXJzdCBvcC4nLCAneWFyZC1wYWdlLWd1YXJkJyApXG5cdFx0OiBfXyggJ1NsYSBqZSB3aWp6aWdpbmdlbiBlZXJzdCBvcC4nLCAneWFyZC1wYWdlLWd1YXJkJyApO1xuXG5cdGNvbnN0IGJ1dHRvbkhlbHAgPSBpc0Jsb2NrZWRcblx0XHQ/IGJsb2NrZWRIZWxwXG5cdFx0OiBfXyhcblx0XHRcdFx0J0JldmVzdGlndCBkYXQgamUgZGUgaW5ob3VkIHZhbiBkZXplIHBhZ2luYSBvcG5pZXV3IGhlYnQgZ2Vjb250cm9sZWVyZC4nLFxuXHRcdFx0XHQneWFyZC1wYWdlLWd1YXJkJ1xuXHRcdCAgKTtcblxuXHRyZXR1cm4gKFxuXHRcdDxTZWN0aW9uIHRpdGxlPXsgX18oICdTdGF0dXMnLCAneWFyZC1wYWdlLWd1YXJkJyApIH0+XG5cdFx0XHR7IGlzTG9hZGluZyAmJiA8U3Bpbm5lciAvPiB9XG5cblx0XHRcdHsgISBpc0xvYWRpbmcgJiYgKFxuXHRcdFx0XHQ8VlN0YWNrIHNwYWNpbmc9eyAzIH0+XG5cdFx0XHRcdFx0PFZTdGFjayBzcGFjaW5nPXsgMCB9PlxuXHRcdFx0XHRcdFx0PFRleHQgdmFyaWFudD1cIm11dGVkXCI+XG5cdFx0XHRcdFx0XHRcdHsgX18oICdMYWF0c3QgZ2Vjb250cm9sZWVyZCcsICd5YXJkLXBhZ2UtZ3VhcmQnICkgfVxuXHRcdFx0XHRcdFx0PC9UZXh0PlxuXHRcdFx0XHRcdFx0PFRleHQ+XG5cdFx0XHRcdFx0XHRcdHsgbGFzdFJldmlld2VkIHx8XG5cdFx0XHRcdFx0XHRcdFx0X18oXG5cdFx0XHRcdFx0XHRcdFx0XHQnTm9nIG5pZXQgZ2Vjb250cm9sZWVyZCcsXG5cdFx0XHRcdFx0XHRcdFx0XHQneWFyZC1wYWdlLWd1YXJkJ1xuXHRcdFx0XHRcdFx0XHRcdCkgfVxuXHRcdFx0XHRcdFx0PC9UZXh0PlxuXHRcdFx0XHRcdDwvVlN0YWNrPlxuXG5cdFx0XHRcdFx0PFZTdGFjayBzcGFjaW5nPXsgMCB9PlxuXHRcdFx0XHRcdFx0PFRleHQgdmFyaWFudD1cIm11dGVkXCI+XG5cdFx0XHRcdFx0XHRcdHsgX18oXG5cdFx0XHRcdFx0XHRcdFx0J1ZvbGdlbmRlIGhlcnppZW5pbmdzZGF0dW0nLFxuXHRcdFx0XHRcdFx0XHRcdCd5YXJkLXBhZ2UtZ3VhcmQnXG5cdFx0XHRcdFx0XHRcdCkgfVxuXHRcdFx0XHRcdFx0PC9UZXh0PlxuXHRcdFx0XHRcdFx0PFRleHQ+XG5cdFx0XHRcdFx0XHRcdHsgbmV4dFJldmlldyB8fFxuXHRcdFx0XHRcdFx0XHRcdF9fKCAnTm9nIG5pZXQgaW5nZXN0ZWxkJywgJ3lhcmQtcGFnZS1ndWFyZCcgKSB9XG5cdFx0XHRcdFx0XHQ8L1RleHQ+XG5cdFx0XHRcdFx0PC9WU3RhY2s+XG5cdFx0XHRcdDwvVlN0YWNrPlxuXHRcdFx0KSB9XG5cblx0XHRcdDxCdXR0b25cblx0XHRcdFx0X19uZXh0NDBweERlZmF1bHRTaXplXG5cdFx0XHRcdHZhcmlhbnQ9XCJzZWNvbmRhcnlcIlxuXHRcdFx0XHRpY29uPVwieWVzXCJcblx0XHRcdFx0ZGlzYWJsZWQ9eyBpc0Jsb2NrZWQgfHwgaXNNYXJraW5nIH1cblx0XHRcdFx0YWNjZXNzaWJsZVdoZW5EaXNhYmxlZFxuXHRcdFx0XHRpc0J1c3k9eyBpc01hcmtpbmcgfVxuXHRcdFx0XHRvbkNsaWNrPXsgbWFya1Jldmlld2VkIH1cblx0XHRcdD5cblx0XHRcdFx0eyBfXyggJ01hcmtlZXIgYWxzIGdlY29udHJvbGVlcmQnLCAneWFyZC1wYWdlLWd1YXJkJyApIH1cblx0XHRcdDwvQnV0dG9uPlxuXG5cdFx0XHQ8VGV4dCB2YXJpYW50PVwibXV0ZWRcIj57IGJ1dHRvbkhlbHAgfTwvVGV4dD5cblxuXHRcdFx0eyBpc1N1Y2Nlc3MgJiYgKFxuXHRcdFx0XHQ8Tm90aWNlIHN0YXR1cz1cInN1Y2Nlc3NcIiBpc0Rpc21pc3NpYmxlPXsgZmFsc2UgfT5cblx0XHRcdFx0XHR7IF9fKFxuXHRcdFx0XHRcdFx0J0JlZGFua3QsIGRlIHBhZ2luYSBpcyBnZW1hcmtlZXJkIGFscyBnZWNvbnRyb2xlZXJkLicsXG5cdFx0XHRcdFx0XHQneWFyZC1wYWdlLWd1YXJkJ1xuXHRcdFx0XHRcdCkgfVxuXHRcdFx0XHQ8L05vdGljZT5cblx0XHRcdCkgfVxuXG5cdFx0XHR7IGVycm9yICYmIChcblx0XHRcdFx0PE5vdGljZSBzdGF0dXM9XCJlcnJvclwiIGlzRGlzbWlzc2libGU9eyBmYWxzZSB9PlxuXHRcdFx0XHRcdHsgZXJyb3IgfVxuXHRcdFx0XHQ8L05vdGljZT5cblx0XHRcdCkgfVxuXHRcdDwvU2VjdGlvbj5cblx0KTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFN0YXR1c1NlY3Rpb247XG5cblxuaWYgKGltcG9ydC5tZXRhLmhvdCkge1xuICAgIGltcG9ydC5tZXRhLmhvdC5vbigndml0ZTpiZWZvcmVVcGRhdGUnLCAoeyB1cGRhdGVzIH0pID0+IHtcbiAgICAgICAgY29uc3QgZWRpdG9ySWZyYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaWZyYW1lW25hbWU9XCJlZGl0b3ItY2FudmFzXCJdJyk7XG4gICAgICAgIGNvbnN0IGVkaXRvciA9IGVkaXRvcklmcmFtZT8uY29udGVudERvY3VtZW50O1xuXG4gICAgICAgIGlmICghZWRpdG9yKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGVzLmZvckVhY2goKHsgcGF0aCwgdHlwZSB9KSA9PiB7XG4gICAgICAgICAgICBpZiAodHlwZSAhPT0gJ2Nzcy11cGRhdGUnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBrZXkgPSBwYXRoLnNwbGl0KCc/JylbMF07XG5cbiAgICAgICAgICAgIGVkaXRvci5xdWVyeVNlbGVjdG9yQWxsKCdsaW5rW3JlbD1cInN0eWxlc2hlZXRcIl0nKS5mb3JFYWNoKGxpbmsgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghbGluay5ocmVmLmluY2x1ZGVzKGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IHVwZGF0ZWQgPSBsaW5rLmhyZWYuc3BsaXQoJz8nKVswXSArICc/ZGlyZWN0JnQ9JyArIERhdGUubm93KCk7XG5cbiAgICAgICAgICAgICAgICBsaW5rLmhyZWYgPSB1cGRhdGVkO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGVkaXRvci5xdWVyeVNlbGVjdG9yQWxsKCdzdHlsZScpLmZvckVhY2goc3R5bGUgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghc3R5bGUudGV4dENvbnRlbnQuaW5jbHVkZXMoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgaW1wb3J0UmVnZXggPSBuZXcgUmVnRXhwKGAoQGltcG9ydFxcXFxzKig/OnVybFxcXFwoWydcIl0/fFsnXCJdKSkoLio/JHtrZXl9W14nXCJcXFxcKV0qPykoPzpcXFxcP1teJ1wiXFxcXCldKik/KFsnXCJdP1xcXFwpKWAsICdnJyk7XG5cbiAgICAgICAgICAgICAgICBzdHlsZS50ZXh0Q29udGVudCA9IHN0eWxlLnRleHRDb250ZW50LnJlcGxhY2UoaW1wb3J0UmVnZXgsIChfLCBwcmVmaXgsIGltcG9ydFBhdGgsIHN1ZmZpeCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB1cGRhdGVkID0gaW1wb3J0UGF0aC5zcGxpdCgnPycpWzBdO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmVmaXggKyB1cGRhdGVkICsgJz9kaXJlY3QmdD0nICsgRGF0ZS5ub3coKSArIHN1ZmZpeDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0iLCIvKipcbiAqIFdvcmRQcmVzcyBkZXBlbmRlbmNpZXNcbiAqL1xuY29uc3QgRGl2aWRlciA9IHdwLmNvbXBvbmVudHMuX19leHBlcmltZW50YWxEaXZpZGVyO1xuY29uc3QgUGx1Z2luU2lkZWJhciA9IHdwLmVkaXRvci5QbHVnaW5TaWRlYmFyO1xuY29uc3QgUGx1Z2luU2lkZWJhck1vcmVNZW51SXRlbSA9IHdwLmVkaXRvci5QbHVnaW5TaWRlYmFyTW9yZU1lbnVJdGVtO1xuY29uc3QgUGx1Z2luRG9jdW1lbnRTZXR0aW5nUGFuZWwgPSB3cC5lZGl0b3IuUGx1Z2luRG9jdW1lbnRTZXR0aW5nUGFuZWw7XG5jb25zdCBQbHVnaW5Qb3N0U3RhdHVzSW5mbyA9IHdwLmVkaXRvci5QbHVnaW5Qb3N0U3RhdHVzSW5mbztcbmNvbnN0IHJlZ2lzdGVyUGx1Z2luID0gd3AucGx1Z2lucy5yZWdpc3RlclBsdWdpbjtcbmNvbnN0IF9fID0gd3AuaTE4bi5fXztcblxuLyoqXG4gKiBJbnRlcm5hbCBkZXBlbmRlbmNpZXNcbiAqL1xuaW1wb3J0IFNpZGViYXJUb2dnbGVCdXR0b24gZnJvbSAnLi9jb21wb25lbnRzL3NpZGViYXItdG9nZ2xlLWJ1dHRvbi5qc3gnO1xuaW1wb3J0IENvbnRlbnRPd25lclNlY3Rpb24gZnJvbSAnLi9zZWN0aW9ucy9jb250ZW50LW93bmVyLXNlY3Rpb24uanN4JztcbmltcG9ydCBSZXZpZXdEYXRlU2VjdGlvbiBmcm9tICcuL3NlY3Rpb25zL3Jldmlldy1kYXRlLXNlY3Rpb24uanN4JztcbmltcG9ydCBSZW1pbmRlclBlcmlvZFNlY3Rpb24gZnJvbSAnLi9zZWN0aW9ucy9yZW1pbmRlci1wZXJpb2Qtc2VjdGlvbi5qc3gnO1xuaW1wb3J0IFN0YXR1c1NlY3Rpb24gZnJvbSAnLi9zZWN0aW9ucy9zdGF0dXMtc2VjdGlvbi5qc3gnO1xuaW1wb3J0IHsgdXNlUG9zdE1ldGEgfSBmcm9tICcuL2hvb2tzL3VzZS1wb3N0LW1ldGEnO1xuaW1wb3J0IHsgTUVUQV9DT05URU5UX09XTkVSX0lEIH0gZnJvbSAnLi9jb25maWcvbWV0YS1rZXlzJztcbmltcG9ydCB7IFNJREVCQVJfTkFNRSwgU0lERUJBUl9JQ09OIH0gZnJvbSAnLi9jb25maWcvY29uc3RhbnRzJztcbmltcG9ydCAnLi9lZGl0b3Itc2lkZWJhci5jc3MnO1xuXG5jb25zdCBFZGl0b3JTaWRlYmFyID0gKCkgPT4ge1xuXHRjb25zdCB0aXRsZSA9IF9fKCAnSW5ob3Vkc2NvbnRyb2xlJywgJ3lhcmQtcGFnZS1ndWFyZCcgKTtcblxuXHRyZXR1cm4gKFxuXHRcdDw+XG5cdFx0XHQ8UGx1Z2luU2lkZWJhck1vcmVNZW51SXRlbVxuXHRcdFx0XHR0YXJnZXQ9eyBTSURFQkFSX05BTUUgfVxuXHRcdFx0XHRpY29uPXsgU0lERUJBUl9JQ09OIH1cblx0XHRcdD5cblx0XHRcdFx0eyB0aXRsZSB9XG5cdFx0XHQ8L1BsdWdpblNpZGViYXJNb3JlTWVudUl0ZW0+XG5cdFx0XHQ8UGx1Z2luU2lkZWJhclxuXHRcdFx0XHRuYW1lPXsgU0lERUJBUl9OQU1FIH1cblx0XHRcdFx0dGl0bGU9eyB0aXRsZSB9XG5cdFx0XHRcdGljb249eyBTSURFQkFSX0lDT04gfVxuXHRcdFx0PlxuXHRcdFx0XHQ8U2lkZWJhckJvZHkgLz5cblx0XHRcdDwvUGx1Z2luU2lkZWJhcj5cblx0XHRcdDxQbHVnaW5Eb2N1bWVudFNldHRpbmdQYW5lbCB0aXRsZT17IHRpdGxlIH0+XG5cdFx0XHRcdDxTaWRlYmFyVG9nZ2xlQnV0dG9uIC8+XG5cdFx0XHQ8L1BsdWdpbkRvY3VtZW50U2V0dGluZ1BhbmVsPlxuXHRcdFx0PFBsdWdpblBvc3RTdGF0dXNJbmZvPlxuXHRcdFx0XHQ8U2lkZWJhclRvZ2dsZUJ1dHRvbiAvPlxuXHRcdFx0PC9QbHVnaW5Qb3N0U3RhdHVzSW5mbz5cblx0XHQ8Lz5cblx0KTtcbn07XG5cbmNvbnN0IFNpZGViYXJCb2R5ID0gKCkgPT4ge1xuXHRjb25zdCBbIG1ldGEgXSA9IHVzZVBvc3RNZXRhKCk7XG5cdGNvbnN0IGhhc093bmVyID0gTnVtYmVyLnBhcnNlSW50KCBtZXRhWyBNRVRBX0NPTlRFTlRfT1dORVJfSUQgXSwgMTAgKSA+IDA7XG5cblx0cmV0dXJuIChcblx0XHQ8ZGl2IGNsYXNzTmFtZT1cInlwZy1lZGl0b3Itc2lkZWJhclwiPlxuXHRcdFx0PENvbnRlbnRPd25lclNlY3Rpb24gLz5cblxuXHRcdFx0eyBoYXNPd25lciAmJiAoXG5cdFx0XHRcdDw+XG5cdFx0XHRcdFx0PERpdmlkZXIgbWFyZ2luPXsgNCB9IC8+XG5cdFx0XHRcdFx0PFJldmlld0RhdGVTZWN0aW9uIC8+XG5cdFx0XHRcdFx0PERpdmlkZXIgbWFyZ2luPXsgNCB9IC8+XG5cdFx0XHRcdFx0PFJlbWluZGVyUGVyaW9kU2VjdGlvbiAvPlxuXHRcdFx0XHRcdDxEaXZpZGVyIG1hcmdpbj17IDQgfSAvPlxuXHRcdFx0XHRcdDxTdGF0dXNTZWN0aW9uIC8+XG5cdFx0XHRcdDwvPlxuXHRcdFx0KSB9XG5cdFx0PC9kaXY+XG5cdCk7XG59O1xuXG5yZWdpc3RlclBsdWdpbiggJ3lwZy1lZGl0b3Itc2lkZWJhcicsIHtcblx0cmVuZGVyOiBFZGl0b3JTaWRlYmFyLFxufSApO1xuXG5cbmlmIChpbXBvcnQubWV0YS5ob3QpIHtcbiAgICBpbXBvcnQubWV0YS5ob3Qub24oJ3ZpdGU6YmVmb3JlVXBkYXRlJywgKHsgdXBkYXRlcyB9KSA9PiB7XG4gICAgICAgIGNvbnN0IGVkaXRvcklmcmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lmcmFtZVtuYW1lPVwiZWRpdG9yLWNhbnZhc1wiXScpO1xuICAgICAgICBjb25zdCBlZGl0b3IgPSBlZGl0b3JJZnJhbWU/LmNvbnRlbnREb2N1bWVudDtcblxuICAgICAgICBpZiAoIWVkaXRvcikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlcy5mb3JFYWNoKCh7IHBhdGgsIHR5cGUgfSkgPT4ge1xuICAgICAgICAgICAgaWYgKHR5cGUgIT09ICdjc3MtdXBkYXRlJykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3Qga2V5ID0gcGF0aC5zcGxpdCgnPycpWzBdO1xuXG4gICAgICAgICAgICBlZGl0b3IucXVlcnlTZWxlY3RvckFsbCgnbGlua1tyZWw9XCJzdHlsZXNoZWV0XCJdJykuZm9yRWFjaChsaW5rID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIWxpbmsuaHJlZi5pbmNsdWRlcyhrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCB1cGRhdGVkID0gbGluay5ocmVmLnNwbGl0KCc/JylbMF0gKyAnP2RpcmVjdCZ0PScgKyBEYXRlLm5vdygpO1xuXG4gICAgICAgICAgICAgICAgbGluay5ocmVmID0gdXBkYXRlZDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBlZGl0b3IucXVlcnlTZWxlY3RvckFsbCgnc3R5bGUnKS5mb3JFYWNoKHN0eWxlID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXN0eWxlLnRleHRDb250ZW50LmluY2x1ZGVzKGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IGltcG9ydFJlZ2V4ID0gbmV3IFJlZ0V4cChgKEBpbXBvcnRcXFxccyooPzp1cmxcXFxcKFsnXCJdP3xbJ1wiXSkpKC4qPyR7a2V5fVteJ1wiXFxcXCldKj8pKD86XFxcXD9bXidcIlxcXFwpXSopPyhbJ1wiXT9cXFxcKSlgLCAnZycpO1xuXG4gICAgICAgICAgICAgICAgc3R5bGUudGV4dENvbnRlbnQgPSBzdHlsZS50ZXh0Q29udGVudC5yZXBsYWNlKGltcG9ydFJlZ2V4LCAoXywgcHJlZml4LCBpbXBvcnRQYXRoLCBzdWZmaXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdXBkYXRlZCA9IGltcG9ydFBhdGguc3BsaXQoJz8nKVswXTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJlZml4ICsgdXBkYXRlZCArICc/ZGlyZWN0JnQ9JyArIERhdGUubm93KCkgKyBzdWZmaXg7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59Il0sIm1hcHBpbmdzIjoiO0FBQUEsSUFBYSxlQUFlO0FBQzVCLElBQWEsZUFBZTs7OztBQUs1QixJQUFhLG9CQUFvQjtBQUNqQyxJQUFhLG1CQUFtQjtBQUloQyxJQUFhLGNBQWMsQ0FBRSxRQUFRLFVBQVc7Ozs7Ozs7OztBQ1JoRCxJQUFNLFdBQVMsR0FBRyxXQUFXO0FBQzdCLElBQU0sZ0JBQWMsR0FBRyxLQUFLO0FBQzVCLElBQU0sT0FBSyxHQUFHLEtBQUs7QUFPbkIsSUFBTSx1QkFBd0IsRUFBRSxnQkFBaUI7Q0FDaEQsTUFBTSxFQUFFLHVCQUF1QixjQUFhLGdCQUFpQjtDQUU3RCxPQUNDLG1CQUFBLFFBQUEsY0FBQyxVQUFEO0VBQ0MsV0FBWSxvQ0FBcUM7RUFDakQsU0FBUTtFQUNSLE1BQU87RUFDUCxlQUNDLG1CQUFvQixzQkFBdUIsY0FBZ0I7Q0FJckQsR0FETCxLQUFJLDBCQUEwQixpQkFBa0IsQ0FDM0M7QUFFVjs7Ozs7O0FDeEJBLElBQU0sV0FBUyxHQUFHLFdBQVc7QUFDN0IsSUFBTSxVQUFVLEdBQUcsV0FBVztBQUU5QixJQUFNLFdBQVksRUFBRSxPQUFPLGVBQzFCLG1CQUFBLFFBQUEsY0FBQyxVQUFEO0NBQVEsV0FBVTtDQUFjLFNBQVU7QUFZbEMsR0FYTCxTQUNELG1CQUFBLFFBQUEsY0FBQyxTQUFEO0NBQ0MsV0FBVTtDQUNWLE9BQVE7Q0FDUixNQUFPO0NBQ1AsUUFBUztBQUdELEdBRE4sS0FDTSxHQUVSLFFBQ0s7OztBQ25CVCxJQUFNLFlBQVk7QUFFbEIsSUFBYSxpQkFBaUIsR0FBSSxVQUFXO0FBQzdDLElBQWEsV0FBVyxHQUFJLFVBQVc7QUFFdkMsSUFBYSxnQkFBaUIsV0FDN0IsR0FBSSxVQUFXLHdCQUF5QjtBQUV6QyxJQUFhQSxrQkFBaUIsV0FDN0IsR0FBSSxVQUFXLHdCQUF5Qjs7Ozs7Ozs7O0FDTnpDLElBQU0sV0FBVyxHQUFHO0FBT3BCLElB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