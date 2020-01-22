<template lang="pug">
	div
		v-select(
			class="template-input mt-4"
			v-model="node.type"
			:items="choices"
			label="Select a node type"
			item-text="label"
			item-value="key"
			return-object
			outlined
			dense
		)

		v-select(
			v-if="node.type === TEMPLATE_RELATION_TYPES.OPEN_CONCEPT"
			v-model="node.concept"
			class="template-input mb-4"
			:items="$store.getters.templateOpenConcepts"
			label="Select concept"
			item-text="label"
			item-value="id"
			return-object
			outlined
			dense
		)

		v-text-field(
			v-if="node.type === TEMPLATE_RELATION_TYPES.RELATION"
			v-model="node.relation_id"
			type="number"
			class="template-input mb-4"
			label="Relation Id"
			placeholder="The ID of a relation in this template."
			outlined
			dense
		)

		template(v-if="node.type === TEMPLATE_RELATION_TYPES.SPECIFIC_CONCEPT")
			v-banner(elevation="1" class="template-input selected-concept")
				v-icon(slot="icon" size="24") mdi-book-outline
				template(v-if="node.specific_concept")
					v-list-item
						v-list-item-content
							v-list-item-title
								strong {{ node.specific_concept.label }}
							p {{ node.specific_concept.description }}
						v-list-item-action
							v-btn(icon @click="node.specific_concept = null")
								v-icon mdi-close
				div(v-else) [Select a concept from below ...]
					
			br
			v-autocomplete(
				v-model="selectedConcept"
				class="template-input mb-4"
				label="Concept"
				placeholder="Search for concepts..."
				hide-no-data
				return-object
				outlined
				dense
				clearable
				item-text="label"
				item-value="alt_id"
				:loading="conceptsLoading"
				:search-input.sync="searchValue"
				:items="concepts"
			)
				template(v-slot:append-outer)
					v-btn(icon text color="primary" @click="search")
						v-icon mdi-database-search
				template(v-slot:item="{ item }")
					v-list-item-content(class="text-left")
						v-list-item-title {{ item.label }}
						v-list-item-subtitle {{ item.description }}
						
		v-text-field(
			v-if="node.type"
			class="template-input mt-8"
			v-model="node.label"
			label="Label*"
			required
			outlined
			dense
		)
		v-textarea(
			v-if="node.type"
			v-model="node.description"
			class="template-input my-0"
			label="Description"
			placeholder="Any additional explanatory information, to be displayed to the user."
			outlined
			dense
		)

		v-checkbox(
			v-if="node.type"
			v-model="node.prompt"
			class="template-input my-0"
			label="Prompt for evidence"
		)
</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

import { TEMPLATE_RELATION_TYPES } from '@/constants';
import { Concept } from '@/interfaces/ConceptTypes';
import { RelationTemplateFormNodeType } from '@/interfaces/RelationTypes';

@Component({
	name: 'TemplateNodePicker',
})
export default class TemplateNodePicker extends Vue {
	@Prop() private node: RelationTemplateFormNodeType = {
		type: { key: '', label: '' }, concept: null, label: '', description: '',
		prompt: false, relation_id: -1, specific_concept: null,
	};
	@Prop() private choices: any;

	private TEMPLATE_RELATION_TYPES = TEMPLATE_RELATION_TYPES;

	private conceptsLoading: boolean = false;
	private conceptsError: boolean = false;
	private searchValue: string = '';
	private concepts: Concept[] = [];
	private selectedConcept: any = null;

	@Watch('selectedConcept')
	private onConceptSelect(concept: Concept) {
		if (concept) {
			this.node.specific_concept = concept;
		}
	}

	@Watch('node.type')
	private onNodeTypeChange(val: any, oldVal: any) {
		if (oldVal && oldVal.key !== val.key) {
			// Clear previously selected values
			if (oldVal.key === TEMPLATE_RELATION_TYPES.OPEN_CONCEPT.key) {
				this.node.concept = null;
			} else if (oldVal.key === TEMPLATE_RELATION_TYPES.SPECIFIC_CONCEPT.key) {
				this.node.specific_concept = null;
			} else if (oldVal.key === TEMPLATE_RELATION_TYPES.RELATION.key) {
				this.node.relation_id = -1;
			}
		}
	}

	private search() {
		if (!this.searchValue) {
			return;
		}
		this.conceptsLoading = true;
		Vue.$axios.get(`/concept/search?q=${this.searchValue}`)
			.then((response: AxiosResponse) => {
				this.concepts = response.data.results;
			})
			.catch(() => this.conceptsError = true)
			.finally(() => this.conceptsLoading = false);
	}
}
</script>

<style>
.template-input {
	width: 100%;
	max-width: 500px;
}
.selected-concept .v-banner__wrapper {
	padding-top: 0;
	padding-bottom: 0;
}
</style>