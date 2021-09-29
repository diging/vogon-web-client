<template lang="pug">
	v-card(tile outlined class="col-details")
		v-card-title Item
			template(v-if="!master_text")
				EmptyView No files found!
			v-list(v-else two-line)
				template(v-for="(resource, index) in master_text")
					//- /repository/amphora/${repoId}/text/${resource.id}${queryParam}
					//- /repository/citesphere/${repoId}/groups/${groupId}/items/${item}/giles/${filesId}
					v-list-item(:key="resource.id" v-bind:to="`/repository/citesphere/${repoId}/groups/${groupId}/items/${item}/texts/${resource.id}${queryParam}`")
						v-list-item-content
							v-list-item-title(class="font-weight-medium" v-text="resource.title")
							v-list-item-subtitle(class="text--primary" v-text="resource.uri")
						//- v-list-item-action
						//- 		v-list-item-action-text
						//- 			template(v-for="content_type in [resource.uploadedFile.content_type]")
						//- 				v-chip(class="ma-2" color="primary" outlined pill :key="content_type") {{ content_type }}
					v-divider(v-if="index + 1 < item.length" :key="index")
			//- FileDisplay(v-else v-bind:files="item.gilesUploads"  v-bind:groupId="groupId" v-bind:item="item.key" v-bind:repoId="repoId" v-bind:queryParam="queryParam")
</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import { Component, Prop, Vue } from 'vue-property-decorator';
import EmptyView from '@/components/global/EmptyView.vue';

// import FileDisplay from "./FileDisplay.vue"

// import { CitesphereGroup } from '@/interfaces/CitesphereTypes';

@Component({
	name: 'TextContent',
	components: { EmptyView }
})
export default class TextContent extends Vue {
	@Prop() private readonly repoId!: string;
	@Prop() private readonly queryParam!: string;
	@Prop() private readonly item!: any;
	@Prop() private readonly groupId!: string;
	private loading: boolean = false;
	private error: boolean = false;
	private data: any;
	private master_text: any;
	public async mounted(): Promise<void>  {
		console.log("entereed inside Textitem", this.item);
		Vue.$axios.get(`/repository/citesphere/${this.repoId}/groups/${this.groupId}/items/${this.item}${this.queryParam}`)
			.then((response: AxiosResponse) => {
				this.data = response.data;
				this.master_text = response.data.master_text_object;
				console.log(this.master_text);
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