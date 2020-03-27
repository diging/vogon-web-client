<template lang="pug">
	div(class="main")
		h2(class="display-1") Project Details
		br
		ErrorIndicator(v-if="error") Error while loading project details!
		div(v-else)
			Loading(v-if="loading")
			v-card(v-else tile outlined class="project-details")
				v-row
					v-col(md="6")
						h3(class="headline") {{ project.name }}
						h4(class="subtitle-1") {{ project.description }}
						span(class="body-2 blue-grey--text text--darken-1") Created by 
							strong "{{ project.ownedBy.username }}" 
							| &nbsp;on {{moment(project.created).format('lll')}}
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
</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import { Component, Vue } from 'vue-property-decorator';

import EmptyView from '@/components/global/EmptyView.vue';
import ErrorIndicator from '@/components/global/ErrorIndicator.vue';
import Loading from '@/components/global/Loading.vue';
import CreateUpdateProject from '@/components/project/CreateUpdateProject.vue';
import ProjectCollaborators from '@/components/project/ProjectCollaborators.vue';
import { Project } from '@/interfaces/ProjectTypes';

@Component({
	name: 'ProjectDetails',
	components: {
		CreateUpdateProject,
		ProjectCollaborators,
		EmptyView,
		ErrorIndicator,
		Loading,
	},
})
export default class ProjectDetails extends Vue {
	private project: Project = { name: '', participants: []};
	private loading: boolean = true;
	private error: boolean = false;
	private textHeaders = [{text: 'Title', value: 'title'}, {text: 'Added', value: 'added'}];

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
		return Vue.$axios.get(`/project/${this.$route.params.id}`)
			.then((response: AxiosResponse) => {
				this.project = response.data as Project;
			})
			.catch(() => this.error = true)
			.finally(() => this.loading = false);
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