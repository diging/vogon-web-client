<template lang="pug">
	v-card
		v-form(ref="form" v-model="valid")
			v-text-field(
				v-model="name"
				label="Name*"
				placeholder="What is this relation called?"
				required
				outlined
			)

			v-textarea(
				v-model="description"
				label="Description"
				placeholder="Please describe this relation."
				rows="2"
				outlined
			)

			v-textarea(
				v-model="expression"
				label="Expression"
				placeholder="Enter an expression pattern for this relation. See hint below."
				rows="3"
				outlined
			)
			span(class="body-2") 
				| This should be a full-sentence structure that expresses the content of the
				| relation. Indicate the position of nodes (concepts) in the template using
				| node identifiers, e.g. {0s} for the subject of this first relation part, {1o}
				| for the object of the second part, or {2p} for the predicate of the third part.

			v-text-field(
				model="terminalNodes"
				label="Terminal Nodes"
				placeholder="Enter comma-separated node identifiers. E.g. ``0s,1o``"
				class="mt-8"
				outlined
			)

			v-simple-table(class="part-table mt-6")
				template(v-slot:default)
					thead
						tr
							th(class="text-left") Relation ID
							th(class="text-left") Source
							th(class="text-left") Predicate
							th(class="text-left") Object
					tbody
						tr(v-for="part in templateParts" :key="part.relation_id")
							td
								v-chip(class="ma-2") {{ part.relation_id }}
							td
								v-select(
									class="template-input mt-4"
									v-model="part.source.type"
									:items="nodeChoices"
									label="Select a node type"
									item-text="label"
									item-value="key"
									return-object
									outlined
									dense
								)

								v-select(
									v-if="part.source.type === TEMPLATE_RELATION_TYPES.OPEN_CONCEPT"
									v-model="part.source.concept"
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
									v-if="part.source.type === TEMPLATE_RELATION_TYPES.RELATION"
									v-model="part.source.relation_id"
									type="number"
									class="template-input mb-4"
									label="Relation Id"
									placeholder="The ID of a relation in this template."
									outlined
									dense
								)

								v-autocomplete(
									v-if="part.source.type === TEMPLATE_RELATION_TYPES.SPECIFIC_CONCEPT"
									v-model="part.source.specific_concept"
									class="template-input mb-4"
									label="Concepts"
									placeholder="Search for concepts..."
									prepend-icon="mdi-database-search"
									hide-no-data
									hide-selected
									return-object
									outlined
									dense
									:loading="conceptsLoading"
									:search-input.sync="conceptsSearch"
									:items="conceptItems"
								)

								v-text-field(
									v-if="part.source.type"
									class="template-input mt-8"
									v-model="part.source.label"
									label="Label*"
									required
									outlined
									dense
								)
								v-textarea(
									v-if="part.source.type"
									v-model="part.source.description"
									class="template-input my-0"
									label="Description"
									placeholder="Any additional explanatory information, to be displayed to the user."
									outlined
									dense
								)

								v-checkbox(
									v-if="part.source.type"
									v-model="part.source.prompt"
									class="template-input my-0"
									label="Prompt for evidence"
								)
								
							td
								v-select(
									class="template-input my-4"
									:items="predChoices"
									label="Select a node type"
									item-text="label"
									item-value="key"
									return-object
									outlined
									dense
								)
							td
								v-select(
									class="template-input my-4"
									:items="nodeChoices"
									label="Select a node type"
									item-text="label"
									item-value="key"
									return-object
									outlined
									dense
								)
</template>

<script lang="ts">
import { Component, PropSync, Vue, Watch } from 'vue-property-decorator';

import { TEMPLATE_RELATION_TYPES } from '@/constants';
import { Concept } from '@/interfaces/ConceptTypes';

@Component({
	name: 'TemplateCreateForm',
})
export default class TemplateCreateForm extends Vue {
	private valid: boolean = false;
	private name: string = '';
	private description: string = '';
	private expression: string = '';
	private terminalNodes: string = '';
	private templateParts: any = [
		{
			relation_id: 0,
			source: {
				type: '', concept: null, label: '', description: '',
				prompt: false, relation_id: null, specific_concept: null,
			},
			predicate: '',
			object: '',
		},
	];
	private TEMPLATE_RELATION_TYPES = TEMPLATE_RELATION_TYPES;
	private nodeChoices =  [
		TEMPLATE_RELATION_TYPES.OPEN_CONCEPT,
		TEMPLATE_RELATION_TYPES.SPECIFIC_CONCEPT,
		TEMPLATE_RELATION_TYPES.DATE_APPELLATION,
		TEMPLATE_RELATION_TYPES.RELATION,
	];
	private predChoices = [
		TEMPLATE_RELATION_TYPES.OPEN_CONCEPT,
		TEMPLATE_RELATION_TYPES.SPECIFIC_CONCEPT,
		TEMPLATE_RELATION_TYPES.TO_BE,
		TEMPLATE_RELATION_TYPES.HAS,
	];

	private conceptsLoading: boolean = false;
	private conceptsSearch: string = '';
	private concepts: Concept[] = [];

	@PropSync('concepts', { type: Object })

	get conceptItems() {
		return this.concepts.map((concept: Concept) => ({
					label: concept.label,
					id: concept.alt_id,
				}));
	}
}
</script>

<style scoped>
.part-table th:nth-child(1) {
	width: 120px;
}
.template-input {
	width: 100%;
	max-width: 500px;
}
</style>