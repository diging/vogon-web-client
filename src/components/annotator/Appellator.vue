<template lang="pug">
	v-container
		v-row
			div(v-bind:class="{'col-sm-6': true}" id="shadow-swimlane"style="padding: 3px;")
				text-display(
					v-bind:appellations=appellations
					v-bind:dateappellations=dateappellations
					v-on:selectappellation="selectAppellation"
					v-on:selectdateappellation="selectDateAppellation"
					v-on:selecttext="selectText")
			div(v-bind:class=`{
					'col-sm-offset-6': true,
					'col-sm-6': true,
					'action-column': true,
					'affix': true,
					'container-fluid': true
				}`
				v-bind:style=`{
					top: swimmerTop,
					left: swimmerLeft,
				}`
				id="sticky-swimlane")
				v-row
					div(v-bind:class=`{
								'col-xs-10': !sidebarIsShown(),
								'col-xs-7': sidebarIsShown(),
							}`
							style="padding-right: 5px;")
						relation-template-selector(v-if="template == null && creatingRelation"v-on:selectedtemplate="selectedTemplate")
						relation-creator(
							v-if="template != null && creatingRelation"
							v-on:fieldislisteningfortext="fieldIsListeningForText"
							v-on:fieldisdonelisteningfortext="fieldIsDoneListeningForText"
							v-on:createdrelation="createdRelation"
							v-on:cancelrelation="cancelRelation"
							v-bind:user="user"
							v-bind:text="text"
							v-bind:template="template"
							v-bind:project="project")
						div(class="appellation-type-selector text-right" v-if="textIsSelected()")
							a(v-bind:class=`{
									btn: true,
									'btn-sm': true,
									'btn-success': !createDateAppellation,
									'btn-default': createDateAppellation
								}`
								v-tooltip="'Concept'"
								v-on:click="toggleDateAppellation")
								span(class="glyphicon glyphicon-grain")
							a(v-bind:class=`{
									btn: true,
									'btn-sm': true,
									'btn-success': createDateAppellation,
									'btn-default': !createDateAppellation
								}`
								v-tooltip="'Date'"
								v-on:click="toggleDateAppellation")
								span(class="glyphicon glyphicon-calendar")
						date-appellation-creator(
							v-if="textIsSelected() && createDateAppellation"
							v-bind:user=user
							v-bind:text=text
							v-bind:project=project
							v-bind:position="selectedText"
							v-on:createddateappellation="createdDateAppellation"
							v-on:cancelappellation="cancelAppellation"
							v-on:createdappellation="createdAppellation")
						appellation-creator(
							v-if="textIsSelected() && !createDateAppellation"
							v-bind:user="user"
							v-bind:text="text"
							v-bind:project="project"
							v-bind:position="selectedText"
							v-on:cancelappellation="cancelAppellation"
							v-on:createdappellation="createdAppellation"
							v-bind:appellations="appellations")
					div(v-bind:class="{'col-xs-2': !sidebarIsShown(), 'col-xs-5': sidebarIsShown()}" style="padding-right: 15px;")
						a(v-if="sidebarIsShown()" class="btn" v-on:click="hideSidebar"  style="padding: 2px;")
							span(class="glyphicon glyphicon-chevron-right")
						a(v-else class="btn" v-on:click="showSidebar" style="padding: 2px;")
							span(class="glyphicon glyphicon-chevron-left")
						div(v-if="sidebarIsShown()" style="padding: 0px;")
							div(class="clearfix sidebar-buttons")
								div
									a(v-if="submitAppellationClicked == false" v-tooltip="'Submit All Appellations'"
											v-bind:class="{btn: true, 'btn-primary':'btn-primary'}"
											v-on:click="showSubmitAllAppellationsSidebar")
										span(class="glyphicon glyphicon-cloud-upload")
									a(v-if="submitAppellationClicked" v-tooltip="'Submit All Appellations'"
											v-bind:class="{btn: true, 'btn-primary':'btn-primary'}"
											v-on:click="showSubmitAllAppellationsSidebar(); createRelationsFromText();")
										span Submit
									h6(v-if="massAssignmentFailed" style="color: red;") Assignment Failed!
									div(class="pull-right btn-group")
										a(id="appellation-submit"v-tooltip="'Appellations'"
											v-bind:class=`{
													btn: true,
													'btn-success': sidebar == 'appellations',
													'btn-default': sidebar != 'appellations'
												}`
											v-on:click="showAppellationsSidebar")
											span(class="glyphicon glyphicon-tag")
										a(v-tooltip="'Date Appellations'"
											v-bind:class=`{
													btn: true,
													'btn-success': sidebar == 'dateappellations',
													'btn-default': sidebar != 'dateappellations'
												}`
											v-on:click="showDateAppellationsSidebar")
											span(class="glyphicon glyphicon-calendar")
										a(v-tooltip="'Relations'"
											v-bind:class=`{
													btn: true,
													'btn-success': sidebar == 'relations',
													'btn-default': sidebar != 'relations'
												}`
											v-on:click="showRelationsSidebar")
											span(class="glyphicon glyphicon-th-list")

							relation-list(v-if="sidebar == 'relations'" v-bind:relations=relations v-on:selectrelation="selectRelation")
							appellation-list(
								v-if="sidebar == 'submitAllAppellations'"
								v-bind:appellations=appellations
								v-bind:sidebar="sidebar"
								v-on:hideallappellations="hideAllAppellations"
								v-on:showallappellations="showAllAppellations"
								v-on:showappellation="showAppellation"
								v-on:hideappellation="hideAppellation"
								v-on:selectappellation="selectAppellation"
								v-on:selectConcept="selectConcept($event)"
								v-on:currentAppellations="setCurrentAppellations($event)")
							appellation-list(
								v-if="sidebar == 'appellations'"
								v-bind:appellations=appellations
								v-on:hideallappellations="hideAllAppellations"
								v-on:showallappellations="showAllAppellations"
								v-on:showappellation="showAppellation"
								v-on:hideappellation="hideAppellation"
								v-on:selectappellation="selectAppellation")
							appellation-list(
								v-if="sidebar == 'dateappellations'"
								v-bind:appellations=dateappellations
								v-on:hideallappellations="hideAllDateAppellations"
								v-on:showallappellations="showAllDateAppellations"
								v-on:showappellation="showDateAppellation"
								v-on:hideappellation="hideDateAppellation"
								v-on:selectappellation="selectDateAppellation")
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

