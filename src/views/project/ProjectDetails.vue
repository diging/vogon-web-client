<template lang="pug">
	div(class="main")
		h2(class="display-1") Project Details
		br
		ErrorIndicator(v-if="error") Error while loading project details!
		div(v-else)
			Loading(v-if="loading")
			template(v-else)
				Breadcrumbs(:items="navItems")
				v-card(tile outlined class="project-details")
					v-row
						v-col(md="6")
							div(class="d-flex justify-start")
								h3(class="headline") {{ project.name }}
								v-tooltip(
									v-if="isOwner && !project.is_default"
									top
								)
									template(v-slot:activator="{ on, attrs }")
										v-icon(
											v-bind="attrs"
											v-on="on"
											class="ml-2"
											@click="setAsDefaultDialog = true;"
										) mdi-star-outline
									span Set this as your default project
						
								v-tooltip(
									v-if="project.is_default"
									top
								)
									template(v-slot:activator="{ on, attrs }")
										v-icon(
											v-bind="attrs"
											v-on="on"
											class="ml-2"
										) mdi-star
									span This is your default project

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

					div(class="d-flex mt-4")
						v-btn(small outlined @click="exportAffiliations" class="mr-2") 
							| Export affiliation relations

						v-dialog(v-if="isOwner" v-model="changeOwnerDialog" scrollable max-width="500px")
							template(v-slot:activator="{ on }")
								v-btn(small v-on="on" color="error" depressed) 
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
								router-link(:to="`/repository/amphora${item.repository_id}/text/${item.repository_source_id}?project_id=${project.id}`") {{ item.title }}
		
		v-snackbar(v-model="snackbar" top :color="snackColor" :timeout="3000") {{ snackbarMsg }}
	
		v-dialog(
			v-model="setAsDefaultDialog"
			width="500"
			:persistent="settingAsDefault"
		)
			v-card(class="pa-2")
				v-card-title(class="headline") Set as default project
				v-card-text(class="text-left") Are you sure you want to set this project as default?
				v-card-actions
					v-spacer
					v-btn(
						text 
						color="green darken-1" 
						@click="setAsDefaultDialog = false"
						:disabled="settingAsDefault"
					) Cancel
					v-btn(
						text 
						color="red darken-1" 
						@click="setAsDefault();"
						:disabled="settingAsDefault"
						:loading="settingAsDefault"
					) Yes
				
</template>

<script lang="ts">
import { AxiosError, AxiosResponse } from 'axios';
import { Component, Vue } from 'vue-property-decorator';

import Breadcrumbs from '@/components/global/Breadcrumbs.vue';
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
		Breadcrumbs,
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
	private exporting: boolean = false;
	private exportError: boolean = false;
	private textHeaders = [{text: 'Title', value: 'title'}, {text: 'Added', value: 'added'}];
	private navItems = [
		{ text: 'Projects', to: '/project', link: true, exact: true },
		{ text: '', to: '', link: true, exact: true },
	];

	private changeOwnerDialog: boolean = false;
	private changingOwner: boolean = false;
	private snackbar: boolean = false;
	private snackbarMsg: string = '';
	private snackColor: string = 'success';

	private setAsDefaultDialog: boolean = false;
	private settingAsDefault: boolean = false;

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
				this.navItems[1].text = this.project.name;
				this.navItems[1].to = `/project/${this.project.id}`;
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
				this.snackbarMsg = response.data.message;
				this.snackColor = 'success';
				this.snackbar = true;
				this.getProjectDetails();
			})
			.catch((error: AxiosError) => {
				if (error.response && error.response.data && error.response.data.message) {
					this.snackbarMsg = error.response.data.message;
				} else {
					this.snackbarMsg = error.message;
				}
				this.snackColor = 'error';
				this.snackbar = true;
			})
			.finally(() => {
				this.changingOwner = false;
			});
	}

	private setAsDefault() {
		this.settingAsDefault = true;
		this.$axios.post(`/project/${this.project.id}/set_as_default`)
			.then((response: AxiosResponse) => {
				this.snackbarMsg = response.data.message;
				this.snackColor = 'success';
				this.snackbar = true;
				this.getProjectDetails();
			})
			.catch((error: AxiosError) => {
				if (error.response && error.response.data && error.response.data.message) {
					this.snackbarMsg = error.response.data.message;
				} else {
					this.snackbarMsg = error.message;
				}
				this.snackColor = 'error';
				this.snackbar = true;
			})
			.finally(() => {
				this.settingAsDefault = false;
				this.setAsDefaultDialog = false;
			});
	}

	private exportAffiliations() {
		this.exporting = true;
		Vue.$axios.get(`/project/${this.$route.params.id}/export_affiliations`,
			{ responseType: 'blob' },
		)
			.then((response) => {
				const url = window.URL.createObjectURL(new Blob([response.data]));
				const link = document.createElement('a');
				link.href = url;
				link.setAttribute('download', 'affiliations_export.csv');
				document.body.appendChild(link);
				link.click();
			})
			.catch(() => this.exportError = true)
			.finally(() => this.exporting = false);
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