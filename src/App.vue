<template lang="pug">
	v-app
		Header
		v-content
			v-container
				router-view
		Footer
</template>

<script lang="ts">
import router from '@/router';
import Vue from 'vue';
import Footer from './components/global/Footer.vue';
import Header from './components/global/Header.vue';

import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';


export default Vue.extend({
	name: 'App',
	components: {
		Header,
		Footer,
	},
	data: () => ({
	}),
	beforeCreate() {
		/**
		 * run verify on pages other than signup and home during app setup
		 */
	if (this.$route.path !== '/login' && this.$route.path !== '/signup'
		&& this.$route.path !== '/' && this.$route.path !== '/about'
			&& this.$route.path !== '/forgot-password' && !this.$route.path.startsWith('/reset-password')
		) {
			Vue.$verify(router, true);
		} else {
			Vue.$verify(router, false);
		}
	},
	created() {
		/**
		 * run verify on pages after load
		 * @param {Route} to - route that page is directing to
		 * @param {Route} from - route that page is directed from
		 * @param {Function} next - move on to the next hook in the pipeline.
		 * 		If no hooks are left, the navigation is confirmed.
		 */
		router.beforeEach((to, from, next) => {
			if (this.$route.path !== '/login' || to.path === '/signup' || to.path === '/' || to.path === '/about' || to.path === '/forgot-password'
				|| to.path.startsWith('/reset-password')
			) {
				Vue.$verify(router, false);
				next();
			} else {
				Vue.$verify(router, true);
				next();
			}
		});
	},
});
</script>
<style lang="scss">
#app {
	font-family: "Avenir", Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}
#nav {
	padding: 30px;
	a {
		font-weight: bold;
		color: #2c3e50;
		&.router-link-exact-active {
			color: #42b983;
		}
	}
}

</style>