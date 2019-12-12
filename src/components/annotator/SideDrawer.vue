<template lang="pug">
	v-navigation-drawer(v-model="show" absolute)
		v-list-item
			v-list-item-content
				v-list-item-title(class="title") Stats

		v-divider
		v-list()
			v-list-item.text-left(two-line link)
				v-list-item-content
					v-list-item-title Project:
					v-list-item-subtitle.text-capitalize #[a(href="project_url") {{ project.name }}]
			v-list-item.text-left(two-line link)
				v-list-item-content
					v-list-item-title Added On:
					v-list-item-subtitle {{ formattedDate }}
			v-list-item.text-left(two-line link)
				v-list-item-content
					v-list-item-title Repository:
					v-list-item-subtitle #[a(href="repo_url") {{ text.repository.name }}]
			v-list-item.text-left(two-line link)
				v-list-item-content
					v-list-item-title Part Of:
					v-list-item-subtitle.text-capitalize #[a(href="repo_text") {{ text.part_of.title }}]
			v-list-item.text-left(two-line link)
				v-list-item-content
					v-list-item-title URI:
					v-list-item-subtitle.no-wrap {{ text.uri }}
</template>

<script lang="ts">
import { VForm } from '@/interfaces/GlobalTypes';
import { Component, Prop, Vue } from 'vue-property-decorator';
@Component({
  name: 'SideDrawer',
})
export default class SideDrawer extends Vue {

	@Prop()
	private project: object;
	@Prop()
	private text: object;
	@Prop()
	private loading: boolean = true;

	private show: Boolean = false;

	public created() {
		this.watchStore();
	}

	get formattedDate() {
		return new Date(this.text.added).toLocaleString();
	}
	public watchStore() {
		this.$store.watch(
			(state) => {
				return this.$store.getters.getShowSideBar;
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
.no-wrap {
	white-space: normal
}

</style>