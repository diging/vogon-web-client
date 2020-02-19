<template lang="pug">
	div(class="list-group-item concept-item clearfix" id="concept-{{ concept.uri }}")
		div
			a(v-on:click="select" style="cursor: pointer;"){{ concept.label }} ({{ concept.authority.name }})
		div(class="text text-muted") 
			{{ concept.description }}
</template>

<script lang="ts">
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
		this.$store.commit('selectconcept', this.concept);
	}
}
</script>
