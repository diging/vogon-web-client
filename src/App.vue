<template lang="pug">
	v-app
		Header
		v-content
			v-container(fill-height)
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
		loggedIn: false,
	}),
	beforeCreate() {
		if (this.$route.path !== 'signup') {
			Vue.$verify(router);
		}
	},
	created() {
		router.beforeEach((to, from, next) => {
			if (to.path === '/signup') {
				next();
			} else {
				Vue.$verify(router);
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