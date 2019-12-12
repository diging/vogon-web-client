<template lang="pug">
	v-list(three-line dense)
		template(v-for="(appellation, index) in appellations")
			v-list-item(:key="appellation.id")
				v-list-item-content
					v-list-item-title.text-left {{ appellation.interpretation.label }}
					v-list-item-subtitle().text-left  Created by <strong>{{ getCreatorName(appellation.createdBy) }}</strong> on {{ getFormattedDate(appellation.created) }}
			v-divider
		v-divider
</template>

<script lang="ts">
import { VForm } from '@/interfaces/GlobalTypes';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import AppellationListItem from './AppellationListItem.vue';

import JwtDecode from 'jwt-decode';
import moment from 'moment';
@Component({
  name: 'AppellationList',
  components: {
	  'AppellationListItem': AppellationListItem,
  }
})
export default class AppellationList extends Vue {

	@Prop()
	private appellations!: object;
	@Prop()
	private sidebar!;

	private error_message: string = '';
	private appellations_to_submit: object[] = [];
	private templates = null;
	private selected_template: objects[] = [];
	private current_appellations = this.appellations;

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
	// 	var current_ids = this.current_appellations.map(function (elem) {
	// 		return elem.id;
	// 	});
	// 	this.appellations.forEach((elem) => {
	// 		if (current_ids.indexOf(elem.id) < 0) {
	// 			this.current_appellations.push(elem);
	// 		}
	// 	});
	// }

	// @Watch('selected_template')
	// public watchSelectedTemplate() {
	// 		this.$store.commit("setTemplate", this.selected_template);
	// 		if (this.$store.getters.getValidator == 1) {
	// 			this.$store.commit('setValidator', 0)
	// 		}
	// }

	private getCreatorName(creator) {
		const decoded = JwtDecode<TokenDto>(localStorage.getItem('token'));
		if (creator.id == decoded.user_id) {
			return 'you';
		} else {
			return creator.username;
		}
	}
	private getFormattedDate(isodate) {
		return moment(isodate).format('dddd LL [at] LT');
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
			this.$store.commit("setTemplate", response.body.templates[0]);
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
				return this.$store.getters.getValidator;
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
	background-color:#f5f5f5;
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