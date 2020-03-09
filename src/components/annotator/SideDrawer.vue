<template lang="pug">
	v-navigation-drawer(v-model="show" absolute class="side-drawer")
		v-list-item
			v-list-item-content
				v-list-item-title(class="title") 
					| Stats
					v-btn(class="float-right" small icon @click="close()")
						v-icon mdi-close

		v-divider
		v-list()
			v-list-item.text-left(two-line link)
				v-list-item-content
					v-list-item-title Project:
					v-list-item-subtitle.text-capitalize #[a(:href="`/project/${project.id}`") {{ project.name }}]
			v-list-item.text-left(two-line link)
				v-list-item-content
					v-list-item-title Added On:
					v-list-item-subtitle {{ formattedDate }}
			v-list-item.text-left(two-line link)
				v-list-item-content
					v-list-item-title Repository:
					v-list-item-subtitle #[a(:href="`/repository/${text.repository.id}`") {{ text.repository.name }}]
			v-list-item.text-left(two-line link)
				v-list-item-content
					v-list-item-title Part Of:
					v-list-item-subtitle.text-capitalize
						a(:href="`/repository/${text.repository.id}/text/${text.part_of.repository_source_id}`")
							| {{ text.part_of.title }}
			v-list-item.text-left(two-line link)
				v-list-item-content
					v-list-item-title URI:
					v-list-item-subtitle.no-wrap {{ text.uri }}
</template>

<script lang="ts">
import moment from 'moment';
import { Component, Prop, Vue } from 'vue-property-decorator';

import { Project } from '@/interfaces/ProjectTypes';
import { TextDocument } from '@/interfaces/RepositoryTypes';


@Component({
	name: 'SideDrawer',
})
export default class SideDrawer extends Vue {
	@Prop() private project!: Project;
	@Prop() private text!: TextDocument;

	private show: boolean = false;

	public created() {
		this.watchStore();
	}

	get formattedDate() {
		if (this.text && this.text.added) {
			return moment(this.text.added).format('lll');
		}
		return '';
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

	private close() {
		this.$store.commit('toggleSideBarMutation');
	}
}
</script>

<style scoped>
.no-wrap {
	white-space: normal;
}
.side-drawer {
	z-index: 3;
}
</style>