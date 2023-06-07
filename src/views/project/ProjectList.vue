<template lang="pug">
	div(class="main")
		v-row
			v-col(md="6")
				h2(class="display-1") Projects
			v-col(md="6")
				div(class="float-right")
					CreateUpdateProject(:getProjectDetails="getProjectDetails")

		v-card(class="card-projects mt-4")
			ProjectFilter(
				:onApply="onApplyFilter"
				class="mb-6"
			)
			ErrorIndicator(v-if="error") Error while loading projects!
			div(v-else)
				Loading(v-if="loading")
				template(v-else)
					template(v-if="!projects.length")
						EmptyView No projects found!
					template(v-else)
						v-list(v-for="(project, index) in projects" :key="project.id" class="project-list")
							ProjectItem(:project="project")
							v-divider(v-if="index + 1 < projects.length")

						v-pagination(
							v-model="page"
							:length="Math.ceil(projectsCount / PAGE_SIZE)"
							v-on:input="getProjectList"
						)

</template>

<script lang="ts">
import { AxiosResponse } from 'axios'
import { Component, Vue } from 'vue-property-decorator'

import EmptyView from '@/components/global/EmptyView.vue'
import ErrorIndicator from '@/components/global/ErrorIndicator.vue'
import Loading from '@/components/global/Loading.vue'
import CreateUpdateProject from '@/components/project/CreateUpdateProject.vue'
import ProjectFilter from '@/components/project/ProjectFilter.vue'
import ProjectItem from '@/components/project/ProjectItem.vue'
import { PAGE_SIZE } from '@/constants'
import { Project } from '@/interfaces/ProjectTypes'
import { getUserId } from '@/utils'


@Component({
	name: 'ProjectList',
	components: {
		Loading,
		ErrorIndicator,
		EmptyView,
		CreateUpdateProject,
		ProjectItem,
		ProjectFilter,
	},
})
export default class ProjectList extends Vue {
	private projects: Project[] = []
	private loading: boolean = true
	private error: boolean = false
	private isAdmin: boolean = false
	private currentUsername: string = ''
	private filters: any = {
		field: '',
		name: '',
		collaborator: this.$utils.getUserId(),
		limit: PAGE_SIZE,
		offset: 0,
		owner: this.$utils.getUserId(),
	};
	private projectsCount: number = 0

	private page: number = 1
	private PAGE_SIZE: number = PAGE_SIZE

	public mounted(): void {
		this.getProjectList()
		this.isAdminUser()
	}

	private getFilter(page: number): any {
		const field = this.$route.query.field || this.filters.field
		const query = this.$route.query.query || this.filters.query
		const params: any = {
			[field]: query,
			collaborator: this.filters.collaborator,
			limit: this.filters.limit,
			offset: (page - 1) * PAGE_SIZE,
		};
		return params
	}

	private getProjectList(page: number = 1) {
		const params = this.getFilter(page)
		Vue.$axios
			.get('/project', { params })
			.then((response: AxiosResponse) => {
				this.projects = response.data.results
				this.projectsCount = response.data.count
			})
			.catch(() => (this.error = true))
			.finally(() => (this.loading = false))
	}

	private getAllProjectsList(page: number = 1) {
		Vue.$axios
			.get('/project/list_all_projects')
			.then((response: AxiosResponse) => {
				this.projects = response.data.results
				this.projectsCount = response.data.count
			})
			.catch(() => (this.error = true))
			.finally(() => (this.loading = false))
	}

	private getProjectDetails(project: Project) {
		if (project.id) {
			this.$router.push({
				name: 'project-details',
				params: { id: project.id.toString() },
			});
		}
	}

	private isAdminUser() {
		const userId = getUserId()
		Vue.$axios.get(`/users/${userId}`)
			.then((response: AxiosResponse) => {
				this.isAdmin = response.data.is_admin
				this.currentUsername = response.data.username
			});
		return this.isAdmin
	}

	private onApplyFilter(query: string, field: string, showUserProjects?: string, projects?: string, projectQuery?: string) {
		this.filters.query = query
		this.filters.field = field
		if (this.isAdmin) {
			if (projectQuery == 'my projects') {
				this.filters.field = 'owner'
				this.filters.query = this.currentUsername
				this.getProjectList()
			}
			else if (projectQuery == 'shared projects') {
				this.filters.collaborator = this.$utils.getUserId()
				this.getProjectList()
			}
			else if (projectQuery == 'all projects'){
				this.getAllProjectsList()
			}
			else {
				this.getProjectList()
			}
		}
		else {
			if (showUserProjects) {
				this.filters.field = 'owner'
				this.filters.query = this.currentUsername
			} 
			else {
				this.filters.collaborator = this.$utils.getUserId()
			}
			this.getProjectList()
		}
	}

}
</script>

<style scoped>
.project-list {
	padding: 0;
	font-size: .875rem;
}
.card-projects {
	padding: 20px 0;
}
</style>