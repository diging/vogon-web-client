<template lang="pug">
	<!-- could not find a css class for concept-picker ->
	div.concept-picker(style="max-height: 50vh; overflow-y: scroll;")
		concept-picker-item(
			v-on:selectconcept="selectConcept"
			v-for="concept in conceptsFinal"
			v-bind:concept="concept")
</template>

<script lang="ts">
import { VForm } from '@/interfaces/GlobalTypes';
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
	private appellationCount: Array<any> = []

	created() {
		this.merge(this.appellations);

	}

	private selectConcept(concept) {
		// Clear the concept search results.
		this.concepts = [];
		//TODO: Change emit to use store
		this.$emit('selectconcept', concept);
	}
	private addConcepts(appellationMapEntires) {
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
	private merge(appellations) {
		this.conceptsFinal = [];
		this.appell = appellations;
		// Sort by date
		function compare(a, b) {
			if (Date.parse(a.created) > Date.parse(b.created))
				return -1;
			if (Date.parse(a.created) < Date.parse(b.created))
				return 1;
			return 0;
		}
		this.appell.sort(compare);
		var appellationMap = new Map();
		// set map items from appell array
		this.appell.forEach(function (item) {
			if (appellationMap.has(item.interpretation.uri)) {
				appellationMap.get(item.interpretation.uri).push(item);
			} else {
				appellationMap.set(item.interpretation.uri, [item]);
			}
		});
		var appellationMapEntires = appellationMap.entries();
		// add non-duplicate objects to conceptsFinal sorted by most recent
		this.addConcepts(appellationMapEntires);
		// sort appellationMap by length
		var sortedMap = new Map([...appellationMap.entries()].sort(function (a, b) {
			return b[1].length - a[1].length
		}));
		var sortedMapItems = sortedMap.entries();
		// add non-duplicate objects to conceptsFinal sorted by most occuring
		this.addConcepts(sortedMapItems);
		return this.conceptsFinal;
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