import Vue, { PluginObject } from 'vue';
import VueRouter from 'vue-router';
import { AxiosResponse } from 'axios';

import store from './../store';

/**
 * Check if a user has a valid token/is logged in. 
 * 		We store the value in vuex to use elsewhere. 
 * 		If the user is not logged in and the route is not 
 * 		gaurded the user can still access the page 
 * 		otherwise they are redirected to the login page. 
 * @param {VueRouter} router - router instance
 * @param {Boolean} gaurded - indicates whether the route is gaurded or not 
 */ 
const _verify = function(router: VueRouter, gaurded: boolean):void {
	Vue.$axios
		.post(
			'token/verify/',
			{
				token: localStorage.getItem('token'),
			},
			{
				headers: {
					'Content-Type': 'application/json',
				},
			},
		)
		.then((response: AxiosResponse) => {
			store.commit('loggedInMutation', true);
			store.commit('setNotifications', response.data.notifications);
		})
		.catch(() => {
			store.commit('loggedInMutation', false);
			localStorage.removeItem('token');
			if(gaurded == true) {
				router.push({ path: '/login' });
			}
		});
};





const Plugin: PluginObject<any> = {
	install: (Vue) => {
	  Vue.$verify = _verify;
	},
  };

  Plugin.install = (Vue) => {
	Vue.$verify = _verify;
	window.verify = _verify;
	Object.defineProperties(Vue.prototype, {
	  $verify: {
		get() {
		  return _verify;
		},
	  },
	});
  };
  
  Vue.use(Plugin);
  
  export default Plugin;