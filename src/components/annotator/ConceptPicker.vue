<template lang="pug">
	<!-- could not find a css class for concept-picker ->
	div.concept-picker(style="max-height: 50vh; overflow-y: scroll;")
		concept-picker-item(
			v-on:selectconcept="selectConcept"
			v-for="concept in conceptsFinal"
			v-bind:concept="concept")
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

import ConceptPickerItem from '@/components/annotator/ConceptPickerItem.vue'

@Component({
	name: 'ConceptPicker',
	components: {
		'concept-picker-item': ConceptPickerItem
	}
})
export default class ConceptPicker extends Vue {
	//TODO: Interface for concept
	@Prop()
	private appellations!: Array<object>;
	//TODO: create concept interface
	private conceptsFinal: Array<object> = [];
	//TODO:figure out what type appell is
	private appell: Array<any> = [];
	//TODO:figure out what type appell is
	private appellationCount: Array<any> = [];
	private concepts: Array<any> = [];

	created() {
		this.merge(this.appellations);
	}

	private selectConcept(concept: any) {
		// Clear the concept search results.
		this.concepts = [];
		//TODO: Change emit to use store
		this.$store.commit('selectconcept', concept);
	}

	private addConcepts(appellationMapEntires: any) {
		var count = 0
		while (count <= 3) {
			var appellation = appellationMapEntires.next().value;
			if (appellation == null) {
				break
			}
			if (!this.conceptsFinal.includes(appellation[1][0])) {
				this.conceptsFinal.push(appellation[1][0]);
				count++;
			}
		}
	}

	private merge(appellations: any) {
		this.conceptsFinal = [];
		this.appell = appellations;
		// Sort by date
		function compare(a: any, b: any) {
			if (Date.parse(a.created) > Date.parse(b.created))
				return -1;
			if (Date.parse(a.created) < Date.parse(b.created))
				return 1;
			return 0;
		}
		this.appell.sort(compare);
		const appellationMap = new Map();
		// set map items from appell array
		this.appell.forEach(function (item) {
			if (appellationMap.has(item.interpretation.uri)) {
				appellationMap.get(item.interpretation.uri).push(item);
			} else {
				appellationMap.set(item.interpretation.uri, [item]);
			}
		});
		const appellationMapEntires = appellationMap.entries();
		// add non-duplicate objects to conceptsFinal sorted by most recent
		this.addConcepts(appellationMapEntires);
		// sort appellationMap by length
		const sortedMap = new Map([...appellationMap.entries()].sort(function (a, b) {
			return b[1].length - a[1].length
		}));
		const sortedMapItems = sortedMap.entries();
		// add non-duplicate objects to conceptsFinal sorted by most occuring
		this.addConcepts(sortedMapItems);
		return this.conceptsFinal;
	}
}
</script>
