<template lang="pug">
	v-list(three-line)
		template(v-for="(relation, index) in relations")
			v-list-item(:key="relation.id")
				v-list-item-content
</template>

<script lang="ts">
import { VForm } from '@/interfaces/GlobalTypes';
import { Component, Prop, Vue } from 'vue-property-decorator';
import RelationListItem from '@/components/annotator/RelationListItem.vue';
@Component({
  name: 'RelationList',
  components: {
	  'relation-list-item': RelationListItem
  }
})
export default class RelationList extends Vue {

	@Prop()
	private relations: Array<object>;

	//FIXME: Change this emit to use the store
	private selectRelation(relation) {
		this.$emit('selectrelation', relation);
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
	background-color:#f5f5f5;
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

</style>