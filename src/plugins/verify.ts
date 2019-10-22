import Vue, { PluginObject } from 'vue';
import VueRouter from 'vue-router';


const _verify = function(router: VueRouter):void {
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
		.catch(() => {
			localStorage.removeItem('token');
			router.push({ path: '/login' });
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