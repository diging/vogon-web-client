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
import { VForm } from '@/interfaces/GlobalTypes';
import { Component, Vue, Prop } from 'vue-property-decorator';
@Component({
  name: 'RelationCreator',
  components: {
        'relation-template': RelationTemplate,
        'relation-date-assignment': RelationDateAssignment
    }
})
export default class RelationCreator extends Vue {

	@Prop()
	private text!: object;
	@Prop()
	private project!: object;
	@Prop()
	private user!: object;
	@Prop()
	private template!: object;
	//TODO: possible create interface for this
	private field_data: object = {};
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

	fieldIsListeningForText() {
		//TODO: Change emit to store
		this.$emit('fieldislisteningfortext');
	}
	fieldIsDoneListeningForText() {
		//TODO: Change emit to store
		this.$emit('fieldisdonelisteningfortext');
	}
	registerData(field, data) {
		this.field_data[this.fieldHash(field)] = data;
		this.ready = this.readyToCreate();
	}
	unregisterData(field, data) {
		delete(this.field_data[this.fieldHash(field)]);
		this.ready = this.readyToCreate();
	}
	readyToCreate() {
		var ready = true;
		this.fields.forEach(function (field) {
			if (self.field_data[self.fieldHash(field)] == undefined) {
				ready = false;
			}
		})
		return ready;
	}
	// Relation fields don't have unique identifiers, so we create them.
	fieldHash(field) {
		return [field.part_id, field.part_field].join('.');
	}
	prepareSubmission() {
		this.fields.forEach(function (field) {
			if (field.type == "TP" || field.type == 'DT') { // Open concept; expects appellation.
				field.appellation = self.field_data[self.fieldHash(field)];

			} else if (field.type == "CO") { // Expects text only.
				var position = self.field_data[self.fieldHash(field)]
				field.position = {
					occursIn_id: self.text.id,
					position_type: "CO",
					position_value: [position.startOffset,
						position.endOffset
					].join(",")
				};
				field.data = {
					tokenIds: null,
					stringRep: position.representation
				};
			}
		});
		['start', 'end', 'occur'].forEach(function (temporal_part) {
			var key = '-1.' + temporal_part;
			if (key in self.field_data) {
				self[temporal_part] = self.field_data[key];
			}
		});
	}
	cancel() {
		//TODO: Change emit to store
		this.$emit('cancelrelation');
	}
	create() {
		this.prepareSubmission();
		//TODO: change to axios
		RelationTemplateResource.create({
			id: this.id
		}, {
			fields: this.fields,
			occursIn: this.text.id,
			createdBy: this.user.id,
			project: this.project.id
		}).then(function (response) {
			this.ready = false;
			//TODO: Change emit to store
			self.$emit('createdrelation', response.body);
		}).catch(function (error) {
			console.log('RelationTemplateResource:: failed miserably', error);
			self.error = true;
			self.ready = false;
		}); // TODO: implement callback and exception handling!!
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
</style>