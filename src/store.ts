import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		loggedIn: false,
		showSideBar: false,
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
	},
	mutations: {
		loggedInMutation(state, loggedIn) {
			state.loggedIn = loggedIn;
		},
		toggleSideBarMutation(state) {
			state.showSideBar = !state.showSideBar;
		},
		triggerConcepts(state, payload) {
			/*
			* Needed if in order for cancel button to work when
			* conecpt picker is triggered by highlighting a word
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
		addAppellation(state, appellation: any) {
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
  	},
	getters: {
		loggedIn: (state) => state.loggedIn,
		getShowSideBar: (state) => state.showSideBar,
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
	},
  actions: {

  },
});
