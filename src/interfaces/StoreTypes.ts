import { RelationTemplate } from '@/interfaces/RelationTypes';

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
	annotator: {
		currentTab: string;
		template: RelationTemplate | null;
	};
}
