<template lang="pug">
	div(class="template-container")
		h3 {{ template.name }}
		p(class="grey--text text--darken-2") {{ template.description }}
		RelationFieldItem(
			v-for="(field, i) in template.fields"
			v-bind:field="field"
			v-bind:pos="i"
			v-bind:appellations="appellations"
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

import { RelationTemplate, RelationTemplateField } from '@/interfaces/RelationTypes';
import RelationFieldItem from './RelationField.vue';

@Component({
	name: 'RelationTemplateRender',
	components: {
		RelationFieldItem,
	},
})
export default class RelationTemplateRender extends Vue {
	private listener: any = null;

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

	// Since we only want one field to listen for an appellation at a time,
	//  we keep track of the first field to announce that they are
	//  listening. All other RelationField instances are expected to respect
	//  that listener, and not start listening until the current field is
	//  done.
	public fieldIsListening(listeningField: any) {
		this.listener = listeningField;
		// TODO: Change emit to store
		if (listeningField.type === 'CO') {
			this.$store.commit('fieldislisteningfortext');
		}
	}

	public fieldIsDoneListening(listeningField: any) {
		this.listener = null;
		// TODO: Change emit to store
		if (listeningField.type === 'CO') {
			this.$store.commit('fieldisdonelisteningfortext');
		}
	}

	public registerData(field: any, data: any) {
		// TODO: Change emit to store
		this.$store.commit('registerdata', field, data);
	}

	public unregisterData(field: any) {
		this.$store.commit('unregisterdata', field);
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
}
</script>

<style scoped>
.template-container {
	text-align: left;
	padding: 20px;
}
</style>