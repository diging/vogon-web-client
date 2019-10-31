<template lang="pug">
	div(class="container")
		h4(class="subtitle-1") Filters
		v-row
			v-col(md="6")
				v-text-field(v-model="filter.authority" label="Authority" outlined dense )
			v-col(md="6")
				v-text-field(v-model="filter.pos" label="Part of Speech (PoS)" outlined dense)
			v-col(md="6")
				v-select(v-model="filter.concept_state" label="State" :items="states" outlined dense)
			v-col(md="6")
				v-select(v-model="filter.typed" label="Type" :items="types" outlined dense item-text="uri" item-value="id")
			v-col(md="6")
				v-btn(depressed color="primary" @click="onApply") Apply
</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import { Component, Prop, Vue } from 'vue-property-decorator';

import { CONCEPT_STATES } from '@/constants';
import { ConceptFilterParams, ConceptType } from '@/interfaces/ConceptTypes';

@Component({ name: 'ConceptFilter' })
export default class ConceptFilter extends Vue {
	@Prop() private filter!: ConceptFilterParams;
	@Prop() private onApply!: () => void;

	private error: boolean = false;
	private loading: boolean = true;

	private types: ConceptType[] = [];

	private states = Object.values(CONCEPT_STATES);

	public async mounted(): Promise<void> {
		Vue.$axios.get(`/type`)
			.then((response: AxiosResponse) => {
				const allType: ConceptType = { id: 0, uri: '(Any)' };
				this.types = [allType, ...response.data.results];
			})
			.catch(() => this.error = true)
			.finally(() => this.loading = false);
	}
}
</script>