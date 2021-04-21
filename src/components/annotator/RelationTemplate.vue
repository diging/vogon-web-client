<template lang="pug">
	div(class="template-container")
		v-menu(bottom left offset-y)
			template(v-slot:activator="{ on }")
				v-text-field(hide-details v-model="query" filled rounded single-line label="Search for Relation Templates" dense  class="mb-3")
					template(v-slot:append)
						v-fade-transition(leave-absolute)
							v-icon(v-on="on" @click="searchRelationTemplates()") search
			
			div(class="template-list")
				v-list(two-line)
					template(v-for="(template, i) in templates" )
						v-list-item(:key="i" @click="showTemplate(template)")
							v-list-item-content(class="template-item-content")
								v-list-item-title(v-html="template.name")
								div(class="template-description" v-html="template.description")
						v-divider(v-if="i + 1 < templates.length" )

		template(v-if="template")
			h3 {{ template.name }}
			p(class="grey--text text--darken-2") {{ template.description }}
			RelationFieldItem(
				v-for="(field, i) in template.fields"
				v-bind:key="field.part_id"
				v-bind:field="field"
				v-bind:pos="i"
				v-bind:appellations="appellations"
				:key="field.label"
			)

			v-row
				v-col(:cols="6")
					v-btn(
						outlined
						dense
						@click="reset()"
					)
						v-icon(left) mdi-close
						| Cancel
				v-col(:cols="6")
					v-btn(
						dense
						:disabled="disabled"
						:loading="creatingRelation"
						@click="createRelation()"
						color="success"
						class="float-right"
					)
						v-icon(left) mdi-link-plus
						| Create relation
			
			v-alert(
				type="error" 
				dense 
				v-if="error"
				dismissible
			) Error while creating relation!

</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import { Component, Prop, Vue } from 'vue-property-decorator';

import { RelationSet, RelationTemplate, RelationTemplateField } from '@/interfaces/RelationTypes';
import RelationFieldItem from './RelationField.vue';

@Component({
	name: 'RelationTemplateRender',
	components: {
		RelationFieldItem,
	},
})
export default class RelationTemplateRender extends Vue {
	private listener: any = null;
	private query: string = '';
	private templates: RelationTemplate[] = [];

	@Prop()
	private template!: RelationTemplate;

	@Prop()
	private appellations!: any;

	private disabled: boolean = true;
	private error: boolean = false;
	private creatingRelation: boolean = false;

	public created() {
		this.$store.subscribe((mutation: any, state: any) => {
			if (mutation.type === 'setSelectedFieldAnnotationsAt' && state.annotator.selectedFieldAnnotations) {
				const value = state.annotator.selectedFieldAnnotations;
				if (value && value.length > 0 && value.every((x: any) => x !== null)) {
					this.disabled = false;
				} else {
					this.disabled = true;
				}
			}
		});
	}

	private reset(): void {
		this.$store.commit('setAnnotatorTemplate', null);
		this.$store.commit('setCurrentFieldIndex', -1);
	}

	private createRelation(): void {
		this.creatingRelation = true;
		this.disabled = true;
		const annotations = this.$store.getters.getSelectedFieldAnnotations;
		let fields = [];
		if (this.template.fields) {
			fields = this.template.fields.map((field: RelationTemplateField, i: number) => {
				const fieldAnnotation: any = {};
				if (field.type === 'TP') {
					fieldAnnotation.appellation = {
						...annotations[i],
						startPos: annotations[i].position.startOffset,
						endPos: annotations[i].position.endOffset,
					};
				} else if (field.type === 'CO') {
					fieldAnnotation.position = annotations[i].position;
					fieldAnnotation.data = annotations[i].data;
				}

				return {
					...field,
					...fieldAnnotation,
				};
			});
		}
		const payload = {
			...this.$store.getters.getAnnotatorMeta,
			fields,
		};

		Vue.$axios.post(
			`/relationtemplate/${this.template.id}/create_relation`,
			payload,
		).then((response: AxiosResponse) => {
			this.$store.commit('setRelationCreated', true);
			this.reset();
		})
		.catch(() => {
			this.creatingRelation = false;
			this.error = true;
		})
		.finally(() => {
			this.creatingRelation = false;
			this.disabled = false;
		});
	}

	private searchRelationTemplates(): void {
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
}
</script>

<style scoped>
.template-list {
	max-height: 500px;
	overflow-y: auto;
}
.template-item-content {
	max-width: 500px;
}
.template-container {
	text-align: left;
	padding: 20px;
}
.template-description {
	font-size: 0.875rem;
	color: rgba(0,0,0,.6);
}
</style>