<template lang="pug">
	div(:class="`text-left pa-2 ${focused}`")
		v-row
			v-col(:cols="9")
				div(class="subtitle-1") {{ appellation.interpretation.label }}
				div(class="subtitle-2 appellation-subtitle") Created by <strong>{{ getCreatorName(appellation.createdBy) }}</strong> on {{ getFormattedDate(appellation.created) }}
			v-col(:cols="3" class="text-right")
				v-btn(v-if="!appellation.submitted" small icon class="d-inline-block mr-1")
					v-icon(left) mdi-pencil
				v-btn(@click="focusAppellation" small icon class="d-inline-block mr-1")
					v-icon(left) mdi-hand-right
				v-btn(@click="toggleVisibility" small icon class="d-inline-block mr-1" :disabled="$store.getters.getAnnotatorHideAppellation")
					v-icon(v-if="visible" left) mdi-eye
					v-icon(v-else left) mdi-eye-off
</template>

<script lang="ts">
import JwtDecode from 'jwt-decode';
import moment from 'moment';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

import { TokenDto } from '@/interfaces/GlobalTypes';

@Component({
	name: 'AppellationListItem',
})
export default class AppellationListItem extends Vue {
	@Prop() private appellation!: any;
	private focused: string = '';
	private visible: boolean = true;

	public created() {
		this.watchStore();
	}

	private watchStore() {
		this.$store.watch(
			(state, getters) => getters.getAnnotatorFocusedAppellation,
			(newValue, oldValue) => {
				if (newValue === this.appellation.id) {
					this.focused = 'focused';
				} else {
					this.focused = '';
				}
			},
		);
	}

	private getCreatorName(creator: any) {
		const decoded = JwtDecode<TokenDto>(localStorage.getItem('token') || '');
		if (creator.id === decoded.user_id) {
			return 'you';
		} else {
			return creator.username;
		}
	}

	private getFormattedDate(isodate: string) {
		return moment(isodate).format('dddd LL [at] LT');
	}

	private focusAppellation() {
		const currentFocusedAppellation = this.$store.getters.getAnnotatorFocusedAppellation;
		let focusedAppellation = this.appellation.id;
		if (currentFocusedAppellation > 0 && currentFocusedAppellation === focusedAppellation) {
			focusedAppellation = 0;
		}
		this.$store.commit('setAnnotatorFocusedAppellation', focusedAppellation);
	}

	private toggleVisibility() {
		if (this.visible) {
			this.$store.commit('setAnnotatorHideAppellation', this.appellation.id);
		} else {
			this.$store.commit('setAnnotatorShowAppellation', this.appellation.id);
		}
		this.visible = !this.visible;
	}

	// public mounted() {
	// 	this.watchUncheckStore();
	// 	this.watchCheckStore();
	// 	this.$root.$on('appellationClicked', (data: any) => {
	// 		if (data === this.appellation) {
	// 			this.checked = !this.checked;
	// 		}
	// 	});
	// }

	// @Watch('checked')
	// public checkedChanged() {
	// 	if (this.checked === false) {
	// 		this.$store.commit('removeAppellation', this.index);
	// 		this.$store.commit('setSelectFalse');
	// 	} else {
	// 		if (this.$store.getters.getValidator === 3) {
	// 			this.$store.commit('setValidator', 0);
	// 		}
	// 		this.$store.commit('addAppellation', this.appellation);
	// 		this.$store.commit('setDeselectFalse');
	// 	}
	// }

	// private watchUncheckStore() {
	// 	this.$store.watch(
	// 		(state) => {
	// 			return this.$store.getters.getDeselect;
	// 		},
	// 		(val) => {
	// 			if (val) {
	// 				this.uncheckAll();
	// 				this.canCheckAll = true;
	// 			}
	// 		},
	// 	);
	// }

	// private watchCheckStore() {
	// 	this.$store.watch(
	// 		(state) => {
	// 			return this.$store.getters.getSelect;
	// 		},
	// 		(val) => {
	// 			if (val) {
	// 				this.checkAll();
	// 			}
	// 		},
	// 	);
	// }

	// private uncheckAll() {
	// 	this.checked = false;
	// }

	// private checkAll() {
	// 	this.checked = true;
	// }

	// private hide() {
	// 	// TODO: Get rid of emit
	// 	this.$store.commit('hideappellation', this.appellation);
	// }

	// private show() {
	// 	// TODO: Get rid of emit
	// 	this.$store.commit('showappellation', this.appellation);
	// }

	// private toggle() {
	// 	if (this.appellation.visible) {
	// 		this.hide();
	// 	} else {
	// 		this.show();
	// 	}
	// }

	// private isSelected() {
	// 	return this.appellation.selected;
	// }

	// private select() {
	// 	// TODO: Get rid of emit
	// 	this.$store.commit('selectappellation', this.appellation);
	// }

	// private label() {
	// 	if (this.appellation.interpretation) {
	// 		return this.appellation.interpretation.label;
	// 	} else if (this.appellation.dateRepresentation) {
	// 		return this.appellation.dateRepresentation;
	// 	}
	// }

	// private getCreatorName(creator: any) {
	// 	const decoded = JwtDecode<TokenDto>(localStorage.getItem('token') || '');
	// 	if (creator.id === decoded.user_id) {
	// 		return 'you';
	// 	} else {
	// 		return creator.username;
	// 	}
	// }

	// private getFormattedDate(isodate: string) {
	// 	return moment(isodate).format('dddd LL [at] LT');
	// }
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