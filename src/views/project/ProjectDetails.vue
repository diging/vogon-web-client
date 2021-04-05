<template lang="pug">
	div(class="main")
		h2(class="display-1") Project Details
		br
		ErrorIndicator(v-if="error") Error while loading project details!
		div(v-else)
			Loading(v-if="loading")
			template(v-else)
				v-card(tile outlined class="project-details")
					v-row
						v-col(md="6")
							h3(class="headline") {{ project.name }}
							h4(class="subtitle-1") {{ project.description }}
							span(class="body-2 blue-grey--text text--darken-1") Owned by 
								strong "{{ project.ownedBy.username }}",
								| &nbsp;created on 
								| &nbsp;{{moment(project.created).format('lll')}} by 
								strong "{{ project.createdBy.username }}"
							div(class="body-2 mt-2") {{ project.num_texts }} text(s), {{ project.num_relations }} relation(s)

						v-col(md="6")
							div(class="float-right" v-if="isEditable")
								CreateUpdateProject(
									v-if="isOwner"
									update
									:project="Object.assign({}, project)" 
									v-bind:getProjectDetails="getProjectDetails"
								)
								v-btn(tile depressed color="teal" class="ma-2" dark :to="`/repository?project_id=${this.$route.params.id}`")
									v-icon(left) mdi-plus
									span Add text

					v-dialog(v-if="isOwner" v-model="changeOwnerDialog" scrollable max-width="500px")
						template(v-slot:activator="{ on }")
							v-btn(small v-on="on" class="mt-4" color="error") 
								v-icon(left) mdi-account-switch
								span Transfer Ownership

						UserSearch(
							:choosingUser="changingOwner"
							:onUserChoose="changeOwner"
							:onClose="() => { changeOwnerDialog = false; }"
							okText="Transfer Ownership"
							cancelText="Cancel"
						)
					
					ProjectCollaborators(
						:project="project"
						:isOwner="isOwner"
						:onAdd="getProjectDetails"
					)
				br
				v-card(class="card-project-text")
					v-card-title Texts
					template(v-if="!project.texts.length")
						EmptyView No texts found! Perhaps, add one?
					template(v-else)
						v-data-table(:headers="textHeaders" :items="project.texts")
							template(v-slot:item.title="{ item }")
								router-link(:to="`/repository/${item.repository_id}/text/${item.repository_source_id}?project_id=${project.id}`") {{ item.title }}
		
		v-snackbar(v-model="changeOwnerSnackbar" top :color="changeOwnerSnackColor" :timeout="3000") {{ changeOwnerSnackMsg }}
</template>

<script lang="ts">
import { AxiosError, AxiosResponse } from 'axios';
import { Component, Vue } from 'vue-property-decorator';

import EmptyView from '@/components/global/EmptyView.vue';
import ErrorIndicator from '@/components/global/ErrorIndicator.vue';
import Loading from '@/components/global/Loading.vue';
import UserSearch from '@/components/global/UserSearch.vue';
import CreateUpdateProject from '@/components/project/CreateUpdateProject.vue';
import ProjectCollaborators from '@/components/project/ProjectCollaborators.vue';
import { User } from '@/interfaces/GlobalTypes';
import { Project } from '@/interfaces/ProjectTypes';

@Component({
	name: 'ProjectDetails',
	components: {
		CreateUpdateProject,
		ProjectCollaborators,
		EmptyView,
		ErrorIndicator,
		Loading,
		UserSearch,
	},
})
export default class ProjectDetails extends Vue {
	private project: Project = { name: '', participants: [], texts: []};
	private loading: boolean = true;
	private error: boolean = false;
	private textHeaders = [{text: 'Title', value: 'title'}, {text: 'Added', value: 'added'}];

	private changeOwnerDialog: boolean = false;
	private changingOwner: boolean = false;
	private changeOwnerSnackbar: boolean = false;
	private changeOwnerSnackMsg: string = '';
	private changeOwnerSnackColor: string = 'success';

	public async mounted(): Promise<void> {
		this.getProjectDetails();
	}

	get isEditable(): boolean {
		return Vue.$utils.permissions.isProjectCollaborator(this.project);
	}

	get isOwner(): boolean {
		return Vue.$utils.permissions.isProjectOwner(this.project);
	}

	private getProjectDetails() {
		this.loading = true;
		return Vue.$axios.get(`/project/${this.$route.params.id}`)
			.then((response: AxiosResponse) => {
				this.project = response.data as Project;
			})
			.catch(() => this.error = true)
			.finally(() => this.loading = false);
	}

	private changeOwner(targetUser: User) {
		this.changingOwner = true;
		Vue.$axios.post(`/project/${this.project.id}/change_ownership`, {
			target_user_id: targetUser.id,
		})
			.then((response: AxiosResponse) => {
				this.changeOwnerSnackMsg = response.data.message;
				this.changeOwnerSnackColor = 'success';
				this.changeOwnerSnackbar = true;
				this.getProjectDetails();
			})
			.catch((error: AxiosError) => {
				if (error.response && error.response.data && error.response.data.message) {
					this.changeOwnerSnackMsg = error.response.data.message;
				} else {
					this.changeOwnerSnackMsg = error.message;
				}
				this.changeOwnerSnackColor = 'error';
				this.changeOwnerSnackbar = true;
			})
			.finally(() => {
				this.changingOwner = false;
			});
	}
}
</script>

<style scoped>
.project-details {
	padding: 20px;
}
.card-project-text {
	padding: 20px 0;
}
</style>