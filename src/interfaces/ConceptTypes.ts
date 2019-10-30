export interface Concept {
	id: number;
	url: string;
	uri: string;
	label?: string;
	description?: string;
	authority?: string;
	typed?: number;
	pos?: string;
	resolved?: boolean;
	typed_label?: string;
	concept_state?: string;
}
