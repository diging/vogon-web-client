<template lang="pug">
    div
        p(class="body-2 font-weight-medium mb-0") {{ field.label }}
            span(
                v-if="field.description"
                class="caption font-weight-regular grey--text text--darken-2"
            ) &nbsp; - {{ field.description }}
        v-autocomplete(
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
                v-icon(v-if="value" color="success") mdi-check
                v-icon(v-else) mdi-eyedropper-variant
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

import { RelationTemplateField } from '@/interfaces/RelationTypes';

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

	@Watch('value')
	public onValueSelect(val: any, oldVal: any) {
		this.$store.commit('setSelectedFieldAnnotationsAt', {
			pos: this.pos,
			annotation: val || null,
		});
	}
}
</script>

<style scoped>
</style>