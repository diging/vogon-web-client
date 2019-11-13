<template lang="pug">
	<div>
		div.text-selection(v-if="textIsSelected()" v-bind:style="{height: line_height,top: position.top,left: position.left,position: 'absolute', width: position.width,'z-index': 2}")
		div.text-selection(v-if="manyLinesAreSelected()" v-for="line in mid_lines" v-bind:style="{height: line.height, top: line.top, left: line.left, position: 'absolute', width: line.width, 'z-index': 2}")
		div.text-selection(v-if="multipleLinesAreSelected()" v-bind:style="{ height: line_height, top: end_position.top, left: end_position.left, position: 'absolute', width: end_position.width, 'z-index': 2}")>
</template>

<script lang="ts">
import { VForm } from '@/interfaces/GlobalTypes';
import { Component, Prop, Vue } from 'vue-property-decorator';
@Component({
  name: 'TextSelectionDisplay',
})
export default class TextSelectionDisplay extends Vue {
	@Prop()
	private selected: object;
	@Prop()
	private content: string;
	private position: object = {};
	private mid_lines: any[];
	private end_position: object = {};
	private line_height: int = 0;

	@Watch('selected')
	public selected() { this.updatePosition(); }

	public textIsSelected() { return this.selected.startOffset != null; }
	public multipleLinesAreSelected() { return this.end_position.top !== undefined; }
	public manyLinesAreSelected() { return this.mid_lines.length > 0; }
	public updatePosition() {
		this.mid_lines = [];
		this.position = getTextPosition(this.selected);
		const endPoint = getPointPosition(this.selected.endOffset);
		const lineHeight = parseInt(getStyle('text-content', 'line-height'));

		this.line_height = lineHeight - 1;  // So that they don't stack.
		const nLines = 1 + (endPoint.bottom - this.position.bottom) / lineHeight;

		if (nLines > 1) {    // The selection may span several lines.
			// clientLeft/clientWidth don't account for inner padding.
			let _padding = parseInt(getStyle('text-content', 'padding'));
			if (!_padding) {    // Firefox.
				_padding = parseInt(getStyle('text-content', 'paddingLeft'));
			}
			const _left = parseInt(document.getElementById('text-content').clientLeft);
			const _width = parseInt(document.getElementById('text-content').clientWidth);
			const left = _left + _padding;
			const width = _width - (2 * _padding);

			this.end_position = {    // This is the last line, running from
				top: endPoint.top,   //  far left to the end of the
				left,          //   selection.
				width: endPoint.right - left,
			};

			// If the selection spans more than two lines, we need to
			//  highlight the intermediate lines at full width.
			for (i = 0; i < Math.max(0, nLines - 2); i++) {
				this.mid_lines.push({
					top: this.position.top + (i + 1) * lineHeight,
					left,
					width,
					height: lineHeight - 1,
				});
			}
		} else {
			this.end_position = {};
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
	background-color:#f5f5f5;
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