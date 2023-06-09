import { User } from './GlobalTypes';
import { Project, Text } from './ProjectTypes';
import { RelationSet } from './RelationTypes';

export interface UserDashboard {
	user?: User;
	projects?: Project[];
	projects_contributed?: Project[];
	recent_texts?: Text[];
	added_texts?: Text[];
	appellation_count?: number;
	relation_count?: number;
	relations?: RelationSet[];
}
