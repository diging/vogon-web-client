<template lang="pug">
	div(class="main")
		h2(class="display-1") Repository Details
		br
		ErrorIndicator(v-if="error") Error while loading repository details!
		div(v-else)
			Loading(v-if="loading")
			div(v-else)
				Breadcrumbs(:items="navItems" class="mt-2")
				v-card(tile outlined class="repo-details")
					h3(class="headline") {{ repo.name }}
					h4(class="subtitle-1") {{ repo.description }}
				br
				v-card(class="card-project-text")
					v-card-title Collections
					template(v-if="!repo.collections.results.length")
						EmptyView No collections found!
					RepoCollections(
						v-else
						v-bind:collectionResults="repo.collections" 
						v-bind:repoId="$route.params.id" 
						v-bind:queryParam="queryParam"
					)

</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import { Component, Vue } from 'vue-property-decorator';

import Breadcrumbs from '@/components/global/Breadcrumbs.vue';
import EmptyView from '@/components/global/EmptyView.vue';
import ErrorIndicator from '@/components/global/ErrorIndicator.vue';
import Loading from '@/components/global/Loading.vue';
import RepoCollections from '@/components/texts/amphora/RepoCollections.vue';
import { PAGE_SIZE } from '@/constants';
import { Repository } from '@/interfaces/RepositoryTypes';

@Component({
	name: 'RepoDetails',
	components: {
		Breadcrumbs,
		Loading,
		ErrorIndicator,
		RepoCollections,
		EmptyView,
	},
})
export default class RepoDetails extends Vue {
	private repo: Repository = {id: 1, name: '', repo_type: 'Amphora'};
	private loading: boolean = true;
	private error: boolean = false;
	private queryParam: string = '';
	private navItems = [
		{ text: 'Projects', to: '/project', link: true, exact: true },
		{ text: '', to: '', link: true, exact: true },
		{ text: 'Repositories', to: '/repository', link: true, exact: true },
		{ text: '', to: '', link: true, exact: true },
	];

	public async mounted(): Promise<void> {
		const projectId = this.$route.query.project_id;
		if (projectId) {
			this.queryParam = `?project_id=${projectId}`;
			this.navItems[2].to = `${this.navItems[2].to}${this.queryParam}`;
		}

		this.getRepoDetails();
	}

	private async getRepoDetails() {
		this.loading = true;
		Vue.$axios.get(`/repository/amphora/${this.$route.params.id}${this.queryParam}`, {
			params: {
				limit: PAGE_SIZE,
			},
		})
			.then((response: AxiosResponse) => {
				this.repo = response.data as Repository;

				const project = response.data.project;
				this.navItems[1].text = project.name;
				this.navItems[1].to = `/project/${project.id}`;
				this.navItems[3].text = this.repo.name;
			})
			.catch(() => this.error = true)
			.finally(() => this.loading = false);
	}
}
</script>

<style scoped>
.repo-details {
	padding: 20px;
}
</style>