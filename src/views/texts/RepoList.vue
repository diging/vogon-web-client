<template lang="pug">
div(class="main")
	h2(class="display-1") Repositories
	h4(class="subtitle-1") Repositories are configured by the system administrator

	ErrorIndicator(v-if="error") Error while loading repositories!
	div(v-else)
		Loading(v-if="loading")
		v-list(v-else color="transparent")
			Breadcrumbs(:items="navItems" class="mt-2")
			template(v-if="!repos.length")
				EmptyView No repositories found!
			template(v-else)
				v-list-item(v-for="repo in repos" :key="repo.id" class="repo-item" v-bind:to="repoURL(repo)")
					v-card(width="100%" elevat)
						v-card-title {{repo.name}}
						v-card-text {{repo.description}}

</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import { Component, Vue } from 'vue-property-decorator';

import Breadcrumbs from '@/components/global/Breadcrumbs.vue';
import EmptyView from '@/components/global/EmptyView.vue';
import ErrorIndicator from '@/components/global/ErrorIndicator.vue';
import Loading from '@/components/global/Loading.vue';
import { Repository } from '@/interfaces/RepositoryTypes';

@Component({
	name: 'RepoList',
	components: {
		Breadcrumbs,
		Loading,
		ErrorIndicator,
		EmptyView,
	},
})
export default class RepoList extends Vue {
	private repos: Repository[] = [];
	private loading: boolean = true;
	private error: boolean = false;
	private queryParam: string = '';
	private navItems = [
		{ text: 'Projects', to: '/project', link: true, exact: true },
		{ text: '', to: '', link: true, exact: true },
		{ text: 'Repositories', link: false },
	];

	public mounted(): void {
		const projectId = this.$route.query.project_id;
		if (projectId) {
			this.queryParam = `?project_id=${projectId}`;
		}

		Vue.$axios
			.get(`/repository${this.queryParam}`)
			.then((response: AxiosResponse) => {
				this.repos = response.data.results;

				const project = response.data.project;
				this.navItems[1].text = project.name;
				this.navItems[1].to = `/project/${project.id}`;
			})
			.catch(() => (this.error = true))
			.finally(() => (this.loading = false));
	}

	private repoURL(repo: Repository): string {
		if (repo.repo_type === 'Amphora') {
			return `/repository/amphora/${repo.id}${this.queryParam}`;
		} else if (repo.repo_type === 'Citesphere') {
			return `/repository/citesphere/${repo.id}${this.queryParam}`;
		}
		return '';
	}
}
</script>

<style scoped>
.repo-item {
	padding: 0;
	margin: 10px 0;
}
</style>