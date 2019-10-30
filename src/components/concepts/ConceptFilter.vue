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
				v-select(v-model="filter.typed" label="Type" :items="types" outlined dense)
			v-col(md="6")
				v-btn(depressed color="primary" @click="onApply") Apply
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { ConceptFilterParams } from '@/interfaces/ConceptTypes';

@Component({ name: 'ConceptFilter' })
export default class ConceptFilter extends Vue {
	@Prop() private filter!: ConceptFilterParams;
	@Prop() private onApply!: () => void;

	private states = ['(Any)', 'Pending', 'Rejected', 'Approved', 'Resolved', 'Merged'];
	private types = [1, 2, 3]; // ToDo: Get types from backend
}
</script>