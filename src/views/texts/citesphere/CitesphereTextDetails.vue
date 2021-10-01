<template lang="pug">
	div(class="main")
		br
		ErrorIndicator(v-if="error") Error while loading text details!
		div(v-else)
			Loading(v-if="loading")
			template(v-else)
				Breadcrumbs(:items="navItems" class="mt-2")
				v-card(tile outlined class="text-details")
					v-row
						v-col(cols="6")
							h3(class="headline") Resource "{{ text.title }}"
							v-list-item-subtitle(class="text--primary" v-text="text.uri")
							
							div(v-if="partOfProject" class="mt-2 mb-2")
								strong Project:&nbsp;
								router-link(
									class="project-name"
									:to="`/project/${partOfProject.id}`"
								) {{ partOfProject.name }}

							template(v-if="partOfProject && isOwner && !submitted")
								v-dialog(v-model="projectMoveDialog" scrollable max-width="500px")
									template(v-slot:activator="{ on }")
										v-btn(small v-on="on" color="error" depressed) Move to another Project
									
									ProjectSearch(
										:currentProject="partOfProject"
										:choosingProject="movingProject"
										:onProjectChoose="moveProject"
										:onClose="() => { projectMoveDialog = false; }"
									)

						v-col(cols="6")
							div(v-if="partOfProject && isEditable && !submitted" class="float-right")
								v-tooltip(left)
									template(v-slot:activator="{ on }")
										v-btn(color="#db1a04" v-on="on" @click="removeText" :loading="removingText" :disabled="removingText")
											div(class="delete-button-text")
												v-icon(left) mdi-trash-can-outline
									span
									| Remove from project
							div(v-else-if="project && submitted" class="float-right")
								v-tooltip(left)
									template(v-slot:activator="{ on }")
										div(v-on="on")
											v-btn(color="#db1a04" disabled)
												div(class="delete-button-text")
													v-icon(left) mdi-trash-can-outline
									span
									| Texts cannot be removed after annotations have been submitted
							div(v-else-if="$route.query.project_id && isEditable" class="float-right")
								v-btn(color="primary" @click="addText" :loading="addingText" :disabled="addingText")
									v-icon(left) mdi-plus
									| Add to project
					v-alert(
						type="warning"
						dense
						v-if="text.state !== 'OK'"
					) The item is still pending with Citesphere. Wait until then for starting annotations
				p(class="body-1")
					| The following content objects are associated with this resource. 
					| Select a content object to begin annotating that object in VogonWeb. 
				CitesphereAdditionalContent(
					v-bind:contents="data"
					v-bind:ready="text.state === 'OK'"
					v-bind:editable="isEditable"
					class="mb-4"
				)
				CitesphereAdditionalContent(
					v-bind:contents="filtered_content"
					v-bind:ready="text.state === 'OK'"
					v-bind:editable="isEditable"
					class="mb-4"
				)
				TextSerialContent(
					v-bind:contents="data"
					v-bind:ready="text.state === 'OK'"
					v-bind:editable="isEditable"
				)
				TextSerialContent(
					v-bind:contents="filtered_content"
					v-bind:ready="text.state === 'OK'"
					v-bind:editable="isEditable"
				)
				v-card(class="card-annotations mt-4")
					v-row(class="annotation-title")
						v-col(md="6")
							v-card-title Recent Annotations
						v-col(md="6")
							div(class="float-right")
								v-btn(
									class="view-annotations" 
									v-bind:to="`/relations?occursIn=${text.uri}`" 
									dense outlined
								) View all
					v-card-text
						template(v-if="!relations")
							EmptyView No annotations found!
						template(v-else)
							AnnotationList(v-bind:annotations="relations")

		v-snackbar(v-model="snackbar" top :color="snackbarColor" :timeout="3000")
			| {{ snackbarText }}
</template>

<script lang="ts">
import { AxiosError, AxiosResponse } from 'axios';
import { Component, Vue, Prop } from 'vue-property-decorator';

import Breadcrumbs from '@/components/global/Breadcrumbs.vue';
import EmptyView from '@/components/global/EmptyView.vue';
import ErrorIndicator from '@/components/global/ErrorIndicator.vue';
import Loading from '@/components/global/Loading.vue';
import AnnotationList from '@/components/relations/AnnotationList.vue';
import TextAdditionalContent from '@/components/texts/amphora/TextAdditionalContent.vue';
import TextSerialContent from '@/components/texts/amphora/TextSerialContent.vue';
import ProjectSearch from '@/components/texts/ProjectSearch.vue';
import { Project } from '@/interfaces/ProjectTypes';
import { RelationSet } from '@/interfaces/RelationTypes';
import { TextResource } from '@/interfaces/RepositoryTypes';
import CitesphereAdditionalContent from '@/components/texts/citesphere/CitesphereAdditionalContent.vue';

@Component({
	name: 'TextDetails',
	components: {
		Breadcrumbs,
		Loading,
		EmptyView,
		ErrorIndicator,
		TextSerialContent,
		CitesphereAdditionalContent,
		AnnotationList,
		ProjectSearch,
	},
})
export default class TextDetails extends Vue {
	private loading: boolean = true;
	private error: boolean = false;
	private project: Project | null = null;
	private partOfProject: Project | null = null;
	private text: TextResource = {id: 1, title: ''};
	private relations: RelationSet[] = [];
	private masterId: number | null = null;
	private submitted: boolean = true;
	// @Prop() private readonly type: string
	private snackbarText: string = '';
	private snackbar: boolean = false;
	private snackbarColor: string = 'error';

	private projectMoveDialog: boolean = false;
	private movingProject: boolean = false;
	private addingText: boolean = false;
	private removingText: boolean = false;
	private repository: string = '';
	private data: any = '';
	private chosenText: any = '';

