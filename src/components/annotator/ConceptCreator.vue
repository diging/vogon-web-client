<template lang="pug">
div.form
	div.form-group
		div.checkbox
			label
				input(type="checkbox" placeholder="" id="concept-creator-oath" v-model="oath")
				I swear that I've searched exhaustively for this concept.
		p.text-muted
			Duplicate concepts really muck up the system, so this is a very important step. If you're
			not sure, search again.
	div.form-group
		label.control-labelName
		input.form-control.input-sm(
			type="text"
			placeholder="This is how other users will find this concept."
			id="concept-creator-name"
			v-model="name")
	div(form-group)
		label.control-label
			Description
		textarea.form-control.input-sm(
			type="text"
			placeholder="Make it easy for other users to identify this concept."
			id="concept-creator-description"
			v-model="description")
	div.form-group
		label.control-label
			Type
		select.form-control.input-sm(
			id="concept-creator-type"
			v-model="conceptType")
			option 
				---
			option(v-for="ctype in conceptTypes" v-bind:value="ctype.uri")
				{{ labelType(ctype) }}
	div.form-group
		label.control-label
			Part of Speech
		select.form-control.input-sm(
			id="concept-creator-pos"
			v-model="pos")
			option(value="noun")
				Noun
			option(value="verb")
				Verb
	div.clearfix(v-if="ready()")
		div.pull-right.btn-group
			a(v-if="ready" class="btn btn-success btn-xs" v-on:click="createConcept")
				Create #[span class="glyphicon glyphicon-grain"]
			span(v-if="submitted" class="btn glyphicon glyphicon-hourglass")
			span(v-if="error" class="btn glyphicon glyphicon-exclamation-sign")
</template>

<script lang="ts">
import { VForm } from '@/interfaces/GlobalTypes';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
@Component({
  name: 'ConceptCreator',
})
export default class ConceptCreator extends Vue {
  private oath: boolean = false;
  private name: string = '';
  private description: string = '';
  private conceptTypes: any[] = [];
  private pos: string = '';
  private conceptType: string = '';
  private error: boolean = false;
  private submitted: boolean = false;

  public mounted() {
	this.UpdateTypes();
  }

  @Watch('name')
  public watchName() {
	this.tryAgain();
  }

  @Watch('description')
  public watchDescription() {
	this.tryAgain();
  }

  @Watch('pos')
  public watchPos() {
	this.tryAgain();
  }

  @Watch('conceptType')
  public watchConceptType() {
	this.tryAgain();
  }

  private ready() {
	return (
		this.oath &&
		this.name.length > 1 &&
		this.description.length > 10 &&
		this.conceptType !== '' &&
		!this.submitted
	);
  }
  private tryAgain() {
	this.submitted = false;
	this.error = false;
  }
  private clear() {
	this.oath = false;
	this.name = '';
	this.description = '';
	this.conceptType = '';
	this.pos = 'noun';
	this.error = false;
	this.submitted = false;
  }
  private createConcept() {
	if (this.ready) {
		this.submitted = true; // Immediately prevent further submissions.
		// TODO: Change to axios
		Concept.save({
		uri: 'generate',
		label: this.name,
		description: this.description,
		pos: this.pos,
		typed: this.conceptType,
		})
		.then(function(response) {
			this.clear();
			// TODO: Get ride of emit
			this.$emit('createdconcept', response.body);
		})
		.catch(function(error) {
			this.error = true;
		});
	}
  }
  private updateTypes() {
	// TODO: change to axios
	ConceptType.query().then(function(response) {
		this.conceptTypes = response.body.results;
	});
  }
  private labelType(ctype) {
	if (ctype.label) {
		return ctype.label;
	} else {
		if (ctype.authority) {
		return ctype.authority.name + ': ' + truncateURI(ctype.uri);
		} else {
		return truncateURI(ctype.uri);
		}
	}
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