import Vue, { PluginObject } from 'vue';
import VueRouter from 'vue-router';
import store from './../store';


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
		.then((result) => {
			store.commit('loggedInMutation', true);
		})
		.catch(() => {
			store.commit('loggedInMutation', false);
			localStorage.removeItem('token');
			
			if(gaurded == true) {
				console.log(gaurded);
				console.log("hits");
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