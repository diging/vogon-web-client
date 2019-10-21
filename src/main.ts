import moment from 'moment';
import Vue from 'vue';
import './plugins/axios';

import 'material-design-icons-iconfont/dist/material-design-icons.css';
import VueRouter from 'vue-router';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router';
import store from './store';
/* tslint:disable */
Vue.config.productionTip = false;
Vue.prototype.moment = moment;

Vue.use({
	install(Vue) {
		Vue.prototype.$verify = function(router: VueRouter) {
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
	},
});

new Vue({
	router,
	store,
	vuetify,
	render: (h) => h(App),
}).$mount('#app');
