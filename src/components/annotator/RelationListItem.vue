<template lang="pug">
v-row
	v-col(:cols="7" @click="" class="focus-icon")
		div(:class="`text-left pa-2 relation-container ${focused}`" @click="focusAppellations")
			div(class="subtitle-1") {{ representation }}
			div(class="subtitle-2 relation-subtitle")
				| Created by <strong>{{ creator }}</strong> on {{ date }}
	v-col(:cols="5" class="text-right")
		v-btn(v-if="!relationset.submitted" @click="editRelation" small icon class="d-inline-block mr-1")
			v-icon mdi-pencil

</template>

<script lang="ts">
import _ from 'lodash'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { getCreatorName, getFormattedDate } from '@/utils/annotations'

@Component({
	name: 'RelationListItem',
})
export default class RelationListItem extends Vue {
	@Prop() private relationset!: any
	@Prop() private relation!: any
	private focused: string = ''
	private edit: boolean = false
	private editRelationTab: string = "tab-3"
	private relation_parts: string[] = []


	get creator() {
		return getCreatorName(this.relationset.createdBy)
	}

	get date() {
		return getFormattedDate(this.relationset.created)
	}

	get representation() {
		if (this.relationset.representation) {
			return this.relationset.representation
		} else {
			this.relation_parts = []
			for (var appellation of this.relationset.appellations) {
				if (appellation.id == this.relation.source_object_id) {
					this.relation_parts[0] = appellation.interpretation.label
				} else if (appellation.id == this.relation.predicate) {
					this.relation_parts[1] = appellation.interpretation.label
				} else if (appellation.id == this.relation.object_object_id) {
					this.relation_parts[2] = appellation.interpretation.label
				}
			}
			this.relationset.representation = this.relation_parts.join('; ')
			return this.relationset.representation
		}
	}

	private editRelation() {
		this.$store.commit('setEditRelationQuery', this.relationset.label)
		this.$store.commit('setAnnotatorCurrentTab', this.editRelationTab)
		this.$store.commit('setFocusedRelationId', this.relationset.id)
		this.$store.commit('setSelectedFieldAnnotations', this.relation_parts)
	}

	private focusAppellations() {
		this.$store.commit('setAnnotatorFocusedAppellation', 0)
		if (!this.focused) {
			const appellationIds = _.map(
				this.relationset.appellations,
				(appellation: any) => [appellation.id, true],
			);
			this.$store.commit(
				'setFocusedAppellationsForRelations',
				_.fromPairs(appellationIds),
			);
			this.$store.commit('setFocusedRelationId', this.relationset.id)
			this.focused = 'focused'
		} else {
			this.$store.commit('setFocusedAppellationsForRelations', {})
			this.$store.commit('setFocusedRelationId', null)
			this.focused = ''
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