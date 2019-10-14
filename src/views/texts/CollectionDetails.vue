<template lang="pug">
	div(class="main")
		h2(class="display-1") Collection details
		br
		ErrorIndicator(v-if="error") Error while loading collection details!
		div(v-else)
			Loading(v-if="loading")
			div(v-else)
				h3(class="title font-weight-regular") Browsing colleciton "{{ collection.name }}"
				br
				v-card(tile outlined class="col-details")
					v-card-title Text resources
					template(v-if="!collection.resources.length")
						EmptyView No text resources found!
					TextResources(v-else v-bind:resources="collection.resources" v-bind:repoId="$route.params.repoId")
</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import { Component, Vue } from 'vue-property-decorator';

import EmptyView from '@/components/global/EmptyView.vue';
import ErrorIndicator from '@/components/global/ErrorIndicator.vue';
import Loading from '@/components/global/Loading.vue';
import TextResources from '@/components/texts/TextResources.vue';
import { TextCollection } from '@/models';

@Component({
	name: 'CollectionDetails',
	components: {
		Loading,
		EmptyView,
		ErrorIndicator,
		TextResources,
	},
})
export default class CollectionDetails extends Vue {
	private loading: boolean = true;
	private error: boolean = false;
	private collection: TextCollection = {id: 1, name: ''};

	public async mounted(): Promise<void> {
		Vue.$axios.get(`/repository/${this.$route.params.repoId}/collections/${this.$route.params.colId}`)
			.then((response: AxiosResponse) => {
				this.collection = response.data as TextCollection;
			})
			.catch(() => this.error = true)
			.finally(() => this.loading = false);
	}
}
</script>

<style scoped>
.col-details {
	padding: 0;
}
</style>