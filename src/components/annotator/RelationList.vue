<template lang="pug">
	v-list(three-line)
		template(v-for="(relation, index) in relations")
			v-list-item(:key="relation.id")
				v-list-item-content
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import RelationListItem from '@/components/annotator/RelationListItem.vue';

@Component({
	name: 'RelationList',
	components: {
		'relation-list-item': RelationListItem,
	},
})
export default class RelationList extends Vue {
	@Prop()
	private relations: any[] = [];

	// FIXME: Change this emit to use the store
	private selectRelation(relation: any) {
		this.$store.commit('selectrelation', relation);
	}
}
</script>