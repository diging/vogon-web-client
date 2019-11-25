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
	full_name?: string;
	email?: string;
	affiliation?: string;
	location?: string;
	link?: string;
	is_admin?: boolean;
	imagefile?: string;
	annotation_count?: number;
	relation_count?: number;
	text_count?: number;
}

export interface TokenDto {
	token_type: string;
	exp: number;
	jti: string;
	user_id: number;
	github_token: boolean;
}
