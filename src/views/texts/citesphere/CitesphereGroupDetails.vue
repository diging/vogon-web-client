<template lang="pug">
div(class="main")
	h2(class="display-1") Group Details
	br
	ErrorIndicator(v-if="error") {{errorMsg}}
	div(v-else)
		Loading(v-if="loading")
		div(v-else)
			v-card(tile outlined)
				v-card-title {{ groupDetails.group.name }}
				v-card-text(class="subtitle-1")
					span(v-html="groupDetails.group.description")
			
			v-row(class="mt-4")
				v-col(:cols="3")
					v-card(tile outlined)
						v-card-title Collections
						v-card-text
							v-treeview(
								v-if="groupDetails.collections.length > 0"
								:items="groupDetails.collections"
								:load-children="fetchCollections"
								:active.sync="selectedCollections"
								v-model="collectionTree"
								@update:active="page = 1; getItems()"
								activatable
								item-key="key"
								item-text="name"
								dense
								class="mt-2"
							)

								template(v-slot:prepend="{ item, open }")
									v-icon
										| {{ open ? `mdi-folder-open` : `mdi-folder` }}
								template(v-slot:append="{ item }")
									v-chip(small) {{ item.numberOfItems }}
							
							div(v-else) No collections!
				v-col(:cols="9")
					v-card(tile outlined)
						v-card-title Items
						v-card-text
							v-data-table(
								v-on:pagination="(p) => getItems(p.page)"
								:headers="itemHeaders"
								:items="groupDetails.items"
								:loading="itemsLoading"
								:page.sync="page"
								:items-per-page="50"
								:server-items-length="itemsCount" 
								:footer-props="{'items-per-page-options':['', 50]}"
								@click:row="switchPath"
							)


								template(v-slot:item.itemType="{ item }")
									div(class="item-type") {{ item.itemType.toLowerCase().split("_").join(" ") }}
								
								template(v-slot:item.authors="{ item }")
									div {{ getAuthors(item) }}
								template(v-slot:top="{ pagination, options, updateOptions }")
									v-data-footer(
										:pagination="pagination" 
										:options="options"
										@update:options="updateOptions"
										:items-per-page-options="['', 50]"
										items-per-page-text="$vuetify.dataTable.itemsPerPageText"
									)

</template>

<script lang="ts">
import { AxiosError, AxiosResponse } from 'axios'
import { Component, Vue } from 'vue-property-decorator'

import EmptyView from '@/components/global/EmptyView.vue'
import ErrorIndicator from '@/components/global/ErrorIndicator.vue'
import Loading from '@/components/global/Loading.vue'
import TextItem from '@/components/texts/citesphere/TextItem.vue'
import TextResources from '@/components/texts/amphora/TextResources.vue'

import {
	CitesphereCollection,
	CitesphereGroupInfo,
	CitesphereItem,
	CitesphereItemAuthor,
} from '@/interfaces/CitesphereTypes';

@Component({
	name: 'CitesphereGroupDetails',
	components: {
		Loading,
		ErrorIndicator,
		EmptyView,
		TextItem,
	},
})
export default class CitesphereGroupDetails extends Vue {
	private groupDetails: CitesphereGroupInfo | null = null
	private itemsCount: number = 0
	private loading: boolean = true
	private error: boolean = false
	private errorMsg: string = ""
	private queryParam: string = ''
	private page: number = 1

	private collectionTree: any = [];
	private selectedCollections: string[] = []
	private isDisplayComponent: boolean = false
	private currentElement: any = ''
	private itemHeaders = [
		{ text: 'Type', value: 'itemType' },
		{ text: 'Title', value: 'title' },
		{ text: 'Publication', value: 'publicationTitle' },
		{ text: 'Date', value: 'dateFreetext' },
		{ text: 'Authors/Editors', value: 'authors' },
	];
	private itemsLoading: boolean = false

	public async mounted(): Promise<void> {
		const projectId = this.$route.query.project_id
		if (projectId) {
			this.queryParam = `?project_id=${projectId}`
		}

		Vue.$axios.get(`/repository/citesphere/${this.$route.params.repoId}/groups/${this.$route.params.groupId}`)
			.then((response: AxiosResponse) => {
				this.groupDetails = response.data as CitesphereGroupInfo
				this.itemsCount = this.groupDetails.group.numItems
			})
			.catch((error: AxiosError) => {
				this.error = true
				if (error.response) {
					if (error.response.status == 404) {
						this.errorMsg = error.response.data.message
					}
				}
			})
			.finally(() => this.loading = false)
	}

	private switchPath(value: any) {
		const query = this.$route
		this.$router.replace({ path: `/repository/citesphere/${this.$route.params.repoId}/groups/${this.$route.params.groupId}/items/${value.key}${this.queryParam}` })
		
	}

	private async fetchCollections(collection: CitesphereCollection) {
		return Vue.$axios.get(
			`/repository/citesphere/${this.$route.params.repoId}/groups/${
				this.$route.params.groupId
			}/collections/${collection.key}/collections`,
		).then((response: AxiosResponse) => response.data.collections)
		.then((collections: CitesphereCollection[]) => {
			collection.children.push(...collections)
		})
	}

	private async getItems(page: number = 1) {
		this.itemsLoading = true
		let url
		const queryParams = `page=${page}`
		if (this.selectedCollections.length > 0) {
			url = `/repository/citesphere/${this.$route.params.repoId}/groups/${
			this.$route.params.groupId
			}/collections/${this.selectedCollections[0]}/items?${queryParams}`
		} else {
			url = `/repository/citesphere/${this.$route.params.repoId}/groups/${
			this.$route.params.groupId
			}/items?${queryParams}`
		}

		Vue.$axios.get(url)
			.then((response: AxiosResponse) => {
				if (this.groupDetails) {
					this.groupDetails.items = response.data.items
					this.itemsCount = this.groupDetails.group.numItems
				}
			}).finally(() => this.itemsLoading = false)
	}

	private getAuthors(item: CitesphereItem): string {
		let authors: string[] = []
		const authorRepr = (author: CitesphereItemAuthor) => {
			let result = ''
			if (author.firstName && author.lastName) {
				result = `${author.lastName}, ${author.firstName}`
			} else if (author.lastName) {
				result = author.lastName
			} else if (author.lastName) {
				result = author.firstName
			}
			return result
		}

		if (item.authors.length > 0) {
			authors = item.authors.map(authorRepr)
		} else if (item.editors.length > 0) {
			authors = item.editors.map(authorRepr)
		}
		return authors.join('; ')
	}
}
</script>

<style scoped>
.group-info {
	padding: 20px;
}

.item-type {
	text-transform: capitalize;
}
</style>