import { ConceptType } from '@/interfaces/ConceptTypes';

export interface RootState {
	loggedIn: boolean;
	templateCreator: {
		open_concepts: ConceptType[];
	};
}
