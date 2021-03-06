export interface CitesphereRepository {
	id: number;
	name: string;
	description?: string;
	repo_type: string;
	groups?: CitesphereGroup[];
}

export interface CitesphereGroup {
  id: number;
	name: string;
	description: string;
	url: string;
	uri: string;
  size: number;
  public: boolean;
}

export interface CitesphereGroupInfo {
	group: CitesphereGroupMeta;
	collections: CitesphereCollection[];
	items: CitesphereItem[];
}

export interface CitesphereGroupMeta {
	id: number;
	name: string;
	description: string;
	type: string;
	created: string;
	lastModified: string;
	numItems: number;
}

export interface CitesphereCollection {
	key: string;
	name: string;
	numberOfItems: number;
	numberOfCollections: number;
	children: CitesphereCollection[];
}

export interface CitesphereItem {
	key: string;
	title: string;
	itemType: string;
	dateAdded: string;
	authors: CitesphereItemAuthor[];
	editors: CitesphereItemAuthor[];
}

export interface CitesphereItemAuthor {
	firstName: string;
	lastName: string;
}
