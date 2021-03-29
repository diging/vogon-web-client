<template lang="pug">
	div(class="tools-container")
		v-tabs(v-model="tab" show-arrows)
			v-tab(href="#tab-1") Annotations
			v-tab(href="#tab-2") Relations
			v-tab(href="#tab-3") Template
			v-tab(href="#tab-4") Search
			v-tab(href="#tab-5") Network Graph
		v-tabs-items(v-model="tab")
			v-tab-item(value="tab-1" eager)
				AppellationList(:appellations="appellations")
			v-tab-item(value="tab-2" eager)
				RelationList(:relations="relationsets")
			v-tab-item(value="tab-3" eager)
				RelationTemplateRender(v-bind:template="template" v-bind:appellations="appellations")
			v-tab-item(value="tab-4" eager)
				AppellationCreator(
					:appellations="appellations"
					:text="$store.getters.getAnnotatorText"
				)
			v-tab-item(value="tab-5")
				v-dialog(
					v-model="graphDialog"
					persistent
					max-width="1000px"
				)
					v-card
						v-card-title
							div(class="netowrk-graph-title")
								div Network graph
								v-spacer
								v-btn(icon @click="graphDialog = false")
									v-icon mdi-close
						v-card-text
							NetworkGraph(:network="network")
				div(style="display: flex;" class="px-1")
					v-spacer
					v-btn(icon @click="graphDialog = true")
						v-icon mdi-fullscreen
				NetworkGraph(v-if="network" :network="network")
	
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
import NetworkGraph from '@/components/annotator/NetworkGraph.vue';
import RelationList from '@/components/annotator/RelationList.vue';
import RelationTemplateRender from '@/components/annotator/RelationTemplate.vue';
import { RelationTemplate } from '@/interfaces/RelationTypes';

@Component({
	name: 'ListsSideDrawer',
	components: {
		AppellationCreator,
		AppellationList,
		NetworkGraph,
		RelationList,
		RelationTemplateRender,
	},
})
export default class ListsSideDrawer extends Vue {
	@Prop() private relations!: object[];
	@Prop() private appellations!: object[];
	@Prop() private relationsets!: object[];
	@Prop() private network!: object[];

	private tab: string = 'tab-4';
	private show: boolean = false;
	private listToggle: string = '';
	private graphDialog: boolean = false;

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
		this.$store.subscribe((mutation, state) => {
			if (mutation.type === 'setAnnotatorCurrentTab') {
				this.tab = mutation.payload;
			}
		});
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

  @Watch('tab')
  public changeTab() {
		if (this.tab !== this.$store.getters.getAnnotatorCurrentTab) {
		this.$store.commit('setAnnotatorCurrentTab', this.tab);
	}
  }
}
</script>

<style scoped>
.netowrk-graph-title {
	display: flex;
	width: 100%;
	text-align: left;
}
.tools-container {
	padding: 10px;
	background: #fff;
}
</style>