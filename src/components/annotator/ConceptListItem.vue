<template lang="pug">
	div(class="list-group-item concept-item clearfix" id="concept-{{ concept.uri }}")
		div
			a(v-on:click="select" style="cursor: pointer;"){{ concept.label }} ({{ concept.authority.name }})
		div(class="text text-muted") 
			{{ concept.description }}
</template>

<script lang="ts">
import { VForm } from '@/interfaces/GlobalTypes';
import { Component, Prop, Vue } from 'vue-property-decorator';
@Component({
  name: 'ConceptListItem',
})
export default class ConceptListItem extends Vue {

	// TODO: Interface for concept
	@Prop()
	private concept!: object;

	// FIXME: Get rid of this emit
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