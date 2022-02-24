<template lang="pug">
	v-card(outlined)
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
				| node identifiers, e.g. 
				code {0s}
				| for the subject of this first relation part, 
				code {1o}
				| for the object of the second part, or 
				code {2p}
				| for the predicate of the third part.

			v-textarea(
				v-model="mappingExpression"
				label="Default Mapping"
				placeholder="Enter the default mapping pattern for this relation. See hint below."
				rows="3"
				outlined
			)

			v-text-field(
				v-model="terminalNodes"
				label="Terminal Nodes"
				placeholder="Enter comma-separated node identifiers. E.g. ``0s,1o``"
				class="mt-8"
				outlined
			)

			div(class="part-table-container")
				v-simple-table(class="part-table mt-6")
					template(v-slot:default)
						thead
							tr
								th(class="text-left") Relation ID
								th(class="text-left") Source
								th(class="text-left") Predicate
								th(class="text-left") Object
								th(class="text-left") Actions
						tbody
							tr(v-for="(part, i) in templateParts" :key="part.internal_id")
								td
									v-chip(class="ma-2") {{ part.internal_id }}
								td
									TemplateNodePicker(
										:node.sync="part.source"
										:choices="nodeChoices"
									)
								td
									TemplateNodePicker(
										:node.sync="part.predicate"
										:choices="predChoices"
									)
								td
									TemplateNodePicker(
										:node.sync="part.object"
										:choices="nodeChoices"
									)
								td
									v-btn(fab small outlined color="error" @click="clearRow(i)")
										v-icon mdi-close

			div(class="text-center my-3")
				v-btn(@click="addRow()" outlined dense)
					v-icon(left) mdi-plus
					| Add relation

		v-btn(
			v-if="edit"
			color="primary"
			large
			class="mt-4"
			@click="save()" 
			:disabled="!name || creating"
			:loading="creating"
		) Update
		
		v-btn(
			v-else
			color="primary"
			large
			class="mt-4"
			@click="save()" 
			:disabled="!name || creating"
			:loading="creating"
		) Create

		div(v-if="errorMsg !== ''" class="mt-4 error-container")
			v-alert(v-model="error" type="error" dense dismissible) {{ errorMsg }}
</template>

<script lang="ts">
import { AxiosError, AxiosResponse } from 'axios';
import _ from 'lodash';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

import TemplateNodePicker from '@/components/templates/TemplateNodePicker.vue';
import { TEMPLATE_RELATION_TYPES, TEMPLATE_RELATION_TYPES_KEYS } from '@/constants';
import { Concept } from '@/interfaces/ConceptTypes';
import { RelationTemplate, RelationTemplateFieldRaw, RelationTemplateFormType } from '@/interfaces/RelationTypes';

@Component({
	name: 'TemplateCreateForm',
	components: {
		TemplateNodePicker,
	},
})
export default class TemplateCreateForm extends Vue {
	@Prop() private template!: RelationTemplate;

	private valid: boolean = false;
	private errorMsg: string = '';
	private error: boolean = false;
	private creating: boolean = false;

	// Template fields
	private id: number = -1;
	private name: string = '';
	private description: string = '';
	private expression: string = '';
	private terminalNodes: string = '';
	private mappingExpression: string = '';
	private staticUri: string = '';
	private defaultValues: RelationTemplateFormType = {
		source: {
			type: { key: '', label: '' }, concept: null, label: '', description: '',
			prompt: false, relation_id: -1, specific_concept: null,
		},
		predicate: {
			type: { key: '', label: '' }, concept: null, label: '', description: '',
			prompt: false, relation_id: -1, specific_concept: null,
		},
		object: {
			type: { key: '', label: '' }, concept: null, label: '', description: '',
			prompt: false, relation_id: -1, specific_concept: null,
		},
	};
	private templateParts: RelationTemplateFormType[] = [
		{
			internal_id: 0,
			..._.cloneDeep(this.defaultValues),
		},
	];
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

	get edit() {
		return !!this.$route.params.id;
	}

	public async created() {
		if (this.edit) {
			this.initializeFields();
		}
	}

