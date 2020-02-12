<template lang="pug">
	div(v-if="appellation.visible" @mouseover="tooltip = true" @mouseleave="tooltip = false")
		div(:style="{ ...appellation.positionStyle, zIndex: 5, width: 'auto', height: 30 }" class="appellation-tooltip" v-if="tooltip")
			| {{ appellation.interpretation.label }}
		li(
			:style="appellation.positionStyle"
			v-bind:class=`{
				'appellation': appellation.interpretation != null,
				'date-appellation': appellation.dateRepresentation != null,
				'appellation-selected': appellation.selected
			}`
			@click="onApellationClick()"
		)

		li(v-if="manyLinesAreSelected()"
			v-for="line in appellation.midLines"
			v-bind:class=`{
				'appellation': appellation.interpretation != null,
				'date-appellation': appellation.dateRepresentation != null,
				'appellation-selected': appellation.selected
			}`
			v-bind:style=`{
				height: line.height + 'px',
				top: line.top + 'px',
				left: line.left + 'px',
				position: 'absolute',
				width: line.width + 'px',
				'z-index': 2
			}`
		)

		li(v-if="multipleLinesAreSelected()"
			v-bind:style=`{
				height: appellation.positionStyle.height,
				top: appellation.endPosition.top + 'px',
				left: appellation.endPosition.left + 'px',
				position: 'absolute',
				width: appellation.endPosition.width + 'px',
				'z-index': 2
			}`
			v-bind:class=`{
				'appellation': appellation.interpretation != null,
				'date-appellation': appellation.dateRepresentation != null,
				'appellation-selected': appellation.selected
			}`
		)
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue, Watch } from 'vue-property-decorator';

import store from '@/store';

@Component({
	name: 'AppellationDisplayItem',
})
export default class AppellationDisplayItem extends Vue {
	@Prop() private appellation!: any;
	@Prop() private index!: number;

	private tooltip: boolean = false;

	private getLabel() {
		if (this.appellation.interpretation) {
			return this.appellation.interpretation.label;
		} else {
			return this.appellation.dateRepresentation;
		}
	}

	private multipleLinesAreSelected() {
		return this.appellation.endPosition.top !== undefined;
	}
	private manyLinesAreSelected() {
		return this.appellation.midLines.length > 0;
	}

	private onApellationClick() {
		// Check if this is a currently highlighted text
		if (this.appellation.selected) {
			return;
		}

		const currentFieldIndex = this.$store.getters.getCurrentFieldIndex;
		if (currentFieldIndex >= 0) {
			this.$store.commit('setSelectedFieldAnnotationsAt', {
				pos: currentFieldIndex,
				annotation: this.$store.getters.getAnnotatorAppellations[this.index],
			});

			// Reset
			this.$store.commit('setCurrentFieldIndex', -1);
			this.$store.commit('setCurrentFieldType', null);
		}
	}
}
</script>

<style scoped>
.appellation.appellation-selected {
    border: 2px solid blue;
    background-color: blue;
    opacity: 0.3;
}
.appellation {
    border: 0.5px solid orange;
    background-color: #FBC02D;
    opacity: 0.4;
    list-style-type: none;
    margin: 0;
    padding: 0;
    cursor: pointer;
}
.appellation-tooltip {
	background-color: black;
	color: white;
	margin-left: 16px;
    margin-top: 20px;
    padding: 5px 10px;
    border-radius: 5px;
	opacity: 0.7;
}

</style>