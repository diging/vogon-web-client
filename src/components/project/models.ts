import { User } from '@/models';

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