<template lang="pug">
div(class="main")
	v-card(tile outlined class="col-details")
	v-card-title Item
		Loading(v-if="loading")

		template(v-if="!master_text && !loading")
			EmptyView No files found!
		v-list(v-else two-line)
			v-list-item(:key="master_text.id" @click="addTextToProject")
				v-list-item-content
					v-list-item-title(class="font-weight-medium" v-text="master_text.title")
					v-list-item-subtitle(class="text--primary" v-text="master_text.uri")
				v-list-item-action
						v-list-item-action-text
						
			v-divider(v-if="index + 1 < item.length" :key="index")

	v-snackbar(v-model="snackbar" top :color="snackColor") {{ snackbarMsg }}

</template>

<script lang="ts">
import { AxiosError, AxiosResponse } from 'axios'
import { Component, Vue } from 'vue-property-decorator'

import EmptyView from '@/components/global/EmptyView.vue'
import ErrorIndicator from '@/components/global/ErrorIndicator.vue'
import Loading from '@/components/global/Loading.vue'
import RepoGroups from '@/components/texts/citesphere/RepoGroups.vue'

@Component({
	name: 'ItemDetails',
	components: {
		Loading,
		ErrorIndicator,
		RepoGroups,
		EmptyView,
	},
})
export default class ItemDetails extends Vue {
	private snackbar: boolean = false
	private snackbarMsg: string = ''
	private snackColor: string = 'success'
	private repoId: any
	private queryParam: any
	private item: any
	private groupId: any
	private projectId: string | (string | null)[] = []
	private loading: boolean = true
	private error: boolean = false
	private data: any
	private master_text: any = null
	public created() {
		this.repoId = this.$route.params.repoId
		this.projectId = this.$route.query.project_id
		this.item = this.$route.params.itemId
		this.groupId = this.$route.params.groupId
		if (this.projectId) {
			this.queryParam = `?project_id=${this.projectId}`
		}
		this.getDetails()
	}

	public async mounted(): Promise<void> {
		this.getDetails()
	}

	public async getDetails(): Promise<void> {
		Vue.$axios.get(`/repository/citesphere/${this.repoId}/groups/${this.groupId}/items/${this.item}${this.queryParam}`)
			.then((response: AxiosResponse) => {
				this.data = response.data
				this.master_text = response.data.master_text
			})
			.catch(() => this.error = true)
			.finally(() => this.loading = false)
	}

	private addTextToProject() {
		Vue.$axios.post(`/project/${this.projectId}/add_text`, {
			text_id: this.master_text.id,
			repository_id: this.repoId,
			item_id: this.item,
			group_id: this.groupId
		})
			.then((response: AxiosResponse) => {
				this.snackbarMsg = response.data.message
				this.snackColor = 'success'
				this.snackbar = true
			})
			.catch((error: AxiosError) => {
				if (error.response && error.response.data && error.response.data.message) {
					this.snackbarMsg = error.response.data.message
				} else {
					this.snackbarMsg = error.message
				}
				this.snackColor = 'error'
				this.snackbar = true
			})
			.finally(() => {
				setTimeout( () => this.$router.push({ path: `/repository/citesphere/${this.repoId}/groups/${this.groupId}/items/${this.item}/texts/${this.master_text.id}${this.queryParam}`}), 2000);
			})
	}
}
</script>

<style scoped>
.repo-details {
	padding: 20px;
}
</style>