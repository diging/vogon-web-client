<template lang="pug">
v-card(tile outlined class="col-details")
    v-card-title Item
        template(v-if="!master_text")
            EmptyView No files found!
        v-list(v-else two-line)
            template(v-for="(resource, index) in master_text")
                v-list-item(:key="resource.id" v-bind:to="`/repository/citesphere/${repoId}/groups/${groupId}/items/${item}/texts/${resource.id}${queryParam}`")
                    v-list-item-content
                        v-list-item-title(class="font-weight-medium" v-text="resource.title")
                        v-list-item-subtitle(class="text--primary" v-text="resource.uri")
                v-divider(v-if="index + 1 < item.length" :key="index")
</template>

<script lang="ts">
import { AxiosResponse } from 'axios'
import { Component, Prop, Vue } from 'vue-property-decorator'

import EmptyView from '@/components/global/EmptyView.vue'

@Component({
	name: 'TextItem',
	components: { EmptyView }
})
export default class TextItem extends Vue {
	@Prop() private readonly repoId!: string
	@Prop() private readonly queryParam!: string
	@Prop() private readonly item!: any
	@Prop() private readonly groupId!: string
	private loading: boolean = false
	private error: boolean = false
	private data: any
	private master_text: any

	public created()  {
		Vue.$axios.get(`/repository/citesphere/${this.repoId}/groups/${this.groupId}/items/${this.item}${this.queryParam}`)
			.then((response: AxiosResponse) => {
				this.data = response.data
				this.master_text = response.data.master_text_object
			})
			.catch(() => this.error = true)
			.finally(() => this.loading = false)
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