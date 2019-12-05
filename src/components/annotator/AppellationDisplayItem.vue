<template lang="pug">
	div(v-if="appellation.visible" @mouseover="tooltip = true" @mouseleave="tooltip = false")
		div(:style="{ ...positionStyle, zIndex: 5, width: 'auto', height: 30 }" class="appellation-tooltip" v-if="tooltip")
			| {{ appellation.interpretation.label }}
		li(
			v-on:click="selectAppellation"
			:style="positionStyle"
			v-bind:class=`{
				'appellation': appellation.interpretation != null,
				'date-appellation': appellation.dateRepresentation != null,
				'appellation-selected': appellation.selected
			}`
		)

		li(v-if="manyLinesAreSelected()"
			v-on:click="selectAppellation"
			v-for="line in midLines"
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
			v-on:click="selectAppellation"
			v-bind:style=`{
				height: positionStyle.height,
				top: endPosition.top + 'px',
				left: endPosition.left + 'px',
				position: 'absolute',
				width: endPosition.width + 'px',
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

import { VForm } from '@/interfaces/GlobalTypes';
import store from '@/store';

@Component({
  name: 'AppellationDisplayItem',
})
export default class AppellationDisplayItem extends Vue {

	@Prop()
	private appellation!: any;

	@Prop()
	private pos!: number;

	private tooltip: boolean = false;
	private positionStyle: any = {
		top: 0,
		left: 0,
		position: 'absolute',
		width: 0,
		height: 0,
		zIndex: 2,
	};

	private midLines: object[] = [];
	private endPosition: any = {};

	public async created() {
		store.subscribe((mutation: any, state: any) => {
			if (mutation.type === 'setTextContentStyle' && state.text_content_styles.positions) {
				const position = state.text_content_styles.positions[this.pos];
				this.positionStyle.top = `${position.top}px`;
				this.positionStyle.left = `${position.left}px`;
				this.positionStyle.width = `${position.width}px`;
				this.positionStyle.height = `${position.lineHeight}px`;

				this.midLines = position.midLines;
				this.endPosition = position.endPosition;

				this.$forceUpdate();
			}
		});
	}

	get formattedDate() {
		return new Date(this.text.added).toLocaleString();
	}

	private getLabel() {
		if (this.appellation.interpretation) {
			return this.appellation.interpretation.label;
		} else {
			return this.appellation.dateRepresentation;
		}
	}

	private multipleLinesAreSelected() {
		return this.endPosition.top !== undefined;
	}
	private manyLinesAreSelected() {
		return this.midLines.length > 0;
	}

	private selectAppellation() {
		// TODO: Get rid of emit
		this.$emit('selectappellation', this.appellation);
	}
}
</script>

<style scoped>
#title {
	background: grey;
}
pre {
	white-space: pre-wrap;
	word-wrap: break-word;
	background-color:#f5f5f5;
	border: 1px solid#ccc;
	border-radius: 4px;
	display: block;
}
#text-content {
	padding: 3%;
}

.appellation.appellation-selected {
    border: 2px solid orange;
    background-color: orange;
    opacity: 0.6;
}
.appellation {
    border: 0.5px solid orange;
    background-color: yellow;
    opacity: 0.2;
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