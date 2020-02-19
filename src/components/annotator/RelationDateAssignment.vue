<template lang="pug">
	div.relation-date-bits
		relation-field(v-if="collectStarted"
			v-on:registerdata="registerData"
			v-on:unregisterdata="unregisterData"
			v-bind:listener=listener
			v-bind:field=startTemplate
			v-on:listening="fieldIsListening"
			v-on:donelistening="fieldIsDoneListening")
		relation-field(v-if="collectOccurred"
			v-on:registerdata="registerData"
			v-on:unregisterdata="unregisterData"
			v-bind:listener=listener
			v-bind:field=occurTemplate
			v-on:listening="fieldIsListening"
			v-on:donelistening="fieldIsDoneListening")
		relation-field(v-if="collectEnded"
			v-on:registerdata="registerData"
			v-on:unregisterdata="unregisterData"
			v-bind:listener=listener
			v-bind:field=endTemplate
			v-on:listening="fieldIsListening"
			v-on:donelistening="fieldIsDoneListening")
		a(v-on:click="toggleCollectStarted"
			v-bind:class=`{
					'btn': true,
					'btn-xs': true,
					'btn-success': !collectStarted,
					'btn-danger': collectStarted
				}`)
			span(v-bind:class=`{
					'glyphicon': true,
					'glyphicon-calendar': !collectStarted,
					'glyphicon-remove': collectStarted
				}``)  Started
		a(v-on:click="toggleCollectOccurred"
			v-bind:class=`{
					'btn': true,
					'btn-xs': true,
					'btn-success': !collectOccurred,
					'btn-danger': collectOccurred
			}`
		)
			span(v-bind:class=`{
				'glyphicon': true,
				'glyphicon-calendar': !collectOccurred,
				'glyphicon-remove': collectOccurred
			}`) Occurred
		a(v-on:click="toggleCollectEnded"
			v-bind:class=`{
					'btn': true,
					'btn-xs': true,
					'btn-success': !collectEnded,
					'btn-danger': collectEnded
				}`)
			span(v-bind:class=`{
					'glyphicon': true,
					'glyphicon-calendar': !collectEnded,
					'glyphicon-remove': collectEnded
				}`) Ended
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import RelationField from './RelationField.vue';

@Component({
	name: 'RelationDateAssignment',
	components: {
		'relation-field': RelationField,
	},
})
export default class RelationDateAssignment extends Vue {
	@Prop()
	private listner!: any;

	private startTemplate: object = {
		part_field: 'start',
		part_id: -1,
		concept_label: null,
		evidence_required: true,
		description: 'Please indicate the date when this relation began.',
		type: 'DT',
		concept_id: null,
		label: 'Started',
	};

	private endTemplate: object = {
		part_field: 'end',
		part_id: -1,
		concept_label: null,
		evidence_required: true,
		description: 'Please indicate the date when this relation ended.',
		type: 'DT',
		concept_id: null,
		label: 'Ended',
	};

	private occurTemplate: object = {
		part_field: 'occur',
		part_id: -1,
		concept_label: null,
		evidence_required: true,
		description:
			'Please indicate the date when this relation occurred or was true.',
		type: 'DT',
		concept_id: null,
		label: 'Occurred',
	};
	private collectStarted: boolean = false;
	private collectOccurred: boolean = false;
	private collectEnded: boolean = false;

	public toggleCollectStarted() {
		this.collectStarted = !this.collectStarted;
	}

	public toggleCollectOccurred() {
		this.collectOccurred = !this.collectOccurred;
	}

	public toggleCollectEnded() {
		this.collectEnded = !this.collectEnded;
	}

	public fieldIsListening(listeningField: any) {
		this.listner = listeningField;
		// TODO: Change emit to store
		if (listeningField.type === 'CO') {
			this.$store.commit('fieldislisteningfortext');
		}
	}

	public fieldIsDoneListening(listeningField: any) {
		this.listner = null;
		// TODO: Change emit to store
		if (listeningField.type === 'CO') {
			this.$store.commit('fieldisdonelisteningfortext');
		}
	}

	public registerData(field: any, data: any) {
		// TODO: Change emit to store
		this.$store.commit('registerdata', field, data);
	}

	public unregisterData(field: any) {
		// TODO: Change emit to store
		this.$store.commit('unregisterdata', field);
	}
}
</script>
