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
						relation-template-selector(v-if="template == null && creating_relation"v-on:selectedtemplate="selectedTemplate")
						relation-creator(
							v-if="template != null && creating_relation"
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
									'btn-success': !create_date_appellation,
									'btn-default': create_date_appellation
								}`
								v-tooltip="'Concept'"
								v-on:click="toggleDateAppellation")
								span(class="glyphicon glyphicon-grain")
							a(v-bind:class=`{
									btn: true,
									'btn-sm': true,
									'btn-success': create_date_appellation,
									'btn-default': !create_date_appellation
								}`
								v-tooltip="'Date'"
								v-on:click="toggleDateAppellation")
								span(class="glyphicon glyphicon-calendar")
						date-appellation-creator(
							v-if="textIsSelected() && create_date_appellation"
							v-bind:user=user
							v-bind:text=text
							v-bind:project=project
							v-bind:position=selected_text
							v-on:createddateappellation="createdDateAppellation"
							v-on:cancelappellation="cancelAppellation"
							v-on:createdappellation="createdAppellation")
						appellation-creator(
							v-if="textIsSelected() && !create_date_appellation"
							v-bind:user="user"
							v-bind:text="text"
							v-bind:project="project"
							v-bind:position="selected_text"
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
import { VForm } from '@/interfaces/GlobalTypes';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
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

	private appellations: object[] = [];
	private dateappellations: object[] = [];
	private relations: object[] = [];
	private selected: object | null = null;
	private selected_text: object | null = null;
	private user: object = {
		id: USER_ID,
		username: USER_NAME,
	};
	private text: object = {
		id: TEXT_ID,
		title: TEXT_TITLE,
	};
	private project: object = {
		id: PROJECT_ID,
		name: PROJECT_NAME,
	};
	private sidebarShown: boolean = false;
	private template: object | null = null;
	private creating_relation: boolean = true;
	private text_listener: object | null = null;
	private sidebar: string = 'relations';
	private create_date_appellation: boolean = false;
	private swimmerPosition: string = 'static';
	private swimmerTop: number = 0;
	private swimmerRef: number = 0;
	private swimmerLeft: number = -2;
	private swimmerWidth: number = 0;
	private submitAppellationClicked: boolean = false;
	private massAssignmentFailed: boolean = false;

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
		document.getElementById('graphContainer').onmouseup = function() {
			this.updateSwimRef();
			this.handleScroll();
		};
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
		if (!(this.sidebar == 'submitAllAppellations')) {
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
					this.selected_text = this.text.title;
					this.text_listener == null;
				} else {
					this.unselectText();
				}
			}, {
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
				if (val == true) {
					this.massAssignmentFailed = true;
				}
			},
		);
	}
	public registerData(field, data) {
		this.field_data[this.fieldHash(field)] = data;
		this.ready = this.readyToCreate();
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
				if (this.appellations[i].stringRep == this.text.title) {
					this.$store.commit('setTextAppellation', this.appellations[i]);
					this.$store.commit('conceptLabel', this.appellations[i].interpretation_label);
					this.appellations.splice(i, 1);
					this.$store.commit('removeAppellation', i);
				}
			} catch (error) {
				console.log(error);
			}
			i--;
		}
	}
	public validateCreateRelationsToTextData() {
		if (this.$store.getters.getTemplate == null) {
			return 1;
		} else if (this.$store.getters.getTextAppellation.length == 0) {
			return 2;
		} else if (this.$store.getters.getAppellationsToSubmit.length == 0) {
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
		RelationTemplateResource.text({
			id: this.$store.getters.getTemplate.id,
		}, {
			appellations: this.$store.getters.getAppellationsToSubmit,
			textAppellation: this.$store.getters.getTextAppellation,
			start: this.start,
			end: this.end,
			occur: this.occur,
			part_id: this.$store.getters.getTemplate.template_parts[0].id,
			occursIn: this.text.id,
			createdBy: this.user.id,
			project: this.project.id,
		}).then(function(response) {
			this.ready = false;
			this.sidebarShown = false;
			this.sidebar = 'relations';
			this.$store.commit('resetCreateAppelltionsToText');
		}).catch(function(error) {
			console.log('RelationTemplateResource:: failed miserably', error);
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
		const shadow_elem = document.getElementById('shadow-swimlane');
		if (shadow_elem == null) {
			return 0;
		} else {
			return shadow_elem.clientWidth + 2;
		}
	}
	public handleScroll() {
		const shadow_elem = document.getElementById('shadow-swimlane');
		const swimmer = document.getElementById('sticky-swimlane');
		const scrolled = this.swimmerRef - window.scrollY;
		this.swimmerWidth = shadow_elem.clientWidth + 2;
		if (scrolled < 0) {
			this.swimmerTop = 0;
		} else {
			this.swimmerTop = this.swimmerRef - window.scrollY;
		}
	}
	public updateSwimRef() {
		const shadow_elem = document.getElementById('shadow-swimlane');
		this.swimmerRef = getOffsetTop(shadow_elem);
	}
	public toggleDateAppellation() {
		this.create_date_appellation = !this.create_date_appellation;
	}
	public fieldIsListeningForText() {
		this.text_listener = true;
	}
	public fieldIsDoneListeningForText() {
		this.text_listener = null;
	}
	public selectedTemplate(template) {
		this.template = template;
	}
	public createdRelation(relation) {
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
	public selectConcept(concept) {
		this.selected_concept = concept;
	}
	public hideAllAppellations() {
		this.appellations.forEach(function(a) {
			a.visible = false;
		});
	}
	public showAllAppellations() {
		this.appellations.forEach(function(a) {
			a.visible = true;
		});
	}
	public showAppellation(appellation) {
		this.appellations.forEach(function(a) {
			if (a.id == appellation.id) { a.visible = true; }
		});
	}
	public hideAppellation(appellation) {
		this.appellations.forEach(function(a) {
			if (a.id == appellation.id) { a.visible = false; }
		});
	}
	public hideAllDateAppellations() {
		this.dateappellations.forEach(function(a) {
			a.visible = false;
		});
	}
	public showAllDateAppellations() {
		this.dateappellations.forEach(function(a) {
			a.visible = true;
		});
	}
	public showDateAppellation(appellation) {
		this.dateappellations.forEach(function(a) {
			if (a.id == appellation.id) { a.visible = true; }
		});
	}
	public hideDateAppellation(appellation) {
		this.dateappellations.forEach(function(a) {
			if (a.id == appellation.id) { a.visible = false; }
		});
	}
	public scrollToAppellation(appellation) {
		window.scrollTo(0, getTextPosition(appellation.position).top);
	}
	public selectAppellation(appellation) {
		this.appellations.forEach(function(a) {
			a.selected = (a.id == appellation.id);
		});
		// TODO: Remove both emit and bus
		AppellationBus.$emit('selectedappellation', appellation);
		EventBus.$emit('cleartextselection');
		this.unselectText();
		this.unselectDateAppellation();
		this.scrollToAppellation(appellation);
	}
	public selectDateAppellation(appellation) {
		this.dateappellations.forEach(function(a) {
			a.selected = (a.id == appellation.id);
		});
		// TODO: Remove emits
		AppellationBus.$emit('selecteddateappellation', appellation);
		EventBus.$emit('cleartextselection');
		this.unselectText();
		this.unselectAppellation();
		this.scrollToAppellation(appellation);
	}
	public selectAppellationsById(appellation_ids) {
		this.appellations.forEach(function(appellation) {
			appellation.selected = (appellation_ids.indexOf(appellation.id) > -1);
		});
	}
	public unselectAppellation() {
		this.appellations.forEach(function(a) {
			a.selected = false;
		});
	}
	public unselectDateAppellation() {
		this.dateappellations.forEach(function(a) {
			a.selected = false;
		});
	}
	public selectText(position) {
		this.unselectAppellation();
		if (!this.text_listener) {
			this.selected_text = position;
		}
		// TODO:Remove emit
		TextBus.$emit('selectedtext', position);
	}
	public unselectText() {
		this.selected_text = null;
	}
	public textIsSelected() {
		return this.selected_text != null && this.text_listener == null;
	}
	public cancelAppellation() {
		this.selected_text = null;
	}
	public createdAppellation(appellation) {
		const offsets = appellation.position.position_value.split(',');
		appellation.position.startOffset = offsets[0];
		appellation.position.endOffset = offsets[1];
		appellation.visible = true;
		appellation.selected = false;
		this.appellations.push(appellation);
		this.selectAppellation(appellation);
		this.selected_text = null;
		this.updateAppellations(); // call update appellations when a new appelation is created to update list
	}
	public createdDateAppellation(appellation) {
		const offsets = appellation.position.position_value.split(',');
		appellation.position.startOffset = offsets[0];
		appellation.position.endOffset = offsets[1];
		appellation.visible = true;
		appellation.selected = false;
		this.dateappellations.push(appellation);
		this.selectDateAppellation(appellation);
		this.selected_text = null;
	}
	public updateAppellations(callback) {
		// "CO" is the "character offset" DocumentPosition type. For image
		//  annotation this should be changed to "BB".
		Appellation.query({
			position_type: 'CO',
			text: this.text.id,
			limit: 500,
			project: this.project.id,
		}).then(function(response => {
			// DocumentPosition.position_value is represented with a
			//  TextField, so serialized as a string. Start and end offsets
			//  should be comma-delimited.

			this.appellations = response.body.results.map(function(appellation) {
				const offsets = appellation.position.position_value.split(',');
				appellation.position.startOffset = offsets[0];
				appellation.position.endOffset = offsets[1];
				appellation.visible = true;
				appellation.selected = false;
				return appellation;

			});
		if (callback) { callback(response); }
		)})
	}
updateDateAppellations(callback); {
		// "CO" is the "character offset" DocumentPosition type. For image
		//  annotation this should be changed to "BB".
		DateAppellation.query({
			position_type: 'CO',
			text: this.text.id,
			limit: 500,
			project: this.project.id,
		}).then(function(response => {
			// DocumentPosition.position_value is represented with a
			//  TextField, so serialized as a string. Start and end offsets
			//  should be comma-delimited.
			this.dateappellations = response.body.results.map(function(appellation) {
				const offsets = appellation.position.position_value.split(',');
				appellation.position.startOffset = offsets[0];
				appellation.position.endOffset = offsets[1];
				appellation.visible = true;
				appellation.selected = false;
				return appellation;
			});
		if (callback) { callback(response); }
		)})
	}
selectRelation(relation); {
		this.selected_relation = relation;
		this.selected = null;
		this.relations.forEach(function(r) {
			r.selected = (r.id == relation.id);
		});
		const appellation_ids = relation.appellations.map(function(appellation) {
			return appellation.id;
		});
		this.appellations.forEach(function(appellation) {
			appellation.selected = (appellation_ids.indexOf(appellation.id) > -1);
		});
		const dateappellation_ids = relation.date_appellations.map(function(appellation) {
			return appellation.id;
		});
		this.dateappellations.forEach(function(appellation) {
			appellation.selected = (dateappellation_ids.indexOf(appellation.id) > -1);
		});
	},
updateRelations(callback); {
		Relation.query({
			text: this.text.id,
			limit: 500,
			project: this.project.id,
		}).then(((response) => {
			this.relations = response.body.results;
			if (callback) {
				callback(response);
			}
		); }). catch (function(error) {
			console.log('failed to get relations', error);
		})
if (reloadGraph) {
			reloadGraph();
		}
	}
showRelationsSidebar(); {
		this.sidebar = 'relations';
	},
showAppellationsSidebar(); {
		this.sidebar = 'appellations';
	},
showDateAppellationsSidebar(); {
		this.sidebar = 'dateappellations';
	}



}
</script>

<style scoped>
.project-item {
	padding: 0;
	margin: 10px 0;
}
#title {
	background: grey;
}
</style>