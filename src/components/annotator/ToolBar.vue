<template lang="pug">
	v-app-bar
		v-app-bar-nav-icon(@click="showSideBar")
		v-spacer
		v-toolbar-title.text-capitalize {{ text.title }}
		v-spacer
		v-menu(bottom left offset-y)
			template(v-slot:activator="{ on }")
				v-text-field(hide-details v-model="query" filled rounded single-line label="Search for Relation Templates" dense)
					template(v-slot:append)
						v-fade-transition(leave-absolute)
							v-icon(v-on="on" @click="searchRelationTemplates()") search
			v-list(two-line)
				template(v-for="(template, i) in templates" )
					v-list-item(:key="i" @click="showTemplate(template)")
						v-list-item-content(class="template-list")
							v-list-item-title(v-html="template.name")
							v-list-item-subtitle(v-html="template.description")
					v-divider(v-if="i + 1 < templates.length" )
		v-btn(class="mx-2" small color="primary" v-if="!submitted && relationsets && relationsets.length > 0" @click="submitRelationsDialog = true")
			v-icon(left small) mdi-sync
			| Submit relations
		v-app-bar-nav-icon(@click="showLists")

		v-dialog(v-model="submitRelationsDialog" max-width="700")
			v-card
				v-card-title(class="headline") Submit to Quadriga?
				v-card-text(class="text-left")
					strong The following relations will be submitted to "Quadriga":
					AnnotationList(v-bind:annotations="relationsets")
				v-card-actions
					v-spacer
					v-btn(text color="red darken-1" @click="submitRelationsDialog = false") Cancel
					v-btn(text color="green darken-1" @click="submitRelations" :disabled="submitting" :loading="submitting") Submit

		v-snackbar(v-model="snackbar" top :color="color" :timeout="3000") {{ msg }}
</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import { Component, Prop, Vue } from 'vue-property-decorator';

import AnnotationList from '@/components/relations/AnnotationList.vue';
import { VForm } from '@/interfaces/GlobalTypes';
import { RelationSet, RelationTemplate } from '@/interfaces/RelationTypes';

@Component({
	name: 'ToolBar',
	components: {
		AnnotationList,
	},
})
export default class ToolBar extends Vue {
	@Prop() private text!: object;
	@Prop() private relationsets!: RelationSet[];

	private query: string = '';
	private loading: boolean = false;
	private showResults: boolean = false;
	private templates: RelationTemplate[] = [];

	private submitted: boolean = false;
	private submitting: boolean = false;
	private submitRelationsDialog: boolean = false;
	private snackbar: boolean = false;
	private msg: string = '';
	private color: string = '';

	private showSideBar() {
		this.$store.commit('toggleSideBarMutation');
	}

	private showLists() {
		this.$store.commit('toggleLists');
	}

	private searchRelationTemplates(): void {
		this.loading = true;
		let all = true;
		if (this.query !== '') {
			all = false;
		}
		Vue.$axios.get('/relationtemplate', {
			params: {
				format: 'json',
				all,
				search: this.query,
			},
		}).then((result) => {
			this.loading = false;
			this.showResults = true;
			this.templates = result.data;
		}).catch((error) => {
			// TODO: deal with errors
		});
	}

	private showTemplate(template: RelationTemplate): void {
		this.$store.commit('setAnnotatorCurrentTab', 'tab-3');
		this.$store.commit('setAnnotatorTemplate', template);

		let fieldAnnotations: any[] = [];
		if (template.fields) {
			fieldAnnotations = template.fields.map((i) => null);
		}
		this.$store.commit('setSelectedFieldAnnotations', fieldAnnotations);
	}

	private submitRelations() {
		this.submitting = true;
		let relationsets: RelationSet[] = [];
		if (this.relationsets && this.relationsets.length > 0) {
			relationsets = this.relationsets;
		}
		Vue.$axios.post('/relationset/submit_for_quadriga', {
			relationset_ids: relationsets.map((item: RelationSet) => item.id),
		}).then((response: AxiosResponse) => {
			this.submitted = true;
			this.snackbar = true;
			this.color = 'success';
			this.msg = 'Successfully submitted relations to Quadriga!';
		}).catch(() => {
			this.snackbar = true;
			this.color = 'error';
			this.msg = 'Error while submitting relations to Quadriga!!';
		}).finally(() => this.submitRelationsDialog = false);
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
	background-color: #f5f5f5;
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
.template-list {
	text-align: left;
}
</style>