import { getOffsetTop } from '@/utils/annotations';
import AppellationCreator from './AppellationCreator.vue';
import AppellationList from './AppellationList.vue';
import DateAppellationCreator from './DateAppellationCreator.vue';
import RelationCreator from './RelationCreator.vue';
import RelationList from './RelationList.vue';
import RelationTemplateSelector from './RelationTemplateSelector.vue';
import TextDisplay from './TextDisplay.vue';

@Component({
  name: 'Appellator',
  components: {
	'appellation-list': AppellationList,
	'relation-list': RelationList,
	'text-display': TextDisplay,
	'appellation-creator': AppellationCreator,
	'relation-creator': RelationCreator,
	'relation-template-selector': RelationTemplateSelector,
	'date-appellation-creator': DateAppellationCreator,
  },
})
export default class Appellator extends Vue {
  private appellations: any[] = [];
  private dateappellations: any[] = [];
  private relations: any[] = [];
  private selected: any | null = null;
  private selectedText: any | null = null;

  // ToDo: Fix `user`, `text` and `project` values
  private user: any = { id: '', username: '' };
  private text: any = { id: '', title: '' };
  private project: any = { id: '', name: '' };
  private sidebarShown: boolean = false;
  private template: any = {};
  private creatingRelation: boolean = true;
  private textListener: any;
  private sidebar: string = 'relations';
  private createDateAppellation: boolean = false;
  private swimmerPosition: string = 'static';
  private swimmerTop: number = 0;
  private swimmerRef: number = 0;
  private swimmerLeft: number = -2;
  private swimmerWidth: number = 0;
  private submitAppellationClicked: boolean = false;
  private massAssignmentFailed: boolean = false;
  private selectedRelation: any;
  private selectedConcept: any;
  // ToDo: Fix the types
  private start: string = '';
  private end: string = '';
  private occur: string = '';
  private ready: boolean = false;
  private error: boolean = false;

  public mounted() {
	this.updateAppellations();
	this.updateRelations();
	this.$store.commit('setAppellations', this.appellations);
	this.updateDateAppellations();
	this.updateSwimRef();
	this.handleScroll();
	// needs to be called in mounted.
	this.watchStoreForConcepts();
	this.watchStoreForAssignmentFailed();
  }

