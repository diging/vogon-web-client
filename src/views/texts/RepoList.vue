<template lang="pug">
	div(class="main")
		h2(class="display-1") Repositories
		h4(class="subtitle-1") Repositories are configured by the system administrator

		ErrorIndicator(v-if="error") Error while loading repositories!
		div(v-else)
			Loading(v-if="loading")
			v-list(v-else color="transparent")
				template(v-if="!repos.length")
					br
					div(class="text-center")
						v-icon(x-large) mdi-folder
						br
						div No repositories found!
				template(v-else)
					v-list-item(v-for="repo in repos" :key="repo.id" class="repo-item" v-bind:href="`/repository/${repo.id}`")
						v-card(width="100%" elevat)
							v-card-title {{repo.name}}
							v-card-text {{repo.description}}

</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import { Component, Vue } from 'vue-property-decorator';

import ErrorIndicator from '@/components/global/ErrorIndicator.vue';
import Loading from '@/components/global/Loading.vue';
import { Repository } from '@/models';

@Component({
	name: 'RepoList',
	components: {
		Loading,
		ErrorIndicator,
	},
})
export default class RepoList extends Vue {
	private repos: Repository[] = [];
	private loading: boolean = true;
	private error: boolean = false;

	public mounted(): void {
		Vue.$axios
			.get('/repository')
			.then((response: AxiosResponse) => {
				this.repos = response.data.results;
			})
			.catch(() => (this.error = true))
			.finally(() => (this.loading = false));
	}
}
</script>

<style scoped>
.repo-item {
	padding: 0;
	margin: 10px 0;
}
</style>