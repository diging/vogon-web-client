<template lang="pug">
	div(class="text-container")
		pre(
			id="text-content" 
			ref="textContent" 
			v-on:mouseup="handleMouseUp"
		) {{ content }}
		AppellationDisplay
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import AppellationDisplay from '@/components/annotator/AppellationDisplay.vue';
import store from '@/store';
import {
	clearMouseTextSelection, getAnnotationRectPositions, getPointPosition, getStyle,
	getTextPosition,
} from '@/utils/annotations';

@Component({
	name: 'TextDisplay',
	components: {
		AppellationDisplay,
	},
})
export default class TextDisplay extends Vue {
	@Prop()
	private content!: string;

	@Prop()
	private appellations!: any[];

	private selectedPosition: any = null;
	private selected: boolean = false;

	public async mounted() {
		this.calculatePositions();
		window.addEventListener('resize', this.calculatePositions);
	}

	private calculatePositions() {
		const container = this.$refs.textContent as Element;
		const positions = this.appellations.map(
			(appellation, i) => ({
				...getAnnotationRectPositions(appellation, container),
				...appellation,
			}),
		);
		store.commit('setTextContentStyle', { positions } );
	}

	private handleMouseUp(event: Event) {
		const textContent = this.$refs.textContent as HTMLElement;
		if (event.target !== null) {
			const target = event.target as HTMLElement;
			if (target.id !== textContent.id) {
				return;
			}

			event.stopPropagation();

			// Get the start and end position of the selection. The selection
			// may have been left-to-right or right-to-left.
			const selection = window.getSelection();
			if (selection !== null) {
				const startOffset = Math.min(selection.anchorOffset, selection.focusOffset);
				const endOffset = Math.max(selection.anchorOffset, selection.focusOffset);

				// If the user double-clicks (e.g. to select a whole word), the
				// first mouse-up will get as far as here, even though no text has
				// actually been selected.
				if (endOffset === startOffset) {
					return;
				}

				// If there was a selection already, replace the existing selection
				// with current selection
				if (this.selected) {
					this.appellations = this.appellations.slice(0, this.appellations.length - 1);
				}

				const raw = selection.toString();
				const selectedText = {
					position: {
						startOffset,
						endOffset,
					},
					visible: true,
					interpretation: { label: raw },
					representation: raw,
					selected: true,
				};
				this.selected = true;

				// append the selected text to original list
				this.appellations = [
					...this.appellations,
					selectedText,
				];

				// Recalculate the highlight-box positions with new list
				this.calculatePositions();
				clearMouseTextSelection();
			}
		}
	}
}
</script>

<style scoped>
.text-container {
	position: relative;
	text-align: left;
}
#text-content {
	border: 1px solid #ccc;
	padding: 10px;
	background: #fff;
}
pre {
	white-space: pre-wrap;
	word-wrap: break-word;
	font-size: 11pt;
}
</style>