<template lang="pug">
	div(id="concept-search" v-on:keyup.enter="search")
		div.form-inline
			div(class="form-group" style="width: 20%;")
				label.sr-only Part of Speech
				select.form-control.input-sm#concept-search-pos(v-model="pos")
					option(value="noun") Noun
					option(value="verb") Verb
					option(value="") Any
			div(class="form-group" style="width: 79%;")
				div(class="input-group input-group-sm" style="width: 100%;")
					input(type="text" class="form-control input-sm"  style="width: 100%;" v-model="query")
					span.input-group-btn
						a(v-if="ready()" class="btn btn-sm glyphicon glyphicon-search" v-on:click="search" style="color: green;")
						span(v-if="searching" class="btn btn-sm glyphicon glyphicon-hourglass" style="color: orange;")
						span(v-if="error" class="btn btn-sm glyphicon glyphicon-exclamation-sign" style="color: red;")
		div
			div.form-group
				div.checkbox
					label
						input(type="checkbox" class="checkbox"  style="width: 100%;" v-model="force")
							Force fresh search
		div(class="list-group concept-search-list-group")
			concept-list-item(
				v-on:selectconcept="selectConcept"
				v-bind:concept=concept
				v-for="concept in concepts")
</template>

<script lang="ts">
// TODO: Convert file to typescript where possible
import { VForm } from '@/interfaces/GlobalTypes';
import { Component, Prop, Vue } from 'vue-property-decorator';
@Component({
  name: 'ConceptSearch',
  components: {
		'concept-list-item': ConceptListItem,
	},
})
export default class ConceptSearch extends Vue {

	private query: string = '';
	private concepts: object[] = [];
	private searching: boolean = false;
	private error: boolean = false;
	private pos: string = '';
	private force: boolean = false;

	private selectConcept(concept) {
		// Clear the concept search results.
		this.concepts = [];
		this.$emit('selectconcept', concept);
	}
	private ready() {
		// TODO: should be able to recover from errors.
		return !(this.searching || this.error);
	}

	private search() {
		this.searching = true; // Instant feedback for the user.

		this.$emit('search', this.searching); // emit search to remove concept picker

		// Asynchronous quries are beautiful.
		let self = this; // Need a closure since Concept is global.
		let payload = {
			search: this.query,
		};
		if (this.pos != '') {
			payload.pos = this.pos;
		}
		if (this.force) {
			payload.force = 'force';
		}
		Concept.search(payload).then(function(response) {
			self.concepts = response.body.results;
			self.searching = false;
		}).catch(function(error) {
			console.log('ConceptSearch:: search failed with', error);
			self.error = true;
			self.searching = false;
		});

	}
}
</script>

<style scoped>

</style>