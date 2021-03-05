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
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

import AppellationDisplay from '@/components/annotator/AppellationDisplay.vue';
import store from '@/store';
import {
	clearMouseTextSelection, getAnnotationRectPositions,
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

	private currentAppellations: any[] = [];
	private selectedPosition: any = null;
	private selected: boolean = false;

	public async mounted() {
		this.calculatePositions();
		window.addEventListener('resize', this.calculatePositions);
	}

	public created() {
		this.currentAppellations = this.appellations;
	}

	@Watch('appellations')
	private onAppellationChange(val: any) {
		this.currentAppellations = val;
		this.calculatePositions();
		this.selected = false;
	}

	private calculatePositions() {
		const container = this.$refs.textContent as Element;
		const positions = this.currentAppellations.map(
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
			const selection: any = window.getSelection();
			if (selection !== null) {
				const startOffset = Math.min(selection.anchorOffset, selection.focusOffset);
				const endOffset = Math.max(selection.anchorOffset, selection.focusOffset);
				const isTemplateFieldSelectMode = this.$store.getters.getCurrentFieldIndex >= 0 &&
					this.$store.getters.getCurrentFieldType === 'CO';

				if (!isTemplateFieldSelectMode) {
					this.$store.commit('setAnnotatorCurrentTab', 'tab-4');
					this.$store.commit('setAnnotatorSearchingConcept', false);
					const selectedAppellation = this.$store.getters.getAnnotatorEditAppellationMode;
					if (selectedAppellation) {
						const concept = selectedAppellation.interpretation;
						this.$store.commit('setAnnotatorSelectedConcept', concept);
					}
				}

				if (selection.anchorOffset === selection.focusOffset &&
						selection.anchorOffset === selection.baseOffset &&
						selection.anchorOffset === selection.extentOffset &&
						selection.toString() === ''
				) {
					this.$store.commit('setAnnotatorHighlightedText', null);
					this.$store.commit('setAnnotatorSelectedConcept', null);
					this.$store.commit('setAnnotatorEditAppellationMode', null);
					if (this.currentAppellations.length > 0 && this.currentAppellations[this.currentAppellations.length - 1].current) {
						this.currentAppellations = this.currentAppellations.slice(0, this.currentAppellations.length - 1);
					}
					this.calculatePositions();
					this.selected = false;
				}

				// If the user double-clicks (e.g. to select a whole word), the
				// first mouse-up will get as far as here, even though no text has
				// actually been selected.
				if (endOffset === startOffset) {
					return;
				}

				// If there was a selection already, replace the existing selection
				// with current selection
				if (this.selected) {
					this.currentAppellations = this.currentAppellations.slice(0, this.currentAppellations.length - 1);
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
					current: true,
				};
				this.selected = true;
				this.$store.commit('setAnnotatorHighlightedText', selectedText);

				// append the selected text to original list
				this.currentAppellations = [
					...this.currentAppellations,
					selectedText,
				];

				// Recalculate the highlight-box positions with new list
				this.calculatePositions();
				clearMouseTextSelection();

				// If in select mode, fill it in the template part field
				if (isTemplateFieldSelectMode) {
					this.$store.commit('setSelectedFieldAnnotationsAt', {
						pos: this.$store.getters.getCurrentFieldIndex,
						annotation: {
							data: { tokenIds: null, stringRep: raw },
							position: {
								occursIn_id: this.$store.getters.getAnnotatorMeta.occursIn,
								position_type: 'CO',
								position_value: `${startOffset},${endOffset}`,
							},
						},
					});
					this.$store.commit('setCurrentFieldIndex', -1);
					this.$store.commit('setCurrentFieldType', null);
				}
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