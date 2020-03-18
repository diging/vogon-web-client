<template lang="pug">
	ul(v-if="appellations.length")
		appellation-display-item(
			v-for="(appellation, i) in appellations"
			:appellation="appellation"
			:index="i"
		)
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

import store from '@/store';
import AppellationDisplayItem from './AppellationDisplayItem.vue';

@Component({
	name: 'AppellationDisplay',
	components: {
		'appellation-display-item': AppellationDisplayItem,
	},
})
export default class AppellationDisplay extends Vue {
	private appellations: any[] = [];

	public async created() {
		this.watchStore();
	}

	private watchStore() {
		store.subscribe((mutation: any, state: any) => {
			if (mutation.type === 'setTextContentStyle' && state.text_content_styles.positions) {
				this.appellations = state.text_content_styles.positions.map((position: any, i: number) => {
					const positionStyle = {
						top: `${position.top}px`,
						left: `${position.left}px`,
						width: `${position.width}px`,
						height: `${position.lineHeight}px`,
						position: 'absolute',
						zIndex: 2,
					};
					const midLines = position.midLines;
					const endPosition = position.endPosition;

					return {
						...position,
						positionStyle,
						midLines,
						endPosition,
						visible: true,
					};
				});

				this.$forceUpdate();
			} else if (mutation.type === 'setAnnotatorHighlightedText' && mutation.payload === null) {
				this.appellations.pop();
			}
		});
	}
}
</script>

<style scoped>
</style>