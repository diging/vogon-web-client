import Vue, { PluginObject } from 'vue';
import { AxiosResponse } from 'axios';

Vue.use({
	install(Vue) {
		Vue.prototype.$verify = function (router: any) {
			Vue.$axios
				.post(
					'accounts/verify/',
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
					console.log('SUCCESS!!');
				})
				.catch(() => {
					localStorage.removeItem('token');
					router.push({ path: '/login' });
					console.log('FAILURE!!');
				});
		};
	},
});
