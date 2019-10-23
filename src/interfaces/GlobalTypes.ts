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

export interface Text {
	id: number;
	title: string;
	added: string;
	repository_id: number;
	repository_source_id: number;
}

export interface Project {
	id?: number;
	name: string;
	description?: string;
	created?: string;
	quadriga_id?: string;
	ownedBy?: User;
	texts?: Text[] | number[];
	num_texts?: number;
	num_relations?: number;
}
