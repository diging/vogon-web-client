<template lang="pug">
div
	p(class="body-2 font-weight-medium mb-0") {{ field.label }}
		span(
			v-if="field.description"
			class="caption font-weight-regular grey--text text--darken-2"
		) &nbsp; - {{ field.description }}
	v-autocomplete(
		v-if="field.type === 'TP'"
		v-model="value"
		placeholder="Select field..."
		dense
		outlined
		filled
		clearable
		:items="appellations"
		item-text="interpretation.label"
		return-object
	)
		template(v-slot:append-outer)
			v-btn(v-if="value" icon)
				v-icon(color="success") mdi-check
			v-tooltip(v-else bottom)
				template(v-slot:activator="{ on }")
					v-btn(outlined fab x-small v-on="on" :color="active ? `success` : `grey`" @click="toggleActive()")
						v-icon mdi-eyedropper-variant
				span Pick annotations from the text
	
	v-text-field(
		v-else-if="field.type === 'CO'"
		v-model="rawText"
		placeholder="Select from text..."
		dense
		outlined
		filled
		clearable
		class="field-text"
	)
		template(v-slot:append-outer)
			v-btn(v-if="value" icon)
				v-icon(color="success") mdi-check
			v-tooltip(v-else bottom)
				template(v-slot:activator="{ on }")
					v-btn(outlined fab x-small v-on="on" :color="active ? `success` : `grey`" @click="toggleActive()")
						v-icon mdi-cursor-text
				span Select from text
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

import { RelationTemplateField } from '@/interfaces/RelationTypes'

@Component({
	name: 'RelationFieldItem',
})
export default class RelationFieldItem extends Vue {
	@Prop()
	private field!: RelationTemplateField;
	@Prop()
	private appellations!: any;
	@Prop()
	private pos!: number;

	private value: any = null;
	private active: boolean = false;
	private rawText: any = null;

	public created() {
		this.$store.watch(
			(state, getters) => getters.getCurrentFieldIndex,
			(newValue, oldValue) => {
				this.active = newValue === this.pos
			},
		)
		this.$store.subscribe((mutation: any, state: any) => {
			if (mutation.type === 'setSelectedFieldAnnotationsAt') {
				const value = state.annotator.selectedFieldAnnotations
				if (mutation.payload.pos === this.pos) {
					this.value = mutation.payload.annotation
					if (this.field.type === 'CO' && mutation.payload.annotation) {
						this.rawText = mutation.payload.annotation.data.stringRep
					}
				}
			}
		})
	}

	@Watch('value')
	public onValueSelect(val: any, oldVal: any) {
		this.$store.commit('setSelectedFieldAnnotationsAt', {
			pos: this.pos,
			annotation: val || null,
		});
	}

	@Watch('rawText')
	public onRawTextChange(val: any, oldVal: any) {
		const annotation = this.$store.getters.getSelectedFieldAnnotations[this.pos];
		if (annotation && !val) {
			this.$store.commit('setSelectedFieldAnnotationsAt', {
				pos: this.pos,
				annotation: null,
			});
		}
	}

	private toggleActive(): void {
		let activeIndex = -1;
		if (!this.active) {
			activeIndex = this.pos;
		}
		this.$store.commit('setCurrentFieldIndex', activeIndex);
		this.$store.commit('setCurrentFieldType', this.field.type);
	}
}
</script>

<style>
.field-text.v-input--dense input, .field-text.v-input--dense input {
    margin-top: 0 !important;
}
</style>