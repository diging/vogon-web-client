<template lang="pug">
	div(class="main")
		br
		ErrorIndicator(v-if="error") Error while loading text details!
		div(v-else)
			Loading(v-if="loading")
			template(v-else)
				v-card(tile outlined class="text-details")
					v-row
						v-col(cols="6")
							h3(class="headline") Resource "{{ text.title }}"
							v-list-item-subtitle(class="text--primary" v-text="text.uri")
						v-col(cols="6")
							div(v-if="partOfProject && isEditable && !submitted" class="float-right")
								v-tooltip(left)
									template(v-slot:activator="{ on }")
										v-btn(color="#db1a04" v-on="on" @click="removeText")
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
								v-btn(color="primary" @click="addText")
									v-icon(left) mdi-plus
									| Add to project
					v-alert(
						type="warning"
						dense
						v-if="text.state !== 'OK'"
					) The item is still pending with Amphora. Wait until then for starting annotations
				p(class="body-1")
					| The following content objects are associated with this resource. 
					| Select a content object to begin annotating that object in VogonWeb. 
				TextSerialContent(
					v-bind:contents="text.aggregate_content"
					v-bind:ready="text.state === 'OK'"
					v-bind:editable="isEditable"
				)
				TextAdditionalContent(
					v-bind:contents="text.content"
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
						template(v-if="!relations.length")
							EmptyView No annotations found!
						template(v-else)
							AnnotationList(v-bind:annotations="relations")

		v-snackbar(v-model="snackbar" top)
			| {{ snackbarText }}
			v-btn(color="red" text @click="snackbar = false") Close
</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import { Component, Vue } from 'vue-property-decorator';

import EmptyView from '@/components/global/EmptyView.vue';
import ErrorIndicator from '@/components/global/ErrorIndicator.vue';
import Loading from '@/components/global/Loading.vue';
import AnnotationList from '@/components/relations/AnnotationList.vue';
import TextAdditionalContent from '@/components/texts/amphora/TextAdditionalContent.vue';
import TextSerialContent from '@/components/texts/amphora/TextSerialContent.vue';
import { Project } from '@/interfaces/ProjectTypes';
import { RelationSet } from '@/interfaces/RelationTypes';
import { TextResource } from '@/interfaces/RepositoryTypes';

@Component({
  name: 'TextDetails',
  components: {
		Loading,
		EmptyView,
		ErrorIndicator,
		TextSerialContent,
		TextAdditionalContent,
		AnnotationList,
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

	private snackbarText: string = '';
	private snackbar: boolean = false;

	public async mounted(): Promise<void> {
		this.getTextDetails();
	}
	
	get isEditable(): boolean {
		if (this.project) {
			return Vue.$utils.permissions.isProjectCollaborator(this.project);
		}
		return false;
	}

	private async getTextDetails(): Promise<void> {
		let queryParam = '';
		const projectId = this.$route.query.project_id;
		if (projectId) {
			queryParam = `?project_id=${projectId}`;
		}
		Vue.$axios.get(`/repository/amphora/${this.$route.params.repoId}/texts/${this.$route.params.textId}${queryParam}`)
			.then((response: AxiosResponse) => {
				this.text = response.data.result as TextResource;
				if (response.data.part_of_project) {
					this.partOfProject = response.data.part_of_project;
				}
				this.project = response.data.project_details;
				this.relations = response.data.relations;
				this.masterId = response.data.master_text.id;
				if (response.data.submitted) {
					this.submitted = true;
				} else {
					this.submitted = false;
				}
			})
			.catch(() => this.error = true)
			.finally(() => this.loading = false);
	}
	private async addText(): Promise<void> {
		Vue.$axios.post(`/project/${this.$route.query.project_id}/add_text`,
				{ text_id: this.text.id, repository_id: this.$route.params.repoId },
			)
			.then((response: AxiosResponse) => {
				this.getTextDetails();
			})
			.catch(() => {
				this.snackbar = true;
				this.snackbarText = 'Error while adding text to the project';
			});
	}
	private async removeText(): Promise<void> {
		Vue.$axios.delete(`/project/${this.$route.query.project_id}`, {
				data: { text_id: this.masterId },
			})
			.then(() => {
				this.project = null;
			})
			.catch((error) => {
				this.snackbar = true;
				if (error.response.status === 412) {
					this.snackbarText = 'Text cannot be removed after annotations have been submitted to Quadriga';
				} else {
					this.snackbarText = 'Error while removing text from the project';
				}
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
</style>