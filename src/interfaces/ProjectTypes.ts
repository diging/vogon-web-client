import { PaginatedFilter, User } from '@/interfaces/GlobalTypes';

export interface Text {
	id: number;
	title: string;
	added: string;
	repository_id: number;
	repository_source_id: number;
	uri?: string;
}

export interface Project {
	id?: number;
	name: string;
	description?: string;
	created?: string;
	quadriga_id?: string;
	ownedBy?: User;
	createdBy?: User;
	texts?: Text[] | number[];
	num_texts?: number;
	num_relations?: number;
	participants: number[];
}

export interface ProjectFilterParams extends PaginatedFilter {
	ownedBy__username?: string;
}
