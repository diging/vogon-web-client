<template lang="pug">
	v-card(tile v-if="concepts.length > 0" :elevation="0" class="concept-list-container")
		template(v-for="(concept, i) in concepts")
			v-list-item(:key="i" @click="selectConcept(concept)")
				v-list-item-content(class="py-0")
					v-list-item-title
						| {{ concept.label }}
						span(v-if="concept.authority.name")
							| &nbsp; ({{ concept.authority.name }})
					v-list-item-subtitle
						| {{ concept.description }}
			v-divider(v-if="i + 1 < concepts.length")
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { Concept } from '@/interfaces/ConceptTypes';

@Component({
	name: 'ConceptPicker',
})
export default class ConceptPicker extends Vue {
	@Prop() private concepts!: Concept[];

	private selectConcept(concept: Concept) {
		this.$store.commit('setAnnotatorSelectedConcept', concept);
	}
}
</script>

<style scoped>
.concept-list-container {
	max-height: 400px;
	overflow-y: auto;
	margin-top: 16px;
	margin-bottom: 16px;
}
</style>