import Vue from 'vue';

export type VForm = Vue & { validate: () => boolean; };

export interface PaginatedResult<T> {
	count: number;
	next?: number;
	previous?: number;
	results: T[];
}

export interface User {
	id: number;
	username: string;
}

export interface Repository {
	id: number;
	name: string;
	description?: string;
	configuration?: string;
	collections?: TextCollection[];
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
