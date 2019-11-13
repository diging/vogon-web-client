<template lang="pug">
	div(v-if="appellation.visible")
		li(v-tooltip="getLabel()"
			v-if="appellation.visible"
			v-on:click="selectAppellation"
			v-bind:style="{
				top: position.top,
				left: position.left,
				position: 'absolute',
				width: position.width,
				height: line_height,
				'z-index': 2
			}"
			v-bind:class="{
				'appellation': appellation.interpretation != null,
				'date-appellation': appellation.dateRepresentation != null,
				'appellation-selected': appellation.selected
			}")
		li(v-if="manyLinesAreSelected()"
			v-on:click="selectAppellation"
			v-for="line in mid_lines"
			v-tooltip="getLabel()"
			v-bind:class="{
				'appellation': appellation.interpretation != null,
				'date-appellation': appellation.dateRepresentation != null,
				'appellation-selected': appellation.selected
			}"
			v-bind:style="{
			height: line.height,
			top: line.top,
			left: line.left,
			position: 'absolute',
			width: line.width,
			'z-index': 2
			}")
		li(v-if="multipleLinesAreSelected()"
			v-tooltip="getLabel()"
			v-on:click="selectAppellation"
			v-bind:style="{
					height: line_height,
					top: end_position.top,
					left: end_position.left,
					position: 'absolute',
					width: end_position.width,
					'z-index': 2
				}"
				v-bind:class="{
					'appellation': appellation.interpretation != null,
					'date-appellation': appellation.dateRepresentation != null,
					'appellation-selected': appellation.selected
				}")

</template>

<script lang="ts">
import { VForm } from '@/interfaces/GlobalTypes';
import { Component, Vue } from 'vue-property-decorator';
@Component({
  name: 'AppellationDisplayItem',
})
export default class AppellationDisplayItem extends Vue {

	private content: string = '';
	private project: object | null = null;
	private text: object | null = null;

	private position: object = {
				top: 0,
				left: 0,
				width: 0,
				right: 0,
				bottom: 0,
			};,
	private line_height: int = 0;
	private mid_lines: object[] = [];,
	private end_position: object = {};

	public mounted() {
		this.updatePosition();
		window.addEventListener('resize', this.updatePosition);
	}

	public created() {
		console.log('Runs');
		this.getContent();

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
		return this.end_position.top !== undefined;
	}
	private manyLinesAreSelected() {
		return this.mid_lines.length > 0;
	}

	private selectAppellation() {
		this.$emit('selectappellation', this.appellation);
	}

	private updatePosition() {
		this.mid_lines = [];
		const lineHeight = parseInt(getStyle('text-content', 'line-height'));
		this.position = getTextPosition(this.appellation.position);
		this.line_height = lineHeight - 1;
		const endPoint = getPointPosition(this.appellation.position.endOffset);
		const nLines = 1 + (endPoint.bottom - this.position.bottom) / lineHeight;
		if (nLines > 1) { // The selection may span several lines.
			// clientLeft/clientWidth don't account for inner padding.
			let _padding = parseInt(getStyle('text-content', 'padding'));
			if (!_padding) { // Firefox.
				_padding = parseInt(getStyle('text-content', 'paddingLeft'));
			}
			const _left = parseInt(document.getElementById('text-content').clientLeft);
			const _width = parseInt(document.getElementById('text-content').clientWidth);
			const left = _left + _padding;
			const width = _width - (2 * _padding);

			this.end_position = { // This is the last line, running from
				top: endPoint.top, //  far left to the end of the
				left, //   selection.
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

	private getContent() {
		Vue.$axios.get('/annotate/37/?project_id=1').then((result) => {

			console.log(result.data.content);
			this.content = result.data.content;
			this.project = result.data.project;
			this.text = result.data.text;

		})
		.catch((error) => {
			// TODO: deal with errors
			this.error = true;
		});
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