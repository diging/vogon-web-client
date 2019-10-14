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
					v-card-title Collections
					template(v-if="!repo.collections.length")
						EmptyView No collections found!
					RepoCollections(v-else v-bind:collections="repo.collections" v-bind:repoId="$route.params.id")

</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import { Component, Vue } from 'vue-property-decorator';

import EmptyView from '@/components/global/EmptyView.vue';
import ErrorIndicator from '@/components/global/ErrorIndicator.vue';
import Loading from '@/components/global/Loading.vue';
import RepoCollections from '@/components/texts/RepoCollections.vue';
import { Repository } from '@/models';

@Component({
	name: 'RepoDetails',
	components: {
		Loading,
		ErrorIndicator,
		RepoCollections,
		EmptyView,
	},
})
export default class RepoDetails extends Vue {
	private repo: Repository = {id: 1, name: ''};
	private loading: boolean = true;
	private error: boolean = false;

	public async mounted(): Promise<void> {
		Vue.$axios.get(`/repository/${this.$route.params.id}`)
			.then((response: AxiosResponse) => {
				this.repo = response.data as Repository;
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