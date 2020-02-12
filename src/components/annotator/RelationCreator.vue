<template lang="pug">
	div.relation-creator
		relation-date-assignment(
			v-on:fieldislisteningfortext="fieldIsListeningForText"
			v-on:fieldisdonelisteningfortext="fieldIsDoneListeningForText"
			v-on:registerdata="registerData"
			v-on:unregisterdata="unregisterData")
		relation-template(
			v-on:fieldislisteningfortext="fieldIsListeningForText"
			v-on:fieldisdonelisteningfortext="fieldIsDoneListeningForText"
			v-on:registerdata="registerData"
			v-on:unregisterdata="unregisterData"
			v-bind:fields="fields"
			v-bind:description="description"
			v-bind:name="name")
		div(v-if="error" class="alert alert-danger alert-xs") Whoops! Something went wrong.
		div.clearfix
			div(v-if="ready" class="pull-right")
				a(v-on:click="create" class="btn btn-xs btn-success") Create
			div
				a(v-on:click="cancel" class="btn btn-xs btn-danger") Cancel
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import RelationDateAssignment from './RelationDateAssignment.vue';
import RelationTemplate from './RelationTemplate.vue';

@Component({
	name: 'RelationCreator',
	components: {
		'relation-template': RelationTemplate,
		'relation-date-assignment': RelationDateAssignment,
	},
})
export default class RelationCreator extends Vue {
	@Prop()
	private text!: any;
	@Prop()
	private project!: any;
	@Prop()
	private user!: any;
	@Prop()
	private template!: any;
	// TODO: possible create interface for this
	private fieldData: any = {};
	private ready: boolean = false;
	private error: boolean = false;
	private start: object | null = null;
	private end: object | null = null;
	private occur: object | null = null;

	get fields() {
		return this.template.fields;
	}

	get description() {
		return this.template.description;
	}

	get name() {
		return this.template.name;
	}

	get id() {
		return this.template.id;
	}

	public fieldIsListeningForText() {
		// TODO: Change emit to store
		this.$store.commit('fieldislisteningfortext');
	}

	public fieldIsDoneListeningForText() {
		// TODO: Change emit to store
		this.$store.commit('fieldisdonelisteningfortext');
	}

	public registerData(field: any, data: any) {
		this.fieldData[this.fieldHash(field)] = data;
		this.ready = this.readyToCreate();
	}

	public unregisterData(field: any, data: any) {
		delete this.fieldData[this.fieldHash(field)];
		this.ready = this.readyToCreate();
	}

	public readyToCreate() {
		const ready = true;
		this.fields.forEach((field: any) => {
			// ToDo: Implement this
			// if (self.fieldData[self.fieldHash(field)] === undefined) {
			// 	ready = false;
			// }
		});
		return ready;
	}

	// Relation fields don't have unique identifiers, so we create them.
	public fieldHash(field: any) {
		return [field.part_id, field.part_field].join('.');
	}

	public prepareSubmission() {
		const self: any = this;
		this.fields.forEach((field: any) => {
			if (field.type === 'TP' || field.type === 'DT') {
				// Open concept; expects appellation.
				field.appellation = self.fieldData[self.fieldHash(field)];
			} else if (field.type === 'CO') {
				// Expects text only.
				const position = self.fieldData[self.fieldHash(field)];
				field.position = {
					occursIn_id: self.text.id,
					position_type: 'CO',
					position_value: [position.startOffset, position.endOffset].join(','),
				};
				field.data = {
					tokenIds: null,
					stringRep: position.representation,
				};
			}
		});
		['start', 'end', 'occur'].forEach((temporalPart) => {
			const key = '-1.' + temporalPart;
			if (key in self.fieldData) {
				self[temporalPart] = self.fieldData[key];
			}
		});
	}

	public cancel() {
		// TODO: Change emit to store
		this.$store.commit('cancelrelation');
	}

	public create() {
		const self = this;
		this.prepareSubmission();
		// TODO: Fix axios call
		this.$axios.post(`/relationtemplate/${this.id}`, {

			fields: this.fields,
			occursIn: this.text.id,
			createdBy: this.user.id,
			project: this.project.id,
		}).then((response: any) => {
			this.ready = false;
			// TODO: Change emit to store
			self.$store.commit('createdrelation', response.body);
		}).catch((error: any) => {
			self.error = true;
			self.ready = false;
		}); // TODO: implement callback and exception handling!!
	}
}
</script>
