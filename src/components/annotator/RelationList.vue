<template lang="pug">
v-list(three-line dense class="relationset-list")
	template(v-for="(relationset, i) in relationList")
		RelationListItem(:key="relationset.id" :relationset="relationset" :relation="relations[i]")
		v-divider(v-if="i + 1 < relationList.length")
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

import RelationListItem from '@/components/annotator/RelationListItem.vue'
import { createDecorator } from 'vue-class-component'

@Component({
	name: 'RelationList',
	components: {
		RelationListItem,
	},
})
export default class RelationList extends Vue {
	@Prop() private relationsets!: any[]
	@Prop() private relations!: any[]
	private relationList: any[] = this.relationsets

	public created() {
		this.watchStore()
	}

	private watchStore() {
		this.$store.watch(
			(state, getters) => getters.getAnnotatorFocusedAppellation,
			(newValue, oldValue) => {
				this.relationList = this.relationsets
				var filterId = 0
				var appellationId = this.$store.getters.getAnnotatorFocusedAppellation
					.filter((relation: any) => {
						relation.appellations.forEach((app: any) => {
							if (app.id === appellationId) {
								filterId = relation.id
							}
						})
						return relation.id === filterId
					})
			}
		)
	}
}

</script>

<style scoped>
.relationset-list {
	max-height: 600px;
	overflow-y: auto;
	margin-top: 16px;
	margin-bottom: 16px;
	padding: 10px;
}
</style>
