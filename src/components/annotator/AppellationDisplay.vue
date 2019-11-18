<template lang="pug">
	ul
		appellation-display-item(
			v-on:selectappellation="selectAppellation"
			:appellation="appellation"
			v-for="appellation in appellations")

</template>

<script lang="ts">
import { VForm } from '@/interfaces/GlobalTypes';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import AppellationDisplayItem from './AppellationDisplayItem.vue';
@Component({
  name: 'AppellationDisplay',
  components: {
		'appellation-display-item': AppellationDisplayItem
	},
})
export default class AppellationDisplay extends Vue {

	@Prop()
	private appellations: Array;

	@Watch('appellations')
	appellationsChange(value) {
		// Replace an array prop wholesale doesn't seem to trigger a
		//  DOM update in the v-for binding, but a push() does; so we'll
		//  just push the appellations that aren't already in the array.
		var current_ids = this.current_appellations.map(function (elem) {
			return elem.id;
		});
		var self = this;
		this.appellations.forEach(function (elem) {
			if (current_ids.indexOf(elem.id) < 0) {
				self.current_appellations.push(elem);
			}
		});
	}


	private selectAppellation(appellation) {
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