	private navItems = [
		{ text: 'Projects', to: '/project', link: true, exact: true },
		{ text: '', to: '', link: true, exact: true },
		{ text: 'Repositories', to: '/repository', link: true, exact: true },
		{ text: '', to: '', link: true, exact: true },
		{ text: 'Text', link: false },
		{ text: '', link: false },
	];

	public created() {
		console.log("entered a new component created");
	}
	public async mounted(): Promise<void> {
		console.log("entered new component");
		this.getTextDetails();
	}

	get isEditable(): boolean {
		if (this.project) {
			return Vue.$utils.permissions.isProjectCollaborator(this.project);
		}
		return false;
	}

	get isOwner(): boolean {
		return Vue.$utils.permissions.isProjectOwner(this.project);
	}

	private async getTextDetails(): Promise<void> {
		this.loading = true;
		let queryParam = '';
		let url = ''
		const projectId = this.$route.query.project_id;
		if (projectId) {
			queryParam = `?project_id=${projectId}`;
		}
		console.log(this.$route.params.repoName);
		if (this.type=='cite') {
			this.repository = 'citesphere';
		} 
		else {
			this.repository = 'amphora'
		}
		Vue.$axios.get(`/repository/${this.$route.params.repoName}/${this.$route.params.repoId}/groups/${this.$route.params.groupId}/items/${this.$route.params.itemId}${queryParam}`)
			.then((response: AxiosResponse) => {
				this.chosenText = this.$route.params.textId;
				console.log("this text", this.chosenText);
				this.text = response.data.master_text_object;

				this.filtered_text = this.text.filter(o -> o.id === this.chosenText);
				this.data = response.data.result;
                console.log("this text", this.text);
				if (response.data.part_of_project) {
					this.partOfProject = response.data.part_of_project;
				}
				// this.project = response.data.project_details;
				// this.masterId = response.data.master_text.id;
				// this.submitted = response.data.submitted;

				// if (this.project && !projectId) {
				// 	const query = this.$route.query;
				// 	this.$router.replace({
				// 		query: {
				// 			...query,
				// 			project_id: `${this.project.id}`,
				// 		},
				// 	});
				// }
				// if (this.project) {
				// 	this.navItems[1].text = this.project.name;
				// 	this.navItems[1].to = `/project/${this.project.id}`;
				// }
				// const repo = response.data.repository;
				// this.navItems[3].text = repo.name;
				// this.navItems[3].to = `/repository/${this.$route.params.repoName}/${repo.id}${queryParam}`;
				// this.navItems[5].text = this.text.title;
			})
			.catch(() => this.error = true)
			.finally(() => this.loading = false);
	}

	private async addText(): Promise<void> {
		this.addingText = true;
		Vue.$axios.post(`/project/${this.$route.query.project_id}/add_text`,
				{ text_id: this.text.id, repository_id: this.$route.params.repoId },
			)
			.then((response: AxiosResponse) => {
				this.addingText = false;
				this.snackbar = true;
				this.snackbarText = 'Successfully added text to the project';
				this.snackbarColor = 'success';
				this.getTextDetails();
			})
			.catch(() => {
				this.addingText = false;
				this.snackbar = true;
				this.snackbarText = 'Error while adding text to the project';
				this.snackbarColor = 'error';
			});
	}

	private async removeText(): Promise<void> {
		this.removingText = true;
		Vue.$axios.delete(`/project/${this.$route.query.project_id}`, {
				data: { text_id: this.masterId },
			})
			.then(() => {
				this.removingText = false;
				this.snackbar = true;
				this.snackbarText = 'Successfully removed text from the project';
				this.snackbarColor = 'success';
				this.project = null;
				this.partOfProject = null;
				this.getTextDetails();
			})
			.catch((error) => {
				this.removingText = false;
				this.snackbar = true;
				this.snackbarColor = 'error';
				if (error.response.status === 412) {
					this.snackbarText = 'Text cannot be removed after annotations have been submitted to Quadriga';
				} else {
					this.snackbarText = 'Error while removing text from the project';
				}
			});
	}

	private async moveProject(targetProject: Project): Promise<void> {
		if (!this.partOfProject) {
			return;
		}

		this.movingProject = true;
		Vue.$axios.post(
			`/repository/${this.$route.params.repoName}/${this.$route.params.repoId}/texts/${this.$route.params.textId}/transfer_to_project`,
			{
				project_id: this.partOfProject.id,
				target_project_id: targetProject.id,
			},
		)
			.then((response: AxiosResponse) => {
				this.snackbarText = response.data.message;
				this.snackbarColor = 'success';
				this.snackbar = true;
				this.projectMoveDialog = false;
				const param = `?project_id=${targetProject.id}`;
				this.$router.push(
					`/repository/${this.$route.params.repoName}/${this.$route.params.repoId}/text/${this.$route.params.textId}${param}`,
				);
				this.getTextDetails();
			})
			.catch((error: AxiosError) => {
				if (error.response && error.response.data && error.response.data.message) {
					this.snackbarText = error.response.data.message;
				} else {
					this.snackbarText = error.message;
				}
				this.snackbarColor = 'error';
				this.snackbar = true;
			})
			.finally(() => {
				this.movingProject = false;
			});
	}
}
</script>

<style scoped>
.text-details {
  padding: 20px;
  margin-bottom: 20px;
}
.card-annotations {
  padding: 20px 0;
  text-align: left;
}
.annotation-title {
  padding: 0 16px 8px;
}
.delete-button-text{
	color: white;
	padding-left: 10px;
}
.project-name:link, .project-name:visited {
	text-decoration: none;
}
.project-name:hover, .project-name:active {
	text-decoration: underline;
}
</style>