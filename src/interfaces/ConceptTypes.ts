export interface Concept {
	id: number;
	url: string;
	uri: string;
	label?: string;
	description?: string;
	authority?: string;
	typed?: ConceptType;
	pos?: string;
	resolved?: boolean;
	typed_label?: string;
	concept_state?: string;
	appellation_set?: [number];
}

export interface ConceptType {
	id: number;
	authority?: string;
	description?: string;
	label?: string;
	uri?: string;
	url?: string;
}

export interface ConceptFilterParams {
	authority?: string;
	pos?: string;
	concept_state?: string;
	typed?: number;
	strict?: boolean;
}
