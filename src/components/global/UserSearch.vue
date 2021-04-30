<template lang="pug">
	v-card
		v-card-title Search User
		v-divider
		v-card-text(style="height: 400px;")
			v-text-field(
				v-model="userQuery"
				placeholder="Search by username/full name"
				dense
				outlined
				label="Username / Full name"
				class="field-text mt-3"
				append-outer-icon="mdi-magnify"
				@click:append-outer="searchUser"
				@keyup.enter.native="searchUser"
			)

			ErrorIndicator(v-if="searchError") Error while searching users!
			template(v-else)
				Loading(v-if="searching")
				template(v-else)
					EmptyView(v-if="!users.length") No users found!
					v-list(two-line class="text-left")
						v-list-item-group(
							v-model="selectedUser"
							color="primary"
						)
							template(v-for="(user, i) in users")
								v-list-item(@click="" :key="user.id")
									v-list-item-content
										v-list-item-title(
											v-text="user.full_name ? `${user.full_name} [${user.username}]` : user.username"
										)
										v-list-item-subtitle(
											v-text="user.email"
										)
								v-divider(v-if="i + 1 < users.length")

		v-divider
		v-card-actions
			v-spacer
			v-btn(color="blue darken-1" text @click="selectedUser = null; onClose();") {{ cancelText }}
			v-btn(
				color="blue darken-1"
				text
				@click="chooseUser(); selectedUser = null;" 
				:disabled="!(selectedUser !== null && selectedUser >= 0)"
				:loading="choosingUser"
			) {{ okText }}
</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import { Component, Prop, Vue } from 'vue-property-decorator';

import EmptyView from '@/components/global/EmptyView.vue';
import ErrorIndicator from '@/components/global/ErrorIndicator.vue';
import Loading from '@/components/global/Loading.vue';
import { User } from '@/interfaces/GlobalTypes';

@Component({
	name: 'UserSearch',
	components: {
		EmptyView,
		ErrorIndicator,
		Loading,
	},
})
export default class UserSearch extends Vue {
	@Prop() private choosingUser!: boolean;
	@Prop() private onUserChoose!: (user: User) => void;
	@Prop() private onClose!: () => void;
	@Prop() private okText!: string;
	@Prop() private cancelText!: string;

	private userQuery: string = '';
	private users: User[] = [];
	private searching: boolean = false;
	private searchError: boolean = false;
	private selectedUser: number | null = null;

	private chooseUser() {
		if (this.selectedUser !== null && this.selectedUser >= 0) {
			this.onUserChoose(this.users[this.selectedUser]);
		}
	}

	private searchUser() {
		this.searching = true;
		this.searchError = false;
		const params = {
			search: this.userQuery,
		};
		Vue.$axios.get('/users', { params })
			.then((response: AxiosResponse) => {
				const currentUserId: number = this.$utils.getUserId();
				this.users = response.data.results.filter(
					(user: User) => user.id !== currentUserId,
				);
			})
			.catch(() => this.searchError = true)
			.finally(() => this.searching = false);
	}
}
</script>

<style scoped>
.field-text.v-input--dense input, .field-text.v-input--dense input {
	margin-top: 0 !important;
}
</style>
