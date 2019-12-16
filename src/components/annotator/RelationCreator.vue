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
import { Component, Prop, Vue } from 'vue-property-decorator';
@Component({
  name: 'RelationCreator',
  components: {
	'relation-template': RelationTemplate,
	'relation-date-assignment': RelationDateAssignment,
  },
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
  // TODO: possible create interface for this
  private fieldData: object = {};
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
	this.$emit('fieldislisteningfortext');
  }
  public fieldIsDoneListeningForText() {
	// TODO: Change emit to store
	this.$emit('fieldisdonelisteningfortext');
  }
  public registerData(field, data) {
	this.fieldData[this.fieldHash(field)] = data;
	this.ready = this.readyToCreate();
  }
  public unregisterData(field, data) {
	delete this.fieldData[this.fieldHash(field)];
	this.ready = this.readyToCreate();
  }
  public readyToCreate() {
	let ready = true;
	this.fields.forEach((field) => {
		if (self.fieldData[self.fieldHash(field)] === undefined) {
		ready = false;
		}
	});
	return ready;
  }
  // Relation fields don't have unique identifiers, so we create them.
  public fieldHash(field) {
	return [field.part_id, field.part_field].join('.');
  }
  public prepareSubmission() {
	this.fields.forEach((field) => {
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
	this.$emit('cancelrelation');
  }
  public create() {
	this.prepareSubmission();
	// TODO: change to axios
	RelationTemplateResource.create(
		{
		id: this.id,
		},
		{
		fields: this.fields,
		occursIn: this.text.id,
		createdBy: this.user.id,
		project: this.project.id,
		},
	)
		.then((response) => {
		this.ready = false;
		// TODO: Change emit to store
		self.$emit('createdrelation', response.body);
		})
		.catch((error) => {
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