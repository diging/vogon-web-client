<template lang="pug">
	div(class="main")
		h2(class="display-1") Concepts
		br
		ErrorIndicator(v-if="error") Error while loading concepts!
		div(v-else)
			Loading(v-if="loading")
			div(v-else)
				v-data-table(:headers="conceptHeaders" :items="concepts" class="elevation-1")
					template(v-slot:top)
						div(class="container")
							h4(class="subtitle-1") Filters
							v-row
								v-col(md="6")
									v-text-field(v-model="filters.authority" label="Authority" outlined dense )
								v-col(md="6")
									v-text-field(v-model="filters.pos" label="Part of Speech (PoS)" outlined dense)
								v-col(md="6")
									v-select(v-model="filters.concept_state" label="State" :items="states" outlined dense)
								v-col(md="6")
									v-select(v-model="filters.typed" label="Type" :items="types" outlined dense)
								v-col(md="6")
									v-btn(depressed color="primary" @click="getConcepts") Apply

					template(v-slot:item.concept_detail="{ item }")
						div(class="concept-title-container")
							a(v-bind:href="`/concept/${item.id}`" class="concept-link")
								span(class="subtitle-1 font-weight-medium") {{ item.label }}
							v-chip(color="blue-grey darken-1" dark small class="concept-appellation-count")
								| 123
						div(class="body-2") {{ item.description }}
						br

					template(v-slot:item.uri="{ item }")
						div
							strong
								span(class="lime--text text--darken-4") {{ item.authority }}: 
							a(v-bind:href="item.uri" class=" concept-uri blue--text text--darken-1") {{ item.uri }}

					template(v-slot:item.concept_state="{ item }")
						v-chip(:color="getConceptStateTheme(item.concept_state).color" dark)
							| {{ item.concept_state }}
							v-icon(right color="white" small) {{getConceptStateTheme(item.concept_state).icon}}

					template(v-slot:item.actions="{ item }")
						v-btn(v-if="item.concept_state === 'Pending'" depressed small color="success") Approve
						template(v-else-if="item.concept_state === 'Approved'")
							v-btn(v-if="item.typed" depressed small color="success") Add
							v-btn(v-else depressed small color="primary") Set Type
</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import { Component, Vue } from 'vue-property-decorator';

import EmptyView from '@/components/global/EmptyView.vue';
import ErrorIndicator from '@/components/global/ErrorIndicator.vue';
import Loading from '@/components/global/Loading.vue';
import { Concept } from '@/interfaces/ConceptTypes';
import { getConceptStateTheme } from '@/utils';

interface ConceptFilter {
	authority?: string;
	pos?: string;
	concept_state?: string;
	typed?: number;
	strict?: boolean;
}

@Component({
	name: 'ConceptList',
	components: {
		Loading,
		ErrorIndicator,
		EmptyView,
	},
})
export default class ConceptList extends Vue {
	private loading: boolean = true;
	private error: boolean = false;
	private concepts: Concept[] = [];

	private conceptHeaders = [
		{text: 'Concept', value: 'concept_detail', width: '50%'},
		{text: 'URI', value: 'uri'},
		{text: 'State', value: 'concept_state'},
		{text: 'Actions', value: 'actions'},
	];
	private states = ['(Any)', 'Pending', 'Rejected', 'Approved', 'Resolved', 'Merged'];
	private types = [1, 2, 3]; // ToDo: Get types from backend
	private filters: ConceptFilter = {
		authority: '',
		pos: '',
		concept_state: '',
		typed: 0,
		strict: true,
	};
	private getConceptStateTheme = getConceptStateTheme;

	public async mounted(): Promise<void> {
		this.getConcepts();
	}

	private getFilter(): ConceptFilter {
		// Build filter parameters
		const params: ConceptFilter = {};
		params.authority = this.filters.authority;
		params.pos = this.filters.pos;
		if (this.filters.concept_state !== '(Any)' && this.filters.concept_state) {
			params.concept_state = this.filters.concept_state;
		}
		if (this.filters.typed) {
			params.typed = this.filters.typed;
		}
		params.strict = true;

		return params;
	}

	private async getConcepts(): Promise<void> {
		const params: ConceptFilter = this.getFilter();
		Vue.$axios.get(`/concept`, { params })
			.then((response: AxiosResponse) => {
				this.concepts = response.data.results;
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
</style>