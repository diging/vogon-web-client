<template lang="pug">
	v-app-bar.background(app fixed elevate-on-scroll dark)
		router-link(to="/")
			img(height="50px" src="../../assets/images/logos/logo-17.png")
		v-btn(text large to="/project" class="subheading font-weight-medium") Projects
		v-btn(text large to="/relationtemplate" class="subheading font-weight-medium") Templates
		v-btn(text large to="/about" class="subheading font-weight-medium") About
		v-menu(v-if="$store.getters.loggedIn" class="ml-3" offset-y open-on-hover style="display: block")
			template(v-slot:activator="{ on }")
				v-btn(text v-on="on" v-if="this.$store.getters.loggedIn") Data
					v-icon mdi-menu-down
			v-list
				v-list-item(v-for="item in data_items" :key="item.title" v-bind:to="item.link")
					v-list-item-title(v-text="item.title")
		v-spacer
		v-toolbar-items.hidden-sm-and-down(class="pr-4")
			v-btn(text v-if="!this.$store.getters.loggedIn" @click="login") Login
			v-btn(text v-if="!this.$store.getters.loggedIn" @click="signup") Sign Up
			v-btn(text v-if="this.$store.getters.loggedIn" @click="logout") Log Out
			v-btn(text v-if="this.$store.getters.loggedIn" to="/dashboard") Dashboard
			v-menu(
				offset-y 
				:close-on-content-click="false"
			)
				template(v-slot:activator="{ on }")
					v-badge(
						:value="unreadCount"
						:content="unreadCount"
						overlap
						class="notification-btn"
					)
						v-btn(text icon small v-on="on")
							v-icon() mdi-bell

				v-card(class="notification-container")
					div(v-if="notifications.length === 0")
						div(class="text-center mt-6")
							v-icon(large) mdi-check-box-multiple-outline
						div(class="mb-6") No notifications. All clear!
					template(v-for="notification, i in notifications")
						v-list-item(
							:key="i"
							:class="`notification-item ${notification.unread && 'notification-unread'}`"
							@click="readNotification(notification)"
						)
							v-list-item-content(
								class="text-left"
							)
								v-row(no-gutters style="flex-wrap: nowrap;")
									v-col(:cols="1" style="min-width: 100px; max-width: 100%;" class="flex-grow-1 flex-shrink-0")
										router-link(
											:to="`/project/${notification.action_object.id}`"
											target="_blank"
											class="notification-link"
										)
											| {{ notification.verb }}
					
									v-col(class="flex-grow-0 flex-shrink-0 align-self-center")
										v-btn(icon @click="deleteNotification(notification)")
													v-icon mdi-close-box
						v-divider(v-if="i + 1 < notifications.length" )
					v-btn(style="width: 100%" text small @click="deleteAllNotifications()" :disabled="notifications.length === 0")
						| Clear all
			
</template>

<script lang="ts">
import Vue from 'vue';

import EmptyView from '@/components/global/EmptyView.vue';
import { Notification } from '@/interfaces/GlobalTypes';
import router from '@/router';

export default Vue.extend({
	name: 'Header',
	components: {
		EmptyView,
	},
	props: {
		msg: String,
	},
	data() {
		return {
			activeIndex: '1',
			annotate_items: [{ title: 'Text', link: '/repository' }, { title: 'Projects', link: '/project' }],
			data_items: [
				{ title: 'Concepts', link: '/concept' },
				{ title: 'Concept Types', link: '/types' },
				{ title: 'Annotations', link: '/relations' },
				{ title: 'Contributors', link: '/users' },
			],
			info_items: [
				{ title: 'Overview' },
				{ title: 'Use Cases' },
				{ title: 'Our Team' },
			],
			notifications: [],
			unreadCount: 0,
		};
  },

	created() {
		this.watchStore();
	},
	methods: {
		handleSelect(key: string, keyPath: string[]) {
			this.activeIndex = key;
		},
		pushHome() {
			this.$router.push('/');
		},
		login() {
			this.$router.push('/login');
		},
		signup() {
			this.$router.push('/signup');
		},
		logout() {
			localStorage.removeItem('token');
			this.login();
		},
		watchStore() {
			this.$store.watch(
				(state, getters) => getters.notifications,
				(newValue, oldValue) => {
					this.notifications = newValue;
					this.unreadCount = newValue.filter((i: Notification) => i.unread).length;
				},
			);
		},
		readNotification(notification: Notification) {
			if (notification.unread) {
				Vue.$axios.post(`/notifications/${notification.id}/mark_as_read`)
					.then(() => {
						Vue.$verify(router, true);
					});
			}
		},
		deleteNotification(notification: Notification) {
			// Clear from list
			const newNotifications = this.notifications.filter(
				(i: Notification) => i.id !== notification.id);
			this.$store.commit('setNotifications', newNotifications);

			// Make delete call
			Vue.$axios.post(`/notifications/${notification.id}/mark_as_deleted`);
		},
		deleteAllNotifications() {
			this.$store.commit('setNotifications', []);
			Vue.$axios.post(`/notifications/mark_all_as_deleted`);
		},
	},
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
li a {
	color: inherit; /* blue colors for links too */
	text-decoration: inherit; /* no underline */
}
.logo {
	background: transparent;
	width: 300px;
}
.notification-btn {
	align-self: center;
	cursor: pointer;
}
.notification-container {
	width: 400px;
	padding: 0px;
	max-height: 500px;
	overflow-y: auto;
}
.notification-item {
	cursor: pointer;
}
.notification-unread {
	background-color: #ECEFF1;
	border-left: 2px solid #009688;
}
.notification-link {
	text-decoration: none;
	color: rgba(0,0,0,.87);
}
</style>
