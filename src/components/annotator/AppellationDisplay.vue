<template lang="pug">
	ul(v-if="appellations.length")
		appellation-display-item(
			v-for="appellation in currentAppellations"
			:appellation="appellation"
		)
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

import { VForm } from '@/interfaces/GlobalTypes';
import store from '@/store';
import AppellationDisplayItem from './AppellationDisplayItem.vue';

@Component({
	name: 'AppellationDisplay',
	components: {
		'appellation-display-item': AppellationDisplayItem,
	},
})
export default class AppellationDisplay extends Vue {
	@Prop() private appellations!: any[];

	private currentAppellations: any[] = [];

	public async created() {
		store.subscribe((mutation: any, state: any) => {
			if (mutation.type === 'setTextContentStyle' && state.text_content_styles.positions) {
				this.currentAppellations = state.text_content_styles.positions.map((position: any, i: number) => {
					const appellation = this.appellations[i];
					console.log(appellation);
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
						...appellation,
						positionStyle,
						midLines,
						endPosition,
						visible: true,
					};
				})

				this.$forceUpdate();
			}
		});
	}

	@Watch('appellations')
	public appellationsChange(value: any) {
		// Replace an array prop wholesale doesn't seem to trigger a
		//  DOM update in the v-for binding, but a push() does; so we'll
		//  just push the appellations that aren't already in the array.
		const currentIds = this.currentAppellations.map((elem: any) => elem.id);

		this.appellations.forEach((elem) => {
			if (currentIds.indexOf(elem.id) < 0) {
				this.currentAppellations.push(elem);
			}
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