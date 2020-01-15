import { Concept } from './ConceptTypes';
import { Text } from './ProjectTypes';

export interface RelationTemplate {
	id: number;
	created: string;
	name?: string;
	description?: string;
	expression?: string;
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
}
