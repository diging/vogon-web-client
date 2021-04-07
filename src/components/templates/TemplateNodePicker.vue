<template lang="pug">
	div
		v-select(
			class="template-input mt-4"
			v-model="nodeType"
			:items="choices"
			label="Select a node type"
			item-text="label"
			item-value="key"
			return-object
			outlined
			dense
		)

		v-select(
			v-if="nodeType === TEMPLATE_RELATION_TYPES.OPEN_CONCEPT"
			v-model="nodeConcept"
			class="template-input mb-4"
			:items="$store.getters.templateOpenConcepts"
			label="Select Concept Type"
			item-text="label"
			item-value="id"
			return-object
			outlined
			dense
		)

		v-text-field(
			v-if="nodeType === TEMPLATE_RELATION_TYPES.RELATION"
			v-model="nodeRelationId"
			type="number"
			class="template-input mb-4"
			label="Relation Id"
			placeholder="The ID of a relation in this template."
			outlined
			dense
		)

		template(v-if="nodeType === TEMPLATE_RELATION_TYPES.SPECIFIC_CONCEPT")
			div(class="mb-4") Search and select specific concept here:

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

			v-banner(elevation="1" class="template-input selected-concept")
				v-icon(slot="icon" size="24") mdi-book-outline
				template(v-if="nodeSpecificConcept")
					v-list-item
						v-list-item-content
							v-list-item-title
								strong {{ nodeSpecificConcept.label }}
							p {{ nodeSpecificConcept.description }}
						v-list-item-action
							v-btn(icon @click="nodeSpecificConcept = null")
								v-icon mdi-close
				div(v-else) Selected conept from above...

		v-text-field(
			v-if="nodeType"
			class="template-input mt-8"
			v-model="nodeLabel"
			:label="labelRequired ? `Label*`: `Label`"
			:required="labelRequired"
			outlined
			dense
		)

		v-textarea(
			v-if="nodeType"
			v-model="nodeDescription"
			class="template-input my-0"
			label="Description"
			placeholder="Any additional explanatory information, to be displayed to the user."
			outlined
			dense
		)

		v-checkbox(
			v-if="nodeType"
			v-model="nodePrompt"
			class="template-input my-0"
			label="Prompt for evidence"
		)
</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import _ from 'lodash';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

import { TEMPLATE_RELATION_TYPES } from '@/constants';
import { Concept, ConceptType } from '@/interfaces/ConceptTypes';
import { RelationTemplateFormNodeType } from '@/interfaces/RelationTypes';

@Component({
	name: 'TemplateNodePicker',
})
export default class TemplateNodePicker extends Vue {
	@Prop() private node!: RelationTemplateFormNodeType;
	@Prop() private choices: any;

	private TEMPLATE_RELATION_TYPES = TEMPLATE_RELATION_TYPES;

	// Field values
	private nodeType: any = { key: '', label: '' };
	private nodeConcept: ConceptType | null = null;
	private nodeRelationId: number = -1;
	private nodeSpecificConcept: Concept | null = null;
	private nodeLabel: string = '';
	private nodeDescription: string = '';
	private nodePrompt: boolean = false;

	// Specific concept selection
	private selectedConcept: any = null;
	private conceptsLoading: boolean = false;
	private searchValue: string = '';
	private concepts: Concept[] = [];
	private conceptsError: boolean = false;

	get labelRequired(): boolean {
		return (
			this.nodeType === TEMPLATE_RELATION_TYPES.OPEN_CONCEPT ||
			this.nodePrompt
		);
	}

	public async created() {
		this.initializeFields();
	}

	private initializeFields() {
		if (this.node) {
			this.nodeType = this.node.type;
			this.nodeConcept = this.node.concept;
			this.nodeSpecificConcept = this.node.specific_concept;
			this.nodeDescription = this.node.description;
			this.nodeLabel = this.node.label;
			if (this.node.relation_id) {
				this.nodeRelationId = this.node.relation_id;
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

	@Watch('nodeType')
	private onNodeTypeChange(val: any, oldVal: any) {
		if (oldVal && oldVal.key !== val.key) {
			const newNode = _.cloneDeep(this.node);
			newNode.type = val;

			// Clear previously selected values
			if (oldVal.key === TEMPLATE_RELATION_TYPES.OPEN_CONCEPT.key) {
				newNode.concept = null;
			} else if (oldVal.key === TEMPLATE_RELATION_TYPES.SPECIFIC_CONCEPT.key) {
				newNode.specific_concept = null;
			} else if (oldVal.key === TEMPLATE_RELATION_TYPES.RELATION.key) {
				newNode.relation_id = -1;
			}

			this.$emit('update:node', newNode);
		}
	}

	@Watch('nodeConcept')
	private onNodeConceptChange(val: any) {
		this.$emit('update:node', { ...this.node, concept: val });
	}

	@Watch('nodeRelationId')
	private onNodeRelationIdChange(val: number) {
		this.$emit('update:node', { ...this.node, relation_id: val });
	}

	@Watch('nodeSpecificConcept')
	private onNodeSpecificConceptChange(val: any) {
		this.$emit('update:node', { ...this.node, specific_concept: val });
	}

	@Watch('selectedConcept')
	private onConceptSelect(concept: Concept) {
		if (concept) {
			this.nodeSpecificConcept = concept;
		}
	}

	@Watch('nodeLabel')
	private onNodeLabelChange(val: string) {
		this.$emit('update:node', { ...this.node, label: val });
	}

	@Watch('nodeDescription')
	private onNodeDescriptionChange(val: string)  {
		this.$emit('update:node', { ...this.node, description: val });
	}

	@Watch('nodePrompt')
	private onNodePromptChange(val: boolean)  {
		this.$emit('update:node', { ...this.node, prompt: val });
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

.selected-concept {
	border-radius: 4px !important;
}
</style>