  public created() {
	window.addEventListener('scroll', this.handleScroll);
	window.addEventListener('resize', this.handleScroll);
	const graphContainer = document.getElementById('graphContainer');
	if (graphContainer) {
		graphContainer.onmouseup = () => {
		this.updateSwimRef();
		this.handleScroll();
		};
	}
  }

  public destroyed() {
	window.removeEventListener('scroll', this.handleScroll);
	window.removeEventListener('resize', this.handleScroll);
  }

  get fields() {
	return this.template.fields;
  }

  @Watch('sidebar')
  public watchSidebar() {
	// remove submit button if sidebar is not showing submitAllAppellations
	if (!(this.sidebar === 'submitAllAppellations')) {
		this.submitAppellationClicked = false;
	}
  }

  @Watch('appellations')
  public watchAppellations() {
	this.filterTextAppellationFromAppellationList();
  }

  /*************************************************
   * Start Methods to create relationships to text *
   *************************************************/
  public watchStoreForConcepts() {
	this.$store.watch(
		(state) => {
		return this.$store.getters.showConcepts;
		},
		(val) => {
		if (val) {
			// FIXME: This should set selected text to the actual text id
			this.selectedText = this.text.title;
			this.textListener = null;
		} else {
			this.unselectText();
		}
		},
		{
		deep: true,
		},
	);
  }

  public watchStoreForAssignmentFailed() {
	this.$store.watch(
		(state) => {
		return this.$store.getters.getAssignmentFailed;
		},
		(val) => {
		if (val === true) {
			this.massAssignmentFailed = true;
		}
		},
	);
  }
  public registerData(field: any, data: any) {
	// ToDo: Fix this function
	// this.field_data[this.fieldHash(field)] = data;
	// this.ready = this.readyToCreate();
  }

  public filterTextAppellationFromAppellationList() {
	let i = this.appellations.length - 1;
	/*
     * Remove appellations that have the string represenation that matches the text title
     * this assumes the appellation is that of the text and we remove it as to not make a
     * relation to itself. You must iterate backwards when removing items from an array to
     * prevent indexing errors.
     */
	while (i >= 0) {
		try {
		if (this.appellations[i].stringRep === this.text.title) {
			this.$store.commit('setTextAppellation', this.appellations[i]);
			this.$store.commit(
			'conceptLabel',
			this.appellations[i].interpretation_label,
			);
			this.appellations.splice(i, 1);
			this.$store.commit('removeAppellation', i);
		}
		} catch (error) {
		// TODO: Handle error
		}
		i--;
	}
  }
  public validateCreateRelationsToTextData() {
	if (this.$store.getters.getTemplate === null) {
		return 1;
	} else if (this.$store.getters.getTextAppellation.length === 0) {
		return 2;
	} else if (this.$store.getters.getAppellationsToSubmit.length === 0) {
		return 3;
	} else {
		return 0;
	}
  }

  public createRelationsFromText() {
	const validator = this.validateCreateRelationsToTextData();
	if (validator > 0) {
		this.$store.commit('setValidator', validator);
		return;
	}
	this.filterTextAppellationFromAppellationList();

	// TODO: Implement and fix the axios call
	this.$axios
		.post(`/relationtemplate/${this.$store.getters.getTemplate.id}`, {
		appellations: this.$store.getters.getAppellationsToSubmit,
		textAppellation: this.$store.getters.getTextAppellation,
		start: this.start,
		end: this.end,
		occur: this.occur,
		part_id: this.$store.getters.getTemplate.template_parts[0].id,
		occursIn: this.text.id,
		createdBy: this.user.id,
		project: this.project.id,
		})
		.then((response: any) => {
		this.ready = false;
		this.sidebarShown = false;
		this.sidebar = 'relations';
		this.$store.commit('resetCreateAppelltionsToText');
		})
		.catch((error: any) => {
		this.error = true;
		this.ready = false;
		this.$store.commit('massAppellationAssignmentFailed');
		}); // TODO: implement callback and exception handling!!
  }

  // TODO: Change function to SubmitAllAppellations
  public showSubmitAllAppellationsSidebar() {
	this.sidebar = 'submitAllAppellations';
	this.submitAppellationClicked = true;
  }

