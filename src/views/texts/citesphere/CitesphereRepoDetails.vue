<template lang="pug">
div(class="main")
	h2(class="display-1") Repository Details
	br
	ErrorIndicator(v-if="error") Error while loading repository details!
	div(v-else)
		Loading(v-if="loading")
		div(v-else)
			v-card(tile outlined class="repo-details")
				h3(class="headline") {{ repo.name }}
				h4(class="subtitle-1") {{ repo.description }}
			br
			v-card(class="card-project-text")
				v-card-title Groups
				template(v-if="!repo.groups.length")
					EmptyView No groups found!
				RepoGroups(v-else v-bind:groups="repo.groups" v-bind:repoId="$route.params.id" v-bind:queryParam="queryParam")

</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import { Component, Vue } from 'vue-property-decorator';

import EmptyView from '@/components/global/EmptyView.vue';
import ErrorIndicator from '@/components/global/ErrorIndicator.vue';
import Loading from '@/components/global/Loading.vue';
import RepoGroups from '@/components/texts/citesphere/RepoGroups.vue';
import { CitesphereRepository } from '@/interfaces/CitesphereTypes';

@Component({
	name: 'CitesphereRepoDetails',
	components: {
		Loading,
		ErrorIndicator,
		RepoGroups,
		EmptyView,
	},
})
export default class CitesphereRepoDetails extends Vue {
	private repo: CitesphereRepository = {id: 1, name: '', repo_type: 'Citesphere'};
	private loading: boolean = true;
	private error: boolean = false;
	private queryParam: string = '';

	public async mounted(): Promise<void> {
		const projectId = this.$route.query.project_id;
		if (projectId) {
			this.queryParam = `?project_id=${projectId}`;
		}

		Vue.$axios.get(`/repository/citesphere/${this.$route.params.id}`)
			.then((response: AxiosResponse) => {
				this.repo = response.data as CitesphereRepository;
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