<template lang="pug">
	v-card
		v-card-title Search Project
		v-divider
		v-card-text(style="height: 400px;")
			v-text-field(
				v-model="projectQuery"
				placeholder="Search by Project name"
				dense
				outlined
				label="Project Name"
				class="field-text mt-3"
				append-outer-icon="mdi-magnify"
				@click:append-outer="searchProject"
				@keyup.enter.native="searchProject"
			)

			ErrorIndicator(v-if="searchError") Error while searching projects!
			template(v-else)
				Loading(v-if="searching")
				template(v-else)
					EmptyView(v-if="!projects.length") No projects found!
					v-list(two-line class="text-left" style="overflow: auto;")
						v-list-item-group(
							v-model="selectedProject"
							color="primary"
						)
							template(v-for="(project, i) in projects")
								v-list-item(@click="" :key="project.id")
									v-list-item-content
										v-list-item-title(
											v-text="project.name"
										)
										v-list-item-subtitle
										| Owned by {{ project.ownedBy.username }}
								v-divider(v-if="i + 1 < projects.length")

		v-divider
		v-card-actions
			v-spacer
			v-btn(color="blue darken-1" text @click="selectedProject = null; onClose();") Cancel
			v-btn(
				color="blue darken-1"
				text
				@click="chooseProject(); selectedProject = null;" 
				:disabled="!(selectedProject !== null && selectedProject >= 0)"
				:loading="choosingProject"
			) Move to Project
</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import { Component, Prop, Vue } from 'vue-property-decorator';

import EmptyView from '@/components/global/EmptyView.vue';
import ErrorIndicator from '@/components/global/ErrorIndicator.vue';
import Loading from '@/components/global/Loading.vue';
import { Project } from '@/interfaces/ProjectTypes';

@Component({
	name: 'ProjectSearch',
})
export default class ProjectSearch extends Vue {
	@Prop() private currentProject!: Project;
	@Prop() private choosingProject!: boolean;
	@Prop() private onProjectChoose!: (project: Project) => void;
	@Prop() private onClose!: () => void;

	private projectQuery: string = '';
	private projects: Project[] = [];
	private searching: boolean = false;
	private searchError: boolean = false;
	private selectedProject: number | null = null;

	private chooseProject() {
		if (this.selectedProject !== null && this.selectedProject >= 0) {
			this.onProjectChoose(this.projects[this.selectedProject]);
		}
	}

	private searchProject() {
		this.searching = true;
		this.searchError = false;
		this.selectedProject = null;
		const params = {
			q: this.projectQuery,
			project_id: this.currentProject.id,
		};
		Vue.$axios.get('/project/list_user_projects', { params })
			.then((response: AxiosResponse) => {
				this.projects = response.data;
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
