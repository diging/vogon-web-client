import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
	loggedIn: false,
	showSideBar: false,
  },
  mutations: {
	loggedInMutation(state, loggedIn) {
		state.loggedIn = loggedIn;
	},
	toggleSideBarMutation(state) {
		state.showSideBar = !state.showSideBar;
	},
  },
  getters: {
	loggedIn: (state) => state.loggedIn,
	getShowSideBar: (state) => state.showSideBar,
  },
  actions: {

  },
});
