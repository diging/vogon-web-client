<template lang="pug">
	v-list(two-line)
		v-row(class="mx-3")
			v-col(:cols="6")
				div(:style="{ maxWidth: '400px', width: '100%' }")
					v-text-field(
						v-model="query"
						@keyup.enter.native="() => { page = 1; getRepoDetails(1); }" 
						outlined
						dense
						placeholder="Search collection by name..."
						label="Search"
					)
						template(v-slot:append-outer)
							v-btn(@click="() => { page = 1; getRepoDetails(1); }" small text dense)
								v-icon mdi-magnify
			v-col(:cols="6")
				v-btn(
					class="float-right"
					@click="all = !all"
					outlined
				)
					v-icon mdi-filter-variant
					template(v-if="all") My Collections
					template(v-else) View all
		div
			Loading(v-if="loading")
			template(v-else v-for="(collection, index) in collections.results")
				div
					v-list-item(:key="collection.id" v-bind:to="`/repository/amphora/${repoId}/collections/${collection.id}${queryParam}`")
						v-list-item-content
							v-list-item-title(v-text="collection.name")
							v-list-item-subtitle(class="text--primary" v-text="collection.description")
						v-list-item-action
							v-list-item-action-text
								v-badge
									template(v-slot:badge) {{collection.size}}
					v-divider(v-if="index + 1 < collections.results.length" :key="index")
			v-row(align="center" justify="center")
				v-pagination(
					class="my-4"
					v-model="page" 
					:length="Math.ceil(collections.count / PAGE_SIZE)"
					v-on:input="getRepoDetails"
				)
</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

import Loading from '@/components/global/Loading.vue';
import { PAGE_SIZE } from '@/constants';
import { TextCollectionResult } from '@/interfaces/RepositoryTypes';

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
	private query: string = '';
	private all: boolean = true;

	get collections(): TextCollectionResult {
		if (!this.repoCollecitons) {
			this.repoCollecitons = this.collectionResults;
		}
		return this.repoCollecitons;
	}

	set collections(value: TextCollectionResult) {
		this.repoCollecitons = value;
	}

	@Watch('all')
	public onAllChange(val: boolean, old: boolean) {
		this.getRepoDetails();
		this.page = 1;
	}

	private async getRepoDetails(page: number = 1): Promise<void> {
		this.loading = true;
		const params: any = {
			limit: PAGE_SIZE,
			offset: (page - 1) * PAGE_SIZE,
			q: this.query,
		};
		if (!this.all) {
			params.user = true;
		}

		Vue.$axios.get(`/repository/${this.$route.params.id}`, {
			params,
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