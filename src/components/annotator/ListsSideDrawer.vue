<template lang="pug">
	v-card()
		v-tabs(v-model="tab" )
			v-tab(href="#tab-1") Annotations
			v-tab(href="#tab-2") Date Annotations
			v-tab(href="#tab-3") Relations
			v-tab(href="#tab-4") Search
		v-tabs-items(v-model="tab")
			v-tab-item(value="tab-1")
				AppellationList(:appellations="appellations")
			v-tab-item(value="tab-2")
				h1 Tab 2
			v-tab-item(value="tab-3")
				template(v-if="template")
					RelationTemplateRender(v-bind:template="template")
				template(v-else)
					h5(class="caption text-center py-5") Template currently not selected!
			v-tab-item(value="tab-4")
				h1 Tab 4



</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import AppellationList from '@/components/annotator/AppellationList.vue';
import RelationTemplateRender from '@/components/annotator/RelationTemplate.vue';
import { VForm } from '@/interfaces/GlobalTypes';
import { RelationTemplate } from '@/interfaces/RelationTypes';

@Component({
	name: 'ListsSideDrawer',
	components: {
		AppellationList,
		RelationTemplateRender,
	},
})
export default class ListsSideDrawer extends Vue {
	@Prop()
	private relations!: object[];
	@Prop()
	private appellations!: object[];

	private tab: string = 'tab-4';
	private show: boolean = false;
	private listToggle: string = '';

	private template: RelationTemplate | null = null;

	public created() {
		this.watchStore();
	}

	public watchStore() {
		this.$store.watch(
			(state, getters) => getters.getShowLists,
			(newValue, oldValue) => {
				this.show = newValue;
			},
		);
		this.$store.watch(
			(state, getters) => getters.getAnnotatorCurrentTab,
			(newValue, oldValue) => {
				this.tab = newValue;
			},
		);
		this.$store.watch(
			(state, getters) => getters.getAnnotatorTemplate,
			(newValue, oldValue) => {
				this.template = newValue;
			},
		);
	}
}
</script>

<style scoped>
</style>