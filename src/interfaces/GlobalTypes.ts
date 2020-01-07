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

export interface TokenDto {
	token_type: string;
	exp: number;
	jti: string;
	user_id: number;
	github_token: boolean;
}