	private initializeFields() {
		this.id = this.template.id;
		this.name = this.template.name;
		this.description = this.template.description;
		this.expression = this.template.expression;
		this.terminalNodes = this.template.terminal_nodes;
		this.mappingExpression = this.template.default_mappings;

		if (this.template.template_parts) {
			this.templateParts = this.template.template_parts.map((part: RelationTemplateFieldRaw) => ({
				id: part.id,
				internal_id: part.internal_id,
				source: {
					type: TEMPLATE_RELATION_TYPES_KEYS[part.source_node_type],
					concept: part.source_type,
					label: part.source_label,
					description: part.source_description,
					prompt: part.source_prompt_text,
					relation_id: part.source_relationtemplate_internal_id,
					specific_concept: part.source_concept,
				},
				predicate: {
					type: TEMPLATE_RELATION_TYPES_KEYS[part.predicate_node_type],
					concept: part.predicate_type,
					label: part.predicate_label,
					description: part.predicate_description,
					prompt: part.predicate_prompt_text,
					specific_concept: part.predicate_concept,
				},
				object: {
					type: TEMPLATE_RELATION_TYPES_KEYS[part.object_node_type],
					concept: part.object_type,
					label: part.object_label,
					description: part.object_description,
					prompt: part.object_prompt_text,
					relation_id: part.object_relationtemplate_internal_id,
					specific_concept: part.object_concept,
				},
			}));
		}
	}

	private clearRow(pos: number): void {
		this.templateParts.splice(pos, 1);
	}

	private addRow(): void {
		this.templateParts.push({
			internal_id: this.templateParts.length,
			..._.cloneDeep(this.defaultValues),
		});
	}

	private save(): void {
		const parts = this.templateParts.map((part: RelationTemplateFormType) => ({
			id: part.id,
			internal_id: part.internal_id,
			source_node_type: part.source.type.key,
			source_label: part.source.label,
			source_description: part.source.description,
			source_prompt_text: part.source.prompt,
			source_type: part.source.concept && part.source.concept.id,
			source_concept: part.source.specific_concept,
			source_relationtemplate_internal_id: part.source.relation_id,
			predicate_node_type: part.predicate.type.key,
			predicate_label: part.predicate.label,
			predicate_description: part.predicate.description,
			predicate_prompt_text: part.predicate.prompt,
			predicate_type: part.predicate.concept && part.predicate.concept.id,
			predicate_concept: part.predicate.specific_concept,
			object_node_type: part.object.type.key,
			object_label: part.object.label,
			object_description: part.object.description,
			object_prompt_text: part.object.prompt,
			object_type: part.object.concept && part.object.concept.id,
			object_concept: part.object.specific_concept,
			object_relationtemplate_internal_id: part.object.relation_id,
		}));
		const payload: any = {
			name: this.name,
			description: this.description,
			expression: this.expression,
			default_mappings: this.mappingExpression,
			terminal_nodes: this.terminalNodes,
			parts,
		};
		console.log("payload", payload);
		if (this.id !== -1) {
			payload.id = this.id;
		}
		this.creating = true;
		let request: Promise<AxiosResponse>;

		if (this.edit && this.id) {
			request = Vue.$axios.put(`/relationtemplate/${this.id}`, payload);
		} else {
			request = Vue.$axios.post('/relationtemplate', payload);
		}

		request
			.then((response: AxiosResponse) => {
				if (response.data.success) {
					console.log("this.edit", this.edit);
					if (this.edit) {
						location.reload();
					} else {
						this.$router.push(`/relationtemplate/${response.data.template_id}/edit`);
					}
				}
			})
			.catch((error: AxiosError) => {
				if (error.response && error.response.data && error.response.data.error) {
					this.errorMsg = `Error while creating template: ${error.response.data.error}`;
				} else {
					this.errorMsg = `Error while creating template: ${error.message}`;
				}
				this.error = true;
			})
			.finally(() => this.creating = false);
	}
}
</script>

<style>
.part-table-container {
	border: 1px solid rgba(0,0,0,.12);
}
.part-table th:nth-child(1) {
	width: 120px;
}
.part-table td {
	vertical-align: top;
}

.part-table td:last-child {
	vertical-align: middle;
}
.error-container {
	width: 100%;
	max-width: 700px;
}
</style>