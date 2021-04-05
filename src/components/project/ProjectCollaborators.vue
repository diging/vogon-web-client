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

				UserSearch(
					:choosingUser="addingUser"
					:onUserChoose="addUser"
					:onClose="() => { usersDialog = false; }"
					okText="Add user to project"
					cancelText="Close"
				)
		 
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
import UserSearch from '@/components/global/UserSearch.vue';
import { User } from '@/interfaces/GlobalTypes';
import { Project } from '@/interfaces/ProjectTypes';

@Component({
	name: 'ProjectCollaborators',
	components: {
		EmptyView,
		ErrorIndicator,
		Loading,
		UserSearch,
	},
})
export default class ProjectCollaborators extends Vue {
	@Prop() private project!: Project;
	@Prop() private isOwner!: boolean;
	@Prop() private onAdd!: () => Promise<void>;

	private usersDialog: boolean = false;
	private addingUser: boolean = false;
	private addUserError: boolean = false;

	private removeDialog: boolean = false;
	private participantToRemove: User | null = null;
	private removingUser: boolean = false;
	private removeUserError: boolean = false;

	private addUser(selectedUser: User) {
		this.addingUser = true;
		this.addUserError = false;
		Vue.$axios.patch(`/project/${this.project.id}`, {
			participants: [
				...this.project.participants.map((i: any) => i.id),
				selectedUser.id,
			],
		})
			.then((response: AxiosResponse) => {
				this.onAdd().then(() => this.usersDialog = false);
			})
			.catch(() => this.addUserError = true)
			.finally(() => {
				this.addingUser = false;
			});
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