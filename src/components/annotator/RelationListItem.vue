<template lang="pug">
v-row
	v-col(:cols="7" @click="" class="focus-icon")
		div(:class="`text-left pa-2 relation-container ${focused}`" @click="focusAppellations")
			div(class="subtitle-1") {{ representation }}
			div(class="subtitle-2 relation-subtitle")
				| Created by <strong>{{ creator }}</strong> on {{ date }}
	v-col(:cols="5" class="text-right")
		v-btn(v-if="!relation.submitted" @click="editRelation" small icon class="d-inline-block mr-1")
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
	@Prop() private relation!: any
	private focused: string = ''
	private edit: boolean = false
	private editRelationTab: string = "tab-3"

	get creator() {
		return getCreatorName(this.relation.createdBy)
	}

	get date() {
		return getFormattedDate(this.relation.created)
	}

	get representation() {
		if (this.relation.representation) {
			return this.relation.representation
		} else {
			return this.relation.appellations.map((appellation: any) => {
				return appellation.interpretation.label
			}).join('; ')
		}
	}

	private editRelation() {
		this.$store.commit('setEditRelationQuery', this.relation.label)
		this.$store.commit('setAnnotatorCurrentTab', this.editRelationTab)
		this.$store.commit('setFocusedRelationId', this.relation.id)
		this.createFieldsList()
	}

	private createFieldsList() {
		let apps = this.$store.getters.getAnnotatorAppellations
		let fields = []
		let app_iter = 0
		for (let app of apps) {
			if (app_iter < 3 && app.id == this.relation.appellations[app_iter].id) {
				fields.push(this.relation.appellations[app_iter])
				app_iter++
			}
		}
		this.$store.commit('setSelectedFieldAnnotations', fields)
	}

	private focusAppellations() {
		this.$store.commit('setAnnotatorFocusedAppellation', 0)
		if (!this.focused) {
			const appellationIds = _.map(
				this.relation.appellations,
				(appellation: any) => [appellation.id, true],
			);
			this.$store.commit(
				'setFocusedAppellationsForRelations',
				_.fromPairs(appellationIds),
			);
			this.$store.commit('setFocusedRelationId', this.relation.id)
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