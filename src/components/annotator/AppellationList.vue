<template lang="pug">
	div
		div(style="float: left; margin-left: 3%;")
			h4(v-if="error_message" style="color: red;") {{ error_message }}
		v-row
			v-col
				h5(style="padding-left: 5%;" v-if="conceptLabel") Concept: {{ conceptLabel }}
			v-col
				a(v-if="allHidden()" v-on:click="showAll" class="btn") Show all
				a(v-on:click="hideAll" class="btn") Hide all
		div
			div(style="padding: 0%;" class="col-lg-12 col-xl-2" v-if="sidebar == 'submitAllAppellations'")
				button(v-bind:style="[calcSizeOfPage ? {float: 'right', 'margin-right': 3 + '%'} : {float: 'left', 'margin-left': 3 + '%'}]"   @click="deselectAllTemplatesRef()" class="btn btn-default btn-sm" v-tooltip="'Deselect All'")
					span(class="glyphicon glyphicon-remove-sign")
				button(v-bind:style="[calcSizeOfPage ? {float: 'right', 'margin-right': 3 + '%'} : {float: 'left', 'margin-left': 3 + '%', 'margin-bottom': 3 + '%'}]"  @click="checkAll()" class="btn btn-default btn-sm" v-tooltip="'Select All'")
					span(class="glyphicon glyphicon-ok-sign")
			div(style="margin-bottom: 2%;" v-if="sidebar == 'submitAllAppellations'")
				div(style="padding-right: 0%; padding-left: 0%; margin-left: 1%;" class="col-xl-6"O)
					select(class="btn btn-default dropdown-toggle"  v-if="sidebar == 'submitAllAppellations'" v-model="selected_template" style="float: left; margin-left: 2.5%; width: 100%;")
						option(value=0) Please select Relationship
						option(v-for="template in templates" :value="template") {{ template.name }} 
							span(style="color: lightgrey;") {{ template.description }}
				div(class="col-lg-12 col-xl-3" v-bind:style="[calcSizeOfPage ? {} : {'padding-left': 3.25 + '%'}]")
					button(v-if="!conceptLabel" v-bind:style="[calcSizeOfPage ? {'margin-top': 1 + '%'} : {'margin-top': 2 + '%', 'margin-bottom': 3 + '%'}]" @click="selectConcept()" class="btn btn-info btn-xs" ) Select Text Concept
			div(class="col-lg-12 col-xl-12" style="padding-left: 2.5%; padding-right: 1%")
				ul(class="list-group appellation-list" style="max-height: 400px; overflow-y: scroll; margin-top: 2%;")
					appellation-list-item(
						v-bind:sidebar="sidebar"
						v-on:hideappellation="hideAppellation"
						v-on:showappellation="showAppellation"
						v-on:selectappellation="selectAppellation"
						v-on:removeAppellation="removeAppellation($event)"
						v-on:addAppellation="addAppellation($event)"
						v-for="(appellation, index) in current_appellations"
						v-bind:appellation=appellation
						v-if="appellation != null"
						v-bind:index="index")
</template>

<script lang="ts">
import { VForm } from '@/interfaces/GlobalTypes';
import { Component, Prop, Vue } from 'vue-property-decorator';
import AppellationDisplayItem from './AppellationDisplayItem.vue';
@Component({
  name: 'AppellationList',
  components: {
	  'appellation-list-item': AppellationDisplayItem,
  }
})
export default class AppellationList extends Vue {

	@Prop()
	private appellation!: object;
	@Prop()
	private sidebar!;

	private error_message: string = '';
	private appellations_to_submit: object[] = [];
	private templates = null;
	private selected_template: objects[] = [];
	private current_appellations = this.appellations;

	mounted() {
		this.watchUncheckStore();
		this.watchCheckStore();
		this.$root.$on('appellationClicked', (data) => {
			if (data === this.appellation) {
				this.checked = !this.checked;
			}
		});
	}
	created() {
        //this.getTemplates();
        store.commit('setAppellations', this.appellations);
        this.watchStoreForValidator();
    },

