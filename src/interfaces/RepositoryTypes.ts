import { User } from '@/interfaces/GlobalTypes';

export interface Repository {
	id: number;
	name: string;
	description?: string;
	configuration?: string;
	repo_type: string;
	collections?: TextCollectionResult;
}

export interface TextCollectionResult {
	count: number;
	previous?: string;
	next?: string;
	results: TextCollection[];
}

export interface TextCollection {
	id: number;
	name: string;
	description?: string;
	raw?: string;
	url?: string;
	uri?: string;
	size?: number;
	resources?: TextResource[];
}

export interface TextResource {
	id: number;
	title: string;
	content_types?: string[];
	url?: string;
	uri?: string;
	public?: boolean;
	raw?: string;
	aggregate_content?: TextAggregatedContent[];
	parts?: number[];
	content?: TextContentResource[];
}

export interface TextDocument {
	id: number;
	title: string;
	uri?: string;
	document_type?: string;
	document_location?: string;
	tokenizedContent?: string;
	created?: string;
	added?: string;
	repository_source_id?: number;
	content_type?: string;
	public?: boolean;
	part_of?: TextDocument;
	addedBy?: User;
	source?: Repository;
	repository?: Repository;
	annotators?: [User];
}

export interface TextAggregatedContent {
	raw?: string;
	content_type?: string;
	resources?: TextContentResource[];
}

export interface TextContentResource {
	id: number;
	raw?: string;
	name: string;
	location?: number;
	content_type?: string;
	source?: string;
	content_for?: number;
}
