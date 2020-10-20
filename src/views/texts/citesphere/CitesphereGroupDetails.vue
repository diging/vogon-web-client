<template lang="pug">
	div(class="main")
		h2(class="display-1") Group Details
		br
		ErrorIndicator(v-if="error") Error while loading group details!
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
									class="mt-2"
									v-model="collectionTree"
									:items="groupDetails.collections"
									activatable
									item-key="name"
									open-on-click
									dense
								)
									template(v-slot:prepend="{ item, open }")
										v-icon
											| {{ open ? `mdi-folder-open` : `mdi-folder` }}
									template(v-slot:append="{ item }")
										v-chip(small) {{ item.numberOfItems }}
					v-col(:cols="9")
						v-card(tile outlined)
							v-card-title Items
							v-card-text
								v-data-table(
									:headers="itemHeaders"
									:items="groupDetails.items"
								)

</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import { Component, Vue } from 'vue-property-decorator';

import EmptyView from '@/components/global/EmptyView.vue';
import ErrorIndicator from '@/components/global/ErrorIndicator.vue';
import Loading from '@/components/global/Loading.vue';
import { CitesphereGroupInfo } from '@/interfaces/CitesphereTypes';

@Component({
	name: 'CitesphereGroupDetails',
	components: {
		Loading,
		ErrorIndicator,
		EmptyView,
	},
})
export default class CitesphereGroupDetails extends Vue {
	private groupDetails: CitesphereGroupInfo | null = null;
	private loading: boolean = true;
	private error: boolean = false;
	private queryParam: string = '';

	private collectionTree: any = [];
	private itemHeaders = [
		{ text: 'Type', value: 'itemType' },
		{ text: 'Title', value: 'title' },
	];

	public async mounted(): Promise<void> {
		const projectId = this.$route.query.project_id;
		if (projectId) {
			this.queryParam = `?project_id=${projectId}`;
		}

		Vue.$axios.get(`/repository/citesphere/${this.$route.params.repoId}/groups/${this.$route.params.groupId}`)
			.then((response: AxiosResponse) => {
				this.groupDetails = response.data as CitesphereGroupInfo;
			})
			.catch(() => this.error = true)
			.finally(() => this.loading = false);
	}
}

</script>

<style scoped>
.group-info {
	padding: 20px;
}
</style>