	@Watch('appellations')
	watchAppellations() {
		// Replace an array prop wholesale doesn't seem to trigger a
		//  DOM update in the v-for binding, but a push() does; so we'll
		//  just push the appellations that aren't already in the array.
		var current_ids = this.current_appellations.map(function (elem) {
			return elem.id;
		});
		this.appellations.forEach((elem) => {
			if (current_ids.indexOf(elem.id) < 0) {
				this.current_appellations.push(elem);
			}
		});
	}

	@Watch('selected_template')
	public watchSelectedTemplate() {
			this.$store.commit("setTemplate", this.selected_template);
			if (this.$store.getters.getValidator == 1) {
				this.$store.commit('setValidator', 0)
			}
	}

	get conceptLabel() {
		return this.$store.getters.conceptLabel
	}

	get calcSizeOfPage() {
		let width = $(document).width();
		if (width >= 2000) {
			return true
		} else {
			return false
		}
	}

	 /*************************************************
	 * Start Methods to create relationships to text *
	 *************************************************/
	private selectConcept() {
		this.$store.commit('triggerConcepts')
	}
	
	// FIXME: This end point does not exsist in the backend
	// private getTemplates() {
	// 	Vue.$axios.get('/rest/templates/get_single_relation', {
	// 		params: {
	// 			format: 'json',
	// 			all,
	// 			search: this.query,
	// 		},
	// 	}).then((result) => {
	// 		this.loading = false;
	// 		this.showResults = true;
	// 		console.log(result.data);
	// 		this.searchResults = result.data.templates;
	// 	})
	// 	.catch((error) => {
	// 		// TODO: deal with errors
	// 		this.error = true;
	// 	});
	// 	RelationTemplateResource.get_single_relation().then(response => {
	// 		this.templates = response.body;
	// 	}).catch(function (error) {
	// 		console.log('Failed to get relationtemplates', error);
	// 	});
	// }
	//TODO: Change vue resource to Axios
	private getTemplateFields() {
		RelationTemplateResource.query({
			search: this.selected_template,
			format: "json",
			all: false
		}).then(function (response) {
			store.commit("setTemplate", response.body.templates[0]);
		}).catch(function (error) {
			console.log('Failed to get relationtemplates', error);
			self.searching = false;
		});
	}
	
	private deselectAllTemplatesRef() {
		this.$store.commit('deselect');
	}
	
	private checkAll() {
		this.$store.commit('selectAll');
	}
	
	private watchStoreForValidator() {
		this.$store.watch(
			(state) => {
				return store.getters.getValidator;
			},
			(val) => {
				switch (val) {
					case 0:
						this.error_message = "";
						break;
					case 1:
						this.error_message = "Please Select A Template";
						break;
					case 2:
						this.error_message = "Please Select A Concept";
						break;
					case 3:
						this.error_message = "Please Select At Least One Appellation";
						break;
				}
			},
		);
	}
	/***********************************************
	 * End Methods to create relationships to text *
	 ***********************************************/
	private allHidden() {
		var all_hidden = true;
		this.appellations.forEach(function (appellation) {
			if (appellation.visible) all_hidden = false;
		});
		return all_hidden;
	}
	//FIXME: Change all the following emits to use the store instead
	private hideAll() {
		this.$emit("hideallappellations");
	}
	
	private showAll() {
		this.$emit("showallappellations");
	}
	
	private hideAppellation(appellation) {
		this.$emit("hideappellation", appellation);
	}
	
	private showAppellation(appellation) {
		this.$emit("showappellation", appellation);
	}
	
	private selectAppellation(appellation) {
		this.$emit('selectappellation', appellation);
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
pre {
	white-space: pre-wrap;
	word-wrap: break-word;
	background-color:#f5f5f5;
	border: 1px solid#ccc;
	border-radius: 4px;
	display: block;
}
#test {
	float: left;
}
#text-content {
	padding: 3%;
}

</style>