import Vue from 'vue';
import Vuex, { MutationTree } from 'vuex';

import { RootState } from '@/interfaces/StoreTypes';

Vue.use(Vuex);

const initialState: RootState = {
	loggedIn: false,
	templateCreator: { open_concepts: [] },
	showSideBar: false,
	showLists: false,
	show_concepts: false,
	concept_label: '',
	template: null,
	appellations_to_submit: [],
	text_appellation: [],
	deselect_all: false,
	select_all: false,
	assignment_failed: false,
	validator: 0,
	text_content_styles: {},
	annotator: {
		currentTab: 'tab-4',
		template: null,
		selectedFieldAnnotations: [],
		conceptTypes: [],
		currentFieldIndex: -1,
		currentFieldType: null,
		appellations: [],
		text: null,
		highlightedText: null,
		meta: {
			project: -1,
			occursIn: -1,
		},
		relationCreated: false,
		selectedConcept: null,
		searchingConcept: false,
		createdAppellation: false,
		createNewConcept: false,
		focusedAppellation: 0,
		hideAllAppellations: false,
		hiddenAppellations: {},
		editAppellationId: null,
		updatedAppellationId: 0,
	},
	notifications: [],
};

const mutations: MutationTree<RootState> = {
	loggedInMutation(state: RootState, loggedIn) {
		state.loggedIn = loggedIn;
	},
	setTemplateOpenConcepts(state, value) {
		state.templateCreator.open_concepts = value;
	},
	toggleSideBarMutation(state) {
		state.showSideBar = !state.showSideBar;
	},
	toggleLists(state) {
		state.showLists = !state.showLists;
	},
	triggerConcepts(state, payload) {
		/*
		* Needed if in order for cancel button to work when
		* concept picker is triggered by highlighting a word
		*/
		if (payload === false) {
			state.show_concepts = payload;
		} else {
			state.show_concepts = !state.show_concepts;
		}

	},
	setTextAppellation(state, appellation) {
		state.text_appellation = appellation;
	},
	conceptLabel(state, payload) {
		state.concept_label = payload;
	},
	setTemplate(state, payload) {
		state.template = payload;
	},
	removeAppellation(state, index) {
		state.appellations_to_submit.splice(index, 1);
	},
	addAppellation(state, appellation) {
		state.appellations_to_submit.push(appellation);
	},
	setAppellations(state, payload) {
		// Use payload.slice() to clone the array without a reference
		state.appellations_to_submit = payload.slice();
	},
	deselect(state) {
		state.deselect_all = !state.deselect_all;
		state.select_all = false;
		state.appellations_to_submit = [];
	},
	selectAll(state) {
		state.select_all = !state.select_all;
		state.deselect_all = false;
	},
	setDeselectFalse(state) {
		state.deselect_all = false;
	},
	setSelectFalse(state) {
		state.select_all = false;
	},
	resetCreateAppelltionsToText(state) {
		state.appellations_to_submit = [];
		state.text_appellation = [];
	},
	massAppellationAssignmentFailed(state) {
		state.assignment_failed = true;
	},
	setValidator(state, validator) {
		state.validator = validator;
	},
	setTextContentStyle(state, style) {
		state.text_content_styles = style;
	},
	setAnnotatorCurrentTab(state, tab) {
		state.annotator.currentTab = tab;
	},
	setAnnotatorTemplate(state, template) {
		state.annotator.template = template;
	},
	setAnnotatorConceptTypes(state, types) {
		state.annotator.conceptTypes = types;
	},
	setSelectedFieldAnnotations(state, annotations) {
		state.annotator.selectedFieldAnnotations = annotations;
	},
	setSelectedFieldAnnotationsAt(state, value) {
		state.annotator.selectedFieldAnnotations[value.pos] = value.annotation;
	},
	setCurrentFieldIndex(state, index) {
		state.annotator.currentFieldIndex = index;
	},
	setCurrentFieldType(state, type) {
		state.annotator.currentFieldType = type;
	},
	setAnnotatorAppellations(state, appellations) {
		state.annotator.appellations = appellations;
	},
	setAnnotatorMeta(state, meta) {
		state.annotator.meta = meta;
	},
	setAnnotatorText(state, text) {
		state.annotator.text = text;
	},
	setAnnotatorHighlightedText(state, text) {
		state.annotator.highlightedText = text;
	},
	setAnnotatorSelectedConcept(state, concept) {
		state.annotator.selectedConcept = concept;
	},
	setAnnotatorSearchingConcept(state, searching) {
		state.annotator.searchingConcept = searching;
	},
	setAnnotatorCreatedAppellation(state, created) {
		state.annotator.createdAppellation = created;
	},
	setAnnotatorCreateNewConcept(state, value) {
		state.annotator.createNewConcept = value;
	},
	setAnnotatorFocusedAppellation(state, appellationId) {
		state.annotator.focusedAppellation = appellationId;
	},
	toggleAnnotatorHideAppellation(state) {
		state.annotator.hideAllAppellations = !state.annotator.hideAllAppellations;
	},
	setAnnotatorHideAppellation(state, appellationId) {
		state.annotator.hiddenAppellations[appellationId] = true;
	},
	setAnnotatorShowAppellation(state, appellationId) {
		delete state.annotator.hiddenAppellations[appellationId];
	},
	setAnnotatorEditAppellationMode(state, appellation) {
		state.annotator.editAppellationId = appellation;
	},
	setAnnotatorUpdatedAppellation(state, appellationId) {
		state.annotator.updatedAppellationId = appellationId;
	},
	addAnnotatorNewAppellation(state, appellation) {
		const index = state.annotator.appellations.length - 1;
		state.annotator.appellations[index] = appellation;
	},
	setRelationCreated(state, value) {
		state.annotator.relationCreated = value;
	},
	setNotifications(state, notifications) {
		state.notifications = notifications;
	},
};

