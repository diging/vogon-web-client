<template lang="pug">
	v-navigation-drawer(v-model="show" absolute right width="12%")
		template(v-slot:prepend)
					v-btn-toggle(v-model="listToggle" outlined)
						v-btn(x-small) Relations
						v-btn(x-small) Date
						v-btn(x-small) Appellations
		AppellationList(:appellations="appellations" v-if="listToggle == 2")
		

</template>

<script lang="ts">
import AppellationList from '@/components/annotator/AppellationList.vue';
import { VForm } from '@/interfaces/GlobalTypes';
import { Component, Prop, Vue } from 'vue-property-decorator';
@Component({
  name: 'ListsSideDrawer',
  components: {
	  AppellationList: AppellationList,
  },
})
export default class ListsSideDrawer extends Vue {

	@Prop()
	private relations!: object[];
	@Prop()
	private appellations!: object[];

	private show: Boolean = false;
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