import { Concept, ConceptType } from './ConceptTypes';
import { Text } from './ProjectTypes';

export interface RelationTemplateField {
	id?: number;
	part_field?: string;
	concept_label?: string;
	part_id: number;
	evidence_required?: boolean;
	description?: string;
	type?: string;
	concept_id?: number;
	label?: string;
}

export interface RelationTemplateFieldRaw {
	id: number;
	internal_id: number;
	source_node_type: string;
	source_label: string;
	source_relationtemplate_internal_id: number;
	source_prompt_text: boolean;
	source_description: string;
	source_type: ConceptType | null;
	source_concept: Concept | null;
	predicate_node_type: string;
	predicate_label: string;
	predicate_prompt_text: boolean;
	predicate_description: string;
	predicate_type: ConceptType | null;
	predicate_concept: Concept | null;
	object_node_type: string;
	object_label: string;
	object_relationtemplate_internal_id: number;
	object_prompt_text: boolean;
	object_description: string;
	object_type: ConceptType | null;
	object_concept: Concept | null;
}

export interface RelationTemplate {
	id: number;
	created: string;
	name?: string;
	description?: string;
	expression?: string;
	terminal_nodes?: string;
	template_parts?: RelationTemplateFieldRaw[];
}

export interface DateAppellation {
	id: number;
	created: string;
	year?: number;
	month?: number;
	day?: number;
	stringRep?: string;
	dateRepresentation?: string;
}

export interface RelationSet {
	id: number;
	created: string;
	label?: string;
	template?: RelationTemplate;
	representation?: string;
	submitted?: boolean;
	submittedOn?: string;
	occursIn?: Text;
	occurs_in_text?: string;
	pending?: boolean;
	ready?: boolean;
	concepts?: Concept[];
	date_appellations_with_predicate: {
		interpretation: Concept;
		appellation: DateAppellation;
	};
}

export interface RelationFilterParams {
	createdBy?: string;
	occursIn?: string;
	terminal_nodes?: string;
	created_after?: string;
	created_before?: string;
	project?: number;
	meta?: boolean;
	offset?: number;
	limit?: number;
	fields?: [RelationTemplateField];
}

export interface RelationTemplateFormNodeType {
	type: {
		key: string;
		label: string;
	};
	concept: ConceptType | null;
	label: string;
	description?: string;
	prompt: boolean;
	relation_id?: number;
	specific_concept: Concept | null;
}

export interface RelationTemplateFormType {
	id?: number;
	internal_id?: number;
	source: RelationTemplateFormNodeType;
	predicate: RelationTemplateFormNodeType;
	object: RelationTemplateFormNodeType;
	fields: [RelationTemplateField];
}
