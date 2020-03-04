<template lang="pug">
	v-list(three-line dense class="relationset-list")
		template(v-for="(relation, i) in relations")
			RelationListItem(:key="relation.id" :relation="relation")
			v-divider(v-if="i + 1 < relations.length")
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import RelationListItem from '@/components/annotator/RelationListItem.vue';

@Component({
	name: 'RelationList',
	components: {
		RelationListItem,
	},
})
export default class RelationList extends Vue {
	@Prop()
	private relations: any[] = [];
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