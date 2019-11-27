<template lang="pug">
	div(class="list-group-item concept-item clearfix" :id="'concept-' + concept.interpretation.uri")
		div
			a(v-on:click="select" style="cursor: pointer;")
				{{ concept.interpretation_label }} ({{ concept.interpretation.authority }})
		div.text.text-muted
			{{ concept.interpretation.description }}
</template>

<script lang="ts">
import { VForm } from '@/interfaces/GlobalTypes';
import { Component, Vue, Prop } from 'vue-property-decorator';
@Component({
  name: 'ConceptPickerItem',
})
export default class ConceptPickerItem extends Vue {

	//TODO: Interface for concept
	@Prop()
	private concept!: object;

	//FIXME: Get rid of this emit
	private select() {
		this.$emit('selectconcept', this.concept);
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