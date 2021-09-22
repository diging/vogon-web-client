<template lang="pug">
	div(class="main")
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
	name: 'ItemDetails',
	components: {
		Loading,
		ErrorIndicator,
		RepoGroups,
		EmptyView,
	},
})
export default class ItemDetails extends Vue {
	private repoId: any;
	private queryParam: any;
	private item: any;
	private groupId: any;
	private loading: boolean = false;
	private error: boolean = false;
	private data: any;
	private master_text: any;
	public created()  {
		console.log("entereed inside Textitem", this.$route.params);
        this.repoId = this.$route.params.repoId;
        let queryParam = this.$route.query.project_id;
        this.item = this.$route.params.itemId;
        this.groupId = this.$route.params.groupId;
        if (queryParam) {
			this.queryParam = `?project_id=${queryParam}`;
		}
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
.repo-details {
	padding: 20px;
}
</style>