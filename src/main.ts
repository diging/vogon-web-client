import moment from 'moment';
import Vue from 'vue';
import './plugins/axios';

import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router';
import store from './store';

Vue.config.productionTip = false;
Vue.prototype.moment = moment;

new Vue({
	router,
	store,
	vuetify,
	render: (h) => h(App),
}).$mount('#app');
