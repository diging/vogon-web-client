<template lang="pug">
	div(v-if="visible" @mouseover="tooltip = true" @mouseleave="tooltip = false")
		div(:style="{ ...appellation.positionStyle, zIndex: 5, width: 'auto', height: 30 }" class="appellation-tooltip" v-if="tooltip")
			| {{ appellation.interpretation.label }}
		li(
			:style="appellation.positionStyle"
			v-bind:class=`{
				'appellation': appellation.interpretation != null,
				'date-appellation': appellation.dateRepresentation != null,
				'appellation-selected': appellation.selected,
				'appellation-focused': focused
			}`
			@click="onApellationClick()"
		)

		li(v-if="manyLinesAreSelected()"
			v-for="line in appellation.midLines"
			v-bind:class=`{
				'appellation': appellation.interpretation != null,
				'date-appellation': appellation.dateRepresentation != null,
				'appellation-selected': appellation.selected,
				'appellation-focused': focused
			}`
			v-bind:style=`{
				height: line.height + 'px',
				top: line.top + 'px',
				left: line.left + 'px',
				position: 'absolute',
				width: line.width + 'px',
				'z-index': 2
			}`
			@click="onApellationClick()"
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
				'appellation-selected': appellation.selected,
				'appellation-focused': focused
			}`
			@click="onApellationClick()"
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
	private focused: boolean = false;
	private visible: boolean = true;

	public created() {
		this.watchStore();
	}

	private watchStore() {
		this.$store.watch(
			(state, getters) => getters.getAnnotatorFocusedAppellation,
			(newValue, oldValue) => {
				if (newValue === this.appellation.id) {
					this.focused = true;
				} else {
					this.focused = false;
				}
			},
		);
		this.$store.watch(
			(state, getters) => getters.getAnnotatorHideAppellation,
			(newValue, oldValue) => {
				this.visible = !newValue;
			},
		);
		this.$store.subscribe((mutation, state) => {
			if (mutation.type === 'setAnnotatorShowAppellation' && mutation.payload === this.appellation.id) {
				this.visible = true;
			} else if (mutation.type === 'setAnnotatorHideAppellation' && mutation.payload === this.appellation.id) {
				this.visible = false;
			} else if (mutation.type === 'setAnnotatorUpdatedAppellation' && mutation.payload === this.appellation.id) {
				this.visible = true;
			} else if (mutation.type === 'setFocusedAppellationsForRelations') {
				if (mutation.payload[this.appellation.id]) {
					this.focused = true;
				} else {
					this.focused = false;
				}
			}
		});
		this.$store.watch(
			(state, getters) => getters.getAnnotatorEditAppellationMode,
			(newValue, oldValue) => {
				if (newValue && newValue.id === this.appellation.id) {
					this.visible = false;
				} else if (newValue === null) {
					this.focused = false;
					this.visible = true;
				} else {
					this.visible = true;
				}
			},
		);
	}

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

		this.$store.commit('setFocusedRelationId', null);

		const currentFieldIndex = this.$store.getters.getCurrentFieldIndex;
		if (currentFieldIndex >= 0) {
			this.$store.commit('setSelectedFieldAnnotationsAt', {
				pos: currentFieldIndex,
				annotation: this.$store.getters.getAnnotatorAppellations[this.index],
			});

			// Reset
			this.$store.commit('setCurrentFieldIndex', -1);
			this.$store.commit('setCurrentFieldType', null);
		} else {
			this.$store.commit('setAnnotatorCurrentTab', 'tab-1');
			const currentFocusedAppellation = this.$store.getters.getAnnotatorFocusedAppellation;
			let focusedAppellation = this.appellation.id;
			if (currentFocusedAppellation > 0 && currentFocusedAppellation === focusedAppellation) {
				focusedAppellation = 0;
			}
			this.$store.commit('setAnnotatorFocusedAppellation', focusedAppellation);
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
.appellation.appellation-focused {
    border: 2px solid #d68a00;
    background-color: orange;
    opacity: 0.6;
}
.appellation {
    border: 1px solid black;
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