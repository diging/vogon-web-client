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
					v-list-item(v-for="project in projects" :key="project.id" class="project-item" v-bind:href="`/project/${project.id}`")
						v-card(width="100%" class="project-item-card" elevat)
							v-card-title {{project.name}}
							v-card-text
								div(class="text--primary") {{project.description}}
								| Created by 
								strong "{{project.ownedBy.username}}"
								| on {{moment(project.created).format('lll')}}
								div(class="teal--text") 
								strong {{project.num_texts}} texts, {{project.num_relations}} relations
</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import { Component, Vue } from 'vue-property-decorator';
import { Location } from 'vue-router';

import ErrorIndicator from '@/components/global/ErrorIndicator.vue';
import Loading from '@/components/global/Loading.vue';
import CreateUpdateProject from '@/components/project/CreateUpdateProject.vue';
import { Project } from '@/components/project/models';
import { VForm } from '@/models';

@Component({
	name: 'ProjectList',
	components: {
		Loading,
		ErrorIndicator,
		CreateUpdateProject,
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
.project-item {
	padding: 0;
	margin: 10px 0;
}
</style>