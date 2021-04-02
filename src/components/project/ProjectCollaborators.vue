<template lang="pug">
	div(class="mt-3")
		strong Collaborators
		br
		v-chip(class="mr-2 mt-2" color="green darken-2" text-color="white")
			v-avatar(left)
				v-icon mdi-account-circle
			| {{ project.ownedBy.full_name || project.ownedBy.username }}
		v-chip(
			v-for="participant in project.participants"
			class="mr-2 mt-2"
			color="indigo"
			text-color="white"
			:close="isOwner"
			@click:close="participantToRemove=participant; removeDialog=true"
			:key="participant.username"
		)
			v-avatar(left)
				v-icon mdi-account-circle
			| {{ participant.full_name || participant.username }}
		br
		div(v-if="isOwner" class="mt-3")
			v-dialog(v-model="usersDialog" scrollable max-width="500px")
				template(v-slot:activator="{ on }")
					v-btn(small v-on="on") Add collaborator

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

						ErrorIndicator(v-if="searchError") Error while seraching users!
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
						v-btn(color="blue darken-1" text @click="usersDialog = false; selectedUser = null;") Close
						v-btn(
							color="blue darken-1"
							text
							@click="addUser" 
							:disabled="!(selectedUser !== null && selectedUser >= 0)"
							:loading="addingUser"
						) Add user to project
		 
			v-dialog(v-model="removeDialog" max-width="500px") 
				v-card
					v-card-title Remove Collaborator
					v-divider
					v-card-text
						div(class="text-left subtitle-1 my-3" v-if="participantToRemove") 
							| Are you sure you want to remove 
							strong {{ participantToRemove.full_name }}?
					v-card-actions
						v-spacer
						v-btn(text @click="removeDialog = false; participantToRemove = null") Cancel
						v-btn(
							text 
							color="red darken-1" 
							@click="removeParticipant"
							:loading="removingUser"
							:disabled="removingUser"
						) Remove
</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import { Component, Prop, Vue } from 'vue-property-decorator';

import EmptyView from '@/components/global/EmptyView.vue';
import ErrorIndicator from '@/components/global/ErrorIndicator.vue';
import Loading from '@/components/global/Loading.vue';
import { User } from '@/interfaces/GlobalTypes';
import { Project } from '@/interfaces/ProjectTypes';

@Component({
	name: 'ProjectCollaborators',
	components: {
		EmptyView,
		ErrorIndicator,
		Loading,
	},
})
export default class ProjectCollaborators extends Vue {
	@Prop() private project!: Project;
	@Prop() private isOwner!: boolean;
	@Prop() private onAdd!: () => Promise<void>;

	private usersDialog: boolean = false;
	private userQuery: string = '';
	private users: User[] = [];
	private searching: boolean = false;
	private searchError: boolean = false;
	private selectedUser: number | null = null;
	private addingUser: boolean = false;
	private addUserError: boolean = false;

	private removeDialog: boolean = false;
	private participantToRemove: User | null = null;
	private removingUser: boolean = false;
	private removeUserError: boolean = false;

	private addUser() {
		this.addingUser = true;
		this.addUserError = false;
		if (this.selectedUser !== null && this.selectedUser >= 0) {
			Vue.$axios.patch(`/project/${this.project.id}`, {
				participants: [
					...this.project.participants.map((i: any) => i.id),
					this.users[this.selectedUser].id,
				],
			})
				.then((response: AxiosResponse) => {
					this.onAdd().then(() => this.usersDialog = false);
				})
				.catch(() => this.addUserError = true)
				.finally(() => {
					this.addingUser = false;
					this.selectedUser = null;
				});
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

	private removeParticipant() {
		this.removingUser = true;
		this.removeUserError = false;
		if (this.participantToRemove !== null) {
			const participantToRemoveId = this.participantToRemove.id;
			const participants = this.project.participants.map((i: any) => i.id).filter(
				(i: number) => i !== participantToRemoveId,
			);

			Vue.$axios.patch(`/project/${this.project.id}`, { participants })
				.then((response: AxiosResponse) => {
					this.onAdd().then(() => this.removeDialog = false);
				})
				.catch(() => this.removeUserError = true)
				.finally(() => this.removingUser = false);
		}
	}
}

</script>

<style scoped>
.field-text.v-input--dense input, .field-text.v-input--dense input {
    margin-top: 0 !important;
}
</style>