  /***********************************************
   * End Methods to create relationships to text *
   ***********************************************/
  public getSwimmerWidth() {
	const shadowElem = document.getElementById('shadow-swimlane');
	if (shadowElem === null) {
		return 0;
	} else {
		return shadowElem.clientWidth + 2;
	}
  }

  public handleScroll() {
	const shadowElem = document.getElementById('shadow-swimlane');
	const swimmer = document.getElementById('sticky-swimlane');
	const scrolled = this.swimmerRef - window.scrollY;
	if (shadowElem) {
		this.swimmerWidth = shadowElem.clientWidth + 2;
		if (scrolled < 0) {
		this.swimmerTop = 0;
		} else {
		this.swimmerTop = this.swimmerRef - window.scrollY;
		}
	}
  }

  public updateSwimRef() {
	const shadowElem = document.getElementById('shadow-swimlane');
	if (shadowElem) {
		this.swimmerRef = getOffsetTop(shadowElem);
	}
  }

  public toggleDateAppellation() {
	this.createDateAppellation = !this.createDateAppellation;
  }

  public fieldIsListeningForText() {
	this.textListener = true;
  }

  public fieldIsDoneListeningForText() {
	this.textListener = null;
  }

  public selectedTemplate(template: any) {
	this.template = template;
  }

  public createdRelation(relation: any) {
	this.template = null;
	this.updateRelations();
	this.updateAppellations();
  }

  public cancelRelation() {
	this.template = null;
  }

  public sidebarIsShown() {
	return this.sidebarShown;
  }

  public showSidebar() {
	this.sidebarShown = true;
  }

  public hideSidebar() {
	this.sidebarShown = false;
  }

  public selectConcept(concept: any) {
	this.selectedConcept = concept;
  }

  public hideAllAppellations() {
	this.appellations.forEach((a) => {
		a.visible = false;
	});
  }

  public showAllAppellations() {
	this.appellations.forEach((a) => {
		a.visible = true;
	});
  }

  public showAppellation(appellation: any) {
	this.appellations.forEach((a) => {
		if (a.id === appellation.id) {
		a.visible = true;
		}
	});
  }

  public hideAppellation(appellation: any) {
	this.appellations.forEach((a) => {
		if (a.id === appellation.id) {
		a.visible = false;
		}
	});
  }

  public hideAllDateAppellations() {
	this.dateappellations.forEach((a) => {
		a.visible = false;
	});
  }

  public showAllDateAppellations() {
	this.dateappellations.forEach((a) => {
		a.visible = true;
	});
  }

  public showDateAppellation(appellation: any) {
	this.dateappellations.forEach((a) => {
		if (a.id === appellation.id) {
		a.visible = true;
		}
	});
  }

  public hideDateAppellation(appellation: any) {
	this.dateappellations.forEach((a) => {
		if (a.id === appellation.id) {
		a.visible = false;
		}
	});
  }

  public scrollToAppellation(appellation: any) {
	// ToDo: Fix this
	// window.scrollTo(0, getTextPosition(appellation.position).top);
  }

  public selectAppellation(appellation: any) {
	this.appellations.forEach((a) => {
		a.selected = a.id === appellation.id;
	});
	this.$store.commit('selectedappellation', appellation);
	this.$store.commit('cleartextselection');
	this.unselectText();
	this.unselectDateAppellation();
	this.scrollToAppellation(appellation);
  }

  public selectDateAppellation(appellation: any) {
	this.dateappellations.forEach((a) => {
		a.selected = a.id === appellation.id;
	});
	// TODO: Remove emits
	this.$store.commit('selecteddateappellation', appellation);
	this.$store.commit('cleartextselection');
	this.unselectText();
	this.unselectAppellation();
	this.scrollToAppellation(appellation);
  }

  public selectAppellationsById(appellationIds: any) {
	this.appellations.forEach((appellation) => {
		appellation.selected = appellationIds.indexOf(appellation.id) > -1;
	});
  }

  public unselectAppellation() {
	this.appellations.forEach((a) => {
		a.selected = false;
	});
  }

  public unselectDateAppellation() {
	this.dateappellations.forEach((a) => {
		a.selected = false;
	});
  }

