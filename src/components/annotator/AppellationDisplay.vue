<template lang="pug">
	ul(v-if="appellations.length")
		appellation-display-item(
			v-for="(appellation, i) in appellations"
			:appellation="appellation"
			:pos="i"
		)
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

import { VForm } from '@/interfaces/GlobalTypes';
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


	private selectAppellation(appellation: any) {
		// TODO: Get rid of emit
		this.$root.$emit('appellationClicked', appellation);
		this.$emit('selectappellation', appellation);
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