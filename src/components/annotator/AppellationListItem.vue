<template lang="pug">
	div(:class="`text-left pa-2 ${focused}`" ref="listItem")
		v-row
			v-col(:cols="7" @click="focusAppellation" class="focus-icon")
				div(class="subtitle-1") {{ appellation.interpretation.label }}
				div(class="subtitle-2 appellation-subtitle") Created by <strong>{{ creator }}</strong> on {{ date }}
				
			v-col(:cols="5" class="text-right")
				v-btn(v-if="edit" color="error" class="mr-2" small dense @click="editAppellation") Cancel
				v-btn(v-if="!appellation.submitted" @click="editAppellation" small icon class="d-inline-block mr-1")
					v-icon(left :color="edit ? `green` : `default`") mdi-pencil
				v-btn(@click="toggleVisibility" small icon class="d-inline-block mr-1" :disabled="$store.getters.getAnnotatorHideAppellation")
					v-icon(v-if="visible" left) mdi-eye
					v-icon(v-else left) mdi-eye-off

		div(v-if="edit") 
			| (You are currently editing this appellation ...)
			br
			v-alert(dense type="error" class="my-4" v-if="appellation.relationsFrom.length || appellation.relationsTo.length")
				| This appellation is part of existing relation(s) !!
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import VueScrollTo from 'vue-scrollto';

import { getCreatorName, getFormattedDate } from '@/utils/annotations';

@Component({
	name: 'AppellationListItem',
})
export default class AppellationListItem extends Vue {
	@Prop() private appellation!: any;
	private focused: string = '';
	private visible: boolean = true;
	private edit: boolean = false;

	get creator() {
		return getCreatorName(this.appellation.createdBy);
	}

	get date() {
		return getFormattedDate(this.appellation.created);
	}

	public created() {
		this.watchStore();
	}

	private watchStore() {
		this.$store.watch(
			(state, getters) => getters.getAnnotatorFocusedAppellation,
			(newValue, oldValue) => {
				if (newValue === this.appellation.id) {
					this.focused = 'focused';
					VueScrollTo.scrollTo(this.$refs[`listItem`] as Element, {
						container: '#appellation-list',
					});
				} else {
					this.focused = '';
					this.edit = false;
				}
			},
		);
	}

	private focusAppellation() {
		if (!this.edit) {
			const currentFocusedAppellation = this.$store.getters.getAnnotatorFocusedAppellation;
			let focusedAppellation = this.appellation.id;
			if (currentFocusedAppellation > 0 && currentFocusedAppellation === focusedAppellation) {
				focusedAppellation = 0;
			}
			this.$store.commit('setAnnotatorFocusedAppellation', focusedAppellation);
		}
	}

	private toggleVisibility() {
		if (this.visible) {
			this.$store.commit('setAnnotatorHideAppellation', this.appellation.id);
		} else {
			this.$store.commit('setAnnotatorShowAppellation', this.appellation.id);
		}
		this.visible = !this.visible;
	}

	private editAppellation() {
		if (!this.focused) {
			this.focusAppellation();
			this.edit = true;
			this.$store.commit('setAnnotatorEditAppellationMode', this.appellation);
		} else {
			if (!this.edit) {
				this.edit = true;
				this.$store.commit('setAnnotatorEditAppellationMode', this.appellation);
			} else {
				this.edit = false;
				this.$store.commit('setAnnotatorEditAppellationMode', null);
			}
		}
	}
}
</script>

<style scoped>
.appellation-subtitle {
	color: #8a6d3b;
}
.focus-icon {
	cursor: pointer;
}
.focused {
	background: rgba(255, 165, 0, 0.5);
}
</style>