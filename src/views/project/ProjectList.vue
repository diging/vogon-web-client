<template lang="pug">
	div(class="main")
		v-row
			v-col(md="6")
				h2(class="display-1") Projects
			v-col(md="6")
				div(class="float-right")
					CreateUpdateProject(v-bind:getProjectDetails="getProjectDetails")
		ErrorIndicator(v-if="error") Error while loading projects!
		div(v-else)
			Loading(v-if="loading")
			v-list(v-else color="transparent")
				template(v-if="!projects.length")
					br
					div(class="text-center")
						v-icon(x-large) mdi-folder
						br
						div No projects found!
				template(v-else)
					v-card(tile outlined)
						v-list(v-for="(project, index) in projects" :key="project.id" class="project-list")
							ProjectItem(v-bind:project="project")
							v-divider(v-if="index + 1 < projects.length")

</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import { Component, Vue } from 'vue-property-decorator';
import { Location } from 'vue-router';

import ErrorIndicator from '@/components/global/ErrorIndicator.vue';
import Loading from '@/components/global/Loading.vue';
import CreateUpdateProject from '@/components/project/CreateUpdateProject.vue';
import ProjectItem from '@/components/project/ProjectItem.vue';
import { VForm } from '@/interfaces/GlobalTypes';
import { Project } from '@/interfaces/ProjectTypes';


@Component({
	name: 'ProjectList',
	components: {
		Loading,
		ErrorIndicator,
		CreateUpdateProject,
		ProjectItem,
	},
})
export default class ProjectList extends Vue {
	private projects: Project[] = [];
	private loading: boolean = true;
	private error: boolean = false;

	public mounted(): void {
		this.getProjectList();
	}

	private getProjectList() {
		Vue.$axios
			.get('/project')
			.then((response: AxiosResponse) => {
				this.projects = response.data.results;
			})
			.catch(() => (this.error = true))
			.finally(() => (this.loading = false));
	}

	private getProjectDetails(project: Project) {
		if (project.id) {
			this.$router.push({
				name: 'project-details',
				params: { id: project.id.toString() },
			});
		}
	}
}
</script>

<style scoped>
.project-list {
	padding: 0;
	font-size: .875rem;
}
</style>