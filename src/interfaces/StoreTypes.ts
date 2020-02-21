import { Concept, ConceptType } from '@/interfaces/ConceptTypes';
import { RelationTemplate } from '@/interfaces/RelationTypes';
import { TextDocument } from '@/interfaces/RepositoryTypes';

export interface RootState {
	loggedIn: boolean;
	showSideBar: boolean;
	showLists: boolean;
	show_concepts: boolean;
	concept_label: string;
	template: any;
	appellations_to_submit: any;
	text_appellation: any;
	deselect_all: boolean;
	select_all: boolean;
	assignment_failed: boolean;
	validator: number;
	text_content_styles: any;
	templateCreator: { open_concepts: any[] };
	annotator: {
		currentTab: string;
		template: RelationTemplate | null;
		text: TextDocument | null;
		highlightedText: {
			position: { startOffset: number, endOffset: number },
			visible: boolean,
			interpretation: { label: string },
			representation: string,
		} | null;
		selectedFieldAnnotations: any[]; // ToDo: Define type
		conceptTypes: ConceptType[];
		currentFieldIndex: number;
		currentFieldType: string | null;
		appellations: any[]; // ToDo: Define type
		meta: {
			project: number,
			occursIn: number,
		};
		relationCreated: boolean,
		selectedConcept: Concept | null,
		searchingConcept: boolean,
		createdAppellation: boolean,
		createNewConcept: boolean,
	};
}
