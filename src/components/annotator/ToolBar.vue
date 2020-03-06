<template lang="pug">
	v-app-bar
		v-app-bar-nav-icon(@click="showSideBar")
		v-spacer
		v-toolbar-title.text-capitalize {{ text.title }}
		v-spacer
		v-btn(class="mx-2" small color="primary" v-if="!submitted && relationsets && relationsets.length > 0" @click="submitRelationsDialog = true")
			v-icon(left small) mdi-sync
			| Submit relations
		v-app-bar-nav-icon(@click="showLists")

		v-dialog(v-model="submitRelationsDialog" max-width="700")
			v-card
				v-card-title(class="headline") Submit to Quadriga?
				v-card-text(class="text-left")
					strong The following relations will be submitted to "Quadriga":
					AnnotationList(v-bind:annotations="relationsets")
				v-card-actions
					v-spacer
					v-btn(text color="red darken-1" @click="submitRelationsDialog = false") Cancel
					v-btn(text color="green darken-1" @click="submitRelations" :disabled="submitting" :loading="submitting") Submit

		v-snackbar(v-model="snackbar" top :color="color" :timeout="3000") {{ msg }}
</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import { Component, Prop, Vue } from 'vue-property-decorator';

import AnnotationList from '@/components/relations/AnnotationList.vue';
import { RelationSet } from '@/interfaces/RelationTypes';

@Component({
	name: 'ToolBar',
	components: {
		AnnotationList,
	},
})
export default class ToolBar extends Vue {
	@Prop() private text!: object;
	@Prop() private relationsets!: RelationSet[];

	private loading: boolean = false;

	private submitted: boolean = false;
	private submitting: boolean = false;
	private submitRelationsDialog: boolean = false;
	private snackbar: boolean = false;
	private msg: string = '';
	private color: string = '';

	private showSideBar() {
		this.$store.commit('toggleSideBarMutation');
	}

	private showLists() {
		this.$store.commit('toggleLists');
	}

	private submitRelations() {
		this.submitting = true;
		let relationsets: RelationSet[] = [];
		if (this.relationsets && this.relationsets.length > 0) {
			relationsets = this.relationsets;
		}
		Vue.$axios.post('/relationset/submit_for_quadriga', {
			relationset_ids: relationsets.map((item: RelationSet) => item.id),
		}).then((response: AxiosResponse) => {
			this.submitted = true;
			this.snackbar = true;
			this.color = 'success';
			this.msg = 'Successfully submitted relations to Quadriga!';
		}).catch(() => {
			this.snackbar = true;
			this.color = 'error';
			this.msg = 'Error while submitting relations to Quadriga!!';
		}).finally(() => this.submitRelationsDialog = false);
	}
}
</script>

<style scoped>
.project-item {
	padding: 0;
	margin: 10px 0;
}
#title {
	background: grey;
}
pre {
	white-space: pre-wrap;
	word-wrap: break-word;
	background-color: #f5f5f5;
	border: 1px solid#ccc;
	border-radius: 4px;
	display: block;
}
#test {
	float: left;
}
#text-content {
	padding: 3%;
}
.template-list {
	text-align: left;
}
</style>