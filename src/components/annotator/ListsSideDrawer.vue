<template lang="pug">
	v-card
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
					RelationTemplateRender(v-bind:template="template" v-bind:appellations="appellations")
				template(v-else)
					h5(class="caption text-center py-5") Template currently not selected!
			v-tab-item(value="tab-4")
				AppellationCreator(
					:appellations="appellations"
					:text="$store.getters.getAnnotatorText"
				)
	
		v-snackbar(
			v-model="relationCreated"
			top
			:timeout="timeout"
		) Successfully created relation!

</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

import AppellationCreator from '@/components/annotator/AppellationCreator.vue';
import AppellationList from '@/components/annotator/AppellationList.vue';
import RelationTemplateRender from '@/components/annotator/RelationTemplate.vue';
import { RelationTemplate } from '@/interfaces/RelationTypes';

@Component({
	name: 'ListsSideDrawer',
	components: {
		AppellationCreator,
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

	private relationCreated: boolean = false;
	private timeout: number = 2000;

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
		this.$store.watch(
			(state, getters) => getters.getRelationCreated,
			(newValue, oldValue) => {
				this.relationCreated = newValue;
			},
		);
	}

	@Watch('relationCreated')
	public onRelationCreated(val: boolean, oldVal: boolean) {
		if (val !== oldVal) {
			this.$store.commit('setRelationCreated', val);
		}
	}
}
</script>

<style scoped>
</style>