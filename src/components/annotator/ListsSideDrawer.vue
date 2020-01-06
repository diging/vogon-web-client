<template lang="pug">
	v-card()
		

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