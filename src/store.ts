import Vue from 'vue';
import Vuex, { MutationTree } from 'vuex';

import { RootState } from '@/interfaces/StoreTypes';

Vue.use(Vuex);

const initialState: RootState = {
	loggedIn: false,
	templateCreator: {
		open_concepts: [],
	},
};

const mutations: MutationTree<RootState> = {
	loggedInMutation(state: RootState, loggedIn) {
		state.loggedIn = loggedIn;
	},
	setTemplateOpenConcepts(state, value) {
		state.templateCreator.open_concepts = value;
	},
};

export default new Vuex.Store({
	state: initialState,
	mutations,
	getters: {
		loggedIn: (state) => state.loggedIn,
		templateOpenConcepts: (state) => state.templateCreator.open_concepts,
	},
	actions: {

	},
});
