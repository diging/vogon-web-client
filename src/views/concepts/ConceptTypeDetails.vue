<template lang="pug">
	div(class="main")
		h2(class="display-1") Concept Type Details
		br
		ErrorIndicator(v-if="error") Error while concept type details!
		div(v-else)
			Loading(v-if="loading")
			template(v-else)
				v-card(tile outlined class="pa-4 mb-4")
					h3(class="headline") {{ type.label }}
					div(class="body-1") {{ type.uri }}
					br
					div(class="body-2") {{ type.description }}

				v-card(tile outlined class="pb-4")
					v-card-title Examples
					template(v-if="!type.examples.length")
						EmptyView(class="ma-4") No examples found!
					v-list(v-else two-line class="ma-4")
						template(v-for="(example, index) in type.examples")
							v-list-item-content(:key="example.id")
								v-list-item-title(class="font-weight-medium" v-text="example.label")
								v-list-item-subtitle(v-text="example.description")
							v-divider(v-if="index + 1 < type.examples.length" :key="index")
</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import { Component, Vue } from 'vue-property-decorator';

import EmptyView from '@/components/global/EmptyView.vue';
import ErrorIndicator from '@/components/global/ErrorIndicator.vue';
import Loading from '@/components/global/Loading.vue';
import { ConceptType } from '@/interfaces/ConceptTypes';

@Component({
	name: 'ConceptTypeDetails',
	components: {
		EmptyView,
		ErrorIndicator,
		Loading,
	},
})
export default class ConceptTypeDetails extends Vue {
	private loading: boolean = true;
	private error: boolean = false;
	private type: ConceptType = { id: 0 };

	public created() {
		Vue.$axios.get(`/type/${this.$route.params.id}`)
			.then((response: AxiosResponse) => {
				this.type = response.data;
			})
			.catch(() => this.error = true)
			.finally(() => this.loading = false);
	}
}
</script>

<style scoped>

</style>