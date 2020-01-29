<template lang="pug">
	div(class="main")
		h2(class="display-1") Concept Types
		br
		v-data-table(
			class="elevation-1"
			:headers="headers"
			:items="types"
			:loading="loading" 
		)
			template(v-slot:no-data)
				ErrorIndicator(v-if="error" class="pb-4") Error while loading concept types!
				EmptyView(v-else) No concept types found!

			template(v-slot:item.label="{ item }")
				a(v-bind:href="`/types/${item.id}`" class="type-link") {{ item.label }}
</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import { Component, Vue } from 'vue-property-decorator';

import ErrorIndicator from '@/components/global/ErrorIndicator.vue';
import { ConceptType } from '@/interfaces/ConceptTypes';

@Component({
	name: 'ConceptTypes',
	components: {
		ErrorIndicator,
	},
})
export default class ConceptTypes extends Vue {
	private loading: boolean = true;
	private error: boolean = false;
	private types: ConceptType[] = [];

	private headers = [
		{text: 'Label', value: 'label'},
		{text: 'Description', value: 'description'},
		{text: 'URI', value: 'uri'},
	];

	public created() {
		Vue.$axios.get('/type')
			.then((response: AxiosResponse) => {
				this.types = response.data;
			})
			.catch(() => this.error = true)
			.finally(() => this.loading = false);
	}
}
</script>

<style scoped>
.type-link {
	text-decoration: none;
	font-weight: bold;
}
</style>