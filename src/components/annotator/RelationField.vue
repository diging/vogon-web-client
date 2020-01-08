<template lang="pug">
    div
        p(class="body-2 font-weight-medium mb-0") {{ field.label }}
            span(
                v-if="field.description"
                class="caption font-weight-regular grey--text text--darken-2"
            ) &nbsp; - {{ field.description }}
        v-autocomplete(
            placeholder="Select field..."
            dense
            outlined
            filled
            :items="annotations"
        )
            template(v-slot:append-outer)
                v-icon mdi-eyedropper-variant
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { RelationTemplateField } from '@/interfaces/RelationTypes';

@Component({
	name: 'RelationFieldItem',
})
export default class RelationFieldItem extends Vue {
	@Prop()
	private field!: RelationTemplateField;

	private annotations = ['Annotation 1', 'Annotation 2'];
}
</script>

<style scoped>
</style>