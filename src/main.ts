import Highcharts from 'highcharts';
import HighchartsVue from 'highcharts-vue';
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';
import moment from 'moment';
import Vue from 'vue';
import './plugins/axios';
import './plugins/verify';

import 'material-design-icons-iconfont/dist/material-design-icons.css';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router';
import store from './store';

NoDataToDisplay(Highcharts);

Vue.config.productionTip = false;
Vue.prototype.moment = moment;
Vue.use(HighchartsVue);

new Vue({
	router,
	store,
	vuetify,
	render: (h) => h(App),
}).$mount('#app');