  public selectText(position: any) {
	this.unselectAppellation();
	if (!this.textListener) {
		this.selectedText = position;
	}
	// TODO:Remove emit
	this.$store.commit('selectedtext', position);
  }

  public unselectText() {
	this.selectedText = null;
  }

  public textIsSelected() {
	return this.selectedText != null && this.textListener === null;
  }

  public cancelAppellation() {
	this.selectedText = null;
  }

  public createdAppellation(appellation: any) {
	const offsets = appellation.position.position_value.split(',');
	appellation.position.startOffset = offsets[0];
	appellation.position.endOffset = offsets[1];
	appellation.visible = true;
	appellation.selected = false;
	this.appellations.push(appellation);
	this.selectAppellation(appellation);
	this.selectedText = null;
	this.updateAppellations(); // call update appellations when a new appelation is created to update list
  }

  public createdDateAppellation(appellation: any) {
	const offsets = appellation.position.position_value.split(',');
	appellation.position.startOffset = offsets[0];
	appellation.position.endOffset = offsets[1];
	appellation.visible = true;
	appellation.selected = false;
	this.dateappellations.push(appellation);
	this.selectDateAppellation(appellation);
	this.selectedText = null;
  }

  public updateAppellations(callback: any = null) {
	// "CO" is the "character offset" DocumentPosition type. For image
	//  annotation this should be changed to "BB".
	// ToDo: Implement and fix axios call
	this.$axios
		.get('/appellations', {
		params: {
			position_type: 'CO',
			text: this.text.id,
			limit: 500,
			project: this.project.id,
		},
		})
		.then((response: any) => {
		// DocumentPosition.position_value is represented with a
		//  TextField, so serialized as a string. Start and end offsets
		//  should be comma-delimited.

		this.appellations = response.body.results.map((appellation: any) => {
			const offsets = appellation.position.position_value.split(',');
			appellation.position.startOffset = offsets[0];
			appellation.position.endOffset = offsets[1];
			appellation.visible = true;
			appellation.selected = false;
			return appellation;
		});
		if (callback) {
			callback(response);
		}
		});
  }

  public updateDateAppellations(callback: any = null) {
	// "CO" is the "character offset" DocumentPosition type. For image
	//  annotation this should be changed to "BB".
	// ToDo: Implement and fix axios call
	this.$axios
		.get('/appellations', {
		params: {
			position_type: 'CO',
			text: this.text.id,
			limit: 500,
			project: this.project.id,
		},
		})
		.then((response: any) => {
		// DocumentPosition.position_value is represented with a
		//  TextField, so serialized as a string. Start and end offsets
		//  should be comma-delimited.
		this.dateappellations = response.body.results.map(
			(appellation: any) => {
			const offsets = appellation.position.position_value.split(',');
			appellation.position.startOffset = offsets[0];
			appellation.position.endOffset = offsets[1];
			appellation.visible = true;
			appellation.selected = false;
			return appellation;
			},
		);
		if (callback) {
			callback(response);
		}
		});
  }

  public selectRelation(relation: any) {
	this.selectedRelation = relation;
	this.selected = null;
	this.relations.forEach((r: any) => {
		r.selected = r.id === relation.id;
	});
	const appellationIds = relation.appellations.map((appellation: any) => {
		return appellation.id;
	});
	this.appellations.forEach((appellation: any) => {
		appellation.selected = appellationIds.indexOf(appellation.id) > -1;
	});
	const dateAppellationIds = relation.date_appellations.map(
		(appellation: any) => {
		return appellation.id;
		},
	);
	this.dateappellations.forEach((appellation: any) => {
		appellation.selected = dateAppellationIds.indexOf(appellation.id) > -1;
	});
  }

  private updateRelations(callback: any = null) {
	// ToDo: Implement/Fix the axios call
	this.$axios
		.get('/relation', {
		params: {
			text: this.text.id,
			limit: 500,
			project: this.project.id,
		},
		})
		.then((response: any) => {
		this.relations = response.body.results;
		if (callback) {
			callback(response);
		}
		})
		.catch(() => {
		// TODO: handle errors
		});
  }

  private showRelationsSidebar() {
	this.sidebar = 'relations';
  }

  private showAppellationsSidebar() {
	this.sidebar = 'appellations';
  }

  private showDateAppellationsSidebar() {
	this.sidebar = 'dateappellations';
  }
}
</script>