export default new Vuex.Store({
	state: initialState,
	mutations,
	getters: {
		loggedIn: (state) => state.loggedIn,
		getShowSideBar: (state) => state.showSideBar,
		getShowLists: (state) => state.showLists,
		showConcepts: (state) => state.show_concepts,
		conceptLabel: (state) => state.concept_label,
		getTemplate: (state) => state.template,
		getAppellationsToSubmit: (state) => state.appellations_to_submit,
		getTextAppellation: (state) => state.text_appellation,
		getDeselect: (state) => state.deselect_all,
		getSelect: (state) => state.select_all,
		getAssignmentFailed: (state) => state.assignment_failed,
		getValidator: (state) => state.validator,
		getTextContentStyle: (state) => state.text_content_styles,
		getAnnotatorCurrentTab: (state) => state.annotator.currentTab,
		getAnnotatorTemplate: (state) => state.annotator.template,
		getAnnotatorConceptTypes: (state) => state.annotator.conceptTypes,
		getAnnotatorText: (state) => state.annotator.text,
		getAnnotatorHighlightedText: (state) => state.annotator.highlightedText,
		getSelectedFieldAnnotations: (state) => state.annotator.selectedFieldAnnotations,
		getCurrentFieldIndex: (state) => state.annotator.currentFieldIndex,
		getCurrentFieldType: (state) => state.annotator.currentFieldType,
		getAnnotatorAppellations: (state) => state.annotator.appellations,
		getAnnotatorMeta: (state) => state.annotator.meta,
		getAnnotatorSelectedConcept: (state) => state.annotator.selectedConcept,
		getAnnotatorSearchingConcept: (state) => state.annotator.searchingConcept,
		getAnnotatorCreatedAppellation: (state) => state.annotator.createdAppellation,
		getAnnotatorCreateNewConcept: (state) => state.annotator.createNewConcept,
		getAnnotatorFocusedAppellation: (state) => state.annotator.focusedAppellation,
		getAnnotatorHideAppellation: (state) => state.annotator.hideAllAppellations,
		getAnnotatorHiddenAppellations: (state) => state.annotator.hiddenAppellations,
		getAnnotatorEditAppellationMode: (state) => state.annotator.editAppellationId,
		getRelationCreated: (state) => state.annotator.relationCreated,
		templateOpenConcepts: (state) => state.templateCreator.open_concepts,
		notifications: (state) => state.notifications,
	},
	actions: {},
});

