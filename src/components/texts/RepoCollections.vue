<template lang="pug">
	v-list(two-line)
		div
			Loading(v-if="loading")
			template(v-else v-for="(collection, index) in collections.results")
				div
					v-list-item(:key="collection.id" v-bind:href="`/repository/${repoId}/collections/${collection.id}${queryParam}`")
						v-list-item-content
							v-list-item-title(v-text="collection.name")
							v-list-item-subtitle(class="text--primary" v-text="collection.description")
						v-list-item-action
							v-list-item-action-text
								v-badge
									template(v-slot:badge) {{collection.size}}
					v-divider(v-if="index + 1 < collections.results.length" :key="index")
			v-row
				v-pagination(
					v-model="page" 
					:length="Math.ceil(collections.count / PAGE_SIZE)"
					v-on:input="getRepoDetails"
				)
</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import { Component, Prop, Vue } from 'vue-property-decorator';

import Loading from '@/components/global/Loading.vue';
import { PAGE_SIZE } from '@/constants';
import { TextCollection, TextCollectionResult } from '@/interfaces/RepositoryTypes';

@Component({
	name: 'RepoCollections',
	components: {
		Loading,
	},
})
export default class RepoCollections extends Vue {
	@Prop() private readonly collectionResults!: TextCollectionResult;
	@Prop() private readonly repoId!: string;
	@Prop() private readonly queryParam!: string;

	private repoCollecitons: TextCollectionResult | null = null;
	private loading: boolean = false;
	private error: boolean = false;
	private PAGE_SIZE: number = PAGE_SIZE;
	private page: number = 1;
	private items: number[] = [5, 10, 15];

	get collections(): TextCollectionResult {
		if (!this.repoCollecitons) {
			this.repoCollecitons = this.collectionResults;
		}
		return this.repoCollecitons;
	}

	set collections(value: TextCollectionResult) {
		this.repoCollecitons = value;
	}

	private async getRepoDetails(page: number = 1): Promise<void> {
		this.loading = true;
		Vue.$axios.get(`/repository/${this.$route.params.id}`, {
			params: {
				limit: PAGE_SIZE,
				offset: (page - 1) * PAGE_SIZE,
			},
		})
			.then((response: AxiosResponse) => {
				this.collections = response.data.collections;
			})
			.catch(() => this.error = true)
			.finally(() => this.loading = false);
	}
}
</script>

<style scoped>
.row-select {
	padding-right: 31px;
}
.rows-per-page {
	font-size: 19px;
	padding-top: 8px;
}
</style>