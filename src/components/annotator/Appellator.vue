<template lang="pug">
	div(class="list-group-item concept-item clearfix" id="concept-{{ concept.uri }}")
		div
			a(v-on:click="select" style="cursor: pointer;"){{ concept.label }} ({{ concept.authority.name }})
		div(class="text text-muted") 
			{{ concept.description }}
</template>

<script lang="ts">
import { VForm } from '@/interfaces/GlobalTypes';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
@Component({
  name: 'Appellator',
  components: {
        'appellation-list': AppellationList,
        'relation-list': RelationList,
        'text-display': TextDisplay,
        'appellation-creator': AppellationCreator,
        'relation-creator': RelationCreator,
        'relation-template-selector': RelationTemplateSelector,
        'date-appellation-creator': DateAppellationCreator
    }
})
export default class Appellator extends Vue {

	private appellations: Array<object> = []
	private dateappellations: Array<object> = []
	private relations: Array<object> = []
	private selected: object | null = null
	private selected_text: object | null = null
	private user: object = {
		id: USER_ID,
		username: USER_NAME
	}
	private text: object = {
		id: TEXT_ID,
		title: TEXT_TITLE
	}
	private project: object = {
		id: PROJECT_ID,
		name: PROJECT_NAME
	}
	private sidebarShown: boolean = false
	private template: object | null = null
	private creating_relation: boolean = true
	private text_listener: object | null = null
	private sidebar: string = 'relations'
	private create_date_appellation: boolean = false
	private swimmerPosition: string = 'static'
	private swimmerTop: number = 0
	private swimmerRef: number = 0
	private swimmerLeft: number = -2
	private swimmerWidth: number = 0
	private submitAppellationClicked: boolean = false
	private massAssignmentFailed: boolean = false

	mounted() {
        this.updateAppellations();
        this.updateRelations();
        store.commit('setAppellations', this.appellations);
        this.updateDateAppellations();
        this.updateSwimRef();
        this.handleScroll();
        //needs to be called in mounted.
        this.watchStoreForConcepts();
        this.watchStoreForAssignmentFailed();
	}
	
	created() {
        window.addEventListener('scroll', this.handleScroll);
        window.addEventListener('resize', this.handleScroll);
        document.getElementById('graphContainer').onmouseup = function () {
            this.updateSwimRef();
            this.handleScroll();
        }
	}
	
	destroyed() {
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleScroll);
	}
	
	get fields() {
		return this.template.fields;
	}

	
	sidebar: function () {
		// remove submit button if sidebar is not showing submitAllAppellations 
		if (!(this.sidebar == 'submitAllAppellations')) {
			this.submitAppellationClicked = false;
		}
	},
	appellations: function () {
		this.filterTextAppellationFromAppellationList();
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