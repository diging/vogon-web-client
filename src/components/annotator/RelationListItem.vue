<template lang="pug">
	div(:class="`text-left pa-2 relation-container ${focused}`" @click="focusAppellations")
		div(class="subtitle-1") {{ representation }}
		div(class="subtitle-2 relation-subtitle") 
			| Created by <strong>{{ creator }}</strong> on {{ date }}
</template>

<script lang="ts">
import _ from 'lodash';
import moment from 'moment';
import { Component, Prop, Vue } from 'vue-property-decorator';

import { getCreatorName, getFormattedDate } from '@/utils/annotations';

@Component({
	name: 'RelationListItem',
})
export default class RelationListItem extends Vue {
	@Prop() private relation!: any;
	private focused: string = '';

	public created() {
		this.watchStore();
	}

	get creator() {
		return getCreatorName(this.relation.createdBy);
	}

	get date() {
		return getFormattedDate(this.relation.created);
	}

	get representation() {
		if (this.relation.representation) {
			return this.relation.representation;
		} else {
			return this.relation.appellations.map((appellation: any) => {
				return appellation.interpretation.label;
			}).join('; ');
		}
	}

	private watchStore() {
		this.$store.subscribe((mutation, state) => {
			if (mutation.type === 'setFocusedRelationId') {
				if (mutation.payload !== this.relation.id) {
					this.focused = '';
				}
			}
		});
	}

	private focusAppellations() {
		this.$store.commit('setAnnotatorFocusedAppellation', 0);
		if (!this.focused) {
			const appellationIds = _.map(
				this.relation.appellations,
				(appellation: any) => [appellation.id, true],
			);
			this.$store.commit(
				'setFocusedAppellationsForRelations',
				_.fromPairs(appellationIds),
			);
			this.$store.commit('setFocusedRelationId', this.relation.id);
			this.focused = 'focused';
		} else {
			this.$store.commit('setFocusedAppellationsForRelations', {});
			this.$store.commit('setFocusedRelationId', null);
			this.focused = '';
		}
	}
}
</script>

<style scoped>
.relation-subtitle {
	color: #8a6d3b;
}

.relation-container {
	cursor: pointer;
}

.focused {
	background: rgba(255, 165, 0, 0.5);
}
</style>