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
				h1 Tab 3
			v-tab-item(value="tab-4")
				h1 Tab 4



</template>

<script lang="ts">
import AppellationList from '@/components/annotator/AppellationList.vue';
import { VForm } from '@/interfaces/GlobalTypes';
import { Component, Prop, Vue } from 'vue-property-decorator';
@Component({
  name: 'ListsSideDrawer',
  components: {
	AppellationList,
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

  public created() {
	this.watchStore();
  }

  public watchStore() {
	this.$store.watch(
		(state) => {
		return this.$store.getters.getShowLists;
		},
		(newValue, oldValue) => {
		// something changed do something
		this.show = newValue;
		},
	);
  }
}
</script>

<style scoped>
</style>