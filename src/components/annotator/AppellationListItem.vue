<template lang="pug">
	div(:class="`text-left pa-2 ${focused}`" ref="listItem")
		v-row
			v-col(:cols="7" @click="focusAppellation" class="focus-icon")
				
				div(v-if="hasInterpretation()" class="subtitle-1") {{ appellation.interpretation.label }}
				div(v-if="hasDateRepresentation()" class="subtitle-1") {{ appellation.dateRepresentation}}
				div(class="subtitle-2 appellation-subtitle") Created by <strong>{{ creator }}</strong> on {{ date }}
				
			v-col(:cols="5" class="text-right")
				v-btn(v-if="edit" color="error" class="mr-2" small dense @click="editAppellation") Cancel
				v-btn(v-if="!appellation.submitted" @click="editAppellation" small icon class="d-inline-block mr-1")
					v-icon(left :color="edit ? `green` : `default`") mdi-pencil
				v-btn(@click="toggleVisibility" small icon class="d-inline-block mr-1" :disabled="$store.getters.getAnnotatorHideAppellation")
					v-icon(v-if="visible" left) mdi-eye
					v-icon(v-else left) mdi-eye-off	
				v-btn(@click="showDeleteAppellation = true;" small icon class="d-inline-block mr-1" :disabled="!deletable")
					v-icon mdi-delete

		div(v-if="edit") 
			| (You are currently editing this appellation ...)
			br
			//- <template v-if="hasInterpretation()">
			//- v-alert(dense type="error" class="my-4" v-if="hasInterpretation() && appellation.relationsFrom.length || appellation.relationsTo.length")
			//- 	| This appellation is part of existing relation(s) !!
			//- </template>
		v-dialog(v-model="showDeleteAppellation" max-width="400")
			v-card
				v-card-title(class="headline") Delete Appellation
				v-card-text(class="text-left")
					strong Are you sure you want to delete the appellation?
				v-card-actions
					v-spacer
					v-btn(text color="darken-1" @click="showDeleteAppellation = false") Cancel
					v-btn(text color="red darken-1" @click="deleteAppellation" :disabled="deletingAppellation" :loading="deletingAppellation") Delete

		v-snackbar(v-model="snackbar" top :color="snackbarColor" :timeout="3000") {{ snackbarMsg }}
</template>

<script lang="ts">
import { AxiosError, AxiosResponse } from 'axios';
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
	private showDeleteAppellation: boolean = false;
	private deletingAppellation: boolean = false;

	private snackbar: boolean = false;
	private snackbarColor: string = 'success';
	private snackbarMsg: string = '';
	private deleteUrl: string = '';

	get creator() {
		return getCreatorName(this.appellation.createdBy);
	}

	get date() {
		return getFormattedDate(this.appellation.created);
	}

	private hasDateRepresentation() {
		return 'dateRepresentation' in this.appellation;
	}

	private hasInterpretation() {
		return 'interpretation' in this.appellation;
	}

	get deletable() {
		if ('interpretation' in this.appellation) {
			return (
				this.appellation.relationsFrom.length === 0 &&
				this.appellation.relationsTo.length === 0
			);
		}
		else {
			return true;
		}
	}

	public created() {
		this.watchStore();
	}

	private watchStore() {
		this.$store.watch(
			(state, getters) => getters.getAnnotatorFocusedAppellation,
			(newValue, oldValue) => {
				console.log("herrrrrrrrrrrrrrrrrr");
				console.log(this.appellation);
				if (newValue === this.appellation.index) {
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
			let focusedAppellation = this.appellation.index;
			if (currentFocusedAppellation > 0 && currentFocusedAppellation === focusedAppellation) {
				focusedAppellation = 0;
			}
			this.$store.commit('setAnnotatorFocusedAppellation', focusedAppellation);
		}
	}

	private toggleVisibility() {
		if (this.visible) {
			this.$store.commit('setAnnotatorHideAppellation', this.appellation.index);
		} else {
			this.$store.commit('setAnnotatorShowAppellation', this.appellation.index);
		}
		this.visible = !this.visible;
	}

	private editAppellation() {
		if (!this.focused) {
			this.focusAppellation();
			this.edit = true;
			console.log("in editing the application");
			console.log(this.appellation);
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

	private deleteAppellation() {
		if ('interpretation' in this.appellation) {
			this.deleteUrl = `/appellation/${this.appellation.id}`;
		}
		else if ('dateRepresentation' in this.appellation) {
			this.deleteUrl = `/dateappellation/${this.appellation.id}`;
		}
		Vue.$axios.delete(this.deleteUrl)
			.then((response: AxiosResponse) => {
				this.snackbar = true;
				this.snackbarColor = 'success';
				this.snackbarMsg = 'Successfully deleted appellation!';
				this.$store.commit('setAppellationDeleted', true);
			})
			.catch((error: AxiosError) => {
				if (error.response && error.response.data && error.response.data.message) {
					this.snackbarMsg = error.response.data.message;
				} else {
					this.snackbarMsg = `Error while deleting appellation: ${error.message}`;
				}
				this.snackbar = true;
				this.snackbarColor = 'error';
			})
			.finally(() => {
				this.deletingAppellation = false;
				this.showDeleteAppellation = false;
			});
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