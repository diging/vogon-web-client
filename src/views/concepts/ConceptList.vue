<template lang="pug">
	div(class="main")
		h2(class="display-1") Concepts
		br
		v-data-table(
			:headers="conceptHeaders" :items="concepts" :loading="loading" class="elevation-1"
			:server-items-length="conceptsCount" hide-default-footer
		)
			template(v-slot:top)
				ConceptFilter(:filter="filters" :onApply="getConcepts")

			template(v-slot:loading)
				br
				div Loading concepts ...
				br

			template(v-slot:no-data)
				ErrorIndicator(v-if="error") Error while loading concepts!
				EmptyView(v-else) No concepts found!

			template(v-slot:item.concept_detail="{ item }")
				div(class="concept-title-container")
					a(v-bind:href="`/concept/${item.id}`" class="concept-link")
						span(class="subtitle-1 font-weight-medium") {{ item.label }}
					v-chip(color="blue-grey darken-1" dark small class="concept-appellation-count")
						| {{ item.appellation_set.length }}
				div(class="body-2") {{ item.description }}
				br

			template(v-slot:item.uri="{ item }")
				div
					strong
						span(class="lime--text text--darken-4") {{ item.authority }}: 
					a(v-bind:href="item.uri" class="concept-uri blue--text text--darken-1") {{ item.uri }}

			template(v-slot:item.concept_state="{ item }")
				v-chip(:color="getConceptStateTheme(item.concept_state).color" dark)
					| {{ item.concept_state }}
					v-icon(right color="white" small) {{getConceptStateTheme(item.concept_state).icon}}

			template(v-slot:item.actions="{ item }")
				v-btn(v-if="item.concept_state === CONCEPT_STATES.PENDING" depressed small color="success") Approve
				template(v-else-if="item.concept_state === CONCEPT_STATES.APPROVED")
					v-btn(v-if="item.typed" depressed small color="success") Add
					v-btn(v-else depressed small color="primary") Set Type

			template(v-slot:footer)
				hr
				div(class="pagination-container")
					v-pagination(v-model="page" :length="Math.floor(conceptsCount / PAGE_SIZE) + 1" :total-visible="7" v-on:input="getConcepts")
</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import { Component, Vue } from 'vue-property-decorator';

import ConceptFilter from '@/components/concepts/ConceptFilter.vue';
import EmptyView from '@/components/global/EmptyView.vue';
import ErrorIndicator from '@/components/global/ErrorIndicator.vue';
import { CONCEPT_STATES, PAGE_SIZE } from '@/constants';
import { Concept, ConceptFilterParams } from '@/interfaces/ConceptTypes';
import { getConceptStateTheme } from '@/utils';

@Component({
	name: 'ConceptList',
	components: {
		ErrorIndicator,
		EmptyView,
		ConceptFilter,
	},
})
export default class ConceptList extends Vue {
	private loading: boolean = true;
	private error: boolean = false;
	private concepts: Concept[] = [];
	private conceptsCount: number = 0;
	private page: number = 1;
	private PAGE_SIZE: number = PAGE_SIZE;

	private conceptHeaders = [
		{text: 'Concept', value: 'concept_detail', width: '50%'},
		{text: 'URI', value: 'uri'},
		{text: 'State', value: 'concept_state'},
		{text: 'Actions', value: 'actions'},
	];
	private filters: ConceptFilterParams = {
		authority: '',
		pos: '',
		concept_state: '',
		strict: true,
		limit: PAGE_SIZE,
		offset: 0,
	};
	private getConceptStateTheme = getConceptStateTheme;
	private CONCEPT_STATES = CONCEPT_STATES;

	public async mounted(): Promise<void> {
		this.getConcepts();
	}

	private getFilter(): ConceptFilterParams {
		// Build filter parameters
		const params: ConceptFilterParams = {};
		params.authority = this.filters.authority;
		params.pos = this.filters.pos;
		if (this.filters.concept_state !== CONCEPT_STATES.ANY && this.filters.concept_state) {
			params.concept_state = this.filters.concept_state;
		}
		if (this.filters.typed) {
			params.typed = this.filters.typed;
		}
		params.strict = true;
		params.offset = (this.page - 1) * PAGE_SIZE;

		return params;
	}

	private async getConcepts(): Promise<void> {
		const params: ConceptFilterParams = this.getFilter();
		Vue.$axios.get(`/concept`, { params })
			.then((response: AxiosResponse) => {
				this.concepts = response.data.results;
				this.conceptsCount = response.data.count;
			})
			.catch(() => this.error = true)
			.finally(() => this.loading = false);
	}
}
</script>

<style scoped>
.concept-title-container {
	display: flex;
}
.concept-link:link, .concept-link:visited {
	text-decoration: none;
	margin-right: 8px;
	align-self: center;
	line-height: 3;
}
.concept-appellation-count {
	align-self: center;
}
.concept-uri:link, .concept-uri:visited {
	text-decoration: none;
}
.concept-uri:hover, .concept-uri:active {
	color: #0D47A1 !important;
}
.pagination-container {
	padding: 10px;
	box-sizing: border-box;
}
</style>