<template lang="pug">
div(class="main")
    v-card(tile outlined class="col-details")
    v-card-title Item
        Loading(v-if="loading")

        template(v-if="!master_text && !loading")
            EmptyView No files found!
        v-list(v-else two-line)
            v-list-item(:key="master_text.id" v-bind:to="`/repository/citesphere/${repoId}/groups/${groupId}/items/${item}/texts/${master_text.id}${queryParam}`")
                v-list-item-content
                    v-list-item-title(class="font-weight-medium" v-text="master_text.title")
                    v-list-item-subtitle(class="text--primary" v-text="master_text.uri")
                v-list-item-action
                        v-list-item-action-text
                        
            v-divider(v-if="index + 1 < item.length" :key="index")

</template>

<script lang="ts">
import { AxiosResponse } from 'axios'
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
	private repoId: any
	private queryParam: any
	private item: any
	private groupId: any
	private loading: boolean = true
	private error: boolean = false
	private data: any
	private master_text: any = null
	private test: string = ''
	private test1: string = ''
	public created() {
		this.test1 = "created"
		this.repoId = this.$route.params.repoId
        let queryParam = this.$route.query.project_id
        this.item = this.$route.params.itemId
        this.groupId = this.$route.params.groupId
        if (queryParam) {
			this.queryParam = `?project_id=${queryParam}`
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
}
</script>

<style scoped>
.repo-details {
	padding: 20px;
}
</style>