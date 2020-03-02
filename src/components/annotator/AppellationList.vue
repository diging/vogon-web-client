<template lang="pug">
	div
		div(class="text-right")
			v-btn(text tile class="mr-2" @click="$store.commit('toggleAnnotatorHideAppellation')")
				template(v-if="$store.getters.getAnnotatorHideAppellation")
					v-icon(left) mdi-eye-off
					| Show all
				template(v-else)
					v-icon(left) mdi-eye
					| Hide all
		v-list(three-line dense)
			template(v-for="(appellation, i) in appellations")
				AppellationListItem(:key="appellation.id" :appellation="appellation")
				v-divider(v-if="i + 1 < appellations.length")
</template>

<script lang="ts">
import JwtDecode from 'jwt-decode';
import moment from 'moment';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

import { TokenDto } from '@/interfaces/GlobalTypes';
import AppellationListItem from './AppellationListItem.vue';

@Component({
	name: 'AppellationList',
	components: {
		AppellationListItem,
	},
})
export default class AppellationList extends Vue {
	@Prop() private appellations!: any;
	@Prop() private sidebar!: any;

	private errorMessage: string = '';
	private appellationsToSubmit: object[] = [];
	private templates = null;
	private selectedTemplate: any[] = [];
	private currentAppellations = this.appellations;
	private searching: boolean = false;

	// created() {
	//     //this.getTemplates();
	//     this.$store.commit('setAppellations', this.appellations);
	//     this.watchStoreForValidator();
	// }

	// @Watch('appellations')
	// watchAppellations() {
	// 	// Replace an array prop wholesale doesn't seem to trigger a
	// 	//  DOM update in the v-for binding, but a push() does; so we'll
	// 	//  just push the appellations that aren't already in the array.
	// 	var current_ids = this.currentAppellations.map(function (elem) {
	// 		return elem.id;
	// 	});
	// 	this.appellations.forEach((elem) => {
	// 		if (current_ids.indexOf(elem.id) < 0) {
	// 			this.currentAppellations.push(elem);
	// 		}
	// 	});
	// }

	// @Watch('selectedTemplate')
	// public watchSelectedTemplate() {
	// 		this.$store.commit("setTemplate", this.selectedTemplate);
	// 		if (this.$store.getters.getValidator == 1) {
	// 			this.$store.commit('setValidator', 0)
	// 		}
	// }

	get conceptLabel() {
		return this.$store.getters.conceptLabel;
	}

	get calcSizeOfPage() {
		const width = document.body.clientWidth;
		if (width >= 2000) {
			return true;
		} else {
			return false;
		}
	}

	/*************************************************
	 * Start Methods to create relationships to text *
	 *************************************************/
	private selectConcept() {
		this.$store.commit('triggerConcepts');
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

	// TODO: Implement and fix the axios call
	private getTemplateFields() {
		this.$axios.get('/gettemplatefields', {
			params: {
				search: this.selectedTemplate,
				format: 'json',
				all: false,
			},
		}).then((response: any) => {
			this.$store.commit('setTemplate', response.body.templates[0]);
		}).catch((error: any) => {
			this.searching = false;
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
				return this.$store.getters.getValidator;
			},
			(val) => {
				switch (val) {
					case 0:
						this.errorMessage = '';
						break;
					case 1:
						this.errorMessage = 'Please Select A Template';
						break;
					case 2:
						this.errorMessage = 'Please Select A Concept';
						break;
					case 3:
						this.errorMessage = 'Please Select At Least One Appellation';
						break;
				}
			},
		);
	}

	/***********************************************
	 * End Methods to create relationships to text *
	 ***********************************************/
	private allHidden() {
		let allHidden = true;
		this.appellations.forEach((appellation: any) => {
			if (appellation.visible) {
				allHidden = false;
			}
		});
		return allHidden;
	}

	// FIXME: Change all the following emits to use the store instead
	private hideAll() {
		this.$store.commit('hideallappellations');
	}

	private showAll() {
		this.$store.commit('showallappellations');
	}

	private hideAppellation(appellation: any) {
		this.$store.commit('hideappellation', appellation);
	}

	private showAppellation(appellation: any) {
		this.$store.commit('showappellation', appellation);
	}

	private selectAppellation(appellation: any) {
		this.$store.commit('selectappellation', appellation);
	}
}
</script>

<style scoped>
hr {
	display: block;
	height: 1px;
	border: 0;
	border-top: 1px solid #ccc;
	margin: 0;
	padding: 0;
}

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
	background-color: #f5f5f5;
	border: 1px solid#ccc;
	border-radius: 0px;
	display: block;
}
#test {
	float: left;
}
#text-content {
	padding: 3%;
}
</style>