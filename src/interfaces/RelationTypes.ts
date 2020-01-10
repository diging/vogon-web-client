export interface RelationTemplateField {
	part_field?: string;
	concept_label?: string;
	part_id: number;
	evidence_required?: boolean;
	description?: string;
	type?: string;
	concept_id?: number;
	label?: string;
}

export interface RelationTemplate {
	id: number;
	created: string;
	name?: string;
	description?: string;
	expression?: string;
	fields: [RelationTemplateField];
}
