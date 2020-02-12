<template lang="pug">
	<div>
		div.text-selection(v-if="textIsSelected()" v-bind:style="{height: lineHeight,top: position.top,left: position.left,position: 'absolute', width: position.width,'z-index': 2}")
		div.text-selection(v-if="manyLinesAreSelected()" v-for="line in midLines" v-bind:style="{height: line.height, top: line.top, left: line.left, position: 'absolute', width: line.width, 'z-index': 2}")
		div.text-selection(v-if="multipleLinesAreSelected()" v-bind:style="{ height: lineHeight, top: endPosition.top, left: endPosition.left, position: 'absolute', width: endPosition.width, 'z-index': 2}")>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

import { VForm } from '@/interfaces/GlobalTypes';
import { getPointPosition, getStyle, getTextPosition } from '@/utils/annotations';

@Component({
	name: 'TextSelectionDisplay',
})
export default class TextSelectionDisplay extends Vue {
	@Prop()
	private selected!: any;

	@Prop()
	private content!: string;
	private position: any = {};
	private midLines: any[] = [];
	private endPosition: any = {};
	private lineHeight: number = 0;

	@Watch('selected')
		public onSelected() {
		this.updatePosition();
	}

	public textIsSelected() {
		return this.selected.startOffset != null;
	}
	public multipleLinesAreSelected() {
		return this.endPosition.top !== undefined;
	}
	public manyLinesAreSelected() {
		return this.midLines.length > 0;
	}
	public updatePosition() {
		const element = document.getElementById('text-content') as HTMLElement;
		this.midLines = [];
		this.position = getTextPosition(this.selected, element);
		const endPoint = getPointPosition(this.selected.endOffset, element);
		const lineHeight = parseInt(getStyle(element, 'line-height'), 10);

		this.lineHeight = lineHeight - 1; // So that they don't stack.
		const nLines = 1 + (endPoint.bottom - this.position.bottom) / lineHeight;

		if (nLines > 1) {
			// The selection may span several lines.
			// clientLeft/clientWidth don't account for inner padding.
			let padding = parseInt(getStyle(element, 'padding'), 10);
			if (!padding) {
				// Firefox.
				padding = parseInt(getStyle(element, 'paddingLeft'), 10);
			}
			const left = element.clientLeft + padding;
			const width = element.clientWidth - 2 * padding;

			this.endPosition = {
				// This is the last line, running from
				top: endPoint.top, //  far left to the end of the
				left, //   selection.
				width: endPoint.right - left,
			};

			// If the selection spans more than two lines, we need to
			//  highlight the intermediate lines at full width.
			for (let i = 0; i < Math.max(0, nLines - 2); i++) {
				this.midLines.push({
					top: this.position.top + (i + 1) * lineHeight,
					left,
					width,
					height: lineHeight - 1,
				});
			}
		} else {
			this.endPosition = {};
		}
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
pre {
	white-space: pre-wrap;
	word-wrap: break-word;
	background-color: #f5f5f5;
	border: 1px solid#ccc;
	border-radius: 4px;
	display: block;
}
#test {
	float: left;
}
#text-content {
	padding: 3%;
}
</style>