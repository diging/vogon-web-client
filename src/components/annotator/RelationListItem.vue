<template lang="pug">
	div(class="text-left pa-2")
		div(class="subtitle-1") {{ representation }}
		div(class="subtitle-2 relation-subtitle") 
			| Created by <strong>{{ creator }}</strong> on {{ date }}
</template>

<script lang="ts">
import moment from 'moment';
import { Component, Prop, Vue } from 'vue-property-decorator';

import { getCreatorName, getFormattedDate } from '@/utils/annotations';

@Component({
	name: 'RelationListItem',
})
export default class RelationListItem extends Vue {
	@Prop()
	private relation!: any;

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
}
</script>

<style scoped>
.relation-subtitle {
	color: #8a6d3b;
}
</style>