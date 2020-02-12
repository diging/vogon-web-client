<template lang="pug">
	li(v-bind:class=`{
			'list-group-item': true,
			'relation-list-item': true,
			'relation-selected': isSelected()
		}`)
		span(class="pull-right text-muted btn-group")
			a(class="btn btn-xs" v-on:click="select")
				span(class="glyphicon glyphicon-hand-down")
		div {{ getRepresentation(relation) }}
		div.text-warning Created by #[strong {{ getCreatorName(relation.createdBy) }}] on {{ getFormattedDate(relation.created) }}
</template>

<script lang="ts">
import moment from 'moment';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
	name: 'RelationListItem',
})
export default class RelationListItem extends Vue {
	@Prop()
	private relation!: any;

	public select() {
		// TODO: Remove this
		this.$store.commit('selectrelation', this.relation);
	}

	public isSelected() {
		return this.relation.selected;
	}

	public getRepresentation(relation: any) {
		if (relation.representation) {
			return relation.representation;
		} else {
			return relation.appellations.map((appellation: any) => {
				return appellation.interpretation.label;
			}).join('; ');
		}
	}

	public getCreatorName(creator: any) {
		// TODO: This needs to be change to user id
		if (creator.id === 'USER_ID') {
			return 'you';
		} else {
			return creator.username;
		}
	}

	public getFormattedDate(isodate: string) {
		return moment(isodate).format('dddd LL [at] LT');
	}
}
</script>

<style scoped>
</style>